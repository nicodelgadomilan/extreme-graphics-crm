import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { chatSessions, leads } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authentication validation
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

    // Fetch chat session with lead details
    const result = await db
      .select({
        id: chatSessions.id,
        leadId: chatSessions.leadId,
        messages: chatSessions.messages,
        contextCaptured: chatSessions.contextCaptured,
        status: chatSessions.status,
        createdAt: chatSessions.createdAt,
        updatedAt: chatSessions.updatedAt,
        lead: {
          id: leads.id,
          name: leads.name,
          email: leads.email,
          phone: leads.phone,
          source: leads.source,
          status: leads.status,
          assignedTo: leads.assignedTo,
          notes: leads.notes,
          createdAt: leads.createdAt,
          updatedAt: leads.updatedAt,
        },
      })
      .from(chatSessions)
      .leftJoin(leads, eq(chatSessions.leadId, leads.id))
      .where(eq(chatSessions.id, parseInt(id)))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Chat session not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const session = result[0];

    // Format response with full messages array and contextCaptured object
    const response = {
      id: session.id,
      leadId: session.leadId,
      messages: session.messages || [],
      contextCaptured: session.contextCaptured || {},
      status: session.status,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      lead: session.lead?.id ? session.lead : null,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('GET chat session error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}