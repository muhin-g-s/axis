import type { ComponentChildren } from 'preact';
import { Provider } from '@/shared/ui/provider';

interface ProvidersProps {
  children: ComponentChildren;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <Provider>
      {children}
    </Provider>
  );
}
