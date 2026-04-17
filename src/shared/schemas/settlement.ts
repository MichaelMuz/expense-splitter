/**
 * Validation schemas for settlements
 */

import { z } from 'zod';
import { money } from './fields';

export const settlementParamsSchema = z.object({
  groupId: z.uuid({ error: 'Invalid group ID' }),
  settlementId: z.uuid({ error: 'Invalid settlement ID' }),
});

export const createSettlementSchema = z
  .object({
    fromGroupMemberId: z.uuid({ error: 'Invalid from member ID' }),
    toGroupMemberId: z.uuid({ error: 'Invalid to member ID' }),
    amount: money,
  })
  .refine((data) => data.fromGroupMemberId !== data.toGroupMemberId, {
    error: 'Cannot settle payment to yourself',
    path: ['toGroupMemberId'],
  });

export type SettlementParams = z.infer<typeof settlementParamsSchema>;
export type CreateSettlementInput = z.infer<typeof createSettlementSchema>;

const settlementMemberSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  userId: z.uuid().nullable(),
});

export const settlementSchema = z.object({
  id: z.uuid(),
  groupId: z.uuid(),
  amount: z.number().int(),
  paidAt: z.coerce.date(),
  recordedBy: z.uuid(),
  fromGroupMemberId: z.uuid(),
  toGroupMemberId: z.uuid(),
  fromMember: settlementMemberSchema,
  toMember: settlementMemberSchema,
});

export const settlementResponseSchema = z.object({
  settlement: settlementSchema,
});

export const settlementsResponseSchema = z.object({
  settlements: z.array(settlementSchema),
});

export type Settlement = z.infer<typeof settlementSchema>;
export type SettlementResponse = z.infer<typeof settlementResponseSchema>;
export type SettlementsResponse = z.infer<typeof settlementsResponseSchema>;
