"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import EditForm from "./EditForm";

export default function EditPage() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        const res = await fetch(`/api/campaigns/${id}`, { cache: "no-store" });
        const data = await res.json();
        setCampaign(data);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };

    load();
  }, [id]);

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (!campaign || campaign.error)
    return <div className="p-4 text-center text-red-500">Campaign not found</div>;

  return (
    <main className="max-w-xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Edit Campaign</h2>
      <EditForm campaign={campaign} />
    </main>
  );
}
