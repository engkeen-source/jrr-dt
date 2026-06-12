import Link from "next/link";
import ReportStatusPoller from "@/components/ReportStatusPoller";

interface Props {
  searchParams: Promise<{ name?: string; company?: string; email?: string; reportId?: string }>;
}

export default async function SuccessPage({ searchParams }: Props) {
  const params = await searchParams;
  const name = params.name || "there";
  const company = params.company || "your company";
  const email = params.email || "your email";
  const reportId = params.reportId || "";

  return (
    <main className="grid-bg min-h-screen flex flex-col bg-white">
      <header className="border-b border-[#E3E2EC] bg-white">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center">
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/waf-logo.png" alt="Workforce Advancement Federation" className="h-9 w-auto" />
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-lg w-full text-center">
          <div className="relative w-20 h-20 mx-auto mb-8">
            <div
              className="absolute inset-0 rounded-full shadow-xl"
              style={{ background: "linear-gradient(135deg, #80367B22, #FF6D2E22)", border: "2px solid #D4B8D2" }}
            />
            <div
              className="absolute inset-[6px] rounded-2xl flex items-center justify-center shadow-md"
              style={{ background: "linear-gradient(135deg, #80367B, #FF6D2E)" }}
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-black text-[#212529] mb-3" style={{ fontFamily: "Lexend, sans-serif" }}>
            Your Report is on Its Way!
          </h1>
          <p className="text-[#6E7881] text-base leading-relaxed mb-3">
            Hi <strong className="text-[#212529]">{name}</strong> — we&apos;re generating your personalised AI Readiness Assessment for{" "}
            <strong className="text-[#212529]">{company}</strong> right now.
          </p>
          <p className="text-[#6E7881] text-base leading-relaxed mb-8">
            It will be emailed to <strong className="text-[#80367B]">{email}</strong> within the next 30 minutes.{" "}
            <strong className="text-[#212529]">You can close this tab</strong> — we&apos;ll deliver it straight to your inbox.
          </p>

          <div className="bg-[#F5F5F5] border border-[#E3E2EC] rounded-2xl p-6 text-left mb-8">
            <p className="text-xs font-semibold text-[#6E7881] uppercase tracking-widest mb-4">
              Your report includes
            </p>
            <ul className="space-y-2">
              {[
                "Business Climate Analysis with AI trends",
                "Disruption Risk Matrix for your company",
                "Job Redesign & Risk Management Roadmap",
                "AI Disruption Scores for top 15 roles",
                "Emerging Roles to capitalise on",
                "Singapore grants (SFEC, EDG, PSG, CCP & more)",
                "3-Year Business & Workforce ROI Projection",
                "Phase-by-phase Next Steps action plan",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-[#212529]">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "#F3E9F3", border: "1px solid #D4B8D2" }}
                  >
                    <svg className="w-3 h-3" style={{ color: "#80367B" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {reportId ? (
            <ReportStatusPoller reportId={reportId} email={email} />
          ) : (
            <div className="bg-[#F3E9F3] border border-[#D4B8D2] rounded-xl p-4 mb-8">
              <p className="text-xs text-[#4C215D] leading-relaxed">
                <strong>Not in your inbox after 30 minutes?</strong> Check your spam or junk folder.
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/assessment"
              className="flex items-center justify-center gap-2 bg-white border border-[#E3E2EC] hover:border-[#80367B] text-[#212529] font-medium px-6 py-3 rounded-xl text-sm transition-colors"
            >
              Assess Another Company
            </Link>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 bg-[#8B42A8] hover:bg-[#2691CD] text-white font-semibold px-6 py-3 rounded-[10px] text-sm transition-colors"
            >
              Back to Home →
            </Link>
          </div>

          <p className="mt-8 text-xs text-[#B7AFAF]">
            For a personalised advisory session, visit{" "}
            <a href="https://www.waf.org.sg" className="text-[#80367B] hover:underline transition-colors">
              waf.org.sg
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
