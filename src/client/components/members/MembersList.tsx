import { Copy } from 'lucide-react';
import type { Group } from '@/shared/schemas/group';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Link} from 'react-router-dom';
import { useAuth } from '@/client/hooks/useAuth';

export function MembersList({
  groupId,
  groupMembers,
  inviteCode,
}: {
  groupId: Group['id'];
  groupMembers: Group['members'];
  inviteCode: Group['inviteCode'];
}) {
  const { user } = useAuth();
  const userId = user!.id // page is within protected route

  const inviteUrl = `${window.location.origin}/groups/join/${inviteCode}`;
  const isOwner = groupMembers.some(m => m.role === "owner" && m.userId === userId)

  const canEdit = (m: Group['members'][number]) => (
    isOwner || m.userId === userId
  )
  const memberCard = (m: Group['members'][number]) => (
    <Card
      className="flex items-center px-4 py-2 justify-between"
    >
      {m.name}
      <div className="flex gap-x-2">
        {!m.userId && <Badge variant="outline">virtual</Badge>}
        {m.role === 'owner' && <Badge>owner</Badge>}
      </div>
    </Card>
  )

  return (
    <div className="flex gap-y-4 mt-4 flex-col">
      <Card className="flex items-center px-4 py-2 justify-between bg-muted">
        <div className="flex flex-col">
          <div>Invite code</div>
          <div className="text-sm text-muted-foreground">{inviteUrl}</div>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            navigator.clipboard.writeText(inviteUrl);
            toast('Copied!');
          }}
        >
          {' '}
          <Copy />
        </Button>
      </Card>
      <div className="flex flex-col gap-y-4">
        {groupMembers.map((m) => (
          <div key={m.id}>
            {canEdit(m) ? (
              <Link to={`/groups/${groupId}/members/${m.id}/edit`}>
                {memberCard(m)}
              </Link>
            ) : (
              memberCard(m)
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
