
import { z } from "zod";

export const trustSchema = z.object({
  trustName: z.string().min(1, { message: "Trust name is required." }),
  country: z.string().min(1, { message: "Country is required." }),
  address: z.string().min(1, { message: "Address is required." }),
  city: z.string().min(1, { message: "City is required." }),
  state: z.string().min(1, { message: "State is required." }),
  zipCode: z.string().min(1, { message: "Zip code is required." }),
  phoneNumber: z.string().min(1, { message: "Phone number is required." }),
  emailAddress: z.string().email({ message: "Valid email is required." }),
  documentType: z.string().min(1, { message: "Document type is required." }),
});

export type TrustFormData = z.infer<typeof trustSchema>;

export interface TrustDocument {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  content_type: string;
}

export interface Trust extends TrustFormData {
  id?: string;
  documents?: TrustDocument[];
}
