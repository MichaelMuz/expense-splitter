/**
 * Validation schemas for user
 */
import { z } from 'zod';
import { venmoUsername } from './fields';

export const userIdSchema = z.object({
  userId: z.uuid(),
});
export const updateVenmoSchema = z.object({
  venmoUsername: venmoUsername,
});

export type UserId = z.infer<typeof userIdSchema>;
export type UpdateVenmo = z.infer<typeof updateVenmoSchema>;
