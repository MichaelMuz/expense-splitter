/**
 * Validation schemas for groups and members
 */

import { z } from 'zod';
import { memberName } from './member';

export const createGroupSchema = z.object({
  ownerName: memberName,
  name: z
    .string()
    //TODO: add trime to basically every string, we rarely basically never want pure whitespace
    .trim()
    .min(1, 'Group name is required')
    .max(100, 'Group name must be less than 100 characters'),
});

export const groupIdParamSchema = z.object({
  groupId: z.uuid({ error: 'Invalid group ID' }),
});

export const inviteCodeParamSchema = z.object({
  inviteCode: z.uuid({ error: 'Invalid invite code' }),
});

export const joinInviteSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('claim'),
    memberId: z.uuid({ error: 'Invalid member id' }),
  }),
  z.object({
    type: z.literal('new'),
    memberName: memberName,
  }),
]);

// Member schemas
export const memberIdParamSchema = z.object({
  groupId: z.uuid({ error: 'Invalid group ID' }),
  memberId: z.uuid({ error: 'Invalid member ID' }),
});

// Type exports
export type CreateGroupInput = z.infer<typeof createGroupSchema>;
export type GroupIdParam = z.infer<typeof groupIdParamSchema>;
export type InviteCodeParam = z.infer<typeof inviteCodeParamSchema>;
export type MemberIdParam = z.infer<typeof memberIdParamSchema>;
export type JoinInviteInput = z.infer<typeof joinInviteSchema>;

// This is a superset of the groupMemberSchema used in expense. If we need this data there we can consolidate later.
const groupMemberSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  role: z.string(),
  userId: z.uuid().nullable(),
  joinedAt: z.coerce.date(),
});

const groupBaseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  inviteCode: z.uuid(),
  createdAt: z.coerce.date(),
});

const groupSchema = groupBaseSchema.extend({
  members: z.array(groupMemberSchema),
  _count: z.object({
    expenses: z.number().int(),
  }),
});

const createGroupDataSchema = groupBaseSchema.extend({
  members: z.array(groupMemberSchema),
});

export const groupResponseSchema = z.object({
  group: groupSchema,
});

export const groupsResponseSchema = z.object({
  groups: z.array(groupSchema),
});

export const createGroupResponseSchema = z.object({
  group: createGroupDataSchema,
});

export const joinGroupResponseSchema = z.object({
  group: groupBaseSchema,
  member: groupMemberSchema,
});

export type GroupMember = z.infer<typeof groupMemberSchema>;
export type Group = z.infer<typeof groupSchema>;
export type GroupResponse = z.infer<typeof groupResponseSchema>;
export type GroupsResponse = z.infer<typeof groupsResponseSchema>;
export type CreateGroupResponse = z.infer<typeof createGroupResponseSchema>;
export type JoinGroupResponse = z.infer<typeof joinGroupResponseSchema>;
