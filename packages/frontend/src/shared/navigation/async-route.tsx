import type { FunctionComponent } from 'preact';
import { BasePreloader } from './base-preloader';
import { Suspense } from 'preact/compat';
import { lazyRoutesMap, type RouteNames } from './navigation';
import { Route } from 'wouter-preact';

interface AsyncRouteProps {
  path: RouteNames;
  Preloader?: FunctionComponent;
}

export function AsyncRoute({ path, Preloader = BasePreloader }: AsyncRouteProps) {
  const Component = lazyRoutesMap[path];

  return (
    <Route path={path}>
      <Suspense fallback={<Preloader />}>
        <Component />
      </Suspense>
    </Route>
  )
}
