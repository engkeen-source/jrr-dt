"use client";

import { UseFormReturn } from "react-hook-form";
import { AssessmentFormData } from "@/lib/schema";
import FormField, { inputClass } from "../FormField";

interface Props {
  form: UseFormReturn<AssessmentFormData>;
}

export default function Step4Workforce({ form }: Props) {
  const { register, formState: { errors } } = form;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 sm:[grid-template-rows:auto_auto_auto]">
        <FormField
          label="Staff Strength"
          hint="Total number of employees in your company"
          required
          error={errors.staffStrength}
          syncRows
        >
          <input
            {...register("staffStrength")}
            type="number"
            min="1"
            placeholder="e.g. 60"
            className={inputClass}
          />
        </FormField>

        <FormField
          label="Number of Local PMET Staff"
          hint="PMET = Professionals, Managers, Executives, Technicians (Singapore Citizens & PRs only)"
          required
          error={errors.pmetCount}
          syncRows
        >
          <input
            {...register("pmetCount")}
            type="number"
            min="0"
            placeholder="e.g. 15"
            className={inputClass}
          />
        </FormField>
      </div>

      <div className="bg-[#F3E9F3] border border-[#D4B8D2] rounded-lg p-4">
        <p className="text-xs text-[#4C215D] font-semibold mb-1">Why local PMET matters</p>
        <p className="text-xs text-[#6E7881] leading-relaxed">
          Singapore grants such as SFEC, CCP, and JRI are tied to the number of local PMET roles.
          Knowing your local PMET count helps us identify the most relevant funding you can access for upskilling and job redesign.
        </p>
      </div>
    </div>
  );
}
