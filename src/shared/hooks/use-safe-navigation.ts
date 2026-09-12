import { useCallback, useRef } from 'react';
import { useRouter, type Href } from 'expo-router';

type NavigationMethod = 'push' | 'replace';

export const useSafeNavigation = () => {
  const router = useRouter();
  const locked = useRef(false);

  const navigate = useCallback(
    (href: Href, method: NavigationMethod = 'push') => {
      if (locked.current) return;

      locked.current = true;

      try {
        router[method](href);
      } finally {
        setTimeout(() => {
          locked.current = false;
        }, 500);
      }
    },
    [router]
  );

  return navigate;
};
