"use client";

import { useState } from "react";

export default function CreateLink() {
  const [url, setUrl] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetUrl: url }),  // ✅ FIXED
    });

    if (res.ok) {
      alert("Link created!");
      window.location.href = "/dashboard";
    } else {
      const err = await res.json();
      alert("Error: " + (err.error || "Something went wrong"));
    }
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">Create a Short Link</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          type="text"
          placeholder="Enter long URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border w-full p-3 rounded-lg"
        />

        <button className="px-4 py-2 bg-black text-white rounded-lg">
          Create
        </button>
      </form>
    </div>
  );
}
