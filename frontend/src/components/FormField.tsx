"use client";

import { ReactNode } from "react";
import { FieldError } from "react-hook-form";

interface FormFieldProps {
  label: string;
  hint?: string;
  error?: FieldError;
  required?: boolean;
  children: ReactNode;
  syncRows?: boolean;
}

export default function FormField({
  label,
  hint,
  error,
  required,
  children,
  syncRows,
}: FormFieldProps) {
  const errorNode = error && (
    <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
      <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      {error.message}
    </p>
  );

  if (syncRows) {
    return (
      <div className="sm:row-span-3 sm:grid sm:[grid-template-rows:subgrid]">
        <label className="block text-sm font-medium text-[#212529] mb-1.5 sm:mb-0 sm:self-end sm:pb-1.5">
          {label}
          {required && <span className="text-[#80367B] ml-1">*</span>}
        </label>
        <div className={hint ? "mb-1.5 sm:mb-0 sm:pb-1.5" : "hidden sm:block"}>
          {hint && <p className="text-xs text-[#6E7881]">{hint}</p>}
        </div>
        <div>
          {children}
          {errorNode}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-[#212529]">
        {label}
        {required && <span className="text-[#80367B] ml-1">*</span>}
      </label>
      {hint && <p className="text-xs text-[#6E7881] -mt-0.5">{hint}</p>}
      {children}
      {errorNode}
    </div>
  );
}

export const inputClass =
  "w-full bg-white border border-[#E3E2EC] focus:border-[#80367B] focus:ring-2 focus:ring-[#80367B]/10 text-[#212529] placeholder-[#B7AFAF] placeholder:text-center rounded-2xl px-5 py-4 text-sm transition-colors";

export const textareaClass =
  "w-full bg-white border border-[#E3E2EC] focus:border-[#80367B] focus:ring-2 focus:ring-[#80367B]/10 text-[#212529] placeholder-[#B7AFAF] placeholder:text-center rounded-2xl px-5 py-4 text-sm transition-colors resize-none";

export const selectClass =
  "w-full bg-white border border-[#E3E2EC] focus:border-[#80367B] focus:ring-2 focus:ring-[#80367B]/10 text-[#212529] rounded-2xl px-5 py-4 text-sm transition-colors appearance-none cursor-pointer";
