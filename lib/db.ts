import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'datavault.db');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize database
const db = new Database(DB_PATH);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize schema
export function initializeDatabase() {
  db.exec(`
    -- Users table
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      wallet_address TEXT UNIQUE NOT NULL,
      role TEXT CHECK(role IN ('creator', 'accessor', 'both')) DEFAULT 'both',
      created_at INTEGER DEFAULT (strftime('%s', 'now')),
      updated_at INTEGER DEFAULT (strftime('%s', 'now'))
    );

    -- Content table (mirror of on-chain data for search/caching)
    CREATE TABLE IF NOT EXISTS content (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content_id TEXT UNIQUE NOT NULL,
      creator_address TEXT NOT NULL,
      content_hash TEXT NOT NULL,
      ipfs_cid TEXT,
      title TEXT NOT NULL,
      description TEXT,
      content_type TEXT NOT NULL,
      file_size INTEGER,
      price_per_use TEXT NOT NULL,
      tags TEXT,
      blockchain_tx TEXT,
      active BOOLEAN DEFAULT 1,
      created_at INTEGER DEFAULT (strftime('%s', 'now')),
      FOREIGN KEY (creator_address) REFERENCES users(wallet_address)
    );

    -- License table (mirror of on-chain data)
    CREATE TABLE IF NOT EXISTS licenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      license_id TEXT UNIQUE NOT NULL,
      content_id TEXT NOT NULL,
      licensee_address TEXT NOT NULL,
      purchase_time INTEGER NOT NULL,
      blockchain_tx TEXT,
      active BOOLEAN DEFAULT 1,
      created_at INTEGER DEFAULT (strftime('%s', 'now')),
      FOREIGN KEY (content_id) REFERENCES content(content_id),
      FOREIGN KEY (licensee_address) REFERENCES users(wallet_address)
    );

    -- Usage events (cached for analytics)
    CREATE TABLE IF NOT EXISTS usage_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id TEXT UNIQUE NOT NULL,
      content_id TEXT NOT NULL,
      license_id TEXT NOT NULL,
      blockchain_tx TEXT,
      timestamp INTEGER NOT NULL,
      created_at INTEGER DEFAULT (strftime('%s', 'now')),
      FOREIGN KEY (content_id) REFERENCES content(content_id),
      FOREIGN KEY (license_id) REFERENCES licenses(license_id)
    );

    -- File uploads (local storage tracking)
    CREATE TABLE IF NOT EXISTS uploads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      file_hash TEXT UNIQUE NOT NULL,
      file_path TEXT NOT NULL,
      file_name TEXT NOT NULL,
      file_size INTEGER NOT NULL,
      mime_type TEXT NOT NULL,
      uploader_address TEXT NOT NULL,
      created_at INTEGER DEFAULT (strftime('%s', 'now')),
      FOREIGN KEY (uploader_address) REFERENCES users(wallet_address)
    );

    -- Create indexes for better query performance
    CREATE INDEX IF NOT EXISTS idx_content_creator ON content(creator_address);
    CREATE INDEX IF NOT EXISTS idx_content_type ON content(content_type);
    CREATE INDEX IF NOT EXISTS idx_content_active ON content(active);
    CREATE INDEX IF NOT EXISTS idx_licenses_licensee ON licenses(licensee_address);
    CREATE INDEX IF NOT EXISTS idx_licenses_content ON licenses(content_id);
    CREATE INDEX IF NOT EXISTS idx_usage_content ON usage_events(content_id);
    CREATE INDEX IF NOT EXISTS idx_usage_license ON usage_events(license_id);
    CREATE INDEX IF NOT EXISTS idx_usage_timestamp ON usage_events(timestamp);
  `);

  console.log('Database initialized successfully');
}

