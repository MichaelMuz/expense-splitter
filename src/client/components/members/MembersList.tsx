import { Copy } from "lucide-react";
import type { Group } from "@/shared/schemas/group";
import { Button } from "../ui/button";
import { toast } from "sonner";


export function MembersList({ groupMembers, inviteCode }: { groupMembers: Group['members']; inviteCode: Group['inviteCode'] }) {

    const inviteUrl = `${window.location.origin}/groups/join/${inviteCode}`

    return (
        <div>
            Invite code: {inviteUrl}
            <Button variant="outline" size="icon" onClick={() => { navigator.clipboard.writeText(inviteUrl); toast("Copied!") }} > <Copy /></Button>
            <h2>Members</h2>
            <ul>
                {groupMembers.map((m) => (
                    <li key={m.id}>
                        {m.name}
                        {m.role === 'owner' ? ' (owner)' : ''}
                        {!m.userId ? ' (virtual)' : ''}
                    </li>
                ))}
            </ul>
        </div>
    )

}
