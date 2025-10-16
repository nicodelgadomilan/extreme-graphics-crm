import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { quotes, leads, products, crmUsers } from '@/db/schema';
import { eq, desc, and, like, sql } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { leadId, productId, estimatedPrice, quantity, size, budgetRange, artworkPreference, validUntil } = body;

    // Validation
    if (!leadId) {
      return NextResponse.json(
        { error: 'Lead ID is required', code: 'MISSING_LEAD_ID' },
        { status: 400 }
      );
    }

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required', code: 'MISSING_PRODUCT_ID' },
        { status: 400 }
      );
    }

    if (!estimatedPrice) {
      return NextResponse.json(
        { error: 'Estimated price is required', code: 'MISSING_ESTIMATED_PRICE' },
        { status: 400 }
      );
    }

    if (estimatedPrice <= 0) {
      return NextResponse.json(
        { error: 'Estimated price must be greater than 0', code: 'INVALID_ESTIMATED_PRICE' },
        { status: 400 }
      );
    }

    // Validate leadId exists
    const leadExists = await db.select()
      .from(leads)
      .where(eq(leads.id, parseInt(leadId)))
      .limit(1);

    if (leadExists.length === 0) {
      return NextResponse.json(
        { error: 'Lead not found', code: 'LEAD_NOT_FOUND' },
        { status: 400 }
      );
    }

    // Validate productId exists
    const productExists = await db.select()
      .from(products)
      .where(eq(products.id, parseInt(productId)))
      .limit(1);

    if (productExists.length === 0) {
      return NextResponse.json(
        { error: 'Product not found', code: 'PRODUCT_NOT_FOUND' },
        { status: 400 }
      );
    }
const newQuote = await db.insert(quotes)
      .values({
        leadId: parseInt(leadId),
        productId: parseInt(productId),
        estimatedPrice: parseInt(estimatedPrice),
        quantity: quantity ? parseInt(quantity) : 1,
        size: size || null,
        budgetRange: budgetRange || null,
        artworkPreference: artworkPreference || null,
        validUntil: validUntil || null,
        status: 'draft'
      })
      .returning();

    return NextResponse.json(newQuote[0], { status: 201 });
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = (page - 1) * limit;
    const leadIdParam = searchParams.get('leadId');
    const statusParam = searchParams.get('status');
    const searchParam = searchParams.get('search');

    let conditions = [];

    if (leadIdParam) {
      conditions.push(eq(quotes.leadId, parseInt(leadIdParam)));
    }

    if (statusParam) {
      conditions.push(eq(quotes.status, statusParam));
    }

    if (searchParam) {
      conditions.push(like(leads.name, `%${searchParam}%`));
    }

    const whereCondition = conditions.length > 0 ? and(...conditions) : undefined;

    // Get total count
    const totalResult = await db.select({ count: sql<number>`count(*)` })
      .from(quotes)
      .leftJoin(leads, eq(quotes.leadId, leads.id))
      .where(whereCondition);

    const total = Number(totalResult[0].count);

    // Get quotes with joins
    const quotesWithDetails = await db.select({
      id: quotes.id,
      leadId: quotes.leadId,
      leadName: leads.name,
      leadEmail: leads.email,
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
      .leftJoin(leads, eq(quotes.leadId, leads.id))
      .leftJoin(products, eq(quotes.productId, products.id))
      .where(whereCondition)
      .orderBy(desc(quotes.createdAt))
      .limit(limit)
      .offset(offset);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      quotes: quotesWithDetails,
      total,
      page,
      totalPages,
    }, { status: 200 });
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

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if quote exists
    const existingQuote = await db.select()
      .from(quotes)
      .where(eq(quotes.id, parseInt(id)))
      .limit(1);

    if (existingQuote.length === 0) {
      return NextResponse.json(
        { error: 'Quote not found', code: 'QUOTE_NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { status, estimatedPrice, quantity, size, budgetRange, artworkPreference, validUntil } = body;

    const updates: any = {
      updatedAt: new Date().toISOString(),
    };

    if (status !== undefined) {
      if (!['draft', 'sent', 'accepted', 'rejected'].includes(status)) {
        return NextResponse.json(
          { error: 'Invalid status value', code: 'INVALID_STATUS' },
          { status: 400 }
        );
      }
      updates.status = status;
    }

    if (estimatedPrice !== undefined) {
      if (estimatedPrice <= 0) {
        return NextResponse.json(
          { error: 'Estimated price must be greater than 0', code: 'INVALID_ESTIMATED_PRICE' },
          { status: 400 }
        );
      }
      updates.estimatedPrice = parseInt(estimatedPrice);
    }

    if (quantity !== undefined) {
      updates.quantity = parseInt(quantity);
    }

    if (size !== undefined) {
      updates.size = size;
    }

    if (budgetRange !== undefined) {
      updates.budgetRange = budgetRange;
    }

    if (artworkPreference !== undefined) {
      updates.artworkPreference = artworkPreference;
    }

    if (validUntil !== undefined) {
      updates.validUntil = validUntil;
    }

    const updatedQuote = await db.update(quotes)
      .set(updates)
      .where(eq(quotes.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedQuote[0], { status: 200 });
  } catch (error) {
    console.error('PATCH error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
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

    // Check if user is admin
    const crmUser = await db.select()
      .from(crmUsers)
      .where(eq(crmUsers.authUserId, authSession.user.id))
      .limit(1);

    if (crmUser.length === 0 || crmUser[0].role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required', code: 'FORBIDDEN' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if quote exists
    const existingQuote = await db.select()
      .from(quotes)
      .where(eq(quotes.id, parseInt(id)))
      .limit(1);

    if (existingQuote.length === 0) {
      return NextResponse.json(
        { error: 'Quote not found', code: 'QUOTE_NOT_FOUND' },
        { status: 404 }
      );
    }

    const deletedQuote = await db.delete(quotes)
      .where(eq(quotes.id, parseInt(id)))
      .returning();

    return NextResponse.json({
      message: 'Quote deleted successfully',
      quote: deletedQuote[0],
    }, { status: 200 });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}