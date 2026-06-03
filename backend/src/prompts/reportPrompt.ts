export interface AssessmentInput {
  companyName: string;
  companyWebsite: string;
  industry: string;
  contactName: string;
  contactEmail: string;
  currentChallenges: string;
  envisionedState: string;
  roadblocks: string;
  staffStrength: number;
  pmetCount: number;
}

export const SINGAPORE_GRANTS = [
  {
    name: "SkillsFuture Enterprise Credit (SFEC)",
    scope: "Workforce upskilling & job redesign",
    quantum: "Up to S$30,000",
    eligibility: "Singapore-registered companies with at least 3 Singapore Citizens/PRs",
    url: "https://www.skillsfuture.gov.sg/sfec",
  },
  {
    name: "Enterprise Development Grant (EDG)",
    scope: "Business strategy, innovation, productivity & capability building",
    quantum: "Up to 50% of qualifying costs (up to 70% for SMEs)",
    eligibility: "Singapore-registered companies with at least 30% local shareholding",
    url: "https://www.enterprisesg.gov.sg/financial-support/enterprise-development-grant",
  },
  {
    name: "Productivity Solutions Grant (PSG)",
    scope: "Pre-approved digital solutions (ERP, CRM, AI tools)",
    quantum: "Up to 50% of qualifying costs",
    eligibility: "SMEs registered and operating in Singapore",
    url: "https://www.enterprisesg.gov.sg/financial-support/productivity-solutions-grant",
  },
  {
    name: "Career Conversion Programme (CCP)",
    scope: "Reskilling workers into new or redesigned PMET roles",
    quantum: "Up to 90% salary support (6–12 months) for eligible hires",
    eligibility: "Companies hiring mid-career Singaporeans into new PMET roles",
    url: "https://www.wsg.gov.sg/home/employers-industry-partners/workforce-development-job-redesign/career-conversion-programmes",
  },
  {
    name: "AI Trailblazers (IMDA)",
    scope: "Piloting and scaling AI use cases in business operations",
    quantum: "Up to S$50,000 in co-funding",
    eligibility: "Singapore SMEs with viable AI adoption projects",
    url: "https://www.imda.gov.sg/how-we-can-help/smes-go-digital/ai-for-industry",
  },
  {
    name: "Job Redesign Initiative (JRI) under WSG",
    scope: "Redesigning jobs to incorporate technology & raise productivity",
    quantum: "Up to S$10,000 per job redesign project (consultancy support)",
    eligibility: "Companies working with approved consultants to redesign roles",
    url: "https://www.wsg.gov.sg/home/employers-industry-partners/workforce-development-job-redesign",
  },
  {
    name: "Market Readiness Assistance (MRA)",
    scope: "International market expansion including AI-enabled services",
    quantum: "Up to 50% of qualifying costs, capped at S$100,000 per company per new market",
    eligibility: "Singapore-registered SMEs with ≤200 employees or ≤S$100M annual turnover",
    url: "https://www.enterprisesg.gov.sg/financial-support/market-readiness-assistance-grant",
  },
];

