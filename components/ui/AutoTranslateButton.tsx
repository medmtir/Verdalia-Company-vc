"use client";

import React, { useState } from "react";
import { Languages, Loader2, CheckCircle } from "lucide-react";

import { LOCALES } from "@/lib/i18n/config";

interface AutoTranslateButtonProps {
  /** The current text to translate */
  sourceText: string;
  /** The locale code of the current tab (e.g. "fr") */
  sourceLang: string;
  /** All locale codes to translate into (defaults to LOCALES) */
  allLangs?: string[];
  /** Callback with the translations: { [lang]: translatedText } */
  onTranslate: (translations: Record<string, string>) => void;
  /** Optional className override */
  className?: string;
}

export const AutoTranslateButton: React.FC<AutoTranslateButtonProps> = ({
  sourceText,
  sourceLang,
  allLangs = LOCALES as readonly string[] as string[],
  onTranslate,
  className,
}) => {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    setLoading(true);
    setDone(false);

    try {
      const targetLangs = allLangs.filter((l) => l !== sourceLang);
      const res = await fetch("/api/admin/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: sourceText,
          sourceLang,
          targetLangs,
        }),
      });

      const data = await res.json();
      if (data.translations) {
        onTranslate(data.translations);
        setDone(true);
        setTimeout(() => setDone(false), 2500);
      }
    } catch {
      alert("Auto-translation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleTranslate}
      disabled={loading || !sourceText.trim()}
      className={
        className ||
        "inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      }
      title="Auto-translate this field to all other languages"
    >
      {loading ? (
        <>
          <Loader2 className="w-3 h-3 animate-spin" />
          <span>Translating...</span>
        </>
      ) : done ? (
        <>
          <CheckCircle className="w-3 h-3 text-emerald-600" />
          <span className="text-emerald-700">Translated!</span>
        </>
      ) : (
        <>
          <Languages className="w-3 h-3" />
          <span>Auto-translate</span>
        </>
      )}
    </button>
  );
};
