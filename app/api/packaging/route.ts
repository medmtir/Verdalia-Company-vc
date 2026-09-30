import { NextResponse } from "next/server";
import { db } from "@/lib/db/db";

export async function GET() {
  try {
    const rawPackagings = db.packagings.getAll(true);
    const packagings = rawPackagings.map((p) => ({
      ...p,
      image_url: (p.image_url || "").trim(),
    }));
    return NextResponse.json({ success: true, packagings });
  } catch (error) {
    console.error("Error fetching packagings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch packagings" },
      { status: 500 }
    );
  }
}