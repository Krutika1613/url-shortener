import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function CodeStatsPage({ params }) {
  // IMPORTANT FIX: Always read params this way
  const code = params?.code;

  if (!code) {
    return notFound();
  }

  const link = await prisma.link.findUnique({
    where: { code },
  });

  if (!link) {
    return notFound();
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Stats for code: {code}</h1>

      <div className="mt-6 space-y-3">
        <p><strong>Original URL:</strong> {link.targetUrl}</p>
        <p><strong>Total Clicks:</strong> {link.clickCount}</p>
        <p><strong>Last Clicked:</strong> {link.lastClicked ? link.lastClicked.toString() : "Never"}</p>
        <p><strong>Created:</strong> {link.createdAt.toISOString()}</p>
      </div>
    </div>
  );
}
