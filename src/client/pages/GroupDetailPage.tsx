import { useParams, Navigate, Link } from 'react-router-dom';
import { ExpenseList } from '../components/expenses/ExpenseList';
import { useGroup } from '../hooks/useGroups';
import { Layout } from '../components/layout/Layout';
import { Loading } from '../components/layout/Loading';
import { SettlementList } from '../components/settlements/SettlementList';
import { BalancesList } from '../components/balances/BalancesList';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { MembersList } from '../components/members/MembersList';

function GroupDetailCore({ groupId }: { groupId: string }) {
  const { data: group, isLoading, error } = useGroup(groupId);

  if (isLoading) return <Loading name="group" fullPage />;
  if (error || !group)
    return (
      <Layout>
        <p>Failed to load group.</p>
      </Layout>
    );

  return (
    <Layout>
      <h1 className="font-bold text-lg text-center">{group.name}</h1>

      <Tabs defaultValue="expenses">
        <div className="flex justify-center">
          <TabsList>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="settlements">Settlements</TabsTrigger>
            <TabsTrigger value="balances">Balances</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="expenses">
          <Button asChild>
            <Link to={`/groups/${groupId}/expenses/new`}>Add expense</Link>
          </Button>
          <ExpenseList groupId={groupId} />
        </TabsContent>

        <TabsContent value="settlements">
          <Button asChild>
            <Link to={`/groups/${groupId}/settlements/new`}>
              Add settlement
            </Link>
          </Button>
          <SettlementList groupId={groupId} />
        </TabsContent>

        <TabsContent value="balances">
          <BalancesList groupId={groupId} members={group.members} />
        </TabsContent>

        <TabsContent value="members">
          <Button asChild>
            <Link to={`/groups/${groupId}/members/new`}>Add virtual member</Link>
          </Button>
          <MembersList
            groupId={group.id}
            groupMembers={group.members}
            inviteCode={group.inviteCode}
          />
        </TabsContent>
      </Tabs>
    </Layout>
  );
}

export default function GroupDetailPage() {
  const { groupId } = useParams<{ groupId: string }>();
  if (!groupId) return <Navigate to="/groups" replace />;
  return <GroupDetailCore groupId={groupId} />;
}
