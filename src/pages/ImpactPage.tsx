import { useMemo } from 'react';
import { Package, ShoppingCart, Gift, Recycle, TrendingUp } from 'lucide-react';
import { useStore } from '@/store';

export function ImpactPage() {
  const { listings, orders, claims, user } = useStore();

  const stats = useMemo(() => {
    const available = listings.filter((l) => l.status === 'available').length;
    const sold = listings.filter((l) => l.status === 'sold').length;
    const handedOver = listings.filter((l) => l.status === 'handed-over').length;
    const completedOrders = orders.filter((o) => o.status === 'Delivered').length;
    const completedClaims = claims.filter((c) => c.status === 'Handed Over').length;
    const reused = sold + handedOver;
    return { available, sold, handedOver, completedOrders, completedClaims, reused };
  }, [listings, orders, claims]);

  const myListings = user ? listings.filter((l) => l.sellerId === user.id) : [];
  const myContribution = myListings.filter((l) => l.status === 'sold' || l.status === 'handed-over').length;

  const cards = [
    { label: 'Products listed', value: stats.available + stats.sold + stats.handedOver, icon: Package, color: 'bg-brand-50 text-brand-700' },
    { label: 'Demo sales completed', value: stats.sold, icon: ShoppingCart, color: 'bg-blue-50 text-blue-700' },
    { label: 'Free items handed over', value: stats.handedOver, icon: Gift, color: 'bg-accent-50 text-accent-700' },
    { label: 'Items given a new owner', value: stats.reused, icon: Recycle, color: 'bg-green-50 text-green-700' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-br from-brand to-brand-600 p-8 text-white">
        <div className="flex items-center gap-2">
          <Recycle className="h-7 w-7 text-accent" />
          <h1 className="font-display text-2xl font-bold">Impact Dashboard</h1>
        </div>
        <p className="mt-2 max-w-xl text-brand-100">Counts of real demo actions completed on Waste 2 Worth. Every reuse keeps a usable item out of landfill.</p>
        <div className="demo-notice mt-4 !bg-white/10 !border-white/20 !text-white">
          These counts reflect completed demo actions only. We do not invent carbon savings or claim verified environmental impact.
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="card p-5">
              <div className={`mb-3 grid h-12 w-12 place-items-center rounded-xl ${c.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <p className="font-display text-3xl font-bold text-brand-900">{c.value}</p>
              <p className="text-sm text-brand-500">{c.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-brand-900"><TrendingUp className="h-5 w-5 text-accent" /> Your contribution</h2>
          <p className="mt-3 font-display text-4xl font-bold text-brand-900">{myContribution}</p>
          <p className="text-sm text-brand-500">items you've given a new owner</p>
        </div>
        <div className="card p-5">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-brand-900"><ShoppingCart className="h-5 w-5 text-accent" /> Completed demo orders</h2>
          <p className="mt-3 font-display text-4xl font-bold text-brand-900">{stats.completedOrders}</p>
          <p className="text-sm text-brand-500">orders marked as delivered</p>
        </div>
      </div>

      <div className="rounded-2xl border border-brand-100 bg-white p-5">
        <h3 className="mb-2 font-semibold text-brand-900">What these numbers mean</h3>
        <ul className="space-y-2 text-sm text-brand-600">
          <li>• <strong>Products listed</strong> counts every item published on the marketplace.</li>
          <li>• <strong>Demo sales completed</strong> counts items marked as sold after a checkout.</li>
          <li>• <strong>Free items handed over</strong> counts free listings marked as handed over.</li>
          <li>• <strong>Items given a new owner</strong> = sold + handed over, i.e. items reused.</li>
        </ul>
      </div>
    </div>
  );
}
