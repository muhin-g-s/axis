import type { ComponentChildren } from 'preact';

interface ProvidersProps {
  children: ComponentChildren;
}

export function Providers({ children }: ProvidersProps) {
  return (
    {children}
  );
}
