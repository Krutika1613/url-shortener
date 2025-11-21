import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(req, context) {
  const { params } = await context;     // 👈 FIX: await the params promise

  const id = params.slug[0];            // first part of [...slug]

  try {
    await prisma.link.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete link", details: err.message },
      { status: 500 }
    );
  }
}
