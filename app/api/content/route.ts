import { NextRequest, NextResponse } from 'next/server';
import { dbOperations } from '@/lib/db';

// GET /api/content - Get all content or search
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');
    const contentType = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let content;

    if (query) {
      content = dbOperations.searchContent(query, contentType || undefined);
    } else {
      content = dbOperations.getAllContent(limit, offset);
    }

    return NextResponse.json({
      success: true,
      data: content,
      count: content.length,
    });
  } catch (error: any) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
