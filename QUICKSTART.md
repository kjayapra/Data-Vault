# 🚀 Quickstart Guide - Datavault

Get up and running in 5 minutes!

## Prerequisites
- Node.js 18+
- Midnight Wallet installed

## Installation

```bash
# 1. Install dependencies
npm install

# 2. Install Midnight CLI
npm install -g @midnight-ntwrk/midnight-js-cli

# 3. Setup environment
cp .env.local.example .env.local

# 4. Initialize database
npm run db:init

# 5. Run development server
npm run dev
```

Open http://localhost:3000 and you're ready! 🎉

## For Hackathon Demo

```bash
# Compile contracts
npm run compile:contracts

# Deploy to Midnight testnet
npm run deploy:testnet

# Copy contract address to .env.local
```

That's it! The app is now connected to Midnight Network.

## Test the Flow

1. **Connect Wallet** - Click "Connect Wallet" in header
2. **Upload Content** - Go to Creator Portal, upload a file
3. **Browse** - Go to Marketplace, see your content
4. **Purchase** - Buy a license (use a different wallet)
5. **Access** - Go to Dashboard, download the file

All transactions happen privately on Midnight Network with ZK proofs! 🌙

## Need Help?

See [SETUP.md](./SETUP.md) for detailed instructions.
