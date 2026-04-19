/**
 * Member response schemas
 */

import { z } from 'zod';

// exported for other shared type schemas
export const memberName = z
  .string()
  .trim()
  .min(1, 'Member name is required')
  .max(100, 'Member name must be less than 100 characters');

export const createMemberSchema = z.object({
  name: memberName,
});

export type CreateMemberInput = z.infer<typeof createMemberSchema>;

const memberBaseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  role: z.string(),
  userId: z.uuid().nullable(),
  joinedAt: z.coerce.date(),
});

export const memberResponseSchema = z.object({
  member: memberBaseSchema.extend({
    groupId: z.uuid(),
  }),
});

export const membersResponseSchema = z.object({
  members: z.array(
    memberBaseSchema.extend({
      user: z
        .object({
          email: z.email(),
        })
        .nullable(),
    })
  ),
});

export type MemberResponse = z.infer<typeof memberResponseSchema>;
export type MembersResponse = z.infer<typeof membersResponseSchema>;
