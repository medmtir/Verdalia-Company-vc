"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useAdminI18n } from "@/lib/i18n/admin-context";
import { Upload, Image as ImageIcon, Trash2, X, ZoomIn } from "lucide-react";

interface MediaItem {
  id: string;
  name: string;
  url: string;
  size: string;
  type: string;
  created_at: string;
}

export default function MediaManagerPage() {
  const { adminDict } = useAdminI18n();
  const t = adminDict.mediaPage;
  const c = adminDict.common;
  const [uploading, setUploading] = useState(false);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [lightboxName, setLightboxName] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch("/api/admin/upload")
      .then((res) => res.json())
      .then((data) => {
        if (data.files) setMediaList(data.files);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const data = new FormData();
      data.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: data });
      const json = await res.json();
      if (json.url) {
        // Refresh list from server
        const listRes = await fetch("/api/admin/upload");
        const listData = await listRes.json();
        if (listData.files) setMediaList(listData.files);
      }
    } catch {
      alert("Échec du téléchargement du fichier.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (item: MediaItem) => {
    if (!confirm(`Supprimer définitivement "${item.name}" ?`)) return;
    try {
      const res = await fetch(
        `/api/admin/upload?id=${item.id}&url=${encodeURIComponent(item.url)}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (data.success) {
        setMediaList((prev) => prev.filter((m) => m.id !== item.id));
      }
    } catch {
      alert("Échec de la suppression.");
    }
  };

  const isImage = (url: string) => /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(url);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-verdalia-dark">
            {t.title}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {t.subtitle}
          </p>
        </div>
        <label className="btn-primary py-2.5 px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer self-start sm:self-auto shadow-sm">
          <Upload className="w-4 h-4" />
          <span>{uploading ? c.uploading : t.uploadNew}</span>
          <input
            type="file"
            onChange={handleUpload}
            className="hidden"
            accept="image/*,.pdf,.svg"
          />
        </label>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-gray-500">
          {c.loading}
        </div>
      ) : mediaList.length === 0 ? (
        <div className="py-20 text-center text-xs text-gray-500">
          {t.noMedia}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {mediaList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-md transition-shadow"
            >
              <div
                className="relative aspect-square bg-gray-50 p-2 flex items-center justify-center cursor-pointer"
                onClick={() => {
                  if (isImage(item.url)) {
                    setLightboxUrl(item.url);
                    setLightboxName(item.name);
                  }
                }}
              >
                {isImage(item.url) ? (
                  <>
                    <div className="relative w-full h-full">
                      <Image
                        src={item.url}
                        alt={item.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                      <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                    </div>
                  </>
                ) : (
                  <ImageIcon className="w-10 h-10 text-gray-400" />
                )}
              </div>

              <div className="p-3 border-t border-gray-100 space-y-2">
                <div>
                  <p
                    className="text-xs font-bold text-gray-800 truncate"
                    title={item.name}
                  >
                    {item.name}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {item.type} • {item.size}
                  </p>
                </div>

                <div className="flex items-center justify-end pt-1">
                  <button
                    onClick={() => handleDelete(item)}
                    className="w-full py-1.5 px-2 bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-md transition-colors flex items-center justify-center gap-1.5 text-[11px] font-semibold border border-gray-100 hover:border-red-200"
                    title="Supprimer définitivement"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Supprimer</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal with Full-Screen Blur */}
      {mounted && lightboxUrl && createPortal(
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in"
          style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
          onClick={() => setLightboxUrl(null)}
        >
          <div
            className="relative max-w-5xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxUrl(null)}
              className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white transition-colors flex items-center gap-1 text-xs font-semibold"
            >
              <span>Fermer</span>
              <X className="w-5 h-5" />
            </button>
            <div className="relative w-full h-[80vh] bg-black/30 rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center">
              <Image
                src={lightboxUrl}
                alt={lightboxName}
                fill
                className="object-contain"
              />
            </div>
            <p className="text-center text-xs text-white/80 mt-3 font-medium tracking-wide">
              {lightboxName}
            </p>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
