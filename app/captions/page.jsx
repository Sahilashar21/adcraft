// "use client";

// import { useEffect, useState } from "react";

// export default function CaptionGeneratorPage() {
//   const [campaigns, setCampaigns] = useState([]);
//   const [selectedCampaign, setSelectedCampaign] = useState("");
//   const [caption, setCaption] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // Load campaigns
//   useEffect(() => {
//     const loadCampaigns = async () => {
//       const res = await fetch("/api/campaigns");
//       const data = await res.json();
//       setCampaigns(data);
//     };

//     loadCampaigns();
//   }, []);

//   // Generate caption
//   const generateCaption = async () => {
//     if (!selectedCampaign) {
//       setError("Please select a campaign");
//       return;
//     }

//     setLoading(true);
//     setError("");
//     setCaption("");

//     const res = await fetch("/api/captions", {
//       method: "POST",
//       body: JSON.stringify({
//         campaignId: selectedCampaign,
//       }),
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       setError(data.error || "Failed to generate caption");
//       setLoading(false);
//       return;
//     }

//     setCaption(data.text);
//     setLoading(false);
//   };

//   return (
//     <main className="max-w-xl mx-auto p-4 space-y-6">
//       <h1 className="text-2xl font-semibold">Caption Generator</h1>

//       {/* Campaign selector */}
//       <select
//         className="border p-2 w-full rounded"
//         value={selectedCampaign}
//         onChange={(e) => setSelectedCampaign(e.target.value)}
//       >
//         <option value="">Select Campaign</option>
//         {campaigns.map((c) => (
//           <option key={c._id} value={c._id}>
//             {c.name} (Credits: {c.credits})
//           </option>
//         ))}
//       </select>

//       {/* Generate button */}
//       <button
//         onClick={generateCaption}
//         disabled={loading}
//         className="bg-blue-600 text-white px-4 py-2 rounded w-full"
//       >
//         {loading ? "Generating..." : "Generate Caption (5 credits)"}
//       </button>

//       {/* Error */}
//       {error && <p className="text-red-500 text-sm">{error}</p>}

//       {/* Output */}
//       {caption && (
//         <div className="bg-white p-4 rounded shadow">
//           <h3 className="font-semibold mb-2">Generated Caption</h3>
//           <p>{caption}</p>
//         </div>
//       )}
//     </main>
//   );
// }




"use client";

import { useEffect, useState } from "react";

export default function CaptionGeneratorPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load campaigns
  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const res = await fetch("/api/campaigns");
        const data = await res.json();
        setCampaigns(data);
      } catch (err) {
        setError("Failed to load campaigns");
      }
    };

    loadCampaigns();
  }, []);

  // Generate caption
  const generateCaption = async () => {
    if (!selectedCampaign) {
      setError("Please select a campaign");
      return;
    }

    setLoading(true);
    setError("");
    setCaption("");

    try {
      const res = await fetch("/api/generate-caption", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          campaignId: selectedCampaign,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to generate caption");
      } else {
        setCaption(data.text);
      }
    } catch (err) {
      setError("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <main className="max-w-xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Caption Generator</h1>

      <select
        className="border p-2 w-full rounded"
        value={selectedCampaign}
        onChange={(e) => setSelectedCampaign(e.target.value)}
      >
        <option value="">Select Campaign</option>
        {campaigns.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name} (Credits: {c.credits})
          </option>
        ))}
      </select>

      <button
        onClick={generateCaption}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Caption (5 credits)"}
      </button>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {caption && (
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Generated Caption</h3>
          <p>{caption}</p>
        </div>
      )}
    </main>
  );
}
