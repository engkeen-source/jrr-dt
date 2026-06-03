"use client";

import { UseFormReturn } from "react-hook-form";
import { AssessmentFormData, INDUSTRIES } from "@/lib/schema";
import FormField, { inputClass, selectClass } from "../FormField";

interface Props {
  form: UseFormReturn<AssessmentFormData>;
}

export default function Step1Company({ form }: Props) {
  const { register, formState: { errors } } = form;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FormField label="Company Name" required error={errors.companyName}>
          <input
            {...register("companyName")}
            placeholder="e.g. Acme Pte Ltd"
            className={inputClass}
          />
        </FormField>

        <FormField label="Company Website" required error={errors.companyWebsite}>
          <input
            {...register("companyWebsite")}
            placeholder="e.g. www.acme.com.sg"
            className={inputClass}
          />
        </FormField>
      </div>

      <FormField label="Industry / Sector" required error={errors.industry}>
        <div className="relative">
          <select {...register("industry")} className={selectClass}>
            <option value="" disabled>Select your industry…</option>
            {INDUSTRIES.map((ind) => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
            <svg className="w-4 h-4 text-[#6E7881]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FormField label="Contact Person Name" required error={errors.contactName}>
          <input
            {...register("contactName")}
            placeholder="e.g. John Tan"
            className={inputClass}
          />
        </FormField>

        <FormField
          label="Contact Email"
          required
          hint="Your PDF report will be sent here"
          error={errors.contactEmail}
        >
          <input
            {...register("contactEmail")}
            type="email"
            placeholder="e.g. john@acme.com.sg"
            className={inputClass}
          />
        </FormField>
      </div>

      <div className="bg-[#F3E9F3] border border-[#D4B8D2] rounded-lg p-4 flex gap-3 items-start">
        <svg className="w-4 h-4 text-[#80367B] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-xs text-[#4C215D] leading-relaxed">
          Your report will be personalised based on the information you provide. The more specific you are, the more actionable your assessment will be.
        </p>
      </div>
    </div>
  );
}
