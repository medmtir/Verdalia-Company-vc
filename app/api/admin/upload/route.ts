import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "@/lib/auth";
import fs from "fs";
import path from "path";
import { db } from "@/lib/db/db";

// Supabase credentials from environment
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// ===== SECURITY: File type validation =====
const ALLOWED_EXTENSIONS = new Set([
  ".jpg", ".jpeg", ".png", ".webp", ".gif", ".pdf", ".doc", ".docx",
]);

// Magic bytes signatures for allowed file types
const MAGIC_BYTES: Record<string, number[][]> = {
  ".jpg":  [[0xFF, 0xD8, 0xFF]],
  ".jpeg": [[0xFF, 0xD8, 0xFF]],
  ".png":  [[0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]],
  ".gif":  [[0x47, 0x49, 0x46, 0x38]],
  ".webp": [[0x52, 0x49, 0x46, 0x46]], // RIFF header
  ".pdf":  [[0x25, 0x50, 0x44, 0x46]], // %PDF
  ".doc":  [[0xD0, 0xCF, 0x11, 0xE0]], // OLE compound
  ".docx": [[0x50, 0x4B, 0x03, 0x04]], // ZIP (OOXML)
};

function validateMagicBytes(buffer: Buffer, ext: string): boolean {
  const signatures = MAGIC_BYTES[ext];
  if (!signatures) return false;
  return signatures.some((sig) =>
    sig.every((byte, i) => i < buffer.length && buffer[i] === byte)
  );
}

function isPathSafe(filePath: string, baseDir: string): boolean {
  const resolved = path.resolve(filePath);
  const resolvedBase = path.resolve(baseDir);
  return resolved.startsWith(resolvedBase + path.sep) || resolved === resolvedBase;
}

// ===== SECURITY: Rate limiting =====
const uploadAttempts = new Map<string, { count: number; resetAt: number }>();
const UPLOAD_LIMIT = 50; // max uploads per window
const UPLOAD_WINDOW = 60 * 1000; // 1 minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = uploadAttempts.get(ip);
  if (!entry || now > entry.resetAt) {
    uploadAttempts.set(ip, { count: 1, resetAt: now + UPLOAD_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > UPLOAD_LIMIT;
}

export async function POST(req: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Trop de requêtes. Veuillez patienter un instant." },
      { status: 429 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file || file.size === 0) {
      return NextResponse.json(
        { error: "Aucun fichier fourni" },
        { status: 400 }
      );
    }

    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Le fichier dépasse la limite autorisée (20 Mo)" },
        { status: 400 }
      );
    }

    const ext = path.extname(file.name).toLowerCase();

    // SECURITY: Whitelist extension check
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        {
          error: `Format '${ext}' non autorisé. Formats acceptés : ${Array.from(
            ALLOWED_EXTENSIONS
          ).join(", ")}`,
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // SECURITY: Validate magic bytes match declared extension
    if (!validateMagicBytes(buffer, ext)) {
      return NextResponse.json(
        {
          error:
            "Le contenu du fichier ne correspond pas à son extension (détection anti-spoofing).",
        },
        { status: 400 }
      );
    }

    const cleanName = path
      .basename(file.name, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .substring(0, 30);
    const uniqueFilename = `${Date.now()}-${cleanName}${ext}`;

    let uploadedUrl: string | null = null;

    // TIER 1: Supabase Storage (Persistent cloud storage on Vercel)
    if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
      try {
        const uploadRes = await fetch(
          `${SUPABASE_URL}/storage/v1/object/verdalia-uploads/${uniqueFilename}`,
          {
            method: "POST",
            headers: {
              apikey: SUPABASE_SERVICE_KEY,
              Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
              "Content-Type": file.type || "application/octet-stream",
              "x-upsert": "true",
            },
            body: buffer,
          }
        );

        if (uploadRes.ok) {
          uploadedUrl = `${SUPABASE_URL}/storage/v1/object/public/verdalia-uploads/${uniqueFilename}`;
        } else {
          console.error("Supabase Storage error:", await uploadRes.text());
        }
      } catch (sErr) {
        console.error("Supabase upload exception:", sErr);
      }
    }

    // TIER 2: Local Filesystem (for local development when filesystem is writable)
    if (!uploadedUrl) {
      try {
        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        const destination = path.join(uploadsDir, uniqueFilename);
        if (isPathSafe(destination, uploadsDir)) {
          fs.writeFileSync(destination, buffer);
          uploadedUrl = `/uploads/${uniqueFilename}`;
        }
      } catch (fsErr) {
        console.warn(
          "Local filesystem write bypassed (read-only environment on Vercel):",
          fsErr
        );
      }
    }

    // TIER 3: Base64 Data URL (Fail-safe, works 100% without any external storage)
    if (!uploadedUrl) {
      const mime =
        file.type ||
        (ext === ".png"
          ? "image/png"
          : ext === ".webp"
          ? "image/webp"
          : "image/jpeg");
      uploadedUrl = `data:${mime};base64,${buffer.toString("base64")}`;
    }

    // Save record to DB media list
    db.media.create({
      name: file.name,
      url: uploadedUrl,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      type: file.type.startsWith("image/") ? "Image" : "Document",
    });

    return NextResponse.json({
      success: true,
      url: uploadedUrl,
      filename: file.name,
      size: file.size,
    });
  } catch (error: any) {
    console.error("Upload handler error:", error);
    return NextResponse.json(
      { error: error?.message || "Échec de l'upload du fichier" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const files = db.media.getAll();
  return NextResponse.json({ files });
}

export async function DELETE(req: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const url = searchParams.get("url");

  if (!id) {
    return NextResponse.json({ error: "Media ID is required" }, { status: 400 });
  }

  // Delete from DB
  const success = db.media.delete(id);

  // If Supabase Storage file
  if (url && url.includes("/storage/v1/object/public/verdalia-uploads/")) {
    const filename = url.split("/verdalia-uploads/").pop();
    if (filename && SUPABASE_URL && SUPABASE_SERVICE_KEY) {
      try {
        await fetch(
          `${SUPABASE_URL}/storage/v1/object/verdalia-uploads/${filename}`,
          {
            method: "DELETE",
            headers: {
              apikey: SUPABASE_SERVICE_KEY,
              Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
            },
          }
        );
      } catch (err) {
        console.error("Error deleting from Supabase storage:", err);
      }
    }
  }

  // If local file
  if (url && url.startsWith("/uploads/")) {
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(process.cwd(), "public", url);
    if (isPathSafe(filePath, uploadsDir)) {
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch {}
    }
  }

  return NextResponse.json({ success });
}
