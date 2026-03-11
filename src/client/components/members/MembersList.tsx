import { Copy } from "lucide-react";
import type { Group } from "@/shared/schemas/group";
import { Button } from "../ui/button";
import { toast } from "sonner";


export function MembersList({ group }: { group: Group; }) {

    const inviteUrl = `${window.location.origin}/groups/join/${group.inviteCode}`

    return (
        <div>
            Invite code: {inviteUrl}
            <Button variant="outline" size="icon" onClick={() => { navigator.clipboard.writeText(inviteUrl); toast("Copied!") }} > <Copy /></Button>
            <h2>Members</h2>
            <ul>
                {group.members.map((m) => (
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
