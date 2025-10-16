import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { crmUsers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Validate session using better-auth
    const authSession = await auth.api.getSession({
      headers: request.headers,
    });

    if (!authSession) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    // Get the authenticated user's CRM profile to check role
    const [authenticatedUser] = await db
      .select()
      .from(crmUsers)
      .where(eq(crmUsers.authUserId, authSession.user.id))
      .limit(1);

    if (!authenticatedUser) {
      return NextResponse.json(
        { error: 'User profile not found', code: 'USER_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Check if user has admin role
    if (authenticatedUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required', code: 'FORBIDDEN' },
        { status: 403 }
      );
    }

    // Validate ID parameter
    const { id } = await params;
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Get the requested CRM user by ID
    const [crmUser] = await db
      .select()
      .from(crmUsers)
      .where(eq(crmUsers.id, parseInt(id)))
      .limit(1);

    if (!crmUser) {
      return NextResponse.json(
        { error: 'User not found', code: 'USER_NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json(crmUser, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}