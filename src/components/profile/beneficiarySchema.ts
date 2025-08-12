
import { z } from "zod";
import { zReq, zEmail, zOptional } from "@/lib/zod-utils";

export const beneficiarySchema = z.object({
  firstName: zReq("First name is required."),
  lastName: zReq("Last name is required."),
  relationship: zReq("Relationship is required."),
  dateOfBirth: z.date(),
  ssn: z.string().optional(),
  email: zEmail().optional().or(z.literal("")),
  address: zReq("Address is required."),
  address2: z.string().optional(),
  city: zReq("City is required."),
  state: zReq("State is required."),
  zipCode: z.string().optional(),
});

export type Beneficiary = z.infer<typeof beneficiarySchema>;
