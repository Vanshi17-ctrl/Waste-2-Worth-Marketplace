import { useState } from 'react';
import type { ReactNode } from 'react';
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';

type ToastKind = 'success' | 'error' | 'info' | 'warning';
interface Toast { id: number; kind: ToastKind; message: string }

let pushExternal: ((kind: ToastKind, message: string) => void) | null = null;
export function toast(kind: ToastKind, message: string) {
  pushExternal?.(kind, message);
}

export function ToastHost() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  pushExternal = (kind, message) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, kind, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  };
  const icon: Record<ToastKind, ReactNode> = {
    success: <CheckCircle2 className="h-5 w-5 text-green-600" />,
    error: <XCircle className="h-5 w-5 text-red-600" />,
    info: <Info className="h-5 w-5 text-brand-600" />,
    warning: <AlertTriangle className="h-5 w-5 text-accent-600" />,
  };
  const bg: Record<ToastKind, string> = {
    success: 'border-green-200 bg-white',
    error: 'border-red-200 bg-white',
    info: 'border-brand-200 bg-white',
    warning: 'border-accent-200 bg-white',
  };
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex w-full max-w-xs flex-col gap-2 px-4 sm:px-0">
      {toasts.map((t) => (
        <div key={t.id} className={`flex items-start gap-3 rounded-xl border ${bg[t.kind]} p-3 shadow-card animate-popIn`}>
          {icon[t.kind]}
          <p className="flex-1 text-sm text-brand-800">{t.message}</p>
          <button onClick={() => setToasts((x) => x.filter((y) => y.id !== t.id))} className="text-brand-400 hover:text-brand-700">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
