import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useGroup } from '../hooks/useGroups';
import { Layout } from '../components/layout/Layout';
import { Loading } from '../components/layout/Loading';
import ExpenseForm from '../components/expenses/ExpenseForm';
import { useCreateExpense, useExpense, useUpdateExpense } from '../hooks/useExpenses';
import type { CreateExpenseInput, Expense } from '@/shared/schemas/expense';
import type { UseMutationResult } from '@tanstack/react-query';

function AddExpenseCore({ groupId, initialData, mutation }: { groupId: string; initialData?: Expense; mutation: UseMutationResult<Expense, Error, CreateExpenseInput> }) {
  const navigate = useNavigate();
  const { data: group, isLoading } = useGroup(groupId);

  const createExpense = (expense: CreateExpenseInput) => {
    mutation.mutate(expense, { onSuccess: () => navigate(`/groups/${groupId}`) })
  }

  if (isLoading) return <Loading name="group" />;
  else if (!group) return <Navigate to="/groups" replace />;

  return (
    <Layout>
      <ExpenseForm initialData={initialData} group={group} isPending={mutation.isPending} onSubmit={createExpense} errorMessage={mutation.isError ? mutation.error.message : undefined} />
    </Layout >
  );
}

function EditExpense({ groupId, expenseId }: { groupId: string, expenseId: string }) {
  const expense = useExpense(groupId, expenseId)
  const updateExpense = useUpdateExpense(groupId, expenseId)

  if (expense.isLoading) return <Loading name="expense" />
  else if (expense.isError || !expense.data) return <p>Error loading expense {expense.error?.message || ""}</p>

  return <AddExpenseCore groupId={groupId} initialData={expense.data} mutation={updateExpense} />

}

function CreateExpense({ groupId }: { groupId: string }) {
  const createExpense = useCreateExpense(groupId)
  return <AddExpenseCore groupId={groupId} mutation={createExpense} />
}

export default function AddExpensePage() {
  const { groupId } = useParams<{ groupId: string }>();
  const { expenseId } = useParams<{ expenseId: string }>();

  if (!groupId) return <Navigate to="/groups" replace />;
  return expenseId ? <EditExpense groupId={groupId} expenseId={expenseId} /> : <CreateExpense groupId={groupId} />
}
