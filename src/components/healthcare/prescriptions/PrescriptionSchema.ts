
import { z } from "zod";

export const prescriptionSchema = z.object({
  name: z.string().min(2, { message: "Medication name is required" }),
  dosage: z.string().min(1, { message: "Dosage is required" }),
  frequency: z.string().min(1, { message: "Frequency is required" }),
  nextRefill: z.string().min(1, { message: "Next refill date is required" }),
  doctor: z.string().optional(),
  pharmacy: z.string().optional(),
  notes: z.string().optional(),
});

export type Prescription = z.infer<typeof prescriptionSchema>;
