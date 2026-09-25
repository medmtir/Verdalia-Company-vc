import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/db";
import { getAuthenticatedAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const publishedOnly = searchParams.get("publishedOnly") === "true";
  const publications = db.publications.getAll(publishedOnly);
  return NextResponse.json({ publications });
}

export async function POST(req: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      slug,
      image_url,
      status,
      published_at,
      cta_label,
      cta_url,
      sort_order,
      translations,
    } = body;

    if (!slug || !translations?.en?.title) {
      return NextResponse.json(
        { error: "Publication slug and English title are required." },
        { status: 400 }
      );
    }

    const created = db.publications.create({
      slug: slug.trim().toLowerCase().replace(/\s+/g, "-"),
      image_url: image_url || "/images/placeholder-oil.jpg",
      status: status || "draft",
      published_at: published_at || new Date().toISOString(),
      cta_label: cta_label || null,
      cta_url: cta_url || null,
      sort_order: sort_order ?? 99,
      translations: translations,
    });

    return NextResponse.json({ success: true, publication: created });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create publication" },
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
        { error: "Publication ID is required" },
        { status: 400 }
      );
    }

    const updated = db.publications.update(id, updates);
    if (!updated) {
      return NextResponse.json(
        { error: "Publication not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, publication: updated });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update publication" },
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
      { error: "Publication ID is required" },
      { status: 400 }
    );
  }

  const success = db.publications.delete(id);
  if (!success) {
    return NextResponse.json(
      { error: "Publication not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}
