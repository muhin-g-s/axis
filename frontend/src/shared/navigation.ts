export const RouteNames = {
  HOME: 'home',
} as const;

export type RouteNames = keyof typeof RouteNames;
