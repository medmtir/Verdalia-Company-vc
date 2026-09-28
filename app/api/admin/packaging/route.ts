import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/db";
import { PackagingFormat } from "@/lib/types";

export async function GET() {
  try {
    const packagings = db.packagings.getAll();
    return NextResponse.json({ success: true, packagings });
  } catch (error) {
    console.error("Error fetching admin packagings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch packagings" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { capacity, title, image_url, badge, description, sort_order, is_active, translations } = body;

    if (!title || !capacity) {
      return NextResponse.json(
        { success: false, error: "Le titre et la capacité sont obligatoires." },
        { status: 400 }
      );
    }

    const newPkg = db.packagings.create({
      capacity,
      title,
      image_url: image_url || "/images/packaging/ibc-container.jpg",
      badge: badge || "Export",
      description: description || "",
      sort_order: typeof sort_order === "number" ? sort_order : 10,
      is_active: is_active ?? true,
      translations: translations || {},
    });

    return NextResponse.json({ success: true, packaging: newPkg });
  } catch (error) {
    console.error("Error creating packaging format:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la création du conditionnement." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID du conditionnement manquant." },
        { status: 400 }
      );
    }

    const updated = db.packagings.update(id, data);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Conditionnement non trouvé." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, packaging: updated });
  } catch (error) {
    console.error("Error updating packaging format:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la mise à jour du conditionnement." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID du conditionnement manquant." },
        { status: 400 }
      );
    }

    const deleted = db.packagings.delete(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Conditionnement introuvable ou déjà supprimé." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting packaging format:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la suppression." },
      { status: 500 }
    );
  }
}
