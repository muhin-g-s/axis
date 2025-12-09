import type { FunctionComponent } from 'preact';
import { lazy } from 'preact/compat';

export const RouteNames = {
  HOME: '/',
  TEST: '/test',
} as const;

export type RouteNames = (typeof RouteNames)[keyof typeof RouteNames];

export const dynamicRoutesMap = {
  [RouteNames.HOME]: () => import('@/pages/home/home-page'),
  [RouteNames.TEST]: () => import('@/pages/test/test-page'),
} satisfies Record<RouteNames, () => Promise<{ default: FunctionComponent }>>;

export const lazyRoutesMap = {
  [RouteNames.HOME]: lazy(() => dynamicRoutesMap[RouteNames.HOME]()),
  [RouteNames.TEST]: lazy(() => dynamicRoutesMap[RouteNames.TEST]()),
} satisfies Record<RouteNames, FunctionComponent>;
