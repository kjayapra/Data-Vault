# Simplified Hackathon Plan - 3 People, 72 Hours

## Reality Check

**Team**: 3 developers (Backend/Smart Contract, AI/Backend, Frontend)
**Goal**: Working demo that shows the core innovation
**Constraint**: Must be deployable and actually work

---

## What We're CUTTING

### ❌ Too Complex for Hackathon

1. **Custom ZK-SNARK circuits**
   - Writing circom circuits from scratch takes weeks
   - Proof generation might be too slow
   - **Replace with**: Midnight's built-in ZK proof features (native privacy)

2. **IPFS integration**
   - Setting up IPFS nodes is finicky
   - Gateway reliability issues during demo
   - **Replace with**: Simple file storage (local or S3), store hashes on-chain

3. **Complex smart contracts**
   - Multiple interacting contracts is hard to debug
   - **Replace with**: One unified contract with core functions

4. **Complex deployment setup**
   - Focus on getting Midnight testnet working
   - Have local Midnight node as fallback
   - **Replace with**: Use Midnight testnet with local node backup for demo

5. **Advanced analytics and dashboards**
   - Charts and graphs take time
   - **Replace with**: Simple tables showing key numbers

6. **API keys and authentication**
   - OAuth flows are complex
   - **Replace with**: Simple wallet-based auth only

---

## What We're KEEPING (Core Innovation)

### ✅ Must-Have to Show Value

1. **Compact smart contract** - Simple but working on Midnight
2. **Privacy mechanism** - Midnight's native ZK proofs (built-in!)
3. **Two-sided marketplace** - Creator uploads, AI company accesses
4. **Usage tracking** - On-chain logs with privacy
5. **Automated payments** - Shielded transactions on Midnight
6. **Working frontend** - Functional UI with Midnight wallet integration

---

## Simplified Tech Stack

### Frontend (1 person)
```
- Next.js (easier than separate React + API)
- Tailwind CSS (fast styling)
- Midnight wallet integration (@midnight-ntwrk/wallet-api)
- Deploy: Vercel (one-click deploy)
```

### Backend (merged with frontend)
```
- Next.js API routes (no separate backend server)
- File upload: Next.js API + local storage
- Database: SQLite (no setup)
- Midnight SDK for contract interactions
```

### Smart Contracts (1 person)
```
- Compact (Midnight's smart contract language)
- Midnight CLI for development and testing
- Deploy: Midnight Network Testnet
- One unified contract (not 4 separate ones)
- Native ZK proofs built into Midnight!
```

### "Privacy" Layer (1 person)
```
Using Midnight's built-in features:
- Private state in Compact contracts
- Shielded transactions (built-in)
- ZK proof generation (native to Midnight)
- On-chain: only what needs to be public
```

---

## Simplified Architecture

```
┌─────────────────────────────────────────────┐
│           Frontend (Next.js)                │
│  ┌─────────────┐  ┌──────────────────┐    │
│  │ Creator UI  │  │ AI Company UI    │    │
│  └─────────────┘  └──────────────────┘    │
└─────────────────────────────────────────────┘
              ↓                   ↓
┌─────────────────────────────────────────────┐
│        Next.js API Routes                   │
│  /api/upload  /api/purchase  /api/access   │
└─────────────────────────────────────────────┘
         ↓                            ↓
┌──────────────┐              ┌──────────────┐
│   Database   │              │Smart Contract│
│  (SQLite)    │              │  (Compact)   │
│              │              │              │
│ - metadata   │              │ - content    │
│ - files      │              │   registry   │
│              │              │ - licenses   │
│              │              │ - payments   │
└──────────────┘              │ - ZK proofs  │
                              └──────────────┘
                              (Midnight Network)
```

**Key simplification**: Everything in one Next.js app, Compact contract on Midnight!

---

## Simplified Smart Contract (Compact)

### One Contract to Rule Them All - On Midnight Network

