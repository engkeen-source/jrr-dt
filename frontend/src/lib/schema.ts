import { z } from "zod";

export const assessmentSchema = z.object({
  // Company info
  companyName: z.string().min(2, "Company name is required"),
  companyWebsite: z
    .string()
    .min(3, "Company website is required")
    .refine(
      (v) => {
        try {
          new URL(v.startsWith("http") ? v : `https://${v}`);
          return true;
        } catch {
          return false;
        }
      },
      { message: "Enter a valid website URL" }
    ),
  industry: z.string().min(2, "Please select your industry"),
  contactName: z.string().min(2, "Contact name is required"),
  contactEmail: z.string().email("Enter a valid email address"),

  // Business challenges (MCQ serialized to string)
  currentChallenges: z.string().min(1, "Please select at least one challenge"),

  // Vision & AI challenges
  envisionedState: z.string().min(30, "Please describe your vision (at least 30 characters)"),
  roadblocks: z.string().min(1, "Please select at least one challenge"),

  // Workforce
  staffStrength: z
    .string()
    .refine((v) => !isNaN(parseInt(v)) && parseInt(v) >= 1, {
      message: "Enter a valid staff count (at least 1)",
    }),
  pmetCount: z
    .string()
    .refine((v) => !isNaN(parseInt(v)) && parseInt(v) >= 0, {
      message: "Enter a valid number",
    }),
});

export type AssessmentFormData = z.infer<typeof assessmentSchema>;

export const INDUSTRIES = [
  "Retail & E-commerce",
  "Food & Beverage",
  "Manufacturing & Engineering",
  "Logistics & Supply Chain",
  "Healthcare & Medical",
  "Financial Services & Fintech",
  "Construction & Real Estate",
  "IT & Technology",
  "Education & Training",
  "Hospitality & Tourism",
  "Media & Creative",
  "Professional Services (Legal, Accounting)",
  "Wholesale & Distribution",
  "Environmental & Sustainability",
  "Other",
];

export const CHALLENGE_OPTIONS = [
  "High labour costs & staff turnover",
  "Manual, repetitive back-office processes",
  "Difficulty attracting skilled talent",
  "Customer service bottlenecks",
  "Slow order fulfilment / logistics",
  "Inconsistent quality control",
  "Lack of digital tools or data visibility",
  "Difficulty scaling operations",
];

export const AI_CHALLENGE_OPTIONS = [
  "Budget / cost of transformation",
  "Staff resistance to change",
  "Lack of in-house tech skills",
  "Legacy systems hard to integrate",
  "Uncertain ROI / hard to justify",
  "Finding the right AI vendor",
  "Data privacy and security concerns",
  "Regulatory / compliance uncertainty",
];
