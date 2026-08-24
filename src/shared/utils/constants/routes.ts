import type { Href } from 'expo-router';

type PageRouteMap<T> = {
  [K in keyof T]: T[K] extends object ? PageRouteMap<T[K]> : Href;
};

const routes = {
  HOME: '/' as Href,
  AUTH: {
    HOME: '/auth' as Href,
    REGISTER: '/auth/register' as Href,
    REG_INSTRUCTION: '/auth/reg-instruction' as Href,
  },
  CHANGE_PASSWORD: '/change-password' as Href,
  CONTACT_US: '/contact-us' as Href,
  ABOUT_US: '/about' as Href,
  FACE_RECOGNITION: '/face-recognition' as Href,
  PRIVACY: '/privacy-policy' as Href,
  USER_MANUAL: '/user-manual' as Href,
} as const;

export const PAGE_ROUTES: PageRouteMap<typeof routes> = routes;
