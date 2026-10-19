import { useMemo } from 'react';
import { CheckCircle2, Package, Truck, MapPin, CreditCard, Receipt, ArrowRight, Home } from 'lucide-react';
import { useStore } from '@/store';
import { useRouter } from '@/router';
import { formatINR } from '@/data/seed';

export function OrderConfirmationPage({ orderId }: { orderId: string }) {
  const { orders } = useStore();
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

  const eta = new Date(order.createdAt + 5 * 86400000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  const eta2 = new Date(order.createdAt + 7 * 86400000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="card flex flex-col items-center gap-3 p-8 text-center animate-popIn">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-green-100 text-green-600">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <h1 className="font-display text-2xl font-bold text-brand-900">Order Confirmed!</h1>
        <p className="text-brand-500">Thank you for your demo order. Your item is on its way.</p>
        <div className="mt-2 rounded-xl bg-brand-50 px-4 py-2">
          <p className="text-xs text-brand-400">Order ID</p>
          <p className="font-mono font-bold text-brand-900">{order.id}</p>
        </div>
      </div>

      <div className="card space-y-4 p-5">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold text-brand-900"><Package className="h-5 w-5 text-accent" /> Order details</h2>
        {order.items.map((it) => (
          <div key={it.listingId} className="flex gap-3">
            <img src={it.image} alt="" className="h-20 w-20 rounded-xl object-cover" />
            <div className="flex-1">
              <p className="font-medium text-brand-900">{it.productName}</p>
              <p className="text-xs text-brand-400">{it.condition} • Qty {it.quantity}</p>
              <p className="mt-1 text-sm font-semibold text-brand-900">{formatINR(it.price * it.quantity)}</p>
            </div>
          </div>
        ))}
        <div className="space-y-1.5 border-t border-brand-100 pt-3 text-sm">
          <div className="flex justify-between text-brand-600"><span>Subtotal</span><span>{formatINR(order.subtotal)}</span></div>
          <div className="flex justify-between text-brand-600"><span>Delivery fee</span><span>{formatINR(order.deliveryFee)}</span></div>
          <div className="flex justify-between font-display text-lg font-bold text-brand-900"><span>Total</span><span>{formatINR(order.total)}</span></div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card p-5">
          <h3 className="flex items-center gap-2 font-semibold text-brand-900"><CreditCard className="h-4 w-4 text-accent" /> Payment</h3>
          <p className="mt-2 text-sm text-brand-700">{order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment (Demo)'}</p>
        </div>
        <div className="card p-5">
          <h3 className="flex items-center gap-2 font-semibold text-brand-900"><MapPin className="h-4 w-4 text-accent" /> Delivery to</h3>
          <p className="mt-2 text-sm text-brand-700">{order.recipientName}<br />{order.address}, {order.city} - {order.pincode}<br />Ph: {order.recipientPhone}</p>
        </div>
      </div>

      <div className="card flex items-center gap-3 p-5">
        <Truck className="h-5 w-5 text-accent" />
        <p className="flex-1 text-sm text-brand-700">
          <strong>Estimated delivery:</strong> {eta} – {eta2}
          <span className="block text-xs text-brand-400">Estimate only — this is a demo with no real courier.</span>
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button onClick={() => navigate({ name: 'track', orderId: order.id })} className="btn-brand flex-1">
          <Receipt className="h-4 w-4" /> Track Order <ArrowRight className="h-4 w-4" />
        </button>
        <button onClick={() => navigate({ name: 'orders' })} className="btn-outline">My Orders</button>
        <button onClick={() => navigate({ name: 'dashboard' })} className="btn-ghost"><Home className="h-4 w-4" /> Home</button>
      </div>
    </div>
  );
}
