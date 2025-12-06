import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function StatsPage(props: any) {
  // FIX: params must be awaited in Next.js App Router
  const params = await props.params;
  const code = params.code;

  const link = await prisma.link.findUnique({
    where: { code },
  });

  if (!link) return notFound();

  return (
    <div className="min-h-screen bg-gray-50 px-15 py-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-700">Stats for: <span className="text-blue-700">{code}</span></h1>

      <div className="bg-white p-6 rounded-lg shadow space-y-4 text-gray-500">
        <p><strong className="text-gray-600">Target URL:</strong> {link.targetUrl}</p>
        <p><strong className="text-gray-600">Clicks:</strong> {link.clicks}</p>
        <p>
          <strong className="text-gray-600">Last Clicked:</strong>{" "}
          {link.lastClicked ? link.lastClicked.toString() : "Never"}
        </p>
      </div>
    </div>
  );
}