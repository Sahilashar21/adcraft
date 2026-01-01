"use client";

import { useRouter } from "next/navigation";

export default function DeleteCampaignButton({ id }) {
  const router = useRouter();

  const handleDelete = async () => {
    await fetch(`/api/campaigns/${id}`, {
      method: "DELETE",
    });

    router.refresh(); // 👈 THIS is the key
  };

  return (
    <button
      onClick={handleDelete}
      className="px-3 py-1 bg-red-600 text-white rounded"
    >
      Delete
    </button>
  );
}
