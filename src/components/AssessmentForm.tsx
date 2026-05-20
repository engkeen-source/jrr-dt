"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { assessmentSchema, AssessmentFormData, STEPS } from "@/lib/schema";
import Step1Company from "./steps/Step1Company";
import Step2Challenges from "./steps/Step2Challenges";
import Step3Vision from "./steps/Step3Vision";
import Step4Workforce from "./steps/Step4Workforce";
import Step5Review from "./steps/Step5Review";

const STEP_FIELDS: Record<number, (keyof AssessmentFormData)[]> = {
  1: ["companyName", "companyWebsite", "industry", "contactName", "contactEmail"],
  2: ["currentChallenges"],
  3: ["envisionedState", "roadblocks"],
  4: ["pmetCount", "nonPmetCount", "keyRoles"],
  5: [],
};

export default function AssessmentForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
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
      pmetCount: "0",
      nonPmetCount: "0",
      keyRoles: "",
    },
  });

  const handleNext = async () => {
    const fields = STEP_FIELDS[currentStep];
    const valid = await form.trigger(fields);
    if (valid) setCurrentStep((s) => Math.min(s + 1, STEPS.length));
  };

  const handleBack = () => setCurrentStep((s) => Math.max(s - 1, 1));

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
          pmetCount: parseInt(data.pmetCount),
          nonPmetCount: parseInt(data.nonPmetCount),
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

  const progressPct = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Step indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          {STEPS.map((step) => (
            <div key={step.id} className="flex items-center gap-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  step.id < currentStep
                    ? "bg-blue-600 text-white"
                    : step.id === currentStep
                    ? "bg-white text-[#060B1E] shadow-lg shadow-blue-900/30"
                    : "bg-white/10 text-slate-500"
                }`}
              >
                {step.id < currentStep ? (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.id
                )}
              </div>
              <span
                className={`hidden sm:block text-xs font-medium transition-colors ${
                  step.id === currentStep ? "text-white" : "text-slate-600"
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-violet-600 rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-slate-500">Step {currentStep} of {STEPS.length}</span>
          <span className="text-xs text-slate-500">{Math.round(progressPct)}% complete</span>
        </div>
      </div>

      {/* Form card */}
      <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#0d1b4b] to-[#0a2468] px-8 py-5 border-b border-white/5">
          <h2 className="text-white font-bold text-lg">
            {STEPS[currentStep - 1].title}
          </h2>
          <p className="text-blue-300 text-xs mt-1">
            {currentStep === 1 && "Your basic company details"}
            {currentStep === 2 && "Help us understand what you're facing today"}
            {currentStep === 3 && "Where you want to go, and what might stop you"}
            {currentStep === 4 && "Your current workforce composition"}
            {currentStep === 5 && "Please review before we generate your report"}
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="p-8">
          {currentStep === 1 && <Step1Company form={form} />}
          {currentStep === 2 && <Step2Challenges form={form} />}
          {currentStep === 3 && <Step3Vision form={form} />}
          {currentStep === 4 && <Step4Workforce form={form} />}
          {currentStep === 5 && <Step5Review form={form} />}

          {submitError && (
            <div className="mt-6 bg-red-950/50 border border-red-800/50 rounded-lg px-4 py-3 text-red-300 text-sm">
              {submitError}
            </div>
          )}

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
              </svg>
              Back
            </button>

            {currentStep < STEPS.length ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all"
              >
                Continue
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-8 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-blue-900/30"
              >
                {isSubmitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Generating Report…
                  </>
                ) : (
                  <>
                    Generate My Report
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Generating overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-[#060B1E]/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
          <div className="text-center max-w-sm px-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center mx-auto mb-6 animate-pulse">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-white font-bold text-xl mb-3">
              Generating Your Report
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Our AI is analysing your business profile and crafting a personalised consultant-level assessment. This takes about 30–60 seconds.
            </p>
            <div className="space-y-2 text-left">
              {[
                "Analysing industry trends…",
                "Mapping disruption risks…",
                "Calculating workforce impact…",
                "Compiling grant opportunities…",
                "Projecting 3-year ROI…",
                "Designing your PDF report…",
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3 text-xs text-slate-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
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
