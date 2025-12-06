"use client";

import { useEffect, useState } from "react";
import { Copy, Trash2, Plus, TrendingUp, ExternalLink, Search } from "lucide-react";

export default function Dashboard() {
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ targetUrl: "", code: "" });
  const [message, setMessage] = useState("");

  // Fetch links
  const loadLinks = async () => {
    const res = await fetch("/api/links");
    const data = await res.json();
    setLinks(data);
  };

  useEffect(() => {
    loadLinks();
  }, []);

  const createLink = async () => {
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/links", {
      method: "POST",
      body: JSON.stringify({
        targetUrl: form.targetUrl,
        code: form.code || undefined
      }),
      headers: { "Content-Type": "application/json" }
    });

    if (res.status === 409) {
      setMessage("❌ Code already exists. Choose another.");
      setLoading(false);
      return;
    }

    if (res.ok) {
      setMessage("✅ Link created!");
      setForm({ targetUrl: "", code: "" });
      setShowForm(false);
      loadLinks();
    } else {
      setMessage("❌ Error creating link.");
    }

    setLoading(false);
  };

  const deleteLink = async (code: string) => {
    if (!confirm("Delete this link?")) return;

    await fetch(`/api/links/${code}`, { method: "DELETE" });
    loadLinks();
  };

  const copyLink = (code: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/${code}`);
    setMessage("📋 Copied to clipboard!");
    setTimeout(() => setMessage(""), 2000);
  };

  const filtered = links.filter(
    (l) =>
      l.code.toLowerCase().includes(search.toLowerCase()) ||
      l.targetUrl.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (date: string | null) => {
    if (!date) return "Never";
    const d = new Date(date);
    return d.toLocaleDateString() + " " + d.toLocaleTimeString();
  };

  return (
    <div className="min-h-screen bg-gray-50 px-15 py-10">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-blue-600 text-white rounded-lg flex items-center justify-center">
            <ExternalLink className="w-5 h-5" />
          </div>
          <h1 className="text-3xl font-bold text-gray-700">TinyLink Dashboard</h1>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Link</span>
        </button>
      </div>

      {message && (
        <div className="mb-4 px-4 py-3 bg-blue-100 text-blue-800 border border-blue-300 rounded-xl shadow-sm">
          {message}
        </div>
      )}

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-lg mb-6 border border-gray-200 text-dark-gray-700">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Create Short Link</h2>

          <div className="space-y-4">
            <input
              placeholder="Target URL (Required)"
              value={form.targetUrl}
              onChange={(e) => setForm({ ...form, targetUrl: e.target.value })}
              className="w-full border border-gray-300 px-3 py-2.5 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-400 outline-none transition"
            />

            <input
              placeholder="Custom Code (Optional, 6-8 chars)"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              className="w-full border border-gray-300 px-3 py-2.5 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-400 outline-none transition"
            />

            <div className="flex space-x-3">
              <button
                onClick={createLink}
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                {loading ? "Creating..." : "Create"}
              </button>

              <button
                onClick={() => setShowForm(false)}
                className="bg-gray-300 px-4 py-2 rounded text-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          className="w-full pl-10 px-3 py-2.5 border border-gray-300 rounded-xl text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-400 outline-none transition"
          placeholder="Search links..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="text-left p-3">Short Code</th>
              <th className="text-left p-3">Target URL</th>
              <th className="text-left p-3">Clicks</th>
              <th className="text-left p-3">Last Clicked</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((link) => (
              <tr key={link.code} className="border-t hover:bg-gray-50 transition hover:shadow-sm">
                <td className="p-3">
                  <a
                    href={`${process.env.NEXT_PUBLIC_BASE_URL}/${link.code}`}
                    target="_blank"
                    className="bg-blue-100 text-blue-700 px-2 py-1 rounded cursor-pointer hover:bg-blue-200 transition"
                  >
                    {link.code}
                  </a>
                </td>

                <td className="p-3 max-w-xs">
                  <p className="text-gray-600 truncate hover:text-gray-800">{link.targetUrl}</p>
                </td>

                <td className="p-3">
                  <div className="flex items-center space-x-1 text-gray-500">
                    <TrendingUp className="w-4 text-gray-400" />
                    <span>{link.clicks}</span>
                  </div>
                </td>

                <td className="p-3 text-gray-500">{formatDate(link.lastClicked)}</td>

                <td className="p-3 flex items-center space-x-3">
                  <button
                    onClick={() => copyLink(link.code)}
                    className="text-gray-500 hover:text-blue-600 transition"
                    title="Copy short link"
                  >
                    <Copy className="w-4" />
                  </button>

                  <button
                    onClick={() => deleteLink(link.code)}
                    className="text-gray-500 hover:text-red-600 transition"
                    title="Delete link"
                  >
                    <Trash2 className="w-4" />
                  </button>

                  <a
                    href={`/code/${link.code}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Stats
                  </a>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-400">
                  No links found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}