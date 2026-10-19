import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

export type Route =
  | { name: 'login' }
  | { name: 'dashboard' }
  | { name: 'buy' }
  | { name: 'product'; id: string }
  | { name: 'sell' }
  | { name: 'free' }
  | { name: 'checkout'; listingId: string; qty: number }
  | { name: 'order-confirmation'; orderId: string }
  | { name: 'track'; orderId: string }
  | { name: 'orders' }
  | { name: 'my-listings' }
  | { name: 'profile' }
  | { name: 'impact' };

interface RouterValue {
  route: Route;
  navigate: (route: Route) => void;
}

const RouterContext = createContext<RouterValue | null>(null);

function parseHash(): Route {
  const hash = window.location.hash.replace(/^#/, '');
  const [name, ...rest] = hash.split('/');
  switch (name) {
    case 'dashboard': return { name: 'dashboard' };
    case 'buy': return { name: 'buy' };
    case 'product': return { name: 'product', id: rest[0] ?? '' };
    case 'sell': return { name: 'sell' };
    case 'free': return { name: 'free' };
    case 'checkout': return { name: 'checkout', listingId: rest[0] ?? '', qty: Number(rest[1] ?? '1') };
    case 'order-confirmation': return { name: 'order-confirmation', orderId: rest[0] ?? '' };
    case 'track': return { name: 'track', orderId: rest[0] ?? '' };
    case 'orders': return { name: 'orders' };
    case 'my-listings': return { name: 'my-listings' };
    case 'profile': return { name: 'profile' };
    case 'impact': return { name: 'impact' };
    default: return { name: 'login' };
  }
}

function toHash(route: Route): string {
  switch (route.name) {
    case 'product': return `product/${route.id}`;
    case 'checkout': return `checkout/${route.listingId}/${route.qty}`;
    case 'order-confirmation': return `order-confirmation/${route.orderId}`;
    case 'track': return `track/${route.orderId}`;
    default: return route.name;
  }
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>(() => parseHash());

  useEffect(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const navigate = (next: Route) => {
    window.location.hash = toHash(next);
    setRoute(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return <RouterContext.Provider value={{ route, navigate }}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used within RouterProvider');
  return ctx;
}
