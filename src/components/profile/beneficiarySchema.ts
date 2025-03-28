
import { z } from "zod";

export const beneficiarySchema = z.object({
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  relationship: z.string().min(1, { message: "Relationship is required." }),
  dateOfBirth: z.date({ required_error: "Date of birth is required." }),
  ssn: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
  address2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
});

export type Beneficiary = z.infer<typeof beneficiarySchema>;

export const defaultBeneficiaryValues = {
  firstName: "",
  lastName: "",
  relationship: "",
  address: "",
  address2: "",
  city: "",
  state: "",
  zipCode: "",
  email: "",
  ssn: "",
};
