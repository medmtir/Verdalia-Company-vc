import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/db";
import { getAuthenticatedAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function POST(req: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const rawOrderId = body.order_id || body.id;
    const cleanOrderId = String(rawOrderId || "").trim();
    const { quantity, delivery_date, bl_number, notes } = body;

    if (!cleanOrderId) {
      return NextResponse.json(
        { error: "order_id est obligatoire." },
        { status: 400 }
      );
    }

    const deliveryQuantity = Number(quantity);
    if (isNaN(deliveryQuantity) || deliveryQuantity <= 0) {
      return NextResponse.json(
        { error: "La quantité livrée doit être supérieure à zéro." },
        { status: 400 }
      );
    }

    const updated = db.orders.addDelivery(cleanOrderId, {
      quantity: deliveryQuantity,
      delivery_date: delivery_date || new Date().toISOString().split("T")[0],
      bl_number: bl_number || "",
      notes: notes || "",
    });

    if (!updated) {
      return NextResponse.json(
        { error: "Commande introuvable." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de l'enregistrement de la livraison." },
      { status: 500 }
    );
  }
}
