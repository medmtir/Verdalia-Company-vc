import { Locale } from "@/lib/types";

export const LOCALES: Locale[] = ["en", "fr", "ar", "es", "it"];
export const DEFAULT_LOCALE: Locale = "fr";

export interface LocaleMeta {
  code: Locale;
  label: string;
  nativeLabel: string;
  dir: "ltr" | "rtl";
  flag: string;
}

export const LOCALE_METAS: Record<Locale, LocaleMeta> = {
  en: {
    code: "en",
    label: "English",
    nativeLabel: "English",
    dir: "ltr",
    flag: "GB",
  },
  fr: {
    code: "fr",
    label: "French",
    nativeLabel: "Français",
    dir: "ltr",
    flag: "FR",
  },
  ar: {
    code: "ar",
    label: "Arabic",
    nativeLabel: "العربية",
    dir: "rtl",
    flag: "TN",
  },
  es: {
    code: "es",
    label: "Spanish",
    nativeLabel: "Español",
    dir: "ltr",
    flag: "ES",
  },
  it: {
    code: "it",
    label: "Italian",
    nativeLabel: "Italiano",
    dir: "ltr",
    flag: "IT",
  },
};

export function isValidLocale(locale: string): locale is Locale {
  return LOCALES.includes(locale as Locale);
}
