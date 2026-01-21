"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import EditForm from "./EditForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function EditPage() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/campaigns/${id}`);
        if (!res.ok) {
          if (res.status === 404) {
            if (!mounted) return;
            setCampaign(null);
            setError("not-found");
          } else {
            const txt = await res.text();
            throw new Error(`${res.status} ${txt}`);
          }
          return;
        }
        const data = await res.json();
        // defensive: convert _id to string if present
        if (data && data._id && typeof data._id !== "string") {
          data._id = String(data._id);
        }
        if (!mounted) return;
        setCampaign(data);
      } catch (err) {
        console.error("Failed to load campaign:", err);
        if (!mounted) return;
        setError("network");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    </div>
  );

  if (error === "not-found" || !campaign) {
    return (
        <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-white min-h-[400px]">
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-2xl font-bold tracking-tight text-gray-800">Campaign not found</p>
          <p className="text-sm text-gray-500">The campaign you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
        <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed border-red-400 bg-red-50 min-h-[400px]">
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-2xl font-bold tracking-tight text-red-700">Error loading campaign</p>
          <p className="text-sm text-red-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-gray-800">Edit Campaign</CardTitle>
        <CardDescription>Update the details of your campaign.</CardDescription>
      </CardHeader>
      <CardContent>
        <EditForm campaign={campaign} />
      </CardContent>
    </Card>
  );
}
