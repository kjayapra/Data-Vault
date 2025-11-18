import { NextRequest, NextResponse } from 'next/server';
import { dbOperations } from '@/lib/db';

// GET /api/creator/[address] - Get creator's content and stats
export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const content = dbOperations.getContentByCreator(params.address);
    const stats = dbOperations.getCreatorStats(params.address);

    return NextResponse.json({
      success: true,
      data: {
        content,
        stats,
      },
    });
  } catch (error: any) {
    console.error('Error fetching creator data:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
