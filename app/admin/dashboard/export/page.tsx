"use client";

import React, { useState, useEffect } from "react";
import { Locale, ContentBlockTranslation } from "@/lib/types";
import { LOCALES } from "@/lib/i18n/config";
import { useAdminI18n } from "@/lib/i18n/admin-context";
import { Save, CheckCircle, Loader2 } from "lucide-react";
import { AutoTranslateButton } from "@/components/ui/AutoTranslateButton";

export default function ExportContentCMS() {
  const { adminDict } = useAdminI18n();
  const t = adminDict.exportPage;
  const c = adminDict.common;
  const [activeLocale, setActiveLocale] = useState<Locale>("en");
  const [content, setContent] = useState<Record<Locale, ContentBlockTranslation> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/admin/content")
      .then((res) => res.json())
      .then((data) => {
        if (data.allLocalesContent) {
          setContent(data.allLocalesContent);
        }
      })
      .catch((err) => console.error("Error loading content:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;

    setSaving(true);
    setSuccess(false);

    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetLocale: activeLocale,
          contentBlocks: content[activeLocale],
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch {
      alert("Error saving export content.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !content) {
    return (
      <div className="py-20 text-center text-xs text-gray-500">
        {c.loading}
      </div>
    );
  }

  const current = content[activeLocale] || {};

  const updateField = (field: keyof ContentBlockTranslation, value: string) => {
    setContent({
      ...content,
      [activeLocale]: {
        ...current,
        [field]: value,
      },
    });
  };

  const updateTranslations = (
    field: keyof ContentBlockTranslation,
    translations: Record<string, string>
  ) => {
    setContent((prev) => {
      if (!prev) return prev;
      const next = { ...prev };
      Object.entries(translations).forEach(([lang, text]) => {
        const l = lang as Locale;
        if (next[l]) {
          next[l] = { ...next[l], [field]: text };
        }
      });
      return next;
    });
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

        {/* Locale switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-lg">
          {LOCALES.map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => setActiveLocale(loc)}
              className={`px-3 py-1.5 text-xs font-bold rounded transition-all ${
                activeLocale === loc
                  ? "bg-white text-verdalia-olive shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {loc.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {success && (
        <div className="p-3 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{t.saveSuccess(activeLocale)}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold uppercase text-gray-700">
                Export Page Main Headline
              </label>
              <AutoTranslateButton
                sourceText={current.export_title || ""}
                sourceLang={activeLocale}
                onTranslate={(t) => updateTranslations("export_title", t)}
              />
            </div>
            <input
              type="text"
              value={current.export_title || ""}
              onChange={(e) => updateField("export_title", e.target.value)}
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold uppercase text-gray-700">
                Export Services Overview
              </label>
              <AutoTranslateButton
                sourceText={current.export_text || ""}
                sourceLang={activeLocale}
                onTranslate={(t) => updateTranslations("export_text", t)}
              />
            </div>
            <textarea
              rows={4}
              value={current.export_text || ""}
              onChange={(e) => updateField("export_text", e.target.value)}
              placeholder="Verdalia Company VC supports international companies looking to source Tunisian olive oil..."
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary py-2.5 px-6 text-xs font-bold uppercase tracking-wider flex items-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? c.saving : t.saveBtn(activeLocale)}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
