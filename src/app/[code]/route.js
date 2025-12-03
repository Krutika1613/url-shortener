import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(_req, { params }) {
  const { code } = params;

  try {
    const link = await prisma.link.findUnique({
      where: { shortCode: code },   // ✔ FIXED
    });

    if (!link) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Update click count
    await prisma.link.update({
      where: { shortCode: code },
      data: {
        clickCount: link.clickCount + 1,
        lastClicked: new Date(),
      },
    });

    return NextResponse.redirect(link.targetUrl);
  } catch (err) {
    console.error("GET /api/links/[code] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
