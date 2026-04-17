import { Link } from 'react-router-dom';
import { formatCurrency } from '../../../shared/utils/currency';
import { useExpenses, useDeleteExpense } from '../../hooks/useExpenses';
import { Loading } from '../layout/Loading';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';

export function ExpenseList({ groupId }: { groupId: string }) {
  const { data: expenses, isLoading, error } = useExpenses(groupId);
  const deleteExpense = useDeleteExpense(groupId);

  const handleDelete = async (expenseId: string) => {
    if (window.confirm('Delete this expense?')) {
      await deleteExpense.mutateAsync(expenseId);
    }
  };

  if (isLoading) return <Loading name="expenses" />;
  if (error) return <p>Failed to load expenses.</p>;
  if (!expenses || expenses.length === 0) return <p>No expenses yet.</p>;

  return (
    <div className="flex flex-col gap-y-4 mt-4">
      {expenses.map((expense) => (
        <Card
          key={expense.id}
          className="flex items-center px-4 py-2 justify-between hover:bg-muted relative"
        >
          <Link
            to={`/groups/${groupId}/expenses/${expense.id}/edit`}
            className="flex flex-col after:absolute after:inset-0"
          >
            <div>{expense.name}</div>
            <div className="text-sm text-muted-foreground">
              {formatCurrency(expense.totalAmount)}
            </div>
          </Link>
          <Button
            variant="outline"
            size="icon"
            className="relative z-10"
            onClick={() => handleDelete(expense.id)}
          >
            <Trash2 />
          </Button>
        </Card>
      ))}
    </div>
  );
}
