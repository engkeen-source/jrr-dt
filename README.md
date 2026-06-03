# JRR-DT — AI Readiness Assessment Tool

A web-based platform for SME owners. They complete a 5-step form and receive a professionally designed, consultant-level PDF report via email — covering AI disruption risk, workforce impact, Singapore grants, and a 3-year ROI projection.

---

## Live URLs

| | URL |
|---|---|
| **Frontend** | https://jrr-dt.autolabkit.com |
| **Backend API** | https://api-jrr-dt.autolabkit.com |
| **Health check** | https://api-jrr-dt.autolabkit.com/api/health |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, Tailwind CSS, react-hook-form + Zod |
| Backend | Node.js, Express, TypeScript |
| AI | Google Gemini (via `@google/genai`) |
| PDF | Playwright (headless Chromium renders HTML → PDF) |
| Email | Resend (`support@resend.autolabkit.com`) |
| Deployment | Coolify + Docker Compose on `autolabkit.com` |

---

## Project Structure

```
jrr-dt/
├── backend/
│   ├── src/
│   │   ├── index.ts                    # Express server (port 3001)
│   │   ├── routes/assessment.ts        # POST /api/assessment
│   │   ├── services/
│   │   │   ├── aiService.ts            # Gemini API — generates report content
│   │   │   ├── pdfService.ts           # Playwright — renders HTML to PDF
│   │   │   └── emailService.ts         # Resend — emails PDF to user
│   │   ├── prompts/reportPrompt.ts     # Gemini prompt + Singapore grants data
│   │   └── templates/reportTemplate.ts # HTML/CSS template for the PDF
│   ├── outputs/                        # Generated PDFs (gitignored)
│   ├── Dockerfile                      # Uses mcr.microsoft.com/playwright:v1.60.0-jammy
│   └── .env                            # Local env vars (see below)
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx                # Landing page
│   │   │   ├── assessment/page.tsx     # Assessment form page
│   │   │   └── success/page.tsx        # Post-submission confirmation
│   │   ├── components/
│   │   │   ├── AssessmentForm.tsx      # Main form (localStorage caching + reset)
│   │   │   ├── FormField.tsx           # Shared input wrapper
│   │   │   └── steps/
│   │   │       ├── Step1Company.tsx    # Company info
│   │   │       ├── Step2Challenges.tsx # Multi-select business challenges
│   │   │       ├── Step3Vision.tsx     # Vision + AI transformation roadblocks
│   │   │       └── Step4Workforce.tsx  # Staff count
│   │   └── lib/schema.ts              # Zod validation schema + option lists
│   ├── Dockerfile
│   └── .env.local                      # Local env vars (see below)
│
├── docker-compose.yml                  # Coolify deployment config
└── Makefile                            # make install / make dev / make build
```

---

## How It Works

1. User fills the 5-section form at `/assessment`
2. Frontend POSTs to `POST /api/assessment`
3. Backend calls **Gemini AI** to generate the report content (JSON)
4. **Playwright** (headless Chromium) renders the HTML template to a multi-page PDF
5. **Resend** emails the PDF to the user
6. Frontend redirects to `/success`

```
Browser → POST /api/assessment
              ↓
         Gemini AI  →  report JSON
              ↓
         Playwright →  PDF file
              ↓
         Resend     →  email to user
```

---

## Report Sections (PDF output)

1. Executive Summary
2. Industry Future Outlook with AI trends
3. Disruption Risk Matrix
4. Risk Management & Job Redesign Roadmap
5. AI Disruption Scores for top 15 roles
6. Emerging Roles to capitalise on
7. Singapore Grants (SFEC, EDG, PSG, CCP, AI Trailblazers)
8. 3-Year Business & Workforce ROI Projection
9. Phase-by-phase Next Steps (30 days → 24 months)

---

## Local Development

### Prerequisites
- Node.js 20+
- A Gemini API key
- A Resend API key

### Setup

```bash
make install   # installs deps for both backend and frontend
make dev       # starts both servers concurrently
```

- Frontend: http://localhost:3000
- Backend: http://localhost:3001

### Backend `.env`

```env
GEMINI_API_KEY=your_key
RESEND_API_KEY=your_key
FROM_EMAIL=support@resend.autolabkit.com
OUTPUT_DIR=./outputs
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### Frontend `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## API Reference

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/health` | Health check — confirms Gemini/Resend keys are loaded |
| `POST` | `/api/assessment` | Generate report and send email |
| `GET` | `/api/assessment/:id/download` | Download a previously generated PDF |

### POST `/api/assessment` — request body

```json
{
  "companyName": "Acme Pte Ltd",
  "companyWebsite": "www.acme.com.sg",
  "industry": "Retail & E-commerce",
  "contactName": "John Tan",
  "contactEmail": "john@acme.com.sg",
  "currentChallenges": "High manpower costs; Difficulty retaining staff",
  "envisionedState": "Automate 40% of ops in 3 years",
  "roadblocks": "Budget constraints; Staff resistance",
  "staffStrength": 50,
  "pmetCount": 15
}
```

---

## Deployment (Coolify)

The app is deployed as a **Docker Compose** project on Coolify.

- **Repo:** https://github.com/engkeen-source/jrr-dt
- **Branch:** `main`
- **Compose file:** `docker-compose.yml`

### Coolify environment variables

| Variable | Value |
|---|---|
| `GEMINI_API_KEY` | Gemini API key |
| `RESEND_API_KEY` | Resend API key |
| `FROM_EMAIL` | `support@resend.autolabkit.com` |
| `FRONTEND_URL` | `https://jrr-dt.autolabkit.com` |
| `NEXT_PUBLIC_API_URL` | `https://api-jrr-dt.autolabkit.com` |

> `NEXT_PUBLIC_API_URL` is baked in at **build time**. After changing it, do a full redeploy (not just restart).

### Why Playwright for PDF?

Playwright launches a headless Chromium browser and uses its built-in Print-to-PDF function to render the HTML/CSS report template. This produces pixel-perfect output with full CSS support (gradients, custom fonts, multi-page layouts). The tradeoff is a ~1GB Docker image.
