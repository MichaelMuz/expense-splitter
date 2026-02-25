import { type ReactNode } from 'react';
import { Header } from './Header';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
