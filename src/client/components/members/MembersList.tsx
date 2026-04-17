import { Copy } from 'lucide-react';
import type { Group } from '@/shared/schemas/group';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';

export function MembersList({
  groupMembers,
  inviteCode,
}: {
  groupMembers: Group['members'];
  inviteCode: Group['inviteCode'];
}) {
  const inviteUrl = `${window.location.origin}/groups/join/${inviteCode}`;

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
          <Card
            key={m.id}
            className="flex items-center px-4 py-2 justify-between"
          >
            {m.name}
            <div className="flex gap-x-2">
              {!m.userId && <Badge variant="outline">virtual</Badge>}
              {m.role === 'owner' && <Badge>owner</Badge>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
