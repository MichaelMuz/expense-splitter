import { Copy } from "lucide-react";
import { useParams, useNavigate, Navigate, Link } from 'react-router-dom';
import { ExpenseList } from '../components/expenses/ExpenseList';
import { useGroup } from '../hooks/useGroups';
import { Layout } from '../components/layout/Layout';
import { Loading } from '../components/layout/Loading';
import { SettlementList } from '../components/settlements/SettlementList';
import { BalancesList } from '../components/balances/BalancesList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { toast } from "sonner";

function GroupDetailCore({ groupId }: { groupId: string }) {
  const navigate = useNavigate();
  const { data: group, isLoading, error } = useGroup(groupId);


  if (isLoading) return <Loading name='group' />
  if (error || !group) return <Layout><p>Failed to load group.</p></Layout>;

  const inviteUrl = `${window.location.origin}/groups/join/${group.inviteCode}`

  return (
    <Layout>
      <h1>{group.name}</h1>

      <Tabs defaultValue="expenses" >
        <TabsList>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="settlements">Settlements</TabsTrigger>
          <TabsTrigger value="balances">Balances</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>

        <TabsContent value="expenses">
          <Button asChild>
            <Link to={`/groups/${groupId}/expenses/new`}>Add expense</Link>
          </Button>
          <ExpenseList groupId={groupId} />
        </TabsContent>

        <TabsContent value="settlements">
          <Button asChild>
            <Link to={`/groups/${groupId}/settlements/new`}>Add settlement</Link>
          </Button>
          <SettlementList groupId={groupId} />
        </TabsContent>

        <TabsContent value="balances">
          <BalancesList groupId={groupId} members={group.members} />
        </TabsContent>

        <TabsContent value="members">
          <h2>Members</h2>
          Invite code: {inviteUrl}
          <Button variant="outline" size="icon" onClick={() => { navigator.clipboard.writeText(inviteUrl); toast("Copied!") }} > <Copy /></Button>
          <ul>
            {group.members.map((m) => (
              <li key={m.id}>
                {m.name}
                {m.role === 'owner' ? ' (owner)' : ''}
                {!m.userId ? ' (virtual)' : ''}
              </li>
            ))}
          </ul>
        </TabsContent>
      </Tabs>
    </Layout >
  );

}

export default function GroupDetailPage() {
  const { groupId } = useParams<{ groupId: string }>();
  if (!groupId) return <Navigate to="/groups" replace />;
  return <GroupDetailCore groupId={groupId} />
}
