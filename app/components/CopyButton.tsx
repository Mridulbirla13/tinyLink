"use client";

import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);

    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={handleCopy}
        className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-150"
      >
        {copied ? "Copied!" : "Copy"}
      </button>

      {copied && (
        <div className="absolute left-1/2 -translate-x-1/2 mt-2 px-3 py-1 text-xs bg-gray-900 text-white rounded shadow animate-fade">
          Copied to clipboard
        </div>
      )}
    </div>
  );
}
