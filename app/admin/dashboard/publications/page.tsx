"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Publication, Locale } from "@/lib/types";
import { LOCALES } from "@/lib/i18n/config";
import { useAdminI18n } from "@/lib/i18n/admin-context";
import { FileText, Plus, Edit2, Trash2, Upload, X } from "lucide-react";

export default function PublicationsManagementPage() {
  const { adminDict } = useAdminI18n();
  const t = adminDict.publicationsPage;
  const c = adminDict.common;
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTabLocale, setActiveTabLocale] = useState<Locale>("en");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [slug, setSlug] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("published");
  const [ctaLabel, setCtaLabel] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [sortOrder, setSortOrder] = useState(1);
  const [translations, setTranslations] = useState<
    Record<Locale, { title: string; short_description: string; content: string }>
  >({
    en: { title: "", short_description: "", content: "" },
    fr: { title: "", short_description: "", content: "" },
    ar: { title: "", short_description: "", content: "" },
    es: { title: "", short_description: "", content: "" },
    it: { title: "", short_description: "", content: "" },
  });

  const fetchPublications = () => {
    setLoading(true);
    fetch("/api/admin/publications")
      .then((res) => res.json())
      .then((data) => {
        if (data.publications) setPublications(data.publications);
      })
      .catch((err) => console.error("Error loading publications:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPublications();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setSlug("");
    setImageUrl(
      "/images/facility/storage-tanks.jpg"
    );
    setStatus("published");
    setCtaLabel("Read More");
    setCtaUrl("/contact");
    setSortOrder(publications.length + 1);
    setTranslations({
      en: { title: "", short_description: "", content: "" },
      fr: { title: "", short_description: "", content: "" },
      ar: { title: "", short_description: "", content: "" },
      es: { title: "", short_description: "", content: "" },
      it: { title: "", short_description: "", content: "" },
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (pub: Publication) => {
    setEditingId(pub.id);
    setSlug(pub.slug);
    setImageUrl(pub.image_url);
    setStatus(pub.status);
    setCtaLabel(pub.cta_label || "");
    setCtaUrl(pub.cta_url || "");
    setSortOrder(pub.sort_order);
    setTranslations(pub.translations);
    setIsEditing(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const data = new FormData();
      data.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: data,
      });
      const json = await res.json();
      if (json.url) setImageUrl(json.url);
    } catch {
      alert("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        id: editingId,
        slug,
        image_url: imageUrl,
        status,
        cta_label: ctaLabel || null,
        cta_url: ctaUrl || null,
        sort_order: Number(sortOrder),
        translations,
      };

      const res = await fetch("/api/admin/publications", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setIsEditing(false);
        fetchPublications();
      } else {
        alert(data.error || "Failed to save publication.");
      }
    } catch {
      alert("Error saving publication.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this publication?")) return;
    try {
      const res = await fetch(`/api/admin/publications?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchPublications();
    } catch (err) {
      console.error(err);
    }
  };

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

        <button
          onClick={handleOpenCreate}
          className="btn-primary py-2.5 px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t.addNew}</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-gray-500">
            {c.loading}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3.5">Image & Title</th>
                  <th className="px-6 py-3.5">Slug</th>
                  <th className="px-6 py-3.5">Published Date</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {publications.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/80">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                        <Image
                          src={p.image_url}
                          alt="Cover"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">
                          {p.translations.en?.title || p.slug}
                        </p>
                        <p className="text-gray-400 text-[11px] truncate max-w-sm">
                          {p.translations.en?.short_description}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-mono text-[11px]">
                      /{p.slug}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(p.published_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          p.status === "published"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 text-gray-500 hover:text-verdalia-olive rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-verdalia-dark">
                {editingId ? "Edit Publication" : "Create New Publication"}
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                      URL Slug *
                    </label>
                    <input
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="e.g. olive-harvest-2026"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                      Publication Status
                    </label>
                    <select
                      value={status}
                      onChange={(e: any) => setStatus(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded font-semibold"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                      Sort Order
                    </label>
                    <input
                      type="number"
                      value={sortOrder}
                      onChange={(e) => setSortOrder(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded"
                    />
                  </div>
                </div>

                {/* Image */}
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Article Image URL
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded"
                    />
                    <label className="px-3.5 py-2 bg-verdalia-beige rounded text-verdalia-dark font-semibold cursor-pointer inline-flex items-center gap-1.5 flex-shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploading ? "Uploading..." : "Upload"}</span>
                      <input
                        type="file"
                        onChange={handleImageUpload}
                        className="hidden"
                        accept="image/*"
                      />
                    </label>
                  </div>
                </div>

                {/* Multilingual translations */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase text-gray-700">
                      Article Translation:
                    </span>
                    <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                      {LOCALES.map((code) => (
                        <button
                          type="button"
                          key={code}
                          onClick={() => setActiveTabLocale(code)}
                          className={`px-3 py-1 text-xs font-bold rounded ${
                            activeTabLocale === code
                              ? "bg-verdalia-olive text-white shadow-sm"
                              : "text-gray-600 hover:text-gray-900"
                          }`}
                        >
                          {code.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                        Title ({activeTabLocale.toUpperCase()}) *
                      </label>
                      <input
                        type="text"
                        required={activeTabLocale === "en"}
                        value={translations[activeTabLocale]?.title || ""}
                        onChange={(e) =>
                          setTranslations({
                            ...translations,
                            [activeTabLocale]: {
                              ...translations[activeTabLocale],
                              title: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                        Short Summary
                      </label>
                      <input
                        type="text"
                        value={translations[activeTabLocale]?.short_description || ""}
                        onChange={(e) =>
                          setTranslations({
                            ...translations,
                            [activeTabLocale]: {
                              ...translations[activeTabLocale],
                              short_description: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                        Full Article Content
                      </label>
                      <textarea
                        rows={4}
                        value={translations[activeTabLocale]?.content || ""}
                        onChange={(e) =>
                          setTranslations({
                            ...translations,
                            [activeTabLocale]: {
                              ...translations[activeTabLocale],
                              content: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded resize-none"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary py-2 px-6 text-xs font-bold uppercase tracking-wider"
                >
                  {saving ? "Saving..." : "Save Publication"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
