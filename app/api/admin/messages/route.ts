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

async function deleteFromSupabaseStorage(
  attachmentUrls: (string | null | undefined)[]
) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) return;

  const filenames = attachmentUrls
    .filter((url): url is string => Boolean(url))
    .map((url) => {
      if (url.includes("verdalia-uploads/")) {
        return url.split("verdalia-uploads/")[1]?.split("?")[0] || "";
      } else if (url.startsWith("/uploads/")) {
        return url.replace("/uploads/", "");
      }
      return "";
    })
    .filter((name) => Boolean(name) && !name.startsWith("data:"));

  if (filenames.length === 0) return;

  try {
    const res = await fetch(`${supabaseUrl}/storage/v1/object/verdalia-uploads`, {
      method: "DELETE",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prefixes: filenames }),
    });

    if (!res.ok) {
      console.error("Error deleting from Supabase storage:", await res.text());
    }
  } catch (err) {
    console.error("Exception deleting from Supabase storage:", err);
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
    // Collect all attachments from messages in trash
    const allMessages = db.messages.getAll();
    const trashAttachments = allMessages
      .filter((m) => m.status === "trash")
      .map((m) => m.attachment_url);

    // Delete files from Supabase Storage
    await deleteFromSupabaseStorage(trashAttachments);

    const removedCount = db.messages.emptyTrash();
    return NextResponse.json({ success: true, removedCount });
  }

  if (!id) {
    return NextResponse.json({ error: "Message ID is required" }, { status: 400 });
  }

  if (permanent) {
    const msg = db.messages.getById(id);
    if (msg?.attachment_url) {
      await deleteFromSupabaseStorage([msg.attachment_url]);
    }
  }

  const success = db.messages.delete(id, permanent);
  if (!success) {
    return NextResponse.json({ error: "Message not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, permanent });
}
