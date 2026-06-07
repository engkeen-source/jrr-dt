"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { assessmentSchema, AssessmentFormData } from "@/lib/schema";
import Step1Company from "./steps/Step1Company";
import Step2Challenges from "./steps/Step2Challenges";
import Step3Vision from "./steps/Step3Vision";
import Step4Workforce from "./steps/Step4Workforce";

const STORAGE_KEY = "jrr-assessment-form";

const DEFAULT_VALUES: AssessmentFormData = {
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
};

const LOADING_STEPS = [
  "Analysing business climate trends…",
  "Mapping disruption risks…",
  "Calculating workforce impact…",
  "Compiling Singapore grant opportunities…",
  "Projecting 3-year ROI…",
  "Designing your PDF report…",
];

export default function AssessmentForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [activeStep, setActiveStep] = useState(-1);

  const form = useForm<AssessmentFormData>({
    resolver: zodResolver(assessmentSchema),
    mode: "onTouched",
    defaultValues: DEFAULT_VALUES,
  });

  // Load persisted data on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as AssessmentFormData;
        form.reset(parsed);
        setFormKey((k) => k + 1); // remount Step2/Step3 so chips rehydrate
      }
    } catch {
      // corrupted storage — ignore
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist on every change
  useEffect(() => {
    const sub = form.watch((values) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
      } catch {
        // storage full or unavailable — ignore
      }
    });
    return () => sub.unsubscribe();
  }, [form]);

  // Cycle loading steps for visual feedback
  useEffect(() => {
    if (!isSubmitting) { setActiveStep(-1); return; }
    setActiveStep(0);
    let current = 0;
    const id = setInterval(() => {
      current += 1;
      if (current >= LOADING_STEPS.length) { clearInterval(id); return; }
      setActiveStep(current);
    }, 700);
    return () => clearInterval(id);
  }, [isSubmitting]);

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY);
    form.reset(DEFAULT_VALUES);
    setSubmitError(null);
    setFormKey((k) => k + 1); // remount Step2/Step3 to clear chips
  };

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
        // 409 = duplicate already in progress — send to status page
        if (res.status === 409 && json.existingReportId) {
          router.push(
            `/success?name=${encodeURIComponent(data.contactName)}&company=${encodeURIComponent(data.companyName)}&email=${encodeURIComponent(data.contactEmail)}&reportId=${json.existingReportId}`
          );
          return;
        }
        throw new Error(json.error || "Something went wrong. Please try again.");
      }

      // Do NOT clear localStorage here — the AI is still running in the background.
      // The success page polls /status and clears localStorage only on "sent".

      router.push(
        `/success?name=${encodeURIComponent(data.contactName)}&company=${encodeURIComponent(data.companyName)}&email=${encodeURIComponent(data.contactEmail)}&reportId=${encodeURIComponent(json.reportId)}`
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
            <Step2Challenges key={`step2-${formKey}`} form={form} />
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
            <Step3Vision key={`step3-${formKey}`} form={form} />
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

        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 bg-white border border-[#E3E2EC] hover:border-red-300 hover:text-red-600 text-[#6E7881] font-medium px-6 py-4 rounded-[10px] text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset Form
          </button>

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
        <div className="fixed inset-0 bg-white/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center px-6">
          <div className="text-center w-full max-w-sm">

            {/* Spinning ring + icon */}
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div
                className="absolute inset-0 rounded-full border-4 border-[#E3E2EC] animate-orbit"
                style={{ borderTopColor: "#80367B", borderRightColor: "#FF6D2E" }}
              />
              <div
                className="absolute inset-[6px] rounded-2xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #80367B, #FF6D2E)" }}
              >
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            </div>

            <h3 className="text-[#212529] font-bold text-xl mb-2" style={{ fontFamily: "Lexend, sans-serif" }}>
              Generating Your Report
            </h3>
            <p className="text-[#6E7881] text-sm leading-relaxed mb-6">
              Our AI is analysing your business profile and crafting a personalised consultant-level assessment.
            </p>

            {/* Animated steps */}
            <div className="space-y-2.5 text-left mb-6">
              {LOADING_STEPS.map((step, i) => {
                const done = activeStep > i;
                const active = activeStep === i;
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-3 text-xs transition-colors duration-400 animate-fade-slide-in`}
                    style={{ animationDelay: `${i * 0.12}s`, color: done || active ? "#212529" : "#B7AFAF" }}
                  >
                    <span className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
                      {done ? (
                        <svg className="w-4 h-4 animate-step-tick" style={{ color: "#80367B" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span
                          className={`w-2 h-2 rounded-full ${active ? "animate-pulse" : ""}`}
                          style={{ backgroundColor: active ? "#80367B" : "#E3E2EC" }}
                        />
                      )}
                    </span>
                    <span className={done ? "opacity-40" : ""}>{step}</span>
                  </div>
                );
              })}
            </div>

            {/* Close-tab notice */}
            <div className="bg-[#F3E9F3] border border-[#D4B8D2] rounded-xl p-3.5 flex items-start gap-2.5 text-left">
              <svg className="w-4 h-4 text-[#80367B] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="text-xs text-[#4C215D] leading-relaxed">
                <strong>You can safely close this tab.</strong> Your report is being generated in the background — we&apos;ll email it to you when it&apos;s ready.
              </p>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
