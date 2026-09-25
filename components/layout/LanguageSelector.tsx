"use client";

import React, { useState, useRef, useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";
import { LOCALES, LOCALE_METAS } from "@/lib/i18n/config";
import { ChevronDown, Globe } from "lucide-react";
import { Locale } from "@/lib/types";

export const LanguageSelector: React.FC<{
  className?: string;
  variant?: "header" | "footer" | "mobile";
}> = ({ className = "", variant = "header" }) => {
  const { locale, setLocale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentMeta = LOCALE_METAS[locale];

  if (variant === "mobile") {
    return (
      <div className="grid grid-cols-5 gap-1.5 p-1 bg-verdalia-beige/60 rounded-lg border border-verdalia-border">
        {LOCALES.map((code) => {
          const meta = LOCALE_METAS[code];
          const isSelected = locale === code;
          return (
            <button
              key={code}
              onClick={() => setLocale(code)}
              className={`py-1.5 text-xs font-semibold rounded transition-all ${
                isSelected
                  ? "bg-verdalia-olive text-white shadow-sm"
                  : "text-verdalia-dark hover:bg-white/80"
              }`}
            >
              {code.toUpperCase()}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-verdalia-dark tracking-wider uppercase hover:text-verdalia-olive transition-colors rounded hover:bg-verdalia-beige/40"
        aria-label="Select language"
      >
        <Globe className="w-3.5 h-3.5 text-verdalia-olive" />
        <span>{currentMeta.code.toUpperCase()}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-36 py-1.5 bg-white rounded-lg shadow-xl border border-verdalia-border z-50 animate-fade-in">
          {LOCALES.map((code) => {
            const meta = LOCALE_METAS[code];
            const isSelected = locale === code;
            return (
              <button
                key={code}
                onClick={() => {
                  setLocale(code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left transition-colors ${
                  isSelected
                    ? "bg-verdalia-beige/50 text-verdalia-olive font-bold"
                    : "text-verdalia-dark hover:bg-verdalia-offwhite"
                }`}
              >
                <span>{meta.nativeLabel}</span>
                <span className="text-[10px] text-verdalia-gray uppercase">
                  {meta.code}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
