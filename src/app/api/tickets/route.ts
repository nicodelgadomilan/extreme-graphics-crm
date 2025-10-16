import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { leads, chatSessions, quotes, products, files } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Authentication check
    const authSession = await auth.api.getSession({ headers: request.headers });
    if (!authSession) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    // Fetch all leads ordered by createdAt DESC
    const allLeads = await db
      .select()
      .from(leads)
      .orderBy(desc(leads.createdAt));

    // Build tickets array with nested data
    const tickets = await Promise.all(
      allLeads.map(async (lead) => {
        // Fetch chat sessions for this lead
        const leadChatSessions = await db
          .select()
          .from(chatSessions)
          .where(eq(chatSessions.leadId, lead.id));

        // Parse JSON fields and format chat sessions
        const formattedChatSessions = leadChatSessions.map((session) => ({
          id: session.id,
          messages: Array.isArray(session.messages) ? session.messages : [],
          contextCaptured: typeof session.contextCaptured === 'object' && session.contextCaptured !== null 
            ? session.contextCaptured 
            : {},
          status: session.status,
          createdAt: session.createdAt,
          updatedAt: session.updatedAt,
        }));

        // Fetch quotes with product details for this lead
        const leadQuotes = await db
          .select({
            id: quotes.id,
            productId: quotes.productId,
            productName: products.name,
            productCategory: products.category,
            quantity: quotes.quantity,
            size: quotes.size,
            budgetRange: quotes.budgetRange,
            artworkPreference: quotes.artworkPreference,
            estimatedPrice: quotes.estimatedPrice,
            status: quotes.status,
            validUntil: quotes.validUntil,
            createdAt: quotes.createdAt,
            updatedAt: quotes.updatedAt,
          })
          .from(quotes)
          .leftJoin(products, eq(quotes.productId, products.id))
          .where(eq(quotes.leadId, lead.id));

        // Fetch files for this lead
        const leadFiles = await db
          .select({
            id: files.id,
            filename: files.filename,
            fileUrl: files.fileUrl,
            fileType: files.fileType,
            uploadedBy: files.uploadedBy,
            createdAt: files.createdAt,
          })
          .from(files)
          .where(eq(files.leadId, lead.id));

        // Return structured ticket object
        return {
          id: lead.id,
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          source: lead.source,
          status: lead.status,
          assignedTo: lead.assignedTo,
          notes: lead.notes,
          preferredContact: lead.preferredContact,
          createdAt: lead.createdAt,
          updatedAt: lead.updatedAt,
          chatSessions: formattedChatSessions,
          quotes: leadQuotes,
          files: leadFiles,
        };
      })
    );

    return NextResponse.json({ tickets }, { status: 200 });
  } catch (error) {
    console.error('GET /api/tickets error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
        code: 'INTERNAL_ERROR' 
      },
      { status: 500 }
    );
  }
}