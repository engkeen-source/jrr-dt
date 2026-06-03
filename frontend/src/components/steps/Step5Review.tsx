"use client";

import { UseFormReturn } from "react-hook-form";
import { AssessmentFormData } from "@/lib/schema";

interface Props {
  form: UseFormReturn<AssessmentFormData>;
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4 py-3 border-b border-[#E3E2EC] last:border-0">
      <span className="text-xs text-[#6E7881] w-36 flex-shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-[#212529] flex-1 leading-relaxed">{value || "—"}</span>
    </div>
  );
}

export default function Step5Review({ form }: Props) {
  const data = form.getValues();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xs font-semibold text-[#6E7881] uppercase tracking-widest mb-3">Company Details</h3>
        <div className="bg-[#F5F5F5] border border-[#E3E2EC] rounded-lg px-4">
          <ReviewRow label="Company" value={data.companyName} />
          <ReviewRow label="Website" value={data.companyWebsite} />
          <ReviewRow label="Industry" value={data.industry} />
          <ReviewRow label="Contact Name" value={data.contactName} />
          <ReviewRow label="Email" value={data.contactEmail} />
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-[#6E7881] uppercase tracking-widest mb-3">Business Context</h3>
        <div className="bg-[#F5F5F5] border border-[#E3E2EC] rounded-lg px-4">
          <ReviewRow label="Challenges" value={data.currentChallenges} />
          <ReviewRow label="Vision" value={data.envisionedState} />
          <ReviewRow label="Anticipated Challenges" value={data.roadblocks} />
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-[#6E7881] uppercase tracking-widest mb-3">Workforce</h3>
        <div className="bg-[#F5F5F5] border border-[#E3E2EC] rounded-lg px-4">
          <ReviewRow label="Staff Strength" value={data.staffStrength} />
          <ReviewRow label="Local PMET Staff" value={data.pmetCount} />
        </div>
      </div>
    </div>
  );
}
