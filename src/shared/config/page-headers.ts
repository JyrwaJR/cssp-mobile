import type { ReactNode } from 'react';

export interface PageHeaderConfig {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  showDrawer?: boolean;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
  bottomContent?: ReactNode;
  background?: string;
}

export const PAGE_HEADERS = {
  // TABS
  '/': { title: 'Pensioner', showDrawer: true },
  '/photo': { title: 'Salary Statement', showDrawer: true },
  '/profile': { title: 'My Profile', showDrawer: true },
  '/withdrawal': { title: 'Withdrawal', showBackButton: false, showDrawer: true },

  // pages
  '/auth': { title: 'Pensioner', showBackButton: true },
  '/auth/register': { title: 'Register/Update-Password', showBackButton: true },
  '/auth/reg-instruction': { title: 'Instructions', showBackButton: true },
  '/contact': { title: 'My Leaves', showBackButton: true },
  'change-password': { title: 'Change Password', showBackButton: true },
  '/about': { title: 'About Us', showBackButton: true },

  '/web': { title: '', showBackButton: true, showDrawer: false },
} as const satisfies Record<string, PageHeaderConfig>;

export type PageHeaderRoute = keyof typeof PAGE_HEADERS;
