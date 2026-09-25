import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/db";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { Locale } from "@/lib/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const locale = (searchParams.get("locale") as Locale) || "en";

  const siteSettings = db.siteSettings.get();
  const contentBlock = db.contentBlocks.get(locale);

  return NextResponse.json({
    siteSettings,
    contentBlock,
    allLocalesContent: {
      en: db.contentBlocks.get("en"),
      fr: db.contentBlocks.get("fr"),
      ar: db.contentBlocks.get("ar"),
      es: db.contentBlocks.get("es"),
      it: db.contentBlocks.get("it"),
    },
  });
}

export async function PUT(req: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { siteSettings, contentBlocks, targetLocale } = body;

    if (siteSettings) {
      db.siteSettings.update(siteSettings);
    }

    if (contentBlocks && targetLocale) {
      db.contentBlocks.update(targetLocale as Locale, contentBlocks);
    }

    return NextResponse.json({
      success: true,
      siteSettings: db.siteSettings.get(),
      contentBlock: targetLocale ? db.contentBlocks.get(targetLocale) : null,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update content" },
      { status: 500 }
    );
  }
}
