"use client";

import { useState } from "react";

export default function CreateLinkForm({ refresh }) {
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        targetUrl: url,   // must match backend
        code: code,       // required by backend
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(data.error || "Failed to create link");
      return;
    }

    setUrl("");
    setCode("");
    refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded-lg">
      <input
        type="text"
        placeholder="Enter long URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full border px-3 py-2 rounded"
        required
      />

      <input
        type="text"
        placeholder="Custom short code (e.g., docs)"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full border px-3 py-2 rounded"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {loading ? "Creating..." : "Create Short Link"}
      </button>
    </form>
  );
}
