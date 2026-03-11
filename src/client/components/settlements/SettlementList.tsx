import { useSettlements, useDeleteSettlement } from '@/client/hooks/useSettlements';
import { formatCurrency } from '../../../shared/utils/currency';
import { Loading } from '../layout/Loading';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';


export function SettlementList({ groupId }: { groupId: string }) {
    const { data: settlements, isLoading, error } = useSettlements(groupId);
    const deleteSettlement = useDeleteSettlement(groupId);

    const handleDelete = async (settlementId: string) => {
        if (window.confirm('Delete this settlement?')) {
            await deleteSettlement.mutateAsync(settlementId);
        }
    };

    if (isLoading) return <Loading name='settlements' />
    if (error) return <p>Failed to load settlements.</p>;
    if (!settlements || settlements.length === 0) return <p>No settlements yet.</p>;


    return (
        <div className='flex flex-col gap-y-4 mt-4'>
            {settlements.map((settlement) => (
                <Card key={settlement.id} className='flex items-center px-4 py-2 justify-between'>
                    <div className='flex flex-col'>
                        <div>{settlement.fromMember.name} to {settlement.toMember.name}</div>
                        <div className='text-sm text-muted-foreground'>{formatCurrency(settlement.amount)}</div>
                    </div>
                    <Button variant="outline" size="icon" onClick={() => handleDelete(settlement.id)}>
                        <Trash2 />
                    </Button>
                </Card>
            ))
            }
        </div >
    );
}
