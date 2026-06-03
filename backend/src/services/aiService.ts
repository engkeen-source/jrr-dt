import { GoogleGenAI } from "@google/genai";
import { AssessmentInput, buildReportPrompt } from "../prompts/reportPrompt";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

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

const MODELS = ["gemini-3.5-flash", "gemini-2.5-flash"];

async function tryGenerate(model: string, prompt: string): Promise<string> {
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      temperature: 0.7,
      maxOutputTokens: 16384,
      responseMimeType: "application/json",
    },
  });
  return (response.text ?? "").trim();
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function generateReport(input: AssessmentInput): Promise<ReportData> {
  const prompt = buildReportPrompt(input);

  let lastError: Error | null = null;

  for (const model of MODELS) {
    // Retry each model up to 3 times with backoff for 503s
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`[AI] Trying model: ${model} (attempt ${attempt})`);
        let jsonText = await tryGenerate(model, prompt);

        if (jsonText.startsWith("```")) {
          jsonText = jsonText.replace(/^```[a-z]*\n?/, "").replace(/\n?```$/, "");
        }

        const report = JSON.parse(jsonText) as ReportData;
        console.log(`[AI] Success with model: ${model}`);
        return report;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        const is503 = msg.includes("503") || msg.includes("UNAVAILABLE") || msg.includes("high demand");
        const is404 = msg.includes("404") || msg.includes("NOT_FOUND");

        console.warn(`[AI] ${model} attempt ${attempt} failed: ${msg.slice(0, 120)}`);
        lastError = err instanceof Error ? err : new Error(msg);

        if (is404) break; // Model not available — skip to next immediately
        if (is503 && attempt < 3) {
          await sleep(attempt * 3000); // 3s, then 6s
          continue;
        }
        break;
      }
    }
  }

  throw lastError ?? new Error("All Gemini models failed to generate the report.");
}
