// backend/enums/index.ts
import { GenderEnum, BloodGroupEnum } from "./student.enum";  

export const Enums = {
  GenderEnum,
  BloodGroupEnum, 
}


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
