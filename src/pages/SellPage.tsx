import { useMemo, useState } from 'react';
import { Tag, Gift, Eye, Send, CheckCircle2, Info } from 'lucide-react';
import { useStore } from '@/store';
import { useRouter } from '@/router';
import { Field } from '@/components/Field';
import { ImageUploader } from '@/components/ImageUploader';
import { CATEGORY_LIST, CONDITIONS, formatINR } from '@/data/seed';
import type { Category, Condition, ListingMode } from '@/types';
import { toast } from '@/components/Toast';

export function SellPage() {
  const { user, addListing } = useStore();
  const { navigate } = useRouter();
  const [mode, setMode] = useState<ListingMode>('sell');
  const [showPreview, setShowPreview] = useState(false);
  const [created, setCreated] = useState<string | null>(null);

  // Seller details (pre-filled from profile)
  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [shopName, setShopName] = useState('');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [pickupAddress, setPickupAddress] = useState('');
  const [city, setCity] = useState(user?.city ?? '');
  const [pincode, setPincode] = useState('');

  // Product details
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [condition, setCondition] = useState<Condition | ''>('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [brand, setBrand] = useState('');
  const [productAge, setProductAge] = useState('');
  const [defects, setDefects] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!fullName.trim()) e.fullName = 'Required';
    if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) e.phone = 'Enter a valid 10-digit number';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email';
    if (!pickupAddress.trim()) e.pickupAddress = 'Required';
    if (!city.trim()) e.city = 'Required';
    if (!/^\d{6}$/.test(pincode)) e.pincode = 'Enter a valid 6-digit PIN';
    if (!productName.trim()) e.productName = 'Required';
    if (!category) e.category = 'Select a category';
    if (!condition) e.condition = 'Select a condition';
    if (description.trim().length < 10) e.description = 'Add at least 10 characters';
    if (mode === 'sell') {
      const p = Number(price);
      if (price === '' || isNaN(p) || p < 0) e.price = 'Enter a valid non-negative price';
    }
    const q = Number(quantity);
    if (quantity === '' || isNaN(q) || q < 1) e.quantity = 'Enter at least 1';
    if (images.length === 0) e.images = 'Upload at least one photo';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const buildListingData = () => ({
    sellerName: fullName.trim(),
    shopName: shopName.trim() || undefined,
    contactPhone: phone.trim(),
    email: email.trim(),
    pickupAddress: pickupAddress.trim(),
    city: city.trim(),
    pincode: pincode.trim(),
    productName: productName.trim(),
    category: category as Category,
    condition: condition as Condition,
    description: description.trim(),
    price: mode === 'free' ? 0 : Number(price),
    quantity: Number(quantity),
    brand: brand.trim() || undefined,
    productAge: productAge.trim() || undefined,
    defects: defects.trim() || undefined,
    images,
    mode,
  });

  const onPreview = () => {
    if (validate()) setShowPreview(true);
    else toast('error', 'Please fix the highlighted fields.');
  };

  const onPublish = () => {
    if (!validate()) { toast('error', 'Please fix the highlighted fields.'); return; }
    const listing = addListing(buildListingData());
    setCreated(listing.id);
    toast('success', 'Listing published! It is now live in the marketplace.');
  };

  const reset = () => {
    setProductName(''); setCategory(''); setCondition(''); setDescription(''); setPrice('');
    setQuantity('1'); setBrand(''); setProductAge(''); setDefects(''); setImages([]);
    setShowPreview(false); setCreated(null); setErrors({});
  };

  if (created) {
    return (
      <div className="card mx-auto flex max-w-lg flex-col items-center gap-4 p-10 text-center animate-popIn">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-green-100 text-green-600">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <h2 className="font-display text-2xl font-bold text-brand-900">Listing Published!</h2>
        <p className="text-brand-500">Your item is now {mode === 'free' ? 'available to claim for free' : 'live in the Buy marketplace'}.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <button onClick={() => navigate({ name: 'product', id: created })} className="btn-brand">View listing</button>
          <button onClick={reset} className="btn-outline">List another item</button>
          <button onClick={() => navigate({ name: 'my-listings' })} className="btn-ghost">My Listings</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-900">List an item</h1>
        <p className="text-sm text-brand-500">Sell for cash or give it away for free. Private details stay private.</p>
      </div>

      {/* Mode toggle */}
      <div className="inline-flex rounded-2xl bg-brand-50 p-1">
        {(['sell','free'] as const).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setShowPreview(false); }}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition ${mode === m ? 'bg-white text-brand-900 shadow-sm' : 'text-brand-500'}`}
          >
            {m === 'sell' ? <Tag className="h-4 w-4" /> : <Gift className="h-4 w-4" />}
            {m === 'sell' ? 'Sell' : 'Give Free'}
          </button>
        ))}
      </div>

      {mode === 'free' && (
        <div className="demo-notice flex items-start gap-2">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <p>Free listings are set to <strong>₹0</strong> and shown in the Give Free section. Handover is arranged between you and the claimer in this demo.</p>
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); onPublish(); }} className="grid gap-6 lg:grid-cols-2">
        {/* Seller details */}
        <section className="card space-y-4 p-5">
          <h2 className="font-display text-lg font-bold text-brand-900">Seller details</h2>
          <Field id="fn" label="Full name" value={fullName} onChange={(v) => setFullName(v)} required error={errors.fullName} />
          <Field id="shop" label="Business / shop name (optional)" value={shopName} onChange={(v) => setShopName(v)} hint="Shown publicly if provided." />
          <Field id="ph" label="Contact number" type="tel" value={phone} onChange={(v) => setPhone(v)} required error={errors.phone} maxLength={10} hint="Private — never shown on the listing." />
          <Field id="em" label="Email address" type="email" value={email} onChange={(v) => setEmail(v)} required error={errors.email} hint="Private — never shown on the listing." />
          <Field id="addr" label="Pickup address" type="textarea" value={pickupAddress} onChange={(v) => setPickupAddress(v)} required error={errors.pickupAddress} hint="Private — only the city is shown publicly." />
          <div className="grid grid-cols-2 gap-3">
            <Field id="city" label="City" value={city} onChange={(v) => setCity(v)} required error={errors.city} />
            <Field id="pin" label="PIN code" value={pincode} onChange={(v) => setPincode(v)} required error={errors.pincode} maxLength={6} />
          </div>
        </section>

        {/* Product details */}
        <section className="card space-y-4 p-5">
          <h2 className="font-display text-lg font-bold text-brand-900">Product details</h2>
          <ImageUploader images={images} onChange={(imgs) => setImages(imgs)} />
          {errors.images && <p className="text-xs font-medium text-red-600">{errors.images}</p>}
          <Field id="pn" label="Product name" value={productName} onChange={(v) => setProductName(v)} required error={errors.productName} placeholder="e.g. Blue cotton shirt, Size L" />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Category <span className="text-accent">*</span></label>
              <select value={category} onChange={(e) => setCategory(e.target.value as Category)} className={`input ${errors.category ? 'border-red-400' : ''}`}>
                <option value="">Select…</option>
                {CATEGORY_LIST.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <p className="mt-1 text-xs font-medium text-red-600">{errors.category}</p>}
            </div>
            <div>
              <label className="label">Condition <span className="text-accent">*</span></label>
              <select value={condition} onChange={(e) => setCondition(e.target.value as Condition)} className={`input ${errors.condition ? 'border-red-400' : ''}`}>
                <option value="">Select…</option>
                {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.condition && <p className="mt-1 text-xs font-medium text-red-600">{errors.condition}</p>}
            </div>
          </div>
          <Field id="desc" label="Product description" type="textarea" value={description} onChange={(v) => setDescription(v)} required error={errors.description} placeholder="Describe the item, usage, what's included…" maxLength={600} />
          <Field id="def" label="Disclosed defects (optional)" type="textarea" value={defects} onChange={(v) => setDefects(v)} placeholder="Any scratches, wear, or issues buyers should know about" maxLength={300} />
          <div className="grid grid-cols-2 gap-3">
            {mode === 'sell' ? (
              <Field id="price" label="Selling price (₹)" type="number" value={price} onChange={(v) => setPrice(v)} required error={errors.price} placeholder="0" />
            ) : (
              <div>
                <label className="label">Price</label>
                <div className="input flex items-center justify-between bg-brand-50">
                  <span className="font-semibold text-brand-900">FREE</span>
                  <span className="badge bg-accent text-brand-900">₹0</span>
                </div>
              </div>
            )}
            <Field id="qty" label="Quantity available" type="number" value={quantity} onChange={(v) => setQuantity(v)} required error={errors.quantity} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field id="brand" label="Brand (optional)" value={brand} onChange={(v) => setBrand(v)} />
            <Field id="age" label="Product age (optional)" value={productAge} onChange={(v) => setProductAge(v)} placeholder="e.g. 1 year" />
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button type="button" onClick={onPreview} className="btn-outline">
              <Eye className="h-4 w-4" /> Preview Listing
            </button>
            <button type="submit" className="btn-brand">
              <Send className="h-4 w-4" /> Publish Listing
            </button>
          </div>
        </section>
      </form>

      {/* Preview modal */}
      {showPreview && (
        <PreviewModal
          data={buildListingData()}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}

function PreviewModal({ data, onClose }: { data: Omit<import('@/types').Listing, 'id' | 'createdAt' | 'sellerId' | 'status'>; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white p-6 animate-slideUp sm:rounded-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-brand-900">Listing preview</h2>
          <button onClick={onClose} className="btn-ghost !px-3">Close</button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="aspect-square overflow-hidden rounded-xl bg-brand-100">
            <img src={data.images[0]} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="space-y-2">
            <div className="flex gap-2">
              {data.mode === 'free' ? <span className="badge bg-accent text-brand-900">FREE</span> : <span className="badge bg-brand text-white">{formatINR(data.price)}</span>}
              <span className="badge bg-brand-100 text-brand-700">{data.category}</span>
              <span className="badge bg-blue-100 text-blue-800">{data.condition}</span>
            </div>
            <h3 className="font-display text-lg font-bold text-brand-900">{data.productName}</h3>
            <p className="text-sm text-brand-500">{data.shopName ?? data.sellerName} • {data.city}</p>
            <p className="text-sm text-brand-700">{data.description}</p>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              {data.brand && <div><dt className="text-xs text-brand-400">Brand</dt><dd className="font-medium">{data.brand}</dd></div>}
              {data.productAge && <div><dt className="text-xs text-brand-400">Age</dt><dd className="font-medium">{data.productAge}</dd></div>}
              <div><dt className="text-xs text-brand-400">Qty</dt><dd className="font-medium">{data.quantity}</dd></div>
            </dl>
            {data.defects && <p className="rounded-lg bg-amber-50 p-2 text-xs text-amber-800"><strong>Defects:</strong> {data.defects}</p>}
            <p className="text-xs text-brand-400">Private details (address, phone, email) are hidden publicly and only the city is shown.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
