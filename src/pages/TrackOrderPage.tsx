import { useMemo } from 'react';
import { ArrowLeft, CheckCircle2, Circle, Truck, Package, Box, Home as HomeIcon, FastForward, MapPin, CreditCard } from 'lucide-react';
import { useStore } from '@/store';
import { useRouter } from '@/router';
import { formatINR } from '@/data/seed';
import type { OrderStatus } from '@/types';
import { toast } from '@/components/Toast';

const FLOW: { status: OrderStatus; icon: typeof Package }[] = [
  { status: 'Order Placed', icon: Package },
  { status: 'Order Confirmed', icon: CheckCircle2 },
  { status: 'Shipped', icon: Box },
  { status: 'Out for Delivery', icon: Truck },
  { status: 'Delivered', icon: HomeIcon },
];

export function TrackOrderPage({ orderId }: { orderId: string }) {
  const { orders, advanceOrderStatus, user, listings } = useStore();
  const { navigate } = useRouter();
  const order = useMemo(() => orders.find((o) => o.id === orderId), [orders, orderId]);

  if (!order) {
    return (
      <div className="card flex flex-col items-center gap-3 p-12 text-center">
        <p className="font-medium text-brand-700">Order not found.</p>
        <button onClick={() => navigate({ name: 'orders' })} className="btn-brand">My Orders</button>
      </div>
    );
  }

  const currentIdx = FLOW.findIndex((f) => f.status === order.status);
  // Demo control: buyer or seller of any item in the order can advance
  const isSeller = order.items.some((it) => listings.find((l) => l.id === it.listingId)?.sellerId === user?.id);
  const canControl = !!user && (order.buyerId === user.id || isSeller);

  const advance = () => {
    if (order.status === 'Delivered') { toast('info', 'Order already delivered.'); return; }
    advanceOrderStatus(order.id);
    toast('success', 'Status advanced (demo control).');
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <button onClick={() => navigate({ name: 'orders' })} className="flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-accent">
        <ArrowLeft className="h-4 w-4" /> My Orders
      </button>

      <div className="card p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="font-display text-xl font-bold text-brand-900">Track Order</h1>
            <p className="font-mono text-xs text-brand-400">{order.id}</p>
          </div>
          <span className="badge bg-accent text-brand-900">{order.status}</span>
        </div>

        <div className="demo-notice mt-3">SIMULATED DEMO TRACKING — no real courier integration or live location tracking.</div>
      </div>

      {/* Timeline */}
      <div className="card p-6">
        <ol className="space-y-0">
          {FLOW.map((step, i) => {
            const Icon = step.icon;
            const done = i <= currentIdx;
            const isCurrent = i === currentIdx;
            const hist = order.statusHistory.find((h) => h.status === step.status);
            return (
              <li key={step.status} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`grid h-10 w-10 place-items-center rounded-full transition ${done ? 'bg-brand text-white' : 'bg-brand-100 text-brand-400'} ${isCurrent ? 'ring-4 ring-accent/30' : ''}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  {i < FLOW.length - 1 && <div className={`my-1 h-12 w-0.5 ${i < currentIdx ? 'bg-brand' : 'bg-brand-100'}`} />}
                </div>
                <div className={`pb-6 ${i === FLOW.length - 1 ? 'pb-0' : ''}`}>
                  <p className={`font-semibold ${done ? 'text-brand-900' : 'text-brand-400'}`}>{step.status}</p>
                  {hist ? (
                    <p className="text-xs text-brand-500">{new Date(hist.at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                  ) : (
                    <p className="text-xs text-brand-300">Pending</p>
                  )}
                  {isCurrent && <p className="mt-1 text-xs font-medium text-accent">Current status</p>}
                </div>
              </li>
            );
          })}
        </ol>

        {canControl && order.status !== 'Delivered' && (
          <div className="mt-4 rounded-xl border border-dashed border-accent-300 bg-accent-50 p-4">
            <p className="text-xs font-medium text-accent-800">Demo seller/buyer control — advance the order to the next status for testing.</p>
            <button onClick={advance} className="btn-primary mt-2 !py-2 text-xs">
              <FastForward className="h-3.5 w-3.5" /> Advance to next status
            </button>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="card space-y-3 p-5">
        <h2 className="font-semibold text-brand-900">Order summary</h2>
        {order.items.map((it) => (
          <div key={it.listingId} className="flex items-center gap-3">
            <img src={it.image} alt="" className="h-14 w-14 rounded-lg object-cover" />
            <div className="flex-1">
              <p className="text-sm font-medium text-brand-900">{it.productName}</p>
              <p className="text-xs text-brand-400">Qty {it.quantity} • {it.condition}</p>
            </div>
            <p className="font-semibold text-brand-900">{formatINR(it.price * it.quantity)}</p>
          </div>
        ))}
        <div className="border-t border-brand-100 pt-2 text-sm">
          <div className="flex justify-between font-display font-bold text-brand-900"><span>Total</span><span>{formatINR(order.total)}</span></div>
        </div>
        <div className="grid gap-2 border-t border-brand-100 pt-3 text-xs text-brand-500 sm:grid-cols-2">
          <p className="flex items-center gap-1.5"><CreditCard className="h-3.5 w-3.5" /> {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online (Demo)'}</p>
          <p className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {order.city} - {order.pincode}</p>
        </div>
      </div>
    </div>
  );
}
