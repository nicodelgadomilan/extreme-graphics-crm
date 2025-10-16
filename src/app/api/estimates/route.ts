import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { estimates } from '@/db/schema';
import { eq, desc, like, and, or, sql } from 'drizzle-orm';
import { auth } from '@/lib/auth';

// Helper function to generate unique quote number
async function generateQuoteNumber(): Promise<string> {
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    const quoteNumber = `EG-${randomNumber}`;

    const existing = await db
      .select()
      .from(estimates)
      .where(eq(estimates.quoteNumber, quoteNumber))
      .limit(1);

    if (existing.length === 0) {
      return quoteNumber;
    }

    attempts++;
  }

  throw new Error('Failed to generate unique quote number');
}

// Helper function to validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Helper function to validate items array
function validateItems(items: any): boolean {
  if (!Array.isArray(items) || items.length === 0) {
    return false;
  }

  return items.every(item => {
    return (
      item &&
      typeof item === 'object' &&
      typeof item.description === 'string' &&
      item.description.trim() !== '' &&
      typeof item.quantity === 'number' &&
      item.quantity > 0 &&
      typeof item.unitPrice === 'number' &&
      item.unitPrice >= 0 &&
      typeof item.total === 'number' &&
      item.total >= 0
    );
  });
}

// Helper function to validate status
function isValidStatus(status: string): boolean {
  return ['draft', 'sent', 'accepted', 'rejected'].includes(status);
}

