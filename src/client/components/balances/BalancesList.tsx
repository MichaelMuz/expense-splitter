import type { Group } from "@/shared/schemas/group";
import { useExpenses } from "@/client/hooks/useExpenses";
import { useSettlements } from "@/client/hooks/useSettlements";
import { Loading } from "../layout/Loading";
import { calculateNetBalances } from "@/shared/utils/calculations";
import { formatCurrency } from "@/shared/utils/currency";
import { Link } from "react-router-dom";
import { addQueryParams } from "@/client/lib/utils";
import { Card } from '../ui/card';
import { Button } from '../ui/button';


export function BalancesList({ groupId, members }: { groupId: string; members: Group['members'] }) {
    const expenses = useExpenses(groupId);
    const settlements = useSettlements(groupId);

    const isLoading = expenses.isLoading || settlements.isLoading
    const errorMsg = [expenses, settlements].map(e => e.isError ? e.error.message : undefined).filter(e => !!e).at(0)

    if (isLoading || !expenses.data || !settlements.data) return <Loading name='balances' />;
    if (errorMsg) return <p>Failed to load balances</p>;

    const netBalances = calculateNetBalances(expenses.data, settlements.data);
    const memberIdToName = new Map(members.map(m => [m.id, m.name]))


    return (
        <div className='flex flex-col gap-y-4 mt-4'>
            {Array.from(netBalances).map(([owedId, owerMap]) => (
                Array.from(owerMap).map(([owerId, amount]) =>
                    <Card key={`${owedId}-${owerId}`} className='flex items-center px-4 py-2 justify-between'>
                        <div className='flex flex-col'>
                            <div>{memberIdToName.get(owerId) || "ERROR"} owes {memberIdToName.get(owedId) || "ERROR"}</div>
                            <div className='text-sm text-muted-foreground'>{formatCurrency(amount)}</div>
                        </div>
                        <Button variant="outline" asChild>
                            <Link to={addQueryParams(`/groups/${groupId}/settlements/new`, { from: owerId, to: owedId, amount })}>
                                Settle up
                            </Link>
                        </Button>
                    </Card>
                )))
            }
        </div >
    );
}
