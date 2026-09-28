import { NextResponse } from "next/server";
import { db } from "@/lib/db/db";

export async function GET() {
  try {
    const packagings = db.packagings.getAll(true);
    return NextResponse.json({ success: true, packagings });
  } catch (error) {
    console.error("Error fetching packagings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch packagings" },
      { status: 500 }
    );
  }
}
