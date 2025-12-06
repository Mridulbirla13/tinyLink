import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request, context: any) {
  const params = await context.params;   // FIX
  const code = params.code;

  console.log("PARAMS RECEIVED:", context.params);

  if (!code) {
    return NextResponse.json({ error: "Invalid code" }, { status: 400 });
  }

  const link = await prisma.link.findUnique({
    where: { code },
  });

  if (!link) {
    return NextResponse.json({ error: "Link not found" }, { status: 404 });
  }

  await prisma.link.update({
    where: { code },
    data: {
      clicks: { increment: 1 },
      lastClicked: new Date(),
    },
  });

  return NextResponse.redirect(link.targetUrl);
}
