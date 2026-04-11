import { Link } from 'react-router-dom';
import { useGroups } from '../hooks/useGroups';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

export default function GroupsPage() {
  const { data: groups, isLoading, error } = useGroups();

  return (
    <Layout>
      <div className="flex items-center justify-between">
        <h1 className='font-bold text-lg'>My Groups</h1>
        <Button asChild>
          <Link to="/groups/create">Create Group</Link>
        </Button>
      </div>

      {isLoading && <p>Loading groups...</p>}
      {error && <p>Failed to load groups.</p>}
      {groups && groups.length === 0 && <p>No groups yet.</p>}

      {groups && groups.length > 0 && (
        <div className='flex flex-col gap-y-4 mt-4'>
          {groups.map((group) => (
            <Link to={`/groups/${group.id}`} key={group.id}>
              <Card className='flex flex-col px-4 py-2 hover:bg-muted'>
                <span>{group.name}</span>
                <span className='text-sm text-muted-foreground'>{group.members.length} members</span>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </Layout>
  );
}
