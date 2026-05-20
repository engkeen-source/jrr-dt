"use client";

import { ReactNode } from "react";
import { FieldError } from "react-hook-form";

interface FormFieldProps {
  label: string;
  hint?: string;
  error?: FieldError;
  required?: boolean;
  children: ReactNode;
}

export default function FormField({
  label,
  hint,
  error,
  required,
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-200">
        {label}
        {required && <span className="text-blue-400 ml-1">*</span>}
      </label>
      {hint && <p className="text-xs text-slate-500 -mt-0.5">{hint}</p>}
      {children}
      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
          <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error.message}
        </p>
      )}
    </div>
  );
}

export const inputClass =
  "w-full bg-white/5 border border-white/10 focus:border-blue-500 focus:bg-white/[0.07] text-white placeholder-slate-600 rounded-xl px-4 py-3 text-sm transition-colors";

export const textareaClass =
  "w-full bg-white/5 border border-white/10 focus:border-blue-500 focus:bg-white/[0.07] text-white placeholder-slate-600 rounded-xl px-4 py-3 text-sm transition-colors resize-none";

export const selectClass =
  "w-full bg-[#0d1b4b] border border-white/10 focus:border-blue-500 text-white rounded-xl px-4 py-3 text-sm transition-colors appearance-none cursor-pointer";
