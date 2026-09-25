"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Certification, Locale } from "@/lib/types";
import { LOCALES } from "@/lib/i18n/config";
import { useAdminI18n } from "@/lib/i18n/admin-context";
import { AutoTranslateButton } from "@/components/ui/AutoTranslateButton";
import {
  Award,
  Plus,
  Edit2,
  Trash2,
  Upload,
  FileText,
  ExternalLink,
  X,
} from "lucide-react";

export default function CertificationsManagementPage() {
  const { adminDict } = useAdminI18n();
  const t = adminDict.certificationsPage;
  const c = adminDict.common;
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTabLocale, setActiveTabLocale] = useState<Locale>("en");
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [uploadingBadge, setUploadingBadge] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [badgeUrl, setBadgeUrl] = useState("/images/certs/brc.svg");
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [certNumber, setCertNumber] = useState<string | null>("");
  const [issueDate, setIssueDate] = useState<string | null>("");
  const [expiryDate, setExpiryDate] = useState<string | null>("");
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(1);
  const [translations, setTranslations] = useState<
    Record<Locale, { name: string; issuer: string; description: string }>
  >({
    en: { name: "", issuer: "", description: "" },
    fr: { name: "", issuer: "", description: "" },
    ar: { name: "", issuer: "", description: "" },
    es: { name: "", issuer: "", description: "" },
    it: { name: "", issuer: "", description: "" },
  });

  const fetchCertifications = () => {
    setLoading(true);
    fetch("/api/admin/certifications")
      .then((res) => res.json())
      .then((data) => {
        if (data.certifications) setCertifications(data.certifications);
      })
      .catch((err) => console.error("Error loading certs:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCertifications();
  }, []);

  const updateTranslationField = (field: 'name' | 'issuer' | 'description', translated: Record<string, string>) => {
    setTranslations((prev) => {
      const next = { ...prev };
      Object.entries(translated).forEach(([lang, text]) => {
        const l = lang as Locale;
        if (next[l]) {
          next[l] = { ...next[l], [field]: text };
        }
      });
      return next;
    });
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setCode("");
    setBadgeUrl("/images/certs/brc.svg");
    setDocumentUrl(null);
    setCertNumber("");
    setIssueDate("");
    setExpiryDate("");
    setIsActive(true);
    setSortOrder(certifications.length + 1);
    setTranslations({
      en: { name: "", issuer: "", description: "" },
      fr: { name: "", issuer: "", description: "" },
      ar: { name: "", issuer: "", description: "" },
      es: { name: "", issuer: "", description: "" },
      it: { name: "", issuer: "", description: "" },
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (c: Certification) => {
    setEditingId(c.id);
    setCode(c.code);
    setBadgeUrl(c.badge_url);
    setDocumentUrl(c.document_url);
    setCertNumber(c.cert_number || "");
    setIssueDate(c.issue_date || "");
    setExpiryDate(c.expiry_date || "");
    setIsActive(c.is_active);
    setSortOrder(c.sort_order);
    setTranslations(c.translations);
    setIsEditing(true);
  };

  const handleBadgeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingBadge(true);
    try {
      const data = new FormData();
      data.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: data,
      });
      const json = await res.json();
      if (json.url) setBadgeUrl(json.url);
    } catch {
      alert("Failed to upload badge.");
    } finally {
      setUploadingBadge(false);
    }
  };

  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingDoc(true);
    try {
      const data = new FormData();
      data.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: data,
      });
      const json = await res.json();
      if (json.url) setDocumentUrl(json.url);
    } catch {
      alert("Failed to upload document.");
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        id: editingId,
        code,
        badge_url: badgeUrl,
        document_url: documentUrl,
        cert_number: certNumber || null,
        issue_date: issueDate || null,
        expiry_date: expiryDate || null,
        is_active: isActive,
        sort_order: Number(sortOrder),
        translations,
      };

      const res = await fetch("/api/admin/certifications", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setIsEditing(false);
        fetchCertifications();
      } else {
        alert(data.error || "Failed to save certification.");
      }
    } catch (err) {
      alert("Error saving certification.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certification?")) return;
    try {
      const res = await fetch(`/api/admin/certifications?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchCertifications();
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
                  <th className="px-6 py-3.5">Badge & Code</th>
                  <th className="px-6 py-3.5">Standard Name & Issuer</th>
                  <th className="px-6 py-3.5">Certificate Number</th>
                  <th className="px-6 py-3.5">Official Document</th>
                  <th className="px-6 py-3.5">Order</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {certifications.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/80">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg p-1 bg-gray-50 border border-gray-200 flex-shrink-0">
                        <Image
                          src={c.badge_url}
                          alt={c.code}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="font-bold text-gray-900">{c.code}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">
                        {c.translations.en?.name || c.code}
                      </p>
                      <p className="text-gray-400 text-[11px]">
                        {c.translations.en?.issuer || "-"}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {c.cert_number || "Provided on request"}
                    </td>
                    <td className="px-6 py-4">
                      {c.document_url ? (
                        <a
                          href={c.document_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-verdalia-olive font-bold hover:underline flex items-center gap-1 text-[11px]"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View Doc</span>
                        </a>
                      ) : (
                        <span className="text-gray-400 text-[11px]">None uploaded</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-700">
                      {c.sort_order}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          c.is_active
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {c.is_active ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(c)}
                        className="p-1.5 text-gray-500 hover:text-verdalia-olive rounded"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded"
                        title="Delete"
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
          <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-verdalia-dark">
                {editingId ? "Edit Certification" : "Add Certification"}
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
                      Code (e.g. BRC, ISO22000) *
                    </label>
                    <input
                      type="text"
                      required
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded uppercase font-bold"
                    />
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

                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="cert-active"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="h-4 w-4 text-verdalia-olive rounded border-gray-300"
                    />
                    <label
                      htmlFor="cert-active"
                      className="font-bold text-gray-700 cursor-pointer"
                    >
                      Active on Site
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                      Badge Logo SVG/PNG
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded bg-gray-50 border border-gray-200 p-1 flex-shrink-0">
                        {badgeUrl && (
                          <Image
                            src={badgeUrl}
                            alt="Badge"
                            fill
                            className="object-contain"
                          />
                        )}
                      </div>
                      <input
                        type="text"
                        value={badgeUrl}
                        onChange={(e) => setBadgeUrl(e.target.value)}
                        className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                      Upload Official Certificate PDF
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="px-3.5 py-2 bg-verdalia-beige rounded text-verdalia-dark font-semibold cursor-pointer inline-flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingDoc ? "Uploading..." : "Upload PDF"}</span>
                        <input
                          type="file"
                          onChange={handleDocUpload}
                          className="hidden"
                          accept=".pdf,.png,.jpg"
                        />
                      </label>
                      {documentUrl && (
                        <span className="text-[11px] text-verdalia-olive truncate font-semibold">
                          File attached
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Multilingual translations */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase text-gray-700">
                      Certification Translations:
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
                          Certification Name ({activeTabLocale.toUpperCase()}) *
                        </label>
                        <AutoTranslateButton
                          sourceText={translations[activeTabLocale]?.name || ""}
                          sourceLang={activeTabLocale}
                          allLangs={LOCALES as unknown as string[]}
                          onTranslate={(translated) => updateTranslationField("name", translated)}
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
                        placeholder="e.g. BRC Global Food Safety"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase">
                          Issuing Authority
                        </label>
                        <AutoTranslateButton
                          sourceText={translations[activeTabLocale]?.issuer || ""}
                          sourceLang={activeTabLocale}
                          allLangs={LOCALES as unknown as string[]}
                          onTranslate={(translated) => updateTranslationField("issuer", translated)}
                        />
                      </div>
                      <input
                        type="text"
                        value={translations[activeTabLocale]?.issuer || ""}
                        onChange={(e) =>
                          setTranslations({
                            ...translations,
                            [activeTabLocale]: {
                              ...translations[activeTabLocale],
                              issuer: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase">
                          Description / Quality Scope
                        </label>
                        <AutoTranslateButton
                          sourceText={translations[activeTabLocale]?.description || ""}
                          sourceLang={activeTabLocale}
                          allLangs={LOCALES as unknown as string[]}
                          onTranslate={(translated) => updateTranslationField("description", translated)}
                        />
                      </div>
                      <textarea
                        rows={2}
                        value={translations[activeTabLocale]?.description || ""}
                        onChange={(e) =>
                          setTranslations({
                            ...translations,
                            [activeTabLocale]: {
                              ...translations[activeTabLocale],
                              description: e.target.value,
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
                  {saving ? "Saving..." : "Save Certification"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
