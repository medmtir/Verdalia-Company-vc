import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/db";
import { getAuthenticatedAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const mode = (searchParams.get("mode") as "active" | "trash" | "all") || "active";

  const clients = db.clients.getAll(mode);
  const trashCount = db.clients.getTrashCount();

  return NextResponse.json({ success: true, clients, trashCount });
}

export async function POST(req: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, tax_id, contact_person, email, phone, country, address, notes } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Le nom du client / raison sociale est obligatoire." },
        { status: 400 }
      );
    }

    const newClient = db.clients.create({
      name: name.trim(),
      tax_id: (tax_id || "").trim(),
      contact_person: (contact_person || "").trim(),
      email: (email || "").trim(),
      phone: (phone || "").trim(),
      country: (country || "Tunisie").trim(),
      address: (address || "").trim(),
      notes: (notes || "").trim(),
    });

    return NextResponse.json({ success: true, client: newClient }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la création du client." },
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
    const { id, action, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Client ID est obligatoire." },
        { status: 400 }
      );
    }

    if (action === "restore") {
      const restored = db.clients.restore(id);
      return NextResponse.json({ success: true, client: restored, message: "Client restauré avec succès" });
    }

    if (action === "trash") {
      const trashed = db.clients.trash(id);
      return NextResponse.json({ success: true, client: trashed, message: "Client déplacé vers la corbeille" });
    }

    const updated = db.clients.update(id, updates);
    if (!updated) {
      return NextResponse.json(
        { error: "Client introuvable." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, client: updated });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du client." },
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
  const permanent = searchParams.get("permanent") === "true";
  const emptyTrash = searchParams.get("empty_trash") === "true";

  if (emptyTrash) {
    const removedCount = db.clients.emptyTrash();
    return NextResponse.json({ success: true, message: `${removedCount} client(s) supprimé(s) définitivement.` });
  }

  if (!id) {
    return NextResponse.json(
      { error: "Client ID est obligatoire." },
      { status: 400 }
    );
  }

  if (permanent) {
    const deleted = db.clients.deletePermanently(id);
    return NextResponse.json({ success: deleted });
  } else {
    // Soft delete to corbeille
    const trashed = db.clients.trash(id);
    return NextResponse.json({ success: Boolean(trashed), message: "Client déplacé vers la corbeille." });
  }
}
