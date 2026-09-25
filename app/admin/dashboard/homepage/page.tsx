"use client";

import React, { useState, useEffect } from "react";
import { Locale, ContentBlockTranslation } from "@/lib/types";
import { LOCALES } from "@/lib/i18n/config";
import { useAdminI18n } from "@/lib/i18n/admin-context";
import { Home, Save, CheckCircle, Loader2 } from "lucide-react";
import { AutoTranslateButton } from "@/components/ui/AutoTranslateButton";

export default function HomepageContentCMS() {
  const { adminDict } = useAdminI18n();
  const t = adminDict.homepagePage;
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
      alert("Error saving homepage content.");
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

  const current = content[activeLocale];

  const updateField = (field: keyof ContentBlockTranslation, value: string) => {
    setContent({
      ...content,
      [activeLocale]: {
        ...current,
        [field]: value,
      },
    });
  };

  const updateTranslations = (field: keyof ContentBlockTranslation, translations: Record<string, string>) => {
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

        {/* Locale Selector */}
        <div className="flex gap-1.5 bg-white p-1 rounded-lg border border-gray-200 shadow-sm self-start sm:self-auto">
          {LOCALES.map((code) => (
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
              {code.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {success && (
        <div className="p-3 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{c.savedSuccess}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Hero Section Box */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="font-serif text-base font-bold text-verdalia-dark">
              1. {t.heroSection} ({activeLocale.toUpperCase()})
            </h3>
            <p className="text-xs text-gray-500">
              {t.heroDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase text-gray-700">
                  Top Eyebrow Badge
                </label>
                <AutoTranslateButton
                  sourceText={current.hero_badge}
                  sourceLang={activeLocale}
                  allLangs={LOCALES as unknown as string[]}
                  onTranslate={(translated) => updateTranslations("hero_badge", translated)}
                />
              </div>
              <input
                type="text"
                value={current.hero_badge}
                onChange={(e) => updateField("hero_badge", e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase text-gray-700">
                  Main Headline
                </label>
                <AutoTranslateButton
                  sourceText={current.hero_title}
                  sourceLang={activeLocale}
                  allLangs={LOCALES as unknown as string[]}
                  onTranslate={(translated) => updateTranslations("hero_title", translated)}
                />
              </div>
              <input
                type="text"
                value={current.hero_title}
                onChange={(e) => updateField("hero_title", e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded"
              />
            </div>
          </div>

          <div className="text-xs">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold uppercase text-gray-700">
                Hero Introduction Paragraph
              </label>
              <AutoTranslateButton
                sourceText={current.hero_subtitle}
                sourceLang={activeLocale}
                allLangs={LOCALES as unknown as string[]}
                onTranslate={(translated) => updateTranslations("hero_subtitle", translated)}
              />
            </div>
            <textarea
              rows={3}
              value={current.hero_subtitle}
              onChange={(e) => updateField("hero_subtitle", e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded resize-none"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase text-gray-700">
                  Primary CTA Button Text
                </label>
                <AutoTranslateButton
                  sourceText={current.hero_cta_primary}
                  sourceLang={activeLocale}
                  allLangs={LOCALES as unknown as string[]}
                  onTranslate={(translated) => updateTranslations("hero_cta_primary", translated)}
                />
              </div>
              <input
                type="text"
                value={current.hero_cta_primary}
                onChange={(e) =>
                  updateField("hero_cta_primary", e.target.value)
                }
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase text-gray-700">
                  Secondary CTA Button Text
                </label>
                <AutoTranslateButton
                  sourceText={current.hero_cta_secondary}
                  sourceLang={activeLocale}
                  allLangs={LOCALES as unknown as string[]}
                  onTranslate={(translated) => updateTranslations("hero_cta_secondary", translated)}
                />
              </div>
              <input
                type="text"
                value={current.hero_cta_secondary}
                onChange={(e) =>
                  updateField("hero_cta_secondary", e.target.value)
                }
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded"
              />
            </div>
          </div>
        </div>

        {/* About Preview Section Box */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="font-serif text-base font-bold text-verdalia-dark">
              2. About Section Preview ({activeLocale.toUpperCase()})
            </h3>
            <p className="text-xs text-gray-500">
              Story and editorial introduction on the homepage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase text-gray-700">
                  About Eyebrow Tag
                </label>
                <AutoTranslateButton
                  sourceText={current.about_subtitle}
                  sourceLang={activeLocale}
                  allLangs={LOCALES as unknown as string[]}
                  onTranslate={(translated) => updateTranslations("about_subtitle", translated)}
                />
              </div>
              <input
                type="text"
                value={current.about_subtitle}
                onChange={(e) => updateField("about_subtitle", e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase text-gray-700">
                  About Section Heading
                </label>
                <AutoTranslateButton
                  sourceText={current.about_title}
                  sourceLang={activeLocale}
                  allLangs={LOCALES as unknown as string[]}
                  onTranslate={(translated) => updateTranslations("about_title", translated)}
                />
              </div>
              <input
                type="text"
                value={current.about_title}
                onChange={(e) => updateField("about_title", e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded"
              />
            </div>
          </div>

          <div className="text-xs">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold uppercase text-gray-700">
                About Description
              </label>
              <AutoTranslateButton
                sourceText={current.about_text}
                sourceLang={activeLocale}
                allLangs={LOCALES as unknown as string[]}
                onTranslate={(translated) => updateTranslations("about_text", translated)}
              />
            </div>
            <textarea
              rows={3}
              value={current.about_text}
              onChange={(e) => updateField("about_text", e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded resize-none"
            ></textarea>
          </div>
        </div>

        {/* Why Choose Us & Export Box */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="font-serif text-base font-bold text-verdalia-dark">
              3. Why Choose Us & Global Export Section ({activeLocale.toUpperCase()})
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase text-gray-700">
                  Why Choose Us Title
                </label>
                <AutoTranslateButton
                  sourceText={current.why_choose_title}
                  sourceLang={activeLocale}
                  allLangs={LOCALES as unknown as string[]}
                  onTranslate={(translated) => updateTranslations("why_choose_title", translated)}
                />
              </div>
              <input
                type="text"
                value={current.why_choose_title}
                onChange={(e) =>
                  updateField("why_choose_title", e.target.value)
                }
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase text-gray-700">
                  Export Section Title
                </label>
                <AutoTranslateButton
                  sourceText={current.export_title}
                  sourceLang={activeLocale}
                  allLangs={LOCALES as unknown as string[]}
                  onTranslate={(translated) => updateTranslations("export_title", translated)}
                />
              </div>
              <input
                type="text"
                value={current.export_title}
                onChange={(e) => updateField("export_title", e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded"
              />
            </div>
          </div>

          <div className="text-xs">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold uppercase text-gray-700">
                Export Logistics Narrative
              </label>
              <AutoTranslateButton
                sourceText={current.export_text}
                sourceLang={activeLocale}
                allLangs={LOCALES as unknown as string[]}
                onTranslate={(translated) => updateTranslations("export_text", translated)}
              />
            </div>
            <textarea
              rows={3}
              value={current.export_text}
              onChange={(e) => updateField("export_text", e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded resize-none"
            ></textarea>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary py-3 px-8 text-xs font-bold uppercase tracking-wider flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{c.saving}</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{t.saveBtn(activeLocale)}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
