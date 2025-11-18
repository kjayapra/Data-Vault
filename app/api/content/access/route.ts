import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { dbOperations } from '@/lib/db';
import { initMidnightClient, generateUsageProof } from '@/lib/midnight';

// POST /api/content/access - Access content with license
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { licenseId, walletAddress } = body;

    if (!licenseId || !walletAddress) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get license details
    const license = dbOperations.getLicense(licenseId);
    if (!license) {
      return NextResponse.json(
        { success: false, error: 'License not found' },
        { status: 404 }
      );
    }

    // Verify license ownership
    if (license.licensee_address !== walletAddress) {
      return NextResponse.json(
        { success: false, error: 'Not authorized to use this license' },
        { status: 403 }
      );
    }

    if (!license.active) {
      return NextResponse.json(
        { success: false, error: 'License is not active' },
        { status: 400 }
      );
    }

    // Get content details
    const content = dbOperations.getContent(license.content_id);
    if (!content) {
      return NextResponse.json(
        { success: false, error: 'Content not found' },
        { status: 404 }
      );
    }

    // Generate ZK proof for usage
    const timestamp = Math.floor(Date.now() / 1000);
    const usageProof = generateUsageProof({
      licenseId,
      timestamp,
      nonce: Math.random().toString(36),
    });

    // Log usage on Midnight Network
    const midnightClient = initMidnightClient();
    const result = await midnightClient.accessContent(licenseId, usageProof);

    // Save usage event to database
    dbOperations.createUsageEvent({
      event_id: result.eventId,
      content_id: content.content_id,
      license_id: licenseId,
      timestamp,
      blockchain_tx: result.txHash,
    });

    // Get file from upload
    const upload = dbOperations.getUpload(content.content_hash);
    if (!upload) {
      return NextResponse.json(
        { success: false, error: 'File not found' },
        { status: 404 }
      );
    }

    // Read file
    const fileBuffer = await readFile(upload.file_path);
    const base64File = fileBuffer.toString('base64');

    return NextResponse.json({
      success: true,
      data: {
        contentUrl: `/api/files/${content.content_hash}`,
        fileName: upload.file_name,
        mimeType: upload.mime_type,
        fileSize: upload.file_size,
        fileData: `data:${upload.mime_type};base64,${base64File}`,
        eventId: result.eventId,
        txHash: result.txHash,
      },
      message: 'Content accessed successfully',
    });
  } catch (error: any) {
    console.error('Error accessing content:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
