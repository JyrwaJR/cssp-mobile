import { useRef } from 'react';
import { useRouter, type Href } from 'expo-router';

type NavigationMethod = 'push' | 'replace';

export const useNavigationLock = () => {
  const router = useRouter();
  const locked = useRef(false);

  const navigate = (href: Href, method: NavigationMethod = 'push') => {
    if (locked.current) return;

    locked.current = true;

    router[method](href);

    setTimeout(() => {
      locked.current = false;
    }, 500);
  };

  return navigate;
};
