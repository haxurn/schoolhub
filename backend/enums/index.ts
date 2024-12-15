import { CheckOut, GuardianType, Nationality } from './../node_modules/.prisma/client/index.d';
import { z } from "zod";

// Enums
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

export const ReligionEnum = z.enum(["Christian", "Muslim", "Other"]);  // Corrected the spacing
export const NationalityEnum = z.enum(["Ethiopian", "Foreign"]);
export const studentStatusEnum = z.enum(["ACTIVE", "Inactive", "Suspended", "Graduated", "Transferred", "Withdrawn"]);
export const studentCategoryEnum = z.enum(["GENERAL", "OBC", "SC", "ST", "OTHER"]);
export const parentStatusEnum = z.enum(["ACTIVE", "INACTIVE", "BLOCKED"]);
export const MaritalStatusEnum = z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"]);
export const DepartmentEnum = z.enum(["Science", "Mathematics", "Languages", "Social Studies", "Physical Education", "Arts", "Music", "Computer Science", "Administration", "Other"]);
export const teacherStatusEnum = z.enum(["ACTIVE", "ON_LEAVE", "SUSPENDED", "TERMINATED", "RETIRED"]);
export const ClassMarkTypeEnum = z.enum(["Participation", "Classwork", "Assignment", "Quiz", "Project"]);
export const ExamStatusEnum = z.enum(["Pass", "Fail", "Absent"]);
export const ExamTypeEnum = z.enum(["Quiz", "Midterm", "Final", "Pratical", "Assignment"]);
export const DayEnum = z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]);
export const AttendanceStatus = z.enum(["Present", "Absent", "Late"]);
export const RoleEnum = z.enum(["admin", "student", "staff", "parent", "teacher", "library"]);
export const StatusEnum = z.enum(["active", "inactive", "suspended"]);
export const GuardianTypeEnum = z.enum(["LegalGuardian", "Relative"]);
export const BookCategoryEnum = z.enum(["Textbook", "Reference", "Fiction", "Non-Fiction", "Magazine", "Journal", "Biography", "Dictionary", "Science", "Mathematics", "History", "Literature", "OTHER"]);
export const BookStatusEnum = z.enum(["Available", "Checked_out", "Borrowed", "Lost", "Under_maintenance", "Damaged"]);
export const CheckOutStatusEnum = z.enum(["Checked_out", "Renewed", "Returned", "Overdue", "Lost", "Damaged"]);
export const LanguageEnum = z.enum(["English", "Amharic", "Oromifa", "Other"]);