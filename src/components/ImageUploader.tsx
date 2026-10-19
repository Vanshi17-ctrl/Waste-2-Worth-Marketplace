import { useState } from 'react';
import { ImageIcon, Upload, X } from 'lucide-react';
import { toast } from '@/components/Toast';

const MAX_SIZE = 3 * 1024 * 1024; // 3MB

interface Props {
  images: string[];
  onChange: (images: string[]) => void;
}

export function ImageUploader({ images, onChange }: Props) {
  const [busy, setBusy] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    if (images.length + arr.length > 6) {
      toast('warning', 'You can upload up to 6 photos.');
      return;
    }
    setBusy(true);
    const next: string[] = [];
    for (const file of arr) {
      if (!file.type.startsWith('image/')) {
        toast('error', `${file.name} is not an image.`);
        continue;
      }
      if (file.size > MAX_SIZE) {
        toast('error', `${file.name} is larger than 3MB.`);
        continue;
      }
      const dataUrl = await readAsDataURL(file);
      next.push(dataUrl);
    }
    onChange([...images, ...next]);
    setBusy(false);
  };

  const remove = (i: number) => onChange(images.filter((_, idx) => idx !== i));

  return (
    <div>
      <label className="label">Product photos <span className="text-accent">*</span> <span className="font-normal text-brand-400">(up to 6, max 3MB each)</span></label>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {images.map((src, i) => (
          <div key={i} className="group relative aspect-square overflow-hidden rounded-xl border border-brand-200 bg-brand-50">
            <img src={src} alt={`Preview ${i + 1}`} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition group-hover:opacity-100"
              aria-label="Remove photo"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            {i === 0 && <span className="absolute bottom-1 left-1 rounded bg-accent px-1.5 py-0.5 text-[10px] font-bold text-brand-900">COVER</span>}
          </div>
        ))}
        {images.length < 6 && (
          <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-brand-200 bg-brand-50 text-brand-400 transition hover:border-accent hover:text-accent">
            {busy ? <span className="text-xs">Processing…</span> : (<>
              <Upload className="h-5 w-5" />
              <span className="text-[11px] font-medium">Add photo</span>
            </>)}
            <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
          </label>
        )}
      </div>
      {images.length === 0 && (
        <div className="mt-2 flex items-center gap-2 rounded-lg bg-brand-50 p-2 text-xs text-brand-400">
          <ImageIcon className="h-4 w-4" /> Upload at least one photo. The first photo becomes the cover image.
        </div>
      )}
    </div>
  );
}

function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
