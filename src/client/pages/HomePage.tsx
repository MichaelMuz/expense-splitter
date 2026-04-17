import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/button';

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/groups" replace />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-3xl font-bold">Expense Splitter</h1>
      <p className="text-muted-foreground">
        Split expenses with friends, track balances, and settle up easily.
      </p>
      <div className="flex gap-2">
        <Button asChild>
          <Link to="/signup">Get Started</Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link to="/login">Login</Link>
        </Button>
      </div>
    </div>
  );
}
