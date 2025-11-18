import { NextRequest, NextResponse } from 'next/server';
import { dbOperations } from '@/lib/db';

// GET /api/stats - Get platform statistics
export async function GET(request: NextRequest) {
  try {
    const stats = dbOperations.getPlatformStats();

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
