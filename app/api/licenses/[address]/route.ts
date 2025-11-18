import { NextRequest, NextResponse } from 'next/server';
import { dbOperations } from '@/lib/db';

// GET /api/licenses/[address] - Get user's licenses
export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const licenses = dbOperations.getLicensesByLicensee(params.address);

    // Get usage counts for each license
    const licensesWithUsage = licenses.map((license: any) => {
      const usage = dbOperations.getUsageByLicense(license.license_id);
      return {
        ...license,
        usage_count: usage.length,
      };
    });

    return NextResponse.json({
      success: true,
      data: licensesWithUsage,
      count: licensesWithUsage.length,
    });
  } catch (error: any) {
    console.error('Error fetching licenses:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
