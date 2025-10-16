import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { files, leads } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import busboy from 'busboy';
import { Readable } from 'stream';

const MAX_FILE_SIZE = 10485760; // 10MB in bytes

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { error: 'Content-Type must be multipart/form-data', code: 'INVALID_CONTENT_TYPE' },
        { status: 400 }
      );
    }

    const formData = await parseMultipartForm(request);

    // Validate file is provided
    if (!formData.file) {
      return NextResponse.json(
        { error: 'File is required', code: 'FILE_REQUIRED' },
        { status: 400 }
      );
    }

    // Validate leadId is provided and valid
    if (!formData.leadId || isNaN(parseInt(formData.leadId))) {
      return NextResponse.json(
        { error: 'Valid leadId is required', code: 'INVALID_LEAD_ID' },
        { status: 400 }
      );
    }

    const leadId = parseInt(formData.leadId);

    // Verify lead exists
    const existingLead = await db.select()
      .from(leads)
      .where(eq(leads.id, leadId))
      .limit(1);

    if (existingLead.length === 0) {
      return NextResponse.json(
        { error: 'Lead not found', code: 'LEAD_NOT_FOUND' },
        { status: 400 }
      );
    }

    // Validate file size
    if (formData.file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit', code: 'FILE_TOO_LARGE' },
        { status: 400 }
      );
    }

    // Convert buffer to base64 data URL
    const base64String = formData.file.buffer.toString('base64');
    const dataUrl = `data:${formData.file.mimeType};base64,${base64String}`;

    // Insert file record into database
    const newFile = await db.insert(files)
      .values({
        leadId,
        fileUrl: dataUrl,
        filename: formData.file.filename,
        fileType: formData.file.mimeType,
        fileSize: formData.file.size,
      })
      .returning();

    return NextResponse.json(newFile[0], { status: 201 });

  } catch (error) {
    console.error('POST /api/files error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error, code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const leadIdParam = searchParams.get('leadId');

    // Validate leadId query parameter
    if (!leadIdParam || isNaN(parseInt(leadIdParam))) {
      return NextResponse.json(
        { error: 'Valid leadId query parameter is required', code: 'INVALID_LEAD_ID' },
        { status: 400 }
      );
    }

    const leadId = parseInt(leadIdParam);

    // Query files for the specified lead
    const leadFiles = await db.select()
      .from(files)
      .where(eq(files.leadId, leadId))
      .orderBy(desc(files.createdAt));

    return NextResponse.json({ files: leadFiles }, { status: 200 });

  } catch (error) {
    console.error('GET /api/files error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error, code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}

interface FileData {
  filename: string;
  mimeType: string;
  buffer: Buffer;
  size: number;
}

interface ParsedFormData {
  file?: FileData;
  leadId?: string;
}

async function parseMultipartForm(request: NextRequest): Promise<ParsedFormData> {
  return new Promise((resolve, reject) => {
    const formData: ParsedFormData = {};
    const fileChunks: Buffer[] = [];
    let fileInfo: Partial<FileData> = {};

    const bb = busboy({
      headers: {
        'content-type': request.headers.get('content-type') || '',
      },
      limits: {
        fileSize: MAX_FILE_SIZE,
      },
    });

    bb.on('file', (fieldname: string, file: NodeJS.ReadableStream, info: busboy.FileInfo) => {
      const { filename, encoding, mimeType } = info;
      
      fileInfo.filename = filename;
      fileInfo.mimeType = mimeType;

      file.on('data', (chunk: Buffer) => {
        fileChunks.push(chunk);
      });

      file.on('limit', () => {
        reject(new Error('File size exceeds limit'));
      });

      file.on('error', (error: Error) => {
        reject(error);
      });
    });

    bb.on('field', (fieldname: string, value: string) => {
      if (fieldname === 'leadId') {
        formData.leadId = value;
      }
    });

    bb.on('finish', () => {
      if (fileChunks.length > 0 && fileInfo.filename && fileInfo.mimeType) {
        const buffer = Buffer.concat(fileChunks);
        formData.file = {
          filename: fileInfo.filename,
          mimeType: fileInfo.mimeType,
          buffer: buffer,
          size: buffer.length,
        };
      }
      resolve(formData);
    });

    bb.on('error', (error: Error) => {
      reject(error);
    });

    // Convert ReadableStream to Node.js stream and pipe to busboy
    const reader = request.body?.getReader();
    if (!reader) {
      reject(new Error('Request body is empty'));
      return;
    }

    const stream = new Readable({
      async read() {
        try {
          const { done, value } = await reader.read();
          if (done) {
            this.push(null);
          } else {
            this.push(Buffer.from(value));
          }
        } catch (error) {
          this.destroy(error as Error);
        }
      },
    });

    stream.pipe(bb);
  });
}