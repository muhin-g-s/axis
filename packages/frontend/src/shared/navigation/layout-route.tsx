import { Suspense } from 'preact/compat';
import { Route } from 'wouter-preact';
import { lazyRoutesMap, type RouteNames } from './navigation';
import { BasePreloader } from './base-preloader';
import { routeLayoutMap, defaultLayout } from './route-layout-config';
import { type ComponentType } from 'preact';

interface LayoutRouteProps {
  path: RouteNames;
  Preloader: ComponentType;
}

export function LayoutRoute({ path, Preloader }: LayoutRouteProps) {
  const Component = lazyRoutesMap[path];
  const LayoutComponent = routeLayoutMap[path] ?? defaultLayout;

	const x: number = "hello"; // должно вызвать ошибку

  const PageContent = () => (
    <Suspense fallback={<Preloader />}>
      <Component />
    </Suspense>
  );

  if (LayoutComponent) {
    return (
      <Route path={path}>
        <LayoutComponent>
          <PageContent />
        </LayoutComponent>
      </Route>
    );
  }

  return (
    <Route path={path}>
      <PageContent />
    </Route>
  );
}
