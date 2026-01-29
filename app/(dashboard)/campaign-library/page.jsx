"use client";

import React, { useState, useEffect } from 'react';
import { Search, Filter, FileText, Image as ImageIcon, Clapperboard, PenSquare, Calendar, Download, Trash2, ExternalLink, Library } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export default function CampaignLibraryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCampaign, setSelectedCampaign] = useState('all');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/campaign-library');
        if (!res.ok) throw new Error('Failed to fetch data');
        const data = await res.json();

        const { captions, images, videos, scripts, campaignMap } = data;

        // Normalize data structure
        const normalizedItems = [
          ...images.map(item => ({ ...item, type: 'image', content: item.imageUrl, campaignName: campaignMap[item.campaignId] || 'Unknown Campaign' })),
          ...videos.map(item => ({ ...item, type: 'video', content: item.videoUrl, campaignName: campaignMap[item.campaignId] || 'Unknown Campaign' })),
          ...captions.map(item => ({ ...item, type: 'caption', content: item.text, campaignName: campaignMap[item.campaignId] || 'Unknown Campaign' })),
          ...scripts.map(item => ({ ...item, type: 'script', content: item.text, campaignName: campaignMap[item.campaignId] || 'Unknown Campaign' }))
        ];

        // Sort by createdAt desc
        normalizedItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setItems(normalizedItems);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredItems = items.filter(item => {
    const matchesSearch = (item.content?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                          item.campaignName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesCampaign = selectedCampaign === 'all' || item.campaignName === selectedCampaign;
    
    return matchesSearch && matchesType && matchesCampaign;
  });

  const campaigns = ['all', ...Array.from(new Set(items.map(item => item.campaignName)))];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'image': return <ImageIcon className="w-4 h-4" />;
      case 'video': return <Clapperboard className="w-4 h-4" />;
      case 'script': return <PenSquare className="w-4 h-4" />;
      case 'caption': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'image': return 'bg-blue-100 text-blue-700 hover:bg-blue-200';
      case 'video': return 'bg-red-100 text-red-700 hover:bg-red-200';
      case 'script': return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200';
      case 'caption': return 'bg-green-100 text-green-700 hover:bg-green-200';
      default: return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
    }
  };

  const handleDownload = async (item) => {
    try {
      if (item.type === 'caption' || item.type === 'script') {
        const blob = new Blob([item.content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `adcraft-${item.type}-${item._id}.txt`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const response = await fetch(item.content);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `adcraft-${item.type}-${item._id}.${item.type === 'video' ? 'mp4' : 'png'}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (err) {
      console.error('Failed to download:', err);
      alert('Failed to download asset');
    }
  };

  const handleDelete = async (id, type) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const res = await fetch('/api/campaign-library', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, type }),
      });

      if (!res.ok) throw new Error('Failed to delete');

      setItems(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      console.error('Failed to delete:', err);
      alert('Failed to delete item');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Campaign Library</h1>
        <p className="text-muted-foreground text-gray-500 mt-2">
          Manage and organize all your generated content in one place.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input 
            placeholder="Search content or campaigns..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <SelectValue placeholder="Filter by Type" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="image">Images</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
              <SelectItem value="script">Scripts</SelectItem>
              <SelectItem value="caption">Captions</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by Campaign" />
            </SelectTrigger>
            <SelectContent>
              {campaigns.map(campaign => (
                <SelectItem key={campaign} value={campaign}>
                  {campaign === 'all' ? 'All Campaigns' : campaign}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item, index) => (
          <Card key={item._id || index} className="overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col border-gray-200 group">
            <CardHeader className="p-4 pb-2 space-y-2">
              <div className="flex justify-between items-start">
                <Badge variant="secondary" className={`${getTypeColor(item.type)} flex items-center gap-1 transition-colors`}>
                  {getTypeIcon(item.type)}
                  <span className="capitalize">{item.type}</span>
                </Badge>
                <div className="text-xs text-gray-500 flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full">
                  <Calendar className="w-3 h-3" />
                  {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                </div>
              </div>
              <CardTitle className="text-base font-medium line-clamp-1" title={item.campaignName}>
                {item.campaignName}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-4 pt-2 flex-grow">
              {item.type === 'image' && (
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 relative group/image">
                  <img src={item.content} alt={item.prompt} className="w-full h-full object-cover transition-transform duration-500 group-hover/image:scale-105" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="secondary" size="sm" className="gap-2">
                      <ExternalLink className="w-4 h-4" /> View
                    </Button>
                  </div>
                </div>
              )}
              
              {item.type === 'video' && (
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 relative group/video">
                  <video src={item.content} className="w-full h-full object-cover" controls />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/video:bg-black/40 transition-colors">
                  </div>
                </div>
              )}

              {(item.type === 'caption' || item.type === 'script') && (
                <div className="bg-slate-50 p-4 rounded-lg h-40 overflow-y-auto text-sm text-gray-600 whitespace-pre-wrap border border-slate-100 shadow-inner">
                  {item.content}
                </div>
              )}
              
              {item.prompt && (
                <div className="mt-3 bg-gray-50 p-2 rounded text-xs text-gray-500 border border-gray-100">
                  <span className="font-semibold text-gray-700">Prompt:</span> <span className="line-clamp-2">{item.prompt}</span>
                </div>
              )}
            </CardContent>

            <CardFooter className="p-4 pt-0 flex gap-2 mt-auto">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 gap-2 hover:bg-gray-50"
                onClick={() => handleDownload(item)}
              >
                <Download className="w-4 h-4" /> Download
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                onClick={() => handleDelete(item._id, item.type)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      )}

      {!loading && filteredItems.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-4">
            <Library className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No items found</h3>
          <p className="text-gray-500 mt-1">Try adjusting your filters or search query.</p>
          <Button 
            variant="link" 
            className="mt-4 text-purple-600"
            onClick={() => {
              setSearchTerm('');
              setSelectedType('all');
              setSelectedCampaign('all');
            }}
          >
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
}
