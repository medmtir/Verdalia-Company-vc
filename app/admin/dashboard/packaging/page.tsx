"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Upload,
  CheckCircle,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Layers,
  X,
  ExternalLink,
  Save,
  Image as ImageIcon,
  Loader2,
  Languages,
} from "lucide-react";
import { PackagingFormat, Locale } from "@/lib/types";
import { LOCALES, LOCALE_METAS } from "@/lib/i18n/config";
import { AutoTranslateButton } from "@/components/ui/AutoTranslateButton";

export default function PackagingManagerPage() {
  const [packagings, setPackagings] = useState<PackagingFormat[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Edit / Create Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PackagingFormat | null>(null);
  const [activeLangTab, setActiveLangTab] = useState<Locale>("fr");

  const [formData, setFormData] = useState({
    title: "",
    capacity: "",
    badge: "",
    description: "",
    image_url: "",
    sort_order: 1,
    is_active: true,
    translations: {
      fr: { title: "", capacity: "", badge: "", description: "" },
      en: { title: "", capacity: "", badge: "", description: "" },
      ar: { title: "", capacity: "", badge: "", description: "" },
      es: { title: "", capacity: "", badge: "", description: "" },
      it: { title: "", capacity: "", badge: "", description: "" },
    },
  });

  // Delete confirmation modal
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchPackagings = async () => {
    try {
      const res = await fetch("/api/admin/packaging");
      const data = await res.json();
      if (data.success) {
        setPackagings(data.packagings || []);
      }
    } catch (err) {
      console.error("Error loading packaging formats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackagings();
  }, []);

  const showNotification = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3500);
  };

  // Open modal for editing
  const handleEdit = (item: PackagingFormat) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      capacity: item.capacity,
      badge: item.badge || "",
      description: item.description || "",
      image_url: item.image_url,
      sort_order: item.sort_order || 1,
      is_active: item.is_active,
      translations: {
        fr: {
          title: item.translations?.fr?.title || item.title,
          capacity: item.translations?.fr?.capacity || item.capacity,
          badge: item.translations?.fr?.badge || item.badge || "",
          description: item.translations?.fr?.description || item.description || "",
        },
        en: {
          title: item.translations?.en?.title || item.title,
          capacity: item.translations?.en?.capacity || item.capacity,
          badge: item.translations?.en?.badge || item.badge || "",
          description: item.translations?.en?.description || item.description || "",
        },
        ar: {
          title: item.translations?.ar?.title || item.title,
          capacity: item.translations?.ar?.capacity || item.capacity,
          badge: item.translations?.ar?.badge || item.badge || "",
          description: item.translations?.ar?.description || item.description || "",
        },
        es: {
          title: item.translations?.es?.title || item.title,
          capacity: item.translations?.es?.capacity || item.capacity,
          badge: item.translations?.es?.badge || item.badge || "",
          description: item.translations?.es?.description || item.description || "",
        },
        it: {
          title: item.translations?.it?.title || item.title,
          capacity: item.translations?.it?.capacity || item.capacity,
          badge: item.translations?.it?.badge || item.badge || "",
          description: item.translations?.it?.description || item.description || "",
        },
      },
    });
    setIsModalOpen(true);
  };

  // Open modal for new item
  const handleAddNew = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      capacity: "",
      badge: "Vrac Industriel",
      description: "",
      image_url: "/images/packaging/ibc-container.jpg",
      sort_order: packagings.length + 1,
      is_active: true,
      translations: {
        fr: { title: "", capacity: "", badge: "", description: "" },
        en: { title: "", capacity: "", badge: "", description: "" },
        ar: { title: "", capacity: "", badge: "", description: "" },
        es: { title: "", capacity: "", badge: "", description: "" },
        it: { title: "", capacity: "", badge: "", description: "" },
      },
    });
    setIsModalOpen(true);
  };

  // Handle direct file upload
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
        setFormData((prev) => ({ ...prev, image_url: json.url }));
        showNotification("Image téléchargée avec succès !");
      } else {
        alert(json.error || "Erreur lors de l'upload de l'image.");
      }
    } catch (err: any) {
      alert(err?.message || "Erreur lors de l'envoi de l'image.");
    } finally {
      setUploading(false);
    }
  };

  const [translatingAll, setTranslatingAll] = useState(false);

  // Auto-translate a specific field across all 5 languages
  const handleAutoTranslateField = (
    field: "title" | "capacity" | "badge" | "description",
    translations: Record<string, string>
  ) => {
    setFormData((prev) => {
      const nextTranslations = { ...prev.translations };
      Object.entries(translations).forEach(([lang, val]) => {
        const l = lang as Locale;
        if (nextTranslations[l]) {
          nextTranslations[l] = {
            ...nextTranslations[l],
            [field]: val,
          };
        }
      });
      return {
        ...prev,
        translations: nextTranslations,
      };
    });
    showNotification(`Traduction automatique appliquée pour toutes les langues !`);
  };

  // One-click Auto-translate ALL fields (title, capacity, badge, description) to all other languages
  const handleAutoTranslateAll = async () => {
    const curSource = formData.translations[activeLangTab] || {
      title: formData.title,
      capacity: formData.capacity,
      badge: formData.badge,
      description: formData.description,
    };

    const srcTitle = (curSource.title || formData.title || "").trim();
    const srcCap = (curSource.capacity || formData.capacity || "").trim();
    const srcBadge = (curSource.badge || formData.badge || "").trim();
    const srcDesc = (curSource.description || formData.description || "").trim();

    if (!srcTitle && !srcCap) {
      alert("Veuillez d'abord saisir au moins le titre ou la capacité avant d'auto-traduire.");
      return;
    }

    setTranslatingAll(true);
    try {
      const targetLangs = LOCALES.filter((l) => l !== activeLangTab);
      const fieldsToTranslate = [
        { key: "title" as const, text: srcTitle },
        { key: "capacity" as const, text: srcCap },
        { key: "badge" as const, text: srcBadge },
        { key: "description" as const, text: srcDesc },
      ].filter((f) => f.text.length > 0);

      const translationResults = await Promise.all(
        fieldsToTranslate.map(async ({ key, text }) => {
          const res = await fetch("/api/admin/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text,
              sourceLang: activeLangTab,
              targetLangs,
            }),
          });
          const data = await res.json();
          return { key, translations: (data.translations || {}) as Record<string, string> };
        })
      );

      setFormData((prev) => {
        const nextTranslations = { ...prev.translations };
        // Update source tab
        nextTranslations[activeLangTab] = {
          title: srcTitle,
          capacity: srcCap,
          badge: srcBadge,
          description: srcDesc,
        };

        // Update target languages
        translationResults.forEach(({ key, translations }) => {
          Object.entries(translations).forEach(([lang, val]) => {
            const l = lang as Locale;
            if (nextTranslations[l]) {
              nextTranslations[l] = {
                ...nextTranslations[l],
                [key]: val,
              };
            }
          });
        });

        return {
          ...prev,
          title: activeLangTab === "fr" ? srcTitle : prev.title || srcTitle,
          capacity: activeLangTab === "fr" ? srcCap : prev.capacity || srcCap,
          badge: activeLangTab === "fr" ? srcBadge : prev.badge || srcBadge,
          description: activeLangTab === "fr" ? srcDesc : prev.description || srcDesc,
          translations: nextTranslations,
        };
      });

      showNotification("✨ Toutes les langues (FR, EN, AR, ES, IT) ont été traduites avec succès !");
    } catch {
      alert("Erreur lors de la traduction automatique.");
    } finally {
      setTranslatingAll(false);
    }
  };

  // Save changes (Create or Update)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const primaryTitle = (formData.translations.fr?.title || formData.title || "").trim();
    const primaryCapacity = (formData.translations.fr?.capacity || formData.capacity || "").trim();
    const primaryBadge = (formData.translations.fr?.badge || formData.badge || "Export").trim();
    const primaryDesc = (formData.translations.fr?.description || formData.description || "").trim();

    if (!primaryTitle || !primaryCapacity) {
      alert("Veuillez saisir un titre et une capacité.");
      return;
    }

    setSaving(true);

    // Build complete translations map ensuring all 5 locales have values
    const completeTranslations: Record<Locale, { title: string; capacity: string; badge: string; description: string }> = {
      fr: { title: primaryTitle, capacity: primaryCapacity, badge: primaryBadge, description: primaryDesc },
      en: { title: "", capacity: "", badge: "", description: "" },
      ar: { title: "", capacity: "", badge: "", description: "" },
      es: { title: "", capacity: "", badge: "", description: "" },
      it: { title: "", capacity: "", badge: "", description: "" },
    };

    LOCALES.forEach((loc) => {
      const cur = formData.translations[loc] || {};
      completeTranslations[loc] = {
        title: (cur.title || primaryTitle).trim(),
        capacity: (cur.capacity || primaryCapacity).trim(),
        badge: (cur.badge || primaryBadge).trim(),
        description: (cur.description || primaryDesc).trim(),
      };
    });

    const payload = {
      title: primaryTitle,
      capacity: primaryCapacity,
      badge: primaryBadge,
      description: primaryDesc,
      image_url: (formData.image_url || "/images/packaging/ibc-container.jpg").trim(),
      sort_order: Number(formData.sort_order) || 1,
      is_active: Boolean(formData.is_active),
      translations: completeTranslations,
    };

    try {
      if (editingItem) {
        // Update
        const res = await fetch("/api/admin/packaging", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingItem.id,
            ...payload,
          }),
        });
        const data = await res.json();
        if (data.success) {
          showNotification(`Conditionnement "${payload.title}" mis à jour dans les 5 langues !`);
          setIsModalOpen(false);
          fetchPackagings();
        } else {
          alert(data.error || "Erreur de mise à jour.");
        }
      } else {
        // Create
        const res = await fetch("/api/admin/packaging", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          showNotification(`Nouveau conditionnement "${payload.title}" créé avec succès dans toutes les langues !`);
          setIsModalOpen(false);
          fetchPackagings();
        } else {
          alert(data.error || "Erreur de création.");
        }
      }
    } catch {
      alert("Une erreur est survenue lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  // Toggle active state
  const handleToggleActive = async (item: PackagingFormat) => {
    try {
      const res = await fetch("/api/admin/packaging", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: item.id,
          is_active: !item.is_active,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification(
          item.is_active
            ? `"${item.title}" masqué du site web.`
            : `"${item.title}" activé sur le site web.`
        );
        fetchPackagings();
      }
    } catch {
      alert("Erreur lors de la mise à jour du statut.");
    }
  };

  // Delete item
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/packaging?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        showNotification("Conditionnement supprimé avec succès.");
        setDeleteConfirmId(null);
        fetchPackagings();
      } else {
        alert(data.error || "Erreur lors de la suppression.");
      }
    } catch {
      alert("Une erreur est survenue.");
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Toast Notification */}
      {actionMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#172B13] text-white px-5 py-3 rounded-xl shadow-2xl border border-[#203A1A] flex items-center gap-3 animate-fadeIn">
          <CheckCircle className="w-5 h-5 text-verdalia-gold flex-shrink-0" />
          <span className="text-xs font-semibold">{actionMessage}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-white p-5 sm:p-7 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-verdalia-olive">
              CMS Logistique & Export
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
              {packagings.length} format(s)
            </span>
          </div>
          <h1 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-verdalia-dark mt-1">
            Conditionnements Disponibles à l&apos;Export
          </h1>
          <p className="text-xs text-gray-500 mt-1 max-w-2xl">
            Modifiez directement les photos, les capacités (1 000L, 208L, 24 000L, etc.), les titres et les textes affichés dans la section « Available Export Formats » sur la page d&apos;accueil et la page Export.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <a
            href="/#export-formats"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <span>Voir sur le site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={handleAddNew}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#172B13] to-[#203A1A] hover:from-[#203A1A] hover:to-[#2e5425] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-verdalia-gold" />
            <span>Nouveau Conditionnement</span>
          </button>
        </div>
      </div>

      {/* Live Website Preview Banner */}
      <div className="bg-[#12220F] text-white p-6 rounded-2xl border border-[#24421D] shadow-lg">
        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-verdalia-gold" />
            <h3 className="font-serif text-sm sm:text-base font-bold text-white">
              Aperçu en Direct sur la Page d&apos;Accueil (Main Website)
            </h3>
          </div>
          <span className="text-[10px] text-gray-400">
            Mise à jour instantanée dès que vous sauvegardez
          </span>
        </div>

        {packagings.length === 0 ? (
          <p className="text-xs text-gray-400 py-6 text-center">
            Aucun conditionnement configuré.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {packagings
              .filter((p) => p.is_active)
              .map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/10 transition-colors group relative"
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-black/40 mb-2.5">
                    <Image
                      src={pkg.image_url || "/images/packaging/ibc-container.jpg"}
                      alt={pkg.title}
                      fill
                      className="object-contain p-2 group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="text-[10px] font-bold text-verdalia-gold uppercase tracking-wider">
                    {pkg.capacity}
                  </div>
                  <div className="text-xs font-bold text-white mt-0.5 truncate">
                    {pkg.title}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Packaging Formats Management List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-base sm:text-lg font-bold text-verdalia-dark">
              Liste des Conditionnements ({packagings.length})
            </h3>
            <p className="text-xs text-gray-500">
              Cliquez sur « Modifier » pour remplacer la photo, changer la capacité ou le texte.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-gray-500">
            Chargement des conditionnements...
          </div>
        ) : packagings.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-500 space-y-3">
            <p>Aucun conditionnement d&apos;exportation enregistré.</p>
            <button
              type="button"
              onClick={handleAddNew}
              className="px-4 py-2 rounded-lg bg-verdalia-olive text-white text-xs font-bold"
            >
              Ajouter le premier format
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {packagings.map((pkg) => (
              <div
                key={pkg.id}
                className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/70 transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  {/* Photo Thumbnail */}
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0 shadow-2xs group">
                    <Image
                      src={(pkg.image_url || "/images/packaging/ibc-container.jpg").trim()}
                      alt={pkg.title}
                      fill
                      className="object-contain p-1.5"
                      unoptimized={Boolean((pkg.image_url || "").trim().startsWith("http") || (pkg.image_url || "").trim().startsWith("data:"))}
                    />
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                        {pkg.capacity}
                      </span>
                      {pkg.badge && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-700">
                          {pkg.badge}
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                          pkg.is_active
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {pkg.is_active ? (
                          <>
                            <Eye className="w-3 h-3" /> Visible
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" /> Masqué
                          </>
                        )}
                      </span>
                    </div>

                    <h4 className="font-serif text-base font-bold text-gray-900">
                      {pkg.title}
                    </h4>

                    {pkg.description && (
                      <p className="text-xs text-gray-500 line-clamp-1 max-w-xl">
                        {pkg.description}
                      </p>
                    )}

                    <div className="text-[11px] text-gray-400 font-mono">
                      Image: {pkg.image_url}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => handleToggleActive(pkg)}
                    className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100 text-xs font-semibold transition-colors"
                    title={pkg.is_active ? "Masquer du site" : "Afficher sur le site"}
                  >
                    {pkg.is_active ? (
                      <EyeOff className="w-4 h-4 text-gray-500" />
                    ) : (
                      <Eye className="w-4 h-4 text-emerald-600" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleEdit(pkg)}
                    className="px-3 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Modifier la photo & données</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(pkg.id)}
                    className="p-2 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Supprimer ce conditionnement"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit / Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#172B13] to-[#203A1A] text-white p-5 sm:p-6 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#E3CAA5]">
                  {editingItem ? "Mise à Jour Manuelle" : "Nouveau Format"}
                </span>
                <h2 className="font-serif text-lg sm:text-xl font-bold text-white mt-0.5">
                  {editingItem
                    ? `Modifier : ${editingItem.title}`
                    : "Ajouter un Conditionnement d'Export"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
              {/* Photo Section */}
              <div className="bg-gray-50 p-4 sm:p-5 rounded-xl border border-gray-200 space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Photo du Conditionnement
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Image Preview Box */}
                  <div className="relative w-28 h-28 rounded-xl overflow-hidden bg-white border-2 border-dashed border-gray-300 flex items-center justify-center flex-shrink-0 shadow-inner">
                    {formData.image_url ? (
                      <Image
                        src={(formData.image_url || "").trim()}
                        alt="Aperçu"
                        fill
                        className="object-contain p-2"
                        unoptimized={Boolean((formData.image_url || "").trim().startsWith("http") || (formData.image_url || "").trim().startsWith("data:"))}
                      />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    )}
                  </div>

                  <div className="flex-1 w-full space-y-2.5">
                    {/* Direct File Upload Button */}
                    <div>
                      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#172B13] hover:bg-[#203A1A] text-white text-xs font-bold transition-all shadow-sm">
                        <Upload className="w-4 h-4 text-verdalia-gold" />
                        <span>{uploading ? "Envoi en cours..." : "Uploader une Nouvelle Photo (PC/Tél)"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          disabled={uploading}
                          className="hidden"
                        />
                      </label>
                      <p className="text-[11px] text-gray-400 mt-1">
                        Formats recommandés: JPG, PNG, WEBP.
                      </p>
                    </div>

                    {/* Image URL text input */}
                    <div>
                      <span className="text-[10px] font-bold uppercase text-gray-400 block mb-0.5">
                        Ou chemin / lien direct de l&apos;image :
                      </span>
                      <input
                        type="text"
                        value={formData.image_url}
                        onChange={(e) =>
                          setFormData({ ...formData, image_url: e.target.value })
                        }
                        placeholder="/images/packaging/..."
                        className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Multilingual Information & Translation System */}
              <div className="bg-gray-50/80 p-4 sm:p-5 rounded-2xl border border-gray-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-200">
                  <div>
                    <div className="flex items-center gap-2">
                      <Languages className="w-4 h-4 text-verdalia-olive" />
                      <span className="text-xs font-bold uppercase tracking-wider text-verdalia-dark">
                        Informations & Traductions ({activeLangTab.toUpperCase()})
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Remplissez les informations dans la langue source, puis cliquez sur auto-traduire.
                    </p>
                  </div>

                  {/* One-Click Translate ALL button */}
                  <button
                    type="button"
                    onClick={handleAutoTranslateAll}
                    disabled={translatingAll}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#172B13] hover:bg-[#203A1A] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex-shrink-0"
                    title="Traduire instantanément Titre, Capacité, Badge et Description vers les 4 autres langues"
                  >
                    {translatingAll ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-verdalia-gold" />
                        <span>Traduction des 5 langues...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-verdalia-gold" />
                        <span>✨ Auto-Traduire Toutes les Langues</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Language Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {LOCALES.map((loc) => {
                    const isFilled = Boolean(
                      formData.translations[loc]?.title &&
                      formData.translations[loc]?.capacity
                    );
                    return (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => setActiveLangTab(loc)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-xl uppercase transition-all flex items-center gap-1.5 flex-shrink-0 ${
                          activeLangTab === loc
                            ? "bg-[#172B13] text-white shadow-sm ring-2 ring-[#172B13]/20"
                            : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                        }`}
                      >
                        <span>{LOCALE_METAS[loc]?.flag || ""}</span>
                        <span>{loc.toUpperCase()}</span>
                        {isFilled && (
                          <span className={`w-1.5 h-1.5 rounded-full ${activeLangTab === loc ? "bg-verdalia-gold" : "bg-emerald-500"}`} />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Form fields for the currently active language tab */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold uppercase text-gray-700">
                        Titre ({activeLangTab.toUpperCase()}) *
                      </label>
                      <AutoTranslateButton
                        sourceText={formData.translations[activeLangTab]?.title || formData.title || ""}
                        sourceLang={activeLangTab}
                        onTranslate={(t) => handleAutoTranslateField("title", t)}
                      />
                    </div>
                    <input
                      type="text"
                      required={activeLangTab === "fr"}
                      value={formData.translations[activeLangTab]?.title || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          title: activeLangTab === "fr" ? val : prev.title || val,
                          translations: {
                            ...prev.translations,
                            [activeLangTab]: {
                              ...prev.translations[activeLangTab],
                              title: val,
                            },
                          },
                        }));
                      }}
                      placeholder="ex: Conteneur IBC, Flexitank..."
                      className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg font-medium focus:border-verdalia-olive focus:ring-1 focus:ring-verdalia-olive transition-all"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold uppercase text-gray-700">
                        Capacité / Volume ({activeLangTab.toUpperCase()}) *
                      </label>
                      <AutoTranslateButton
                        sourceText={formData.translations[activeLangTab]?.capacity || formData.capacity || ""}
                        sourceLang={activeLangTab}
                        onTranslate={(t) => handleAutoTranslateField("capacity", t)}
                      />
                    </div>
                    <input
                      type="text"
                      required={activeLangTab === "fr"}
                      value={formData.translations[activeLangTab]?.capacity || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          capacity: activeLangTab === "fr" ? val : prev.capacity || val,
                          translations: {
                            ...prev.translations,
                            [activeLangTab]: {
                              ...prev.translations[activeLangTab],
                              capacity: val,
                            },
                          },
                        }));
                      }}
                      placeholder="ex: 1 000 Litres, 24 000 Litres..."
                      className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg font-medium focus:border-verdalia-olive focus:ring-1 focus:ring-verdalia-olive transition-all"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold uppercase text-gray-700">
                        Badge / Catégorie ({activeLangTab.toUpperCase()})
                      </label>
                      <AutoTranslateButton
                        sourceText={formData.translations[activeLangTab]?.badge || formData.badge || ""}
                        sourceLang={activeLangTab}
                        onTranslate={(t) => handleAutoTranslateField("badge", t)}
                      />
                    </div>
                    <input
                      type="text"
                      value={formData.translations[activeLangTab]?.badge || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          badge: activeLangTab === "fr" ? val : prev.badge || val,
                          translations: {
                            ...prev.translations,
                            [activeLangTab]: {
                              ...prev.translations[activeLangTab],
                              badge: val,
                            },
                          },
                        }));
                      }}
                      placeholder="ex: Vrac Industriel, Semi-Vrac..."
                      className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg focus:border-verdalia-olive focus:ring-1 focus:ring-verdalia-olive transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-gray-700 mb-1">
                      Ordre d&apos;Affichage
                    </label>
                    <input
                      type="number"
                      value={formData.sort_order}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sort_order: parseInt(e.target.value) || 1,
                        })
                      }
                      className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg focus:border-verdalia-olive focus:ring-1 focus:ring-verdalia-olive transition-all"
                    />
                  </div>
                </div>

                {/* Description input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold uppercase text-gray-700">
                      Description Détaillée ({activeLangTab.toUpperCase()})
                    </label>
                    <AutoTranslateButton
                      sourceText={formData.translations[activeLangTab]?.description || formData.description || ""}
                      sourceLang={activeLangTab}
                      onTranslate={(t) => handleAutoTranslateField("description", t)}
                    />
                  </div>
                  <textarea
                    rows={3}
                    value={formData.translations[activeLangTab]?.description || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        description: activeLangTab === "fr" ? val : prev.description || val,
                        translations: {
                          ...prev.translations,
                          [activeLangTab]: {
                            ...prev.translations[activeLangTab],
                            description: val,
                          },
                        },
                      }));
                    }}
                    placeholder="Détails techniques, certifications de contact alimentaire, armature de protection en acier, etc."
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg focus:border-verdalia-olive focus:ring-1 focus:ring-verdalia-olive transition-all resize-none"
                  />
                </div>
              </div>

              {/* Visibility Toggle */}
              <div className="flex items-center gap-3 p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                <input
                  type="checkbox"
                  id="is_active_toggle"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                  className="w-4 h-4 text-verdalia-olive rounded border-gray-300 focus:ring-verdalia-olive"
                />
                <label htmlFor="is_active_toggle" className="text-xs text-emerald-950 font-bold cursor-pointer">
                  Afficher ce format sur le site web (Page d&apos;accueil & Export)
                </label>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
                >
                  <Save className="w-4 h-4 text-verdalia-gold" />
                  <span>{saving ? "Enregistrement..." : "Sauvegarder"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-gray-100 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-gray-900">
                Supprimer ce conditionnement ?
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Ce format d&apos;exportation sera retiré de la liste et ne sera plus visible sur le site.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
