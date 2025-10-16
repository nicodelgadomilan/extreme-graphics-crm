import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { leads, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Validate authentication
    const authSession = await auth.api.getSession({
      headers: request.headers,
    });

    if (!authSession) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Fetch lead with assigned user details
    const leadResults = await db
      .select({
        id: leads.id,
        name: leads.name,
        email: leads.email,
        phone: leads.phone,
        source: leads.source,
        status: leads.status,
        assignedTo: leads.assignedTo,
        notes: leads.notes,
        coverImage: leads.coverImage,
        createdAt: leads.createdAt,
        updatedAt: leads.updatedAt,
        assignedUserName: users.name,
        assignedUserEmail: users.email,
      })
      .from(leads)
      .leftJoin(users, eq(leads.assignedTo, users.id))
      .where(eq(leads.id, parseInt(id)))
      .limit(1);

    if (leadResults.length === 0) {
      return NextResponse.json(
        { error: 'Lead not found', code: 'LEAD_NOT_FOUND' },
        { status: 404 }
      );
    }

    const lead = leadResults[0];

    // Format response with assigned user details if exists
    const response = {
      id: lead.id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      source: lead.source,
      status: lead.status,
      assignedTo: lead.assignedTo,
      notes: lead.notes,
      coverImage: lead.coverImage,
      createdAt: lead.createdAt,
      updatedAt: lead.updatedAt,
      assignedUser: lead.assignedTo
        ? {
            id: lead.assignedTo,
            name: lead.assignedUserName,
            email: lead.assignedUserEmail,
          }
        : null,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('GET lead error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Validate authentication
    const authSession = await auth.api.getSession({
      headers: request.headers,
    });

    if (!authSession) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if lead exists
    const existingLead = await db
      .select()
      .from(leads)
      .where(eq(leads.id, parseInt(id)))
      .limit(1);

    if (existingLead.length === 0) {
      return NextResponse.json(
        { error: 'Lead not found', code: 'LEAD_NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, email, phone, source, status, notes, assignedTo, ticketNumber } = body;

    // Build update object with only provided fields
    const updates: any = {
      updatedAt: new Date().toISOString(),
    };

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim() === '') {
        return NextResponse.json(
          { error: 'Name cannot be empty', code: 'INVALID_NAME' },
          { status: 400 }
        );
      }
      updates.name = name.trim();
    }

    if (email !== undefined) {
      if (typeof email !== 'string' || email.trim() === '') {
        return NextResponse.json(
          { error: 'Email cannot be empty', code: 'INVALID_EMAIL' },
          { status: 400 }
        );
      }
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: 'Invalid email format', code: 'INVALID_EMAIL_FORMAT' },
          { status: 400 }
        );
      }
      updates.email = email.trim().toLowerCase();
    }

    if (phone !== undefined) {
      updates.phone = phone ? phone.trim() : null;
    }

    if (source !== undefined) {
      const validSources = ['chat', 'wizard', 'contact'];
      if (!validSources.includes(source)) {
        return NextResponse.json(
          { error: 'Invalid source. Must be one of: chat, wizard, contact', code: 'INVALID_SOURCE' },
          { status: 400 }
        );
      }
      updates.source = source;
    }

    if (status !== undefined) {
      const validStatuses = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: 'Invalid status. Must be one of: new, contacted, qualified, proposal, won, lost', code: 'INVALID_STATUS' },
          { status: 400 }
        );
      }
      updates.status = status;
    }

    if (notes !== undefined) {
      updates.notes = notes ? notes.trim() : null;
    }

    if (assignedTo !== undefined) {
      if (assignedTo === null) {
        updates.assignedTo = null;
      } else {
        const assignedToId = parseInt(assignedTo);
        if (isNaN(assignedToId)) {
          return NextResponse.json(
            { error: 'assignedTo must be a valid user ID or null', code: 'INVALID_ASSIGNED_TO' },
            { status: 400 }
          );
        }

        // Verify user exists
        const userExists = await db
          .select()
          .from(users)
          .where(eq(users.id, assignedToId))
          .limit(1);

        if (userExists.length === 0) {
          return NextResponse.json(
            { error: 'Assigned user not found', code: 'USER_NOT_FOUND' },
            { status: 400 }
          );
        }

        updates.assignedTo = assignedToId;
      }
    }

    if (ticketNumber !== undefined) {
      updates.ticketNumber = ticketNumber ? ticketNumber.trim() : null;
    }

    // Perform update
    const updatedLead = await db
      .update(leads)
      .set(updates)
      .where(eq(leads.id, parseInt(id)))
      .returning();

    return NextResponse.json({ lead: updatedLead[0] }, { status: 200 });
  } catch (error) {
    console.error('PATCH error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}