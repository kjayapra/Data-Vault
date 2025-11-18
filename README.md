# Datavault - Privacy-Preserving AI Training Data Marketplace

> **Hackathon Project**: 3-day MVP for AI training data licensing with privacy

A blockchain-based marketplace where content creators monetize their data for AI training with verifiable usage tracking and automated payments—while maintaining privacy for both parties.

---

## 🎯 The Problem

- AI companies train on creators' content without proper licensing
- Creators can't verify if/how their content is being used
- Current solutions expose sensitive info: who accessed what, when, training pipeline details
- No automated way to prove compliance without revealing private data

## 💡 Our Solution

**Datavault** is a two-sided marketplace with privacy built-in:

1. **Creators** upload content and set per-use pricing
2. **AI Companies** browse, purchase licenses, access via API
3. **Smart contracts** log usage with hash-based proofs and auto-release payments
4. **Both parties** maintain privacy while proving compliance

---

## ✨ Key Features (MVP)

- ✅ **Blockchain Registry**: Content registered with cryptographic hashes
- ✅ **Smart Licensing**: Per-use pricing with automated escrow
- ✅ **Usage Tracking**: On-chain logs without exposing accessor identity
- ✅ **Automated Payments**: Micropayments released per usage
- ✅ **Privacy Proofs**: Hash-based commitments (upgradeable to ZK-SNARKs)
- ✅ **Two-Sided Platform**: Separate interfaces for creators and AI companies

---

## 🏗️ Architecture (Simplified for Hackathon)

```
┌─────────────────────────────────────────────┐
│      Frontend (Next.js + Tailwind)          │
│  ┌─────────────┐  ┌──────────────────┐    │
│  │ Creator UI  │  │ AI Company UI    │    │
│  └─────────────┘  └──────────────────┘    │
└─────────────────────────────────────────────┘
         ↓                         ↓
┌─────────────────────────────────────────────┐
│       Next.js API Routes                    │
│  /api/upload  /api/purchase  /api/access   │
└─────────────────────────────────────────────┘
         ↓                         ↓
┌──────────────┐           ┌──────────────────┐
│  SQLite DB   │           │ Smart Contract   │
│  (metadata)  │           │   (Solidity)     │
└──────────────┘           └──────────────────┘
```

**Key Decision**: All-in-one Next.js app for rapid development ✅

---

## 🛠️ Tech Stack

