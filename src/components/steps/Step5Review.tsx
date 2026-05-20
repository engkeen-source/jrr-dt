"use client";

import { UseFormReturn } from "react-hook-form";
import { AssessmentFormData } from "@/lib/schema";

interface Props {
  form: UseFormReturn<AssessmentFormData>;
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4 py-3 border-b border-white/5 last:border-0">
      <span className="text-xs text-slate-500 w-36 flex-shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-white flex-1 leading-relaxed">{value || "—"}</span>
    </div>
  );
}

export default function Step5Review({ form }: Props) {
  const data = form.getValues();
  const total = (parseInt(data.pmetCount) || 0) + (parseInt(data.nonPmetCount) || 0);

  return (
    <div className="space-y-6">
      <div className="bg-green-950/30 border border-green-800/30 rounded-xl p-4 flex gap-3">
        <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p className="text-sm text-green-300 font-semibold">You&apos;re all set!</p>
          <p className="text-xs text-green-400/70 mt-0.5 leading-relaxed">
            Review your information below. Your personalised AI Readiness Report will be sent to <strong>{data.contactEmail}</strong> once generated.
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Company Details</h3>
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl px-4">
          <ReviewRow label="Company" value={data.companyName} />
          <ReviewRow label="Website" value={data.companyWebsite} />
          <ReviewRow label="Industry" value={data.industry} />
          <ReviewRow label="Contact Name" value={data.contactName} />
          <ReviewRow label="Email" value={data.contactEmail} />
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Business Context</h3>
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl px-4">
          <ReviewRow label="Challenges" value={data.currentChallenges} />
          <ReviewRow label="Vision" value={data.envisionedState} />
          <ReviewRow label="Roadblocks" value={data.roadblocks} />
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Workforce</h3>
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl px-4">
          <ReviewRow label="PMET Staff" value={data.pmetCount} />
          <ReviewRow label="Non-PMET Staff" value={data.nonPmetCount} />
          <ReviewRow label="Total Staff" value={String(total)} />
          <ReviewRow label="Key Roles" value={data.keyRoles} />
        </div>
      </div>

      <div className="text-xs text-slate-600 text-center leading-relaxed">
        By submitting, you consent to receiving your AI assessment report via email.
        Your data is used only to generate this report.
      </div>
    </div>
  );
}
