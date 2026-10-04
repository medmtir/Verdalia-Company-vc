import React, { useState } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2 } from 'lucide-react';

export function ImageUploader({ value, onChange, label = 'Image' }: { value: string; onChange: (url: string) => void; label?: string; }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const data = new FormData();
      data.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: data });
      const json = await res.json();
      if (json.url) { onChange(json.url); }
    } catch (err) { alert('Error uploading image'); }
    finally { setUploading(false); }
  };

  return (
    <div className="mb-4">
      <label className="block text-xs font-bold uppercase text-gray-700 mb-2">{label}</label>
      <div className="flex items-center gap-4">
        {value ? (
          <div className="relative w-32 h-20 rounded-md border border-gray-200 overflow-hidden">
            <Image src={value} alt="Preview" fill className="object-cover" unoptimized={value.startsWith('http')} />
            <button type="button" onClick={() => onChange('')} className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-red-500 hover:bg-white"><X size={14}/></button>
          </div>
        ) : (
          <div className="w-32 h-20 rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
            <span className="text-xs text-gray-400">No image</span>
          </div>
        )}
        <div className="flex-1">
          <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder="/images/... or upload" className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded font-mono text-gray-600 mb-2" />
          <label className="cursor-pointer inline-flex items-center justify-center px-4 py-2 bg-verdalia-olive text-white text-xs font-bold rounded shadow-sm hover:bg-[#2A4C22] transition-colors">
            {uploading ? <Loader2 size={14} className="animate-spin mr-2" /> : <Upload size={14} className="mr-2" />}
            {uploading ? 'Uploading...' : 'Upload Image'}
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>
      </div>
    </div>
  );
}
