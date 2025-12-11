"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import EditForm from "./EditForm";

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

  if (loading) return <div className="p-4 text-center">Loading…</div>;
  if (error === "not-found" || !campaign) {
    return <div className="p-4 text-center text-red-600">Campaign not found</div>;
  }
  if (error) {
    return <div className="p-4 text-center text-red-600">Error loading campaign</div>;
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Edit Campaign</h1>
      <EditForm campaign={campaign} />
    </main>
  );
}





// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import EditForm from "./EditForm";

// export default function EditPage() {
//   const { id } = useParams();
//   const [campaign, setCampaign] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!id) return;

//     const load = async () => {
//       try {
//         const res = await fetch(`/api/campaigns/${id}`, { cache: "no-store" });
//         const data = await res.json();
//         setCampaign(data);
//       } catch (e) {
//         console.error(e);
//       }
//       setLoading(false);
//     };

//     load();
//   }, [id]);

//   if (loading) return <div className="p-4 text-center">Loading...</div>;
//   if (!campaign || campaign.error)
//     return <div className="p-4 text-center text-red-500">Campaign not found</div>;

//   return (
//     <main className="max-w-xl mx-auto p-4">
//       <h2 className="text-xl font-semibold mb-4">Edit Campaign</h2>
//       <EditForm campaign={campaign} />
//     </main>
//   );
// }
