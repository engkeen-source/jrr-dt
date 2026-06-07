import Link from "next/link";
import AssessmentForm from "@/components/AssessmentForm";
import Footer from "@/components/Footer";

export const metadata = {
  title: "AI Readiness Assessment | WAF",
};

export default function AssessmentPage() {
  return (
    <>
    <main className="grid-bg min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-[#E3E2EC] backdrop-blur-sm sticky top-0 z-40 bg-white/95">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/waf-logo.png" alt="Workforce Advancement Federation" className="h-9 w-auto" />
          </Link>
          <div className="text-xs text-[#6E7881]">
            Free · Takes ~5 minutes
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#212529] mb-3" style={{ fontFamily: "Lexend, sans-serif" }}>
            Your AI Readiness Assessment
          </h1>
          <p className="text-[#6E7881] text-sm max-w-xl mx-auto">
            Complete the form below to receive your personalised consultant-level report — covering AI disruption risks, workforce transformation, grants, and your 3-year ROI.
          </p>
        </div>

        <AssessmentForm />
      </div>
    </main>
    <Footer />
    </>
  );
}
