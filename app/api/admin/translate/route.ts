import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "@/lib/auth";

// Free Translation using MyMemory API with Google Translate fallback
async function translateText(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<string> {
  if (!text || !text.trim()) return "";
  if (sourceLang === targetLang) return text;

  // 1. Try MyMemory API (Reliable in Node.js)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const myMemoryUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      text
    )}&langpair=${sourceLang}|${targetLang}`;

    const res = await fetch(myMemoryUrl, {
      signal: controller.signal,
      headers: { "User-Agent": "Verdalia-CMS/1.0" },
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (
        data?.responseStatus === 200 &&
        data?.responseData?.translatedText &&
        !data.responseData.translatedText.startsWith("MYMEMORY WARNING:")
      ) {
        return data.responseData.translatedText;
      }
    }
  } catch {
    // Fall back to Google Translate
  }

  // 2. Try Google Translate public endpoint
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(
      text
    )}`;

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && Array.isArray(data[0])) {
        return data[0]
          .filter((segment: any) => segment && segment[0])
          .map((segment: any) => segment[0])
          .join("");
      }
    }
  } catch (error) {
    console.error("Translation fallback error:", error);
  }

  return text;
}

// Map our locale codes to Google Translate codes
const LOCALE_TO_GOOGLE: Record<string, string> = {
  en: "en",
  fr: "fr",
  ar: "ar",
  es: "es",
  it: "it",
};

export async function POST(req: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { text, sourceLang, targetLangs } = body;

    if (!text || !sourceLang || !targetLangs || !Array.isArray(targetLangs)) {
      return NextResponse.json(
        { error: "Missing required fields: text, sourceLang, targetLangs" },
        { status: 400 }
      );
    }

    const sourceCode = LOCALE_TO_GOOGLE[sourceLang] || sourceLang;
    const translations: Record<string, string> = {};

    // Translate to all target languages in parallel
    await Promise.all(
      targetLangs.map(async (lang: string) => {
        const targetCode = LOCALE_TO_GOOGLE[lang] || lang;
        translations[lang] = await translateText(text, sourceCode, targetCode);
      })
    );

    return NextResponse.json({ translations });
  } catch (error) {
    return NextResponse.json(
      { error: "Translation failed" },
      { status: 500 }
    );
  }
}
