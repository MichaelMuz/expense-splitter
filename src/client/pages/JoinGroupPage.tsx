import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useJoinGroup, usePreviewGroup } from '../hooks/useGroups';
import { Layout } from '../components/layout/Layout';

import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { joinInviteSchema, type GroupMember, type JoinInviteInput } from '@/shared/schemas/group';
import { Loading } from '../components/layout/Loading';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';

function JoinGroupPageCore({ inviteCode, unclaimedMembers }: { inviteCode: string; unclaimedMembers: GroupMember[] }) {
  const navigate = useNavigate();
  const joinGroup = useJoinGroup();

  const canClaim = unclaimedMembers.length > 0

  const { register, handleSubmit, watch, formState: { errors }, control } = useForm<JoinInviteInput>({
    resolver: zodResolver(joinInviteSchema),
    defaultValues: { type: canClaim ? "claim" : "new" },
    mode: "onBlur"
  })
  const type = watch("type")

  const onSubmit = (data: JoinInviteInput) => {
    joinGroup.mutate({ inviteCode, joinInput: data }, { onSuccess: result => navigate(`/groups/${result.group.id}`) })
  };


  return (
    <Layout >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="w-full max-w-sm mx-auto">
          <CardHeader>
            <CardTitle>Join a group</CardTitle>
            {joinGroup.isError && <p>{joinGroup.error.message}</p>}
          </CardHeader>
          <CardContent>
            <div className='flex flex-col gap-3'>
              {canClaim &&
                <Controller name='type' control={control} render={({ field}) => (
                  <RadioGroup value={field.value} onValueChange={field.onChange} className='w-fit flex flex-col'>
                    <label className='flex items-center gap-3'>
                      <RadioGroupItem value="claim" />
                      Claim existing member
                    </label>
                    <label className='flex items-center gap-3'>
                      <RadioGroupItem value="new" />
                      Join as new
                    </label>
                  </RadioGroup>
                )} />
              }

              {type === "new" &&
                <label>Member Name
                  <Input {...register("memberName")} />
                  {"memberName" in errors && errors.memberName?.message}
                </label>}
              {type === "claim" &&
                <select {...register("memberId")}>
                  {unclaimedMembers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>}

            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button type="submit" disabled={joinGroup.isPending} className="w-full">
              {joinGroup.isPending ? 'Joining...' : 'Join Group'}
            </Button>
            <Button variant='secondary' disabled={joinGroup.isPending} className="w-full" asChild>
              <Link to='/groups'>Cancel</Link>
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Layout >
  );
}

function JoinGroupPageGate({ inviteCode }: { inviteCode: string }) {
  const previewGroup = usePreviewGroup(inviteCode);

  if (previewGroup.error) return <p>{previewGroup.error.message}</p>;
  if (previewGroup.isLoading) return <Loading name="group to join" />;
  if (!previewGroup.data) return <p>Invalid Invite Code</p>;

  const unclaimedMembers = previewGroup.data.members.filter(m => !m.userId);
  return <JoinGroupPageCore inviteCode={inviteCode} unclaimedMembers={unclaimedMembers} />;
}

export default function JoinGroupPage() {
  const { inviteCode } = useParams<{ inviteCode: string }>();
  if (!inviteCode) return <Navigate to="/groups" replace />;
  return <JoinGroupPageGate inviteCode={inviteCode} />;
}
