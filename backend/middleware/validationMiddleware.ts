// backend/middleware/validationMiddleware.ts

import { Request, Response, NextFunction } from 'express';

export const validateFinanceRegistrarData = (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, primaryContactNumber, emailAddress, dateOfJoining, fathersName, mothersName, dateOfBirth, maritalStatus, qualification, workExperience, address, permanentAddress, panNumber, epfNumber, basicSalary, contractType, workShift, workLocation, medicalLeaves, casualLeaves, maternityLeaves, sickLeaves, accountName, accountNumber, bankName, ifscCode, password, confirmPassword } = req.body;

    if (!firstName || !lastName || !primaryContactNumber || !emailAddress || !dateOfJoining || !fathersName || !mothersName || !dateOfBirth || !maritalStatus || !qualification || !workExperience || !address || !permanentAddress || !panNumber || !epfNumber || !basicSalary || !contractType || !workShift || !workLocation || !medicalLeaves || !casualLeaves || !maternityLeaves || !sickLeaves || !accountName || !accountNumber || !bankName || !ifscCode || !password || !confirmPassword) {
        return res.status(400).json({ message: 'All mandatory fields must be filled out.' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Password and confirm password do not match.' });
    }

    next();
};