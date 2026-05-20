"use client";

import { UseFormReturn } from "react-hook-form";
import { AssessmentFormData } from "@/lib/schema";
import FormField, { inputClass, textareaClass } from "../FormField";

interface Props {
  form: UseFormReturn<AssessmentFormData>;
}

export default function Step4Workforce({ form }: Props) {
  const { register, formState: { errors }, watch } = form;
  const pmet = parseInt(watch("pmetCount") || "0") || 0;
  const nonPmet = parseInt(watch("nonPmetCount") || "0") || 0;
  const total = pmet + nonPmet;
  const pmetRatio = total > 0 ? Math.round((pmet / total) * 100) : 0;

  return (
    <div className="space-y-5">
      <div className="bg-blue-950/30 border border-blue-900/30 rounded-xl p-4">
        <p className="text-xs text-blue-300 font-semibold mb-1">What is PMET?</p>
        <p className="text-xs text-slate-400 leading-relaxed">
          <strong className="text-slate-300">PMET</strong> = Professionals, Managers, Executives, Technicians.
          These are knowledge-worker roles requiring tertiary education or specialist expertise (e.g. engineers, accountants, sales managers, analysts).
          <br />
          <strong className="text-slate-300">Non-PMET</strong> = Operational and frontline staff (e.g. warehouse workers, drivers, service crew, cleaners).
        </p>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <FormField label="Number of PMET Staff" required error={errors.pmetCount}>
          <input
            {...register("pmetCount")}
            type="number"
            min="0"
            placeholder="e.g. 15"
            className={inputClass}
          />
        </FormField>

        <FormField label="Number of Non-PMET Staff" required error={errors.nonPmetCount}>
          <input
            {...register("nonPmetCount")}
            type="number"
            min="0"
            placeholder="e.g. 45"
            className={inputClass}
          />
        </FormField>
      </div>

      {total > 0 && (
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4">
          <div className="flex justify-between mb-2">
            <span className="text-xs text-slate-400">Workforce composition</span>
            <span className="text-xs text-white font-semibold">{total} total staff</span>
          </div>
          <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
            <div
              className="bg-blue-600 rounded-l-full transition-all"
              style={{ width: `${pmetRatio}%` }}
            />
            <div
              className="bg-slate-600 rounded-r-full transition-all flex-1"
            />
          </div>
          <div className="flex justify-between mt-2 text-xs">
            <span className="text-blue-400">{pmet} PMET ({pmetRatio}%)</span>
            <span className="text-slate-500">{nonPmet} Non-PMET ({100 - pmetRatio}%)</span>
          </div>
        </div>
      )}

      <FormField
        label="What are the key roles / job functions in your company?"
        hint="List your most important positions — e.g. Sales Manager, Warehouse Supervisor, Accountant, Customer Service Officer"
        required
        error={errors.keyRoles}
      >
        <textarea
          {...register("keyRoles")}
          rows={4}
          placeholder="e.g. Operations Manager, Sales Representatives (5), Logistics Coordinators, Customer Service Officers, Finance Executive, Warehouse staff (20)…"
          className={textareaClass}
        />
      </FormField>
    </div>
  );
}
