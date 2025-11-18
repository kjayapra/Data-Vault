import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { dbOperations } from '@/lib/db';
import { generateFileHash, generateContentId, sanitizeFileName, validateContentType } from '@/lib/utils';
import { initMidnightClient } from '@/lib/midnight';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

// POST /api/upload - Upload content and register on blockchain
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const contentType = formData.get('contentType') as string;
    const pricePerUse = formData.get('pricePerUse') as string;
    const tags = formData.get('tags') as string;
    const walletAddress = formData.get('walletAddress') as string;

    // Validation
    if (!file || !title || !contentType || !pricePerUse || !walletAddress) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!validateContentType(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type' },
        { status: 400 }
      );
    }

    // Ensure user exists
    dbOperations.createUser(walletAddress, 'creator');

    // Read file buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate file hash
    const fileHash = generateFileHash(buffer);

    // Check if file already exists
    const existingUpload = dbOperations.getUpload(fileHash);
    if (existingUpload) {
      return NextResponse.json(
        { success: false, error: 'File already uploaded' },
        { status: 409 }
      );
    }

    // Save file to disk
    await mkdir(UPLOAD_DIR, { recursive: true });
    const safeFileName = sanitizeFileName(file.name);
    const fileName = `${Date.now()}-${safeFileName}`;
    const filePath = path.join(UPLOAD_DIR, fileName);
    await writeFile(filePath, buffer);

    // Save upload record
    dbOperations.createUpload({
      file_hash: fileHash,
      file_path: filePath,
      file_name: file.name,
      file_size: buffer.length,
      mime_type: file.type,
      uploader_address: walletAddress,
    });

    // Generate content ID
    const timestamp = Math.floor(Date.now() / 1000);
    const contentId = generateContentId(fileHash, walletAddress, timestamp);

    // Register on Midnight Network
    const midnightClient = initMidnightClient();
    const result = await midnightClient.registerContent({
      contentHash: fileHash,
      ipfsCid: '', // Empty for now, can add IPFS later
      title,
      contentType,
      pricePerUse,
    });

    // Save content to database
    dbOperations.createContent({
      content_id: result.contentId,
      creator_address: walletAddress,
      content_hash: fileHash,
      title,
      description,
      content_type: contentType,
      file_size: buffer.length,
      price_per_use: pricePerUse,
      tags,
      blockchain_tx: result.txHash,
    });

    return NextResponse.json({
      success: true,
      data: {
        contentId: result.contentId,
        contentHash: fileHash,
        txHash: result.txHash,
        fileName: file.name,
        fileSize: buffer.length,
      },
      message: 'Content uploaded and registered successfully',
    });
  } catch (error: any) {
    console.error('Error uploading content:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
