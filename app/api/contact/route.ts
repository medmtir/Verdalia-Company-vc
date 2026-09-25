import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/db";
import fs from "fs";
import path from "path";

// ===== SECURITY: File type validation =====
const ALLOWED_EXTENSIONS = new Set([
  ".pdf", ".doc", ".docx", ".png", ".jpg", ".jpeg", ".webp",
]);

const MAGIC_BYTES: Record<string, number[][]> = {
  ".jpg":  [[0xFF, 0xD8, 0xFF]],
  ".jpeg": [[0xFF, 0xD8, 0xFF]],
  ".png":  [[0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]],
  ".webp": [[0x52, 0x49, 0x46, 0x46]],
  ".pdf":  [[0x25, 0x50, 0x44, 0x46]],
  ".doc":  [[0xD0, 0xCF, 0x11, 0xE0]],
  ".docx": [[0x50, 0x4B, 0x03, 0x04]],
};

function validateMagicBytes(buffer: Buffer, ext: string): boolean {
  const signatures = MAGIC_BYTES[ext];
  if (!signatures) return false;
  return signatures.some((sig) =>
    sig.every((byte, i) => i < buffer.length && buffer[i] === byte)
  );
}

// ===== SECURITY: Rate limiting =====
const contactAttempts = new Map<string, { count: number; resetAt: number }>();
const CONTACT_LIMIT = 5; // max submissions per window
const CONTACT_WINDOW = 10 * 60 * 1000; // 10 minutes

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = contactAttempts.get(ip);
  if (!entry || now > entry.resetAt) {
    contactAttempts.set(ip, { count: 1, resetAt: now + CONTACT_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > CONTACT_LIMIT;
}

// Cleanup stale entries every 15 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    contactAttempts.forEach((val, key) => {
      if (now > val.resetAt) contactAttempts.delete(key);
    });
  }, 15 * 60 * 1000);
}

// ===== SECURITY: Input sanitization =====
function sanitizeInput(input: string, maxLength = 500): string {
  return input
    .replace(/<[^>]*>/g, "") // Strip HTML tags
    .replace(/[<>"'`;]/g, "") // Remove dangerous chars
    .substring(0, maxLength)
    .trim();
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        { status: 429 }
      );
    }

    const formData = await req.formData();

    // Spam honeypot
    const honeypot = formData.get("website_url")?.toString();
    if (honeypot) {
      return NextResponse.json({ success: true, message: "Received" });
    }

    const fullName = sanitizeInput(formData.get("fullName")?.toString() || "", 100);
    const companyName = sanitizeInput(formData.get("companyName")?.toString() || "", 200);
    const country = sanitizeInput(formData.get("country")?.toString() || "", 100);
    const email = formData.get("email")?.toString()?.trim() || "";
    const phone = sanitizeInput(formData.get("phone")?.toString() || "", 30);
    const productInterest = sanitizeInput(formData.get("productInterest")?.toString() || "", 200);
    const quantity = sanitizeInput(formData.get("quantity")?.toString() || "", 100);
    const destinationCountry = sanitizeInput(formData.get("destinationCountry")?.toString() || "", 100);
    const message = sanitizeInput(formData.get("message")?.toString() || "", 2000);
    const privacyConsent = formData.get("privacyConsent");

    if (
      !fullName ||
      !companyName ||
      !country ||
      !email ||
      !productInterest ||
      !message ||
      !privacyConsent
    ) {
      return NextResponse.json(
        {
          error:
            "Please complete all required fields (Full Name, Company Name, Country, Email, Product, Message, Consent).",
        },
        { status: 400 }
      );
    }

    // SECURITY: Strict email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email) || email.length > 254) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    let attachmentUrl: string | null = null;
    const file = formData.get("file") as File | null;

    if (file && file.size > 0) {
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: "File size exceeds 10MB limit." },
          { status: 400 }
        );
      }

      const safeExt = path.extname(file.name).toLowerCase();

      // SECURITY: Extension whitelist
      if (!ALLOWED_EXTENSIONS.has(safeExt)) {
        return NextResponse.json(
          { error: "Format de fichier non autorisé. Formats acceptés : PDF, DOC, DOCX, PNG, JPG, WEBP." },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // SECURITY: Magic bytes validation — prevents PNG RCE / file spoofing
      if (!validateMagicBytes(buffer, safeExt)) {
        return NextResponse.json(
          { error: "File content does not match its declared type. Upload rejected for security." },
          { status: 400 }
        );
      }

      const safeFilename = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)}${safeExt}`;

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      // 1. Upload to Supabase Storage (cloud hosting, persists permanently on Vercel)
      if (supabaseUrl && supabaseKey) {
        try {
          const uploadRes = await fetch(
            `${supabaseUrl}/storage/v1/object/verdalia-uploads/${safeFilename}`,
            {
              method: "POST",
              headers: {
                apikey: supabaseKey,
                Authorization: `Bearer ${supabaseKey}`,
                "Content-Type": file.type || "application/octet-stream",
                "x-upsert": "true",
              },
              body: buffer,
            }
          );

          if (uploadRes.ok) {
            attachmentUrl = `${supabaseUrl}/storage/v1/object/public/verdalia-uploads/${safeFilename}`;
          } else {
            console.error("Supabase storage upload error:", await uploadRes.text());
          }
        } catch (sErr) {
          console.error("Supabase upload exception:", sErr);
        }
      }

      // 2. If Supabase storage is not configured (e.g. offline dev), fallback to local disk
      if (!attachmentUrl) {
        try {
          const uploadsDir = path.join(process.cwd(), "public", "uploads");
          if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
          }
          const filePath = path.join(uploadsDir, safeFilename);

          // SECURITY: Verify path stays within uploads directory
          const resolvedPath = path.resolve(filePath);
          const resolvedUploads = path.resolve(uploadsDir);
          if (!resolvedPath.startsWith(resolvedUploads)) {
            return NextResponse.json(
              { error: "Invalid file path." },
              { status: 400 }
            );
          }

          fs.writeFileSync(filePath, buffer);
          attachmentUrl = `/uploads/${safeFilename}`;
        } catch (uploadErr) {
          // In serverless without storage, encode image directly as Base64 Data URL
          if (file.type && file.type.startsWith("image/") && file.size < 4 * 1024 * 1024) {
            attachmentUrl = `data:${file.type};base64,${buffer.toString("base64")}`;
          } else {
            attachmentUrl = `/uploads/${safeFilename}`;
          }
        }
      }
    }

    const savedMessage = db.messages.create({
      full_name: fullName,
      company_name: companyName,
      country: country,
      email: email,
      phone: phone,
      product_interest: productInterest,
      quantity: quantity,
      destination_country: destinationCountry,
      message: message,
      attachment_url: attachmentUrl,
    });

    return NextResponse.json({
      success: true,
      messageId: savedMessage.id,
      message:
        "Thank you for contacting Verdalia Company VC. Your message has been received. Our export team will get back to you as soon as possible.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process commercial inquiry. Please try again later." },
      { status: 500 }
    );
  }
}
