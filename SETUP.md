# Datavault Setup Guide

Complete setup instructions for the Datavault marketplace application.

## Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Midnight Wallet** installed
- **Midnight testnet tokens** (get from faucet)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd privacy-ai-marketplace
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Install Midnight CLI (Global)

```bash
npm install -g @midnight-ntwrk/midnight-js-cli
```

### 4. Environment Setup

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and configure:

```env
NEXT_PUBLIC_MIDNIGHT_NETWORK=testnet
NEXT_PUBLIC_CONTRACT_ADDRESS=<your-deployed-contract-address>
DATABASE_PATH=./data/datavault.db
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Initialize Database

```bash
npm run db:init
```

This creates the SQLite database with the required schema.

### 6. Compile Smart Contracts

```bash
npm run compile:contracts
```

This compiles the Compact smart contract for Midnight Network.

### 7. Deploy Contracts

**For local development:**

```bash
# Terminal 1: Start local Midnight node
npm run node:start

# Terminal 2: Deploy to local node
npm run deploy:local
```

**For testnet:**

```bash
npm run deploy:testnet
```

Copy the deployed contract address and update `.env.local`.

### 8. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
privacy-ai-marketplace/
├── app/                    # Next.js 14 app directory
│   ├── api/                # API routes
│   ├── creator/            # Creator portal page
│   ├── dashboard/          # User dashboard page
│   ├── marketplace/        # Marketplace page
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── components/             # React components
│   ├── Header.tsx
│   └── ContentCard.tsx
├── contexts/               # React contexts
│   └── WalletContext.tsx
├── contracts/              # Compact smart contracts
│   └── Datavault.compact
├── lib/                    # Utilities and helpers
│   ├── db.ts               # Database operations
│   ├── midnight.ts         # Midnight Network integration
│   ├── types.ts            # TypeScript types
│   └── utils.ts            # Utility functions
├── scripts/                # Deployment and utility scripts
│   └── init-db.js
├── data/                   # SQLite database (gitignored)
├── uploads/                # Uploaded files (gitignored)
└── docs/                   # Documentation
```

## Usage

### For Content Creators

1. **Connect Wallet**: Click "Connect Wallet" in the header
2. **Upload Content**: Go to Creator Portal
3. **Fill Form**: Add title, description, price, and upload file
4. **Submit**: Content is registered on Midnight blockchain
5. **Monitor**: View earnings in your dashboard

### For AI Companies

1. **Connect Wallet**: Click "Connect Wallet" in the header
2. **Browse**: Go to Marketplace
3. **Purchase License**: Click "Purchase License" on any content
4. **Access Content**: Go to Dashboard and click "Access" on your licenses
5. **Download**: File downloads automatically with usage logged on-chain

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Compile Compact contracts
npm run compile:contracts

# Deploy to local Midnight node
npm run deploy:local

# Deploy to Midnight testnet
npm run deploy:testnet

# Start local Midnight node
npm run node:start

# Initialize database
npm run db:init
```

## Troubleshooting

### Database Issues

If you encounter database errors, try:

```bash
rm -rf data/datavault.db
npm run db:init
```

### Contract Deployment Issues

Ensure you have:
- Midnight CLI installed globally
- Testnet tokens in your wallet
- Correct network configuration in `.env.local`

### Wallet Connection Issues

- Ensure Midnight wallet extension is installed
- Check that you're on the correct network (testnet)
- Try disconnecting and reconnecting

## Production Deployment

### Frontend (Vercel)

```bash
vercel --prod
```

### Smart Contracts (Midnight Mainnet)

```bash
midnight-js-cli deploy --network mainnet
```

Update `.env.local` with mainnet contract address.

## Next Steps

1. ✅ Complete setup
2. ✅ Test locally
3. ✅ Deploy to testnet
4. ✅ Test end-to-end flow
5. ✅ Prepare demo
6. 🚀 Deploy to production

## Support

For issues or questions:
- Check documentation in `/docs`
- Review Midnight Network docs
- Open an issue on GitHub

---

Built with ❤️ on Midnight Network
