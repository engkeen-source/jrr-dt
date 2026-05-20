import Link from "next/link";

interface Props {
  searchParams: Promise<{ name?: string; company?: string; email?: string }>;
}

export default async function SuccessPage({ searchParams }: Props) {
  const params = await searchParams;
  const name = params.name || "there";
  const company = params.company || "your company";
  const email = params.email || "your email";

  return (
    <main className="grid-bg min-h-screen flex flex-col">
      <header className="border-b border-white/5 bg-[#060B1E]/80">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-bold text-sm">
              AI
            </div>
            <span className="text-sm font-semibold text-white tracking-wide">
              WAF · AI Assessment
            </span>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-lg w-full text-center">
          {/* Success icon */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-900/30">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h1 className="text-3xl font-black text-white mb-3">
            Your Report is Ready!
          </h1>
          <p className="text-slate-400 text-base leading-relaxed mb-8">
            Hi <strong className="text-white">{name}</strong> — your personalised AI Readiness Assessment for{" "}
            <strong className="text-white">{company}</strong> has been generated and sent to{" "}
            <strong className="text-blue-400">{email}</strong>.
          </p>

          {/* What's in the report */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 text-left mb-8">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
              Your report includes
            </p>
            <ul className="space-y-2">
              {[
                "Industry Future Outlook with AI",
                "Disruption Risk Matrix for your company",
                "Job Redesign & Risk Management Roadmap",
                "AI Disruption Scores for top 15 roles",
                "Emerging Roles to capitalise on",
                "Singapore grants (SFEC, EDG, PSG, CCP & more)",
                "3-Year Business & Workforce ROI Projection",
                "Phase-by-phase Next Steps action plan",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-green-900/50 border border-green-700/50 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-950/30 border border-blue-800/30 rounded-xl p-4 mb-8">
            <p className="text-xs text-blue-300 leading-relaxed">
              <strong>Don&apos;t see the email?</strong> Check your spam or junk folder.
              The email is sent from <em>onboarding@resend.dev</em> or your configured sending address.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/assessment"
              className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:border-white/20 text-white font-medium px-6 py-3 rounded-xl text-sm transition-colors"
            >
              Assess Another Company
            </Link>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all"
            >
              Back to Home →
            </Link>
          </div>

          <p className="mt-8 text-xs text-slate-700">
            For a personalised advisory session, visit{" "}
            <a href="https://www.waf.org.sg" className="text-blue-600 hover:text-blue-400 transition-colors">
              waf.org.sg
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
