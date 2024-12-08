// backend/routes/student/registerRoutes.ts

import express from 'express';
import { registerStudent } from '../../controllers/studentController';
import { upload } from '../../middleware/uploadMiddleware';
import { adminOrFinance } from '../../middleware/authMiddleware';
import { validateStudentRegistrationData } from '../../middleware/validationMiddleware';

const router = express.Router();

/**
 * @swagger
 * /student/register:
 *   post:
 *     tags:
 *       - Student
 *     summary: Register a new student
 *     description: 
 *       Register a new student by providing a detailed profile. This includes personal information, parental/guardian details, medical history, previous school information, and required documents. 
 *       Only users with admin or finance roles are authorized to access this route.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - dateOfBirth
 *               - gender
 *               - bloodGroup
 *               - religionStatus
 *               - emailAddress
 *               - motherTongue
 *               - languagesKnown
 *               - class
 *               - section
 *               - admissionDate
 *               - rollNumber
 *               - fatherName
 *               - fatherEmail
 *               - fatherPhone
 *               - fatherOccupation
 *               - motherName
 *               - motherEmail
 *               - motherPhone
 *               - motherOccupation
 *               - parentPassword
 *               - previousSchoolName
 *               - previousSchoolAddress
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: Student's first name
 *               lastName:
 *                 type: string
 *                 description: Student's last name
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 description: Student's date of birth
 *               gender:
 *                 type: string
 *                 enum: [Male, Female, Other]
 *                 description: Student's gender
 *               bloodGroup:
 *                 type: string
 *                 enum: [A+, A-, B+, B-, AB+, AB-, O+, O-]
 *                 description: Student's blood group
 *               religionStatus:
 *                 type: string
 *                 enum: [Christian, Muslim, Other]
 *                 description: Student's religion
 *               emailAddress:
 *                 type: string
 *                 format: email
 *                 description: Student's email address
 *               motherTongue:
 *                 type: string
 *                 description: Student's mother tongue
 *               languagesKnown:
 *                 type: string
 *                 description: Languages the student knows
 *               class:
 *                 type: string
 *                 enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
 *                 description: Class the student is enrolling in
 *               section:
 *                 type: string
 *                 enum: [A, B, C, D, E]
 *                 description: Section of the class
 *               admissionDate:
 *                 type: string
 *                 format: date
 *                 description: Admission date
 *               rollNumber:
 *                 type: string
 *                 description: Roll number assigned to the student
 *               fatherName:
 *                 type: string
 *                 description: Father's full name
 *               fatherEmail:
 *                 type: string
 *                 format: email
 *                 description: Father's email address
 *               fatherPhone:
 *                 type: string
 *                 description: Father's phone number
 *               fatherOccupation:
 *                 type: string
 *                 description: Father's occupation
 *               motherName:
 *                 type: string
 *                 description: Mother's full name
 *               motherEmail:
 *                 type: string
 *                 format: email
 *                 description: Mother's email address
 *               motherPhone:
 *                 type: string
 *                 description: Mother's phone number
 *               motherOccupation:
 *                 type: string
 *                 description: Mother's occupation
 *               parentPassword:
 *                 type: string
 *                 format: password
 *                 description: Parent's password for accessing the portal
 *               guardianType:
 *                 type: string
 *                 enum: [Legal Guardian, Relative, Other]
 *                 description: Type of guardian, if applicable
 *               guardianName:
 *                 type: string
 *                 description: Guardian's full name
 *               guardianRelation:
 *                 type: string
 *                 description: Relation to the student
 *               guardianPhone:
 *                 type: string
 *                 description: Guardian's phone number
 *               guardianEmail:
 *                 type: string
 *                 format: email
 *                 description: Guardian's email address
 *               guardianOccupation:
 *                 type: string
 *                 description: Guardian's occupation
 *               guardianAddress:
 *                 type: string
 *                 description: Guardian's address
 *               allergies:
 *                 type: string
 *                 description: Known allergies
 *               medicalCondition:
 *                 type: string
 *                 description: Any medical conditions
 *               medications:
 *                 type: string
 *                 description: Medications being taken
 *               previousSchoolName:
 *                 type: string
 *                 description: Name of the previous school attended
 *               previousSchoolAddress:
 *                 type: string
 *                 description: Address of the previous school
 *               isSiblingStudyingInSameSchool:
 *                 type: string
 *                 enum: [Yes, No]
 *                 description: Whether the student has a sibling in the same school
 *               siblingName:
 *                 type: string
 *                 description: Name of the sibling (if applicable)
 *               siblingRollNo:
 *                 type: string
 *                 description: Roll number of the sibling
 *               siblingAdmissionNo:
 *                 type: string
 *                 description: Admission number of the sibling
 *               siblingClass:
 *                 type: string
 *                 description: Class of the sibling
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Password for student portal access
 *               studentImage:
 *                 type: string
 *                 format: binary
 *                 description: Profile picture of the student
 *               documents:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Uploaded student-related documents
 *               fatherDocument:
 *                 type: string
 *                 format: binary
 *                 description: Uploaded document for the father
 *               motherDocument:
 *                 type: string
 *                 format: binary
 *                 description: Uploaded document for the mother
 *               guardianDocument:
 *                 type: string
 *                 format: binary
 *                 description: Uploaded document for the guardian
 *     responses:
 *       201:
 *         description: Student registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 admissionNumber:
 *                   type: string
 *                   description: Admission number of the registered student
 *       400:
 *         description: Bad request - invalid input data
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       403:
 *         description: Forbidden - insufficient permissions
 *       500:
 *         description: Internal server error
 */
router.post(
    '/register',
    adminOrFinance,
    validateStudentRegistrationData,
    upload.fields([
        { name: 'studentImage', maxCount: 1 },
        { name: 'documents', maxCount: 5 },
        { name: 'fatherDocument', maxCount: 1 },
        { name: 'motherDocument', maxCount: 1 },
        { name: 'guardianDocument', maxCount: 1 }
    ]) as express.RequestHandler,
    registerStudent
);

export default router;