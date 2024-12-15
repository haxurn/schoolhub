
import { z } from "zod";


export const GenderEnum = z.enum(["Male", "Female"]);
export const BloodGroupEnum = z.enum(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]);

export const bloodGroupToPrisma = {
  "A+": "A_PLUS",
  "A-": "A_MINUS",
  "B+": "B_PLUS",
  "B-": "B_MINUS",
  "O+": "O_PLUS",
  "O-": "O_MINUS",
  "AB+": "AB_PLUS",
  "AB-": "AB_MINUS",
} as const;

