"use client";

import React, { useState, useEffect } from 'react';
import { Search, Filter, FileText, Image as ImageIcon, Clapperboard, PenSquare, Calendar, Download, Trash2, ExternalLink, Library } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const typeColors = {
  image: { bg: 'bg-gradient-to-br from-blue-50 to-cyan-50', border: 'border-blue-300', text: 'text-blue-800', badge: 'border-blue-300 text-blue-800 bg-blue-100', glow: 'from-blue-400 to-cyan-400' },
  video: { bg: 'bg-gradient-to-br from-pink-50 to-purple-50', border: 'border-pink-300', text: 'text-pink-800', badge: 'border-pink-300 text-pink-800 bg-pink-100', glow: 'from-pink-400 to-purple-400' },
  script: { bg: 'bg-gradient-to-br from-indigo-50 to-purple-50', border: 'border-indigo-300', text: 'text-indigo-800', badge: 'border-indigo-300 text-indigo-800 bg-indigo-100', glow: 'from-indigo-400 to-purple-400' },
  caption: { bg: 'bg-gradient-to-br from-purple-50 to-pink-50', border: 'border-purple-300', text: 'text-purple-800', badge: 'border-purple-300 text-purple-800 bg-purple-100', glow: 'from-purple-400 to-pink-400' },
};

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
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
          <Library className="w-9 h-9 text-purple-600" />
          Campaign Library
        </h1>
        <p className="text-slate-600 mt-2 text-base">
          Manage and organize all your generated content in one place.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/80 backdrop-blur-sm p-5 rounded-2xl border-2 border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <Input 
            placeholder="Search content or campaigns..." 
            className="pl-12 py-6 text-base border-slate-300 focus:border-purple-500 focus:ring-purple-500 rounded-xl transition-all duration-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full sm:w-[200px] border-slate-300 focus:border-purple-500 focus:ring-purple-500 py-6 rounded-xl font-semibold transition-all duration-300">
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
            <SelectTrigger className="w-full sm:w-[180px] border-slate-300 focus:border-purple-500 focus:ring-purple-500">
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
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-slate-200 border-t-indigo-600"></div>
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item, index) => {
          const colors = typeColors[item.type] || typeColors.image;
          return (
            <motion.div
              key={item._id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={`bg-white border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full`}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className={`flex items-center gap-1 text-xs font-semibold ${colors.badge}`}>
                      {getTypeIcon(item.type)}
                      <span className="capitalize">{item.type}</span>
                    </Badge>
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                  <CardTitle className="text-sm font-semibold text-slate-900 line-clamp-1" title={item.campaignName}>
                    {item.campaignName}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="flex-grow pb-3">
                  {item.type === 'image' && (
                    <div className="aspect-square rounded-lg overflow-hidden bg-slate-100 relative group/image border border-slate-200">
                      <img src={item.content} alt={item.prompt} className="w-full h-full object-cover transition-transform duration-300 group-hover/image:scale-105" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center">
                        <Button variant="secondary" size="sm" className="gap-2">
                          <ExternalLink className="w-4 h-4" /> View
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {item.type === 'video' && (
                    <div className="aspect-video rounded-lg overflow-hidden bg-slate-100 relative group/video border border-slate-200">
                      <video src={item.content} className="w-full h-full object-cover" controls />
                    </div>
                  )}

                  {(item.type === 'caption' || item.type === 'script') && (
                    <div className="bg-slate-50 p-3 rounded-lg h-40 overflow-y-auto text-sm text-slate-700 whitespace-pre-wrap border border-slate-200">
                      {item.content}
                    </div>
                  )}
                  
                  {item.prompt && (
                    <div className="mt-3 bg-slate-50 p-2 rounded text-xs text-slate-600 border border-slate-200">
                      <span className="font-semibold text-slate-700">Prompt:</span> <span className="line-clamp-2">{item.prompt}</span>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="flex gap-2 pt-0">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 gap-2 border-slate-300 text-slate-700 hover:bg-slate-50"
                    onClick={() => handleDownload(item)}
                  >
                    <Download className="w-4 h-4" /> Download
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                    onClick={() => handleDelete(item._id, item.type)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </div>
      )}

      {!loading && filteredItems.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
            <Library className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">No items found</h3>
          <p className="text-slate-600 mt-1">Try adjusting your filters or search query.</p>
          <Button 
            variant="outline"
            className="mt-4 border-slate-300 text-slate-700 hover:bg-slate-50 font-medium"
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
