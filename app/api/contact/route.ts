import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/db";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Spam honeypot
    const honeypot = formData.get("website_url")?.toString();
    if (honeypot) {
      return NextResponse.json({ success: true, message: "Received" });
    }

    const fullName = formData.get("fullName")?.toString()?.trim();
    const companyName = formData.get("companyName")?.toString()?.trim();
    const country = formData.get("country")?.toString()?.trim();
    const email = formData.get("email")?.toString()?.trim();
    const phone = formData.get("phone")?.toString()?.trim() || "";
    const productInterest = formData.get("productInterest")?.toString()?.trim();
    const quantity = formData.get("quantity")?.toString()?.trim() || "";
    const destinationCountry =
      formData.get("destinationCountry")?.toString()?.trim() || "";
    const message = formData.get("message")?.toString()?.trim();
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
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

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      try {
        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const safeExt = path.extname(file.name).toLowerCase();
        const safeFilename = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 9)}${safeExt}`;
        const filePath = path.join(uploadsDir, safeFilename);

        fs.writeFileSync(filePath, buffer);
        attachmentUrl = `/uploads/${safeFilename}`;
      } catch (uploadErr) {
        console.warn("Local disk write not supported on serverless, using placeholder:", uploadErr);
        attachmentUrl = `/uploads/${file.name}`;
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
