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
      className="bg-red-500/20 hover:bg-red-500/30 border-red-400/50 text-red-200 hover:text-red-100 backdrop-blur-md"
    >
      Delete
    </Button>
  );
}
