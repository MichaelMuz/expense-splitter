import { Link, useNavigate } from 'react-router-dom';
import { useCreateGroup } from '../hooks/useGroups';
import { Layout } from '../components/layout/Layout';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createGroupSchema,
  type CreateGroupInput,
} from '@/shared/schemas/group';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ErrorMessage } from '../components/ui/form-error';

export default function CreateGroupPage() {
  const navigate = useNavigate();
  const createGroup = useCreateGroup();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateGroupInput>({
    resolver: zodResolver(createGroupSchema),
    mode: 'onBlur',
  });

  const onSubmit = (data: CreateGroupInput) => {
    createGroup.mutate(data, {
      onSuccess: (group) => navigate(`/groups/${group.id}`),
    });
  };

  return (
    <Layout>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="w-full max-w-sm mx-auto">
          <CardHeader>
            <CardTitle>Create new group</CardTitle>
            <ErrorMessage error={createGroup.error} />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <label>
                Group name
                <Input {...register('name')} />
                <ErrorMessage error={errors.name} />
              </label>

              <label>
                Your name
                <Input {...register('ownerName')} />
                <ErrorMessage error={errors.ownerName} />
              </label>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button
              type="submit"
              disabled={createGroup.isPending}
              className="w-full"
            >
              {createGroup.isPending ? 'Creating...' : 'Create'}
            </Button>
            <Button
              variant="secondary"
              disabled={createGroup.isPending}
              className="w-full"
              asChild
            >
              <Link to="/groups">Cancel</Link>
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Layout>
  );
}
