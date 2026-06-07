import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { createHash } from "crypto";
import { AssessmentInput } from "../prompts/reportPrompt";
import { ReportData } from "./aiService";

// ── Singleton client (lazy) ──────────────────────────────────────────────────

let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient | null {
  if (_client) return _client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return null;
  }

  _client = createClient(url, key, { auth: { persistSession: false } });
  return _client;
}

// ── Errors ───────────────────────────────────────────────────────────────────

export class DuplicateSubmissionError extends Error {
  constructor(public readonly existingReportId: string) {
    super("A report for this exact submission is already in progress or completed.");
    this.name = "DuplicateSubmissionError";
  }
}

// ── Types ────────────────────────────────────────────────────────────────────

export interface ReportPatch {
  status?: "generating" | "generated" | "sent" | "email_failed" | "failed";
  report_data?: ReportData;
  pdf_file_name?: string;
  email_sent_at?: string;
  error_message?: string;
}

// ── Hash ─────────────────────────────────────────────────────────────────────

/** SHA-256 of all form fields — used to detect identical re-submissions. */
function computeSubmissionHash(input: AssessmentInput): string {
  const payload = [
    input.companyName.toLowerCase().trim(),
    input.companyWebsite.toLowerCase().trim(),
    input.industry.toLowerCase().trim(),
    input.contactName.toLowerCase().trim(),
    input.contactEmail.toLowerCase().trim(),
    input.currentChallenges.trim(),
    input.envisionedState.trim(),
    input.roadblocks.trim(),
    String(input.staffStrength),
    String(input.pmetCount),
  ].join("|");

  return createHash("sha256").update(payload).digest("hex");
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Ensure exactly one row per submission hash exists.
 *
 * - No existing row → insert new row, return the provided reportId.
 * - Existing row with status='failed' → reset it to 'generating', return its id
 *   so the caller uses that id for all subsequent updates.
 * - Existing row with any other status → throw DuplicateSubmissionError.
 *
 * All Supabase I/O errors (other than the duplicate signal) are logged and
 * swallowed so they never break report generation.
 *
 * Returns the reportId that should be used for the rest of this request.
 */
export async function createReportRow(
  reportId: string,
  input: AssessmentInput
): Promise<string> {
  const client = getClient();
  if (!client) {
    console.warn(`[${reportId}] Supabase not configured — skipping DB insert.`);
    return reportId;
  }

  const hash = computeSubmissionHash(input);

  // ── Check for existing row with same hash (any status) ───────────────────
  try {
    const { data: existing } = await client
      .from("jrr_dt_reports")
      .select("id, status, updated_at")
      .eq("submission_hash", hash)
      .limit(1);

    if (existing && existing.length > 0) {
      const row = existing[0] as { id: string; status: string; updated_at: string };
      const STALE_MS = 10 * 60 * 1000; // 10 minutes
      const isStale =
        row.status === "generating" &&
        Date.now() - new Date(row.updated_at).getTime() > STALE_MS;

      if (row.status === "failed" || isStale) {
        // Previous attempt failed or server crashed mid-flight — reuse the same row
        const { error } = await client
          .from("jrr_dt_reports")
          .update({ status: "generating", error_message: null })
          .eq("id", row.id);

        if (error) {
          console.error(`[${row.id}] Supabase reset row error:`, error.message);
        } else {
          console.log(`[${row.id}] Supabase row reset to generating (${isStale ? "stale" : "retry"}).`);
        }
        return row.id;
      }

      // Active non-stale row — true duplicate
      throw new DuplicateSubmissionError(row.id);
    }
  } catch (err) {
    if (err instanceof DuplicateSubmissionError) throw err;
    console.error(`[${reportId}] Supabase duplicate check threw:`, err);
    // Non-fatal: proceed with insert if check itself fails
  }

  // ── Insert new row ───────────────────────────────────────────────────────
  try {
    const { error } = await client.from("jrr_dt_reports").insert({
      id: reportId,
      status: "generating",
      submission_hash: hash,
      company_name: input.companyName,
      company_website: input.companyWebsite,
      industry: input.industry,
      contact_name: input.contactName,
      contact_email: input.contactEmail,
      current_challenges: input.currentChallenges,
      envisioned_state: input.envisionedState,
      roadblocks: input.roadblocks,
      staff_strength: input.staffStrength,
      pmet_count: input.pmetCount,
    });

    if (error) {
      console.error(`[${reportId}] Supabase insert error:`, error.message);
    } else {
      console.log(`[${reportId}] Supabase row created (status=generating).`);
    }
  } catch (err) {
    console.error(`[${reportId}] Supabase insert threw:`, err);
  }

  return reportId;
}

export interface ReportStatus {
  status: string;
  emailSentAt?: string;
  errorMessage?: string;
}

/**
 * Fetch the current status of a report row. Returns null if not found or
 * Supabase is not configured.
 */
export async function getReportStatus(reportId: string): Promise<ReportStatus | null> {
  const client = getClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from("jrr_dt_reports")
      .select("status, email_sent_at, error_message")
      .eq("id", reportId)
      .single();

    if (error || !data) return null;

    return {
      status: data.status as string,
      emailSentAt: data.email_sent_at as string | undefined,
      errorMessage: data.error_message as string | undefined,
    };
  } catch {
    return null;
  }
}

/**
 * Update an existing report row by id.
 * Never throws — Supabase errors are logged and swallowed.
 */
export async function updateReportRow(
  reportId: string,
  patch: ReportPatch
): Promise<void> {
  const client = getClient();
  if (!client) return;

  try {
    const { error } = await client
      .from("jrr_dt_reports")
      .update(patch)
      .eq("id", reportId);

    if (error) {
      console.error(`[${reportId}] Supabase update error:`, error.message);
    } else {
      console.log(`[${reportId}] Supabase row updated (status=${patch.status ?? "—"}).`);
    }
  } catch (err) {
    console.error(`[${reportId}] Supabase update threw:`, err);
  }
}
