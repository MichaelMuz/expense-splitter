import { useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { ExpenseList } from '../components/expenses/ExpenseList';
import { useGroup } from '../hooks/useGroups';
import { Layout } from '../components/layout/Layout';
import { Loading } from '../components/layout/Loading';
import { SettlementList } from '../components/settlements/SettlementList';
import { BalancesList } from '../components/balances/BalancesList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

function GroupDetailCore({ groupId }: { groupId: string }) {
  const navigate = useNavigate();
  const { data: group, isLoading, error } = useGroup(groupId);
  const [copied, setCopied] = useState(false);


  if (isLoading) return <Loading name='group' />
  if (error || !group) return <Layout><p>Failed to load group.</p></Layout>;

  const inviteUrl = `${window.location.origin}/groups/join/${group.inviteCode}`
  const copyOnClick = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000)
  }

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
          <button onClick={() => navigate(`/groups/${groupId}/expenses/new`)}>Add Expense</button>
          <ExpenseList groupId={groupId} />
        </TabsContent>

        <TabsContent value="settlements">
          <button onClick={() => navigate(`/groups/${groupId}/settlements/new`)}>Add Settlement</button>
          <SettlementList groupId={groupId} />
        </TabsContent>

        <TabsContent value="balances">
          <BalancesList groupId={groupId} members={group.members} />
        </TabsContent>

        <TabsContent value="members">
          <h2>Members</h2>
          Invite code: {inviteUrl}
          <button onClick={copyOnClick}>{copied ? "Copied" : "Copy"}</button>
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
    </Layout>
  );

}

export default function GroupDetailPage() {
  const { groupId } = useParams<{ groupId: string }>();
  if (!groupId) return <Navigate to="/groups" replace />;
  return <GroupDetailCore groupId={groupId} />
}
