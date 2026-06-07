import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { generateReport } from "../services/aiService";
import { generatePdf } from "../services/pdfService";
import { sendReportEmail } from "../services/emailService";
import { createReportRow, updateReportRow, getReportStatus, DuplicateSubmissionError } from "../services/supabaseService";
import { AssessmentInput } from "../prompts/reportPrompt";
import * as path from "path";
import * as fs from "fs";

const router = Router();

function validateInput(body: Record<string, unknown>): AssessmentInput {
  const required = [
    "companyName",
    "companyWebsite",
    "industry",
    "contactName",
    "contactEmail",
    "currentChallenges",
    "envisionedState",
    "roadblocks",
  ];
  for (const field of required) {
    if (!body[field] || String(body[field]).trim() === "") {
      throw new Error(`Missing required field: ${field}`);
    }
  }
  return {
    companyName: String(body.companyName).trim(),
    companyWebsite: String(body.companyWebsite).trim(),
    industry: String(body.industry).trim(),
    contactName: String(body.contactName).trim(),
    contactEmail: String(body.contactEmail).trim(),
    currentChallenges: String(body.currentChallenges).trim(),
    envisionedState: String(body.envisionedState).trim(),
    roadblocks: String(body.roadblocks).trim(),
    staffStrength: Math.max(1, parseInt(String(body.staffStrength || "1"), 10) || 1),
    pmetCount: Math.max(0, parseInt(String(body.pmetCount || "0"), 10) || 0),
  };
}

async function processReportBackground(reportId: string, input: AssessmentInput): Promise<void> {
  try {
    // 1. AI generation
    console.log(`[${reportId}] Generating AI report...`);
    const reportData = await generateReport(input);
    console.log(`[${reportId}] AI generation complete.`);

    // 2. PDF generation
    console.log(`[${reportId}] Generating PDF...`);
    const pdfPath = await generatePdf(input, reportData, reportId);
    console.log(`[${reportId}] PDF saved: ${pdfPath}`);

    await updateReportRow(reportId, {
      status: "generated",
      report_data: reportData,
      pdf_file_name: path.basename(pdfPath),
    });

    // 3. Email
    try {
      console.log(`[${reportId}] Sending email to ${input.contactEmail}...`);
      await sendReportEmail(input.contactEmail, input.contactName, input.companyName, pdfPath);
      console.log(`[${reportId}] Email sent.`);
      await updateReportRow(reportId, { status: "sent", email_sent_at: new Date().toISOString() });
    } catch (emailErr) {
      console.error(`[${reportId}] Email failed (non-fatal):`, emailErr);
      await updateReportRow(reportId, { status: "email_failed", error_message: String(emailErr) });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[${reportId}] Background processing failed:`, message);
    await updateReportRow(reportId, { status: "failed", error_message: message });
  }
}

router.post("/", async (req: Request, res: Response): Promise<void> => {
  const reportId = uuidv4();

  try {
    const input = validateInput(req.body as Record<string, unknown>);
    console.log(`[${reportId}] Assessment request for: ${input.companyName}`);

    // Persist initial row — may return a different id if reusing a failed row
    const activeReportId = await createReportRow(reportId, input);

    // Respond immediately — processing continues in the background
    res.status(202).json({
      success: true,
      reportId: activeReportId,
      message: `Report is being generated and will be emailed to ${input.contactEmail}`,
    });

    // Fire and forget — deliberately not awaited
    processReportBackground(activeReportId, input);
  } catch (err) {
    if (!res.headersSent) {
      if (err instanceof DuplicateSubmissionError) {
        console.warn(`[${reportId}] Duplicate submission detected — existing report: ${err.existingReportId}`);
        res.status(409).json({
          success: false,
          error: err.message,
          existingReportId: err.existingReportId,
        });
        return;
      }
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error(`[${reportId}] Request error:`, message);
      await updateReportRow(reportId, { status: "failed", error_message: message });
      res.status(500).json({ success: false, error: message, reportId });
    }
  }
});

router.get("/:reportId/status", async (req: Request, res: Response): Promise<void> => {
  const { reportId } = req.params;
  const result = await getReportStatus(reportId);
  if (!result) {
    res.status(404).json({ error: "Report not found" });
    return;
  }
  res.json(result);
});

router.get("/:reportId/download", (req: Request, res: Response): void => {
  const outputDir = process.env.OUTPUT_DIR || path.join(process.cwd(), "outputs");
  const { reportId } = req.params;

  const files = fs.readdirSync(outputDir).filter((f) => f.includes(reportId.slice(0, 8)));
  if (files.length === 0) {
    res.status(404).json({ error: "Report not found" });
    return;
  }

  const filePath = path.join(outputDir, files[0]);
  res.download(filePath);
});

export default router;
