import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Claim, Listing, Order, User } from '@/types';
import { SEED_LISTINGS } from '@/data/seed';

const KEYS = {
  users: 'w2w_users',
  session: 'w2w_session',
  listings: 'w2w_listings',
  orders: 'w2w_orders',
  claims: 'w2w_claims',
  seeded: 'w2w_seeded_v2',
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('localStorage write failed', e);
  }
}

function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

interface StoreContextValue {
  user: User | null;
  users: User[];
  listings: Listing[];
  orders: Order[];
  claims: Claim[];
  register: (data: Omit<User, 'id' | 'createdAt'>) => { ok: boolean; error?: string };
  login: (email: string, password: string) => { ok: boolean; error?: string };
  loginDemo: () => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  addListing: (data: Omit<Listing, 'id' | 'createdAt' | 'sellerId' | 'sellerName' | 'status'>) => Listing;
  updateListing: (id: string, data: Partial<Listing>) => void;
  deleteListing: (id: string) => void;
  markListingStatus: (id: string, status: Listing['status']) => void;
  reduceListingQuantity: (id: string, qty: number) => void;
  addOrder: (data: Omit<Order, 'id' | 'createdAt' | 'status' | 'statusHistory'>) => Order;
  advanceOrderStatus: (orderId: string) => void;
  addClaim: (listingId: string) => { ok: boolean; error?: string; claim?: Claim };
  updateClaimStatus: (claimId: string, status: Claim['status']) => void;
  getUserListings: (userId: string) => Listing[];
  getUserOrders: (userId: string) => Order[];
  getUserClaims: (userId: string) => Claim[];
  getListingClaims: (listingId: string) => Claim[];
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);

  // Initialize from localStorage
  useEffect(() => {
    if (!localStorage.getItem(KEYS.seeded)) {
      write(KEYS.listings, SEED_LISTINGS);
      const demoUsers: User[] = [
        { id: 'demo-user', fullName: 'Demo User', email: 'demo@w2w.in', phone: '9876543210', password: 'demo123', city: 'Bengaluru', createdAt: Date.now() },
        { id: 'seed-seller-1', fullName: 'Ananya Rao', email: 'ananya@demo.in', phone: '9999999999', password: 'demo123', city: 'Bengaluru', createdAt: Date.now() },
      ];
      write(KEYS.users, demoUsers);
      localStorage.setItem(KEYS.seeded, '1');
    }
    setUsers(read<User[]>(KEYS.users, []));
    setListings(read<Listing[]>(KEYS.listings, []));
    setOrders(read<Order[]>(KEYS.orders, []));
    setClaims(read<Claim[]>(KEYS.claims, []));
    const sessionId = localStorage.getItem(KEYS.session);
    if (sessionId) {
      const all = read<User[]>(KEYS.users, []);
      const found = all.find((u) => u.id === sessionId);
      if (found) setUser(found);
    }
  }, []);

  const persistUsers = useCallback((next: User[]) => {
    setUsers(next);
    write(KEYS.users, next);
  }, []);
  const persistListings = useCallback((next: Listing[]) => {
    setListings(next);
    write(KEYS.listings, next);
  }, []);
  const persistOrders = useCallback((next: Order[]) => {
    setOrders(next);
    write(KEYS.orders, next);
  }, []);
  const persistClaims = useCallback((next: Claim[]) => {
    setClaims(next);
    write(KEYS.claims, next);
  }, []);

  const register: StoreContextValue['register'] = (data) => {
    if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { ok: false, error: 'An account with this email already exists.' };
    }
    const newUser: User = { ...data, id: uid('user'), createdAt: Date.now() };
    persistUsers([...users, newUser]);
    setUser(newUser);
    localStorage.setItem(KEYS.session, newUser.id);
    return { ok: true };
  };

  const login: StoreContextValue['login'] = (email, password) => {
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!found) return { ok: false, error: 'Invalid email or password.' };
    setUser(found);
    localStorage.setItem(KEYS.session, found.id);
    return { ok: true };
  };

  const loginDemo: StoreContextValue['loginDemo'] = () => {
    let demo = users.find((u) => u.id === 'demo-user');
    if (!demo) {
      demo = { id: 'demo-user', fullName: 'Demo User', email: 'demo@w2w.in', phone: '9876543210', password: 'demo123', city: 'Bengaluru', createdAt: Date.now() };
      persistUsers([...users, demo]);
    }
    setUser(demo);
    localStorage.setItem(KEYS.session, demo.id);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(KEYS.session);
  };

  const updateProfile: StoreContextValue['updateProfile'] = (data) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    persistUsers(users.map((u) => (u.id === user.id ? updated : u)));
    localStorage.setItem(KEYS.session, updated.id);
  };

  const addListing: StoreContextValue['addListing'] = (data) => {
    if (!user) throw new Error('Not logged in');
    const listing: Listing = {
      ...data,
      id: uid('list'),
      sellerId: user.id,
      sellerName: user.fullName,
      status: 'available',
      createdAt: Date.now(),
    };
    persistListings([listing, ...listings]);
    return listing;
  };

  const updateListing: StoreContextValue['updateListing'] = (id, data) => {
    persistListings(listings.map((l) => (l.id === id ? { ...l, ...data } : l)));
  };

  const deleteListing: StoreContextValue['deleteListing'] = (id) => {
    persistListings(listings.filter((l) => l.id !== id));
    persistClaims(claims.filter((c) => c.listingId !== id));
  };

  const markListingStatus: StoreContextValue['markListingStatus'] = (id, status) => {
    persistListings(listings.map((l) => (l.id === id ? { ...l, status } : l)));
  };

  const reduceListingQuantity: StoreContextValue['reduceListingQuantity'] = (id, qty) => {
    persistListings(
      listings.map((l) => {
        if (l.id !== id) return l;
        const remaining = Math.max(0, l.quantity - qty);
        return { ...l, quantity: remaining, status: remaining === 0 ? 'sold' : l.status };
      })
    );
  };

  const addOrder: StoreContextValue['addOrder'] = (data) => {
    const now = Date.now();
    const order: Order = {
      ...data,
      id: `W2W-${now.toString(36).toUpperCase().slice(-6)}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`,
      status: 'Order Placed',
      statusHistory: [{ status: 'Order Placed', at: now }],
      createdAt: now,
    };
    persistOrders([order, ...orders]);
    // reduce stock
    order.items.forEach((it) => reduceListingQuantity(it.listingId, it.quantity));
    return order;
  };

  const advanceOrderStatus: StoreContextValue['advanceOrderStatus'] = (orderId) => {
    const flow: Order['status'][] = ['Order Placed', 'Order Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'];
    persistOrders(
      orders.map((o) => {
        if (o.id !== orderId) return o;
        const idx = flow.indexOf(o.status);
        if (idx >= flow.length - 1) return o;
        const next = flow[idx + 1];
        return { ...o, status: next, statusHistory: [...o.statusHistory, { status: next, at: Date.now() }] };
      })
    );
  };

  const addClaim: StoreContextValue['addClaim'] = (listingId) => {
    if (!user) return { ok: false, error: 'Please log in to claim.' };
    const listing = listings.find((l) => l.id === listingId);
    if (!listing) return { ok: false, error: 'Listing not found.' };
    if (listing.sellerId === user.id) return { ok: false, error: 'You cannot claim your own listing.' };
    if (listing.status !== 'available') return { ok: false, error: 'This item is no longer available.' };
    if (claims.some((c) => c.listingId === listingId && c.claimerId === user.id && c.status !== 'Cancelled')) {
      return { ok: false, error: 'You have already claimed this item.' };
    }
    const now = Date.now();
    const claim: Claim = {
      id: uid('claim'),
      listingId,
      claimerId: user.id,
      claimerName: user.fullName,
      status: 'Requested',
      createdAt: now,
      updatedAt: now,
    };
    persistClaims([claim, ...claims]);
    return { ok: true, claim };
  };

  const updateClaimStatus: StoreContextValue['updateClaimStatus'] = (claimId, status) => {
    const now = Date.now();
    const updatedClaims = claims.map((c) => (c.id === claimId ? { ...c, status, updatedAt: now } : c));
    persistClaims(updatedClaims);
    if (status === 'Handed Over') {
      const claim = updatedClaims.find((c) => c.id === claimId);
      if (claim) markListingStatus(claim.listingId, 'handed-over');
    }
    if (status === 'Accepted') {
      const claim = updatedClaims.find((c) => c.id === claimId);
      if (claim) {
        // mark listing as reserved by accepting (keep available for now, but disallow further claims)
        persistClaims(updatedClaims.map((c) => c));
      }
    }
  };

  const getUserListings = (userId: string) => listings.filter((l) => l.sellerId === userId);
  const getUserOrders = (userId: string) => orders.filter((o) => o.buyerId === userId);
  const getUserClaims = (userId: string) => claims.filter((c) => c.claimerId === userId);
  const getListingClaims = (listingId: string) => claims.filter((c) => c.listingId === listingId);

  const value = useMemo<StoreContextValue>(
    () => ({
      user, users, listings, orders, claims,
      register, login, loginDemo, logout, updateProfile,
      addListing, updateListing, deleteListing, markListingStatus, reduceListingQuantity,
      addOrder, advanceOrderStatus,
      addClaim, updateClaimStatus,
      getUserListings, getUserOrders, getUserClaims, getListingClaims,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, users, listings, orders, claims]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
