# API Specification - Privacy-Preserving AI Training Data Marketplace

## Document Information

- **Version**: 1.0.0
- **Date**: 2025-11-11
- **Base URL**: `https://api.marketplace.io/v1`
- **Protocol**: REST over HTTPS
- **Authentication**: API Key, JWT, Web3 Signature

---

## Table of Contents

1. [Authentication](#authentication)
2. [Error Handling](#error-handling)
3. [Rate Limiting](#rate-limiting)
4. [Creator APIs](#creator-apis)
5. [AI Company APIs](#ai-company-apis)
6. [Verification APIs](#verification-apis)
7. [Webhooks](#webhooks)
8. [SDK Reference](#sdk-reference)

---

## Authentication

### Methods

#### 1. API Key Authentication
Used for programmatic access (AI companies accessing content).

```http
GET /content/{contentId}/access
Authorization: Bearer sk_live_abc123def456
```

#### 2. JWT Token Authentication
Used for web application sessions.

```http
GET /creator/analytics
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 3. Web3 Signature Authentication
Used for wallet-based operations.

```http
POST /content/register
X-Wallet-Address: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
X-Signature: 0x8f3e...
X-Timestamp: 1699876543
```

### Obtaining API Keys

**Endpoint:** `POST /auth/api-keys`

**Request:**
```json
{
  "name": "Production Training Pipeline",
  "rateLimit": 1000,
  "expiresInDays": 365
}
```

**Response:**
```json
{
  "apiKey": "sk_live_abc123def456",
  "keyId": "key_789xyz",
  "name": "Production Training Pipeline",
  "rateLimit": 1000,
  "createdAt": "2025-11-11T10:00:00Z",
  "expiresAt": "2026-11-11T10:00:00Z"
}
```

**Important:** API keys are shown only once. Store securely.

---

## Error Handling

### Error Response Format

```json
{
  "error": {
    "code": "INVALID_LICENSE",
    "message": "The provided license has expired",
    "details": {
      "licenseId": "0x1a2b3c",
      "expiredAt": "2025-11-10T10:00:00Z"
    },
    "requestId": "req_abc123",
    "timestamp": "2025-11-11T10:00:00Z"
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `AUTHENTICATION_FAILED` | 401 | Invalid or missing authentication |
| `INSUFFICIENT_PERMISSIONS` | 403 | User lacks required permissions |
| `RESOURCE_NOT_FOUND` | 404 | Content, license, or user not found |
| `INVALID_LICENSE` | 400 | License expired or exceeded usage |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `PAYMENT_REQUIRED` | 402 | Insufficient funds or payment failed |
| `INVALID_PROOF` | 400 | ZK proof verification failed |
| `BLOCKCHAIN_ERROR` | 503 | Blockchain transaction failed |
| `IPFS_UNAVAILABLE` | 503 | Content not accessible on IPFS |
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `INTERNAL_ERROR` | 500 | Server error |

### Example Error Responses

#### Authentication Failed
```json
{
  "error": {
    "code": "AUTHENTICATION_FAILED",
    "message": "API key is invalid or expired",
    "requestId": "req_abc123"
  }
}
```

#### Rate Limit Exceeded
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit of 1000 requests per hour exceeded",
    "details": {
      "limit": 1000,
      "remaining": 0,
      "resetAt": "2025-11-11T11:00:00Z"
    }
  }
}
```

---

## Rate Limiting

### Headers

All responses include rate limit information:

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 997
X-RateLimit-Reset: 1699876543
```

### Limits by Tier

| Tier | Requests/Hour | Burst |
|------|---------------|-------|
| Free | 100 | 10 |
| Basic | 1,000 | 50 |
| Pro | 10,000 | 200 |
| Enterprise | Unlimited | Unlimited |

### Rate Limit Strategy

- **IP-based**: For unauthenticated requests
- **API Key-based**: For authenticated requests
- **Endpoint-specific**: Some endpoints have stricter limits

---

## Creator APIs

### 1. Register Content

Register new content on the marketplace.

**Endpoint:** `POST /content/register`

**Authentication:** Web3 Signature or JWT

**Request (multipart/form-data):**

```http
POST /content/register
Content-Type: multipart/form-data
Authorization: Bearer eyJhbGciOi...

--boundary
Content-Disposition: form-data; name="file"; filename="photo.jpg"
Content-Type: image/jpeg

[binary data]
--boundary
Content-Disposition: form-data; name="metadata"

{
  "title": "Sunset at Golden Gate Bridge",
  "description": "Professional high-resolution photo",
  "contentType": "image/jpeg",
  "tags": ["nature", "sunset", "bridge", "photography"],
  "licenseTerms": {
    "type": "per_use",
    "pricePerUse": 0.50,
    "maxUses": 1000,
    "allowedUses": ["training", "research"],
    "restrictedUses": ["commercial-distribution"]
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "contentId": "0x1a2b3c4d5e6f",
    "ipfsCid": "QmXyz123abc",
    "contentHash": "0xabc123def456",
    "licenseId": "0x7d8e9f",
    "blockchain": {
      "txHash": "0xtx123",
      "blockNumber": 12345,
      "confirmations": 3
    },
    "urls": {
      "content": "https://ipfs.io/ipfs/QmXyz123abc",
      "details": "https://marketplace.io/content/0x1a2b3c4d5e6f",
      "license": "https://marketplace.io/license/0x7d8e9f"
    }
  },
  "timestamp": "2025-11-11T10:00:00Z"
}
```

**Error Cases:**

- `400`: Invalid file format, metadata validation failed
- `401`: Authentication failed
- `413`: File too large (max 500MB)
- `503`: IPFS or blockchain unavailable

---

### 2. Get Content Details

Retrieve details about registered content.

**Endpoint:** `GET /content/{contentId}`

**Authentication:** Optional (public data)

**Request:**

```http
GET /content/0x1a2b3c4d5e6f
```

**Response:**

```json
{
  "success": true,
  "data": {
    "contentId": "0x1a2b3c4d5e6f",
    "creator": {
      "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
      "verified": true,
      "reputation": 4.8
    },
    "metadata": {
      "title": "Sunset at Golden Gate Bridge",
      "description": "Professional high-resolution photo",
      "contentType": "image/jpeg",
      "fileSize": 8456320,
      "tags": ["nature", "sunset", "bridge"],
      "createdAt": "2025-11-11T10:00:00Z"
    },
    "ipfs": {
      "cid": "QmXyz123abc",
      "previewUrl": "https://ipfs.io/ipfs/QmPreview123",
      "availability": "online"
    },
    "licenses": [
      {
        "licenseId": "0x7d8e9f",
        "type": "per_use",
        "pricePerUse": 0.50,
        "currency": "USD",
        "maxUses": 1000,
        "active": true
      },
      {
        "licenseId": "0x8e9f0a",
        "type": "subscription",
        "price": 500,
        "duration": 2592000,
        "active": true
      }
    ],
    "statistics": {
      "totalUses": 247,
      "uniqueLicensees": 5,
      "averageRating": 4.9
    },
    "blockchain": {
      "registrationTx": "0xtx123",
      "blockNumber": 12345,
      "network": "midnight-testnet"
    }
  }
}
```

---

### 3. Update Content Metadata

Update metadata (not the content file itself).

**Endpoint:** `PUT /content/{contentId}/metadata`

**Authentication:** Required (must be creator)

**Request:**

```json
{
  "title": "Updated Title",
  "description": "New description",
  "tags": ["new", "tags"]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "contentId": "0x1a2b3c4d5e6f",
    "metadata": {
      "title": "Updated Title",
      "description": "New description",
      "tags": ["new", "tags"]
    },
    "updatedAt": "2025-11-11T11:00:00Z"
  }
}
```

---

### 4. Create License Terms

Create new license tier for existing content.

**Endpoint:** `POST /content/{contentId}/licenses`

**Authentication:** Required (must be creator)

**Request:**

```json
{
  "type": "subscription",
  "price": 500,
  "currency": "USD",
  "duration": 2592000,
  "maxUses": null,
  "allowedUses": ["training", "research", "commercial"],
  "restrictedUses": []
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "licenseId": "0x8e9f0a1b2c",
    "contentId": "0x1a2b3c4d5e6f",
    "terms": {
      "type": "subscription",
      "price": 500,
      "duration": 2592000
    },
    "blockchain": {
      "txHash": "0xtx456",
      "blockNumber": 12350
    },
    "createdAt": "2025-11-11T12:00:00Z"
  }
}
```

---

### 5. Get Creator Analytics

Retrieve analytics for creator's content.

**Endpoint:** `GET /creator/{creatorAddress}/analytics`

**Authentication:** Required

**Query Parameters:**

- `period`: `day` | `week` | `month` | `year` | `all` (default: `month`)
- `contentId`: Filter by specific content (optional)

**Request:**

```http
GET /creator/0x742d35Cc/analytics?period=month
Authorization: Bearer eyJhbGciOi...
```

**Response:**

```json
{
  "success": true,
  "data": {
    "summary": {
      "totalRevenue": 1247.50,
      "totalUses": 2495,
      "uniqueLicensees": 12,
      "activeContent": 8,
      "activeLicenses": 15
    },
    "revenue": {
      "current": 1247.50,
      "previous": 892.30,
      "change": 39.8,
      "trend": "up"
    },
    "topContent": [
      {
        "contentId": "0x1a2b3c",
        "title": "Sunset Collection",
        "uses": 1247,
        "revenue": 623.50,
        "growth": 23.5
      }
    ],
    "recentActivity": [
      {
        "type": "usage",
        "contentId": "0x1a2b3c",
        "timestamp": "2025-11-11T10:00:00Z",
        "amount": 0.50
      }
    ],
    "charts": {
      "revenueOverTime": [
        {"date": "2025-11-01", "value": 45.50},
        {"date": "2025-11-02", "value": 52.00}
      ],
      "usageOverTime": [
        {"date": "2025-11-01", "value": 91},
        {"date": "2025-11-02", "value": 104}
      ]
    },
    "period": "month",
    "startDate": "2025-10-11T00:00:00Z",
    "endDate": "2025-11-11T23:59:59Z"
  }
}
```

---

### 6. Generate Verifiable Proof

Generate ZK proof of usage statistics.

**Endpoint:** `POST /creator/proof/generate`

**Authentication:** Required

**Request:**

```json
{
  "contentId": "0x1a2b3c4d5e6f",
  "proofType": "aggregate_stats",
  "claims": {
    "totalUses": true,
    "totalRevenue": true,
    "uniqueLicensees": true,
    "dateRange": {
      "start": "2025-01-01T00:00:00Z",
      "end": "2025-11-11T23:59:59Z"
    }
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "proofId": "proof_abc123xyz",
    "zkProof": "0x8f3e7d6c...[long hex string]",
    "publicOutputs": {
      "contentId": "0x1a2b3c4d5e6f",
      "totalUses": 1247,
      "totalRevenue": 623.50,
      "uniqueLicensees": 5,
      "dateRange": {
        "start": "2025-01-01T00:00:00Z",
        "end": "2025-11-11T23:59:59Z"
      }
    },
    "blockchain": {
      "txHash": "0xtxProof789",
      "blockNumber": 12360
    },
    "verification": {
      "url": "https://marketplace.io/verify/proof_abc123xyz",
      "qrCode": "data:image/png;base64,iVBORw0KG..."
    },
    "generatedAt": "2025-11-11T13:00:00Z",
    "expiresAt": "2026-11-11T13:00:00Z"
  }
}
```

---

### 7. Withdraw Earnings

Withdraw earnings to creator's wallet.

**Endpoint:** `POST /creator/withdraw`

**Authentication:** Required (Web3 signature)

**Request:**

```json
{
  "amount": 500.00,
  "currency": "USD",
  "toAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "withdrawalId": "wd_xyz789",
    "amount": 500.00,
    "currency": "USD",
    "toAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "blockchain": {
      "txHash": "0xtxWithdraw123",
      "status": "pending",
      "estimatedConfirmation": "2025-11-11T13:05:00Z"
    },
    "fee": 2.50,
    "netAmount": 497.50,
    "initiatedAt": "2025-11-11T13:00:00Z"
  }
}
```

---

## AI Company APIs

### 1. Search Marketplace

Search for available content.

**Endpoint:** `GET /marketplace/search`

**Authentication:** Optional

**Query Parameters:**

- `q`: Search query (title, description, tags)
- `contentType`: Filter by type (`image`, `text`, `video`, `dataset`)
- `licenseType`: Filter by license (`per_use`, `subscription`, `unlimited`)
- `minPrice`, `maxPrice`: Price range
- `verified`: Only verified creators (`true` | `false`)
- `sort`: Sort by (`relevance`, `price`, `popularity`, `newest`)
- `page`, `limit`: Pagination (default: page=1, limit=20)

**Request:**

```http
GET /marketplace/search?q=nature+photography&contentType=image&minPrice=0.1&maxPrice=1.0&sort=popularity&page=1&limit=20
```

**Response:**

```json
{
  "success": true,
  "data": {
    "results": [
      {
        "contentId": "0x1a2b3c",
        "title": "Sunset at Golden Gate Bridge",
        "description": "Professional high-resolution photo",
        "contentType": "image/jpeg",
        "creator": {
          "address": "0x742d35Cc",
          "verified": true,
          "reputation": 4.8
        },
        "preview": {
          "thumbnailUrl": "https://ipfs.io/ipfs/QmThumb123",
          "dimensions": "4000x3000"
        },
        "licenses": [
          {
            "licenseId": "0x7d8e9f",
            "type": "per_use",
            "price": 0.50,
            "currency": "USD"
          }
        ],
        "statistics": {
          "uses": 247,
          "rating": 4.9
        },
        "tags": ["nature", "sunset", "bridge"]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 523,
      "totalPages": 27,
      "hasNext": true,
      "hasPrev": false
    },
    "filters": {
      "contentType": "image",
      "priceRange": [0.1, 1.0]
    }
  }
}
```

---

### 2. Purchase License

Purchase a license for content.

**Endpoint:** `POST /license/purchase`

**Authentication:** Required (Web3 signature)

**Request:**

```json
{
  "licenseId": "0x7d8e9f",
  "payment": {
    "method": "crypto",
    "amount": 0.50,
    "currency": "USD",
    "txHash": "0xPayment123"
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "purchaseId": "pur_abc123",
    "licenseId": "0x7d8e9f",
    "contentId": "0x1a2b3c4d5e6f",
    "licensee": "0xLicenseeAddress",
    "terms": {
      "type": "per_use",
      "pricePerUse": 0.50,
      "maxUses": 1000,
      "expiresAt": null
    },
    "credentials": {
      "accessToken": "zkCred_xyz789abc",
      "apiKey": "sk_live_def456ghi"
    },
    "blockchain": {
      "txHash": "0xtxPurchase456",
      "blockNumber": 12370,
      "confirmations": 3
    },
    "purchasedAt": "2025-11-11T14:00:00Z"
  }
}
```

---

### 3. Access Content

Access licensed content.

**Endpoint:** `POST /content/{contentId}/access`

**Authentication:** Required (API Key + License Token)

**Headers:**

```http
Authorization: Bearer sk_live_abc123def456
X-License-Token: zkCred_xyz789abc
```

**Request:**

```json
{
  "purpose": "training",
  "metadata": {
    "projectId": "proj_123",
    "batchId": "batch_456"
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "contentUrl": "https://ipfs.io/ipfs/QmXyz123abc",
    "contentType": "image/jpeg",
    "fileSize": 8456320,
    "expiresAt": "2025-11-11T15:00:00Z",
    "usage": {
      "eventId": "evt_abc123",
      "usageCount": 1,
      "remainingUses": 999,
      "zkProof": "0xProof123..."
    },
    "blockchain": {
      "txHash": "0xtxUsage789",
      "status": "confirmed"
    },
    "downloadHeaders": {
      "Authorization": "Bearer temp_token_xyz"
    },
    "accessedAt": "2025-11-11T14:00:00Z"
  }
}
```

---

### 4. Get License Usage

View usage statistics for a license.

**Endpoint:** `GET /license/{licenseId}/usage`

**Authentication:** Required

**Query Parameters:**

- `startDate`, `endDate`: Date range (optional)

**Request:**

```http
GET /license/0x7d8e9f/usage?startDate=2025-11-01&endDate=2025-11-11
Authorization: Bearer sk_live_abc123def456
```

**Response:**

```json
{
  "success": true,
  "data": {
    "licenseId": "0x7d8e9f",
    "contentId": "0x1a2b3c4d5e6f",
    "summary": {
      "totalUses": 247,
      "remainingUses": 753,
      "totalCost": 123.50,
      "averageCostPerUse": 0.50
    },
    "terms": {
      "type": "per_use",
      "pricePerUse": 0.50,
      "maxUses": 1000,
      "purchasedAt": "2025-11-11T14:00:00Z"
    },
    "compliance": {
      "status": "compliant",
      "violations": []
    },
    "usageHistory": [
      {
        "eventId": "evt_abc123",
        "timestamp": "2025-11-11T14:00:00Z",
        "zkProof": "0xProof123",
        "cost": 0.50
      }
    ],
    "period": {
      "startDate": "2025-11-01T00:00:00Z",
      "endDate": "2025-11-11T23:59:59Z"
    }
  }
}
```

---

### 5. Generate Compliance Report

Generate proof of compliance with license terms.

**Endpoint:** `POST /compliance/verify`

**Authentication:** Required

**Request:**

```json
{
  "licenseId": "0x7d8e9f",
  "period": {
    "startDate": "2025-11-01T00:00:00Z",
    "endDate": "2025-11-11T23:59:59Z"
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "reportId": "report_xyz789",
    "licenseId": "0x7d8e9f",
    "contentId": "0x1a2b3c4d5e6f",
    "period": {
      "startDate": "2025-11-01T00:00:00Z",
      "endDate": "2025-11-11T23:59:59Z"
    },
    "compliance": {
      "status": "compliant",
      "summary": "All usage within license terms",
      "checks": [
        {
          "check": "usage_limit",
          "passed": true,
          "details": "247 uses of 1000 allowed"
        },
        {
          "check": "expiration",
          "passed": true,
          "details": "License has no expiration"
        },
        {
          "check": "payment",
          "passed": true,
          "details": "All payments settled"
        }
      ]
    },
    "proof": {
      "zkProof": "0xCompliance123...",
      "verificationUrl": "https://marketplace.io/verify/report_xyz789"
    },
    "blockchain": {
      "txHash": "0xtxCompliance",
      "blockNumber": 12380
    },
    "downloads": {
      "pdf": "https://api.marketplace.io/reports/report_xyz789.pdf",
      "json": "https://api.marketplace.io/reports/report_xyz789.json"
    },
    "generatedAt": "2025-11-11T15:00:00Z"
  }
}
```

---

## Verification APIs

### 1. Verify Proof

Verify a ZK proof publicly.

**Endpoint:** `POST /verify/proof`

**Authentication:** Not required (public)

**Request:**

```json
{
  "proofId": "proof_abc123xyz",
  "zkProof": "0x8f3e7d6c..."
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "valid": true,
    "proofId": "proof_abc123xyz",
    "proofType": "aggregate_stats",
    "publicOutputs": {
      "contentId": "0x1a2b3c4d5e6f",
      "totalUses": 1247,
      "totalRevenue": 623.50,
      "uniqueLicensees": 5,
      "dateRange": {
        "start": "2025-01-01T00:00:00Z",
        "end": "2025-11-11T23:59:59Z"
      }
    },
    "blockchain": {
      "txHash": "0xtxProof789",
      "blockNumber": 12360,
      "network": "midnight-testnet",
      "confirmations": 100
    },
    "verification": {
      "method": "zk-snark",
      "circuit": "usage_aggregation_v1",
      "verifiedAt": "2025-11-11T16:00:00Z"
    }
  }
}
```

---

### 2. Verify Content Authenticity

Check if content is registered and authentic.

**Endpoint:** `GET /verify/content/{contentHash}`

**Authentication:** Not required (public)

**Request:**

```http
GET /verify/content/0xabc123def456
```

**Response:**

```json
{
  "success": true,
  "data": {
    "registered": true,
    "contentHash": "0xabc123def456",
    "contentId": "0x1a2b3c4d5e6f",
    "creator": {
      "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
      "verified": true
    },
    "registration": {
      "timestamp": "2025-11-11T10:00:00Z",
      "txHash": "0xtx123",
      "blockNumber": 12345
    },
    "authenticity": {
      "verified": true,
      "method": "signature",
      "proof": "0xAuth123..."
    }
  }
}
```

---

### 3. Get Public Statistics

Retrieve public marketplace statistics.

**Endpoint:** `GET /verify/stats`

**Authentication:** Not required (public)

**Request:**

```http
GET /verify/stats
```

**Response:**

```json
{
  "success": true,
  "data": {
    "marketplace": {
      "totalContent": 12475,
      "totalCreators": 1823,
      "totalLicenses": 8941,
      "totalUsage": 1247531,
      "totalRevenue": 623765.50
    },
    "growth": {
      "contentGrowth": 12.5,
      "creatorGrowth": 8.3,
      "usageGrowth": 23.7
    },
    "popular": {
      "contentTypes": [
        {"type": "image", "count": 5892},
        {"type": "text", "count": 3421},
        {"type": "video", "count": 2103}
      ],
      "categories": [
        {"category": "nature", "count": 2341},
        {"category": "technology", "count": 1892}
      ]
    },
    "updatedAt": "2025-11-11T16:00:00Z"
  }
}
```

---

## Webhooks

### Configuration

**Endpoint:** `POST /webhooks`

**Request:**

```json
{
  "url": "https://your-server.com/webhook",
  "events": ["usage.created", "payment.completed", "license.purchased"],
  "secret": "whsec_abc123"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "webhookId": "wh_xyz789",
    "url": "https://your-server.com/webhook",
    "events": ["usage.created", "payment.completed"],
    "secret": "whsec_abc123",
    "createdAt": "2025-11-11T17:00:00Z"
  }
}
```

### Event Types

| Event | Description |
|-------|-------------|
| `content.registered` | New content registered |
| `license.purchased` | License purchased |
| `usage.created` | Content accessed |
| `payment.completed` | Payment processed |
| `compliance.violation` | License violation detected |
| `proof.generated` | ZK proof generated |

### Webhook Payload Example

```json
{
  "id": "evt_abc123",
  "type": "usage.created",
  "data": {
    "eventId": "evt_abc123",
    "contentId": "0x1a2b3c4d5e6f",
    "licenseId": "0x7d8e9f",
    "timestamp": "2025-11-11T14:00:00Z",
    "zkProof": "0xProof123...",
    "cost": 0.50
  },
  "createdAt": "2025-11-11T14:00:01Z"
}
```

### Signature Verification

Webhooks include `X-Signature` header for verification:

```
X-Signature: sha256=abc123def456...
```

Verify using your webhook secret:

```python
import hmac
import hashlib

def verify_webhook(payload, signature, secret):
    expected = hmac.new(
        secret.encode(),
        payload.encode(),
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(f"sha256={expected}", signature)
```

---

## SDK Reference

### Python SDK

#### Installation

```bash
pip install privacy-marketplace-sdk
```

#### Usage

```python
from privacy_marketplace import MarketplaceClient

# Initialize
client = MarketplaceClient(
    api_key="sk_live_abc123def456",
    base_url="https://api.marketplace.io/v1"
)

# Search marketplace
results = client.search(
    query="nature photography",
    content_type="image",
    price_range=(0.1, 1.0)
)

# Purchase license
license = client.purchase_license(
    license_id="0x7d8e9f",
    payment_tx="0xPayment123"
)

# Access content
content = client.get_content(
    content_id="0x1a2b3c4d5e6f",
    license_token=license.access_token
)

# Download file
content.download("./downloads/photo.jpg")

# Get usage stats
usage = client.get_license_usage(license_id="0x7d8e9f")
print(f"Used {usage.total_uses} of {usage.max_uses}")

# Generate compliance report
report = client.generate_compliance_report(
    license_id="0x7d8e9f"
)
report.download_pdf("compliance_report.pdf")
```

### JavaScript/TypeScript SDK

#### Installation

```bash
npm install @privacy-marketplace/sdk
```

#### Usage

```typescript
import { MarketplaceClient } from '@privacy-marketplace/sdk';

// Initialize
const client = new MarketplaceClient({
  apiKey: 'sk_live_abc123def456',
  baseUrl: 'https://api.marketplace.io/v1'
});

// Search marketplace
const results = await client.search({
  query: 'nature photography',
  contentType: 'image',
  priceRange: [0.1, 1.0]
});

// Purchase license
const license = await client.purchaseLicense({
  licenseId: '0x7d8e9f',
  paymentTx: '0xPayment123'
});

// Access content
const content = await client.getContent({
  contentId: '0x1a2b3c4d5e6f',
  licenseToken: license.accessToken
});

// Stream content to file
await content.downloadTo('./downloads/photo.jpg');

// Get usage stats
const usage = await client.getLicenseUsage('0x7d8e9f');
console.log(`Used ${usage.totalUses} of ${usage.maxUses}`);

// Generate compliance report
const report = await client.generateComplianceReport({
  licenseId: '0x7d8e9f'
});
await report.downloadPDF('compliance_report.pdf');
```

---

## API Versioning

- Current version: `v1`
- Version specified in URL: `/v1/...`
- Breaking changes will increment major version: `v2`, `v3`, etc.
- Non-breaking changes will not change version
- Deprecated endpoints supported for 6 months minimum

---

## Pagination

### Request

```http
GET /marketplace/search?page=2&limit=50
```

### Response

```json
{
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 50,
    "total": 523,
    "totalPages": 11,
    "hasNext": true,
    "hasPrev": true,
    "nextPage": "/marketplace/search?page=3&limit=50",
    "prevPage": "/marketplace/search?page=1&limit=50"
  }
}
```

---

## Testing

### Sandbox Environment

- Base URL: `https://api-sandbox.marketplace.io/v1`
- Use test API keys: `sk_test_...`
- Midnight testnet for blockchain
- No real payments

### Test Cards / Wallets

- Test wallet: `0xTestWallet123...`
- Test funds available via faucet
- All features available for testing

---

## Support

- **Documentation**: https://docs.marketplace.io
- **API Status**: https://status.marketplace.io
- **Support**: support@marketplace.io
- **Discord**: https://discord.gg/marketplace

---

## Changelog

### Version 1.0.0 (2025-11-11)
- Initial API release
- Core endpoints for content, licensing, usage
- ZK proof generation and verification
- Webhook support

---

This API specification provides a complete reference for integrating with the Privacy-Preserving AI Training Data Marketplace.
