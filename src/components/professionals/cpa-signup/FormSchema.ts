
import { z } from "zod";

export const cpaSignupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  company: z.string().min(2, { message: "Firm name must be at least 2 characters" }),
  address: z.string().min(5, { message: "Please provide a valid address" }),
  phone: z.string().min(5, { message: "Please provide a valid phone number" }),
  email: z.string().email({ message: "Please provide a valid email address" }),
  website: z.string().url({ message: "Please provide a valid website URL" }).optional().or(z.literal("")),
  certifications: z.array(z.string()).optional(),
  specialties: z.array(z.string()).optional(),
  acceptReferrals: z.boolean().default(false),
  collaborateWithRIA: z.boolean().default(false),
  practiceSoftware: z.string().optional(),
  notes: z.string().optional(),
});

export type CPAFormValues = z.infer<typeof cpaSignupSchema>;

export const defaultSpecialties = [
  "Business Tax",
  "Personal Tax",
  "Tax Planning",
  "Auditing",
  "Bookkeeping",
  "Financial Statements",
  "Payroll Services",
  "CFO Services",
  "Nonprofit Accounting",
  "International Tax",
];

