import { useState } from 'react';
import { Home, ShoppingBag, Tag, Gift, LayoutList, Package, User as UserIcon, BarChart3, LogOut, Menu, X, Recycle } from 'lucide-react';
import { useStore } from '@/store';
import { useRouter } from '@/router';
import type { Route } from '@/router';
import type { LucideIcon } from 'lucide-react';

const NAV: { label: string; route: Route; icon: LucideIcon }[] = [
  { label: 'Home', route: { name: 'dashboard' }, icon: Home },
  { label: 'Buy', route: { name: 'buy' }, icon: ShoppingBag },
  { label: 'Sell', route: { name: 'sell' }, icon: Tag },
  { label: 'Give Free', route: { name: 'free' }, icon: Gift },
  { label: 'My Listings', route: { name: 'my-listings' }, icon: LayoutList },
  { label: 'My Orders', route: { name: 'orders' }, icon: Package },
  { label: 'Impact', route: { name: 'impact' }, icon: BarChart3 },
  { label: 'Profile', route: { name: 'profile' }, icon: UserIcon },
];

export function AppShell({ children, active }: { children: React.ReactNode; active: Route['name'] }) {
  const { user, logout } = useStore();
  const { navigate, route } = useRouter();
  const [open, setOpen] = useState(false);

  const isActive = (r: Route) =>
    r.name === active || (r.name === 'product' && active === 'product');

  const go = (r: Route) => { navigate(r); setOpen(false); };

  const NavItems = () => (
    <>
      {NAV.map((item) => {
        const Icon = item.icon;
        const active_ = isActive(item.route);
        return (
          <button
            key={item.label}
            onClick={() => go(item.route)}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              active_ ? 'bg-accent text-brand-900' : 'text-brand-100 hover:bg-brand-600'
            }`}
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </button>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-brand-50">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-brand-100 bg-brand text-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <button onClick={() => go({ name: 'dashboard' })} className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-brand-900">
              <Recycle className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="font-display text-lg font-bold leading-none">Waste 2 Worth</p>
              <p className="hidden text-[10px] text-brand-200 sm:block">Your Unwanted. Someone's Wanted.</p>
            </div>
          </button>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs text-brand-200">Hi,</p>
              <p className="text-sm font-semibold">{user?.fullName}</p>
            </div>
            <button onClick={logout} className="btn-ghost !text-brand-100 hover:!bg-brand-600" title="Logout">
              <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Logout</span>
            </button>
            <button onClick={() => setOpen(true)} className="btn-ghost !text-white hover:!bg-brand-600 lg:hidden">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl">
        {/* Sidebar desktop */}
        <aside className="sticky top-[57px] hidden h-[calc(100vh-57px)] w-60 shrink-0 flex-col gap-1 overflow-y-auto bg-brand p-3 text-white lg:flex">
          <NavItems />
        </aside>

        {/* Mobile drawer */}
        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-64 bg-brand p-4 text-white shadow-2xl animate-slideUp">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-display font-bold">Menu</span>
                <button onClick={() => setOpen(false)} className="rounded-lg p-1 hover:bg-brand-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex flex-col gap-1">
                <NavItems />
              </div>
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1 p-4 sm:p-6">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-stretch justify-around border-t border-brand-100 bg-white shadow-[0_-4px_12px_rgba(16,41,32,0.06)] lg:hidden">
        {NAV.filter((n) => ['Home', 'Buy', 'Sell', 'Give Free', 'My Orders'].includes(n.label)).map((item) => {
          const Icon = item.icon;
          const a = isActive(item.route) || (item.label === 'My Orders' && route.name === 'track') || (item.label === 'My Orders' && route.name === 'order-confirmation');
          return (
            <button
              key={item.label}
              onClick={() => go(item.route)}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium ${a ? 'text-accent' : 'text-brand-500'}`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="h-14 lg:hidden" />
    </div>
  );
}
