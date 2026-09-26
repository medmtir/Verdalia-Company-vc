"use client";

import React, { useState, useEffect } from "react";
import { SiteSettings, Locale } from "@/lib/types";
import { LOCALES, LOCALE_METAS } from "@/lib/i18n/config";
import { useAdminI18n } from "@/lib/i18n/admin-context";
import { Search, Save, CheckCircle, Globe, HelpCircle, ExternalLink, Sparkles } from "lucide-react";

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

        {/* Google & Search Engine Webmaster Verification */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Globe className="w-4 h-4 text-verdalia-olive" />
            <h3 className="font-bold text-sm text-verdalia-dark">
              Vérification des Moteurs de Recherche (Google Search Console & Bing)
            </h3>
          </div>
          <p className="text-xs text-gray-500">
            Pour que votre site apparaisse en 1ère position sur Google, enregistrez votre site sur Google Search Console et collez ici votre jeton de vérification.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Google Site Verification Token
              </label>
              <input
                type="text"
                value={settings.google_verification || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    google_verification: e.target.value,
                  })
                }
                placeholder="ex: AbCdEf123456789... ou <meta name=...>"
                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded font-mono"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">
                Permet à Google d&apos;indexer et de classer vos pages en priorité.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Bing Webmaster Verification Code
              </label>
              <input
                type="text"
                value={settings.bing_verification || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    bing_verification: e.target.value,
                  })
                }
                placeholder="ex: 1234567890ABCDEF..."
                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded font-mono"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">
                Indexation sur Microsoft Bing, Yahoo et DuckDuckGo.
              </span>
            </div>
          </div>

          {/* Quick links & tools */}
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
            <a
              href="https://search.google.com/search-console"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold transition-colors"
            >
              <span>Accéder à Google Search Console</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-semibold transition-colors"
            >
              <span>Voir le Sitemap XML en direct</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://search.google.com/test/rich-results"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 font-semibold transition-colors"
            >
              <span>Tester les Rich Snippets Google (FAQ, Schema)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Live SEO & Google Search Checklist */}
        <div className="bg-gradient-to-br from-emerald-50 to-white p-5 rounded-xl border border-emerald-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
              Checklist Optimisation Google #1 (Actif sur Verdalia) :
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs text-gray-700">
            <div className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-emerald-100 shadow-2xs">
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span><strong>Schema Organization :</strong> Verdalia Company VC identifiée</span>
            </div>
            <div className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-emerald-100 shadow-2xs">
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span><strong>Schema FAQPage :</strong> Accordéons Google activés</span>
            </div>
            <div className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-emerald-100 shadow-2xs">
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span><strong>Hreflang Multilingue :</strong> 5 langues déclarées</span>
            </div>
            <div className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-emerald-100 shadow-2xs">
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span><strong>Sitemap Dynamique :</strong> Indexation automatique</span>
            </div>
            <div className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-emerald-100 shadow-2xs">
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span><strong>Vitesse Core Web Vitals :</strong> Speed Insights activé</span>
            </div>
            <div className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-emerald-100 shadow-2xs">
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span><strong>Robots.txt Optimisé :</strong> Crawl bot prioritaire</span>
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
              https://verdalia-company-vc.vercel.app/{activeLocale}
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
