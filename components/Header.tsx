'use client';

import Link from 'next/link';
import { useWallet } from '@/contexts/WalletContext';
import { shortenAddress } from '@/lib/utils';
import { Database, LogOut, User, Menu } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const { address, connected, connecting, connect, disconnect } = useWallet();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-midnight-900 text-white shadow-lg">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 text-2xl font-bold">
            <Database className="w-8 h-8 text-midnight-400" />
            <span>Datavault</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/marketplace" className="hover:text-midnight-300 transition">
              Marketplace
            </Link>
            <Link href="/creator" className="hover:text-midnight-300 transition">
              Creator Portal
            </Link>
            <Link href="/dashboard" className="hover:text-midnight-300 transition">
              Dashboard
            </Link>

            {/* Wallet Connection */}
            {connected && address ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-midnight-800 px-4 py-2 rounded-lg">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{shortenAddress(address)}</span>
                </div>
                <button
                  onClick={disconnect}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Disconnect</span>
                </button>
              </div>
            ) : (
              <button
                onClick={connect}
                disabled={connecting}
                className="px-6 py-2 bg-midnight-600 hover:bg-midnight-500 rounded-lg transition disabled:opacity-50"
              >
                {connecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-midnight-800"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-4">
            <Link
              href="/marketplace"
              className="block py-2 hover:text-midnight-300 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Marketplace
            </Link>
            <Link
              href="/creator"
              className="block py-2 hover:text-midnight-300 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Creator Portal
            </Link>
            <Link
              href="/dashboard"
              className="block py-2 hover:text-midnight-300 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>

            {connected && address ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 bg-midnight-800 px-4 py-2 rounded-lg">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{shortenAddress(address)}</span>
                </div>
                <button
                  onClick={() => {
                    disconnect();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Disconnect</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  connect();
                  setMobileMenuOpen(false);
                }}
                disabled={connecting}
                className="w-full px-6 py-2 bg-midnight-600 hover:bg-midnight-500 rounded-lg transition disabled:opacity-50"
              >
                {connecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
