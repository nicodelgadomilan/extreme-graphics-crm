import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { leads, quotes } from '@/db/schema';
import { eq, and, sql, gte } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all leads
    const allLeads = await db.select().from(leads);
    
    // Get all quotes
    const allQuotes = await db.select().from(quotes);

    // Calculate stats
    const totalLeads = allLeads.length;
    const newLeads = allLeads.filter(l => l.status === 'new').length;
    const contactedLeads = allLeads.filter(l => l.status === 'contacted').length;
    const qualifiedLeads = allLeads.filter(l => l.status === 'qualified').length;
    const wonLeads = allLeads.filter(l => l.status === 'won').length;
    const lostLeads = allLeads.filter(l => l.status === 'lost').length;

    const totalQuotes = allQuotes.length;
    const activeQuotes = allQuotes.filter(q => q.status === 'draft' || q.status === 'sent').length;
    const acceptedQuotes = allQuotes.filter(q => q.status === 'accepted').length;

    const conversionRate = totalLeads > 0 ? (wonLeads / totalLeads) * 100 : 0;

    // Leads by status
    const leadsByStatus: Record<string, number> = {
      new: newLeads,
      contacted: contactedLeads,
      qualified: qualifiedLeads,
      won: wonLeads,
      lost: lostLeads,
    };

    // Leads by source
    const leadsBySource: Record<string, number> = {};
    allLeads.forEach(lead => {
      const source = lead.source || 'unknown';
      leadsBySource[source] = (leadsBySource[source] || 0) + 1;
    });

    // Recent leads (last 5)
    const recentLeads = allLeads
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(lead => ({
        id: lead.id,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        source: lead.source,
        status: lead.status,
        createdAt: lead.createdAt,
      }));

    return NextResponse.json({
      totalLeads,
      newLeads,
      contactedLeads,
      qualifiedLeads,
      wonLeads,
      lostLeads,
      totalQuotes,
      activeQuotes,
      acceptedQuotes,
      conversionRate,
      leadsByStatus,
      leadsBySource,
      recentLeads,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}