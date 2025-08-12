import { z } from "zod";

// Required string w/ legacy-friendly validation
export const zReq = (message = "This field is required") =>
  z.string().min(1, { message });

// Const-tuple enum helper
export const zEnum = <T extends readonly string[]>(values: T) =>
  z.enum(values as unknown as [T[number], ...T[number][]]);

// Optional string that converts empty strings to undefined
export const zOptional = (message?: string) =>
  z.string().optional().or(z.literal("")).transform(val => val === "" ? undefined : val);

// Numeric string validation
export const zNumeric = (message = "Must be a valid number") =>
  z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, { message });

// Email validation with better error message
export const zEmail = (message = "Please enter a valid email address") =>
  z.string().email({ message });