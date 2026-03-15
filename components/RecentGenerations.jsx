'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Trash2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function RecentGenerations({ type = 'captions', campaignId }) {
  const [generations, setGenerations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGenerations();
  }, [type, campaignId]);

  const fetchGenerations = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (campaignId) query.append('campaignId', campaignId);
      
      const response = await fetch(`/api/${type}?limit=5&${query.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setGenerations(Array.isArray(data) ? data : data.data || []);
      }
    } catch (error) {
      console.error('Error fetching generations:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const deleteGeneration = async (id) => {
    if (!confirm('Delete this item?')) return;
    
    try {
      const response = await fetch(`/api/${type}/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setGenerations(generations.filter(g => g._id !== id));
      }
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  if (loading) {
    return (
      <Card className="dark:border-gray-700 dark:bg-slate-800">
        <CardHeader>
          <CardTitle>Recent Generations</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6">
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (generations.length === 0) {
    return (
      <Card className="dark:border-gray-700 dark:bg-slate-800">
        <CardHeader>
          <CardTitle>Recent Generations</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6">
          <p className="text-gray-500 dark:text-gray-400">No generations yet. Create your first one!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="dark:border-gray-700 dark:bg-slate-800">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Recent Generations</CardTitle>
            <CardDescription>Your latest {type}</CardDescription>
          </div>
          <Button
            onClick={fetchGenerations}
            variant="ghost"
            size="icon"
            className="dark:hover:bg-slate-700"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {generations.map((item, index) => (
          <div
            key={item._id || index}
            className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
                  {item.content || item.caption || item.script || item.text || 'Generated content'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <Button
                  onClick={() => copyToClipboard(item.content || item.caption || item.script || item.text)}
                  variant="ghost"
                  size="sm"
                  className="dark:hover:bg-slate-600"
                  title="Copy"
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => deleteGeneration(item._id)}
                  variant="ghost"
                  size="sm"
                  className="dark:hover:bg-slate-600 text-red-500 hover:text-red-700"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
