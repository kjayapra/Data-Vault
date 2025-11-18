// Type definitions for the application

export interface User {
  id: number;
  wallet_address: string;
  role: 'creator' | 'accessor' | 'both';
  created_at: number;
  updated_at: number;
}

export interface Content {
  id: number;
  content_id: string;
  creator_address: string;
  content_hash: string;
  ipfs_cid?: string;
  title: string;
  description?: string;
  content_type: string;
  file_size?: number;
  price_per_use: string;
  tags?: string;
  blockchain_tx?: string;
  active: boolean;
  created_at: number;
}

export interface License {
  id: number;
  license_id: string;
  content_id: string;
  licensee_address: string;
  purchase_time: number;
  blockchain_tx?: string;
  active: boolean;
  created_at: number;
}

export interface UsageEvent {
  id: number;
  event_id: string;
  content_id: string;
  license_id: string;
  blockchain_tx?: string;
  timestamp: number;
  created_at: number;
}

export interface Upload {
  id: number;
  file_hash: string;
  file_path: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  uploader_address: string;
  created_at: number;
}

export interface CreatorStats {
  total_content: number;
  total_licenses: number;
  total_uses: number;
  estimated_revenue: number;
}

export interface PlatformStats {
  total_content: number;
  total_creators: number;
  total_licenses: number;
  total_uses: number;
}

// API Request/Response types
export interface RegisterContentRequest {
  title: string;
  description?: string;
  contentType: string;
  pricePerUse: string;
  tags?: string[];
  file: File;
}

export interface RegisterContentResponse {
  contentId: string;
  contentHash: string;
  ipfsCid?: string;
  txHash: string;
  message: string;
}

export interface PurchaseLicenseRequest {
  contentId: string;
}

export interface PurchaseLicenseResponse {
  licenseId: string;
  contentId: string;
  txHash: string;
  message: string;
}

export interface AccessContentRequest {
  licenseId: string;
}

export interface AccessContentResponse {
  contentUrl: string;
  eventId: string;
  txHash: string;
  remainingUses?: number;
  message: string;
}

export interface SearchContentRequest {
  query?: string;
  contentType?: string;
  minPrice?: string;
  maxPrice?: string;
  limit?: number;
  offset?: number;
}

export interface WalletState {
  address: string | null;
  connected: boolean;
  connecting: boolean;
  error: string | null;
}

export interface ContractState {
  totalContents: number;
  totalLicenses: number;
  totalRevenue: string;
  activeCreators: number;
}

// Midnight Network specific types
export interface ZKProof {
  proof: string;
  publicInputs: string[];
}

export interface MidnightTransaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
}
