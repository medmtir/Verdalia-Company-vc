"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { usePathname } from "next/navigation";
import { Locale, ContentBlockTranslation } from "@/lib/types";
import { DEFAULT_LOCALE, isValidLocale, LOCALE_METAS } from "@/lib/i18n/config";
import { Dictionary, DICTIONARIES } from "@/lib/i18n/dictionaries";

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dict: Dictionary;
  dir: "ltr" | "rtl";
  contentBlock?: ContentBlockTranslation | null;
  refreshContent: () => Promise<void>;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const LOCALE_COOKIE = "verdalia_locale";

export const I18nProvider: React.FC<{
  initialLocale?: Locale;
  children: React.ReactNode;
}> = ({ initialLocale = DEFAULT_LOCALE, children }) => {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [dynamicContent, setDynamicContent] =
    useState<ContentBlockTranslation | null>(null);

  useEffect(() => {
    // If in admin panel, never load non-English locale
    if (pathname?.startsWith("/admin")) return;

    // Read stored preference
    const match = document.cookie.match(
      new RegExp("(^| )" + LOCALE_COOKIE + "=([^;]+)")
    );
    if (match && isValidLocale(match[2])) {
      setLocaleState(match[2] as Locale);
    }
  }, [pathname]);

  const loadContent = useCallback(async (loc: Locale) => {
    try {
      const res = await fetch(`/api/admin/content?locale=${loc}`);
      if (res.ok) {
        const data = await res.json();
        if (data.contentBlock) {
          setDynamicContent(data.contentBlock);
        }
      }
    } catch {
      // Non-blocking: will use default static dictionaries
    }
  }, []);

  const refreshContent = useCallback(async () => {
    await loadContent(locale);
  }, [loadContent, locale]);

  useEffect(() => {
    if (pathname?.startsWith("/admin")) {
      document.documentElement.lang = "en";
      document.documentElement.dir = "ltr";
      return;
    }

    // Sync document direction and language attribute for public pages
    const meta = LOCALE_METAS[locale];
    document.documentElement.lang = locale;
    document.documentElement.dir = meta.dir;
    // Set cookie (valid for 1 year)
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; SameSite=Lax`;
    loadContent(locale);
  }, [locale, loadContent, pathname]);

  const setLocale = (newLocale: Locale) => {
    if (isValidLocale(newLocale)) {
      setLocaleState(newLocale);
    }
  };

  const baseDict = DICTIONARIES[locale] || DICTIONARIES[DEFAULT_LOCALE];

  const dict = useMemo(() => {
    if (!dynamicContent) return baseDict;
    // Deep clone base dictionary to inject DB overrides
    const merged: Dictionary = JSON.parse(JSON.stringify(baseDict));

    if (dynamicContent.hero_badge) merged.hero.badge = dynamicContent.hero_badge;
    if (dynamicContent.hero_title) merged.hero.title = dynamicContent.hero_title;
    if (dynamicContent.hero_subtitle) merged.hero.subtitle = dynamicContent.hero_subtitle;
    if (dynamicContent.hero_cta_primary) merged.hero.discoverBtn = dynamicContent.hero_cta_primary;
    if (dynamicContent.hero_cta_secondary) merged.hero.quoteBtn = dynamicContent.hero_cta_secondary;

    if (dynamicContent.about_title) {
      merged.aboutSection.title = dynamicContent.about_title;
      merged.aboutPage.heroTitle = dynamicContent.about_title;
    }
    if (dynamicContent.about_subtitle) {
      merged.aboutSection.badge = dynamicContent.about_subtitle;
      merged.aboutPage.heroBadge = dynamicContent.about_subtitle;
    }
    if (dynamicContent.about_text) {
      merged.aboutSection.desc1 = dynamicContent.about_text;
      merged.aboutPage.heroSubtitle = dynamicContent.about_text;
    }

    if (dynamicContent.why_choose_title) merged.whyChooseUs.title = dynamicContent.why_choose_title;
    if (dynamicContent.why_choose_subtitle) merged.whyChooseUs.subtitle = dynamicContent.why_choose_subtitle;

    if (dynamicContent.export_title) {
      merged.exportSection.title = dynamicContent.export_title;
      merged.exportPage.bannerTitle = dynamicContent.export_title;
    }
    if (dynamicContent.export_subtitle) {
      merged.exportSection.subtitle = dynamicContent.export_subtitle;
      merged.exportPage.bannerBadge = dynamicContent.export_subtitle;
    }
    if (dynamicContent.export_text) {
      merged.exportSection.packagingCardDesc = dynamicContent.export_text;
      merged.exportPage.bannerSubtitle = dynamicContent.export_text;
    }

    if (dynamicContent.about_who_we_are) {
      merged.aboutPage.whoWeAreP1 = dynamicContent.about_who_we_are;
    }
    if (dynamicContent.about_mission) {
      merged.aboutPage.missionDesc = dynamicContent.about_mission;
    }
    if (dynamicContent.about_vision) {
      merged.aboutPage.visionDesc = dynamicContent.about_vision;
    }
    if (dynamicContent.about_mill_heritage) {
      merged.aboutPage.whoWeAreP2 = dynamicContent.about_mill_heritage;
    }

    return merged;
  }, [baseDict, dynamicContent]);

  const dir = LOCALE_METAS[locale].dir;

  return (
    <I18nContext.Provider
      value={{
        locale,
        setLocale,
        dict,
        dir,
        contentBlock: dynamicContent,
        refreshContent,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    return {
      locale: DEFAULT_LOCALE,
      setLocale: () => {},
      dict: DICTIONARIES[DEFAULT_LOCALE],
      dir: "ltr",
      contentBlock: null,
      refreshContent: async () => {},
    };
  }
  return context;
}
