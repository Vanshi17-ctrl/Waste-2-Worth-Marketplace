import { useMemo, useState } from 'react';
import { Gift, Search, MapPin, HandHeart, Package, X, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useStore } from '@/store';
import { useRouter } from '@/router';
import { CATEGORY_LIST, CITIES } from '@/data/seed';
import { FALLBACK } from '@/components/ProductCard';
import type { ClaimStatus, Category } from '@/types';
import { toast } from '@/components/Toast';

const CLAIM_STATUS_META: Record<ClaimStatus, { color: string; icon: typeof Clock }> = {
  'Requested': { color: 'bg-blue-100 text-blue-800', icon: Clock },
  'Accepted': { color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
  'Handed Over': { color: 'bg-brand text-white', icon: Gift },
  'Cancelled': { color: 'bg-red-100 text-red-800', icon: XCircle },
};

export function FreePage() {
  const { listings, user, addClaim, getUserClaims, getListingClaims, updateClaimStatus, claims } = useStore();
  const { navigate } = useRouter();
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<Category | ''>('');
  const [city, setCity] = useState('');
  const [showClaims, setShowClaims] = useState(false);
  const [tab, setTab] = useState<'browse' | 'my-claims'>('browse');

  const freeListings = useMemo(() => {
    let list = listings.filter((l) => (l.mode === 'free' || l.price === 0) && l.status !== 'sold');
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((l) => l.productName.toLowerCase().includes(q) || l.description.toLowerCase().includes(q));
    }
    if (cat) list = list.filter((l) => l.category === cat);
    if (city) list = list.filter((l) => l.city === city);
    return [...list].sort((a, b) => b.createdAt - a.createdAt);
  }, [listings, query, cat, city]);

  const myClaims = user ? getUserClaims(user.id) : [];
  const sellerClaims = user ? claims.filter((c) => listings.find((l) => l.id === c.listingId)?.sellerId === user.id) : [];

  const claim = (listingId: string) => {
    if (!user) { toast('info', 'Please log in to claim.'); navigate({ name: 'login' }); return; }
    const res = addClaim(listingId);
    if (res.ok) { toast('success', 'Claim requested! The seller will respond.'); setShowClaims(true); setTab('my-claims'); }
    else toast('error', res.error ?? 'Could not claim.');
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand p-6 text-white">
        <div className="flex items-center gap-2">
          <Gift className="h-6 w-6 text-accent" />
          <h1 className="font-display text-2xl font-bold">Give Free</h1>
        </div>
        <p className="mt-1 text-sm text-brand-100">Things people are giving away for free. Claim and arrange pickup directly with the giver (demo).</p>
      </div>

      <div className="inline-flex rounded-xl bg-brand-50 p-1">
        <button onClick={() => setTab('browse')} className={`rounded-lg px-4 py-2 text-sm font-semibold ${tab === 'browse' ? 'bg-white text-brand-900 shadow-sm' : 'text-brand-500'}`}>Browse Free</button>
        <button onClick={() => setTab('my-claims')} className={`rounded-lg px-4 py-2 text-sm font-semibold ${tab === 'my-claims' ? 'bg-white text-brand-900 shadow-sm' : 'text-brand-500'}`}>
          My Claims {myClaims.length > 0 && <span className="ml-1 rounded-full bg-accent px-1.5 text-[10px] text-brand-900">{myClaims.length}</span>}
        </button>
      </div>

      {tab === 'browse' && (
        <>
          <div className="card flex flex-col gap-3 p-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-400" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search free items…" className="input pl-10" />
            </div>
            <select value={cat} onChange={(e) => setCat(e.target.value as Category | '')} className="input !w-auto">
              <option value="">All categories</option>
              {CATEGORY_LIST.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={city} onChange={(e) => setCity(e.target.value)} className="input !w-auto">
              <option value="">All locations</option>
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {freeListings.length === 0 ? (
            <div className="card flex flex-col items-center gap-3 p-12 text-center">
              <Gift className="h-10 w-10 text-brand-300" />
              <p className="font-medium text-brand-700">No free items right now.</p>
              <button onClick={() => navigate({ name: 'sell' })} className="btn-brand mt-2">Give something away</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {freeListings.map((l) => {
                const isOwn = user?.id === l.sellerId;
                const claimed = claims.some((c) => c.listingId === l.id && c.claimerId === user?.id && c.status !== 'Cancelled');
                const listingClaims = getListingClaims(l.id);
                return (
                  <div key={l.id} className="card flex flex-col overflow-hidden">
                    <div className="relative aspect-[4/3] bg-brand-100" onClick={() => navigate({ name: 'product', id: l.id })}>
                      <img src={l.images[0]} alt={l.productName} className="h-full w-full cursor-pointer object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK; }} />
                      <span className="absolute left-2 top-2 badge bg-accent text-brand-900">FREE</span>
                      {l.status === 'handed-over' && <div className="absolute inset-0 grid place-items-center bg-black/50"><span className="rounded bg-white px-3 py-1 text-xs font-bold uppercase text-brand-900">Handed Over</span></div>}
                    </div>
                    <div className="flex flex-1 flex-col p-3">
                      <h3 className="line-clamp-2 text-sm font-semibold text-brand-900">{l.productName}</h3>
                      <p className="mt-1 text-xs text-brand-400">{l.category} • {l.condition}</p>
                      <p className="mt-1 flex items-center gap-1 text-xs text-brand-500"><MapPin className="h-3 w-3" /> {l.city}</p>
                      {listingClaims.length > 0 && <p className="mt-1 text-xs text-blue-600">{listingClaims.length} claim(s)</p>}
                      <div className="mt-3">
                        {isOwn ? (
                          <button onClick={() => navigate({ name: 'product', id: l.id })} className="btn-outline w-full !py-2 text-xs">View claims</button>
                        ) : l.status === 'handed-over' ? (
                          <button disabled className="btn-outline w-full !py-2 text-xs opacity-60">Handed Over</button>
                        ) : claimed ? (
                          <button onClick={() => setTab('my-claims')} className="btn-outline w-full !py-2 text-xs">View claim status</button>
                        ) : (
                          <button onClick={() => claim(l.id)} className="btn-primary w-full !py-2 text-xs">
                            <HandHeart className="h-3.5 w-3.5" /> Claim Free Item
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {tab === 'my-claims' && (
        <div className="space-y-5">
          <div className="card p-5">
            <h2 className="mb-3 font-display text-lg font-bold text-brand-900">My claims</h2>
            {myClaims.length === 0 ? (
              <p className="text-sm text-brand-400">You haven't claimed any free items yet.</p>
            ) : (
              <ul className="space-y-3">
                {myClaims.map((c) => {
                  const l = listings.find((x) => x.id === c.listingId);
                  if (!l) return null;
                  const meta = CLAIM_STATUS_META[c.status];
                  const Icon = meta.icon;
                  return (
                    <li key={c.id} className="flex items-center gap-3 rounded-xl bg-brand-50 p-3">
                      <img src={l.images[0]} alt="" className="h-14 w-14 rounded-lg object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK; }} />
                      <div className="flex-1">
                        <p className="font-medium text-brand-900">{l.productName}</p>
                        <p className="text-xs text-brand-400">{l.city} • claimed {new Date(c.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className={`badge ${meta.color}`}><Icon className="h-3.5 w-3.5" /> {c.status}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {sellerClaims.length > 0 && (
            <div className="card p-5">
              <h2 className="mb-1 font-display text-lg font-bold text-brand-900">Claims on your free items</h2>
              <p className="mb-3 text-xs text-brand-400">Accept, hand over, or cancel claims. Handover is arranged by users in this demo.</p>
              <ul className="space-y-3">
                {sellerClaims.map((c) => {
                  const l = listings.find((x) => x.id === c.listingId);
                  if (!l) return null;
                  const meta = CLAIM_STATUS_META[c.status];
                  const Icon = meta.icon;
                  return (
                    <li key={c.id} className="rounded-xl border border-brand-100 p-3">
                      <div className="flex items-center gap-3">
                        <img src={l.images[0]} alt="" className="h-12 w-12 rounded-lg object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK; }} />
                        <div className="flex-1">
                          <p className="font-medium text-brand-900">{l.productName}</p>
                          <p className="text-xs text-brand-400">Claimed by {c.claimerName} • {new Date(c.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span className={`badge ${meta.color}`}><Icon className="h-3.5 w-3.5" /> {c.status}</span>
                      </div>
                      {c.status !== 'Handed Over' && c.status !== 'Cancelled' && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {c.status === 'Requested' && (
                            <button onClick={() => { updateClaimStatus(c.id, 'Accepted'); toast('success', 'Claim accepted.'); }} className="btn-brand !py-1.5 text-xs">Accept</button>
                          )}
                          {c.status === 'Accepted' && (
                            <button onClick={() => { updateClaimStatus(c.id, 'Handed Over'); toast('success', 'Marked as handed over!'); }} className="btn-primary !py-1.5 text-xs">Mark Handed Over</button>
                          )}
                          <button onClick={() => { updateClaimStatus(c.id, 'Cancelled'); toast('info', 'Claim cancelled.'); }} className="btn-danger !py-1.5 text-xs">Cancel</button>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
