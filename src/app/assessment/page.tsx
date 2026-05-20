import Link from "next/link";
import AssessmentForm from "@/components/AssessmentForm";

export const metadata = {
  title: "AI Readiness Assessment | WAF",
};

export default function AssessmentPage() {
  return (
    <main className="grid-bg min-h-screen">
      {/* Header */}
      <header className="border-b border-white/5 backdrop-blur-sm sticky top-0 z-40 bg-[#060B1E]/80">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-bold text-sm">
              AI
            </div>
            <span className="text-sm font-semibold text-white tracking-wide">
              WAF · AI Assessment
            </span>
          </Link>
          <div className="text-xs text-slate-500">
            Free · Takes ~5 minutes
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Your AI Readiness Assessment
          </h1>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Complete the form below to receive your personalised consultant-level report — covering AI disruption risks, workforce transformation, grants, and your 3-year ROI.
          </p>
        </div>

        <AssessmentForm />

        <div className="mt-8 text-center text-xs text-slate-700">
          Powered by Anthropic Claude AI · Workforce Alliance Foundation · waf.org.sg
        </div>
      </div>
    </main>
  );
}
