import { useParams, useNavigate, Navigate, useSearchParams, Link } from 'react-router-dom';
import { useGroup } from '../hooks/useGroups';
import { Layout } from '../components/layout/Layout';
import { Loading } from '../components/layout/Loading';
import { useCreateSettlement } from '../hooks/useSettlements';
import { MoneyInput } from '../components/ui/formatted-input';
import { createSettlementSchema, type CreateSettlementInput } from '@/shared/schemas/settlement';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import type { Group } from '@/shared/schemas/group';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';


function SettlementPageCore({ group }: { group: Group }) {
  const navigate = useNavigate();
  const createSettlement = useCreateSettlement(group.id);

  const [searchParams] = useSearchParams();
  const initialAmount = searchParams.get("amount")
  const initialFromMemberId = searchParams.get("from") ?? undefined
  const initialToMemberId = searchParams.get("to") ?? undefined

  const { handleSubmit, control, formState: { errors } } = useForm<CreateSettlementInput>({
    resolver: zodResolver(createSettlementSchema),
    mode: "onBlur",
    defaultValues: {
      fromGroupMemberId: group.members.find(m => m.id === initialFromMemberId)?.id ?? undefined,
      toGroupMemberId: group.members.find(m => m.id === initialToMemberId)?.id ?? undefined,
      amount: initialAmount ? parseFloat(initialAmount) : undefined
    }
  });

  const onSubmit = (data: CreateSettlementInput) => {
    createSettlement.mutate(data, { onSuccess: () => navigate(`/groups/${group.id}`) })
  }

  return (
    <Layout>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="w-full max-w-sm mx-auto">

          <CardHeader>
            <CardTitle>Record Settlement in {group.name}</CardTitle>
            {createSettlement.isError && <p>{createSettlement.error.message}</p>}
          </CardHeader>
          <CardContent className='flex flex-col gap-3'>

            <label>Sender
              <Controller name="fromGroupMemberId" control={control} render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a sender" />
                  </SelectTrigger>
                  <SelectContent>
                    {group.members.map(m =>
                      <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              )} />
              {errors.fromGroupMemberId?.message}
            </label>

            <label>Amount
              <MoneyInput name="amount" control={control} />
              {errors.amount && <p>{errors.amount.message}</p>}
            </label>

            <label>Receiver
              <Controller name="toGroupMemberId" control={control} render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a receiver" />
                  </SelectTrigger>
                  <SelectContent>
                    {group.members.map(m =>
                      <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              )} />
              {errors.toGroupMemberId?.message}
            </label>

          </CardContent>

          <CardFooter className="flex-col gap-2">
            <Button type="submit" disabled={createSettlement.isPending} className="w-full">
              {createSettlement.isPending ? 'Creating...' : 'Create'}
            </Button>
            <Button variant='secondary' disabled={createSettlement.isPending} className="w-full" asChild>
              <Link to='/groups/${group.id}'>Cancel</Link>
            </Button>
          </CardFooter>
        </Card>
      </form >

    </Layout >
  );
}
function SettlementPageGuard({ groupId }: { groupId: string }) {
  const { data: group, isLoading } = useGroup(groupId);
  if (isLoading) return <Loading name='group' />
  if (!group) return <Layout><p>Group not found.</p></Layout>;
  return <SettlementPageCore group={group} />

}
export default function SettlementPage() {
  const { groupId } = useParams<{ groupId: string }>();

  if (!groupId) return <Navigate to="/groups" replace />;
  return <SettlementPageGuard groupId={groupId} />
}
