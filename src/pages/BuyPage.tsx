import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal, X, PackageSearch } from 'lucide-react';
import { useStore } from '@/store';
import { ProductCard } from '@/components/ProductCard';
import { CATEGORY_LIST, CITIES, CONDITIONS } from '@/data/seed';
import type { Category, Condition } from '@/types';

type SortKey = 'newest' | 'price-low' | 'price-high';
const SORTS: { key: SortKey; label: string }[] = [
  { key: 'newest', label: 'Newest first' },
  { key: 'price-low', label: 'Price: Low to High' },
  { key: 'price-high', label: 'Price: High to Low' },
];

export function BuyPage({ freeOnly = false }: { freeOnly?: boolean }) {
  const { listings } = useStore();
  const [query, setQuery] = useState('');
  const [cats, setCats] = useState<Set<Category>>(new Set());
  const [conds, setConds] = useState<Set<Condition>>(new Set());
  const [cities, setCities] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<SortKey>('newest');
  const [showFilters, setShowFilters] = useState(false);

  const toggle = <T,>(set: Set<T>, val: T, updater: (s: Set<T>) => void) => {
    const next = new Set(set);
    next.has(val) ? next.delete(val) : next.add(val);
    updater(next);
  };

  const results = useMemo(() => {
    let list = listings.filter((l) => l.status === 'available');
    if (freeOnly) list = list.filter((l) => l.mode === 'free' || l.price === 0);
    else list = list.filter((l) => l.mode !== 'free' && l.price > 0);

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((l) =>
        l.productName.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q) ||
        (l.brand ?? '').toLowerCase().includes(q)
      );
    }
    if (cats.size) list = list.filter((l) => cats.has(l.category));
    if (conds.size) list = list.filter((l) => conds.has(l.condition));
    if (cities.size) list = list.filter((l) => cities.has(l.city));

    switch (sort) {
      case 'price-low': list = [...list].sort((a, b) => a.price - b.price); break;
      case 'price-high': list = [...list].sort((a, b) => b.price - a.price); break;
      default: list = [...list].sort((a, b) => b.createdAt - a.createdAt);
    }
    return list;
  }, [listings, freeOnly, query, cats, conds, cities, sort]);

  const activeFilters = cats.size + conds.size + cities.size;
  const clearAll = () => { setCats(new Set()); setConds(new Set()); setCities(new Set()); };

  const FilterPanel = () => (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-500">Category</p>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_LIST.map((c) => (
            <button key={c} onClick={() => toggle(cats, c, setCats)}
              className={`chip ${cats.has(c) ? 'border-accent bg-accent text-brand-900' : 'border-brand-200 bg-white text-brand-600 hover:border-brand-400'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-500">Condition</p>
        <div className="flex flex-wrap gap-2">
          {CONDITIONS.map((c) => (
            <button key={c} onClick={() => toggle(conds, c, setConds)}
              className={`chip ${conds.has(c) ? 'border-accent bg-accent text-brand-900' : 'border-brand-200 bg-white text-brand-600 hover:border-brand-400'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-500">Location</p>
        <div className="flex flex-wrap gap-2">
          {CITIES.map((c) => (
            <button key={c} onClick={() => toggle(cities, c, setCities)}
              className={`chip ${cities.has(c) ? 'border-accent bg-accent text-brand-900' : 'border-brand-200 bg-white text-brand-600 hover:border-brand-400'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>
      {activeFilters > 0 && (
        <button onClick={clearAll} className="flex items-center gap-1 text-xs font-medium text-red-600 hover:underline">
          <X className="h-3.5 w-3.5" /> Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-900">{freeOnly ? 'Give Free items' : 'Buy Products'}</h1>
        <p className="text-sm text-brand-500">{freeOnly ? 'Things people are giving away for free. Claim and arrange pickup.' : 'Pre-loved items looking for a new home.'}</p>
      </div>

      {/* Search + sort bar */}
      <div className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={freeOnly ? 'Search free items…' : 'Search products, brands, categories…'}
            className="input pl-10"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters((s) => !s)}
            className="btn-outline relative"
          >
            <SlidersHorizontal className="h-4 w-4" /> Filters
            {activeFilters > 0 && <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-accent text-[10px] font-bold text-brand-900">{activeFilters}</span>}
          </button>
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="input !w-auto !py-2.5">
            {SORTS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
        {/* Desktop filters */}
        <aside className="hidden lg:block">
          <div className="card sticky top-20 p-4">
            <h3 className="mb-3 font-semibold text-brand-900">Filters</h3>
            <FilterPanel />
          </div>
        </aside>

        {/* Mobile filters */}
        {showFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilters(false)} />
            <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-white p-5 animate-slideUp">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-brand-900">Filters</h3>
                <button onClick={() => setShowFilters(false)} className="rounded-lg p-1 hover:bg-brand-50"><X className="h-5 w-5" /></button>
              </div>
              <FilterPanel />
              <button onClick={() => setShowFilters(false)} className="btn-brand mt-5 w-full">Show {results.length} results</button>
            </div>
          </div>
        )}

        {/* Results */}
        <div>
          <p className="mb-3 text-sm text-brand-500">{results.length} {results.length === 1 ? 'item' : 'items'} found</p>
          {results.length === 0 ? (
            <div className="card flex flex-col items-center gap-3 p-12 text-center">
              <PackageSearch className="h-10 w-10 text-brand-300" />
              <p className="font-medium text-brand-700">No items match your search.</p>
              <p className="text-sm text-brand-400">Try adjusting filters or search terms.</p>
              {activeFilters > 0 && <button onClick={clearAll} className="btn-outline mt-2">Clear filters</button>}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {results.map((l) => <ProductCard key={l.id} listing={l} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
