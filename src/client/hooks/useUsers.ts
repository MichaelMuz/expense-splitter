/**
 * React Query hooks for user operations
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import type { UpdateVenmo } from '@/shared/schemas/user';
import { authQueryKey } from './useAuth';
import { meResponseSchema } from '@/shared/schemas/auth';

/**
 * Update user's venmo
 */
export function useUpdateUserVenmo(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateVenmo) => {
      const response = await api.patch(`/users/${userId}`, data);
      const validated = meResponseSchema.parse(response.data);
      return validated.user;
    },
    onSuccess: (data) => {
      // Update the logged in user's information
      queryClient.setQueryData(authQueryKey, data);
    },
  });
}
