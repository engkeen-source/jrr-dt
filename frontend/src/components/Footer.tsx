const columns = [
  [
    {
      title: "GRANTS",
      links: [
        { label: "CCP for SME Professionals", href: "https://www.waf.org.sg/grants/ccp-for-sme-professionals" },
        { label: "CCP for Biomedical Manufacturing", href: "https://www.waf.org.sg/grants/ccp-for-biomedical-manufacturing-industry" },
        { label: "ESG Grant", href: "https://www.waf.org.sg/grants/esg-grant" },
        { label: "Productivity Solutions Grant", href: "https://www.waf.org.sg/grants/productivity-solutions-grant" },
      ],
    },
    {
      title: "CONSULTANCY",
      links: [
        { label: "Job Redesign", href: "https://www.waf.org.sg/job-redesign" },
        { label: "Digital Business Solutions", href: "https://www.waf.org.sg/consultancy" },
        { label: "Global Expansion Support", href: "https://www.waf.org.sg/global-expansion-support" },
        { label: "Business Financing", href: "https://www.waf.org.sg/consultancy-business-financing" },
      ],
    },
    {
      title: "FEATURES",
      links: [
        { label: "Insights & Updates", href: "https://www.waf.org.sg/insights-and-updates" },
        { label: "Events", href: "https://www.waf.org.sg/events" },
        { label: "Featured Employers", href: "https://www.waf.org.sg/featured-employers" },
        { label: "Newsletters", href: "https://www.waf.org.sg/newsletters" },
      ],
    },
  ],
  [
    {
      title: "RESOURCES",
      links: [
        { label: "Videos & Resources", href: "https://www.waf.org.sg/video-resources" },
        { label: "FAQs", href: "https://www.waf.org.sg/faqs" },
        { label: "Useful Links", href: "https://www.waf.org.sg/useful-links" },
      ],
    },
    {
      title: "ABOUT US",
      links: [
        { label: "Governing Council", href: "https://www.waf.org.sg/governing-council" },
        { label: "Our Milestones", href: "https://www.waf.org.sg/our-milestones" },
        { label: "Corporate Identity", href: "https://www.waf.org.sg/corporate-profile" },
      ],
    },
    {
      title: "SUBSCRIPTION",
      links: [
        { label: "Register", href: "https://www.waf.org.sg/subscription" },
        { label: "About Subscription", href: "https://www.waf.org.sg/about-subscription" },
      ],
    },
  ],
];

const socials = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/WorkforceAdvancementFederation",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.883v2.286h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/88650801/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@waforgsg",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#00233B" }}>
      <div className="max-w-7xl mx-auto px-8 pt-14 pb-10">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* Left — subscribe + social */}
          <div className="lg:w-72 flex-shrink-0 space-y-6">
            <a
              href="https://www.waf.org.sg/subscription"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between bg-white text-[#00233B] font-bold text-base px-6 py-4 rounded-lg hover:bg-gray-100 transition-colors w-full"
            >
              Subscribe Now
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>

            <p className="text-[#B7AFAF] text-xs leading-relaxed">
              By subscribing you agree to our Privacy Policy and provide consent to receive updates from our federation.
            </p>

            <div>
              <p className="text-white text-base font-medium mb-4">Follow us on</p>
              <div className="flex items-center gap-5">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="text-white hover:text-[#1C9AD6] transition-colors"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right — 2 rows × 3 columns */}
          <div className="flex-1 space-y-10">
            {columns.map((row, i) => (
              <div key={i} className="grid grid-cols-2 sm:grid-cols-3 gap-8">
                {row.map((col) => (
                  <div key={col.title}>
                    <h5 className="text-white text-sm font-bold uppercase tracking-widest mb-4">
                      {col.title}
                    </h5>
                    <ul className="space-y-2.5">
                      {col.links.map((link) => (
                        <li key={link.label}>
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#B7AFAF] text-sm hover:text-white transition-colors leading-snug"
                          >
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }}>
        <div className="max-w-7xl mx-auto px-8 py-5 text-center space-y-1">
          <div className="flex items-center justify-center gap-3">
            <a href="https://www.waf.org.sg/privacy-statements" target="_blank" rel="noopener noreferrer" className="text-[#B7AFAF] text-sm hover:text-white transition-colors">
              Privacy Statements
            </a>
            <span className="text-[#B7AFAF]">|</span>
            <a href="https://www.waf.org.sg/terms-of-use" target="_blank" rel="noopener noreferrer" className="text-[#B7AFAF] text-sm hover:text-white transition-colors">
              Terms of Use
            </a>
          </div>
          <p className="text-[#B7AFAF] text-sm">
            Copyrights © {new Date().getFullYear()}. Workforce Advancement Federation Ltd (WAF). All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
