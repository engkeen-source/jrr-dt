import { z } from "zod";

export const assessmentSchema = z.object({
  // Step 1: Company info
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
  industry: z.string().min(2, "Please select or enter your industry"),
  contactName: z.string().min(2, "Contact name is required"),
  contactEmail: z.string().email("Enter a valid email address"),

  // Step 2: Challenges
  currentChallenges: z.string().min(30, "Please describe your challenges (at least 30 characters)"),

  // Step 3: Vision & roadblocks
  envisionedState: z.string().min(30, "Please describe your vision (at least 30 characters)"),
  roadblocks: z.string().min(20, "Please describe potential roadblocks (at least 20 characters)"),

  // Step 4: Workforce
  pmetCount: z
    .string()
    .refine((v) => !isNaN(parseInt(v)) && parseInt(v) >= 0, { message: "Enter a valid number" }),
  nonPmetCount: z
    .string()
    .refine((v) => !isNaN(parseInt(v)) && parseInt(v) >= 0, { message: "Enter a valid number" }),
  keyRoles: z.string().min(5, "Please list at least a couple of key roles in your company"),
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

export const STEPS = [
  { id: 1, label: "Company", title: "Tell us about your company" },
  { id: 2, label: "Challenges", title: "Current business challenges" },
  { id: 3, label: "Vision", title: "Your vision & roadblocks" },
  { id: 4, label: "Workforce", title: "Your workforce breakdown" },
  { id: 5, label: "Review", title: "Review & submit" },
];
