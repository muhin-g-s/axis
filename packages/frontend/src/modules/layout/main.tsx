import { css } from '@/shared/ui/styled-system/css';
import type { ComponentChildren } from 'preact';

const containerStyle = css({
	flexGrow: 1,
  // minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  bg: 'radial-gradient(circle at top left, #667eea 0%, #764ba2 100%)',
  position: 'relative',
  // overflow: 'hidden',
})

interface MainLayoutProps {
	children: ComponentChildren;
}

export function MainLayout({ children }: MainLayoutProps) {
	return (
		<main class={containerStyle}>
			{children}
		</main>
	);
}
