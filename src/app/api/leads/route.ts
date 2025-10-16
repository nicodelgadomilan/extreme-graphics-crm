import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { leads, crmUsers, users } from '@/db/schema';
import { eq, like, and, or, desc, sql } from 'drizzle-orm';
import { auth } from '@/lib/auth';

// Helper function to validate session from Authorization header
async function validateSession(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  
  try {
    const authSession = await auth.api.getSession({
      headers: request.headers,
    });
    
    if (!authSession?.user) {
      return null;
    }
    
    return authSession.user;
  } catch (error) {
    console.error('Session validation error:', error);
    return null;
  }
}

// Helper function to check if user is admin
async function isAdmin(userId: string) {
  try {
    const crmUser = await db.select()
      .from(crmUsers)
      .where(eq(crmUsers.authUserId, userId))
      .limit(1);
    
    return crmUser.length > 0 && crmUser[0].role === 'admin';
  } catch (error) {
    console.error('Admin check error:', error);
    return false;
  }
}

// Helper function to validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// POST - Create new lead (PUBLIC - no auth required)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, source, phone, notes, ticketNumber, coverImage } = body;

    // Validate required fields
    if (!name || !email || !source) {
      return NextResponse.json({ 
        error: "Missing required fields: name, email, and source are required",
        code: "MISSING_REQUIRED_FIELDS" 
      }, { status: 400 });
    }

    // Validate name not empty
    if (name.trim().length === 0) {
      return NextResponse.json({ 
        error: "Name cannot be empty",
        code: "INVALID_NAME" 
      }, { status: 400 });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json({ 
        error: "Invalid email format",
        code: "INVALID_EMAIL" 
      }, { status: 400 });
    }

    // Validate source value
    const validSources = ['chat', 'wizard', 'contact'];
    if (!validSources.includes(source)) {
      return NextResponse.json({ 
        error: "Invalid source. Must be one of: chat, wizard, contact",
        code: "INVALID_SOURCE" 
      }, { status: 400 });
    }

    const timestamp = new Date().toISOString();

    // Create new lead
    const newLead = await db.insert(leads).values({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone ? phone.trim() : null,
      source,
      status: 'new',
      notes: notes ? notes.trim() : null,
      ticketNumber: ticketNumber ? ticketNumber.trim() : null,
      coverImage: coverImage || null
    }).returning();

    return NextResponse.json(newLead[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

// GET - List leads with pagination and filtering (PROTECTED)
export async function GET(request: NextRequest) {
  try {
    // Validate session
    const user = await validateSession(request);
    if (!user) {
      return NextResponse.json({ 
        error: 'Authentication required',
        code: 'UNAUTHORIZED' 
      }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    
    // Pagination params
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = (page - 1) * limit;

    // Filter params
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const assignedTo = searchParams.get('assignedTo');

    // Build where conditions
    const conditions = [];

    if (status) {
      conditions.push(eq(leads.status, status));
    }

    if (assignedTo) {
      const assignedToId = parseInt(assignedTo);
      if (!isNaN(assignedToId)) {
        conditions.push(eq(leads.assignedTo, assignedToId));
      }
    }

    if (search) {
      const searchCondition = or(
        like(leads.name, `%${search}%`),
        like(leads.email, `%${search}%`),
        like(leads.phone, `%${search}%`)
      );
      conditions.push(searchCondition);
    }

    // Execute query with conditions
    const queryBuilder = db.select().from(leads);
    
    const results = await (conditions.length > 0 
      ? queryBuilder.where(and(...conditions))
      : queryBuilder)
      .orderBy(desc(leads.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const countQueryBuilder = db.select({ count: sql<number>`count(*)` }).from(leads);
    
    const totalResult = await (conditions.length > 0
      ? countQueryBuilder.where(and(...conditions))
      : countQueryBuilder);
    const total = totalResult[0].count;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      leads: results,
      total,
      page,
      totalPages
    }, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

// PATCH - Update lead (PROTECTED)
export async function PATCH(request: NextRequest) {
  try {
    // Validate session
    const user = await validateSession(request);
    if (!user) {
      return NextResponse.json({ 
        error: 'Authentication required',
        code: 'UNAUTHORIZED' 
      }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const leadId = parseInt(id);

    // Check if lead exists
    const existingLead = await db.select()
      .from(leads)
      .where(eq(leads.id, leadId))
      .limit(1);

    if (existingLead.length === 0) {
      return NextResponse.json({ 
        error: 'Lead not found',
        code: 'LEAD_NOT_FOUND' 
      }, { status: 404 });
    }

    const body = await request.json();
    const { status, assignedTo, notes, phone, coverImage } = body;

    // Validate status if provided
    if (status) {
      const validStatuses = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json({ 
          error: "Invalid status. Must be one of: new, contacted, qualified, proposal, won, lost",
          code: "INVALID_STATUS" 
        }, { status: 400 });
      }
    }

    // Validate assignedTo if provided
    if (assignedTo !== undefined && assignedTo !== null) {
      const assignedToId = parseInt(assignedTo);
      if (isNaN(assignedToId)) {
        return NextResponse.json({ 
          error: "assignedTo must be a valid user ID",
          code: "INVALID_ASSIGNED_TO" 
        }, { status: 400 });
      }

      // Check if user exists
      const userExists = await db.select()
        .from(users)
        .where(eq(users.id, assignedToId))
        .limit(1);

      if (userExists.length === 0) {
        return NextResponse.json({ 
          error: "Assigned user does not exist",
          code: "USER_NOT_FOUND" 
        }, { status: 400 });
      }
    }

    // Build update object with only allowed fields
    const updates: any = {
      updatedAt: new Date().toISOString()
    };

    if (status !== undefined) {
      updates.status = status;
    }

    if (assignedTo !== undefined) {
      updates.assignedTo = assignedTo === null ? null : parseInt(assignedTo);
    }

    if (notes !== undefined) {
      updates.notes = notes ? notes.trim() : null;
    }

    if (phone !== undefined) {
      updates.phone = phone ? phone.trim() : null;
    }

    if (coverImage !== undefined) {
      updates.coverImage = coverImage || null;
    }

    // Update lead
    const updatedLead = await db.update(leads)
      .set(updates)
      .where(eq(leads.id, leadId))
      .returning();

    return NextResponse.json(updatedLead[0], { status: 200 });
  } catch (error) {
    console.error('PATCH error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

// DELETE - Delete lead (PROTECTED - admin only)
export async function DELETE(request: NextRequest) {
  try {
    // Validate session
    const user = await validateSession(request);
    if (!user) {
      return NextResponse.json({ 
        error: 'Authentication required',
        code: 'UNAUTHORIZED' 
      }, { status: 401 });
    }

    // Check if user is admin
    const userIsAdmin = await isAdmin(user.id);
    if (!userIsAdmin) {
      return NextResponse.json({ 
        error: 'Forbidden: Admin role required',
        code: 'FORBIDDEN' 
      }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const leadId = parseInt(id);

    // Check if lead exists
    const existingLead = await db.select()
      .from(leads)
      .where(eq(leads.id, leadId))
      .limit(1);

    if (existingLead.length === 0) {
      return NextResponse.json({ 
        error: 'Lead not found',
        code: 'LEAD_NOT_FOUND' 
      }, { status: 404 });
    }

    // Delete lead
    const deletedLead = await db.delete(leads)
      .where(eq(leads.id, leadId))
      .returning();

    return NextResponse.json({
      message: 'Lead deleted successfully',
      lead: deletedLead[0]
    }, { status: 200 });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}