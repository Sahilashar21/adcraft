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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-4"></div>
        <p className="text-lg text-purple-200">Loading...</p>
      </div>
    </div>
  );

  if (error === "not-found" || !campaign) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-lg border border-white/20 bg-white/5 backdrop-blur-xl shadow-2xl shadow-purple-500/10 min-h-[400px]">
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-2xl font-bold tracking-tight text-white">Campaign not found</p>
          <p className="text-sm text-purple-200">The campaign you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-lg border border-red-400/50 bg-red-500/10 backdrop-blur-xl shadow-2xl shadow-red-500/10 min-h-[400px]">
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-2xl font-bold tracking-tight text-red-200">Error loading campaign</p>
          <p className="text-sm text-red-300">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl shadow-purple-500/20">
      <CardHeader>
        <CardTitle className="text-2xl text-white bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">Edit Campaign</CardTitle>
        <CardDescription className="text-purple-200">Update the details of your campaign.</CardDescription>
      </CardHeader>
      <CardContent>
        <EditForm campaign={campaign} />
      </CardContent>
    </Card>
  );
}
