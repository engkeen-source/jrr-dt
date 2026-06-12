import { GoogleGenAI } from "@google/genai";
import { AssessmentInput, buildReportPrompt } from "../prompts/reportPrompt";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

// ── DeepSeek (primary provider — OpenAI-compatible API) ──────────────────────
const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";
const DEEPSEEK_MODEL = "deepseek-chat";

async function tryDeepSeek(prompt: string): Promise<string> {
  const res = await fetch(DEEPSEEK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: DEEPSEEK_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 8192,
      response_format: { type: "json_object" },
      stream: false,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`DeepSeek ${res.status}: ${body}`);
  }
  const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  return (data.choices?.[0]?.message?.content ?? "").trim();
}

export interface ReportData {
  executiveSummary: string;
  businessClimate: {
    overview: string;
    keyTrends: Array<{ trend: string; description: string; timeframe: string }>;
    competitiveLandscape: string;
    urgencyStatement: string;
  };
  disruptionLandscape: {
    overview: string;
    risks: Array<{
      risk: string;
      description: string;
      likelihood: string;
      impact: string;
      timeframe: string;
    }>;
    opportunities: Array<{ opportunity: string; description: string }>;
  };
  riskManagement: {
    overview: string;
    strategies: Array<{
      strategy: string;
      description: string;
      priority: string;
    }>;
    jobRedesignApproach: {
      philosophy: string;
      examples: Array<{
        currentRole: string;
        redesignedRole: string;
        keyChanges: string;
        skillsGained: string;
      }>;
    };
    changeManagement: string;
  };
  roleDisruption: Array<{
    role: string;
    currentFunction: string;
    disruptionScore: number;
    classification: string;
    aiImpact: string;
    rationale: string;
  }>;
  emergingRoles: Array<{
    role: string;
    description: string;
    whyNow: string;
    keySkills: string[];
    sourcingStrategy: string;
    timeline: string;
  }>;
  roiProjection: {
    assumptions: string;
    currentStateAnalysis: string;
    projectedBenefits: Array<{
      benefit: string;
      description: string;
      estimatedValue: string;
      timeToRealize: string;
    }>;
    threeYearROI: {
      estimatedInvestment: string;
      estimatedSavings: string;
      estimatedROI: string;
      breakevenPoint: string;
    };
    workforceImpact: string;
  };
  nextSteps: {
    immediate: Array<{
      action: string;
      description: string;
      owner: string;
      timeline: string;
    }>;
    shortTerm: Array<{
      action: string;
      description: string;
      owner: string;
      timeline: string;
    }>;
    longTerm: Array<{
      action: string;
      description: string;
      owner: string;
      timeline: string;
    }>;
    aiTechSolutions: string;
    closingMessage: string;
  };
}

// ── Gemini (fallback provider) ────────────────────────────────────────────────
// Model list ordered by capability; falls through on 404/503.
const GEMINI_MODELS = [
  "gemini-2.5-flash",       // most capable — may 503 under load
  "gemini-2.0-flash",       // stable fallback
  "gemini-1.5-flash",       // reliable last resort
];

async function tryGemini(model: string, prompt: string): Promise<string> {
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      temperature: 0.7,
      maxOutputTokens: 65536, // high ceiling to prevent JSON truncation
      responseMimeType: "application/json",
    },
  });
  return (response.text ?? "").trim();
}

async function generateWithGemini(prompt: string): Promise<string> {
  let lastError: Error | null = null;

  for (const model of GEMINI_MODELS) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`[AI] Gemini: trying model ${model} (attempt ${attempt})`);
        const text = await tryGemini(model, prompt);
        console.log(`[AI] Gemini: success with model ${model}`);
        return text;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        const is503 = msg.includes("503") || msg.includes("UNAVAILABLE") || msg.includes("high demand");
        const is404 = msg.includes("404") || msg.includes("NOT_FOUND");
        const isJsonError = err instanceof SyntaxError;

        console.warn(`[AI] Gemini ${model} attempt ${attempt} failed: ${msg.slice(0, 120)}`);
        lastError = err instanceof Error ? err : new Error(msg);

        if (is404) break; // Model not available — skip to next
        if ((is503 || isJsonError) && attempt < 3) {
          // 503: back-off and retry; JSON error: retry immediately
          if (is503) await sleep(attempt * 3000);
          continue;
        }
        break;
      }
    }
  }

  throw lastError ?? new Error("All Gemini models failed to generate the report.");
}

// ── Shared utilities ──────────────────────────────────────────────────────────

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function stripJsonFences(text: string): string {
  return text.replace(/^```[a-z]*\n?/, "").replace(/\n?```$/, "");
}

// ── Main entry point ──────────────────────────────────────────────────────────

export async function generateReport(input: AssessmentInput): Promise<ReportData> {
  const prompt = buildReportPrompt(input);

  // ── 1. Try DeepSeek first (primary) ──────────────────────────────────────
  if (process.env.DEEPSEEK_API_KEY) {
    let deepseekError: Error | null = null;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`[AI] DeepSeek: attempt ${attempt}`);
        const jsonText = stripJsonFences(await tryDeepSeek(prompt));
        const report = JSON.parse(jsonText) as ReportData;
        console.log("[AI] DeepSeek: success");
        return report;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        const isTransient =
          msg.includes("429") ||
          msg.includes("500") ||
          msg.includes("502") ||
          msg.includes("503") ||
          msg.includes("504");
        const isJsonError = err instanceof SyntaxError;

        console.warn(`[AI] DeepSeek attempt ${attempt} failed: ${msg.slice(0, 120)}`);
        deepseekError = err instanceof Error ? err : new Error(msg);

        if ((isTransient || isJsonError) && attempt < 3) {
          if (isTransient) await sleep(attempt * 2000);
          continue;
        }
        break;
      }
    }

    console.warn(`[AI] DeepSeek exhausted (${deepseekError?.message?.slice(0, 80)}), falling back to Gemini…`);
  } else {
    console.warn("[AI] DEEPSEEK_API_KEY not set — skipping DeepSeek, using Gemini");
  }

  // ── 2. Fall back to Gemini ────────────────────────────────────────────────
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Neither DEEPSEEK_API_KEY nor GEMINI_API_KEY is configured.");
  }

  const jsonText = stripJsonFences(await generateWithGemini(prompt));
  return JSON.parse(jsonText) as ReportData;
}
