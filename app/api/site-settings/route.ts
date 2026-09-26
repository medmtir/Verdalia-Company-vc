import { NextResponse } from "next/server";
import { db } from "@/lib/db/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const siteSettings = db.siteSettings.get();
    return NextResponse.json({
      success: true,
      siteSettings,
    }, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load site settings" }, { status: 500 });
  }
}
