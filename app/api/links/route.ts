import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const CreateLinkSchema = z.object({
  targetUrl: z.string().url(),
  code: z.string().regex(/^[A-Za-z0-9]{6,8}$/).optional(),
});

function generateRandomCode() {
  return Math.random().toString(36).substring(2, 10).slice(0, 7);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = CreateLinkSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const { targetUrl, code } = parsed.data;
    const finalCode = code || generateRandomCode();

    const existing = await prisma.link.findUnique({
      where: { code: finalCode },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Code already exists" },
        { status: 409 }
      );
    }

    const link = await prisma.link.create({
      data: {
        code: finalCode,
        targetUrl,
      },
    });

    return NextResponse.json(link, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  const links = await prisma.link.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(links);
}