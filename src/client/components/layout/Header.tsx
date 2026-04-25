import { PiggyBank } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { LogOutIcon, UserIcon } from 'lucide-react';
import { useState } from 'react';
import UpdateVenmoDialogForm from '../users/UpdateVenmoDialogForm';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [venmoOpen, setVenmoOpen] = useState(false);

  return (
    <nav className="flex justify-between items-center px-6 py-3 border-b">
      <Link to="/">
        <strong>Expense Splitter</strong>
      </Link>
      <div className="flex gap-4">
        {isAuthenticated ? (
          <>
            <Button asChild variant="ghost">
              <Link to="/groups">Groups</Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  <UserIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setVenmoOpen(true)}>
                  <PiggyBank /> Venmo username
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive">
                  <LogOutIcon />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <UpdateVenmoDialogForm
              open={venmoOpen}
              onOpenChange={setVenmoOpen}
            />
          </>
        ) : (
          <>
            <Button asChild variant="ghost">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link to="/signup">Sign Up</Link>
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}
