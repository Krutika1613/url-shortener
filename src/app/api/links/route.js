import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET ALL LINKS
export async function GET() {
  const links = await prisma.link.findMany({
    orderBy: { id: "desc" },
  });
  return NextResponse.json(links);
}

// CREATE NEW LINK
export async function POST(req) {
  const body = await req.json();
  const { targetUrl, code } = body;

  if (!targetUrl) {
    return NextResponse.json(
      { error: "URL is required" },
      { status: 400 }
    );
  }

  // check if custom code exists
  const exists = await prisma.link.findUnique({
    where: { code },
  });

  if (exists) {
    return NextResponse.json(
      { error: "Code already exists" },
      { status: 400 }
    );
  }

  const link = await prisma.link.create({
    data: {
      targetUrl,
      code,
      clickCount: 0,
    },
  });

  return NextResponse.json(link);
}
