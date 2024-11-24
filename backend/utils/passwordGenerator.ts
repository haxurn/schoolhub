// backend/utils/passwordGenerator.ts

import { randomBytes } from 'crypto';
import bcrypt from 'bcryptjs';

/**
 * Function to generate a random password
 * @param length The length of the password
 * @returns The generated password string
 */


export function generateRandomPassword(length: number = 8): string {
    return randomBytes(length).toString('hex').slice(0, length);
}

/**
 * Hash the generated password
 * @param password The raw password string
 * @returns The hashed password
 */

export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}