import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/db";
import { getAuthenticatedAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get("clientId") || undefined;
  const mode = (searchParams.get("mode") as "active" | "trash" | "all") || "active";

  const orders = db.orders.getAll(clientId, mode);
  const stats = db.orders.getStats();
  const clients = db.clients.getAll("active");
  const products = db.products.getAll(true);
  const trashCount = db.orders.getTrashCount();

  return NextResponse.json({
    success: true,
    orders,
    stats,
    clients,
    products,
    trashCount,
  });
}

export async function POST(req: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      order_number,
      client_id,
      product_id,
      product_name,
      packaging,
      quantity,
      unit,
      unit_price,
      currency,
      total_amount,
      paid_amount,
      payment_date,
      order_date,
      order_status,
      notes,
    } = body;

    if (!client_id) {
      return NextResponse.json(
        { error: "Veuillez sélectionner un client." },
        { status: 400 }
      );
    }

    if (!product_name) {
      return NextResponse.json(
        { error: "Veuillez choisir un produit." },
        { status: 400 }
      );
    }

    const client = db.clients.getById(client_id);
    if (!client) {
      return NextResponse.json(
        { error: "Client introuvable." },
        { status: 404 }
      );
    }

    const initialPaid = Number(paid_amount) || 0;
    const initialPayments = initialPaid > 0 ? [
      {
        id: `pay-${Date.now()}`,
        amount: initialPaid,
        date: payment_date || new Date().toISOString().split("T")[0],
        method: "virement",
        notes: "Versement initial à la commande",
      }
    ] : [];

    const newOrder = db.orders.create({
      order_number: (order_number || "").trim(),
      client_id,
      client_name: client.name,
      client_tax_id: client.tax_id,
      product_id: product_id || undefined,
      product_name: product_name.trim(),
      packaging: (packaging || "Flexitank 22,000L").trim(),
      quantity: Number(quantity) || 0,
      unit: unit || "Tonnes",
      unit_price: Number(unit_price) || 0,
      currency: currency || "EUR",
      total_amount: Number(total_amount) || 0,
      paid_amount: initialPaid,
      payment_date: initialPaid > 0 ? (payment_date || new Date().toISOString().split("T")[0]) : undefined,
      order_status: order_status || "confirmed",
      order_date: order_date || new Date().toISOString().split("T")[0],
      payments: initialPayments,
      notes: (notes || "").trim(),
    });

    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la création de la commande." },
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
        { error: "Order ID est obligatoire." },
        { status: 400 }
      );
    }

    if (action === "restore") {
      const restored = db.orders.restore(id);
      return NextResponse.json({ success: true, order: restored, message: "Commande restaurée avec succès" });
    }

    if (action === "trash") {
      const trashed = db.orders.trash(id);
      return NextResponse.json({ success: true, order: trashed, message: "Commande déplacée vers la corbeille" });
    }

    if (updates.client_id) {
      const client = db.clients.getById(updates.client_id);
      if (client) {
        updates.client_name = client.name;
        updates.client_tax_id = client.tax_id;
      }
    }

    const updated = db.orders.update(id, updates);
    if (!updated) {
      return NextResponse.json(
        { error: "Commande introuvable." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la modification de la commande." },
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
    const count = db.orders.emptyTrash();
    return NextResponse.json({ success: true, message: `${count} commande(s) supprimée(s) définitivement.` });
  }

  if (!id) {
    return NextResponse.json(
      { error: "Order ID est obligatoire." },
      { status: 400 }
    );
  }

  if (permanent) {
    const deleted = db.orders.deletePermanently(id);
    return NextResponse.json({ success: deleted });
  } else {
    // Soft delete to corbeille
    const trashed = db.orders.trash(id);
    return NextResponse.json({ success: Boolean(trashed), message: "Commande déplacée vers la corbeille." });
  }
}
