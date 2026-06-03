import { chromium } from "playwright";
import { PDFDocument } from "pdf-lib";
import * as fs from "fs";
import * as path from "path";
import { ReportData } from "./aiService";
import { AssessmentInput, SINGAPORE_GRANTS } from "../prompts/reportPrompt";
import { buildReportSegments, wrapDocument } from "../templates/reportTemplate";

function makeFooterTemplate(label: string, companyName: string): string {
  return `
    <div style="
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 56px;
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 8pt;
      box-sizing: border-box;
    ">
      <span style="color: #94a3b8; font-weight: 500;">${label}</span>
      <span style="color: #64748b; font-weight: 600;">${companyName} · AI Readiness Assessment</span>
    </div>`;
}

export async function generatePdf(
  input: AssessmentInput,
  report: ReportData,
  reportId: string
): Promise<string> {
  const outputDir = process.env.OUTPUT_DIR || path.join(process.cwd(), "outputs");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const safeCompanyName = input.companyName.replace(/[^a-zA-Z0-9]/g, "-").replace(/-+/g, "-");
  const date = new Date().toISOString().slice(0, 10);
  const fileName = `${date}-${safeCompanyName}-AI-Assessment-${reportId.slice(0, 8)}.pdf`;
  const outputPath = path.join(outputDir, fileName);

  const segments = buildReportSegments(input, report, SINGAPORE_GRANTS);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const merged = await PDFDocument.create();

  for (const seg of segments) {
    const html = wrapDocument(seg.bodyHtml, `${input.companyName} — AI Readiness Assessment`);
    await page.setContent(html, { waitUntil: "networkidle" });

    const hasFooter = seg.footerLabel !== null;
    const buf = await page.pdf({
      format: "A4",
      printBackground: true,
      displayHeaderFooter: hasFooter,
      headerTemplate: "<div></div>",
      footerTemplate: hasFooter
        ? makeFooterTemplate(seg.footerLabel!, input.companyName)
        : "<div></div>",
      margin: {
        top: "20px",
        right: "0",
        bottom: hasFooter ? "52px" : "0",
        left: "0",
      },
    });

    const segDoc = await PDFDocument.load(buf);
    const pages = await merged.copyPages(segDoc, segDoc.getPageIndices());
    pages.forEach((p) => merged.addPage(p));
  }

  await browser.close();

  const mergedBytes = await merged.save();
  fs.writeFileSync(outputPath, mergedBytes);

  return outputPath;
}
