import { prisma } from '../configs/db.config';

interface LogActionParams {
  userId?: string;      // Optional userId
  action: string;
  actionType?: string;
  details?: Record<string, any>; // Improved type for details
}

export const logAction = async ({ userId, action, actionType = 'general', details = {} }: LogActionParams) => {
  try {
    if (userId) {
      const userExists = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!userExists) {
        throw new Error(`User with id ${userId} does not exist`);
      }
    }

    // Create the log action in the database
    await prisma.auditLog.create({
      data: {
        userId: userId || null,   
        action,
        targetType: actionType,   
        details: details,         // Store details as JSON
        timestamp: new Date(),    
      },
    });

  } catch (error) {
    console.error(`Error logging action for userId: ${userId}, action: ${action}`, error);
  }
};


