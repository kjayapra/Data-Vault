import { NextRequest, NextResponse } from 'next/server';
import { dbOperations } from '@/lib/db';
import { initMidnightClient } from '@/lib/midnight';

// POST /api/license/purchase - Purchase a license
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contentId, walletAddress } = body;

    if (!contentId || !walletAddress) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Ensure user exists
    dbOperations.createUser(walletAddress, 'accessor');

    // Get content details
    const content = dbOperations.getContent(contentId);
    if (!content) {
      return NextResponse.json(
        { success: false, error: 'Content not found' },
        { status: 404 }
      );
    }

    if (!content.active) {
      return NextResponse.json(
        { success: false, error: 'Content is not active' },
        { status: 400 }
      );
    }

    // Purchase license on Midnight Network
    const midnightClient = initMidnightClient();
    const result = await midnightClient.purchaseLicense(
      contentId,
      content.price_per_use
    );

    // Save license to database
    const timestamp = Math.floor(Date.now() / 1000);
    dbOperations.createLicense({
      license_id: result.licenseId,
      content_id: contentId,
      licensee_address: walletAddress,
      purchase_time: timestamp,
      blockchain_tx: result.txHash,
    });

    return NextResponse.json({
      success: true,
      data: {
        licenseId: result.licenseId,
        contentId,
        txHash: result.txHash,
        pricePerUse: content.price_per_use,
      },
      message: 'License purchased successfully',
    });
  } catch (error: any) {
    console.error('Error purchasing license:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
