'use client';

import { useState } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { formatCurrency, formatDate, fromWei } from '@/lib/utils';
import { ShoppingCart, FileText, Image as ImageIcon, Database as DatabaseIcon, CheckCircle } from 'lucide-react';
import type { Content } from '@/lib/types';

interface ContentCardProps {
  content: Content;
}

export default function ContentCard({ content }: ContentCardProps) {
  const { address, connected } = useWallet();
  const [purchasing, setPurchasing] = useState(false);
  const [purchased, setPurchased] = useState(false);

  const getIcon = () => {
    switch (content.content_type) {
      case 'image':
        return <ImageIcon className="w-6 h-6" />;
      case 'text':
        return <FileText className="w-6 h-6" />;
      case 'dataset':
        return <DatabaseIcon className="w-6 h-6" />;
      default:
        return <FileText className="w-6 h-6" />;
    }
  };

  async function handlePurchase() {
    if (!connected || !address) {
      alert('Please connect your wallet first');
      return;
    }

    setPurchasing(true);

    try {
      const response = await fetch('/api/license/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentId: content.content_id,
          walletAddress: address,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPurchased(true);
        alert('License purchased successfully!');
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error purchasing license:', error);
      alert('Failed to purchase license');
    } finally {
      setPurchasing(false);
    }
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/20 transition border border-midnight-700">
      <div className="flex items-start justify-between mb-4">
        <div className="text-midnight-300">{getIcon()}</div>
        <span className="text-xs px-2 py-1 bg-midnight-800 text-midnight-300 rounded">
          {content.content_type}
        </span>
      </div>

      <h3 className="text-xl font-bold text-white mb-2">{content.title}</h3>

      {content.description && (
        <p className="text-midnight-200 text-sm mb-4 line-clamp-2">
          {content.description}
        </p>
      )}

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-midnight-300">Price per use:</span>
          <span className="text-white font-semibold">
            ${fromWei(content.price_per_use)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-midnight-300">Total uses:</span>
          <span className="text-white">{content.totalUses || 0}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-midnight-300">Created:</span>
          <span className="text-white">{formatDate(content.created_at)}</span>
        </div>
      </div>

      {content.tags && (
        <div className="flex flex-wrap gap-2 mb-4">
          {content.tags.split(',').slice(0, 3).map((tag, i) => (
            <span key={i} className="text-xs px-2 py-1 bg-midnight-800/50 text-midnight-300 rounded">
              {tag.trim()}
            </span>
          ))}
        </div>
      )}

      <button
        onClick={handlePurchase}
        disabled={purchasing || purchased || !content.active}
        className="w-full px-4 py-2 bg-midnight-600 hover:bg-midnight-500 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {purchased ? (
          <>
            <CheckCircle className="w-5 h-5" />
            <span>Purchased</span>
          </>
        ) : (
          <>
            <ShoppingCart className="w-5 h-5" />
            <span>{purchasing ? 'Purchasing...' : 'Purchase License'}</span>
          </>
        )}
      </button>
    </div>
  );
}
