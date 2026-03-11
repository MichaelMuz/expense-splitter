import { Link } from 'react-router-dom';
import { formatCurrency } from '../../../shared/utils/currency';
import { useExpenses, useDeleteExpense } from '../../hooks/useExpenses';
import { Loading } from '../layout/Loading';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Pencil, Trash2 } from 'lucide-react';

export function ExpenseList({ groupId }: { groupId: string }) {
  const { data: expenses, isLoading, error } = useExpenses(groupId);
  const deleteExpense = useDeleteExpense(groupId);

  const handleDelete = async (expenseId: string) => {
    if (window.confirm('Delete this expense?')) {
      await deleteExpense.mutateAsync(expenseId);
    }
  };

  if (isLoading) return <Loading name='expenses' />
  if (error) return <p>Failed to load expenses.</p>;
  if (!expenses || expenses.length === 0) return <p>No expenses yet.</p>;

  return (
    <ul>
      {expenses.map((expense) => (
        <Card key={expense.id}>
          {expense.name} — {formatCurrency(expense.totalAmount)}
          <Button variant="outline" size="icon" onClick={() => handleDelete(expense.id)}>
            <Trash2 />
          </Button>
          <Button variant="outline" size="icon" asChild>
            <Link to={`/groups/${groupId}/expenses/${expense.id}/edit`} ><Pencil /></Link>
          </Button>
        </Card>
      ))
      }
    </ul >);
}
