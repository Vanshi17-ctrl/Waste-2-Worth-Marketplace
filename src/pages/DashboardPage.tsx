import { Search, ShoppingBag, Tag, Gift, ArrowRight, TrendingUp, Recycle, Package, Gift as GiftIcon, BarChart3 } from 'lucide-react';
import { useStore } from '@/store';
import { useRouter } from '@/router';
import { ProductCard } from '@/components/ProductCard';
import { CATEGORY_LIST, CATEGORY_ICONS } from '@/data/seed';
import * as Icons from 'lucide-react';
import { useMemo } from 'react';

export function DashboardPage() {
  const { user, listings, orders, claims } = useStore();
  const { navigate } = useRouter();

  const featured = useMemo(() => listings.filter((l) => l.status === 'available').slice(0, 8), [listings]);
  const recent = useMemo(() => [...listings].sort((a, b) => b.createdAt - a.createdAt).slice(0, 4), [listings]);
  const freeCount = listings.filter((l) => (l.mode === 'free' || l.price === 0) && l.status === 'available').length;
  const soldCount = listings.filter((l) => l.status === 'sold').length;
  const handedCount = listings.filter((l) => l.status === 'handed-over').length;
  const completedOrders = orders.filter((o) => o.status === 'Delivered').length;

  const actions = [
    { title: 'Buy Products', desc: 'Browse pre-loved deals', icon: ShoppingBag, color: 'bg-brand text-white', route: { name: 'buy' as const } },
    { title: 'Sell Products', desc: 'List your unwanted items', icon: Tag, color: 'bg-accent text-brand-900', route: { name: 'sell' as const } },
    { title: 'Give Away Free', desc: 'Help a neighbour in need', icon: Gift, color: 'bg-brand-600 text-white', route: { name: 'free' as const } },
  ];

  const stats = [
    { label: 'Available listings', value: listings.filter((l) => l.status === 'available').length, icon: Package },
    { label: 'Free items up for grabs', value: freeCount, icon: GiftIcon },
    { label: 'Items sold', value: soldCount, icon: TrendingUp },
    { label: 'Items handed over', value: handedCount, icon: Recycle },
  ];

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-brand p-6 text-white sm:p-10">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />
        <div className="relative z-10 max-w-2xl">
          <p className="mb-2 text-sm font-medium text-accent">Welcome back, {user?.fullName?.split(' ')[0] ?? 'friend'}!</p>
          <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl">
            Your Unwanted.<br />Someone's Wanted.
          </h1>
          <p className="mt-3 max-w-md text-brand-100">
            Buy pre-loved items, sell what you no longer need, or give things away for free. Every reuse is a win for the planet.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => navigate({ name: 'buy' })} className="btn-primary">
              <ShoppingBag className="h-4 w-4" /> Start Shopping
            </button>
            <button onClick={() => navigate({ name: 'sell' })} className="btn-outline !border-white/30 !bg-white/10 !text-white hover:!bg-white/20">
              <Tag className="h-4 w-4" /> List an Item
            </button>
          </div>
        </div>
      </section>

      {/* Search */}
      <section>
        <button
          onClick={() => navigate({ name: 'buy' })}
          className="flex w-full items-center gap-3 rounded-2xl border border-brand-200 bg-white px-5 py-4 text-left text-brand-400 shadow-card transition hover:border-accent"
        >
          <Search className="h-5 w-5 text-accent" />
          <span className="text-sm">Search for books, clothes, electronics…</span>
          <ArrowRight className="ml-auto h-4 w-4" />
        </button>
      </section>

      {/* Actions */}
      <section className="grid gap-4 sm:grid-cols-3">
        {actions.map((a) => {
          const Icon = a.icon;
          return (
            <button
              key={a.title}
              onClick={() => navigate(a.route)}
              className="group card flex items-center gap-4 p-5 text-left transition hover:-translate-y-1 hover:shadow-glow"
            >
              <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${a.color}`}>
                <Icon className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <p className="font-display text-lg font-bold text-brand-900">{a.title}</p>
                <p className="text-sm text-brand-500">{a.desc}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-brand-300 transition group-hover:translate-x-1 group-hover:text-accent" />
            </button>
          );
        })}
      </section>

      {/* Impact mini */}
      <section className="card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-brand-900">Impact so far</h2>
          <button onClick={() => navigate({ name: 'impact' })} className="flex items-center gap-1 text-xs font-medium text-accent hover:underline">
            View dashboard <BarChart3 className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="rounded-2xl bg-brand-50 p-4">
                <Icon className="mb-2 h-5 w-5 text-accent" />
                <p className="font-display text-2xl font-bold text-brand-900">{s.value}</p>
                <p className="text-xs text-brand-500">{s.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Categories */}
      <section>
        <h2 className="mb-4 font-display text-lg font-bold text-brand-900">Browse categories</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {CATEGORY_LIST.map((cat) => {
            const Icon = (Icons as any)[CATEGORY_ICONS[cat]] as Icons.LucideIcon;
            return (
              <button
                key={cat}
                onClick={() => navigate({ name: 'buy' })}
                className="card flex flex-col items-center gap-2 p-4 transition hover:-translate-y-1 hover:shadow-glow"
              >
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-700">
                  {Icon && <Icon className="h-6 w-6" />}
                </div>
                <span className="text-center text-xs font-medium text-brand-700">{cat}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-brand-900">Featured products</h2>
          <button onClick={() => navigate({ name: 'buy' })} className="text-xs font-medium text-accent hover:underline">See all</button>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {featured.map((l) => <ProductCard key={l.id} listing={l} />)}
        </div>
      </section>

      {/* Recently listed */}
      <section>
        <h2 className="mb-4 font-display text-lg font-bold text-brand-900">Recently listed</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {recent.map((l) => <ProductCard key={l.id} listing={l} />)}
        </div>
      </section>
    </div>
  );
}