// Database operations
export const dbOperations = {
  // User operations
  createUser(walletAddress: string, role: string = 'both') {
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO users (wallet_address, role)
      VALUES (?, ?)
    `);
    return stmt.run(walletAddress, role);
  },

  getUser(walletAddress: string) {
    const stmt = db.prepare('SELECT * FROM users WHERE wallet_address = ?');
    return stmt.get(walletAddress);
  },

  // Content operations
  createContent(data: {
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
  }) {
    const stmt = db.prepare(`
      INSERT INTO content (
        content_id, creator_address, content_hash, ipfs_cid, title,
        description, content_type, file_size, price_per_use, tags, blockchain_tx
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(
      data.content_id,
      data.creator_address,
      data.content_hash,
      data.ipfs_cid || null,
      data.title,
      data.description || null,
      data.content_type,
      data.file_size || null,
      data.price_per_use,
      data.tags || null,
      data.blockchain_tx || null
    );
  },

  getContent(contentId: string) {
    const stmt = db.prepare('SELECT * FROM content WHERE content_id = ?');
    return stmt.get(contentId);
  },

  getAllContent(limit: number = 50, offset: number = 0) {
    const stmt = db.prepare(`
      SELECT * FROM content
      WHERE active = 1
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `);
    return stmt.all(limit, offset);
  },

  getContentByCreator(creatorAddress: string) {
    const stmt = db.prepare(`
      SELECT * FROM content
      WHERE creator_address = ?
      ORDER BY created_at DESC
    `);
    return stmt.all(creatorAddress);
  },

  searchContent(query: string, contentType?: string) {
    let sql = `
      SELECT * FROM content
      WHERE active = 1
      AND (title LIKE ? OR description LIKE ? OR tags LIKE ?)
    `;
    const params: any[] = [`%${query}%`, `%${query}%`, `%${query}%`];

    if (contentType) {
      sql += ' AND content_type = ?';
      params.push(contentType);
    }

    sql += ' ORDER BY created_at DESC';
    const stmt = db.prepare(sql);
    return stmt.all(...params);
  },

  // License operations
  createLicense(data: {
    license_id: string;
    content_id: string;
    licensee_address: string;
    purchase_time: number;
    blockchain_tx?: string;
  }) {
    const stmt = db.prepare(`
      INSERT INTO licenses (
        license_id, content_id, licensee_address, purchase_time, blockchain_tx
      ) VALUES (?, ?, ?, ?, ?)
    `);
    return stmt.run(
      data.license_id,
      data.content_id,
      data.licensee_address,
      data.purchase_time,
      data.blockchain_tx || null
    );
  },

  getLicense(licenseId: string) {
    const stmt = db.prepare('SELECT * FROM licenses WHERE license_id = ?');
    return stmt.get(licenseId);
  },

  getLicensesByLicensee(licenseeAddress: string) {
    const stmt = db.prepare(`
      SELECT l.*, c.title, c.content_type, c.price_per_use
      FROM licenses l
      JOIN content c ON l.content_id = c.content_id
      WHERE l.licensee_address = ?
      ORDER BY l.created_at DESC
    `);
    return stmt.all(licenseeAddress);
  },

  // Usage event operations
  createUsageEvent(data: {
    event_id: string;
    content_id: string;
    license_id: string;
    timestamp: number;
    blockchain_tx?: string;
  }) {
    const stmt = db.prepare(`
      INSERT INTO usage_events (
        event_id, content_id, license_id, timestamp, blockchain_tx
      ) VALUES (?, ?, ?, ?, ?)
    `);
    return stmt.run(
      data.event_id,
      data.content_id,
      data.license_id,
      data.timestamp,
      data.blockchain_tx || null
    );
  },

  getUsageByContent(contentId: string) {
    const stmt = db.prepare(`
      SELECT * FROM usage_events
      WHERE content_id = ?
      ORDER BY timestamp DESC
    `);
    return stmt.all(contentId);
  },

  getUsageByLicense(licenseId: string) {
    const stmt = db.prepare(`
      SELECT * FROM usage_events
      WHERE license_id = ?
      ORDER BY timestamp DESC
    `);
    return stmt.all(licenseId);
  },

  // Upload operations
  createUpload(data: {
    file_hash: string;
    file_path: string;
    file_name: string;
    file_size: number;
    mime_type: string;
    uploader_address: string;
  }) {
    const stmt = db.prepare(`
      INSERT INTO uploads (
        file_hash, file_path, file_name, file_size, mime_type, uploader_address
      ) VALUES (?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(
      data.file_hash,
      data.file_path,
      data.file_name,
      data.file_size,
      data.mime_type,
      data.uploader_address
    );
  },

  getUpload(fileHash: string) {
    const stmt = db.prepare('SELECT * FROM uploads WHERE file_hash = ?');
    return stmt.get(fileHash);
  },

  // Analytics
  getCreatorStats(creatorAddress: string) {
    const stmt = db.prepare(`
      SELECT
        COUNT(DISTINCT c.content_id) as total_content,
        COUNT(DISTINCT l.license_id) as total_licenses,
        COUNT(DISTINCT ue.id) as total_uses,
        SUM(CAST(c.price_per_use AS REAL)) as estimated_revenue
      FROM content c
      LEFT JOIN licenses l ON c.content_id = l.content_id
      LEFT JOIN usage_events ue ON c.content_id = ue.content_id
      WHERE c.creator_address = ?
    `);
    return stmt.get(creatorAddress);
  },

  getPlatformStats() {
    const stmt = db.prepare(`
      SELECT
        (SELECT COUNT(*) FROM content WHERE active = 1) as total_content,
        (SELECT COUNT(DISTINCT creator_address) FROM content WHERE active = 1) as total_creators,
        (SELECT COUNT(*) FROM licenses WHERE active = 1) as total_licenses,
        (SELECT COUNT(*) FROM usage_events) as total_uses
    `);
    return stmt.get();
  },
};

export default db;
