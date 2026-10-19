import { useMemo } from 'react';
import { Package, Receipt, ArrowRight, ShoppingBag } from 'lucide-react';
import { useStore } from '@/store';
import { useRouter } from '@/router';
import { formatINR } from '@/data/seed';

const STATUS_COLORS: Record<string, string> = {
  'Order Placed': 'bg-blue-100 text-blue-800',
  'Order Confirmed': 'bg-indigo-100 text-indigo-800',
  'Shipped': 'bg-purple-100 text-purple-800',
  'Out for Delivery': 'bg-amber-100 text-amber-800',
  'Delivered': 'bg-green-100 text-green-800',
};

export function OrdersPage() {
  const { user, getUserOrders } = useStore();
  const { navigate } = useRouter();
  const orders = useMemo(() => (user ? getUserOrders(user.id) : []), [user, getUserOrders]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-900">My Orders</h1>
        <p className="text-sm text-brand-500">{orders.length} order(s)</p>
      </div>

      {orders.length === 0 ? (
        <div className="card flex flex-col items-center gap-3 p-12 text-center">
          <Package className="h-10 w-10 text-brand-300" />
          <p className="font-medium text-brand-700">No orders yet.</p>
          <button onClick={() => navigate({ name: 'buy' })} className="btn-brand mt-2"><ShoppingBag className="h-4 w-4" /> Start shopping</button>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="card p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <img src={o.items[0].image} alt="" className="h-20 w-20 shrink-0 rounded-xl object-cover" />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`badge ${STATUS_COLORS[o.status] ?? 'bg-brand-100 text-brand-700'}`}>{o.status}</span>
                    <span className="badge bg-brand-100 text-brand-700">{o.paymentMethod === 'COD' ? 'COD' : 'Online'}</span>
                  </div>
                  <p className="mt-1 font-medium text-brand-900">{o.items[0].productName}{o.items.length > 1 && ` +${o.items.length - 1} more`}</p>
                  <p className="text-xs text-brand-400">{new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} • <span className="font-mono">{o.id}</span></p>
                  <p className="mt-1 font-semibold text-brand-900">{formatINR(o.total)}</p>
                </div>
                <button onClick={() => navigate({ name: 'track', orderId: o.id })} className="btn-outline">
                  <Receipt className="h-4 w-4" /> Track Order <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
