import { Layout } from './Layout';

export function Loading({
  name,
  fullPage,
}: {
  name?: string;
  fullPage?: boolean;
}) {
  const fullMessage = name ? `Loading ${name}...` : 'Loading...';
  const content = (
    <p className="text-center text-muted-foreground">{fullMessage}</p>
  );
  return fullPage ? <Layout>{content}</Layout> : content;
}
