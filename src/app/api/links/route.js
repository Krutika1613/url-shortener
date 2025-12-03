import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET ALL LINKS
export async function GET() {
  const links = await prisma.link.findMany({
    orderBy: { id: "desc" },
  });
  return NextResponse.json(links);
}
export async function POST(req) {
  try {
    const { targetUrl, code } = await req.json();

    if (!targetUrl) {
      return NextResponse.json(
        { error: "Target URL is required" },
        { status: 400 }
      );
    }

    // If user didn't provide code, generate one
    const shortCode =
      code?.trim() && code.trim() !== ""
        ? code.trim()
        : Math.random().toString(36).substring(2, 8);

    // Validate URL
    try {
      new URL(targetUrl);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    // Check duplicate
    const exists = await prisma.link.findUnique({ where: { code: shortCode } });
    if (exists) {
      return NextResponse.json(
        { error: "Short code already exists" },
        { status: 400 }
      );
    }

    const link = await prisma.link.create({
      data: {
        targetUrl,
        code: shortCode,
        clickCount: 0,
      },
    });

    return NextResponse.json(link);

  } catch (err) {
    return NextResponse.json(
      { error: "Server error while creating link", details: err.message },
      { status: 500 }
    );
  }
}
