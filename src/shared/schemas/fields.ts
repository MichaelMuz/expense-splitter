/**
 * Reusable zod field validators
 */

import { z } from 'zod';

export const money = z
  .number()
  .int('Money amount must be in cents or basis points (integer)')
  .positive('Money amount must be positive');

export const venmoUsername = z.string().trim().min(1).max(30).nullable();
