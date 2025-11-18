'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { initMidnightClient } from '@/lib/midnight';
import type { WalletState } from '@/lib/types';

interface WalletContextType extends WalletState {
  connect: () => Promise<void>;
  disconnect: () => void;
  walletType: 'browser-extension' | 'sdk-wallet' | 'simulation' | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<WalletState>({
    address: null,
    connected: false,
    connecting: false,
    error: null,
  });
  const [walletType, setWalletType] = useState<'browser-extension' | 'sdk-wallet' | 'simulation' | null>(null);

  const connect = async () => {
    setState(prev => ({ ...prev, connecting: true, error: null }));

    try {
      const client = initMidnightClient();
      const result = await client.connectWallet();

      setState({
        address: result.address,
        connected: true,
        connecting: false,
        error: null,
      });

      setWalletType(result.type as any);

      // Store in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('walletAddress', result.address);
        localStorage.setItem('walletType', result.type);
      }

      // Show user what type of wallet connected
      if (result.type === 'browser-extension') {
        console.log('✅ Connected to Lace Midnight wallet extension');
      } else if (result.type === 'sdk-wallet') {
        console.log('✅ Connected using Midnight SDK wallet');
      } else {
        console.log('ℹ️ Using simulation mode for demo (install Lace Midnight extension for real wallet)');
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        connecting: false,
        error: error.message || 'Failed to connect wallet',
      }));
      console.error('Wallet connection error:', error);
    }
  };

  const disconnect = () => {
    setState({
      address: null,
      connected: false,
      connecting: false,
      error: null,
    });

    setWalletType(null);

    // Remove from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('walletAddress');
      localStorage.removeItem('walletType');
    }

    console.log('Wallet disconnected');
  };

  // Auto-connect on mount if previously connected
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAddress = localStorage.getItem('walletAddress');
      const savedType = localStorage.getItem('walletType');

      if (savedAddress && savedType) {
        setState({
          address: savedAddress,
          connected: true,
          connecting: false,
          error: null,
        });
        setWalletType(savedType as any);

        console.log(`Restored ${savedType} connection: ${savedAddress.substring(0, 10)}...`);
      }
    }
  }, []);

  // Listen for wallet extension events
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).midnight) {
      const midnight = (window as any).midnight;

      // Listen for account changes
      midnight.on?.('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else if (state.connected && accounts[0] !== state.address) {
          setState(prev => ({ ...prev, address: accounts[0] }));
          if (typeof window !== 'undefined') {
            localStorage.setItem('walletAddress', accounts[0]);
          }
          console.log('Account changed:', accounts[0]);
        }
      });

      // Listen for disconnect
      midnight.on?.('disconnect', () => {
        disconnect();
        console.log('Wallet extension disconnected');
      });
    }
  }, [state.connected, state.address]);

  return (
    <WalletContext.Provider value={{ ...state, connect, disconnect, walletType }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
