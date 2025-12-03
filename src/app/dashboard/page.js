"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [url, setUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");

  async function loadLinks() {
    try {
      const res = await fetch("/api/links");
      if (!res.ok) throw new Error("Failed to load links");
      const data = await res.json();
      setLinks(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load links.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLinks();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setCreating(true);

    try {
      if (!url) {
        setError("URL is required");
        return;
      }

      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUrl: url, code: customCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create link");
        return;
      }

      setSuccess("Short link created successfully.");
      setUrl("");
      setCustomCode("");
      await loadLinks();
    } catch (err) {
      console.error(err);
      setError("Something went wrong while creating the link.");
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id) {
    const confirmDelete = confirm("Are you sure you want to delete this link?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/links/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Failed to delete link");
        return;
      }
      setLinks((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete link");
    }
  }

  async function handleCopy(shortUrl) {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setSuccess("Copied to clipboard!");
    } catch {
      setError("Failed to copy link.");
    }
  }

  const filteredLinks = links.filter((l) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      l.code.toLowerCase().includes(q) ||
      l.targetUrl.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">URL Shortener Dashboard</h1>
        <a
          href="/healthz"
          className="text-sm text-blue-600 underline"
        >
          Healthcheck
        </a>
      </header>

      {/* Create form */}
      <section className="border rounded-xl p-4 sm:p-6 shadow-sm bg-white space-y-4">
        <h2 className="text-xl font-semibold">Create a new short link</h2>
        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
            {error}
          </p>
        )}
        {success && (
          <p className="text-sm text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded">
            {success}
          </p>
        )}

        <form onSubmit={handleCreate} className="space-y-3">
          <div className="space-y-1">
            <label className="text-sm font-medium">Long URL *</label>
            <input
              type="url"
              placeholder="https://example.com/very/long/url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">
              Custom code (optional)
            </label>
            <input
              type="text"
              placeholder="docs, landing, promo123..."
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-200"
            />
            <p className="text-xs text-gray-500">
              Your short URL will look like:{" "}
              <span className="font-mono">
                http://localhost:3000/{customCode || "<random>"}
              </span>
            </p>
          </div>

          <button
            type="submit"
            disabled={creating}
            className={`px-4 py-2 rounded text-white ${
              creating ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {creating ? "Creating..." : "Create Short Link"}
          </button>
        </form>
      </section>

      {/* Search + table */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-xl font-semibold">All links</h2>
          <input
            type="text"
            placeholder="Search by code or URL..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>

        {loading ? (
          <p>Loading links...</p>
        ) : filteredLinks.length === 0 ? (
          <p className="text-gray-500">No links found.</p>
        ) : (
          <div className="overflow-x-auto bg-white border rounded-xl shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="px-4 py-2">Short code</th>
                  <th className="px-4 py-2">Target URL</th>
                  <th className="px-4 py-2">Total clicks</th>
                  <th className="px-4 py-2">Last clicked</th>
                  <th className="px-4 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLinks.map((link) => {
                  const shortUrl = `http://localhost:3000/${link.code}`;
                  return (
                    <tr key={link.id} className="border-t">
                      <td className="px-4 py-2 font-mono">{link.code}</td>
                      <td className="px-4 py-2 max-w-xs">
                        <span
                          title={link.targetUrl}
                          className="block truncate text-blue-700 underline"
                        >
                          {link.targetUrl}
                        </span>
                      </td>
                      <td className="px-4 py-2">{link.clickCount}</td>
                      <td className="px-4 py-2 text-xs">
                        {link.lastClicked
                          ? new Date(link.lastClicked).toLocaleString()
                          : "Never"}
                      </td>
                      <td className="px-4 py-2 text-right space-x-2">
                        <button
                          className="text-xs px-2 py-1 border rounded hover:bg-gray-50"
                          onClick={() => handleCopy(shortUrl)}
                        >
                          Copy
                        </button>
                        <a
                          href={`/code/${link.code}`}
                          className="text-xs px-2 py-1 border rounded hover:bg-gray-50"
                        >
                          Stats
                        </a>
                        <button
                          className="text-xs px-2 py-1 border border-red-500 text-red-600 rounded hover:bg-red-50"
                          onClick={() => handleDelete(link.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
