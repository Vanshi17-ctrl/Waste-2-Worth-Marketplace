import { useMemo, useState } from 'react';
import { ArrowLeft, Truck, Wallet, CreditCard, ShieldCheck, Lock, AlertTriangle, CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { useStore } from '@/store';
import { useRouter } from '@/router';
import { formatINR } from '@/data/seed';
import { Field } from '@/components/Field';
import { toast } from '@/components/Toast';
import type { PaymentMethod } from '@/types';

const DELIVERY_FEE = 60;

export function CheckoutPage({ listingId, qty }: { listingId: string; qty: number }) {
  const { listings, user, addOrder } = useStore();
  const { navigate } = useRouter();
  const listing = useMemo(() => listings.find((l) => l.id === listingId), [listings, listingId]);
  const [recipientName, setRecipientName] = useState(user?.fullName ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState(user?.city ?? '');
  const [pincode, setPincode] = useState('');
  const [payment, setPayment] = useState<PaymentMethod>('COD');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [placing, setPlacing] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [payState, setPayState] = useState<'idle' | 'processing' | 'success' | 'cancelled'>('idle');

  if (!listing) {
    return (
      <div className="card flex flex-col items-center gap-3 p-12 text-center">
        <AlertTriangle className="h-10 w-10 text-accent" />
        <p className="font-medium text-brand-700">Listing not found.</p>
        <button onClick={() => navigate({ name: 'buy' })} className="btn-brand">Back to marketplace</button>
      </div>
    );
  }

  if (listing.sellerId === user?.id) {
    return (
      <div className="card flex flex-col items-center gap-3 p-12 text-center">
        <ShieldCheck className="h-10 w-10 text-accent" />
        <p className="font-medium text-brand-700">You can't buy your own listing.</p>
        <button onClick={() => navigate({ name: 'buy' })} className="btn-brand">Browse other items</button>
      </div>
    );
  }

  const quantity = Math.min(qty, listing.quantity);
  const subtotal = listing.price * quantity;
  const deliveryFee = DELIVERY_FEE;
  const total = subtotal + deliveryFee;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!recipientName.trim()) e.recipientName = 'Required';
    if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) e.phone = 'Enter a valid 10-digit number';
    if (!address.trim()) e.address = 'Required';
    if (!city.trim()) e.city = 'Required';
    if (!/^\d{6}$/.test(pincode)) e.pincode = 'Enter a valid 6-digit PIN';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const placeOrder = (method: PaymentMethod) => {
    if (placing) return;
    setPlacing(true);
    const order = addOrder({
      buyerId: user!.id,
      items: [{
        listingId: listing.id,
        productName: listing.productName,
        image: listing.images[0],
        price: listing.price,
        quantity,
        condition: listing.condition,
        sellerName: listing.shopName ?? listing.sellerName,
        city: listing.city,
      }],
      subtotal,
      deliveryFee,
      total,
      paymentMethod: method,
      recipientName: recipientName.trim(),
      recipientPhone: phone.trim(),
      address: address.trim(),
      city: city.trim(),
      pincode: pincode.trim(),
    });
    setPlacing(false);
    toast('success', 'Order placed!');
    navigate({ name: 'order-confirmation', orderId: order.id });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) { toast('error', 'Please fix the highlighted fields.'); return; }
    if (payment === 'COD') {
      placeOrder('COD');
    } else {
      setShowPayModal(true);
    }
  };

  const simulatePay = () => {
    setPayState('processing');
    setTimeout(() => {
      setPayState('success');
      setTimeout(() => {
        setShowPayModal(false);
        placeOrder('Online (Demo)');
      }, 900);
    }, 1400);
  };

  return (
    <div className="space-y-6">
      <button onClick={() => navigate({ name: 'product', id: listing.id })} className="flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-accent">
        <ArrowLeft className="h-4 w-4" /> Back to product
      </button>

      <h1 className="font-display text-2xl font-bold text-brand-900">Checkout</h1>

      <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Delivery + payment */}
        <div className="space-y-5">
          <section className="card space-y-4 p-5">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold text-brand-900"><Truck className="h-5 w-5 text-accent" /> Delivery details</h2>
            <Field id="rn" label="Recipient name" value={recipientName} onChange={setRecipientName} required error={errors.recipientName} />
            <Field id="rph" label="Phone number" type="tel" value={phone} onChange={setPhone} required error={errors.phone} maxLength={10} />
            <Field id="addr" label="Delivery address" type="textarea" value={address} onChange={setAddress} required error={errors.address} />
            <div className="grid grid-cols-2 gap-3">
              <Field id="cty" label="City" value={city} onChange={setCity} required error={errors.city} />
              <Field id="pin" label="PIN code" value={pincode} onChange={setPincode} required error={errors.pincode} maxLength={6} />
            </div>
          </section>

          <section className="card space-y-3 p-5">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold text-brand-900"><Wallet className="h-5 w-5 text-accent" /> Payment method</h2>
            <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${payment === 'COD' ? 'border-accent bg-accent-50' : 'border-brand-200 hover:border-brand-400'}`}>
              <input type="radio" name="pay" checked={payment === 'COD'} onChange={() => setPayment('COD')} className="accent-accent" />
              <Truck className="h-5 w-5 text-brand-700" />
              <div className="flex-1">
                <p className="font-semibold text-brand-900">Cash on Delivery</p>
                <p className="text-xs text-brand-500">Pay with cash when your order arrives.</p>
              </div>
            </label>
            <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${payment === 'Online (Demo)' ? 'border-accent bg-accent-50' : 'border-brand-200 hover:border-brand-400'}`}>
              <input type="radio" name="pay" checked={payment === 'Online (Demo)'} onChange={() => setPayment('Online (Demo)')} className="accent-accent" />
              <CreditCard className="h-5 w-5 text-brand-700" />
              <div className="flex-1">
                <p className="font-semibold text-brand-900">Online Payment <span className="badge bg-accent text-brand-900">DEMO</span></p>
                <p className="text-xs text-brand-500">Simulated payment. No real money is transferred.</p>
              </div>
            </label>
            <div className="demo-notice flex items-start gap-2">
              <Lock className="mt-0.5 h-4 w-4 shrink-0" />
              <p><strong>Demo payments.</strong> We never collect real card numbers, UPI PINs, or banking credentials. No real money is transferred.</p>
            </div>
          </section>
        </div>

        {/* Order summary */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="card space-y-4 p-5">
            <h2 className="font-display text-lg font-bold text-brand-900">Order summary</h2>
            <div className="flex gap-3">
              <img src={listing.images[0]} alt="" className="h-20 w-20 rounded-xl object-cover" />
              <div className="flex-1">
                <p className="font-medium text-brand-900">{listing.productName}</p>
                <p className="text-xs text-brand-400">{listing.condition} • {listing.shopName ?? listing.sellerName}</p>
                <p className="mt-1 text-xs text-brand-500">Qty: {quantity} × {formatINR(listing.price)}</p>
              </div>
            </div>
            <div className="space-y-1.5 border-t border-brand-100 pt-3 text-sm">
              <div className="flex justify-between text-brand-600"><span>Subtotal</span><span>{formatINR(subtotal)}</span></div>
              <div className="flex justify-between text-brand-600"><span>Delivery fee</span><span>{formatINR(deliveryFee)}</span></div>
              <div className="flex justify-between border-t border-brand-100 pt-2 font-display text-lg font-bold text-brand-900"><span>Total</span><span>{formatINR(total)}</span></div>
            </div>
            <button type="submit" disabled={placing} className="btn-brand w-full">
              {placing ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {payment === 'COD' ? 'Place COD Order' : 'Proceed to Demo Payment'}
            </button>
            <p className="text-center text-xs text-brand-400">By placing this order you agree to the demo terms.</p>
          </div>
        </aside>
      </form>

      {/* Demo payment modal */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center animate-popIn">
            {payState === 'idle' && (
              <>
                <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-brand-50 text-brand-700"><CreditCard className="h-7 w-7" /></div>
                <h2 className="font-display text-xl font-bold text-brand-900">Demo Online Payment</h2>
                <p className="mt-1 text-sm text-brand-500">Amount: <strong>{formatINR(total)}</strong></p>
                <div className="demo-notice mt-4 text-left">This is a simulated payment screen. No real card/UPI details are collected. Clicking "Pay" simulates a successful transaction.</div>
                <div className="mt-5 flex gap-3">
                  <button onClick={() => { setPayState('cancelled'); setShowPayModal(false); }} className="btn-outline flex-1">Cancel</button>
                  <button onClick={simulatePay} className="btn-primary flex-1">Pay {formatINR(total)}</button>
                </div>
              </>
            )}
            {payState === 'processing' && (
              <div className="py-6">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-accent" />
                <p className="mt-4 font-semibold text-brand-900">Processing demo payment…</p>
              </div>
            )}
            {payState === 'success' && (
              <div className="py-6">
                <CheckCircle2 className="mx-auto h-14 w-14 text-green-600" />
                <p className="mt-3 font-display text-xl font-bold text-brand-900">Payment Successful</p>
                <p className="text-sm text-brand-500">Creating your order…</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
