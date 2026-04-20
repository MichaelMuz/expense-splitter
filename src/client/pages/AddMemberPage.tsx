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
import { useCreateMember, useUpdateMember } from '../hooks/useMembers';
import { createMemberSchema, type CreateMemberInput } from '@/shared/schemas/member';
import type { UseMutationResult } from '@tanstack/react-query';
import { useGroup } from '../hooks/useGroups';
import { Loading } from '../components/layout/Loading';

function AddMemberPageCore({ groupId, initialName, mutation }: { groupId: string; initialName?: string; mutation: UseMutationResult<any, Error, CreateMemberInput>; }) {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateMemberInput>({
        resolver: zodResolver(createMemberSchema),
        defaultValues: initialName ? { "name": initialName } : undefined,
        mode: 'onBlur',
    });

    const onSubmit = (data: CreateMemberInput) => {
        mutation.mutate(
            data,
            { onSuccess: () => navigate(`/groups/${groupId}`) }
        );
    };

    return (
        <Layout>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Card className="w-full max-w-sm mx-auto">
                    <CardHeader>
                        <CardTitle>{initialName ? "Update member" : "Create virtual member"}</CardTitle>
                        <ErrorMessage error={mutation.error} />
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
                            disabled={mutation.isPending}
                            className="w-full"
                        >
                            {mutation.isPending ?
                                initialName ? 'Updating...' : 'Creating...'
                                : initialName ? 'Update' : 'Create'}
                        </Button>
                        <Button
                            variant="secondary"
                            disabled={mutation.isPending}
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

function UpdateMemberPage({ groupId, memberId }: { groupId: string, memberId: string }) {
    const { data: group, isLoading } = useGroup(groupId);
    const updateGroupMember = useUpdateMember(groupId, memberId);
    if (isLoading) {
        return <Loading name="member" />;
    }
    const name = group?.members.find(m => m.id === memberId)?.name;
    if (!name) return <Navigate to={`/groups/${groupId}`} replace />;

    return <AddMemberPageCore groupId={groupId} initialName={name} mutation={updateGroupMember} />;
}

function CreateMemberPage({ groupId }: { groupId: string }) {
    const createGroupMember = useCreateMember(groupId)
    return <AddMemberPageCore groupId={groupId} mutation={createGroupMember} />;
}

export default function AddMemberPage() {
    const { groupId, memberId } = useParams<{ groupId: string, memberId?: string }>();
    if (!groupId) return <Navigate to="/groups" replace />;
    return memberId ? <UpdateMemberPage groupId={groupId} memberId={memberId} /> : <CreateMemberPage groupId={groupId} />;
}
