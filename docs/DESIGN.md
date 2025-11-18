# Privacy-Preserving AI Training Data Marketplace - Design Document

## Document Information

- **Version**: 1.0
- **Date**: 2025-11-11
- **Status**: Draft
- **Authors**: [Team Name]

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Problem Statement](#problem-statement)
3. [Solution Overview](#solution-overview)
4. [System Requirements](#system-requirements)
5. [Architecture](#architecture)
6. [Component Design](#component-design)
7. [Data Models](#data-models)
8. [Security & Privacy](#security--privacy)
9. [Performance Considerations](#performance-considerations)
10. [Deployment Strategy](#deployment-strategy)

---

## Executive Summary

The Privacy-Preserving AI Training Data Marketplace is a decentralized platform that enables content creators to monetize their data for AI training while maintaining privacy through zero-knowledge proofs. Built on Midnight Network, it provides verifiable usage tracking and automated payments without revealing sensitive information about either party.

### Key Innovation

Our platform solves the trust problem in AI training data licensing by:
- **Proving usage without revealing details** (ZK proofs)
- **Automating compliance verification** (smart contracts)
- **Ensuring fair compensation** (usage-based micropayments)
- **Maintaining privacy** (selective disclosure)

---

## Problem Statement

### Current Challenges

1. **Lack of Trust**
   - Content creators don't trust AI companies to honor licensing terms
   - No way to verify how many times content is used in training
   - Difficult to prove compliance without revealing proprietary training methods

2. **Privacy Concerns**
   - AI companies don't want to reveal training data sources
   - Creators want privacy regarding earnings and customer lists
   - Current solutions require exposing too much information

3. **Payment Friction**
   - Manual invoicing for usage-based licensing is impractical
   - Micropayments are expensive with traditional systems
   - Dispute resolution is slow and costly

4. **Attribution Issues**
   - Hard to prove content authenticity
   - Easy to use scraped or unlicensed data
   - No standardized marketplace for licensed training data

### Target Users

#### Primary: Content Creators
- Photographers, videographers, artists
- Dataset curators and researchers
- News organizations
- Educational institutions

#### Primary: AI Companies
- Large language model developers
- Computer vision startups
- AI research labs
- Enterprise AI teams

#### Secondary: Validators
- Auditors verifying compliance
- Regulators checking licensing
- Investors evaluating platform metrics

---

## Solution Overview

### Core Value Propositions

#### For Creators
- **Monetize your content** through usage-based licensing
- **Maintain privacy** of earnings and customer information
- **Verify compliance** without accessing AI company's systems
- **Automated payments** based on actual usage
- **Provable authenticity** of your content

#### For AI Companies
- **Access licensed data** with clear terms
- **Prove compliance** without revealing training pipeline
- **Automated tracking** of usage and payments
- **Dispute resolution** through verifiable proofs
- **Legal protection** through blockchain records

### How It Works

```
1. CREATOR UPLOADS CONTENT
   ├─ Upload file to platform
   ├─ Content stored on IPFS (decentralized)
   ├─ Hash registered on blockchain
   └─ Set licensing terms (price, usage limits)

2. AI COMPANY DISCOVERS CONTENT
   ├─ Browse marketplace
   ├─ Filter by content type, license, price
   ├─ Preview metadata (not full content)
   └─ Purchase license

3. AI COMPANY ACCESSES CONTENT
   ├─ Use API to download content
   ├─ System generates usage proof (ZK)
   ├─ Proof logged on blockchain
   └─ Payment automatically released to creator

4. BOTH PARTIES VERIFY COMPLIANCE
   ├─ Creator sees aggregate usage stats
   ├─ AI company proves they followed terms
   ├─ Third parties can verify proofs
   └─ Disputes resolved with blockchain evidence
```

---

## System Requirements

### Functional Requirements

#### FR1: Content Management
- FR1.1: Creators can upload content files (images, text, video, datasets)
- FR1.2: System generates cryptographic hash of content
- FR1.3: Content stored on IPFS with CID returned
- FR1.4: Metadata indexed for searchability
- FR1.5: Creators can update metadata (not content hash)
- FR1.6: Creators can set content as private/public

#### FR2: Licensing
- FR2.1: Creators can set pricing (per-use, subscription, unlimited)
- FR2.2: Creators can define usage limits (max uses, duration)
- FR2.3: Creators can specify allowed/disallowed use cases
- FR2.4: AI companies can purchase licenses
- FR2.5: System issues access tokens (ZK credentials)
- FR2.6: Licenses can be revoked by creator

#### FR3: Usage Tracking
- FR3.1: Every content access generates a usage event
- FR3.2: Usage events create ZK proofs
- FR3.3: Proofs logged on blockchain without revealing accessor identity
- FR3.4: Aggregate statistics publicly available
- FR3.5: Detailed logs remain private
- FR3.6: Usage counts trigger payments

#### FR4: Payments
- FR4.1: Automated micropayments per usage
- FR4.2: Funds held in escrow smart contract
- FR4.3: Creators can withdraw earnings
- FR4.4: Refunds for unused prepaid credits
- FR4.5: Payment history viewable by both parties

#### FR5: Analytics
- FR5.1: Creators see total usage, revenue, unique licensees
- FR5.2: AI companies see their usage per content
- FR5.3: Public statistics for marketplace transparency
- FR5.4: Export verifiable reports (ZK proofs)

#### FR6: Compliance
- FR6.1: System verifies usage against license terms
- FR6.2: Violations flagged automatically
- FR6.3: Compliance proofs generated on-demand
- FR6.4: Dispute resolution mechanism

#### FR7: Verification
- FR7.1: Anyone can verify content authenticity
- FR7.2: Anyone can verify usage proofs
- FR7.3: Public explorer for blockchain records
- FR7.4: Proof verification API

### Non-Functional Requirements

#### NFR1: Performance
- NFR1.1: API response time < 500ms (p95)
- NFR1.2: Content upload < 5 seconds for 100MB files
- NFR1.3: ZK proof generation < 30 seconds
- NFR1.4: Support 10,000 concurrent users
- NFR1.5: Marketplace search < 200ms

#### NFR2: Security
- NFR2.1: All data encrypted in transit (TLS 1.3)
- NFR2.2: IPFS content optionally encrypted at rest
- NFR2.3: Smart contracts audited before deployment
- NFR2.4: Web3 wallet authentication required
- NFR2.5: API rate limiting to prevent abuse

#### NFR3: Privacy
- NFR3.1: ZK proofs reveal no private information
- NFR3.2: Usage logs not linkable to specific accessors
- NFR3.3: Aggregate stats only publicly visible
- NFR3.4: Selective disclosure for compliance

#### NFR4: Scalability
- NFR4.1: Handle 1M content items
- NFR4.2: Support 100K registered users
- NFR4.3: Process 1M usage events/day
- NFR4.4: Horizontal scaling for API services

#### NFR5: Reliability
- NFR5.1: 99.9% uptime
- NFR5.2: Automatic failover for services
- NFR5.3: Data backup every 24 hours
- NFR5.4: Disaster recovery plan

#### NFR6: Usability
- NFR6.1: Onboarding < 5 minutes for new users
- NFR6.2: Mobile-responsive design
- NFR6.3: Accessible (WCAG 2.1 AA)
- NFR6.4: Multi-language support (EN, ES, ZH, JA)

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        USER LAYER                            │
│  ┌────────���─────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Creators   │  │ AI Companies │  │  Verifiers   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Frontend (React + TypeScript)                 │  │
│  │  ├─ Creator Portal    ├─ AI Company Portal           │  │
│  │  ├─ Marketplace       ├─ Verification Tools          │  │
│  │  └─ Analytics Dashboard                              │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      API GATEWAY                             │
│  ├─ Authentication       ├─ Rate Limiting                   │
│  ├─ Request Validation   └─ Load Balancing                  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND SERVICES                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Content   │  │   License   │  │  Analytics  │        │
│  │   Service   │  │   Service   │  │   Service   │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
│  ┌─────────────┐  ┌─────────────┐                          │
│  │  ZK Proof   │  │   Payment   │                          │
│  │   Worker    │  │   Service   │                          │
│  └─────────────┘  └─────────────┘                          │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  BLOCKCHAIN LAYER                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         Midnight Network (Smart Contracts)          │   │
│  │  ├─ ContentRegistry    ├─ UsageTracker             │   │
│  │  ├─ LicenseManager     └─ PaymentEscrow            │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     STORAGE LAYER                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │     IPFS     │  │  PostgreSQL  │  │   Redis      │     │
│  │  (Content)   │  │  (Metadata)  │  │  (Cache)     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### Technology Decisions

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| Blockchain | Midnight Network | Privacy-preserving features, ZK proof support |
| Smart Contracts | Compact | Native to Midnight, designed for privacy |
| Frontend | React + TypeScript | Popular, strong typing, Web3 ecosystem |
| Backend | Node.js + Express | JavaScript ecosystem, async I/O |
| ZK Proofs | Circom + SnarkJS | Mature, well-documented, Ethereum-compatible |
| Storage | IPFS | Decentralized, content-addressed |
| Database | PostgreSQL | Reliable, supports JSON, good for analytics |
| Cache | Redis | Fast, supports pub/sub for events |
| API Docs | OpenAPI/Swagger | Standard, auto-generated clients |

---

## Component Design

### 1. Smart Contracts

#### ContentRegistry Contract

```typescript
// Compact pseudo-code
contract ContentRegistry {

  struct ContentMetadata {
    bytes32 contentHash;
    address creator;
    string ipfsCid;
    string title;
    string contentType;
    uint256 fileSize;
    uint256 timestamp;
  }

  mapping(bytes32 => ContentMetadata) public contents;
  mapping(address => bytes32[]) public creatorContents;

  event ContentRegistered(
    bytes32 indexed contentId,
    address indexed creator,
    bytes32 contentHash,
    uint256 timestamp
  );

  function registerContent(
    bytes32 _contentHash,
    string memory _ipfsCid,
    string memory _title,
    string memory _contentType,
    uint256 _fileSize
  ) public returns (bytes32 contentId) {
    // Generate unique content ID
    contentId = keccak256(abi.encodePacked(_contentHash, msg.sender, block.timestamp));

    // Store metadata
    contents[contentId] = ContentMetadata({
      contentHash: _contentHash,
      creator: msg.sender,
      ipfsCid: _ipfsCid,
      title: _title,
      contentType: _contentType,
      fileSize: _fileSize,
      timestamp: block.timestamp
    });

    // Index by creator
    creatorContents[msg.sender].push(contentId);

    emit ContentRegistered(contentId, msg.sender, _contentHash, block.timestamp);
  }

  function verifyContentOwnership(bytes32 _contentId)
    public view returns (bool, address) {
    ContentMetadata memory content = contents[_contentId];
    return (content.creator != address(0), content.creator);
  }

  function getContentInfo(bytes32 _contentId)
    public view returns (ContentMetadata memory) {
    return contents[_contentId];
  }
}
```

#### LicenseManager Contract

```typescript
contract LicenseManager {

  enum LicenseType { PerUse, Subscription, Unlimited }

  struct LicenseTerms {
    bytes32 contentId;
    LicenseType licenseType;
    uint256 pricePerUse;  // in native tokens
    uint256 maxUses;      // 0 = unlimited
    uint256 duration;     // in seconds, 0 = forever
    bool active;
  }

  struct License {
    bytes32 licenseId;
    bytes32 termsId;
    address licensee;
    uint256 purchaseTime;
    uint256 usageCount;
    bytes32 zkCredential;  // ZK access token
  }

  mapping(bytes32 => LicenseTerms) public licenseTerms;
  mapping(bytes32 => License) public licenses;
  mapping(bytes32 => bytes32[]) public contentLicenseTerms;

  event LicenseTermsCreated(bytes32 indexed termsId, bytes32 indexed contentId);
  event LicensePurchased(bytes32 indexed licenseId, address indexed licensee);

  function createLicenseTerms(
    bytes32 _contentId,
    LicenseType _type,
    uint256 _pricePerUse,
    uint256 _maxUses,
    uint256 _duration
  ) public returns (bytes32 termsId) {
    // Verify caller is content creator
    require(contentRegistry.verifyContentOwnership(_contentId).creator == msg.sender);

    termsId = keccak256(abi.encodePacked(_contentId, msg.sender, block.timestamp));

    licenseTerms[termsId] = LicenseTerms({
      contentId: _contentId,
      licenseType: _type,
      pricePerUse: _pricePerUse,
      maxUses: _maxUses,
      duration: _duration,
      active: true
    });

    contentLicenseTerms[_contentId].push(termsId);

    emit LicenseTermsCreated(termsId, _contentId);
  }

  function purchaseLicense(bytes32 _termsId)
    public payable returns (bytes32 licenseId, bytes32 zkCredential) {
    LicenseTerms memory terms = licenseTerms[_termsId];
    require(terms.active, "License terms not active");

    // Verify payment
    if (terms.licenseType == LicenseType.PerUse) {
      require(msg.value >= terms.pricePerUse, "Insufficient payment");
    } else if (terms.licenseType == LicenseType.Subscription) {
      require(msg.value >= terms.pricePerUse * terms.duration, "Insufficient payment");
    }

    licenseId = keccak256(abi.encodePacked(_termsId, msg.sender, block.timestamp));

    // Generate ZK credential (simplified)
    zkCredential = keccak256(abi.encodePacked(licenseId, msg.sender));

    licenses[licenseId] = License({
      licenseId: licenseId,
      termsId: _termsId,
      licensee: msg.sender,
      purchaseTime: block.timestamp,
      usageCount: 0,
      zkCredential: zkCredential
    });

    emit LicensePurchased(licenseId, msg.sender);
  }
}
```

#### UsageTracker Contract

```typescript
contract UsageTracker {

  struct UsageEvent {
    bytes32 eventId;
    bytes32 contentId;
    bytes32 licenseId;
    bytes32 zkProof;
    uint256 timestamp;
  }

  // Private state (encrypted on Midnight)
  mapping(bytes32 => UsageEvent[]) private contentUsageEvents;

  // Public aggregate statistics
  struct UsageStats {
    uint256 totalUses;
    uint256 uniqueLicensees;
    uint256 totalRevenue;
  }

  mapping(bytes32 => UsageStats) public publicStats;

  event UsageLogged(bytes32 indexed contentId, bytes32 indexed licenseId, bytes32 zkProof);

  function logUsage(
    bytes32 _contentId,
    bytes32 _licenseId,
    bytes32 _zkProof
  ) public returns (bool) {
    // Verify ZK proof
    require(verifyUsageProof(_zkProof, _contentId, _licenseId), "Invalid proof");

    // Verify license is valid
    License memory license = licenseManager.getLicense(_licenseId);
    require(isLicenseValid(license), "License expired or exceeded");

    // Log usage (private)
    bytes32 eventId = keccak256(abi.encodePacked(_contentId, _licenseId, block.timestamp));
    contentUsageEvents[_contentId].push(UsageEvent({
      eventId: eventId,
      contentId: _contentId,
      licenseId: _licenseId,
      zkProof: _zkProof,
      timestamp: block.timestamp
    }));

    // Update public stats
    UsageStats storage stats = publicStats[_contentId];
    stats.totalUses += 1;

    // Trigger payment
    paymentEscrow.releasePayment(_contentId, _licenseId);

    emit UsageLogged(_contentId, _licenseId, _zkProof);
    return true;
  }

  function getAggregateStats(bytes32 _contentId)
    public view returns (UsageStats memory) {
    return publicStats[_contentId];
  }

  function verifyUsageProof(
    bytes32 _zkProof,
    bytes32 _contentId,
    bytes32 _licenseId
  ) internal pure returns (bool) {
    // ZK proof verification logic
    // In real implementation, use zk-SNARK verifier
    return true; // Simplified
  }
}
```

### 2. Backend Services

#### Content Service API

```typescript
// src/services/content/contentService.ts

import { IPFS } from 'ipfs-http-client';
import { ContentRegistry } from '../contracts';

class ContentService {

  async uploadContent(
    file: Buffer,
    metadata: {
      title: string;
      description: string;
      contentType: string;
    },
    creatorAddress: string
  ) {
    // 1. Upload to IPFS
    const ipfsResult = await this.ipfs.add(file);
    const ipfsCid = ipfsResult.cid.toString();

    // 2. Generate content hash
    const contentHash = await this.generateHash(file);

    // 3. Register on blockchain
    const tx = await this.contentRegistry.registerContent(
      contentHash,
      ipfsCid,
      metadata.title,
      metadata.contentType,
      file.length
    );

    const receipt = await tx.wait();
    const contentId = receipt.events[0].args.contentId;

    // 4. Store metadata in database (for search)
    await this.db.query(
      `INSERT INTO content (content_id, creator_address, ipfs_cid, title, description, content_type)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [contentId, creatorAddress, ipfsCid, metadata.title, metadata.description, metadata.contentType]
    );

    return {
      contentId,
      ipfsCid,
      contentHash,
      txHash: receipt.transactionHash
    };
  }

  async getContent(contentId: string, licenseId: string) {
    // 1. Verify license
    const license = await this.licenseManager.getLicense(licenseId);
    if (!license.active) {
      throw new Error('Invalid or expired license');
    }

    // 2. Get content metadata
    const content = await this.contentRegistry.getContentInfo(contentId);

    // 3. Generate usage proof (ZK)
    const usageProof = await this.zkProver.generateUsageProof({
      contentId,
      licenseId,
      timestamp: Date.now()
    });

    // 4. Log usage on blockchain
    await this.usageTracker.logUsage(contentId, licenseId, usageProof);

    // 5. Return IPFS URL
    return {
      url: `https://ipfs.io/ipfs/${content.ipfsCid}`,
      contentId,
      proof: usageProof
    };
  }
}
```

### 3. Frontend Components

#### Creator Dashboard Component

```typescript
// src/components/creator/CreatorDashboard.tsx

import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../hooks/useWeb3';

export const CreatorDashboard: React.FC = () => {
  const { account, contractRegistry } = useWeb3();
  const [contents, setContents] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    loadCreatorContent();
    loadAnalytics();
  }, [account]);

  const loadCreatorContent = async () => {
    const contentIds = await contractRegistry.getCreatorContents(account);
    const contentData = await Promise.all(
      contentIds.map(id => contractRegistry.getContentInfo(id))
    );
    setContents(contentData);
  };

  const loadAnalytics = async () => {
    const stats = await fetch(`/api/v1/creator/${account}/analytics`);
    setAnalytics(await stats.json());
  };

  return (
    <div className="dashboard">
      <h1>Creator Dashboard</h1>

      <section className="analytics">
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p>${analytics?.totalRevenue || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Total Uses</h3>
          <p>{analytics?.totalUses || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Active Licenses</h3>
          <p>{analytics?.activeLicenses || 0}</p>
        </div>
      </section>

      <section className="content-list">
        <h2>Your Content</h2>
        {contents.map(content => (
          <ContentCard key={content.contentId} content={content} />
        ))}
      </section>

      <UploadButton />
    </div>
  );
};
```

---

## Data Models

### Database Schema

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address VARCHAR(42) UNIQUE NOT NULL,
  role VARCHAR(20) CHECK (role IN ('creator', 'accessor')),
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Content (mirrored from blockchain for search)
CREATE TABLE content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id VARCHAR(66) UNIQUE NOT NULL, -- from smart contract
  creator_id UUID REFERENCES users(id),
  ipfs_cid VARCHAR(100) NOT NULL,
  content_hash VARCHAR(66) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content_type VARCHAR(50),
  file_size BIGINT,
  tags TEXT[], -- array for searchability
  blockchain_tx VARCHAR(66),
  created_at TIMESTAMP DEFAULT NOW(),

  -- Indexes for search
  FULLTEXT INDEX idx_content_search (title, description),
  INDEX idx_content_type (content_type),
  INDEX idx_creator (creator_id)
);

-- License Terms (mirrored from blockchain)
CREATE TABLE license_terms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  terms_id VARCHAR(66) UNIQUE NOT NULL,
  content_id UUID REFERENCES content(id),
  license_type VARCHAR(20) CHECK (license_type IN ('per_use', 'subscription', 'unlimited')),
  price_per_use DECIMAL(18, 6),
  max_uses INT,
  duration_seconds INT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Licenses (mirrored from blockchain)
CREATE TABLE licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  license_id VARCHAR(66) UNIQUE NOT NULL,
  terms_id UUID REFERENCES license_terms(id),
  licensee_id UUID REFERENCES users(id),
  purchase_time TIMESTAMP,
  usage_count INT DEFAULT 0,
  zk_credential VARCHAR(66),
  blockchain_tx VARCHAR(66),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Usage Events (cached for analytics, private data not stored)
CREATE TABLE usage_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id VARCHAR(66) UNIQUE NOT NULL,
  content_id UUID REFERENCES content(id),
  license_id UUID REFERENCES licenses(id),
  zk_proof VARCHAR(200),
  blockchain_tx VARCHAR(66),
  timestamp TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),

  INDEX idx_content_usage (content_id, timestamp),
  INDEX idx_license_usage (license_id, timestamp)
);

-- API Keys for programmatic access
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  key_hash VARCHAR(64) NOT NULL,
  name VARCHAR(100),
  rate_limit INT DEFAULT 1000, -- requests per hour
  expires_at TIMESTAMP,
  last_used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),

  INDEX idx_key_hash (key_hash)
);

-- Analytics aggregations (materialized view for performance)
CREATE MATERIALIZED VIEW content_analytics AS
SELECT
  c.content_id,
  c.title,
  COUNT(DISTINCT ue.license_id) as unique_licensees,
  COUNT(ue.id) as total_uses,
  SUM(lt.price_per_use) as total_revenue,
  MAX(ue.timestamp) as last_accessed
FROM content c
LEFT JOIN usage_events ue ON c.id = ue.content_id
LEFT JOIN licenses l ON ue.license_id = l.id
LEFT JOIN license_terms lt ON l.terms_id = lt.id
GROUP BY c.content_id, c.title;

-- Refresh periodically
CREATE INDEX idx_content_analytics ON content_analytics(content_id);
```

### API Request/Response Models

```typescript
// Content Registration
interface RegisterContentRequest {
  file: File;
  metadata: {
    title: string;
    description?: string;
    contentType: string;
    tags?: string[];
  };
  licenseTerms: {
    type: 'per_use' | 'subscription' | 'unlimited';
    pricePerUse: number;
    maxUses?: number;
    duration?: number; // seconds
  };
}

interface RegisterContentResponse {
  contentId: string;
  ipfsCid: string;
  contentHash: string;
  licenseId: string;
  txHash: string;
  verificationLink: string;
}

// License Purchase
interface PurchaseLicenseRequest {
  licenseTermsId: string;
  payment: {
    amount: number;
    currency: string;
  };
}

interface PurchaseLicenseResponse {
  licenseId: string;
  accessToken: string; // ZK credential
  apiKey: string;
  expiresAt?: string;
  txHash: string;
}

// Content Access
interface AccessContentRequest {
  contentId: string;
  licenseId: string;
}

interface AccessContentResponse {
  contentUrl: string;
  expiresAt: string;
  usageProof: string;
  remainingUses?: number;
}

// Analytics
interface CreatorAnalyticsResponse {
  totalRevenue: number;
  totalUses: number;
  uniqueLicensees: number;
  contentCount: number;
  contentStats: Array<{
    contentId: string;
    title: string;
    uses: number;
    revenue: number;
    lastAccessed: string;
  }>;
}
```

---

## Security & Privacy

### Threat Model

| Threat | Mitigation |
|--------|-----------|
| Unauthorized content access | ZK credentials, smart contract access control |
| Usage underreporting | ZK proofs verified on-chain, immutable logs |
| Privacy breach (who accessed what) | Private state in Midnight, ZK proofs |
| Payment theft | Escrow smart contract, automated release |
| Content tampering | Content-addressed IPFS, hash verification |
| Sybil attacks | Cost of blockchain transactions |
| API abuse | Rate limiting, API keys, authentication |
| Smart contract vulnerabilities | Audits, testing, upgrade mechanism |

### ZK Proof Design

#### Usage Proof Circuit

```
Circuit: UsageProof

Private Inputs:
  - accessorId: address of AI company
  - exactTimestamp: precise access time
  - apiCallDetails: endpoint, parameters

Public Inputs:
  - contentId: which content was accessed
  - licenseId: which license was used
  - timestampRange: [day, hour] (less precise than private)

Public Outputs:
  - validAccess: boolean (proof that access was legitimate)
  - usageIncrement: 1 (to increment counter)

Constraints:
  1. accessorId must be owner of licenseId
  2. exactTimestamp must be within license validity period
  3. licenseId must not be revoked
  4. timestampRange must contain exactTimestamp

Proof:
  "I accessed content X under valid license Y at time ~Z,
   but I'm not revealing my exact identity or precise timestamp"
```

---

## Performance Considerations

### Scalability Targets

- **Users**: 100,000 concurrent
- **Content**: 1,000,000 items
- **Usage events**: 10,000,000/day
- **API throughput**: 10,000 req/sec

### Optimization Strategies

1. **Caching**
   - Redis for frequently accessed content metadata
   - CDN for static assets
   - Materialized views for analytics

2. **Async Processing**
   - Message queue for ZK proof generation
   - Background workers for blockchain indexing
   - Batch usage logging

3. **Database Optimization**
   - Indexes on all query patterns
   - Partitioning for large tables (by date)
   - Read replicas for analytics queries

4. **Blockchain Optimization**
   - Batch transactions when possible
   - Layer 2 for micropayments (future)
   - Optimized smart contract gas usage

---

## Deployment Strategy

### Environments

1. **Development**: Local, docker-compose
2. **Testnet**: Midnight testnet, staging servers
3. **Production**: Midnight mainnet, cloud infrastructure

### Deployment Checklist

- [ ] Smart contract audit completed
- [ ] Load testing passed (10K concurrent users)
- [ ] Security penetration testing completed
- [ ] ZK proof verification tested at scale
- [ ] Monitoring and alerting configured
- [ ] Disaster recovery plan documented
- [ ] Legal review of terms of service
- [ ] GDPR compliance verified

---

## Appendix

### Glossary

- **ZK Proof**: Zero-Knowledge Proof, cryptographic proof that reveals no information except validity
- **IPFS**: InterPlanetary File System, decentralized storage
- **CID**: Content Identifier in IPFS
- **Compact**: Smart contract language for Midnight Network
- **zkCredential**: Zero-knowledge credential used as access token

### References

- Midnight Network Documentation
- ZK-SNARK Tutorial
- IPFS Specification
- Web3 Development Best Practices
