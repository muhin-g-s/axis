import type { RouteNames } from './navigation';
import { MainLayout } from '@/modules/layout';

// Define available layouts
export type LayoutType =
  | typeof MainLayout
  | null;

export interface RouteLayoutConfig {
  path: RouteNames;
  layout: LayoutType;
}

export const routeLayoutMap: Partial<Record<RouteNames, LayoutType>> = {};

export const defaultLayout: LayoutType = MainLayout;
