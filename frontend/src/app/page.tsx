import Link from "next/link";

const features = [
  {
    icon: "📊",
    title: "Business Climate Analysis",
    desc: "AI-driven trends reshaping your Singapore industry over the next 3–5 years",
  },
  {
    icon: "⚠️",
    title: "Disruption Risk Analysis",
    desc: "Personalised risk matrix — what threatens your business and when",
  },
  {
    icon: "🔄",
    title: "Job Redesign Roadmap",
    desc: "Practical strategies to transform roles and empower your people",
  },
  {
    icon: "🤖",
    title: "AI Disruption Index",
    desc: "Scores for your top 15 roles — who is most at risk from AI",
  },
  {
    icon: "🌱",
    title: "Emerging Roles",
    desc: "New positions your company should create to stay ahead",
  },
  {
    icon: "💰",
    title: "Singapore Grants",
    desc: "SFEC, EDG, PSG, CCP and more — funding for your AI journey",
  },
  {
    icon: "📈",
    title: "3-Year ROI Projection",
    desc: "Business and workforce ROI forecast with breakeven analysis",
  },
  {
    icon: "🚀",
    title: "Personalised Next Steps",
    desc: "Phase-by-phase action plan from 30 days to 24 months",
  },
];

const pillars = [
  {
    label: "People",
    desc: "Skill-empowered workforce ready for the AI era",
    color: "#80367B",
  },
  {
    label: "Business",
    desc: "Strategy-led job redesign and operational excellence",
    color: "#8B42A8",
  },
  {
    label: "Technology",
    desc: "AI tools and automation that drive real productivity",
    color: "#FF6D2E",
  },
];

export default function LandingPage() {
  return (
    <main className="grid-bg min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-[#E3E2EC] sticky top-0 z-50 bg-white/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/waf-logo.png" alt="Workforce Alliance Foundation" className="h-9 w-auto" />
          </div>
          <div className="text-xs text-[#6E7881] hidden sm:block">
            waf.org.sg
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-[#F3E9F3] border border-[#D4B8D2] rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#80367B] animate-pulse" />
            <span className="text-xs text-[#80367B] font-medium tracking-wide uppercase">
              Free AI Readiness Assessment
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#212529] leading-tight tracking-tight mb-6" style={{ fontFamily: "Lexend, sans-serif" }}>
            Is Your Business
            <span
              className="block bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(90deg, #80367B, #FF6D2E)" }}
            >
              Ready for the AI Era?
            </span>
          </h1>

          <p className="text-lg text-[#6E7881] max-w-2xl mx-auto mb-10 leading-relaxed">
            Complete a quick assessment and receive a{" "}
            <strong className="text-[#212529]">personalised consultant-level PDF report</strong>{" "}
            covering disruption risks, workforce transformation, available Singapore grants, and your 3-year ROI — sent directly to your inbox.
          </p>

          <Link
            href="/assessment"
            className="inline-flex items-center gap-2 bg-[#8B42A8] hover:bg-[#2691CD] text-white font-semibold px-8 py-4 rounded-[10px] transition-colors text-base shadow-sm"
          >
            Start Your Assessment
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>

          <p className="text-xs text-[#B7AFAF] mt-4">
            Takes ~5 minutes · PDF delivered instantly · No obligations
          </p>
        </div>
      </section>

      {/* Three Pillars */}
      <section className="max-w-6xl mx-auto px-6 pb-12">
        <div className="text-center mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#80367B] mb-2">
            Our Assessment Framework
          </p>
          <h2 className="text-2xl font-bold text-[#212529]" style={{ fontFamily: "Lexend, sans-serif" }}>
            People · Business · Technology
          </h2>
          <p className="text-[#6E7881] mt-2 text-sm max-w-xl mx-auto">
            A holistic approach to AI transformation — skills-led, strategy-driven, and technology-enabled
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {pillars.map((p) => (
            <div key={p.label} className="bg-white border border-[#E3E2EC] rounded-xl p-6 text-center shadow-sm">
              <div
                className="inline-block w-12 h-1 rounded-full mb-4"
                style={{ backgroundColor: p.color }}
              />
              <div className="font-bold text-[#212529] text-base mb-2" style={{ fontFamily: "Lexend, sans-serif" }}>
                {p.label}
              </div>
              <div className="text-[#6E7881] text-xs leading-relaxed">{p.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* What you get */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#80367B] mb-3">
            What Your Report Includes
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#212529]" style={{ fontFamily: "Lexend, sans-serif" }}>
            A Complete AI Transformation Playbook
          </h2>
          <p className="text-[#6E7881] mt-3 text-sm max-w-xl mx-auto">
            Generated by AI using the same frameworks used by top management consulting firms — Singapore-specific
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white border border-[#E3E2EC] rounded-xl p-5 hover:border-[#80367B]/40 hover:shadow-md transition-all duration-200"
            >
              <div className="text-2xl mb-3">{f.icon}</div>
              <div className="font-semibold text-[#212529] text-sm mb-1" style={{ fontFamily: "Lexend, sans-serif" }}>
                {f.title}
              </div>
              <div className="text-[#6E7881] text-xs leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section className="border-t border-[#E3E2EC] bg-[#F3E9F3]">
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="font-bold text-[#212529] text-lg" style={{ fontFamily: "Lexend, sans-serif" }}>
              Ready to see your AI readiness score?
            </div>
            <div className="text-[#6E7881] text-sm mt-1">
              Join Singapore business owners who are getting ahead of the curve.
            </div>
          </div>
          <Link
            href="/assessment"
            className="flex-shrink-0 inline-flex items-center gap-2 bg-[#8B42A8] hover:bg-[#2691CD] text-white font-semibold px-6 py-3 rounded-[10px] transition-colors text-sm shadow-sm"
          >
            Begin Assessment →
          </Link>
        </div>
      </section>

      <footer className="border-t border-[#E3E2EC]">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-[#B7AFAF]">
            © {new Date().getFullYear()} Workforce Alliance Foundation · waf.org.sg
          </div>
          <div className="text-xs text-[#B7AFAF]">
            Report generated using AI — for advisory use only
          </div>
        </div>
      </footer>
    </main>
  );
}
