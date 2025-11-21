"use client";

import { useState } from "react";

export default function CreateLinkForm({ refresh }) {
  const [url, setUrl] = useState("");

    //   async function handleSubmit(e) {
    //     e.preventDefault();

    //     await fetch("/api/links", {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify({ url }),
    //     });

    //     setUrl("");
    //     refresh();
    //   }


async function handleSubmit(e) {
  e.preventDefault();

  await fetch("/api/links", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ targetUrl: url }),
  });

  setUrl("");
  refresh();
}


  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded-lg">
      <input
        type="text"
        placeholder="Enter URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full border px-3 py-2 rounded"
        required
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Create Short Link
      </button>
    </form>
  );
}
