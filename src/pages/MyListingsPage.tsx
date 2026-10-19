import { useState } from 'react';
import { Edit2, Trash2, CheckCircle2, Package, Eye, X, Save, Ban } from 'lucide-react';
import { useStore } from '@/store';
import { useRouter } from '@/router';
import { formatINR } from '@/data/seed';
import { FALLBACK } from '@/components/ProductCard';
import { CATEGORY_LIST, CONDITIONS } from '@/data/seed';
import type { Category, Condition } from '@/types';
import { toast } from '@/components/Toast';
import { Field } from '@/components/Field';
import { ImageUploader } from '@/components/ImageUploader';

export function MyListingsPage() {
  const { user, getUserListings, updateListing, deleteListing, markListingStatus, getListingClaims } = useStore();
  const { navigate } = useRouter();
  const [editing, setEditing] = useState<string | null>(null);

  if (!user) return null;
  const myListings = getUserListings(user.id);

  if (myListings.length === 0) {
    return (
      <div className="card flex flex-col items-center gap-3 p-12 text-center">
        <Package className="h-10 w-10 text-brand-300" />
        <p className="font-medium text-brand-700">You haven't listed anything yet.</p>
        <button onClick={() => navigate({ name: 'sell' })} className="btn-brand mt-2">List your first item</button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-900">My Listings</h1>
          <p className="text-sm text-brand-500">{myListings.length} items</p>
        </div>
        <button onClick={() => navigate({ name: 'sell' })} className="btn-brand">+ New Listing</button>
      </div>

      <div className="space-y-3">
        {myListings.map((l) => {
          const claimCount = getListingClaims(l.id).length;
          const isFree = l.mode === 'free' || l.price === 0;
          return (
            <div key={l.id} className="card p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <img src={l.images[0]} alt="" className="h-24 w-24 shrink-0 rounded-xl object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK; }} />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {isFree ? <span className="badge bg-accent text-brand-900">FREE</span> : <span className="badge bg-brand text-white">{formatINR(l.price)}</span>}
                    <span className="badge bg-brand-100 text-brand-700">{l.category}</span>
                    <span className="badge bg-blue-100 text-blue-800">{l.condition}</span>
                    <StatusBadge status={l.status} />
                  </div>
                  <h3 className="mt-2 font-semibold text-brand-900">{l.productName}</h3>
                  <p className="text-xs text-brand-400">Qty: {l.quantity} • {l.city}{claimCount > 0 && ` • ${claimCount} claim(s)`}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => navigate({ name: 'product', id: l.id })} className="btn-ghost !px-3" title="View"><Eye className="h-4 w-4" /></button>
                  <button onClick={() => setEditing(l.id)} className="btn-outline !px-3" title="Edit"><Edit2 className="h-4 w-4" /></button>
                  {l.status === 'available' && (
                    <button onClick={() => { markListingStatus(l.id, isFree ? 'handed-over' : 'sold'); toast('success', `Marked as ${isFree ? 'handed over' : 'sold'}.`); }} className="btn-outline !px-3" title={isFree ? 'Mark handed over' : 'Mark sold'}>
                      <CheckCircle2 className="h-4 w-4" />
                    </button>
                  )}
                  <button onClick={() => { if (confirm('Delete this listing?')) { deleteListing(l.id); toast('info', 'Listing deleted.'); } }} className="btn-danger !px-3" title="Delete"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {editing && (
        <EditModal
          listing={myListings.find((l) => l.id === editing)!}
          onClose={() => setEditing(null)}
          onSave={(data) => { updateListing(editing, data); setEditing(null); toast('success', 'Listing updated.'); }}
        />
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    available: 'bg-green-100 text-green-800',
    sold: 'bg-red-100 text-red-800',
    'handed-over': 'bg-brand text-white',
  };
  return <span className={`badge ${map[status] ?? 'bg-brand-100 text-brand-700'}`}>{status === 'handed-over' ? 'Handed Over' : status === 'available' ? 'Available' : 'Sold'}</span>;
}

function EditModal({ listing, onClose, onSave }: { listing: import('@/types').Listing; onClose: () => void; onSave: (data: Partial<import('@/types').Listing>) => void }) {
  const [productName, setProductName] = useState(listing.productName);
  const [category, setCategory] = useState<Category>(listing.category);
  const [condition, setCondition] = useState<Condition>(listing.condition);
  const [description, setDescription] = useState(listing.description);
  const [price, setPrice] = useState(String(listing.price));
  const [quantity, setQuantity] = useState(String(listing.quantity));
  const [brand, setBrand] = useState(listing.brand ?? '');
  const [productAge, setProductAge] = useState(listing.productAge ?? '');
  const [defects, setDefects] = useState(listing.defects ?? '');
  const [images, setImages] = useState<string[]>(listing.images);
  const isFree = listing.mode === 'free';

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-6 animate-slideUp sm:rounded-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-brand-900">Edit listing</h2>
          <button onClick={onClose} className="btn-ghost !px-3"><X className="h-5 w-5" /></button>
        </div>
        <div className="space-y-4">
          <ImageUploader images={images} onChange={setImages} />
          <Field id="pn" label="Product name" value={productName} onChange={setProductName} />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as Category)} className="input">
                {CATEGORY_LIST.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Condition</label>
              <select value={condition} onChange={(e) => setCondition(e.target.value as Condition)} className="input">
                {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <Field id="desc" label="Description" type="textarea" value={description} onChange={setDescription} />
          {!isFree && <Field id="price" label="Price (₹)" type="number" value={price} onChange={setPrice} />}
          <div className="grid grid-cols-2 gap-3">
            <Field id="qty" label="Quantity" type="number" value={quantity} onChange={setQuantity} />
            <Field id="brand" label="Brand" value={brand} onChange={setBrand} />
          </div>
          <Field id="age" label="Product age" value={productAge} onChange={setProductAge} />
          <Field id="def" label="Defects" type="textarea" value={defects} onChange={setDefects} />
          <div className="flex gap-3 pt-2">
            <button onClick={() => onSave({ productName, category, condition, description, price: isFree ? 0 : Number(price), quantity: Number(quantity), brand: brand || undefined, productAge: productAge || undefined, defects: defects || undefined, images })} className="btn-brand flex-1">
              <Save className="h-4 w-4" /> Save changes
            </button>
            <button onClick={onClose} className="btn-outline">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
