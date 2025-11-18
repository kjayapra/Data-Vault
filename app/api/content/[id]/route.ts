import { NextRequest, NextResponse } from 'next/server';
import { dbOperations } from '@/lib/db';

// GET /api/content/[id] - Get specific content
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const content = dbOperations.getContent(params.id);

    if (!content) {
      return NextResponse.json(
        { success: false, error: 'Content not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: content,
    });
  } catch (error: any) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
