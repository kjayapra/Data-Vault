'use client';

import { useState } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import Header from '@/components/Header';
import { Upload, DollarSign, FileText } from 'lucide-react';

export default function CreatorPage() {
  const { address, connected } = useWallet();
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    contentType: 'image',
    pricePerUse: '',
    tags: '',
    file: null as File | null,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!connected || !address) {
      alert('Please connect your wallet first');
      return;
    }

    if (!formData.file) {
      alert('Please select a file');
      return;
    }

    setUploading(true);

    try {
      const data = new FormData();
      data.append('file', formData.file);
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('contentType', formData.contentType);
      data.append('pricePerUse', formData.pricePerUse);
      data.append('tags', formData.tags);
      data.append('walletAddress', address);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();

      if (result.success) {
        alert('Content uploaded and registered successfully!');
        setFormData({
          title: '',
          description: '',
          contentType: 'image',
          pricePerUse: '',
          tags: '',
          file: null,
        });
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error uploading content:', error);
      alert('Failed to upload content');
    } finally {
      setUploading(false);
    }
  }

  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-midnight-950 via-midnight-900 to-midnight-800">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Creator Portal</h1>
          <p className="text-xl text-midnight-200 mb-8">
            Please connect your wallet to upload content
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight-950 via-midnight-900 to-midnight-800">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Creator Portal</h1>
          <p className="text-midnight-200">Upload and monetize your AI training data</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upload Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Upload className="w-6 h-6" />
                Upload Content
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* File Upload */}
                <div>
                  <label className="block text-midnight-200 mb-2">File</label>
                  <input
                    type="file"
                    onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                    className="w-full px-4 py-3 bg-midnight-800 text-white rounded-lg border border-midnight-700 focus:border-midnight-500 focus:outline-none"
                    required
                  />
                </div>

                {/* Title */}
                <div>
                  <label className="block text-midnight-200 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-midnight-800 text-white rounded-lg border border-midnight-700 focus:border-midnight-500 focus:outline-none"
                    placeholder="Enter content title"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-midnight-200 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-midnight-800 text-white rounded-lg border border-midnight-700 focus:border-midnight-500 focus:outline-none"
                    placeholder="Describe your content"
                    rows={4}
                  />
                </div>

                {/* Content Type */}
                <div>
                  <label className="block text-midnight-200 mb-2">Content Type</label>
                  <select
                    value={formData.contentType}
                    onChange={(e) => setFormData({ ...formData, contentType: e.target.value })}
                    className="w-full px-4 py-3 bg-midnight-800 text-white rounded-lg border border-midnight-700 focus:border-midnight-500 focus:outline-none"
                  >
                    <option value="image">Image</option>
                    <option value="text">Text</option>
                    <option value="dataset">Dataset</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-midnight-200 mb-2">Price per Use (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={formData.pricePerUse}
                    onChange={(e) => setFormData({ ...formData, pricePerUse: e.target.value })}
                    className="w-full px-4 py-3 bg-midnight-800 text-white rounded-lg border border-midnight-700 focus:border-midnight-500 focus:outline-none"
                    placeholder="0.50"
                    required
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-midnight-200 mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-4 py-3 bg-midnight-800 text-white rounded-lg border border-midnight-700 focus:border-midnight-500 focus:outline-none"
                    placeholder="nature, photography, landscape"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full px-6 py-3 bg-midnight-600 hover:bg-midnight-500 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Uploading...' : 'Upload & Register'}
                </button>
              </form>
            </div>
          </div>

          {/* Info Cards */}
          <div className="space-y-6">
            <InfoCard
              icon={<DollarSign className="w-8 h-8" />}
              title="Earn Per Use"
              description="Set your price and earn every time AI companies access your content"
            />
            <InfoCard
              icon={<FileText className="w-8 h-8" />}
              title="Privacy Built-in"
              description="Your earnings and usage stats are tracked privately on Midnight Network"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function InfoCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-midnight-700">
      <div className="text-midnight-300 mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-midnight-200">{description}</p>
    </div>
  );
}
