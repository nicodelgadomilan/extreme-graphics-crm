import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { chatSessions, leads } from '@/db/schema';
import { eq, desc, and, sql } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, leadId, contextCaptured } = body;

    // Validate messages array
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        {
          error: 'Messages must be a non-empty array',
          code: 'INVALID_MESSAGES',
        },
        { status: 400 }
      );
    }

    // Validate each message has required structure
    for (const message of messages) {
      if (!message.role || !message.content) {
        return NextResponse.json(
          {
            error: 'Each message must have role and content',
            code: 'INVALID_MESSAGE_STRUCTURE',
          },
          { status: 400 }
        );
      }
    }

    // If leadId provided, verify it exists
    if (leadId) {
      const leadExists = await db
        .select()
        .from(leads)
        .where(eq(leads.id, leadId))
        .limit(1);

      if (leadExists.length === 0) {
        return NextResponse.json(
          {
            error: 'Lead not found',
            code: 'LEAD_NOT_FOUND',
          },
          { status: 400 }
        );
      }
    }

    const newSession = await db
      .insert(chatSessions)
      .values({
        leadId: leadId || null,
        messages: messages,
        contextCaptured: contextCaptured || null,
        status: 'active',
      })
      .returning();

    return NextResponse.json(newSession[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const authSession = await auth.api.getSession({
      headers: request.headers,
    });

    if (!authSession) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(parseInt(searchParams.get('page') || '1'), 1);
    const limit = Math.min(
      Math.max(parseInt(searchParams.get('limit') || '10'), 1),
      100
    );
    const offset = (page - 1) * limit;
    const leadIdParam = searchParams.get('leadId');
    const statusParam = searchParams.get('status');

    // Build where conditions
    const conditions = [];
    if (leadIdParam) {
      conditions.push(eq(chatSessions.leadId, parseInt(leadIdParam)));
    }
    if (statusParam) {
      conditions.push(eq(chatSessions.status, statusParam));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get total count
    const countQuery = whereClause
      ? db
          .select({ count: sql<number>`count(*)` })
          .from(chatSessions)
          .where(whereClause)
      : db.select({ count: sql<number>`count(*)` }).from(chatSessions);

    const countResult = await countQuery;
    const total = Number(countResult[0].count);

    // Get paginated sessions with lead join
    const sessionsQuery = db
      .select({
        id: chatSessions.id,
        leadId: chatSessions.leadId,
        messages: chatSessions.messages,
        contextCaptured: chatSessions.contextCaptured,
        status: chatSessions.status,
        createdAt: chatSessions.createdAt,
        updatedAt: chatSessions.updatedAt,
        leadName: leads.name,
        leadEmail: leads.email,
      })
      .from(chatSessions)
      .leftJoin(leads, eq(chatSessions.leadId, leads.id))
      .orderBy(desc(chatSessions.createdAt))
      .limit(limit)
      .offset(offset);

    const sessions = whereClause
      ? await sessionsQuery.where(whereClause)
      : await sessionsQuery;

    // Parse JSON fields
    const sessionsResponse = sessions.map((session) => ({
      ...session,
      messages: JSON.parse(session.messages as string),
      contextCaptured: session.contextCaptured
        ? JSON.parse(session.contextCaptured as string)
        : null,
      lead: session.leadName
        ? {
            name: session.leadName,
            email: session.leadEmail,
          }
        : null,
      leadName: undefined,
      leadEmail: undefined,
    }));

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json(
      {
        sessions: sessionsResponse,
        total,
        page,
        totalPages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authSession = await auth.api.getSession({
      headers: request.headers,
    });

    if (!authSession) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        {
          error: 'Valid ID is required',
          code: 'INVALID_ID',
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { messages, status, contextCaptured } = body;

    // Validate at least one field is provided
    if (!messages && !status && !contextCaptured) {
      return NextResponse.json(
        {
          error: 'At least one field must be provided for update',
          code: 'NO_UPDATE_FIELDS',
        },
        { status: 400 }
      );
    }

    // Check if session exists
    const existingSession = await db
      .select()
      .from(chatSessions)
      .where(eq(chatSessions.id, parseInt(id)))
      .limit(1);

    if (existingSession.length === 0) {
      return NextResponse.json(
        { error: 'Chat session not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Validate status if provided
    if (status && !['active', 'closed'].includes(status)) {
      return NextResponse.json(
        {
          error: 'Status must be either "active" or "closed"',
          code: 'INVALID_STATUS',
        },
        { status: 400 }
      );
    }

    // Validate messages if provided
    if (messages) {
      if (!Array.isArray(messages) || messages.length === 0) {
        return NextResponse.json(
          {
            error: 'Messages must be a non-empty array',
            code: 'INVALID_MESSAGES',
          },
          { status: 400 }
        );
      }

      for (const message of messages) {
        if (!message.role || !message.content) {
          return NextResponse.json(
            {
              error: 'Each message must have role and content',
              code: 'INVALID_MESSAGE_STRUCTURE',
            },
            { status: 400 }
          );
        }
      }
    }

    const updateData: any = {};

    // If messages provided, append to existing messages
    if (messages) {
      const existingMessages = existingSession[0].messages as any[];
      updateData.messages = [...existingMessages, ...messages];
    }

    if (status) {
      updateData.status = status;
    }

    if (contextCaptured !== undefined) {
      updateData.contextCaptured = contextCaptured || null;
    }

    const updated = await db
      .update(chatSessions)
      .set(updateData)
      .where(eq(chatSessions.id, parseInt(id)))
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