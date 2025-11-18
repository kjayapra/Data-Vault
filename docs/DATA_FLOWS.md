# Data Flow Diagrams - Privacy-Preserving AI Training Data Marketplace

## Document Information

- **Version**: 1.0
- **Date**: 2025-11-11
- **Purpose**: Detailed data flow documentation for all system interactions

---

## Table of Contents

1. [Overview](#overview)
2. [Flow 1: Content Registration](#flow-1-content-registration)
3. [Flow 2: License Purchase](#flow-2-license-purchase)
4. [Flow 3: Content Access](#flow-3-content-access)
5. [Flow 4: Usage Tracking & Payment](#flow-4-usage-tracking--payment)
6. [Flow 5: Compliance Verification](#flow-5-compliance-verification)
7. [Flow 6: Proof Generation & Verification](#flow-6-proof-generation--verification)
8. [Flow 7: Analytics Dashboard](#flow-7-analytics-dashboard)
9. [Data State Diagrams](#data-state-diagrams)
10. [Error Flows](#error-flows)

---

## Overview

### System Components Legend

```
┌─────────┐
│  Actor  │  = User/External System
└─────────┘

┌──────────────┐
│   Service    │  = Backend Service
└──────────────┘

╔══════════════╗
║   Contract   ║  = Smart Contract
╚══════════════╝

[(Database)]  = Data Store

{ZK Prover}   = Zero-Knowledge Proof System

====>         = Synchronous call
- - ->        = Asynchronous message
====>>        = Data flow
```

---

## Flow 1: Content Registration

### High-Level Flow

```
Creator → Frontend → API Gateway → Content Service → IPFS
                                          ↓
                                    ZK Prover → Smart Contract → Blockchain
                                          ↓
                                    [(Database)]
```

### Detailed Flow Diagram

```
┌─────────┐
│ Creator │
└────┬────┘
     │
     │ 1. Upload file + metadata
     ↓
┌──────────────┐
│   Frontend   │
└──────┬───────┘
       │
       │ 2. POST /content/register
       │    (multipart/form-data)
       ↓
┌──────────────┐
│ API Gateway  │
└──────┬───────┘
       │
       │ 3. Authenticate (Web3 signature)
       │ 4. Validate file size/type
       ↓
┌──────────────────┐
│ Content Service  │
└──────┬───────────┘
       │
       │ 5. Generate SHA-256 hash
       │    hash = SHA256(fileData)
       ↓
       │ 6. Upload to IPFS
       ├────────────>┌──────┐
       │              │ IPFS │
       │<─────────────└──────┘
       │              7. Return CID
       │
       │ 8. Generate authenticity proof
       ├────────────>{ZK Prover}
       │              ├ Private: (creatorKey, timestamp, hash)
       │              └ Public: (creatorAddress, contentHash)
       │<─────────────
       │              9. Return zkProof
       │
       │ 10. Register on blockchain
       ├──────────────>╔═══════════════════╗
       │                ║ ContentRegistry   ║
       │                ║   Contract        ║
       │                ╚═════════┬═════════╝
       │                          │
       │                          │ 11. Store on-chain
       │                          ↓
       │                    ┌──────────┐
       │                    │Blockchain│
       │<───────────────────└──────────┘
       │                    12. Emit ContentRegistered
       │                        event with contentId
       │
       │ 13. Cache metadata
       ├────────────>[(PostgreSQL)]
       │              ├ content table
       │              └ creator_contents index
       │
       │ 14. Return response
       ↓
┌──────────────┐
│   Frontend   │ Display: contentId, IPFS link,
└──────────────┘ verification URL
```

### Data Transformation

```
Step 1: User Input
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  file: <binary data>,
  metadata: {
    title: "Sunset Photo",
    description: "...",
    tags: ["nature"]
  }
}

Step 5: Hash Generation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
contentHash: "0xabc123def456..."

Step 7: IPFS Storage
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ipfsCid: "QmXyz123abc..."

Step 9: ZK Proof
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
zkProof: "0x8f3e7d6c..."
publicOutputs: {
  creatorAddress: "0x742d35Cc...",
  contentHash: "0xabc123def456..."
}

Step 12: Blockchain Storage
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
contentId: "0x1a2b3c4d5e6f"
txHash: "0xtx123..."
blockNumber: 12345

Step 13: Database Cache
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INSERT INTO content (
  content_id, creator_address, ipfs_cid,
  content_hash, title, description, tags
) VALUES (...)

Step 14: Response
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  contentId: "0x1a2b3c4d5e6f",
  ipfsCid: "QmXyz123abc",
  txHash: "0xtx123",
  verificationUrl: "https://..."
}
```

### Sequence Diagram

```
Creator  Frontend  API     Content   IPFS   ZKProver  Contract  Blockchain  DB
  │         │        │      Service   │        │         │          │        │
  │ Upload  │        │         │      │        │         │          │        │
  ├────────>│        │         │      │        │         │          │        │
  │         │ POST   │         │      │        │         │          │        │
  │         ├───────>│         │      │        │         │          │        │
  │         │        │ Auth    │      │        │         │          │        │
  │         │        ├────────>│      │        │         │          │        │
  │         │        │         │Upload│        │         │          │        │
  │         │        │         ├─────>│        │         │          │        │
  │         │        │         │ CID  │        │         │          │        │
  │         │        │         │<─────┤        │         │          │        │
  │         │        │         │ Gen  │        │         │          │        │
  │         │        │         │Proof │        │         │          │        │
  │         │        │         ├──────────────>│         │          │        │
  │         │        │         │      │  Proof │         │          │        │
  │         │        ���         │<──────────────┤         │          │        │
  │         │        │         │ Register      │         │          │        │
  │         │        │         ├───────────────────────>│          │        │
  │         │        │         │      │        │  Store  │          │        │
  │         │        │         │      │        │         ├─────────>│        │
  │         │        │         │      │        │  Event  │          │        │
  │         │        │         │<───────────────────────┤          │        │
  │         │        │         │ Cache │        │         │          │        │
  │         │        │         ├────────────────────────────────────────────>│
  │         │        │Response │      │        │         │          │        │
  │         │<───────┤         │      │        │         │          │        │
  │ Display │        │         │      │        │         │          │        │
  │<────────┤        │         │      │        │         │          │        │
```

---

## Flow 2: License Purchase

### High-Level Flow

```
AI Company → Frontend → API → License Service → Smart Contract → Blockchain
                                      ↓
                                Payment Escrow → ZK Credential Generation
                                      ↓
                                [(Database)]
```

### Detailed Flow Diagram

```
┌─────────────┐
│ AI Company  │
└──────┬──────┘
       │
       │ 1. Browse marketplace
       │ 2. Select content & license
       ↓
┌──────────────┐
│   Frontend   │
└──────┬───────┘
       │
       │ 3. POST /license/purchase
       │    {licenseId, payment}
       ↓
┌──────────────┐
│ API Gateway  │
└──────┬───────┘
       │
       │ 4. Authenticate (Web3)
       │ 5. Verify wallet balance
       ↓
┌───────────────────┐
│ License Service   │
└──────┬────────────┘
       │
       │ 6. Get license terms
       ├─────────────>╔═══════════════╗
       │               ║ LicenseManager║
       │               ║   Contract    ║
       │<──────────────╚═══════════════╝
       │               7. Return terms
       │
       │ 8. Verify payment amount
       │    if payment < price: REJECT
       │
       │ 9. Call purchaseLicense()
       ├─────────────>╔═══════════════╗
       │               ║ LicenseManager║
       │               ║   Contract    ║
       │               ╚═══════┬═══════╝
       │                       │
       │                       │ 10. Transfer funds
       │                       ├──────────>╔════════════════╗
       │                       │            ║ PaymentEscrow  ║
       │                       │            ║   Contract     ║
       │                       │<───────────╚════════════════╝
       │                       │            11. Funds locked
       │                       │
       │                       │ 12. Generate licenseId
       │                       │     licenseId = hash(termsId, buyer, timestamp)
       │                       │
       │                       │ 13. Store on blockchain
       │                       ├────────────>┌──────────┐
       │                       │              │Blockchain│
       │<──────────────────────┘              └──────────┘
       │                       14. Emit LicensePurchased
       │
       │ 15. Generate ZK credential
       ├────────────>{ZK Prover}
       │              ├ Private: (licenseeAddress, licenseId, timestamp)
       │              └ Public: (licenseId, valid=true)
       │<─────────────
       │              16. Return zkCredential
       │
       │ 17. Generate API key
       │     apiKey = "sk_live_" + randomBytes(32)
       │     keyHash = SHA256(apiKey)
       │
       │ 18. Store in database
       ├────────────>[(PostgreSQL)]
       │              ├ licenses table
       │              └ api_keys table
       │
       │ 19. Send response with credentials
       ↓
┌──────────────┐
│   Frontend   │ Display: licenseId, accessToken,
└──────────────┘ apiKey (show once!)
```

### Data Transformation

```
Step 3: Purchase Request
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  licenseId: "0x7d8e9f",
  payment: {
    amount: 0.50,
    txHash: "0xPayment123"
  }
}

Step 7: License Terms
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  contentId: "0x1a2b3c",
  type: "per_use",
  pricePerUse: 0.50,
  maxUses: 1000,
  active: true
}

Step 14: Blockchain Transaction
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
event LicensePurchased(
  licenseId: "0xLicense456",
  licensee: "0xBuyer789",
  termsId: "0x7d8e9f",
  timestamp: 1699876543
)

Step 16: ZK Credential
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
zkCredential: "zkCred_xyz789abc..."
proof: {
  licenseId: "0xLicense456",
  valid: true,
  // licensee address hidden in proof
}

Step 17: API Key
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
apiKey: "sk_live_def456ghi789..."
keyHash: "0xHash123..."

Step 19: Response
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  licenseId: "0xLicense456",
  accessToken: "zkCred_xyz789abc",
  apiKey: "sk_live_def456ghi789",
  txHash: "0xtxPurchase",
  terms: {...}
}
```

---

## Flow 3: Content Access

### High-Level Flow

```
AI Company → API (with credentials) → Content Service → IPFS
                                            ↓
                                      ZK Proof → Usage Tracker → Blockchain
                                            ↓
                                      Payment Release
```

### Detailed Flow Diagram

```
┌─────────────┐
│ AI Company  │
└──────┬──────┘
       │
       │ 1. POST /content/{id}/access
       │    Headers:
       │      Authorization: Bearer <apiKey>
       │      X-License-Token: <zkCredential>
       ↓
┌──────────────┐
│ API Gateway  │
└──────┬───────┘
       │
       │ 2. Verify API key
       ├────────────>[(Redis Cache)]
       │              "apiKey:hash" → userId
       │<─────────────
       │              3. userId found
       │
       │ 4. Rate limit check
       │    if requests > limit: REJECT 429
       │
       ↓
┌───────────────────┐
│ Content Service   │
└──────┬────────────┘
       │
       │ 5. Verify ZK credential
       ├────────────>{ZK Verifier}
       │              Verify proof that:
       │              - Credential is valid
       │              - Linked to licenseId
       │              - Not revoked
       │<─────────────
       │              6. Credential valid
       │
       │ 7. Check license status
       ├─────────────>╔═══════════════╗
       │               ║ LicenseManager║
       │<──────────────╚═══════════════╝
       │               8. License active, within limits
       │
       │ 9. Get content metadata
       ├─────────────>╔═══════════════╗
       │               ║ContentRegistry║
       │<──────────────╚═══════════════╝
       │               10. Return ipfsCid
       │
       │ 11. Generate temporary access URL
       │     url = ipfsGateway + cid + "?token=" + tempToken
       │     tempToken expires in 1 hour
       │
       │ 12. Generate usage proof
       ├────────────>{ZK Prover}
       │              Private: (licenseeId, exactTimestamp, apiCall)
       │              Public: (contentId, licenseId, timestampRange)
       │<─────────────
       │              13. Return usageProof
       │
       │ 14. Log usage on-chain
       ├─────────────>╔═══════════════╗
       │               ║ UsageTracker  ║
       │               ║   Contract    ║
       │               ╚═══════┬═══════╝
       │                       │
       │                       │ 15. Verify proof
       │                       │ 16. Store usage (private state)
       │                       │ 17. Update public stats
       │                       │ 18. Emit UsageLogged
       │                       ↓
       │                  ┌──────────┐
       │<─────────────────│Blockchain│
       │                  └──────────┘
       │                  19. Return eventId
       │
       │ 20. Trigger payment release
       │     (asynchronous)
       │- - - - - - - ->╔═══════════════╗
       │                ║ PaymentEscrow ║
       │                ║   Contract    ║
       │                ╚═══════════════╝
       │
       │ 21. Cache usage event
       ├────────────>[(PostgreSQL)]
       │              INSERT INTO usage_events
       │
       │ 22. Return access details
       ↓
┌──────────────┐
│ AI Company   │ Download content from IPFS
└──────┬───────┘ using temporary URL
       │
       │ 23. GET <ipfsUrl>?token=<tempToken>
       ↓
  ┌──────┐
  │ IPFS │ Return file
  └──────┘
```

### Usage Proof Circuit

```
Circuit: UsageProofCircuit
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Private Inputs:
├─ licenseeAddress: 0xBuyer789
├─ exactTimestamp: 1699876543.123456
├─ apiCallDetails: {
│    endpoint: "/content/0x1a2b3c/access",
│    method: "POST",
│    ip: "203.0.113.42"
│  }
└─ licenseCredential: zkCred_xyz789

Public Inputs:
├─ contentId: "0x1a2b3c4d5e6f"
├─ licenseId: "0xLicense456"
└─ timestampRange: "2025-11-11T14:00-15:00"

Constraints:
1. licenseeAddress owns licenseId ✓
2. exactTimestamp is within timestampRange ✓
3. licenseCredential is valid & not revoked ✓
4. licenseeAddress signed the API request ✓

Public Output:
{
  contentId: "0x1a2b3c4d5e6f",
  licenseId: "0xLicense456",
  validAccess: true,
  usageIncrement: 1
}

Privacy Preserved:
✗ licenseeAddress not revealed
✗ exactTimestamp not revealed
✗ apiCallDetails not revealed
✓ Only contentId, licenseId, validity revealed
```

---

## Flow 4: Usage Tracking & Payment

### Payment Release Flow

```
Event Listener → Payment Service → Smart Contract → Blockchain
                       ↓
                 [(Database)] Update records
                       ↓
                 Notify Creator (webhook/email)
```

### Detailed Flow Diagram

```
┌──────────────┐
│  Blockchain  │ UsageLogged event emitted
└──────┬───────┘
       │
       │ Event: UsageLogged {
       │   contentId: "0x1a2b3c",
       │   licenseId: "0xLicense456",
       │   zkProof: "0xProof123",
       │   timestamp: 1699876543
       │ }
       ↓
┌─────────────────┐
│ Event Listener  │ (Backend service watching blockchain)
└──────┬──────────┘
       │
       │ 1. Parse event
       │ 2. Extract contentId, licenseId
       ↓
┌─────────────────┐
│ Payment Service │
└──────┬──────────┘
       │
       │ 3. Get license terms
       ├─────────────>[(Database Cache)]
       │<──────────────
       │               4. pricePerUse = 0.50
       │
       │ 5. Get creator address
       ├─────────────>╔═══════════════╗
       │               ║ContentRegistry║
       │<──────────────╚═══════════════╝
       │               6. creator = 0x742d35Cc
       │
       │ 7. Calculate payment
       │    amount = pricePerUse * 1 = 0.50
       │    platformFee = amount * 0.025 = 0.0125
       │    creatorAmount = amount - platformFee = 0.4875
       │
       │ 8. Release payment from escrow
       ├─────────────>╔════════════════╗
       │               ║ PaymentEscrow  ║
       │               ║   Contract     ║
       │               ╚═══════┬════════╝
       │                       │
       │                       │ 9. Verify event signature
       │                       │ 10. Check escrow balance
       │                       │ 11. Transfer to creator
       │                       │     escrow → creator: 0.4875
       │                       │ 12. Transfer platform fee
       │                       │     escrow → platform: 0.0125
       │                       │ 13. Emit PaymentReleased
       │                       ↓
       │                  ┌──────────┐
       │<─────────────────│Blockchain│
       │                  └──────────┘
       │                  14. Return txHash
       │
       │ 15. Update database
       ├────────────>[(PostgreSQL)]
       │              UPDATE usage_events
       │              SET payment_tx = '0xtxPayment'
       │
       │              UPDATE creator_earnings
       │              SET balance = balance + 0.4875
       │
       │ 16. Send webhook to creator
       │     (if configured)
       │- - - - - - - ->┌──────────────┐
       │                │ Creator      │
       │                │ Webhook URL  │
       │                └──────────────┘
       │                Event: payment.completed {
       │                  amount: 0.4875,
       │                  contentId: "0x1a2b3c",
       │                  txHash: "0xtxPayment"
       │                }
       │
       │ 17. Optional: Send email notification
       │- - - - - - - ->┌──────────────┐
       │                │ Email Service│
       │                └──────────────┘
```

---

## Flow 5: Compliance Verification

### High-Level Flow

```
AI Company → API → Compliance Service → Smart Contract → ZK Prover
                            ↓
                      Generate Report → Return Proof
```

### Detailed Flow Diagram

```
┌─────────────┐
│ AI Company  │
└──────┬──────┘
       │
       │ 1. POST /compliance/verify
       │    {licenseId, period}
       ↓
┌──────────────┐
│ API Gateway  │
└──────┬───────┘
       │
       │ 2. Authenticate
       │ 3. Verify requester owns license
       ↓
┌────────────────────┐
│ Compliance Service │
└──────┬─────────────┘
       │
       │ 4. Fetch license terms
       ├─────────────>╔═══════════════╗
       │               ║ LicenseManager║
       │<──────────────╚═══════════════╝
       │               5. terms: {
       │                   maxUses: 1000,
       │                   duration: null,
       │                   pricePerUse: 0.50
       │                 }
       │
       │ 6. Fetch usage events (from private state)
       ├─────────────>╔═══════════════╗
       │               ║ UsageTracker  ║
       │               ║   Contract    ║
       │<──────────────╚═══════════════╝
       │               7. usageEvents[] (encrypted)
       │                  Only aggregate stats visible:
       │                  totalUses: 247
       │
       │ 8. Verify compliance
       │    Check 1: Usage limit
       │      247 <= 1000 ✓ PASS
       │    Check 2: License expiration
       │      No expiration ✓ PASS
       │    Check 3: Payment status
       │      All usage paid ✓ PASS
       │
       │    Result: COMPLIANT
       │
       │ 9. Generate compliance proof
       ├────────────>{ZK Prover}
       │              Circuit: ComplianceProof
       │              Private: (
       │                usageEvents[],  // individual accesses
       │                licenseeId,     // who accessed
       │                timestamps[]    // exact times
       │              )
       │              Public: (
       │                licenseId,
       │                totalUses: 247,
       │                maxAllowed: 1000,
       │                compliant: true
       │              )
       │<─────────────
       │              10. Return zkProof
       │
       │ 11. Store proof on-chain
       ├─────────────>╔═══════════════╗
       │               ║ UsageTracker  ║
       │               ║   Contract    ║
       │               ╚═══════┬═══════╝
       │                       │
       │                       │ 12. Store proof hash
       │                       ↓
       │                  ┌──────────┐
       │<─────────────────│Blockchain│
       │                  └──────────┘
       │                  13. Return txHash
       │
       │ 14. Generate report PDF
       │     (using template engine)
       │
       │ 15. Upload report to IPFS
       ├────────────>┌──────┐
       │              │ IPFS │
       │<─────────────└──────┘
       │              16. Return reportCid
       │
       │ 17. Cache report in database
       ├────────────>[(PostgreSQL)]
       │              INSERT INTO compliance_reports
       │
       │ 18. Return response
       ↓
┌──────────────┐
│ AI Company   │ Download PDF, share verification link
└──────────────┘
```

### Compliance Proof Circuit

```
Circuit: ComplianceProofCircuit
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Private Inputs:
├─ usageEvents[]: [
│    {timestamp: 1699876543, cost: 0.50},
│    {timestamp: 1699876789, cost: 0.50},
│    ... (247 events)
│  ]
├─ licenseeAddress: 0xBuyer789
├─ licenseTerms: {
│    maxUses: 1000,
│    pricePerUse: 0.50,
│    startDate: null,
│    endDate: null
│  }
└─ paymentRecords[]: [
│    {amount: 0.50, txHash: "0xPay1"},
│    ... (247 payments)
│  ]

Public Inputs:
├─ licenseId: "0xLicense456"
├─ contentId: "0x1a2b3c"
└─ verificationDate: 2025-11-11

Constraints:
1. COUNT(usageEvents) == 247 ✓
2. 247 <= maxUses (1000) ✓
3. ALL events have matching payment ✓
4. SUM(payments) == 247 * 0.50 = 123.50 ✓
5. NO events outside license validity ✓

Public Output:
{
  licenseId: "0xLicense456",
  contentId: "0x1a2b3c",
  totalUses: 247,
  maxAllowed: 1000,
  totalPaid: 123.50,
  compliant: true,
  violations: []
}

Privacy Preserved:
✗ Individual event timestamps hidden
✗ licenseeAddress hidden
✗ Exact payment transaction hashes hidden
✓ Only aggregates & compliance status revealed
```

---

## Flow 6: Proof Generation & Verification

### Creator Generates Proof

```
Creator → Frontend → API → Proof Service → ZK Prover
                              ↓
                        Smart Contract → Blockchain
                              ↓
                        Return verification link
```

### Third Party Verifies Proof

```
Verifier → Verification Page → API → Smart Contract → Blockchain
                                ↓
                          Display verified results
```

### Detailed Flow Diagram

```
PART A: PROOF GENERATION
═════════════════════════════════════════════

┌─────────┐
│ Creator │
└────┬────┘
     │
     │ 1. Click "Generate Proof" for content
     ↓
┌──────────────┐
│   Frontend   │
└──────┬───────┘
       │
       │ 2. POST /creator/proof/generate
       │    {contentId, proofType, claims}
       ↓
┌──────────────┐
│ API Gateway  │
└──────┬───────┘
       │
       │ 3. Authenticate (must be creator)
       ↓
┌───────────────┐
│ Proof Service │
└──────┬────────┘
       │
       │ 4. Fetch private usage data
       ├─────────────>╔═══════════════╗
       │               ║ UsageTracker  ║
       │               ║   Contract    ║
       │<──────────────╚═══════════════╝
       │               5. usageEvents[] (decrypted for creator)
       │
       │ 6. Fetch public aggregate stats
       ├─────────────>╔═══════════════╗
       │               ║ UsageTracker  ║
       │<──────────────╚═══════════════╝
       │               7. publicStats: {
       │                   totalUses: 1247,
       │                   totalRevenue: 623.50,
       │                   uniqueLicensees: 5
       │                 }
       │
       │ 8. Generate ZK proof
       ├────────────>{ZK Prover}
       │              Circuit: AggregateStatsProof
       │
       │              Private Inputs:
       │              ├─ usageEvents[1247]
       │              ├─ paymentEvents[1247]
       │              └─ licenseeIds[5]
       │
       │              Public Outputs:
       │              ├─ contentId: "0x1a2b3c"
       │              ├─ totalUses: 1247
       │              ├─ totalRevenue: 623.50
       │              ├─ uniqueLicensees: 5
       │              └─ dateRange: {...}
       │
       │              Proof Generation: ~25 seconds
       │<─────────────
       │              9. zkProof = "0x8f3e7d6c..."
       │
       │ 10. Store proof on-chain
       ├─────────────>╔═══════════════╗
       │               ║ UsageTracker  ║
       │               ║   Contract    ║
       │               ╚═══════┬═══════╝
       │                       │
       │                       │ 11. Store proof
       │                       │     proofId → {
       │                       │       zkProof,
       │                       │       publicOutputs,
       │                       │       timestamp
       │                       │     }
       │                       ↓
       │                  ┌──────────┐
       │<─────────────────│Blockchain│
       │                  └──────────┘
       │                  12. txHash, proofId
       │
       │ 13. Generate QR code
       │     qrCode = QR("https://marketplace.io/verify/{proofId}")
       │
       │ 14. Cache in database
       ├────────────>[(PostgreSQL)]
       │              INSERT INTO proofs
       │
       │ 15. Return response
       ↓
┌──────────────┐
│   Frontend   │ Display: proof, link, QR code
└──────────────┘


PART B: PROOF VERIFICATION
═════════════════════════════════════════════

┌──────────┐
│ Verifier │ (investor, auditor, etc.)
└────┬─────┘
     │
     │ 1. Visit: marketplace.io/verify/{proofId}
     ↓
┌──────────────────┐
│ Verification     │
│ Page (Frontend)  │
└──────┬───────────┘
       │
       │ 2. GET /verify/proof/{proofId}
       ↓
┌──────────────┐
│ API Gateway  │
└──────┬───────┘
       │
       │ 3. No authentication required (public)
       ↓
┌──────────────────┐
│ Verification     │
│ Service          │
└──────┬───────────┘
       │
       │ 4. Fetch proof from blockchain
       ├─────────────>╔═══════════════╗
       │               ║ UsageTracker  ║
       │               ║   Contract    ║
       │<──────────────╚═══════════════╝
       │               5. {
       │                   zkProof: "0x8f3e...",
       │                   publicOutputs: {...},
       │                   timestamp: 1699876543
       │                 }
       │
       │ 6. Verify proof cryptographically
       ├────────────>{ZK Verifier}
       │              ├─ Load verification key
       │              ├─ Verify proof against public outputs
       │              └─ Check proof format & signatures
       │<─────────────
       │              7. valid = true
       │
       │ 8. Check blockchain confirmations
       ├─────────────>┌──────────┐
       │               │Blockchain│
       │<──────────────└──────────┘
       │               9. confirmations: 150 (sufficient)
       │
       │ 10. Fetch content metadata (optional)
       ├─────────────>╔═══════════════╗
       │               ║ContentRegistry║
       │<──────────────╚═══════════════╝
       │               11. contentInfo: {
       │                     title: "Sunset Collection",
       │                     creator: "0x742d35Cc"
       │                   }
       │
       │ 12. Return verification result
       ↓
┌──────────────────┐
│ Verification     │ Display: ✓ Verified
│ Page (Frontend)  │ - Total Uses: 1,247
└──────────────────┘ - Revenue: $623.50
                      - Date Range: Jan-Nov 2025
                      - Blockchain TX: 0x...
```

---

## Flow 7: Analytics Dashboard

### Real-Time Analytics Update

```
Blockchain Events → Event Listener → Analytics Service → Database
                                           ↓
                                     Aggregate Stats → Cache (Redis)
                                           ↓
                                     Frontend polls → Display
```

### Detailed Flow Diagram

```
ANALYTICS UPDATE PIPELINE
═════════════════════════════════════════════

┌──────────┐
│Blockchain│ UsageLogged event
└────┬─────┘
     │
     │ Event Stream
     ↓
┌───────────────────┐
│ Event Listener    │
│ (Background Job)  │
└────┬──────────────┘
     │
     │ 1. Parse event: {
     │      contentId,
     │      licenseId,
     │      timestamp
     │    }
     ↓
┌───────────────────┐
│ Analytics Service │
└────┬──────────────┘
     │
     │ 2. Update usage event
     ├────────────>[(PostgreSQL)]
     │              INSERT INTO usage_events
     │              (content_id, license_id, timestamp)
     │
     │ 3. Refresh materialized view
     ├────────────>[(PostgreSQL)]
     │              REFRESH MATERIALIZED VIEW
     │              content_analytics
     │
     │ 4. Update cache
     ├────────────>[(Redis)]
     │              SET analytics:{contentId} {
     │                totalUses: 1248,  // +1
     │                totalRevenue: 624.00,  // +0.50
     │                lastAccessed: "2025-11-11T14:00:00Z"
     │              }
     │              EXPIRE 300  // 5 minute cache
     │
     │ 5. Publish update (pub/sub)
     ├────────────>[(Redis Pub/Sub)]
     │              PUBLISH analytics:updates {
     │                contentId: "0x1a2b3c",
     │                type: "usage",
     │                delta: +1
     │              }


DASHBOARD REAL-TIME UPDATES
═════════════════════════════════════════════

┌──────────────┐
│   Frontend   │
│  (Dashboard) │
└──────┬───────┘
       │
       │ 1. WebSocket connection
       │    ws://api.marketplace.io/analytics/stream
       ↓
┌──────────────┐
│ API Gateway  │
└──────┬───────┘
       │
       │ 2. Subscribe to Redis pub/sub
       ├────────────>[(Redis Pub/Sub)]
       │              SUBSCRIBE analytics:updates
       │
       │ 3. Receive update
       │<─────────────
       │              {
       │                contentId: "0x1a2b3c",
       │                type: "usage",
       │                delta: +1
       │              }
       │
       │ 4. Push to client via WebSocket
       ↓
┌──────────────┐
│   Frontend   │ Update UI:
│  (Dashboard) │ - Increment usage counter
└──────────────┘ - Update chart
                  - Animate notification


DASHBOARD INITIAL LOAD
═════════════════════════════════════════════

┌──────────────┐
│   Frontend   │
│  (Dashboard) │
└──────┬───────┘
       │
       │ 1. GET /creator/{address}/analytics?period=month
       ↓
┌──────────────┐
│ API Gateway  │
└──────┬───────┘
       │
       │ 2. Authenticate
       ↓
┌───────────────────┐
│ Analytics Service │
└────┬──────────────┘
     │
     │ 3. Check cache
     ├────────────>[(Redis)]
     │<─────────────
     │              Cache HIT
     │              Return cached analytics
     │              (if cache MISS, query DB)
     │
     │ 4. Fetch additional data
     ├────────────>[(PostgreSQL)]
     │              SELECT * FROM content_analytics
     │              WHERE creator_address = $1
     │              AND period = 'month'
     │<─────────────
     │              5. Rows returned
     │
     │ 6. Calculate trends
     │    currentMonth = 1247 uses
     │    lastMonth = 892 uses
     │    growth = (1247 - 892) / 892 = 39.8%
     │
     │ 7. Format response
     ↓
┌──────────────┐
│   Frontend   │ Render:
│  (Dashboard) │ - Summary cards
└──────────────┘ - Charts (revenue, usage over time)
                  - Top content table
                  - Recent activity feed
```

---

## Data State Diagrams

### Content Lifecycle

```
┌─────────┐
│ CREATED │ registerContent()
└────┬────┘
     │
     ↓
┌───────────┐
│ REGISTERED│ (on blockchain)
└────┬──────┘
     │
     │ createLicense()
     ↓
┌──────────┐
│ LICENSED │ (available for purchase)
└────┬─────┘
     │
     │ first access
     ↓
┌────────┐
│ ACTIVE │ (being used)
└────┬───┘
     │
     │ creator deletes / deactivates
     ↓
┌──────────┐
│ ARCHIVED │ (no longer available)
└──────────┘
```

### License Lifecycle

```
┌─────────┐
│ CREATED │ createLicenseTerms()
└────┬────┘
     │
     ↓
┌──────────────┐
│ AVAILABLE    │ (visible in marketplace)
└────┬─────────┘
     │
     │ purchaseLicense()
     ↓
┌──────────────┐
│ PURCHASED    │ (owned by licensee)
└────┬─────────┘
     │
     │ first content access
     ↓
┌──────────────┐
│ IN_USE       │ (actively being used)
└────┬─────────┘
     │
     ├─ maxUses reached ────────> EXHAUSTED
     │
     ├─ expiration date passed ──> EXPIRED
     │
     ├─ revoked by creator ─────> REVOKED
     │
     └─ no issues ──────────────> ACTIVE
```

### Payment Lifecycle

```
┌─────────┐
│ PENDING │ (awaiting usage event)
└────┬────┘
     │
     │ UsageLogged event
     ↓
┌────────────┐
│ PROCESSING │ (escrow release initiated)
└────┬───────┘
     │
     │ blockchain confirmation
     ↓
┌───────────┐
│ COMPLETED │ (funds transferred to creator)
└────┬──────┘
     │
     │ creator withdraws
     ↓
┌────────────┐
│ WITHDRAWN  │ (funds in creator's wallet)
└────────────┘
```

---

## Error Flows

### Error Flow 1: Invalid License

```
AI Company → POST /content/{id}/access
                ↓
           Verify License
                ↓
         License EXPIRED
                ↓
           Return 400
           {
             error: "INVALID_LICENSE",
             message: "License expired on 2025-11-10",
             details: {
               licenseId,
               expiredAt
             }
           }
```

### Error Flow 2: IPFS Unavailable

```
AI Company → POST /content/{id}/access
                ↓
         Fetch from IPFS
                ↓
         IPFS TIMEOUT
                ↓
           Retry (3x)
                ↓
         Still failed
                ↓
           Return 503
           {
             error: "IPFS_UNAVAILABLE",
             message: "Content temporarily unavailable",
             retryAfter: 60
           }
```

### Error Flow 3: Blockchain Transaction Failed

```
Creator → POST /content/register
              ↓
       Upload to IPFS ✓
              ↓
     Register on blockchain
              ↓
     Transaction REVERTED
     (gas too low)
              ↓
     Cleanup: Delete IPFS upload
              ↓
          Return 503
          {
            error: "BLOCKCHAIN_ERROR",
            message: "Transaction failed: gas too low",
            details: {
              txHash,
              gasProvided,
              gasRequired
            }
          }
```

### Error Flow 4: ZK Proof Generation Failed

```
Creator → POST /creator/proof/generate
              ↓
       Fetch usage data ✓
              ↓
       Generate ZK proof
              ↓
       Proof generation ERROR
       (circuit constraint failed)
              ↓
          Log error
              ↓
          Return 500
          {
            error: "PROOF_GENERATION_FAILED",
            message: "Unable to generate proof",
            supportId: "err_abc123"
          }

          (Support team investigates)
```

---

## Performance Optimizations

### Caching Strategy

```
Request Flow with Cache:

GET /content/{id}
    ↓
Check [(Redis Cache)]
    ├─ HIT → Return cached response (< 5ms)
    │
    └─ MISS → Query [(Database)]
              ↓
           Cache result in [(Redis)]
           TTL: 5 minutes
              ↓
           Return response
```

### Database Query Optimization

```
Slow Query (Before):
SELECT * FROM usage_events
WHERE content_id = '0x1a2b3c'
  AND timestamp >= '2025-11-01'
  AND timestamp <= '2025-11-30'
ORDER BY timestamp DESC;

Query Time: ~2.5 seconds (millions of rows)

Optimized (After):
1. Add index: CREATE INDEX idx_usage_content_time
              ON usage_events(content_id, timestamp DESC);

2. Use materialized view for aggregates:
   SELECT * FROM content_analytics_monthly
   WHERE content_id = '0x1a2b3c'
     AND month = '2025-11';

Query Time: ~15ms
```

### Batch Processing

```
Instead of:
  For each usage event:
    1. Generate proof
    2. Submit to blockchain (separate TX)

  = 1000 events = 1000 transactions = $$$

Optimized:
  Batch 100 usage events:
    1. Generate aggregated proof
    2. Submit single batch TX

  = 1000 events = 10 transactions = $
```

---

## Summary

This document provides comprehensive data flow diagrams for all major system interactions in the Privacy-Preserving AI Training Data Marketplace. Each flow shows:

- **Actors**: Who initiates the flow
- **Services**: Which components are involved
- **Data Transformations**: How data changes at each step
- **Privacy Preservation**: What information remains hidden
- **Error Handling**: What happens when things go wrong

Use these flows as a reference during implementation to ensure all edge cases and integrations are properly handled.

---

## Next Steps

1. Review flows with team
2. Identify any missing scenarios
3. Create sequence diagrams for complex interactions
4. Define monitoring points for each flow
5. Set up logging at key decision points
