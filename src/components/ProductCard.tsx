import { useState } from 'react';
import { MapPin } from 'lucide-react';
import type { Listing } from '@/types';
import { formatINR } from '@/data/seed';
import { useStore } from '@/store';
import { useRouter } from '@/router';
import { toast } from '@/components/Toast';

const conditionStyles: Record<Listing['condition'], string> = {
  'Like New': 'bg-green-100 text-green-800',
  'Good': 'bg-blue-100 text-blue-800',
  'Fair': 'bg-amber-100 text-amber-800',
};

export function ProductCard({ listing }: { listing: Listing }) {
  const { user, addClaim } = useStore();
  const { navigate } = useRouter();
  const [claiming, setClaiming] = useState(false);
  const isFree = listing.mode === 'free' || listing.price === 0;
  const isOwn = user?.id === listing.sellerId;
  const sold = listing.status !== 'available';

  const open = () => navigate({ name: 'product', id: listing.id });

  const claim = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) { toast('info', 'Please log in to claim.'); navigate({ name: 'login' }); return; }
    setClaiming(true);
    const res = addClaim(listing.id);
    setClaiming(false);
    if (res.ok) toast('success', 'Claim requested! The seller will respond.');
    else toast('error', res.error ?? 'Could not claim.');
  };

  return (
    <div
      onClick={open}
      className="group card flex cursor-pointer flex-col overflow-hidden transition-all hover:-translate-y-1 hover:shadow-glow"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-brand-100">
        <img
          src={listing.images[0]}
          alt={listing.productName}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK; }}
        />
        <div className="absolute left-2 top-2 flex gap-1.5">
          {isFree ? (
            <span className="badge bg-accent text-brand-900">FREE</span>
          ) : (
            <span className="badge bg-brand text-white">{formatINR(listing.price)}</span>
          )}
          {listing.brand && <span className="badge bg-white/90 text-brand-700">{listing.brand}</span>}
        </div>
        {sold && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="rounded-lg bg-white px-3 py-1 text-sm font-bold text-brand-900 uppercase">
              {listing.status === 'handed-over' ? 'Handed Over' : 'Sold Out'}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-3">
        <h3 className="line-clamp-2 text-sm font-semibold text-brand-900">{listing.productName}</h3>
        <p className="mt-1 text-xs text-brand-400">{listing.category}</p>
        <div className="mt-2 flex items-center gap-2">
          <span className={`badge ${conditionStyles[listing.condition]}`}>{listing.condition}</span>
          <span className="flex items-center gap-0.5 text-xs text-brand-400">
            <MapPin className="h-3 w-3" /> {listing.city}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-brand-500">
          <span className="truncate">{listing.shopName ?? listing.sellerName}</span>
          <span>Qty {listing.quantity}</span>
        </div>
        <div className="mt-3">
          {isFree ? (
            <button
              onClick={claim}
              disabled={claiming || sold || isOwn}
              className="btn-primary w-full !py-2 text-xs"
            >
              {isOwn ? 'Your Listing' : 'Claim Free Item'}
            </button>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); open(); }}
              disabled={sold && !isOwn}
              className="btn-brand w-full !py-2 text-xs"
            >
              {isOwn ? 'Your Listing' : sold ? 'Sold Out' : 'Buy Now'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export const FALLBACK =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="#EAF2EE"/><text x="50%" y="50%" font-family="sans-serif" font-size="18" fill="#4A8A6B" text-anchor="middle">No Image</text></svg>`
  );
