"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function DeleteCampaignButton({ id }) {
  const router = useRouter();

  const handleDelete = async () => {
    await fetch(`/api/campaigns/${id}`, {
      method: "DELETE",
    });

    router.refresh();
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      className="bg-red-600 hover:bg-red-700 text-white border-red-600 dark:bg-red-500/30 dark:hover:bg-red-500/40 dark:text-red-100 dark:border-red-400/50"
    >
      Delete
    </Button>
  );
}
