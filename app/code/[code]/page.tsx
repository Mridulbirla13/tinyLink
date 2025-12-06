import CopyButton from "@/app/components/CopyButton";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function StatsPage(props: any) {
  // FIX: params must be awaited in Next.js App Router
  const params = await props.params;
  const code = params.code;

  const link = await prisma.link.findUnique({
    where: { code },
  });

  if (!link) return notFound();
  const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${code}`;

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Stats for <span className="text-blue-600">{code}</span>
            </h1>
            <p className="text-gray-500 mt-1">Here are the analytics for your shortened link.</p>
          </div>

          <Link
            href="/"
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-black transition whitespace-nowrap"
          >
            ← Back
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md space-y-5 border border-gray-200">
          <div>
            <p className="text-gray-600 font-medium">Short URL</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-gray-800 break-all">{shortUrl}</span>
              <CopyButton text={shortUrl} />
            </div>
          </div>

          <div>
            <p className="text-gray-600 font-medium">Target URL</p>
            <a
              href={link.targetUrl}
              target="_blank"
              className="text-blue-600 break-all hover:underline"
            >
              {link.targetUrl}
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-gray-500 text-sm">Total Clicks</p>
              <p className="text-2xl font-bold text-gray-900">{link.clicks}</p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-gray-500 text-sm">Last Clicked</p>
              <p className="text-lg font-semibold text-gray-900">
                {link.lastClicked ? link.lastClicked.toLocaleString() : "Never"}
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-gray-500 text-sm">QR Code</p>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${shortUrl}`}
                alt="QR code"
                className="mx-auto mt-2"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}