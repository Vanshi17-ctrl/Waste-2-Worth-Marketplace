import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface Props {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  type?: 'text' | 'email' | 'tel' | 'password' | 'number' | 'textarea';
  required?: boolean;
  autoComplete?: string;
  maxLength?: number;
  hint?: string;
}

export function Field({ id, label, value, onChange, placeholder, error, type = 'text', required, autoComplete, maxLength, hint }: Props) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (show ? 'text' : 'password') : type;
  const baseClass = error ? 'input border-red-400 focus:border-red-500 focus:ring-red-200' : 'input';

  return (
    <div>
      <label htmlFor={id} className="label">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          rows={4}
          className={baseClass}
        />
      ) : (
        <div className="relative">
          <input
            id={id}
            type={inputType}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            autoComplete={autoComplete}
            maxLength={maxLength}
            className={isPassword ? `${baseClass} pr-11` : baseClass}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-400 hover:text-brand-700"
              aria-label={show ? 'Hide password' : 'Show password'}
            >
              {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          )}
        </div>
      )}
      {hint && !error && <p className="mt-1 text-xs text-brand-400">{hint}</p>}
      {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
