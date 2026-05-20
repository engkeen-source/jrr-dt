"use client";

import { UseFormReturn } from "react-hook-form";
import { AssessmentFormData } from "@/lib/schema";
import FormField, { textareaClass } from "../FormField";

const ROADBLOCK_EXAMPLES = [
  "Budget / cost of transformation",
  "Staff resistance to change",
  "Lack of in-house tech skills",
  "Legacy systems hard to integrate",
  "Uncertain ROI / hard to justify",
  "Finding the right AI vendor",
];

interface Props {
  form: UseFormReturn<AssessmentFormData>;
}

export default function Step3Vision({ form }: Props) {
  const { register, formState: { errors }, setValue, watch } = form;
  const roadblocks = watch("roadblocks");

  const appendRoadblock = (ex: string) => {
    const val = roadblocks ? `${roadblocks}\n- ${ex}` : `- ${ex}`;
    setValue("roadblocks", val, { shouldValidate: true });
  };

  return (
    <div className="space-y-5">
      <FormField
        label="Where do you want your business to be in 3–5 years?"
        hint="Describe your ideal future state — what does success look like with AI?"
        required
        error={errors.envisionedState}
      >
        <textarea
          {...register("envisionedState")}
          rows={5}
          placeholder="e.g. In 3 years, I want our warehouse operations to run with 30% fewer manual errors, our customer service team to handle 3x more enquiries, and my managers to spend more time on strategy instead of firefighting…"
          className={textareaClass}
        />
      </FormField>

      <FormField
        label="What roadblocks do you foresee to AI/digital transformation?"
        hint="Understanding barriers helps us tailor practical, achievable recommendations"
        required
        error={errors.roadblocks}
      >
        <textarea
          {...register("roadblocks")}
          rows={4}
          placeholder="e.g. Our main concern is staff buy-in — some employees are afraid AI will replace their jobs. We also have a limited budget and our existing ERP is 10 years old…"
          className={textareaClass}
        />
      </FormField>

      <div>
        <p className="text-xs text-slate-500 mb-2 font-medium">Common roadblocks — click to add:</p>
        <div className="flex flex-wrap gap-2">
          {ROADBLOCK_EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => appendRoadblock(ex)}
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
