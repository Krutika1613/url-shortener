"use client";

export default function LinkCard({ link, refresh }) {
  async function handleDelete() {
    await fetch(`/api/links/${link.id}`, {
      method: "DELETE",
    });

    refresh();
  }

  return (
    <div className="border p-4 rounded-lg flex justify-between items-start">
      <div>
        <p className="font-semibold">{link.shortCode}</p>
        <a
          href={link.originalUrl}
          target="_blank"
          className="text-blue-600 underline"
        >
          {link.originalUrl}
        </a>
        <p className="text-sm text-gray-500">Clicks: {link.clicks}</p>
      </div>

      <button
        onClick={handleDelete}
        className="bg-red-500 text-white px-3 py-1 rounded"
      >
        Delete
      </button>
    </div>
  );
}
