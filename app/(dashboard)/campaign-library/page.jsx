import { ImageIcon, VideoIcon, FileTextIcon, Download, Copy, Check, Target, Library, PenSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function CampaignLibrary() {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [campaignData, setCampaignData] = useState({ images: [], videos: [], captions: [], scripts: [] }); // Added scripts: []
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    async function fetchCampaigns() {
      const res = await fetch('/api/campaigns');
      const data = await res.json();
      setCampaigns(data);
    }
    fetchCampaigns();
  }, []);

  const handleCampaignSelect = async (campaignId) => {
    if (!campaignId) {
        setSelectedCampaign(null);
        setCampaignData({ images: [], videos: [], captions: [], scripts: [] }); // Reset scripts as well
        return;
    };
    setSelectedCampaign(campaignId);
    setLoading(true);
    const res = await fetch(`/api/campaign-library/${campaignId}`);
    const data = await res.json();
    setCampaignData(data);
    setLoading(false);
  };

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadAsset = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    } catch (err) {
        console.error('Failed to download asset:', err);
    }
  };

  return (
    <div className="space-y-8">
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <Library className="w-8 h-8 text-purple-600" />
                Campaign Library
            </h1>
            <div className="w-72">
                <Select onValueChange={handleCampaignSelect}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a campaign" />
                    </SelectTrigger>
                    <SelectContent>
                        {campaigns.map((campaign) => (
                        <SelectItem key={campaign._id} value={campaign._id}>
                            {campaign.name}
                        </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center h-64">
            <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-lg text-gray-600">Loading campaign assets...</p>
            </div>
        </div>
      )}

      {!selectedCampaign && !loading && (
        <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-white min-h-[400px]">
            <div className="flex flex-col items-center gap-2 text-center">
                <Target className="w-16 h-16 text-gray-400 mb-4" />
                <h3 className="text-2xl font-bold tracking-tight text-gray-800">
                Select a campaign
                </h3>
                <p className="text-sm text-gray-500">
                Choose a campaign from the dropdown to view its assets.
                </p>
            </div>
        </div>
      )}
      
      {selectedCampaign && !loading && (
        <div className="space-y-8">
            {/* Captions */}
            <Card className="bg-white shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl text-gray-800">
                        <FileTextIcon className="w-6 h-6 text-purple-600" />
                        Captions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                {campaignData.captions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {campaignData.captions.map((caption) => (
                        <div key={caption._id} className="border p-4 rounded-lg bg-gray-50 space-y-2">
                            <p className="text-gray-700">{caption.text}</p>
                            <div className="flex justify-between items-center">
                                <Badge variant="outline">{caption.creditsUsed} credits</Badge>
                                <Button size="icon" variant="ghost" onClick={() => copyToClipboard(caption.text, caption._id)}>
                                    {copiedId === caption._id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                </Button>
                            </div>
                        </div>
                    ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No captions found for this campaign.</p>
                )}
                </CardContent>
            </Card>

            {/* Scripts */}
            <Card className="bg-white shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl text-gray-800">
                        <PenSquare className="w-6 h-6 text-purple-600" />
                        Scripts
                    </CardTitle>
                </CardHeader>
                <CardContent>
                {campaignData.scripts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {campaignData.scripts.map((script) => (
                        <div key={script._id} className="border p-4 rounded-lg bg-gray-50 space-y-2">
                            <p className="text-gray-700 whitespace-pre-wrap">{script.text}</p>
                            <div className="flex justify-between items-center">
                                <Badge variant="outline">{script.creditsUsed} credits</Badge>
                                <Button size="icon" variant="ghost" onClick={() => copyToClipboard(script.text, script._id)}>
                                    {copiedId === script._id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                </Button>
                            </div>
                        </div>
                    ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No scripts found for this campaign.</p>
                )}
                </CardContent>
            </Card>

            {/* Images */}
            <Card className="bg-white shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl text-gray-800">
                        <ImageIcon className="w-6 h-6 text-purple-600" />
                        Images
                    </CardTitle>
                </CardHeader>
                <CardContent>
                {campaignData.images.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {campaignData.images.map((image) => (
                        <div key={image._id} className="group relative">
                            <img src={image.imageUrl} alt="Generated image" className="rounded-lg shadow-md w-full h-auto" />
                            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button size="icon" onClick={() => downloadAsset(image.imageUrl, `adcraft-image-${image._id}.png`)}>
                                    <Download className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No images found for this campaign.</p>
                )}
                </CardContent>
            </Card>

            {/* Videos */}
            <Card className="bg-white shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl text-gray-800">
                        <VideoIcon className="w-6 h-6 text-purple-600" />
                        Videos
                    </CardTitle>
                </CardHeader>
                <CardContent>
                {campaignData.videos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {campaignData.videos.map((video) => (
                        <div key={video._id} className="group relative">
                            <video src={video.videoUrl} controls className="rounded-lg shadow-md w-full" />
                            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button size="icon" onClick={() => downloadAsset(video.videoUrl, `adcraft-video-${video._id}.mp4`)}>
                                    <Download className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No videos found for this campaign.</p>
                )}
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