```typescript
// Datavault.compact - Midnight Network Smart Contract
contract DatavaultMarketplace {

    // Private state (encrypted on Midnight - not visible publicly)
    private state {
        contents: Map<Bytes32, Content>;
        licenses: Map<Bytes32, License>;
        creatorEarnings: Map<Address, UInt256>;
    }

    // Public state (visible to all)
    public state {
        totalContents: UInt256;
        totalLicenses: UInt256;
        totalRevenue: UInt256;
    }

    struct Content {
        creator: Address;
        contentHash: Bytes32;  // SHA-256 of content
        pricePerUse: UInt256;
        totalUses: UInt256;
        active: Boolean;
    }

    struct License {
        licensee: Address;  // Private by default
        contentId: Bytes32;
        usageCount: UInt256;
        purchaseTime: UInt256;
    }

    // Events (public)
    event ContentRegistered(contentId: Bytes32, creator: Address, price: UInt256);
    event LicensePurchased(licenseId: Bytes32, contentId: Bytes32);  // licensee hidden
    event ContentAccessed(contentId: Bytes32);  // details hidden via ZK proof
    event PaymentReleased(creator: Address, amount: UInt256);

    // Creator registers content (public function)
    @public
    function registerContent(
        contentHash: Bytes32,
        pricePerUse: UInt256
    ): Bytes32 {
        let contentId = hash(contentHash, caller, currentTime);

        this.contents[contentId] = Content {
            creator: caller,
            contentHash: contentHash,
            pricePerUse: pricePerUse,
            totalUses: 0,
            active: true
        };

        this.totalContents += 1;
        emit ContentRegistered(contentId, caller, pricePerUse);
        return contentId;
    }

    // AI company purchases license (shielded transaction)
    @public
    @payable
    function purchaseLicense(contentId: Bytes32): Bytes32 {
        let content = this.contents[contentId];
        require(content.active, "Content not active");
        require(msg.value >= content.pricePerUse, "Insufficient payment");

        let licenseId = hash(contentId, caller, currentTime);

        // License details kept private
        this.licenses[licenseId] = License {
            licensee: caller,  // Private!
            contentId: contentId,
            usageCount: 0,
            purchaseTime: currentTime
        };

        this.totalLicenses += 1;
        // Note: licensee not revealed in event (privacy!)
        emit LicensePurchased(licenseId, contentId);
        return licenseId;
    }

    // AI company accesses content (private function with ZK proof!)
    @private
    @zkProof  // Midnight's built-in ZK proof verification
    function accessContent(
        licenseId: Bytes32,
        usageProof: ZKProof  // ZK proof generated by Midnight SDK
    ): void {
        let license = this.licenses[licenseId];
        require(license.licensee == caller, "Not license owner");

        let content = this.contents[license.contentId];

        // Increment usage (kept private)
        license.usageCount += 1;
        content.totalUses += 1;

        // Release payment to creator via shielded transaction
        this.creatorEarnings[content.creator] += content.pricePerUse;
        this.totalRevenue += content.pricePerUse;

        // Event doesn't reveal who accessed or when (ZK proof!)
        emit ContentAccessed(license.contentId);
        emit PaymentReleased(content.creator, content.pricePerUse);
    }

    // Creator withdraws earnings (shielded transaction)
    @public
    function withdrawEarnings(): void {
        let amount = this.creatorEarnings[caller];
        require(amount > 0, "No earnings");

        this.creatorEarnings[caller] = 0;
        transfer(caller, amount);  // Shielded transfer on Midnight
    }

    // View functions (public)
    @public
    @view
    function getContent(contentId: Bytes32): Content {
        return this.contents[contentId];
    }

    // Get aggregated stats (not individual license details - privacy!)
    @public
    @view
    function getPublicStats(): (UInt256, UInt256, UInt256) {
        return (this.totalContents, this.totalLicenses, this.totalRevenue);
    }
}
```

**Total**: ~120 lines, does everything we need WITH PRIVACY BUILT-IN! 🎉

---

## Simplified Frontend

### Tech Choices

```bash
# Setup (5 minutes)
npx create-next-app@latest datavault --typescript --tailwind --app
cd datavault
npm install @midnight-ntwrk/wallet-api @midnight-ntwrk/midnight-js-sdk
```

### Pages We Need (Minimal)

1. **Home** (`/`) - Landing page with Connect Wallet
2. **Creator Dashboard** (`/creator`) - Upload + View Stats
3. **Marketplace** (`/marketplace`) - Browse Content
4. **Dashboard** (`/dashboard`) - AI Company View

### Component Structure

```
app/
├── page.tsx              # Home
├── creator/
│   └── page.tsx          # Creator dashboard
├── marketplace/
│   └── page.tsx          # Browse content
├── dashboard/
│   └── page.tsx          # AI company dashboard
├── api/
│   ├── upload/
│   │   └── route.ts      # Handle file upload
│   └── content/
│       └── route.ts      # Get content list
└── components/
    ├── MidnightWalletConnect.tsx  # Midnight wallet integration
    ├── ContentCard.tsx
    └── Stats.tsx
```

**Total**: ~8-10 files, very manageable with Midnight SDK!

---

## 3-Day Plan (Realistic)

