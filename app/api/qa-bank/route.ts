import { NextRequest, NextResponse } from 'next/server';
import { 
  createQAEntry, 
  getAllQAEntries, 
  ValidationError 
} from '@/lib/services/qaBank';

// POST - Create a new Q&A entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const entry = await createQAEntry(body);

    return NextResponse.json({
      message: 'Q&A entry created successfully',
      entry,
    }, { status: 201 });

  } catch (error) {
    // Handle validation errors
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    console.error('Q&A creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create Q&A entry' },
      { status: 500 }
    );
  }
}

// GET - List all Q&A entries
export async function GET() {
  try {
    const entries = await getAllQAEntries();
    return NextResponse.json({ entries });
  } catch (error) {
    console.error('Failed to fetch Q&A entries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Q&A entries' },
      { status: 500 }
    );
  }
}