import { useState } from 'react';
import { User as UserIcon, Mail, Phone, MapPin, Save, LogOut, Edit3, ShieldCheck } from 'lucide-react';
import { useStore } from '@/store';
import { Field } from '@/components/Field';
import { toast } from '@/components/Toast';

export function ProfilePage() {
  const { user, updateProfile, logout, getUserListings, getUserOrders, getUserClaims } = useStore();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.fullName ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [city, setCity] = useState(user?.city ?? '');

  if (!user) return null;

  const save = () => {
    if (!name.trim()) { toast('error', 'Name cannot be empty.'); return; }
    if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) { toast('error', 'Enter a valid 10-digit phone.'); return; }
    updateProfile({ fullName: name.trim(), phone: phone.trim(), city: city.trim() });
    setEditing(false);
    toast('success', 'Profile updated.');
  };

  const stats = [
    { label: 'Listings', value: getUserListings(user.id).length },
    { label: 'Orders', value: getUserOrders(user.id).length },
    { label: 'Claims', value: getUserClaims(user.id).length },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="card overflow-hidden">
        <div className="bg-brand p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-accent text-2xl font-bold text-brand-900">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="font-display text-xl font-bold">{user.fullName}</h1>
              <p className="text-sm text-brand-200">{user.email}</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 divide-x divide-brand-100 border-b border-brand-100">
          {stats.map((s) => (
            <div key={s.label} className="p-4 text-center">
              <p className="font-display text-2xl font-bold text-brand-900">{s.value}</p>
              <p className="text-xs text-brand-500">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-brand-900">Profile details</h2>
          {!editing && <button onClick={() => setEditing(true)} className="btn-outline !py-1.5 text-xs"><Edit3 className="h-3.5 w-3.5" /> Edit</button>}
        </div>

        {editing ? (
          <div className="space-y-4">
            <Field id="n" label="Full name" value={name} onChange={setName} />
            <Field id="p" label="Phone" type="tel" value={phone} onChange={setPhone} maxLength={10} />
            <Field id="c" label="City" value={city} onChange={setCity} />
            <div className="flex gap-3">
              <button onClick={save} className="btn-brand"><Save className="h-4 w-4" /> Save</button>
              <button onClick={() => { setEditing(false); setName(user.fullName); setPhone(user.phone); setCity(user.city ?? ''); }} className="btn-outline">Cancel</button>
            </div>
          </div>
        ) : (
          <dl className="space-y-3 text-sm">
            <Row icon={UserIcon} label="Full name" value={user.fullName} />
            <Row icon={Mail} label="Email" value={user.email} />
            <Row icon={Phone} label="Phone" value={user.phone} />
            <Row icon={MapPin} label="City" value={user.city || '—'} />
          </dl>
        )}
      </div>

      <div className="demo-notice flex items-start gap-2">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
        <p><strong>Demo account.</strong> Your details are stored locally in this browser only. This is not production-grade security.</p>
      </div>

      <button onClick={logout} className="btn-danger w-full">
        <LogOut className="h-4 w-4" /> Logout
      </button>
    </div>
  );
}

function Row({ icon: Icon, label, value }: { icon: typeof UserIcon; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-brand-50 p-3">
      <Icon className="h-4 w-4 text-accent" />
      <div>
        <p className="text-xs text-brand-400">{label}</p>
        <p className="font-medium text-brand-900">{value}</p>
      </div>
    </div>
  );
}
