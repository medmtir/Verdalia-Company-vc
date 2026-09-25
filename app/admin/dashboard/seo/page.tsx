"use client";

import React, { useState, useEffect } from "react";
import { SiteSettings, Locale } from "@/lib/types";
import { LOCALES, LOCALE_METAS } from "@/lib/i18n/config";
import { useAdminI18n } from "@/lib/i18n/admin-context";
import { Search, Save, CheckCircle, Globe, HelpCircle } from "lucide-react";

export default function SeoManagementPage() {
  const { adminDict } = useAdminI18n();
  const t = adminDict.seoPage;
  const c = adminDict.common;
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [activeLocale, setActiveLocale] = useState<Locale>("en");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/admin/content")
      .then((res) => res.json())
      .then((data) => {
        if (data.siteSettings) {
          setSettings(data.siteSettings);
        }
      })
      .catch((err) => console.error("Error loading SEO settings:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setSuccess(false);

    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteSettings: settings }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch {
      alert("Error saving SEO parameters.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="py-20 text-center text-xs text-gray-500">
        {c.loading}
      </div>
    );
  }

  const currentSeo = settings.seo[activeLocale] || {
    meta_title: "",
    meta_description: "",
    keywords: [],
  };

  const updateSeoField = (
    field: "meta_title" | "meta_description" | "keywords",
    value: any
  ) => {
    setSettings({
      ...settings,
      seo: {
        ...settings.seo,
        [activeLocale]: {
          ...currentSeo,
          [field]: value,
        },
      },
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

        {/* Language Tabs */}
        <div className="flex gap-1.5 bg-white p-1 rounded-lg border border-gray-200 shadow-sm self-start sm:self-auto">
          {LOCALES.map((code) => {
            const meta = LOCALE_METAS[code];
            return (
              <button
                key={code}
                type="button"
                onClick={() => setActiveLocale(code)}
                className={`px-3 py-1.5 text-xs font-bold rounded ${
                  activeLocale === code
                    ? "bg-verdalia-olive text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <span>{meta.code.toUpperCase()}</span>
                <span className="text-[10px] ml-1 opacity-70">
                  ({meta.nativeLabel})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {success && (
        <div className="p-3 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>SEO settings for {activeLocale.toUpperCase()} saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
          <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-serif text-base font-bold text-verdalia-dark">
                Search Engine Parameters ({activeLocale.toUpperCase()})
              </h3>
              <p className="text-xs text-gray-500">
                Targeting buyers searching in {LOCALE_METAS[activeLocale].label}.
              </p>
            </div>
            <Globe className="w-5 h-5 text-verdalia-olive" />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
              Meta Title Tag
            </label>
            <input
              type="text"
              required
              value={currentSeo.meta_title}
              onChange={(e) => updateSeoField("meta_title", e.target.value)}
              placeholder="e.g. Verdalia Company VC | Tunisian Olive Oil Exporter"
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded font-medium"
            />
            <span className="text-[10px] text-gray-400 mt-1 block">
              Recommended length: 50-60 characters ({currentSeo.meta_title.length} characters)
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
              Meta Description Tag
            </label>
            <textarea
              rows={3}
              required
              value={currentSeo.meta_description}
              onChange={(e) => updateSeoField("meta_description", e.target.value)}
              placeholder="Verdalia Company VC exports Tunisian olive oil worldwide..."
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded resize-none"
            ></textarea>
            <span className="text-[10px] text-gray-400 mt-1 block">
              Recommended length: 150-160 characters ({currentSeo.meta_description.length} characters)
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
              Main Search Keywords (comma-separated)
            </label>
            <textarea
              rows={3}
              value={currentSeo.keywords?.join(", ") || ""}
              onChange={(e) =>
                updateSeoField(
                  "keywords",
                  e.target.value
                    .split(",")
                    .map((k) => k.trim())
                    .filter(Boolean)
                )
              }
              placeholder="Tunisian olive oil, olive oil exporter, bulk olive oil..."
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded font-mono text-[11px]"
            ></textarea>
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {currentSeo.keywords?.map((k, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 text-[10px] bg-verdalia-beige/60 text-verdalia-dark rounded border border-verdalia-border"
                >
                  {k}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Search Result Simulator Box */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
            Google Search Preview Simulation:
          </h4>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 max-w-xl">
            <p className="text-xs text-gray-600 mb-0.5 truncate">
              https://verdalia.com/{activeLocale}
            </p>
            <p className="text-base text-blue-800 font-medium hover:underline cursor-pointer truncate">
              {currentSeo.meta_title || "Verdalia Company VC"}
            </p>
            <p className="text-xs text-gray-700 line-clamp-2 mt-1">
              {currentSeo.meta_description || "Company description preview..."}
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary py-2.5 px-6 text-xs font-bold uppercase tracking-wider flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? c.saving : `${c.save} (${activeLocale.toUpperCase()})`}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
