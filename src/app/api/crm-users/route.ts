import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { crmUsers, user } from '@/db/schema';
import { eq, count } from 'drizzle-orm';
import { auth } from '@/lib/auth';

// Helper function to check if user is admin
async function checkAdminAccess(request: NextRequest) {
  const authSession = await auth.api.getSession({
    headers: request.headers,
  });

  if (!authSession?.user) {
    return { authorized: false, status: 401, error: 'Authentication required' };
  }

  // Get CRM user record by authUserId
  const crmUser = await db.select()
    .from(crmUsers)
    .where(eq(crmUsers.authUserId, authSession.user.id))
    .limit(1);

  if (crmUser.length === 0) {
    return { authorized: false, status: 403, error: 'CRM user not found' };
  }

  if (crmUser[0].role !== 'admin') {
    return { authorized: false, status: 403, error: 'Admin access required' };
  }

  return { authorized: true, user: crmUser[0] };
}

export async function GET(request: NextRequest) {
  try {
    // Check admin access
    const accessCheck = await checkAdminAccess(request);
    if (!accessCheck.authorized) {
      return NextResponse.json(
        { error: accessCheck.error, code: 'UNAUTHORIZED' },
        { status: accessCheck.status }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = (page - 1) * limit;

    // Get total count
    const totalCount = await db.select({ count: count() })
      .from(crmUsers);

    const total = totalCount[0].count;
    const totalPages = Math.ceil(total / limit);

    // Get paginated users
    const users = await db.select()
      .from(crmUsers)
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      users,
      total,
      page,
      totalPages
    }, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check admin access
    const accessCheck = await checkAdminAccess(request);
    if (!accessCheck.authorized) {
      return NextResponse.json(
        { error: accessCheck.error, code: 'UNAUTHORIZED' },
        { status: accessCheck.status }
      );
    }

    const body = await request.json();
    const { authUserId, email, name, role = 'agent' } = body;

    // Validate required fields
    if (!authUserId) {
      return NextResponse.json(
        { error: 'authUserId is required', code: 'MISSING_AUTH_USER_ID' },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: 'email is required', code: 'MISSING_EMAIL' },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: 'name is required', code: 'MISSING_NAME' },
        { status: 400 }
      );
    }

    // Validate role
    if (role && !['admin', 'agent'].includes(role)) {
      return NextResponse.json(
        { error: 'role must be either "admin" or "agent"', code: 'INVALID_ROLE' },
        { status: 400 }
      );
    }

    // Validate authUserId exists in user table
    const authUser = await db.select()
      .from(user)
      .where(eq(user.id, authUserId))
      .limit(1);

    if (authUser.length === 0) {
      return NextResponse.json(
        { error: 'Auth user not found', code: 'AUTH_USER_NOT_FOUND' },
        { status: 400 }
      );
    }

    // Check if email is already used
    const existingEmail = await db.select()
      .from(crmUsers)
      .where(eq(crmUsers.email, email.toLowerCase().trim()))
      .limit(1);

    if (existingEmail.length > 0) {
      return NextResponse.json(
        { error: 'Email already exists', code: 'EMAIL_EXISTS' },
        { status: 400 }
      );
    }

    // Check if authUserId is already linked
    const existingAuthUser = await db.select()
      .from(crmUsers)
      .where(eq(crmUsers.authUserId, authUserId))
      .limit(1);

    if (existingAuthUser.length > 0) {
      return NextResponse.json(
        { error: 'Auth user already linked to a CRM user', code: 'AUTH_USER_LINKED' },
        { status: 400 }
      );
    }

    // Create new CRM user
    const newCrmUser = await db.insert(crmUsers)
      .values({
        authUserId,
        email: email.toLowerCase().trim(),
        name: name.trim(),
        role,
      })
      .returning();

    return NextResponse.json(newCrmUser[0], { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Check admin access
    const accessCheck = await checkAdminAccess(request);
    if (!accessCheck.authorized) {
      return NextResponse.json(
        { error: accessCheck.error, code: 'UNAUTHORIZED' },
        { status: accessCheck.status }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { role, name } = body;

    // Validate that at least one field is provided
    if (!role && !name) {
      return NextResponse.json(
        { error: 'At least one field (role or name) must be provided', code: 'NO_UPDATE_FIELDS' },
        { status: 400 }
      );
    }

    // Validate role if provided
    if (role && !['admin', 'agent'].includes(role)) {
      return NextResponse.json(
        { error: 'role must be either "admin" or "agent"', code: 'INVALID_ROLE' },
        { status: 400 }
      );
    }

    // Check if CRM user exists
    const existingUser = await db.select()
      .from(crmUsers)
      .where(eq(crmUsers.id, parseInt(id)))
      .limit(1);

    if (existingUser.length === 0) {
      return NextResponse.json(
        { error: 'CRM user not found', code: 'USER_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Prepare update object
    const updateData: any = {
      updatedAt: new Date().toISOString()
    };

    if (role) {
      updateData.role = role;
    }

    if (name) {
      updateData.name = name.trim();
    }

    // Update CRM user
    const updated = await db.update(crmUsers)
      .set(updateData)
      .where(eq(crmUsers.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });

  } catch (error) {
    console.error('PATCH error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}