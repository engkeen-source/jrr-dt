"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { assessmentSchema, AssessmentFormData } from "@/lib/schema";
import Step1Company from "./steps/Step1Company";
import Step2Challenges from "./steps/Step2Challenges";
import Step3Vision from "./steps/Step3Vision";
import Step4Workforce from "./steps/Step4Workforce";

export default function AssessmentForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<AssessmentFormData>({
    resolver: zodResolver(assessmentSchema),
    mode: "onTouched",
    defaultValues: {
      companyName: "",
      companyWebsite: "",
      industry: "",
      contactName: "",
      contactEmail: "",
      currentChallenges: "",
      envisionedState: "",
      roadblocks: "",
      staffStrength: "",
      pmetCount: "0",
    },
  });

  const onSubmit = async (data: AssessmentFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

    try {
      const res = await fetch(`${apiUrl}/api/assessment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          staffStrength: parseInt(data.staffStrength),
          pmetCount: parseInt(data.pmetCount),
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Something went wrong. Please try again.");
      }

      router.push(
        `/success?name=${encodeURIComponent(data.contactName)}&company=${encodeURIComponent(data.companyName)}&email=${encodeURIComponent(data.contactEmail)}`
      );
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "An unexpected error occurred.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

        {/* Section 1 — Company */}
        <div className="bg-white border border-[#E3E2EC] rounded-xl overflow-hidden shadow-sm">
          <div className="px-8 py-5 border-b border-[#E3E2EC]" style={{ background: "#80367B" }}>
            <h2 className="text-white font-bold text-lg" style={{ fontFamily: "Lexend, sans-serif" }}>
              Company Information
            </h2>
            <p className="text-white/80 text-xs mt-1">Your basic company details</p>
          </div>
          <div className="p-8">
            <Step1Company form={form} />
          </div>
        </div>

        {/* Section 2 — Challenges */}
        <div className="bg-white border border-[#E3E2EC] rounded-xl overflow-hidden shadow-sm">
          <div className="px-8 py-5 border-b border-[#E3E2EC] bg-[#F3E9F3]">
            <h2 className="text-[#4C215D] font-bold text-lg" style={{ fontFamily: "Lexend, sans-serif" }}>
              Current Business Challenges
            </h2>
            <p className="text-[#80367B] text-xs mt-1">Help us understand what you&apos;re facing today</p>
          </div>
          <div className="p-8">
            <Step2Challenges form={form} />
          </div>
        </div>

        {/* Section 3 — Vision & AI Challenges */}
        <div className="bg-white border border-[#E3E2EC] rounded-xl overflow-hidden shadow-sm">
          <div className="px-8 py-5 border-b border-[#E3E2EC] bg-[#F3E9F3]">
            <h2 className="text-[#4C215D] font-bold text-lg" style={{ fontFamily: "Lexend, sans-serif" }}>
              Your Vision &amp; AI Transformation
            </h2>
            <p className="text-[#80367B] text-xs mt-1">Where you want to go, and what might get in the way</p>
          </div>
          <div className="p-8">
            <Step3Vision form={form} />
          </div>
        </div>

        {/* Section 4 — Workforce */}
        <div className="bg-white border border-[#E3E2EC] rounded-xl overflow-hidden shadow-sm">
          <div className="px-8 py-5 border-b border-[#E3E2EC] bg-[#F3E9F3]">
            <h2 className="text-[#4C215D] font-bold text-lg" style={{ fontFamily: "Lexend, sans-serif" }}>
              Workforce Profile
            </h2>
            <p className="text-[#80367B] text-xs mt-1">Your current staff composition</p>
          </div>
          <div className="p-8">
            <Step4Workforce form={form} />
          </div>
        </div>

        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm">
            {submitError}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-[#8B42A8] hover:bg-[#2691CD] text-white font-semibold px-10 py-4 rounded-[10px] text-base transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generating Report…
              </>
            ) : (
              <>
                Generate My Report
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Generating overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
          <div className="text-center max-w-sm px-6">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse"
              style={{ background: "linear-gradient(135deg, #80367B, #FF6D2E)" }}
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-[#212529] font-bold text-xl mb-3" style={{ fontFamily: "Lexend, sans-serif" }}>
              Generating Your Report
            </h3>
            <p className="text-[#6E7881] text-sm leading-relaxed mb-6">
              Our AI is analysing your business profile and crafting a personalised consultant-level assessment. This takes about 30–60 seconds.
            </p>
            <div className="space-y-2 text-left">
              {[
                "Analysing business climate trends…",
                "Mapping disruption risks…",
                "Calculating workforce impact…",
                "Compiling Singapore grant opportunities…",
                "Projecting 3-year ROI…",
                "Designing your PDF report…",
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3 text-xs text-[#6E7881]">
                  <div
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ backgroundColor: "#80367B", animationDelay: `${i * 0.3}s` }}
                  />
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
