// backend/enums/student.enum.ts

import { z } from "zod";


export const GenderEnum = z.enum(["Male", "Female"]);

export const BloodGroupEnum = z.enum(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]);
