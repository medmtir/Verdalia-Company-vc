import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/db";
import { getAuthenticatedAdmin } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { order_id, amount, date, method, reference, notes } = body;

    if (!order_id) {
      return NextResponse.json(
        { error: "order_id est obligatoire." },
        { status: 400 }
      );
    }

    const paymentAmount = Number(amount);
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      return NextResponse.json(
        { error: "Le montant du paiement doit être supérieur à zéro." },
        { status: 400 }
      );
    }

    const updated = db.orders.addPayment(order_id, {
      amount: paymentAmount,
      date: date || new Date().toISOString().split("T")[0],
      method: method || "virement",
      reference: reference || "",
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
      { error: "Erreur lors de l'enregistrement du versement." },
      { status: 500 }
    );
  }
}
