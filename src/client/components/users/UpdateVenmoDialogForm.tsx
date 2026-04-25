import { useAuth } from '../../hooks/useAuth';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ErrorMessage } from '../ui/form-error';
import { useUpdateUserVenmo } from '../../hooks/useUsers';
import { updateVenmoSchema, type UpdateVenmo } from '@/shared/schemas/user';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '../ui/dialog';
import type { User } from '@/shared/schemas/auth';
import { useEffect, useRef } from 'react';

function UpdateVenmoDialogFormCore({
  user,
  open,
  onOpenChange,
}: {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const updateVenmo = useUpdateUserVenmo(user.id);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateVenmo>({
    resolver: zodResolver(updateVenmoSchema),
    defaultValues: { venmoUsername: user.venmoUsername ?? undefined },
    mode: 'onSubmit',
  });

  const hadVenmoOnOpenRef = useRef(!!user.venmoUsername);
  useEffect(() => {
    if (open) {
      reset({ venmoUsername: user.venmoUsername ?? undefined });
      hadVenmoOnOpenRef.current = !!user.venmoUsername;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps - only react to `open`; reset on user data change would clobber typing
  }, [open, reset]);

  const onSubmit = (data: UpdateVenmo) => {
    updateVenmo.mutate(data, { onSuccess: () => onOpenChange(false) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add your venmo username</DialogTitle>
            <DialogDescription>
              Make it easy to send you money with prefilled venmo details
            </DialogDescription>
          </DialogHeader>
          <ErrorMessage error={updateVenmo.error} />
          <label className="flex flex-col py-3 gap-1">
            <span className="text-sm font-medium">Venmo username</span>
            <Input
              type="text"
              autoComplete="one-time-code"
              {...register('venmoUsername')}
              placeholder="First-Last"
            />
            <ErrorMessage error={errors.venmoUsername} />
          </label>
          <DialogFooter className="sm:justify-between py-3">
            {hadVenmoOnOpenRef.current && (
              <Button
                type="button"
                variant="ghost"
                className="text-destructive"
                onClick={() =>
                  updateVenmo.mutate(
                    { venmoUsername: null },
                    {
                      onSuccess: () => onOpenChange(false),
                    }
                  )
                }
                disabled={updateVenmo.isPending}
              >
                {updateVenmo.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            )}
            <div className="flex gap-2 ml-auto">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={updateVenmo.isPending}>
                {updateVenmo.isPending ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function UpdateVenmoDialogForm({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { user } = useAuth();
  if (!user) {
    return null;
  }
  return (
    <UpdateVenmoDialogFormCore
      user={user}
      open={open}
      onOpenChange={onOpenChange}
    />
  );
}
