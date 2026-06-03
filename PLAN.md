# SME AI Readiness Assessment Tool — Build Plan

## Overview

A web-based AI assessment platform for SME owners attending events. They scan a QR code, fill a form, and receive a professionally generated consultant-level PDF report via email — analysing their AI readiness, workforce disruption risks, and transformation roadmap.

**Theme:** B2B · AI & Technology · Workforce Transformation  
**Context:** Singapore SME landscape (WSG/SkillsFuture grant ecosystem)

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js 14)             │
│  Multi-step form → Submission → "Generating..." UI  │
└───────────────────────┬─────────────────────────────┘
                        │ POST /api/assessment
┌───────────────────────▼─────────────────────────────┐
│                   BACKEND (Node.js/Express)          │
│                                                      │
│  1. Receive form data                                │
│  2. Call Claude API → generate report content        │
│  3. Render HTML report template                      │
│  4. Playwright → PDF                                 │
│  5. Save PDF locally (/outputs/)                     │
│  6. Send via Resend (email with PDF attachment)      │
└─────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Frontend | Next.js 14 (App Router) + Tailwind CSS | Modern, fast, SSR-ready |
| Form | React Hook Form + Zod | Validation, multi-step state |
| Backend | Node.js + Express | Clean REST API, easy local dev |
| AI | Claude claude-sonnet-4-6 API | Best quality/cost for long-form reports |
| PDF | Playwright (HTML → PDF) | Most beautiful, full CSS3 support |
| Email | Resend | Modern DX, 3K free emails/month |
| Storage | Local filesystem (`/backend/outputs/`) | MVP-first; S3-ready later |

---

## Project Structure

```
jrr-aat/
├── frontend/                     # Next.js App
│   ├── app/
│   │   ├── page.tsx              # Landing / QR scan entry
│   │   ├── assessment/
│   │   │   └── page.tsx          # Multi-step form
│   │   └── success/
│   │       └── page.tsx          # "Report sent!" confirmation
│   ├── components/
│   │   ├── AssessmentForm.tsx    # Multi-step form container
│   │   ├── StepProgress.tsx      # Progress stepper
│   │   ├── steps/
│   │   │   ├── Step1Company.tsx  # Company info
│   │   │   ├── Step2Challenges.tsx
│   │   │   ├── Step3Workforce.tsx
│   │   │   └── Step4Vision.tsx
│   │   └── ui/                   # Shared UI components
│   └── lib/
│       └── api.ts                # API client
│
├── backend/                      # Express API
│   ├── src/
│   │   ├── index.ts              # Server entry
│   │   ├── routes/
│   │   │   └── assessment.ts     # POST /api/assessment
│   │   ├── services/
│   │   │   ├── aiService.ts      # Claude API calls
│   │   │   ├── pdfService.ts     # Playwright PDF generation
│   │   │   └── emailService.ts   # Resend email
│   │   ├── templates/
│   │   │   └── report.html       # PDF HTML template
│   │   └── prompts/
│   │       └── reportPrompt.ts   # Claude system + user prompts
│   ├── outputs/                  # Generated PDFs stored here
│   └── package.json
│
└── PLAN.md
```

---

## Form Flow (5 Steps)

### Step 1 — Company Info
- Company Name
- Company Website (URL)
- Industry / Sector (dropdown)
- Contact Person Name
- Contact Email

### Step 2 — Current Business Challenges
- Open text: "Describe your top business challenges today"
- (e.g., high labour costs, talent shortage, manual processes, etc.)

### Step 3 — Envisioned Future State
- Open text: "Where do you want your business to be in 3–5 years?"
- Budget range for transformation (optional, dropdown)

### Step 4 — Workforce Breakdown
- Number of PMET staff (Professionals, Managers, Executives, Technicians)
- Number of Non-PMET staff (Operational, frontline roles)
- Top 3 job functions currently in the company (multi-select or free text)

### Step 5 — Roadblocks
- Open text: "What do you see as potential roadblocks to AI/digital transformation?"
- (e.g., budget, skills gap, culture change, legacy systems)

**Submit → Loading screen ("Your AI readiness report is being generated…")**

---

## Report Output (PDF) — Sections

The PDF will be **20–30 pages**, professionally designed with:
- Cover page (company name, date, WAF branding)
- Table of contents
- Executive summary

### Section 1: Industry Future Outlook with AI
- AI-generated analysis of the company's specific industry
- Key AI trends reshaping the sector (next 3–5 years)
- Market sizing, adoption rates, competitive landscape

### Section 2: Disruption Landscape
- How this company specifically will be disrupted
- Risk matrix: probability vs impact
- Key technology trends to watch
- Regulatory / compliance considerations

### Section 3: Risk Management Roadmap
- Practical risk mitigation strategies
- Job redesign as a core pillar (with examples)
- Change management approach
- Phased transformation roadmap (3 phases: Assess → Pilot → Scale)

### Section 4: Top 15 Roles — AI Disruption Index
- Company's top 15 roles (inferred from industry + job functions provided)
- AI Disruption Score (0–100%) for each role
- Visual bar chart (rendered in HTML/CSS for PDF)
- Classification: Low Risk / Moderate / High / Critical

### Section 5: Emerging Roles & Opportunities
- 5–8 new roles expected to emerge in this industry
- Skills required for these new roles
- Internal reskilling vs external hiring recommendation

### Section 6: Grants Available (Singapore-focused)
AI-generated personalised list based on company profile:

| Grant | Scope | Quantum |
|-------|-------|---------|
| SkillsFuture Enterprise Credit (SFEC) | Workforce upskilling | Up to S$30,000 |
| Enterprise Development Grant (EDG) | Business transformation | Up to 50% of costs |
| Productivity Solutions Grant (PSG) | Pre-approved IT solutions | Up to 50% of costs |
| Career Conversion Programme (CCP) | Workforce Singapore | Up to 90% salary support |
| AI Trailblazers (IMDA) | AI adoption | Up to S$50,000 |
| Market Readiness Assistance (MRA) | Overseas expansion | Up to 50% of costs |

