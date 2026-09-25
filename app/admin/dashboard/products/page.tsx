"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Product, Locale } from "@/lib/types";
import { LOCALES, LOCALE_METAS } from "@/lib/i18n/config";
import { useAdminI18n } from "@/lib/i18n/admin-context";
import { AutoTranslateButton } from "@/components/ui/AutoTranslateButton";
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Upload,
  Globe,
  Loader2,
  Sliders,
  Eye,
  EyeOff,
} from "lucide-react";

export default function ProductsManagementPage() {
  const { adminDict } = useAdminI18n();
  const t = adminDict.productsPage;
  const c = adminDict.common;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTabLocale, setActiveTabLocale] = useState<Locale>("en");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [slug, setSlug] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(1);
  const [specs, setSpecs] = useState({
    acidity: "< 0.8%",
    variety: "Chemlali & Chetoui",
    extraction: "Cold Extraction (< 27°C)",
    origin: "Tunisia",
    packaging: "Flexitank, Drums, Bottles",
    moq: "1 x 20ft Container",
  });
  const [translations, setTranslations] = useState<
    Record<
      Locale,
      {
        name: string;
        short_description: string;
        full_description: string;
        formats: string[];
      }
    >
  >({
    en: { name: "", short_description: "", full_description: "", formats: [] },
    fr: { name: "", short_description: "", full_description: "", formats: [] },
    ar: { name: "", short_description: "", full_description: "", formats: [] },
    es: { name: "", short_description: "", full_description: "", formats: [] },
    it: { name: "", short_description: "", full_description: "", formats: [] },
  });

  const fetchProducts = () => {
    setLoading(true);
    fetch("/api/admin/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.products) setProducts(data.products);
      })
      .catch((err) => console.error("Error loading products:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setSlug("");
    setImageUrl(
      "/images/facility/storage-tanks.jpg"
    );
    setIsActive(true);
    setSortOrder(products.length + 1);
    setSpecs({
      acidity: "< 0.8%",
      variety: "Chemlali & Chetoui",
      extraction: "Cold Extraction (< 27°C)",
      origin: "Tunisia",
      packaging: "Flexitank (22,000L), IBC, Fûts 200L",
      moq: "1 Container",
    });
    setTranslations({
      en: {
        name: "",
        short_description: "",
        full_description: "",
        formats: ["Flexitank", "IBC 1000L", "Drums 200L"],
      },
      fr: {
        name: "",
        short_description: "",
        full_description: "",
        formats: ["Vrac Flexitank", "Cuves IBC", "Fûts 200L"],
      },
      ar: {
        name: "",
        short_description: "",
        full_description: "",
        formats: ["فليكسي تانك", "حاويات IBC", "براميل 200ل"],
      },
      es: {
        name: "",
        short_description: "",
        full_description: "",
        formats: ["Granel Flexitank", "Contenedores IBC", "Bidones 200L"],
      },
      it: {
        name: "",
        short_description: "",
        full_description: "",
        formats: ["Sfuso Flexitank", "Cisterne IBC", "Fusti 200L"],
      },
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingId(product.id);
    setSlug(product.slug);
    setImageUrl(product.image_url);
    setIsActive(product.is_active);
    setSortOrder(product.sort_order);
    setSpecs(product.specs);
    setTranslations(product.translations);
    setIsEditing(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      if (json.url) {
        setImageUrl(json.url);
      }
    } catch (err) {
      alert("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        id: editingId,
        slug,
        image_url: imageUrl,
        is_active: isActive,
        sort_order: Number(sortOrder),
        specs,
        translations,
      };

      const res = await fetch("/api/admin/products", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setIsEditing(false);
        fetchProducts();
      } else {
        alert(data.error || "Failed to save product.");
      }
    } catch (err) {
      alert("Error saving product.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchProducts();
      }
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

      {/* Product List */}
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
                  <th className="px-6 py-3.5">{t.tableThProduct}</th>
                  <th className="px-6 py-3.5">{t.tableThSpecs}</th>
                  <th className="px-6 py-3.5">Packaging Formats</th>
                  <th className="px-6 py-3.5">Order</th>
                  <th className="px-6 py-3.5">{t.tableThStatus}</th>
                  <th className="px-6 py-3.5 text-right">{t.tableThActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/80">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                        <Image
                          src={p.image_url}
                          alt={p.translations.en?.name || p.slug}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">
                          {p.translations.en?.name || p.slug}
                        </p>
                        <p className="text-gray-400 text-[11px]">/{p.slug}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-verdalia-olive">
                        {p.specs.acidity}
                      </span>
                      <p className="text-gray-400 text-[11px]">{p.specs.variety}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                      {p.translations.en?.formats?.join(", ") || "-"}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-700">
                      {p.sort_order}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          p.is_active
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {p.is_active ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 text-gray-500 hover:text-verdalia-olive rounded"
                        title="Edit Product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded"
                        title="Delete Product"
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

      {/* Edit / Create Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-verdalia-dark">
                {editingId ? "Edit Olive Oil Product" : "Create New Product"}
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
                {/* General Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                      URL Slug *
                    </label>
                    <input
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="e.g. premium-extra-virgin"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:border-verdalia-olive"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                      Display Sort Order
                    </label>
                    <input
                      type="number"
                      value={sortOrder}
                      onChange={(e) => setSortOrder(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:border-verdalia-olive"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="prod-active"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="h-4 w-4 text-verdalia-olive rounded border-gray-300"
                    />
                    <label
                      htmlFor="prod-active"
                      className="font-bold text-gray-700 cursor-pointer"
                    >
                      Published & Visible
                    </label>
                  </div>
                </div>

                {/* Product Image */}
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Product Image (URL or Upload)
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                      {imageUrl && (
                        <Image
                          src={imageUrl}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://... or upload below"
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded"
                    />
                    <label className="px-4 py-2 bg-verdalia-beige hover:bg-verdalia-border rounded text-verdalia-dark font-semibold cursor-pointer inline-flex items-center gap-1.5 flex-shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploading ? "Uploading..." : "Upload Photo"}</span>
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        className="hidden"
                        accept="image/*"
                      />
                    </label>
                  </div>
                </div>

                {/* Technical Specifications */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
                  <h4 className="font-serif text-xs font-bold text-verdalia-dark uppercase tracking-wider">
                    Technical Export Specifications
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                        Acidity Parameter
                      </label>
                      <input
                        type="text"
                        value={specs.acidity}
                        onChange={(e) =>
                          setSpecs({ ...specs, acidity: e.target.value })
                        }
                        className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                        Olive Variety
                      </label>
                      <input
                        type="text"
                        value={specs.variety}
                        onChange={(e) =>
                          setSpecs({ ...specs, variety: e.target.value })
                        }
                        className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                        Extraction Method
                      </label>
                      <input
                        type="text"
                        value={specs.extraction}
                        onChange={(e) =>
                          setSpecs({ ...specs, extraction: e.target.value })
                        }
                        className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                        Origin Terroir
                      </label>
                      <input
                        type="text"
                        value={specs.origin}
                        onChange={(e) =>
                          setSpecs({ ...specs, origin: e.target.value })
                        }
                        className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                        Packaging Summary
                      </label>
                      <input
                        type="text"
                        value={specs.packaging}
                        onChange={(e) =>
                          setSpecs({ ...specs, packaging: e.target.value })
                        }
                        className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                        Minimum Order (MOQ)
                      </label>
                      <input
                        type="text"
                        value={specs.moq}
                        onChange={(e) =>
                          setSpecs({ ...specs, moq: e.target.value })
                        }
                        className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded"
                      />
                    </div>
                  </div>
                </div>

                {/* Multilingual Translation Tabs */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase text-gray-700">
                      Multilingual Product Content:
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
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase">
                          Product Name ({activeTabLocale.toUpperCase()}) *
                        </label>
                        <AutoTranslateButton
                          sourceText={translations[activeTabLocale]?.name || ""}
                          sourceLang={activeTabLocale}
                          allLangs={LOCALES as unknown as string[]}
                          onTranslate={(t) => {
                            const updated = { ...translations };
                            Object.entries(t).forEach(([lang, text]) => {
                              if (updated[lang as Locale]) {
                                updated[lang as Locale] = { ...updated[lang as Locale], name: text };
                              }
                            });
                            setTranslations(updated);
                          }}
                        />
                      </div>
                      <input
                        type="text"
                        required={activeTabLocale === "en"}
                        value={translations[activeTabLocale]?.name || ""}
                        onChange={(e) =>
                          setTranslations({
                            ...translations,
                            [activeTabLocale]: {
                              ...translations[activeTabLocale],
                              name: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded"
                        placeholder="e.g. Extra Virgin Olive Oil"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase">
                          Short Catalog Description
                        </label>
                        <AutoTranslateButton
                          sourceText={translations[activeTabLocale]?.short_description || ""}
                          sourceLang={activeTabLocale}
                          allLangs={LOCALES as unknown as string[]}
                          onTranslate={(t) => {
                            const updated = { ...translations };
                            Object.entries(t).forEach(([lang, text]) => {
                              if (updated[lang as Locale]) {
                                updated[lang as Locale] = { ...updated[lang as Locale], short_description: text };
                              }
                            });
                            setTranslations(updated);
                          }}
                        />
                      </div>
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
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase">
                          Full Product Details
                        </label>
                        <AutoTranslateButton
                          sourceText={translations[activeTabLocale]?.full_description || ""}
                          sourceLang={activeTabLocale}
                          allLangs={LOCALES as unknown as string[]}
                          onTranslate={(t) => {
                            const updated = { ...translations };
                            Object.entries(t).forEach(([lang, text]) => {
                              if (updated[lang as Locale]) {
                                updated[lang as Locale] = { ...updated[lang as Locale], full_description: text };
                              }
                            });
                            setTranslations(updated);
                          }}
                        />
                      </div>
                      <textarea
                        rows={3}
                        value={translations[activeTabLocale]?.full_description || ""}
                        onChange={(e) =>
                          setTranslations({
                            ...translations,
                            [activeTabLocale]: {
                              ...translations[activeTabLocale],
                              full_description: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded resize-none"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                        Available Formats (comma separated)
                      </label>
                      <input
                        type="text"
                        value={
                          translations[activeTabLocale]?.formats?.join(", ") || ""
                        }
                        onChange={(e) =>
                          setTranslations({
                            ...translations,
                            [activeTabLocale]: {
                              ...translations[activeTabLocale],
                              formats: e.target.value
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean),
                            },
                          })
                        }
                        placeholder="Flexitank (22,000L), IBC (1,000L), Fûts 200L"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
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
                  {saving ? "Saving..." : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
