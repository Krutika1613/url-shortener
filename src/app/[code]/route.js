import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(_req, { params }) {
  const { code } = params;

  const link = await prisma.link.findUnique({
    where: { code },
  });

  if (!link) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Increment click count and update lastClicked
  await prisma.link.update({
    where: { code },
    data: {
      clickCount: link.clickCount + 1,
      lastClicked: new Date(),
    },
  });

  return NextResponse.redirect(link.targetUrl, 302);
}
