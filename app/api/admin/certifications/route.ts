import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/db";
import { getAuthenticatedAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const activeOnly = searchParams.get("activeOnly") === "true";
  const certifications = db.certifications.getAll(activeOnly);
  return NextResponse.json({ certifications });
}

export async function POST(req: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      code,
      badge_url,
      document_url,
      cert_number,
      issue_date,
      expiry_date,
      is_active,
      sort_order,
      translations,
    } = body;

    if (!code || !translations?.en?.name) {
      return NextResponse.json(
        { error: "Certification code and English name are required." },
        { status: 400 }
      );
    }

    const created = db.certifications.create({
      code: code.trim().toUpperCase(),
      badge_url: badge_url || "/images/certs/brc.svg",
      document_url: document_url || null,
      cert_number: cert_number || null,
      issue_date: issue_date || null,
      expiry_date: expiry_date || null,
      is_active: is_active ?? true,
      sort_order: sort_order ?? 99,
      translations: translations,
    });

    return NextResponse.json({ success: true, certification: created });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create certification" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Certification ID is required" },
        { status: 400 }
      );
    }

    const updated = db.certifications.update(id, updates);
    if (!updated) {
      return NextResponse.json(
        { error: "Certification not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, certification: updated });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update certification" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Certification ID is required" },
      { status: 400 }
    );
  }

  const success = db.certifications.delete(id);
  if (!success) {
    return NextResponse.json(
      { error: "Certification not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}