export function buildReportPrompt(input: AssessmentInput): string {
  const pmetRatio =
    input.staffStrength > 0
      ? Math.round((input.pmetCount / input.staffStrength) * 100)
      : 0;

  return `You are a senior partner at a leading Singapore management consulting firm specialising in AI-driven workforce transformation for local SMEs. You have deep expertise in Singapore's business climate, MOM workforce regulations, SkillsFuture initiatives, IMDA digital programmes, and the practical challenges faced by Singapore SMEs across all major sectors.

Your task is to generate a comprehensive, professional AI Readiness Assessment Report for the following Singapore SME. This report will be printed as a PDF and handed to the business owner — it must be of the highest professional quality, deeply personalised, and grounded in Singapore's business context.

---
COMPANY PROFILE:
- Company Name: ${input.companyName}
- Website: ${input.companyWebsite}
- Industry: ${input.industry}
- Staff Strength: ${input.staffStrength}
- Local PMET: ${input.pmetCount} (${pmetRatio}% of total workforce)

OWNER'S INPUT:
- Current Business Challenges: ${input.currentChallenges}
- Envisioned Future State: ${input.envisionedState}
- Anticipated Challenges to AI Transformation: ${input.roadblocks}
---

STRATEGIC FRAMEWORK — structure ALL recommendations around three pillars:
1. PEOPLE (skill empowerment) — upskilling, capability building, job redesign to future-proof the workforce
2. BUSINESS (strategy & operations) — process redesign, productivity, competitive positioning in Singapore's market
3. TECHNOLOGY (AI tools & automation) — specific AI solutions that operationalise the People and Business pillars

Generate the report as a single valid JSON object matching this EXACT schema. Do not include markdown code fences, just the raw JSON:

{
  "executiveSummary": "3–4 paragraphs. Open with a powerful statement about AI's impact on this specific Singapore industry. Summarise the company's readiness baseline, the biggest risks, and the highest-ROI opportunities grounded in Singapore's current business climate. Reference relevant Singapore initiatives (SkillsFuture, Smart Nation, IMDA). End with an inspiring call to action.",

  "businessClimate": {
    "overview": "2–3 paragraphs on the macro trends reshaping this industry in Singapore over the next 3–5 years. Be specific to Singapore — reference local adoption rates, Singapore-based case studies or sector examples, MAS/ESG/IMDA initiatives relevant to this industry, and how Singapore's tight labour market and wage pressures are accelerating AI adoption.",
    "keyTrends": [
      { "trend": "Trend name", "description": "2 sentences explaining the trend and its business impact in Singapore's context", "timeframe": "e.g. 12–24 months" }
    ],
    "competitiveLandscape": "1–2 paragraphs on how early vs late AI adopters in this Singapore industry are diverging in performance, market share, and talent attraction. Reference the competitive pressure from regional players and the opportunity for Singapore SMEs to differentiate.",
    "urgencyStatement": "1 punchy sentence on why acting now matters in Singapore's current business climate."
  },

  "disruptionLandscape": {
    "overview": "2 paragraphs specifically on how THIS company — given its size, Singapore local PMET ratio, and stated challenges — faces disruption. Connect their stated challenges to specific AI capabilities and Singapore-context pressures (e.g. rising labour costs, Competition Act, Fair Consideration Framework).",
    "risks": [
      { "risk": "Risk title", "description": "2 sentences", "likelihood": "High|Medium|Low", "impact": "High|Medium|Low", "timeframe": "e.g. 1–2 years" }
    ],
    "opportunities": [
      { "opportunity": "Opportunity title", "description": "2 sentences on the upside if they act, with Singapore-specific opportunity framing" }
    ]
  },

  "riskManagement": {
    "overview": "2 paragraphs on a holistic People-Business-Technology approach to managing AI transition risk for this Singapore SME.",
    "strategies": [
      { "strategy": "Strategy title", "description": "3–4 sentences with concrete actions. Frame each strategy clearly around one of the three pillars: People (skills), Business (strategy), or Technology (tools). Include Singapore grant or initiative relevance where applicable.", "priority": "High|Medium|Low" }
    ],
    "jobRedesignApproach": {
      "philosophy": "2 paragraphs on why job redesign — not job elimination — is the strategic imperative for Singapore SMEs. Reference Singapore's Fair Consideration Framework, SkillsFuture's job redesign mandate, and the moral and commercial imperative to invest in people.",
      "examples": [
        { "currentRole": "Existing role title", "redesignedRole": "New/augmented role title", "keyChanges": "What changes and what stays", "skillsGained": "New skills added via SkillsFuture or on-the-job training" }
      ]
    },
    "changeManagement": "2 paragraphs on how to manage the human side of AI adoption in a Singapore SME context — culture, communication, union/employee consultation, leadership buy-in, and managing workers' anxiety about displacement."
  },

  "roleDisruption": [
    {
      "role": "Role title relevant to this Singapore industry",
      "currentFunction": "What this role does today in 1 sentence",
      "disruptionScore": 0,
      "classification": "Low Risk|Moderate|High Risk|Critical",
      "aiImpact": "Specific AI tools/capabilities disrupting this role",
      "rationale": "2 sentences explaining the score in Singapore's context"
    }
  ],

  "emergingRoles": [
    {
      "role": "New role title",
      "description": "What this role does",
      "whyNow": "Why this role is emerging now in Singapore's business climate",
      "keySkills": ["skill1", "skill2", "skill3"],
      "sourcingStrategy": "Hire externally|Reskill internally|Both",
      "timeline": "e.g. 12–18 months"
    }
  ],

  "roiProjection": {
    "assumptions": "3–4 bullet points as a single string listing the key assumptions used (Singapore salary benchmarks, MOM productivity data, local industry benchmarks, etc.)",
    "currentStateAnalysis": "2 paragraphs estimating current cost baseline and inefficiencies based on headcount, Singapore wage levels, and industry norms.",
    "projectedBenefits": [
      { "benefit": "Benefit area", "description": "Specific saving or revenue gain in the Singapore context", "estimatedValue": "e.g. S$80,000–120,000/year", "timeToRealize": "e.g. 12–18 months" }
    ],
    "threeYearROI": {
      "estimatedInvestment": "Range in SGD (tech + SkillsFuture training + consultancy, net of Singapore grants)",
      "estimatedSavings": "3-year cumulative savings range in SGD",
      "estimatedROI": "% return",
      "breakevenPoint": "e.g. 14–18 months"
    },
    "workforceImpact": "2 paragraphs on the workforce productivity uplift — local PMET upskilling effect (People pillar), reduction in manual hours (Technology pillar), and talent retention benefit in Singapore's tight labour market."
  },

  "nextSteps": {
    "immediate": [
      { "action": "Action title", "description": "2 sentences", "owner": "e.g. CEO / HR Manager", "timeline": "e.g. Within 30 days" }
    ],
    "shortTerm": [
      { "action": "Action title", "description": "2 sentences", "owner": "e.g. Operations lead", "timeline": "e.g. 3–6 months" }
    ],
    "longTerm": [
      { "action": "Action title", "description": "2 sentences", "owner": "e.g. Leadership team", "timeline": "e.g. 12–24 months" }
    ],
    "aiTechSolutions": "2 paragraphs. Frame this as the Technology pillar coming to life. Describe, in advisory (not salesy) terms, how AI Tech Solutions — purpose-built tools for Singapore SMEs — can operationalise the People and Business recommendations in this report. Cover: (1) specific AI tools relevant to this industry and company size (e.g. document automation, AI-assisted customer service, workforce analytics, predictive operations); (2) how WAF's Workforce Tech Solutions component can support implementation alongside SkillsFuture and IMDA grants; (3) a clear, low-pressure invitation to book a consultation to identify the right AI tech solution for this company's next step.",
    "closingMessage": "2 inspiring paragraphs to close the report — acknowledge the challenge of transformation for a Singapore SME, reinforce the People-Business-Technology opportunity, and invite the business owner to take the first step with confidence."
  }
}

CRITICAL REQUIREMENTS:
1. roleDisruption MUST contain exactly 15 roles. disruptionScore must be an integer between 0–100. Classification rules: 0–30 = Low Risk, 31–55 = Moderate, 56–79 = High Risk, 80–100 = Critical.
2. emergingRoles MUST contain 5–7 roles.
3. riskManagement.strategies MUST contain 4–6 strategies, each explicitly tagged to People, Business, or Technology pillar. jobRedesignApproach.examples must contain 3–5 examples.
4. nextSteps.immediate, shortTerm, and longTerm MUST each contain 3–5 actions.
5. Every section must be deeply specific to Singapore — cite local benchmarks, regulations (MOM, FCF, PDPA), grants (SkillsFuture, IMDA, EDG, PSG), and industry bodies. Do NOT reference global/international statistics unless in direct comparison to Singapore context.
6. Write as a confident, authoritative Singapore-based consultant. Use SGD for all monetary figures.
7. Output ONLY valid JSON. No markdown, no preamble, no trailing text.`;
}
