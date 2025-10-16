import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { quotes, leads, products } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const quoteId = parseInt(id);

    const result = await db
      .select({
        id: quotes.id,
        leadId: quotes.leadId,
        productId: quotes.productId,
        quantity: quotes.quantity,
        size: quotes.size,
        budgetRange: quotes.budgetRange,
        artworkPreference: quotes.artworkPreference,
        estimatedPrice: quotes.estimatedPrice,
        status: quotes.status,
        validUntil: quotes.validUntil,
        createdAt: quotes.createdAt,
        updatedAt: quotes.updatedAt,
        leadName: leads.name,
        leadEmail: leads.email,
        leadPhone: leads.phone,
        leadStatus: leads.status,
        productName: products.name,
        productCategory: products.category,
        productBasePrice: products.basePrice,
        productDescriptionEs: products.descriptionEs,
        productDescriptionEn: products.descriptionEn,
        productImageUrl: products.imageUrl,
      })
      .from(quotes)
      .leftJoin(leads, eq(quotes.leadId, leads.id))
      .leftJoin(products, eq(quotes.productId, products.id))
      .where(eq(quotes.id, quoteId))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Quote not found', code: 'QUOTE_NOT_FOUND' },
        { status: 404 }
      );
    }

    const quote = result[0];

    const response = {
      id: quote.id,
      leadId: quote.leadId,
      productId: quote.productId,
      quantity: quote.quantity,
      size: quote.size,
      budgetRange: quote.budgetRange,
      artworkPreference: quote.artworkPreference,
      estimatedPrice: quote.estimatedPrice,
      status: quote.status,
      validUntil: quote.validUntil,
      createdAt: quote.createdAt,
      updatedAt: quote.updatedAt,
      lead: {
        name: quote.leadName,
        email: quote.leadEmail,
        phone: quote.leadPhone,
        status: quote.leadStatus,
      },
      product: {
        name: quote.productName,
        category: quote.productCategory,
        basePrice: quote.productBasePrice,
        descriptionEs: quote.productDescriptionEs,
        descriptionEn: quote.productDescriptionEn,
        imageUrl: quote.productImageUrl,
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}