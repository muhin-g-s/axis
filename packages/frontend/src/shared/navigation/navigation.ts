import type { FunctionComponent } from 'preact';
import { lazy } from 'preact/compat';

export const RouteNames = {
  REGISTRATION: '/register',
  LOGIN: '/login',
} as const;

export type RouteNames = (typeof RouteNames)[keyof typeof RouteNames];

export const dynamicRoutesMap = {
  [RouteNames.REGISTRATION]: (): Promise<{ default: FunctionComponent }> => import('@/pages/registration/page'),
  [RouteNames.LOGIN]: (): Promise<{ default: FunctionComponent }> => import('@/pages/login/page'),
} satisfies Record<RouteNames, () => Promise<{ default: FunctionComponent }>>;

export const lazyRoutesMap = {
  [RouteNames.REGISTRATION]: lazy(() => dynamicRoutesMap[RouteNames.REGISTRATION]()),
  [RouteNames.LOGIN]: lazy(() => dynamicRoutesMap[RouteNames.LOGIN]()),
} satisfies Record<RouteNames, FunctionComponent>;