### Section 7: Business & Workforce ROI Projection
- Current state cost baseline (estimated from headcount data)
- Projected savings from AI adoption (3-year horizon)
- Workforce productivity uplift (%)
- ROI timeline to break-even
- Visual table: Before vs After transformation

### Section 8: Next Steps & Recommended Actions
- Immediate actions (0–3 months)
- Short-term actions (3–12 months)
- Long-term strategy (1–3 years)
- CTA: Contact WAF for advisory support

---

## AI Prompt Strategy

**Model:** `claude-sonnet-4-6`  
**Approach:** Single structured prompt → JSON response → render to HTML

```
System Prompt:
  You are a senior business transformation consultant at a top-tier firm.
  You specialise in AI adoption strategy for SMEs in Southeast Asia.
  Write at a professional consultant level — specific, data-driven, actionable.
  Avoid generic advice. Tailor every section to the specific company and industry.

User Prompt:
  Company: [name], Industry: [sector], Website: [url]
  Challenges: [free text]
  Envisioned state: [free text]
  Roadblocks: [free text]
  Workforce: [X] PMET, [Y] Non-PMET
  Key roles: [list]

  Generate a full AI readiness assessment report in JSON format with the
  following sections: [schema defined below]
```

**JSON Schema Output:**
```json
{
  "executiveSummary": "...",
  "industryOutlook": { "overview": "...", "trends": [...], "timeline": "..." },
  "disruptionLandscape": { "risks": [...], "trends": [...], "riskMatrix": [...] },
  "riskManagement": { "strategies": [...], "jobRedesign": [...], "roadmap": [...] },
  "roleDisruption": [
    { "role": "...", "disruptionScore": 75, "classification": "High", "rationale": "..." }
  ],
  "emergingRoles": [{ "role": "...", "skills": [...], "timeline": "..." }],
  "grants": [{ "name": "...", "scope": "...", "quantum": "...", "eligibility": "..." }],
  "roiProjection": { "currentCosts": ..., "projectedSavings": ..., "roi": "...", "breakeven": "..." },
  "nextSteps": { "immediate": [...], "shortTerm": [...], "longTerm": [...] }
}
```

---

## PDF Design Theme

- **Color palette:** Deep navy (`#0A0F2C`) + electric blue (`#2563EB`) + white + light grey
- **Typography:** Inter (headings) + system sans-serif (body)
- **Style:** Dark header sections, white content areas, data tables, progress bars for disruption scores
- **Cover page:** Full bleed dark background, large company name, generation date
- **Charts:** HTML/CSS bar charts (no external charting library needed for PDF)
- **Page footer:** WAF logo placeholder + page numbers

---

## API Endpoints

```
POST /api/assessment
  Body: FormData (all form fields)
  Response: { success: true, reportId: "uuid", message: "Report sent to email" }

GET /api/assessment/:id/download
  Response: PDF file stream (local fallback)

GET /api/health
  Response: { status: "ok" }
```

---

## Confirmed Decisions

| Decision | Choice |
|----------|--------|
| Email | Resend test mode (PDFs saved locally for now, email wired but not live) |
| Grants | Hardcoded + curated Singapore grant list (SFEC, EDG, PSG, CCP, etc.) |
| ROI Calculation | AI-estimated using industry benchmarks + headcount data |
| Deployment | Online — Vercel (frontend) + Railway/Render (backend) |

---

## Environment Variables

### Backend (`backend/.env`)
```
ANTHROPIC_API_KEY=sk-ant-...
RESEND_API_KEY=re_...           # test mode for now
FROM_EMAIL=noreply@resend.dev   # Resend test sender
OUTPUT_DIR=./outputs
PORT=3001
```

### Frontend (`frontend/.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## Implementation Phases

### Phase 1 — Foundation (Backend skeleton + form)
1. Backend: Express server + `/api/assessment` route
2. Frontend: Multi-step form with validation
3. Backend: Claude API integration + prompt engineering
4. Backend: JSON response parsing

### Phase 2 — PDF Generation
5. Backend: HTML report template (all 8 sections)
6. Backend: Playwright PDF rendering
7. Backend: Local file save (`/outputs/YYYY-MM-DD-CompanyName.pdf`)

### Phase 3 — Email Delivery
8. Backend: Resend integration
9. Backend: PDF attached to email
10. Frontend: Success screen with email confirmation

### Phase 4 — Polish
11. PDF design refinement (cover page, charts, tables)
12. Error handling + loading states
13. Mobile-responsive form
14. QR code generation for event use

---

## Open Questions for You

1. **Domain/Email:** What email address should reports be sent FROM? (needs to be a verified Resend domain)
2. **Branding:** Should WAF logo appear in the PDF? If so, please share the logo file.
3. **Grant data:** Do you want grants hardcoded (more reliable) or AI-generated per company profile?
4. **ROI calculation:** Is there a specific methodology you want to use, or should the AI estimate based on headcount and industry benchmarks?
5. **Language:** English only, or do you need bilingual (English + Chinese) support?
6. **Hosting:** Is this for local event use only, or do you want it deployed (Vercel + Railway/Render)?

---

## Estimated Build Time

| Phase | Effort |
|-------|--------|
| Phase 1 (Form + AI) | ~3–4 hours |
| Phase 2 (PDF) | ~2–3 hours |
| Phase 3 (Email) | ~1 hour |
| Phase 4 (Polish) | ~2 hours |
| **Total** | **~8–10 hours** |
