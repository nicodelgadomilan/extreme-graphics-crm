import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { estimates } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authentication check
    const authSession = await auth.api.getSession({ headers: request.headers });
    if (!authSession) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const estimateId = parseInt(id);

    // Fetch estimate with user ownership check
    const result = await db
      .select()
      .from(estimates)
      .where(
        and(
          eq(estimates.id, estimateId),
          eq(estimates.userId, authSession.user.id)
        )
      )
      .limit(1);

    // Check if estimate exists and belongs to user
    if (result.length === 0) {
      // Try to check if estimate exists at all (for better error message)
      const estimateExists = await db
        .select()
        .from(estimates)
        .where(eq(estimates.id, estimateId))
        .limit(1);

      if (estimateExists.length > 0) {
        // Estimate exists but belongs to another user
        return NextResponse.json(
          { error: 'Forbidden: You do not have access to this estimate', code: 'FORBIDDEN' },
          { status: 403 }
        );
      }

      // Estimate doesn't exist
      return NextResponse.json(
        { error: 'Estimate not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const estimate = result[0];

    // Parse items JSON field
    const parsedEstimate = {
      ...estimate,
      items: typeof estimate.items === 'string' 
        ? JSON.parse(estimate.items) 
        : estimate.items
    };

    return NextResponse.json(parsedEstimate, { status: 200 });
  } catch (error) {
    console.error('GET estimate error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}