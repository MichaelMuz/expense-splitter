/**
 * React Query hooks for member operations
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { memberResponseSchema, type CreateMemberInput } from '@/shared/schemas/member';

/**
 * Create a new virtual member
 */
export function useCreateMember(groupId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: CreateMemberInput) => {
            const response = await api.post(`/groups/${groupId}/members`, input);
            const validated = memberResponseSchema.parse(response.data);
            return validated;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['groups', groupId] });
        },
    });
}

export function useUpdateMember(groupId: string, memberId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: CreateMemberInput) => {
            const response = await api.put(`/groups/${groupId}/members/${memberId}`, input);
            const validated = memberResponseSchema.parse(response.data);
            return validated;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['groups', groupId] });
        },
    });
}
