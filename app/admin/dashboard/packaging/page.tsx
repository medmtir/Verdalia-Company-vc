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
} from "lucide-react";
import { PackagingFormat, Locale } from "@/lib/types";
import { LOCALES, LOCALE_METAS } from "@/lib/i18n/config";

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
        alert("Erreur lors de l'upload de l'image.");
      }
    } catch {
      alert("Erreur lors de l'envoi de l'image.");
    } finally {
      setUploading(false);
    }
  };

  // Save changes (Create or Update)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.capacity) {
      alert("Veuillez saisir un titre et une capacité.");
      return;
    }

    setSaving(true);
    try {
      if (editingItem) {
        // Update
        const res = await fetch("/api/admin/packaging", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingItem.id,
            ...formData,
          }),
        });
        const data = await res.json();
        if (data.success) {
          showNotification(`Conditionnement "${formData.title}" mis à jour !`);
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
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success) {
          showNotification(`Nouveau conditionnement "${formData.title}" créé avec succès !`);
          setIsModalOpen(false);
          fetchPackagings();
        } else {
          alert(data.error || "Erreur de création.");
        }
      }
    } catch {
      alert("Une erreur est survenue.");
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
                      src={pkg.image_url || "/images/packaging/ibc-container.jpg"}
                      alt={pkg.title}
                      fill
                      className="object-contain p-1.5"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
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
                        src={formData.image_url}
                        alt="Aperçu"
                        fill
                        className="object-contain p-2"
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

              {/* Main Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Titre du Format *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="ex: Conteneur IBC, Fûts Acier..."
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded font-medium focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Capacité / Volume *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.capacity}
                    onChange={(e) =>
                      setFormData({ ...formData, capacity: e.target.value })
                    }
                    placeholder="ex: 1 000 Litres, 24 000 Litres..."
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded font-medium focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Badge / Catégorie
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) =>
                      setFormData({ ...formData, badge: e.target.value })
                    }
                    placeholder="ex: Semi-Vrac / Distribution, Vrac Industriel..."
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
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
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Description Détaillée (Page Export)
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Détails techniques, certifications alimentaires, armature de protection, vannes, etc."
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded focus:bg-white transition-colors resize-none"
                />
              </div>

              {/* Multilingual Tabs */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase text-gray-700">
                    Traductions Multilingues
                  </label>
                  <div className="flex gap-1">
                    {LOCALES.map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => setActiveLangTab(loc)}
                        className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase transition-colors ${
                          activeLangTab === loc
                            ? "bg-[#172B13] text-white"
                            : "bg-white text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-[10px] text-gray-500 font-bold block mb-1">
                      Titre ({activeLangTab.toUpperCase()}) :
                    </span>
                    <input
                      type="text"
                      value={formData.translations[activeLangTab]?.title || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          translations: {
                            ...formData.translations,
                            [activeLangTab]: {
                              ...formData.translations[activeLangTab],
                              title: e.target.value,
                            },
                          },
                        })
                      }
                      placeholder={formData.title}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-gray-200 rounded"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] text-gray-500 font-bold block mb-1">
                      Capacité ({activeLangTab.toUpperCase()}) :
                    </span>
                    <input
                      type="text"
                      value={formData.translations[activeLangTab]?.capacity || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          translations: {
                            ...formData.translations,
                            [activeLangTab]: {
                              ...formData.translations[activeLangTab],
                              capacity: e.target.value,
                            },
                          },
                        })
                      }
                      placeholder={formData.capacity}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-gray-200 rounded"
                    />
                  </div>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
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
