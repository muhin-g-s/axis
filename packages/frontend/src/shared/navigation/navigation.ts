import type { FunctionComponent } from 'preact';
import { lazy } from 'preact/compat';

export const RouteNames = {
  REGISTRATION: '/register',
} as const;

export type RouteNames = (typeof RouteNames)[keyof typeof RouteNames];

export const dynamicRoutesMap = {
  [RouteNames.REGISTRATION]: (): Promise<{ default: FunctionComponent }> => import('@/pages/registration/registration-page'),
} satisfies Record<RouteNames, () => Promise<{ default: FunctionComponent }>>;

export const lazyRoutesMap = {
  [RouteNames.REGISTRATION]: lazy(() => dynamicRoutesMap[RouteNames.REGISTRATION]()),
} satisfies Record<RouteNames, FunctionComponent>;
