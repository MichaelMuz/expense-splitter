import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

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
import { useCreateMember } from '../hooks/useMembers';
import { createMemberSchema, type CreateMemberInput } from '@/shared/schemas/member';

function CreateMemberPageCore({ groupId }: { groupId: string; }) {
    const navigate = useNavigate();
    const createMember = useCreateMember(groupId);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateMemberInput>({
        resolver: zodResolver(createMemberSchema),
        mode: 'onBlur',
    });

    const onSubmit = (data: CreateMemberInput) => {
        createMember.mutate(
            data,
            { onSuccess: () => navigate(`/groups/${groupId}`) }
        );
    };

    return (
        <Layout>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Card className="w-full max-w-sm mx-auto">
                    <CardHeader>
                        <CardTitle>Create virtual member</CardTitle>
                        <ErrorMessage error={createMember.error} />
                    </CardHeader>
                    <CardContent>
                        <label>
                            Name
                            <Input
                                type="text"
                                {...register('name')}
                            />
                            <ErrorMessage error={errors.name} />
                        </label>
                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                        <Button
                            type="submit"
                            disabled={createMember.isPending}
                            className="w-full"
                        >
                            {createMember.isPending ? 'Creating...' : 'Create'}
                        </Button>
                        <Button
                            variant="secondary"
                            disabled={createMember.isPending}
                            className="w-full"
                            asChild
                        >
                            <Link to={`/groups/${groupId}`}>Cancel</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </Layout >
    );
}

export default function CreateMemberPage() {
    const { groupId } = useParams<{ groupId: string }>();
    if (!groupId) return <Navigate to="/groups" replace />;
    return <CreateMemberPageCore groupId={groupId} />;
}
