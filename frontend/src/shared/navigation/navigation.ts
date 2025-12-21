import type { FunctionComponent } from 'preact';
import { lazy } from 'preact/compat';

export const RouteNames = {
  HOME: '/',
  TEST: '/test',
  TODO_DETAIL: '/todo/:id',
} as const;

export type RouteNames = (typeof RouteNames)[keyof typeof RouteNames];

export const dynamicRoutesMap = {
  [RouteNames.HOME]: () => import('@/pages/home/home-page'),
  [RouteNames.TEST]: () => import('@/pages/test/test-page'),
  [RouteNames.TODO_DETAIL]: () => import('@/pages/todo-detail/todo-detail-page'),
} satisfies Record<RouteNames, () => Promise<{ default: FunctionComponent }>>;

export const lazyRoutesMap = {
  [RouteNames.HOME]: lazy(() => dynamicRoutesMap[RouteNames.HOME]()),
  [RouteNames.TEST]: lazy(() => dynamicRoutesMap[RouteNames.TEST]()),
  [RouteNames.TODO_DETAIL]: lazy(() => dynamicRoutesMap[RouteNames.TODO_DETAIL]()),
} satisfies Record<RouteNames, FunctionComponent>;