### Hackathon MVP (Midnight Network)
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Wallet Integration**: Midnight Wallet integration
- **Smart Contracts**: Compact (Midnight's smart contract language)
- **Blockchain**: Midnight Network Testnet
- **Database**: SQLite (zero setup)
- **Storage**: Local files (hashes on-chain)
- **ZK Proofs**: Midnight's native privacy features
- **Deploy**: Vercel (frontend) + Midnight Testnet (contracts)

### Future Production
- Enhanced ZK proofs using Midnight's advanced features
- IPFS for decentralized storage
- PostgreSQL for analytics
- Midnight Network Mainnet deployment
- See [FUTURE_ENHANCEMENTS.md](./docs/FUTURE_ENHANCEMENTS.md)

---

## 🚀 Quick Start

### Prerequisites

```bash
node >= 18.0.0
npm >= 9.0.0
Midnight Network wallet
Midnight testnet tokens (from faucet)
Midnight CLI tools
```

### Installation (5 minutes)

```bash
# Clone and setup
git clone <repo-url>
cd privacy-ai-marketplace

# Install dependencies
npm install

# Setup Midnight development environment
npm install -g @midnight-ntwrk/midnight-js-cli

# Compile Compact contracts
midnight-js-cli compile contracts/

# Deploy contract to Midnight testnet
midnight-js-cli deploy --network testnet

# Run frontend
npm run dev

# Open http://localhost:3000
```

### Deployment

```bash
# Deploy frontend to Vercel (production)
vercel --prod

# Deploy contract to Midnight testnet
midnight-js-cli deploy --network testnet

# Deploy contract to Midnight mainnet (production)
midnight-js-cli deploy --network mainnet
```

---

## 📁 Project Structure

```
privacy-ai-marketplace/
├── app/                    # Next.js 14 app directory
│   ├── page.tsx            # Landing page
│   ├── creator/            # Creator dashboard
│   ├── marketplace/        # Browse content
│   ├── dashboard/          # AI company view
│   └── api/                # API routes
│       ├── upload/         # Handle file uploads
│       ├── purchase/       # License purchases
│       └── access/         # Content access
├── contracts/              # Compact smart contracts (Midnight)
│   ├── Datavault.compact   # Main marketplace contract
│   └── test/               # Contract tests
├── components/             # React components
│   ├── ConnectButton.tsx
│   ├── ContentCard.tsx
│   └── Stats.tsx
├── lib/                    # Utilities
│   ├── db.ts               # SQLite setup
│   └── contracts.ts        # Web3 helpers
└── docs/                   # Documentation
    ├── DESIGN.md           # System design
    ├── HACKATHON_SIMPLIFIED_PLAN.md  # 3-day plan
    └── FUTURE_ENHANCEMENTS.md        # Post-hackathon
```

---

## 🎬 Demo Flow (5 minutes)

### Creator Journey
1. Connect MetaMask wallet
2. Upload content (image/text)
3. Set price: $0.50 per use
4. Transaction confirms → Content registered on-chain
5. View dashboard → See earnings after usage

### AI Company Journey
1. Browse marketplace
2. Purchase license for content
3. Access via API: `POST /api/content/{id}/access`
4. Usage logged automatically with proof
5. View dashboard → Track usage and costs

### What's On-Chain (Public)
- ✅ Content hash (SHA-256)
- ✅ License terms
- ✅ Usage count
- ✅ Payment amounts

### What's Hidden (Private)
- ❌ Accessor identity (who accessed)
- ❌ Exact timestamps
- ❌ File contents
- ❌ API call details

---

## 📝 Smart Contract (Compact - Midnight Network)

```typescript
// Datavault.compact - One unified contract for Midnight Network
contract DatavaultMarketplace {

    // Private state (encrypted on Midnight)
    private state {
        contentRegistry: Map<Bytes32, Content>;
        licenses: Map<Bytes32, License>;
        creatorEarnings: Map<Address, UInt256>;
    }

    // Public state
    public state {
        totalContents: UInt256;
        totalLicenses: UInt256;
    }

    struct Content {
        creator: Address;
        contentHash: Bytes32;
        pricePerUse: UInt256;
        totalUses: UInt256;
        active: Boolean;
    }

    struct License {
        licensee: Address;
        contentId: Bytes32;
        usageCount: UInt256;
        purchaseTime: UInt256;
    }

    // Register content with privacy
    @public
    function registerContent(contentHash: Bytes32, pricePerUse: UInt256): Bytes32 {
        // Implementation with ZK proofs
    }

    // Purchase license (privacy-preserving)
    @public
    function purchaseLicense(contentId: Bytes32): Bytes32 {
        // Implementation with shielded transactions
    }

    // Access content with usage proof
    @private
    function accessContent(licenseId: Bytes32, usageProof: Bytes32): void {
        // ZK proof verification built-in
    }

    // Withdraw earnings
    @public
    function withdrawEarnings(): void {
        // Implementation
    }
}
```

See full contract: [contracts/Datavault.compact](./contracts/Datavault.compact)

---

## 🔑 API Endpoints

### Creator APIs
```
POST   /api/upload          # Upload content
GET    /api/creator/stats   # View earnings
```

### AI Company APIs
```
GET    /api/marketplace     # Browse content
POST   /api/purchase        # Buy license
POST   /api/access          # Access content
```

### Public APIs
```
GET    /api/content/{id}    # Content metadata
```

---

## 📅 3-Day Development Plan

### Day 1: Foundation (0-24h)
**Goal**: Smart contract + basic UI working

- ✅ Setup Next.js + Hardhat
- ✅ Write & deploy smart contract
- ✅ Creator upload page
- ✅ Marketplace browse page
- ✅ Test: Upload content end-to-end

### Day 2: Core Loop (24-48h)
**Goal**: Complete purchase → access → payment flow

- ✅ License purchase UI + contract call
- ✅ Content access API with usage logging
- ✅ Creator & AI Company dashboards
- ✅ Test: Full flow with 2 accounts

### Day 3: Demo Prep (48-72h)
**Goal**: Polish + presentation

- ✅ Bug fixes & UI polish
- ✅ Create demo accounts & sample data
- ✅ Presentation deck (5 slides)
- ✅ Practice demo (3 times)
- ✅ Deploy to Vercel

**See detailed plan**: [HACKATHON_SIMPLIFIED_PLAN.md](./docs/HACKATHON_SIMPLIFIED_PLAN.md)

---

## 🧪 Testing

```bash
# Compile Compact contracts
midnight-js-cli compile contracts/

# Test smart contracts
midnight-js-cli test

# Deploy to local Midnight node (for testing)
midnight-js-cli node start
midnight-js-cli deploy --network local

# Frontend (development)
npm run dev

# Build for production
npm run build
npm start
```

---

## 👥 Team

**Team**: Darker Skies
**Track**: AI
**Hackathon**: [Hackathon Name]

- **Karthika Jayaprakash** - Backend/Smart Contracts
- **Darshan Bhanushali** - AI/Backend/Privacy Layer
- **[Frontend Dev]** - Frontend/UI

---

## 🎯 Success Criteria

### Must Have (Demo Ready)
- [ ] Compact contract deployed to Midnight testnet
- [ ] Creator can upload content
- [ ] AI company can purchase license
- [ ] AI company can access content
- [ ] Usage logged on-chain with ZK proof (Midnight native)
- [ ] Payment auto-released to creator using shielded transactions
- [ ] Working demo start-to-finish on Midnight Network

### Nice to Have
- [ ] Polished UI
- [ ] Multiple content items
- [ ] Mobile responsive
- [ ] Backup demo video

---

## 🔮 Future Enhancements

**Post-Hackathon Roadmap:**

### Phase 1: Production (1 month)
- Full ZK-SNARK proofs (circom circuits)
- IPFS integration
- Midnight Network deployment
- Security audit

### Phase 2: Features (2-3 months)
- Subscription licenses
- SDK (Python, JavaScript)
- Advanced analytics
- Dispute resolution

### Phase 3: Scale (6-12 months)
- Multi-chain support
- Enterprise features
- Mobile apps
- Token economics

See full roadmap: [FUTURE_ENHANCEMENTS.md](./docs/FUTURE_ENHANCEMENTS.md)

---

## 🏆 Why This Will Win

### Innovation (40%)
- ✅ First privacy-preserving AI training data marketplace
- ✅ Novel use of blockchain for content licensing
- ✅ Solves real problem (AI lawsuits, creator rights)

### Technical Excellence (30%)
- ✅ Clean smart contract design
- ✅ Privacy mechanism (upgradeable to full ZK)
- ✅ Working end-to-end demo

### Feasibility (20%)
- ✅ Realistic scope for hackathon
- ✅ Clear path to production
- ✅ Market exists ($X billion AI training data industry)

### Presentation (10%)
- ✅ Clear problem statement
- ✅ Live working demo
- ✅ Strong storytelling

---

## 📚 Documentation

- [System Design](./docs/DESIGN.md) - Full architecture
- [Simplified Plan](./docs/HACKATHON_SIMPLIFIED_PLAN.md) - 3-day roadmap
- [User Stories](./docs/USER_STORIES.md) - Requirements
- [API Spec](./docs/API_SPECIFICATION.md) - API documentation
- [Data Flows](./docs/DATA_FLOWS.md) - Flow diagrams
- [Future Plans](./docs/FUTURE_ENHANCEMENTS.md) - Post-hackathon

---

## 🐛 Known Limitations (MVP)

- **Privacy**: Using Midnight's built-in ZK features (can be enhanced further)
- **Storage**: Local files (IPFS integration post-hackathon)
- **Licenses**: Per-use only (no subscriptions yet)
- **Analytics**: Basic stats (no charts yet)
- **Scale**: Demo-ready on Midnight testnet, production requires mainnet

**All will be addressed post-hackathon!**

---

## 🤝 Contributing

This is a hackathon project. Post-hackathon contributions welcome!

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) file

---

## 🙏 Acknowledgments

- **Midnight Network** for privacy-preserving blockchain infrastructure and ZK technology
- **Midnight Foundation** for developer tools and documentation
- **Vercel** for frontend hosting platform
- **The Midnight Community** for support and guidance

---

## 📞 Contact

**Discord**:
- Karthika: @cute_pomelo_20755
- Darshan: @darshb34

**GitHub**: [Repository Link]

---

## 🚦 Getting Started Checklist

**Before hackathon:**
- [ ] All team members have Node.js 18+ installed
- [ ] Midnight Wallet setup and testnet tokens obtained
- [ ] Midnight CLI tools installed
- [ ] Repository cloned and dependencies installed
- [ ] Test local Midnight node works
- [ ] Agreed on tech stack and roles

**Day 1 morning:**
- [ ] Deploy Compact contract to Midnight testnet
- [ ] Basic Next.js app running with Midnight wallet integration
- [ ] Database schema created

**Ready to build on Midnight! 🚀**

---

**Let's make AI training data licensing private, provable, and fair.**
