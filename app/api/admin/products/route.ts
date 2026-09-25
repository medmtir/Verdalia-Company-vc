import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/db";
import { getAuthenticatedAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const slug = searchParams.get("slug");
  const activeOnly = searchParams.get("activeOnly") === "true";

  if (id) {
    const product = db.products.getById(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ product });
  }

  if (slug) {
    const product = db.products.getBySlug(slug);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ product });
  }

  const products = db.products.getAll(activeOnly);
  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { slug, image_url, is_active, sort_order, specs, translations } = body;

    if (!slug || !translations?.en?.name) {
      return NextResponse.json(
        { error: "Product slug and English name are required." },
        { status: 400 }
      );
    }

    const created = db.products.create({
      slug: slug.trim().toLowerCase().replace(/\s+/g, "-"),
      image_url: image_url || "/images/placeholder-oil.jpg",
      is_active: is_active ?? true,
      sort_order: sort_order ?? 99,
      specs: specs || {
        acidity: "< 0.8%",
        variety: "Tunisian Chemlali",
        extraction: "Cold Extraction",
        origin: "Tunisia",
        packaging: "Flexitank, Drums, Bottles",
        moq: "1 Container",
      },
      translations: translations,
    });

    return NextResponse.json({ success: true, product: created });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create product" },
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
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const updated = db.products.update(id, updates);
    if (!updated) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update product" },
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
      { error: "Product ID is required" },
      { status: 400 }
    );
  }

  const success = db.products.delete(id);
  if (!success) {
    return NextResponse.json(
      { error: "Product not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}
