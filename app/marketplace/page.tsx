'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import ContentCard from '@/components/ContentCard';
import { Search, Filter } from 'lucide-react';
import type { Content } from '@/lib/types';

export default function MarketplacePage() {
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [contentType, setContentType] = useState('');

  useEffect(() => {
    fetchContent();
  }, []);

  async function fetchContent() {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('query', searchQuery);
      if (contentType) params.append('type', contentType);

      const response = await fetch(`/api/content?${params}`);
      const data = await response.json();

      if (data.success) {
        setContent(data.data);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch() {
    setLoading(true);
    fetchContent();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight-950 via-midnight-900 to-midnight-800">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Content Marketplace</h1>
          <p className="text-midnight-200">Browse and license AI training data with privacy built-in</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-midnight-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-3 bg-midnight-800 text-white rounded-lg border border-midnight-700 focus:border-midnight-500 focus:outline-none"
              />
            </div>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="px-4 py-3 bg-midnight-800 text-white rounded-lg border border-midnight-700 focus:border-midnight-500 focus:outline-none"
            >
              <option value="">All Types</option>
              <option value="image">Images</option>
              <option value="text">Text</option>
              <option value="dataset">Datasets</option>
              <option value="other">Other</option>
            </select>
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-midnight-600 hover:bg-midnight-500 text-white rounded-lg transition flex items-center gap-2"
            >
              <Filter className="w-5 h-5" />
              <span>Search</span>
            </button>
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 h-64 animate-shimmer" />
            ))}
          </div>
        ) : content.length === 0 ? (
          <div className="text-center py-12 text-midnight-300">
            <p className="text-xl">No content found</p>
            <p className="mt-2">Try adjusting your search filters</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.map((item) => (
              <ContentCard key={item.content_id} content={item} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
