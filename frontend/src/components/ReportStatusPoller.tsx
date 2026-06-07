"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "jrr-assessment-form";
const POLL_INTERVAL_MS = 5000;

type Status = "generating" | "generated" | "sent" | "email_failed" | "failed" | "unknown";

interface Props {
  reportId: string;
  email: string;
}

export default function ReportStatusPoller({ reportId, email }: Props) {
  const [status, setStatus] = useState<Status>("generating");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    let stopped = false;

    async function poll() {
      try {
        const res = await fetch(`${apiUrl}/api/assessment/${reportId}/status`);
        if (!res.ok) return;
        const data = await res.json() as { status: string; errorMessage?: string };
        if (stopped) return;

        const s = data.status as Status;
        setStatus(s);

        if (s === "sent") {
          // Report confirmed delivered — safe to clear saved form data
          try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
        }
        if (data.errorMessage) setErrorMessage(data.errorMessage);
      } catch {
        // Network error — keep polling
      }
    }

    poll();
    const id = setInterval(() => {
      if (status === "sent" || status === "failed") return;
      poll();
    }, POLL_INTERVAL_MS);

    return () => { stopped = true; clearInterval(id); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportId]);

  // Stop polling once terminal state reached
  useEffect(() => {
    if (status === "sent" || status === "failed") return;
  }, [status]);

  if (status === "sent") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8 flex items-start gap-3">
        <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <div>
          <p className="text-sm font-semibold text-green-800">Report emailed successfully</p>
          <p className="text-xs text-green-700 mt-0.5">Your report has been sent to <strong>{email}</strong>. Check your inbox (and spam folder).</p>
        </div>
      </div>
    );
  }

  if (status === "email_failed") {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex items-start gap-3">
        <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p className="text-sm font-semibold text-amber-800">Report generated but email delivery failed</p>
          <p className="text-xs text-amber-700 mt-0.5">Your report was created but could not be emailed. Please contact support.</p>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
        <div className="flex items-start gap-3 mb-3">
          <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-red-800">Report generation failed</p>
            <p className="text-xs text-red-700 mt-0.5">
              The AI service encountered an error. Your form data is saved — please try again.
              {errorMessage && <span className="block mt-1 opacity-60">{errorMessage.slice(0, 120)}</span>}
            </p>
          </div>
        </div>
        <Link
          href="/assessment"
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          Try Again →
        </Link>
      </div>
    );
  }

  // generating / generated / unknown — still in progress
  return (
    <div className="bg-[#F3E9F3] border border-[#D4B8D2] rounded-xl p-4 mb-8 flex items-center gap-3">
      <svg className="w-4 h-4 text-[#80367B] animate-spin flex-shrink-0" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      <p className="text-xs text-[#4C215D]">
        {status === "generated" ? "PDF ready — sending email…" : "AI is generating your report…"}
        {" "}This usually takes 1–2 minutes.
      </p>
    </div>
  );
}
