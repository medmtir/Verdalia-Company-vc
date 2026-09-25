import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/db";
import { getAuthenticatedAdmin } from "@/lib/auth";

export async function GET() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const messages = db.messages.getAll();
  const unreadCount = messages.filter((m) => m.status === "unread").length;
  const trashCount = messages.filter((m) => m.status === "trash").length;

  return NextResponse.json({ messages, unreadCount, trashCount });
}

export async function PUT(req: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, status, notes, action } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Message ID is required." },
        { status: 400 }
      );
    }

    if (action === "restore") {
      const restored = db.messages.restore(id);
      return NextResponse.json({ success: true, message: restored });
    }

    if (!status) {
      return NextResponse.json(
        { error: "Status is required." },
        { status: 400 }
      );
    }

    const updated = db.messages.updateStatus(id, status, notes);
    if (!updated) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: updated });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update message" },
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
  const action = searchParams.get("action");
  const permanent = searchParams.get("permanent") === "true";

  if (action === "empty_trash") {
    const removedCount = db.messages.emptyTrash();
    return NextResponse.json({ success: true, removedCount });
  }

  if (!id) {
    return NextResponse.json({ error: "Message ID is required" }, { status: 400 });
  }

  const success = db.messages.delete(id, permanent);
  if (!success) {
    return NextResponse.json({ error: "Message not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, permanent });
}