### Team Roles

- **Person 1** (You): Backend/Smart Contracts
- **Person 2** (Darshan): Backend/Privacy Layer
- **Person 3** (fosgate29): Frontend

### Day 1: Get Something Working (0-24h)

#### Morning (0-6h) - Everyone
- [ ] Setup repo and project structure (1h)
- [ ] Deploy basic Next.js app to Vercel (0.5h)
- [ ] Setup local blockchain (Hardhat) (0.5h)
- [ ] Team sync: divide tasks (0.5h)

#### Person 1 (You): Smart Contract (6h)
- [ ] Write simplified Compact contract (2h)
- [ ] Write deployment script (0.5h)
- [ ] Deploy to local Midnight node (0.5h)
- [ ] Write basic tests (1h)
- [ ] Deploy to Midnight testnet (1h)
- [ ] Document contract addresses (0.5h)

#### Person 2 (Darshan): Backend/Database (6h)
- [ ] Setup SQLite database (0.5h)
- [ ] Create schema (content, licenses) (0.5h)
- [ ] Write API route: /api/upload (2h)
  - Handle file upload
  - Generate content hash
  - Store file locally
  - Save metadata to DB
- [ ] Write API route: /api/content (1h)
  - List all content
  - Filter by creator
- [ ] Test APIs with Postman (1h)

#### Person 3: Frontend (6h)
- [ ] Setup Midnight wallet connection (1h)
- [ ] Create basic layout and navigation (1h)
- [ ] Build Creator upload page (2h)
  - File input
  - Price input
  - Submit button
- [ ] Build Marketplace page (1h)
  - Grid of content cards
  - Basic styling
- [ ] Connect to APIs and Midnight SDK (1h)

#### Evening Integration (6h) - All
- [ ] Person 1: Add contract interaction to frontend (2h)
- [ ] Person 2: Connect upload flow: Frontend → API → Contract (2h)
- [ ] Person 3: Polish UI, add loading states (2h)
- [ ] **Test**: Upload one piece of content end-to-end
- [ ] **Milestone**: Creator can upload content ✓

---

### Day 2: Complete Core Loop (24-48h)

#### Morning (6h)

**Person 1**: License Purchase (3h)
- [ ] Test purchaseLicense function
- [ ] Add frontend button for purchase
- [ ] Handle MetaMask transaction
- [ ] Show confirmation

**Person 2**: Content Access API (3h)
- [ ] Write /api/access endpoint
- [ ] Generate usage proof (simple hash)
- [ ] Call contract.accessContent()
- [ ] Return file URL

**Person 3**: Dashboards (3h)
- [ ] Creator dashboard: show uploaded content
- [ ] Creator dashboard: show earnings
- [ ] AI Company dashboard: show purchased licenses
- [ ] AI Company dashboard: show usage

#### Afternoon (6h)

**Person 1**: Payment Flow (3h)
- [ ] Test withdrawEarnings function
- [ ] Add withdraw button to UI
- [ ] Handle transaction
- [ ] Show updated balance

**Person 2**: Privacy Layer (3h)
- [ ] Generate "usage proofs" (hash-based, not full ZK)
- [ ] Store proof commitments on-chain
- [ ] Document what's hidden vs. visible
- [ ] Prepare explanation for demo

**Person 3**: Polish UI (3h)
- [ ] Improve styling (make it look good)
- [ ] Add transaction status indicators
- [ ] Add error messages
- [ ] Add success notifications
- [ ] Responsive design

#### Evening (6h) - All
- [ ] End-to-end testing with 3 accounts (2h)
- [ ] Fix critical bugs (2h)
- [ ] Test on phones/tablets (0.5h)
- [ ] Deploy final version to Vercel (0.5h)
- [ ] **Milestone**: Full flow working ✓

---

### Day 3: Demo Prep (48-72h)

#### Morning (6h)

**All**: Bug Bash (3h)
- [ ] Test every button, every flow
- [ ] Fix any broken functionality
- [ ] Edge case testing

**Person 1**: Documentation (1h)
- [ ] Write README with setup instructions
- [ ] Document smart contract functions
- [ ] Prepare technical explanation

**Person 2**: Demo Data (1h)
- [ ] Upload 5-10 sample content items
- [ ] Create test accounts (creator, AI company)
- [ ] Pre-purchase licenses for backup demo

**Person 3**: Landing Page (1h)
- [ ] Create compelling home page
- [ ] Add project description
- [ ] Add "How it Works" section

#### Afternoon (6h)

