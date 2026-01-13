import type { ComponentChildren } from 'preact';
import { DiProvider } from '@/infrastructure/di/context.di';

interface ProvidersProps {
  children: ComponentChildren;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <DiProvider>
      {children}
    </DiProvider>
  );
}
