'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import Header from '@/components/Header';
import { Package, TrendingUp, Download } from 'lucide-react';
import type { License } from '@/lib/types';

export default function DashboardPage() {
  const { address, connected } = useWallet();
  const [licenses, setLicenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (connected && address) {
      fetchLicenses();
    }
  }, [connected, address]);

  async function fetchLicenses() {
    try {
      const response = await fetch(`/api/licenses/${address}`);
      const data = await response.json();

      if (data.success) {
        setLicenses(data.data);
      }
    } catch (error) {
      console.error('Error fetching licenses:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAccess(licenseId: string) {
    try {
      const response = await fetch('/api/content/access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          licenseId,
          walletAddress: address,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Download file
        const link = document.createElement('a');
        link.href = data.data.fileData;
        link.download = data.data.fileName;
        link.click();

        alert('Content accessed successfully!');
        fetchLicenses(); // Refresh to show updated usage count
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error accessing content:', error);
      alert('Failed to access content');
    }
  }

  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-midnight-950 via-midnight-900 to-midnight-800">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
          <p className="text-xl text-midnight-200 mb-8">
            Please connect your wallet to view your licenses
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
          <h1 className="text-4xl font-bold text-white mb-4">Dashboard</h1>
          <p className="text-midnight-200">View and manage your purchased licenses</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<Package className="w-8 h-8" />}
            label="Active Licenses"
            value={licenses.filter(l => l.active).length}
          />
          <StatCard
            icon={<TrendingUp className="w-8 h-8" />}
            label="Total Uses"
            value={licenses.reduce((sum, l) => sum + (l.usage_count || 0), 0)}
          />
          <StatCard
            icon={<Download className="w-8 h-8" />}
            label="Content Items"
            value={licenses.length}
          />
        </div>

        {/* Licenses List */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Your Licenses</h2>

          {loading ? (
            <div className="text-center py-8 text-midnight-300">Loading...</div>
          ) : licenses.length === 0 ? (
            <div className="text-center py-8 text-midnight-300">
              <p className="text-xl">No licenses yet</p>
              <p className="mt-2">Browse the marketplace to purchase content</p>
            </div>
          ) : (
            <div className="space-y-4">
              {licenses.map((license) => (
                <div key={license.license_id} className="bg-midnight-800/50 rounded-lg p-6 border border-midnight-700">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{license.title}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-midnight-300">Type:</span>
                          <span className="text-white ml-2">{license.content_type}</span>
                        </div>
                        <div>
                          <span className="text-midnight-300">Price:</span>
                          <span className="text-white ml-2">${license.price_per_use}</span>
                        </div>
                        <div>
                          <span className="text-midnight-300">Uses:</span>
                          <span className="text-white ml-2">{license.usage_count || 0}</span>
                        </div>
                        <div>
                          <span className="text-midnight-300">Status:</span>
                          <span className={`ml-2 ${license.active ? 'text-green-400' : 'text-red-400'}`}>
                            {license.active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAccess(license.license_id)}
                      disabled={!license.active}
                      className="ml-4 px-6 py-2 bg-midnight-600 hover:bg-midnight-500 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      <span>Access</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-midnight-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-midnight-300 text-sm mb-1">{label}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        <div className="text-midnight-400">{icon}</div>
      </div>
    </div>
  );
}