**All**: Presentation (6h)
- [ ] Create slide deck (2h)
  - Problem (1 slide)
  - Solution (1 slide)
  - Demo (live)
  - Architecture (1 slide)
  - Roadmap (1 slide)
- [ ] Record backup demo video (1h)
- [ ] Practice demo 3 times (2h)
- [ ] Prepare for Q&A (0.5h)
- [ ] Final polish (0.5h)

#### Evening (6h)

**All**: Final Prep (3h)
- [ ] Test demo flow one more time
- [ ] Prepare contingency screenshots
- [ ] Charge all devices
- [ ] Check internet connection
- [ ] Final deployment check

**Rest** (3h)
- [ ] Get sleep!
- [ ] Mental preparation
- [ ] Review talking points

---

## Demo Script (5 min) - Simplified

### Setup (Before Demo)
```
✓ Two browser profiles ready
✓ Creator wallet funded
✓ AI Company wallet funded
✓ Sample content uploaded (backup)
✓ Vercel deployment URL works
✓ Slides ready
```

### Live Demo (3 minutes)

**Slide 1: Problem** (20 sec)
> "AI companies train on creators' content without proper licensing.
> Creators can't verify usage. Both sides lack privacy."

**Slide 2: Solution** (20 sec)
> "Datavault: Privacy-preserving marketplace on blockchain.
> Creators upload, AI companies license, usage tracked with proofs."

**Live Demo** (2 min)

*[Creator flow - 60 sec]*
1. Connect wallet → 5 sec
2. Upload image + set price ($0.50) → 20 sec
3. Transaction confirms → 10 sec
4. Show content ID on-chain → 5 sec
5. *[Fast forward]* Show earnings after use → 20 sec

*[AI Company flow - 60 sec]*
1. Switch browser → 5 sec
2. Browse marketplace → 10 sec
3. Purchase license → 20 sec
4. API call to access content → 15 sec
5. Show usage logged on-chain → 10 sec

**Slide 3: Privacy** (30 sec)
> "Built on Midnight Network with native ZK proofs!
> Public: content hash, usage count, payments
> Private: who accessed, when, file contents
> [Show Compact contract with @private annotations]"

**Slide 4: Next Steps** (30 sec)
> "MVP works on Midnight Network! Next: Enhanced ZK proofs, IPFS, mainnet.
> Market: AI training data is $X billion. Midnight makes it private! Thank you!"

---

## Contingency Plans

### If Demo Breaks

**Plan A**: Live demo works ✓

**Plan B**: Backup video (2 min)
- Pre-recorded full flow
- Narrate over it

**Plan C**: Screenshots + Explanation
- Walk through slides with screenshots
- Show smart contract code
- Explain architecture

**Plan D**: Technical deep-dive
- Focus on smart contract innovation
- Explain privacy mechanism
- Show code quality

### If Blockchain is Slow

- Use local Midnight node for demo
- Show testnet transactions separately
- Have pre-confirmed transactions ready on testnet

### If File Upload Fails

- Have sample content pre-uploaded
- Show from database
- Explain what would happen

---

## What Makes This Achievable

### ✅ Realistic Scope

1. **One contract** - Not 4 separate ones
2. **Next.js all-in-one** - No separate backend
3. **SQLite** - No database setup
4. **Simple privacy** - Hash proofs, not full ZK
5. **3 people** - Each person has clear role
6. **Focus on core** - Working demo > perfect code

### ✅ Fallback Options

- Local blockchain if testnet fails
- File storage if IPFS fails
- Hash proofs if ZK too complex
- Video if live demo fails

### ✅ Key Innovation Still Clear

Even with simplifications, judges see:
- Blockchain-based marketplace ✓
- Privacy mechanism (hashes) ✓
- Automated payments ✓
- Two-sided platform ✓
- Working prototype ✓

---

## Winning Strategy

### What Judges Care About

1. **Does it work?** (40%)
   - ✓ Yes, fully functional demo

2. **Is it innovative?** (30%)
   - ✓ First AI training data marketplace with privacy
   - ✓ Blockchain-based licensing
   - ✓ Automated compliance

3. **Can it be real?** (20%)
   - ✓ Solves actual problem (AI lawsuits, creator rights)
   - ✓ Clear path to production (add full ZK later)
   - ✓ Market exists (AI companies need data)

4. **Presentation?** (10%)
   - ✓ Clear demo
   - ✓ Good storytelling
   - ✓ Professional delivery

---

## Tech Choices Explained

### Why Next.js over separate React + Express?
- ✓ One codebase, one deploy
- ✓ API routes built-in
- ✓ Vercel deploy is instant
- ✓ No CORS issues

