"use client";

import { UseFormReturn } from "react-hook-form";
import { AssessmentFormData } from "@/lib/schema";
import FormField, { textareaClass } from "../FormField";

const CHALLENGE_EXAMPLES = [
  "High labour costs & staff turnover",
  "Manual, repetitive back-office processes",
  "Difficulty attracting skilled talent",
  "Customer service bottlenecks",
  "Slow order fulfilment / logistics",
  "Inconsistent quality control",
];

interface Props {
  form: UseFormReturn<AssessmentFormData>;
}

export default function Step2Challenges({ form }: Props) {
  const { register, formState: { errors }, setValue, watch } = form;
  const current = watch("currentChallenges");

  const appendExample = (ex: string) => {
    const val = current ? `${current}\n- ${ex}` : `- ${ex}`;
    setValue("currentChallenges", val, { shouldValidate: true });
  };

  return (
    <div className="space-y-5">
      <FormField
        label="What are your top business challenges today?"
        hint="Be as specific as possible — this directly shapes your report's recommendations"
        required
        error={errors.currentChallenges}
      >
        <textarea
          {...register("currentChallenges")}
          rows={7}
          placeholder="e.g. Our biggest challenge is managing high staff turnover in our warehouse team. We lose 2–3 workers per month and training new staff takes 3 weeks. We also struggle with manual order processing that leads to errors…"
          className={textareaClass}
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-slate-600">
            Minimum 30 characters ({(current || "").length} typed)
          </span>
        </div>
      </FormField>

      <div>
        <p className="text-xs text-slate-500 mb-2 font-medium">Common challenges — click to add:</p>
        <div className="flex flex-wrap gap-2">
          {CHALLENGE_EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => appendExample(ex)}
              className="text-xs bg-white/5 border border-white/10 hover:border-blue-600/50 hover:bg-blue-900/20 text-slate-400 hover:text-blue-300 px-3 py-1.5 rounded-lg transition-colors"
            >
              + {ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
