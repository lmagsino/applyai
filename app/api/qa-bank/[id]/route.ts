import { NextRequest, NextResponse } from 'next/server';
import { 
  getQAEntryById, 
  updateQAEntry, 
  deleteQAEntry,
  ValidationError 
} from '@/lib/services/qaBank';

// Context type for dynamic route params
type Context = {
  params: Promise<{ id: string }>;
};

// GET - Get single Q&A entry
export async function GET(request: NextRequest, context: Context) {
  try {
    const { id } = await context.params;
    const entry = await getQAEntryById(id);

    if (!entry) {
      return NextResponse.json(
        { error: 'Q&A entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ entry });
  } catch (error) {
    console.error('Failed to fetch Q&A entry:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Q&A entry' },
      { status: 500 }
    );
  }
}

// PUT - Update Q&A entry
export async function PUT(request: NextRequest, context: Context) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const entry = await updateQAEntry(id, body);

    if (!entry) {
      return NextResponse.json(
        { error: 'Q&A entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Q&A entry updated successfully',
      entry,
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    console.error('Failed to update Q&A entry:', error);
    return NextResponse.json(
      { error: 'Failed to update Q&A entry' },
      { status: 500 }
    );
  }
}

// DELETE - Delete Q&A entry
export async function DELETE(request: NextRequest, context: Context) {
  try {
    const { id } = await context.params;
    const deleted = await deleteQAEntry(id);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Q&A entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Q&A entry deleted successfully',
    });
  } catch (error) {
    console.error('Failed to delete Q&A entry:', error);
    return NextResponse.json(
      { error: 'Failed to delete Q&A entry' },
      { status: 500 }
    );
  }
}
EOF