### Why Compact (Midnight's Language)?
- ✓ Built-in privacy features (private state, ZK proofs)
- ✓ Perfect for this hackathon (Midnight-specific!)
- ✓ Shielded transactions out of the box
- ✓ Native ZK proof verification
- ✗ Learning curve, but worth it for privacy!

### Why Midnight's built-in ZK over custom circuits?
- ✓ Works in 72 hours (no need to write circuits!)
- ✓ Production-ready privacy out of the box
- ✓ Demonstrates real privacy, not just concept
- ✓ Perfect for Midnight hackathon judges!

### Why SQLite over PostgreSQL?
- ✓ Zero setup
- ✓ File-based, easy to backup
- ✓ Enough for demo
- ✓ Can migrate to Postgres later

### Why local files over IPFS?
- ✓ No external dependencies
- ✓ No network issues during demo
- ✓ Hashes still go on-chain
- ✓ IPFS can be added later

---

## Day 0: Pre-Hackathon Prep (Do This Now!)

### Setup Checklist (2 hours)

**Everyone:**
- [ ] Install Node.js 18+
- [ ] Install Midnight wallet
- [ ] Get Midnight testnet tokens from faucet
- [ ] Clone starter repo template
- [ ] Test Vercel deployment
- [ ] Join team Discord channel

**Person 1 (Smart Contracts):**
- [ ] Install Midnight CLI: `npm install -g @midnight-ntwrk/midnight-js-cli`
- [ ] Test deploy to local Midnight node
- [ ] Bookmark Compact language docs
- [ ] Review Midnight documentation

**Person 2 (Backend):**
- [ ] Install SQLite Browser (GUI tool)
- [ ] Test Next.js API routes
- [ ] Review file upload in Next.js
- [ ] Install Midnight SDK

**Person 3 (Frontend):**
- [ ] Review Midnight wallet integration examples
- [ ] Review Tailwind CSS docs
- [ ] Test Midnight wallet connection locally

### Team Sync (1 hour)
- [ ] Agree on tech stack
- [ ] Assign roles clearly
- [ ] Set up GitHub repo
- [ ] Create Discord channel
- [ ] Schedule daily standups (15 min each)
- [ ] Agree on demo message

---

## Success Metrics

### Must Have (P0)
- [ ] Smart contract deployed and working
- [ ] Can upload content (creator)
- [ ] Can purchase license (AI company)
- [ ] Can access content (AI company)
- [ ] Payment auto-releases to creator
- [ ] Creator sees earnings
- [ ] Working demo start to finish

### Should Have (P1)
- [ ] Nice UI (Tailwind styling)
- [ ] Good presentation slides
- [ ] Backup demo video
- [ ] README documentation

### Nice to Have (P2)
- [ ] Multiple content items
- [ ] Search/filter marketplace
- [ ] Usage history view
- [ ] Mobile responsive

---

## Final Pep Talk

**Remember:**
- ✓ Simple > Complex
- ✓ Working > Perfect
- ✓ Demo > Features
- ✓ Story > Code

**You have:**
- ✓ Unique idea (no competition)
- ✓ Clear plan (this document)
- ✓ Realistic scope (achievable in 72h)
- ✓ Strong team (backend, AI, frontend)

**Keys to winning:**
1. Execute the plan (don't pivot!)
2. Integrate early (Day 1 evening)
3. Test constantly (every 4 hours)
4. Practice demo (at least 3 times)
5. Tell a story (problem → solution → impact)

---

## Quick Start Commands

```bash
# Day 1 Morning - Setup (15 min)

# Create project
npx create-next-app@latest datavault --typescript --tailwind --app
cd datavault

# Install dependencies
npm install @midnight-ntwrk/wallet-api @midnight-ntwrk/midnight-js-sdk better-sqlite3

# Install Midnight CLI globally
npm install -g @midnight-ntwrk/midnight-js-cli

# Create Compact contract
# (write contract in contracts/Datavault.compact)

# Compile contract
midnight-js-cli compile contracts/

# Start local Midnight node (Terminal 1)
midnight-js-cli node start

# Deploy to local node (Terminal 2)
midnight-js-cli deploy --network local

# Deploy to Midnight testnet
midnight-js-cli deploy --network testnet

# Run frontend (Terminal 3)
npm run dev

# Deploy frontend to Vercel
vercel --prod

# Done! Now start building features on Midnight!
```

---

**You got this! 🚀 Keep it simple, make it work, tell the story.**

**Questions before you start? Ask now!**
