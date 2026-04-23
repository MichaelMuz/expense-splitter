/**
 * User routes
 * Handles updating user information, separate from auth because auth bridges token -> rest gap
 * This handles user information like a traditional rest endpoint
 */

import { Router, type Request } from 'express';
import { prisma } from '../lib/prisma';
import { authenticateToken } from '../middleware/auth';
import { validateBody, validateParams } from '../middleware/validate';
import {
  type UpdateVenmo,
  updateVenmoSchema,
  userIdSchema,
  type UserId,
} from '../../shared/schemas/user';
import type { MeResponse } from '../../shared/schemas/auth';

const router = Router();

/**
 * PATCH /api/users/:userId
 * Update a user's venmo handle
 */
router.patch(
  '/:userId',
  authenticateToken,
  validateParams(userIdSchema),
  validateBody(updateVenmoSchema),
  async (req: Request<UserId>, res) => {
    const user = req.user!; // checked in auth
    const venmoData = req.body as UpdateVenmo;
    const { userId } = req.params;
    if (userId !== user.userId) {
      res.status(403).json({ error: 'Can only update your own venmo' });
      return;
    }

    const updatedUser = await prisma.user.update({
      select: {
        id: true,
        email: true,
        venmoUsername: true,
        createdAt: true
      },
      where: {
        id: userId,
      },
      data: {
        venmoUsername: venmoData.venmoUsername,
      },
    });

    const responseData: MeResponse = {
      user: updatedUser,
    };
    res.json(responseData);
  }
);

export default router;
