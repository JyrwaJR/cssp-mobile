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
  '/dlc': { title: 'Submit Digital Life Certificate', showDrawer: true },
  '/profile': { title: 'My Profile', showDrawer: true },

  // pages
  '/withdrawal': { title: 'Withdrawal', showBackButton: false, showDrawer: true },
  '/auth': { title: 'Pensioner', showBackButton: true },
  '/auth/register': { title: 'Register/Update-Password', showBackButton: true },
  '/auth/reg-instruction': { title: 'Instructions', showBackButton: true },
  '/contact-us': { title: 'Contact Us', showBackButton: true },
  '/change-password': { title: 'Change Password', showBackButton: true },
  '/about': { title: 'About Us', showBackButton: true },
  '/face-recognition': { title: 'Photo Verification', showBackButton: true },

  '/user-manual': { title: 'Manual', showBackButton: true, showDrawer: false },
  '/privacy-policy': { title: 'Privacy Policy', showBackButton: true, showDrawer: false },
} as const satisfies Record<string, PageHeaderConfig>;

export type PageHeaderRoute = keyof typeof PAGE_HEADERS;