export async function POST(request: NextRequest) {
  try {
    const authSession = await auth.api.getSession({ headers: request.headers });
    if (!authSession) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }
    const userId = authSession.user.id;

    const body = await request.json();

    // Security check: reject if userId provided in body
    if ('userId' in body || 'user_id' in body) {
      return NextResponse.json(
        {
          error: 'User ID cannot be provided in request body',
          code: 'USER_ID_NOT_ALLOWED',
        },
        { status: 400 }
      );
    }

    const {
      clientName,
      clientEmail,
      clientPhone,
      clientAddress,
      items,
      subtotal,
      taxRate,
      taxAmount,
      shippingCost,
      total,
      notes,
      validUntil,
      status,
      pdfFile,
    } = body;

    // Validate required fields
    if (!clientName || typeof clientName !== 'string' || clientName.trim() === '') {
      return NextResponse.json(
        { error: 'Client name is required', code: 'MISSING_CLIENT_NAME' },
        { status: 400 }
      );
    }

    if (!clientEmail || typeof clientEmail !== 'string' || clientEmail.trim() === '') {
      return NextResponse.json(
        { error: 'Client email is required', code: 'MISSING_CLIENT_EMAIL' },
        { status: 400 }
      );
    }

    if (!isValidEmail(clientEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format', code: 'INVALID_EMAIL' },
        { status: 400 }
      );
    }

    if (!items) {
      return NextResponse.json(
        { error: 'Items are required', code: 'MISSING_ITEMS' },
        { status: 400 }
      );
    }

    if (!validateItems(items)) {
      return NextResponse.json(
        {
          error: 'Items must be a non-empty array with valid structure (description, quantity, unitPrice, total)',
          code: 'INVALID_ITEMS',
        },
        { status: 400 }
      );
    }

    if (!subtotal || typeof subtotal !== 'number' || subtotal < 0) {
      return NextResponse.json(
        { error: 'Subtotal must be a positive number', code: 'INVALID_SUBTOTAL' },
        { status: 400 }
      );
    }

    if (!total || typeof total !== 'number' || total < 0) {
      return NextResponse.json(
        { error: 'Total must be a positive number', code: 'INVALID_TOTAL' },
        { status: 400 }
      );
    }

    // Validate status if provided
    if (status && !isValidStatus(status)) {
      return NextResponse.json(
        {
          error: 'Status must be one of: draft, sent, accepted, rejected',
          code: 'INVALID_STATUS',
        },
        { status: 400 }
      );
    }

    // Generate unique quote number
    const quoteNumber = await generateQuoteNumber();

    // Prepare insert data
const insertData = {
      quoteNumber,
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim().toLowerCase(),
      clientPhone: clientPhone ? clientPhone.trim() : null,
      clientAddress: clientAddress ? clientAddress.trim() : null,
      items: JSON.stringify(items),
      subtotal,
      taxRate: taxRate ?? 0,
      taxAmount: taxAmount ?? 0,
      shippingCost: shippingCost ?? 0,
      total,
      notes: notes ? notes.trim() : null,
      validUntil: validUntil || null,
      status: status || 'draft',
      pdfFile: pdfFile || null,
      userId
    };

    const newEstimate = await db.insert(estimates).values(insertData).returning();

    // Parse items back to JSON for response
    const response = {
      ...newEstimate[0],
      items: JSON.parse(newEstimate[0].items as string),
    };

    return NextResponse.json(response, { status: 201 });
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
    const authSession = await auth.api.getSession({ headers: request.headers });
    if (!authSession) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }
    const userId = authSession.user.id;

    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10')));
    const offset = (page - 1) * limit;
    const statusFilter = searchParams.get('status');
    const search = searchParams.get('search');

    // Build where conditions
    let whereConditions = [eq(estimates.userId, userId)];

    if (statusFilter && isValidStatus(statusFilter)) {
      whereConditions.push(eq(estimates.status, statusFilter));
    }

    if (search && search.trim() !== '') {
      const searchTerm = `%${search.trim()}%`;
      whereConditions.push(
        or(
          like(estimates.clientName, searchTerm),
          like(estimates.clientEmail, searchTerm),
          like(estimates.quoteNumber, searchTerm)
        )!
      );
    }

    const whereClause = whereConditions.length > 1 ? and(...whereConditions) : whereConditions[0];

    // Get total count
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(estimates)
      .where(whereClause);

    const total = Number(countResult[0].count);
    const totalPages = Math.ceil(total / limit);

    // Get paginated results
    const results = await db
      .select()
      .from(estimates)
      .where(whereClause)
      .orderBy(desc(estimates.createdAt))
      .limit(limit)
      .offset(offset);

    // Parse items JSON for all results
    const parsedResults = results.map(estimate => ({
      ...estimate,
      items: JSON.parse(estimate.items as string),
    }));

    return NextResponse.json({
      estimates: parsedResults,
      total,
      page,
      totalPages,
    });
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
    const authSession = await auth.api.getSession({ headers: request.headers });
    if (!authSession) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }
    const userId = authSession.user.id;

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Security check: reject if userId provided in body
    if ('userId' in body || 'user_id' in body) {
      return NextResponse.json(
        {
          error: 'User ID cannot be provided in request body',
          code: 'USER_ID_NOT_ALLOWED',
        },
        { status: 400 }
      );
    }

    // Check if estimate exists and belongs to user
    const existingEstimate = await db
      .select()
      .from(estimates)
      .where(and(eq(estimates.id, parseInt(id)), eq(estimates.userId, userId)))
      .limit(1);

    if (existingEstimate.length === 0) {
      return NextResponse.json(
        { error: 'Estimate not found or access denied', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Validate updatable fields
    const {
      status,
      clientName,
      clientEmail,
      clientPhone,
      clientAddress,
      items,
      subtotal,
      taxRate,
      taxAmount,
      shippingCost,
      total,
      notes,
      validUntil,
      pdfFile,
    } = body;

    const updates: any = {};

    if (status !== undefined) {
      if (!isValidStatus(status)) {
        return NextResponse.json(
          {
            error: 'Status must be one of: draft, sent, accepted, rejected',
            code: 'INVALID_STATUS',
          },
          { status: 400 }
        );
      }
      updates.status = status;
    }

    if (clientName !== undefined) {
      if (typeof clientName !== 'string' || clientName.trim() === '') {
        return NextResponse.json(
          { error: 'Client name cannot be empty', code: 'INVALID_CLIENT_NAME' },
          { status: 400 }
        );
      }
      updates.clientName = clientName.trim();
    }

    if (clientEmail !== undefined) {
      if (typeof clientEmail !== 'string' || !isValidEmail(clientEmail)) {
        return NextResponse.json(
          { error: 'Invalid email format', code: 'INVALID_EMAIL' },
          { status: 400 }
        );
      }
      updates.clientEmail = clientEmail.trim().toLowerCase();
    }

    if (clientPhone !== undefined) {
      updates.clientPhone = clientPhone ? clientPhone.trim() : null;
    }

    if (clientAddress !== undefined) {
      updates.clientAddress = clientAddress ? clientAddress.trim() : null;
    }

    if (items !== undefined) {
      if (!validateItems(items)) {
        return NextResponse.json(
          {
            error: 'Items must be a valid array with required structure',
            code: 'INVALID_ITEMS',
          },
          { status: 400 }
        );
      }
      updates.items = JSON.stringify(items);
    }

    if (subtotal !== undefined) {
      if (typeof subtotal !== 'number' || subtotal < 0) {
        return NextResponse.json(
          { error: 'Subtotal must be a positive number', code: 'INVALID_SUBTOTAL' },
          { status: 400 }
        );
      }
      updates.subtotal = subtotal;
    }

    if (taxRate !== undefined) {
      updates.taxRate = taxRate;
    }

    if (taxAmount !== undefined) {
      updates.taxAmount = taxAmount;
    }

    if (shippingCost !== undefined) {
      updates.shippingCost = shippingCost;
    }

    if (total !== undefined) {
      if (typeof total !== 'number' || total < 0) {
        return NextResponse.json(
          { error: 'Total must be a positive number', code: 'INVALID_TOTAL' },
          { status: 400 }
        );
      }
      updates.total = total;
    }

    if (notes !== undefined) {
      updates.notes = notes ? notes.trim() : null;
    }

    if (validUntil !== undefined) {
      updates.validUntil = validUntil || null;
    }

    if (pdfFile !== undefined) {
      updates.pdfFile = pdfFile || null;
    }

    // Always update timestamp
    updates.updatedAt = new Date().toISOString();

    // Perform update
    const updated = await db
      .update(estimates)
      .set(updates)
      .where(and(eq(estimates.id, parseInt(id)), eq(estimates.userId, userId)))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        { error: 'Update failed', code: 'UPDATE_FAILED' },
        { status: 500 }
      );
    }

    // Parse items for response
    const response = {
      ...updated[0],
      items: JSON.parse(updated[0].items as string),
    };

    return NextResponse.json(response);
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
    const authSession = await auth.api.getSession({ headers: request.headers });
    if (!authSession) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }
    const userId = authSession.user.id;

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if estimate exists and belongs to user
    const existingEstimate = await db
      .select()
      .from(estimates)
      .where(and(eq(estimates.id, parseInt(id)), eq(estimates.userId, userId)))
      .limit(1);

    if (existingEstimate.length === 0) {
      return NextResponse.json(
        { error: 'Estimate not found or access denied', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Delete estimate
    const deleted = await db
      .delete(estimates)
      .where(and(eq(estimates.id, parseInt(id)), eq(estimates.userId, userId)))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json(
        { error: 'Delete failed', code: 'DELETE_FAILED' },
        { status: 500 }
      );
    }

    // Parse items for response
    const response = {
      ...deleted[0],
      items: JSON.parse(deleted[0].items as string),
    };

    return NextResponse.json({
      message: 'Estimate deleted successfully',
      estimate: response,
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}