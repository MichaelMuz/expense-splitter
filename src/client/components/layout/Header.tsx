import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="flex justify-between px-6 py-3 border-b">
      <Link to="/"><strong>Expense Splitter</strong></Link>
      <div className="flex gap-4">
        {isAuthenticated ? (
          <>
            <Link to="/groups">Groups</Link>
            <span>{user?.email}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
