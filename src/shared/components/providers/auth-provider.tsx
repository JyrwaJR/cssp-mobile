import { useEffect } from 'react';
import { useAuthStore } from '@stores/auth.store';

type Props = {
  children: React.ReactNode;
};

export const AuthInitializer = ({ children }: Props) => {
  const hydrate = useAuthStore((s) => s._hydrate);

  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
      hydrate();
    } else {
      const unsub = useAuthStore.persist.onFinishHydration(() => {
        hydrate();
      });
      return () => unsub();
    }
  }, [hydrate]);

  return <>{children}</>;
};
