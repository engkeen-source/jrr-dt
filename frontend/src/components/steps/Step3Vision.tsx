"use client";

import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { AssessmentFormData, AI_CHALLENGE_OPTIONS } from "@/lib/schema";
import FormField, { textareaClass } from "../FormField";

interface Props {
  form: UseFormReturn<AssessmentFormData>;
}

function serialize(selected: string[], other: string): string {
  const parts = [...selected];
  if (other.trim()) parts.push(other.trim());
  return parts.join("; ");
}

function parsePersistedValue(raw: string, options: string[]): { selected: string[]; other: string } {
  if (!raw) return { selected: [], other: "" };
  const parts = raw.split("; ");
  const selected = parts.filter((p) => options.includes(p));
  const other = parts.filter((p) => !options.includes(p)).join("; ");
  return { selected, other };
}

export default function Step3Vision({ form }: Props) {
  const { register, setValue, formState: { errors } } = form;
  const [selected, setSelected] = useState<string[]>(() =>
    parsePersistedValue(form.getValues("roadblocks"), AI_CHALLENGE_OPTIONS).selected
  );
  const [other, setOther] = useState<string>(() =>
    parsePersistedValue(form.getValues("roadblocks"), AI_CHALLENGE_OPTIONS).other
  );

  const toggle = (opt: string) => {
    const next = selected.includes(opt)
      ? selected.filter((s) => s !== opt)
      : [...selected, opt];
    setSelected(next);
    setValue("roadblocks", serialize(next, other), { shouldValidate: true });
  };

  const onOtherChange = (val: string) => {
    setOther(val);
    setValue("roadblocks", serialize(selected, val), { shouldValidate: true });
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
          rows={4}
          placeholder="e.g. In 3 years, I want our warehouse operations to run with 30% fewer manual errors, our customer service team to handle 3x more enquiries, and my managers to spend more time on strategy instead of firefighting…"
          className={textareaClass}
        />
      </FormField>

      <FormField
        label="What challenges do you foresee to AI / digital transformation?"
        hint="Select all that apply — helps us tailor practical, achievable recommendations"
        required
        error={errors.roadblocks}
      >
        <div className="flex flex-wrap gap-2 mt-2">
          {AI_CHALLENGE_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              className={`text-sm px-4 py-2 rounded-lg border transition-all cursor-pointer ${
                selected.includes(opt)
                  ? "bg-[#80367B] border-[#80367B] text-white font-medium shadow-sm"
                  : "bg-white border-[#E3E2EC] text-[#212529] hover:border-[#80367B] hover:text-[#80367B]"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </FormField>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-[#212529]">
          Others — describe in your own words
        </label>
        <p className="text-xs text-[#6E7881]">Any challenges not listed above</p>
        <textarea
          value={other}
          onChange={(e) => onOtherChange(e.target.value)}
          rows={2}
          placeholder="e.g. Our main concern is staff buy-in — some employees are worried about AI replacing their jobs…"
          className={textareaClass}
        />
      </div>
    </div>
  );
}
