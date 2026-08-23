import type { Href } from 'expo-router';

type PageRouteMap<T> = {
  [K in keyof T]: T[K] extends object ? PageRouteMap<T[K]> : Href;
};

const routes = {
  HOME: '/',
  WEB: '/web',
  AUTH: {
    HOME: '/auth',
    REGISTER: '/auth/register',
    REG_INSTRUCTION: '/auth/reg-instruction',
  },
} as const;

export const PAGE_ROUTES: PageRouteMap<typeof routes> = routes;
