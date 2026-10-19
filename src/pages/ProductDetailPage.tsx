import { useMemo, useState } from 'react';
import { ArrowLeft, MapPin, Store, Package, ShieldAlert, ShoppingCart, Zap, Tag, CheckCircle2, AlertTriangle, MessageCircle } from 'lucide-react';
import { useStore } from '@/store';
import { useRouter } from '@/router';
import { formatINR } from '@/data/seed';
import { toast } from '@/components/Toast';
import { FALLBACK } from '@/components/ProductCard';

export function ProductDetailPage({ id }: { id: string }) {
  const { listings, user, addClaim, getListingClaims, claims } = useStore();
  const { navigate } = useRouter();
  const listing = useMemo(() => listings.find((l) => l.id === id), [listings, id]);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  if (!listing) {
    return (
      <div className="card flex flex-col items-center gap-3 p-12 text-center">
        <AlertTriangle className="h-10 w-10 text-accent" />
        <p className="font-medium text-brand-700">This listing is no longer available.</p>
        <button onClick={() => navigate({ name: 'buy' })} className="btn-brand mt-2">Back to marketplace</button>
      </div>
    );
  }

  const isOwn = user?.id === listing.sellerId;
  const isFree = listing.mode === 'free' || listing.price === 0;
  const sold = listing.status !== 'available';
  const maxQty = Math.max(1, listing.quantity);
  const effectiveQty = Math.min(qty, maxQty);
  const alreadyClaimed = claims.some((c) => c.listingId === listing.id && c.claimerId === user?.id && c.status !== 'Cancelled');
  const sellerClaims = getListingClaims(listing.id);

  const buyNow = () => {
    if (isOwn) { toast('error', "You can't buy your own listing."); return; }
    if (sold) { toast('error', 'This item is no longer available.'); return; }
    navigate({ name: 'checkout', listingId: listing.id, qty: effectiveQty });
  };

  const claim = () => {
    if (!user) { toast('info', 'Please log in to claim.'); navigate({ name: 'login' }); return; }
    const res = addClaim(listing.id);
    if (res.ok) toast('success', 'Claim requested! The seller will respond.');
    else toast('error', res.error ?? 'Could not claim.');
  };

  return (
    <div className="space-y-6">
      <button onClick={() => history.back()} className="flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-accent">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="card overflow-hidden">
            <div className="aspect-square bg-brand-100">
              <img
                src={listing.images[activeImg] ?? FALLBACK}
                alt={listing.productName}
                className="h-full w-full object-cover"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK; }}
              />
            </div>
          </div>
          {listing.images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
              {listing.images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 ${activeImg === i ? 'border-accent' : 'border-transparent'}`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {isFree ? (
                <span className="badge bg-accent text-brand-900 text-sm">FREE</span>
              ) : (
                <span className="badge bg-brand text-white text-sm">{formatINR(listing.price)}</span>
              )}
              <span className="badge bg-brand-100 text-brand-700">{listing.category}</span>
              <span className="badge bg-blue-100 text-blue-800">{listing.condition}</span>
            </div>
            <h1 className="mt-3 font-display text-2xl font-bold text-brand-900">{listing.productName}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-brand-500">
              <span className="flex items-center gap-1"><Store className="h-4 w-4" /> {listing.shopName ?? listing.sellerName}</span>
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {listing.city}</span>
              <span className="flex items-center gap-1"><Package className="h-4 w-4" /> {listing.quantity} available</span>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="mb-1 font-semibold text-brand-900">Description</h3>
            <p className="text-sm leading-relaxed text-brand-700">{listing.description}</p>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              {listing.brand && <div><p className="text-xs text-brand-400">Brand</p><p className="font-medium text-brand-800">{listing.brand}</p></div>}
              {listing.productAge && <div><p className="text-xs text-brand-400">Product age</p><p className="font-medium text-brand-800">{listing.productAge}</p></div>}
              <div><p className="text-xs text-brand-400">Condition</p><p className="font-medium text-brand-800">{listing.condition}</p></div>
              <div><p className="text-xs text-brand-400">Listing type</p><p className="font-medium text-brand-800">{isFree ? 'Free' : 'For sale'}</p></div>
            </div>
          </div>

          {listing.defects && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-amber-800">
                <ShieldAlert className="h-4 w-4" /> Disclosed defect
              </p>
              <p className="mt-1 text-sm text-amber-700">{listing.defects}</p>
            </div>
          )}

          <div className="demo-notice flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>This is a used product. Condition and any defects are disclosed by the seller. No warranty unless stated. <strong>Demo contact flow</strong> — seller's private details are not shown publicly.</p>
          </div>

          {/* Availability */}
          {sold ? (
            <div className="rounded-xl bg-brand-100 p-4 text-center">
              <p className="font-semibold text-brand-900">This item is {listing.status === 'handed-over' ? 'handed over' : 'sold out'}.</p>
            </div>
          ) : isOwn ? (
            <div className="rounded-xl border border-accent-200 bg-accent-50 p-4 text-center">
              <p className="font-semibold text-accent-800">This is your own listing.</p>
              <button onClick={() => navigate({ name: 'my-listings' })} className="btn-outline mt-2">Manage listing</button>
            </div>
          ) : (
            <div className="card space-y-4 p-5">
              {!isFree && (
                <div>
                  <label className="label">Quantity</label>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-10 w-10 place-items-center rounded-lg border border-brand-200 text-lg font-bold text-brand-700 hover:bg-brand-50">−</button>
                    <span className="w-12 text-center font-semibold">{effectiveQty}</span>
                    <button onClick={() => setQty((q) => Math.min(maxQty, q + 1))} className="grid h-10 w-10 place-items-center rounded-lg border border-brand-200 text-lg font-bold text-brand-700 hover:bg-brand-50">+</button>
                    <span className="ml-auto font-display text-xl font-bold text-brand-900">{formatINR(listing.price * effectiveQty)}</span>
                  </div>
                </div>
              )}

              {isFree ? (
                <button onClick={claim} disabled={alreadyClaimed} className="btn-primary w-full">
                  {alreadyClaimed ? 'Already claimed' : 'Claim Free Item'}
                </button>
              ) : (
                <div className="flex gap-3">
                  <button onClick={buyNow} className="btn-brand flex-1">
                    <Zap className="h-4 w-4" /> Buy Now
                  </button>
                </div>
              )}

              <p className="flex items-center justify-center gap-1.5 text-xs text-brand-400">
                <MessageCircle className="h-3.5 w-3.5" /> Demo app — real contact details are not shared.
              </p>
            </div>
          )}

          {/* Seller claims (if owner) */}
          {isOwn && sellerClaims.length > 0 && (
            <div className="card p-4">
              <h3 className="mb-2 font-semibold text-brand-900">Claims on this item</h3>
              <ul className="space-y-2">
                {sellerClaims.map((c) => (
                  <li key={c.id} className="flex items-center justify-between rounded-lg bg-brand-50 p-2 text-sm">
                    <span className="text-brand-700">{c.claimerName}</span>
                    <span className="badge bg-brand-100 text-brand-700">{c.status}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
