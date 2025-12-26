import { NextRequest, NextResponse } from 'next/server';
import { 
  getResumeById, 
  updateResume, 
  deleteResume,
  reparseResume 
} from '@/lib/services/resume';

// Context type for dynamic route params
type Context = {
  params: Promise<{ id: string }>;
};

// GET - Get single resume
export async function GET(request: NextRequest, context: Context) {
  try {
    const { id } = await context.params;
    const resume = await getResumeById(id);

    if (!resume) {
      return NextResponse.json(
        { error: 'Resume not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ resume });
  } catch (error) {
    console.error('Failed to fetch resume:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resume' },
      { status: 500 }
    );
  }
}

// PUT - Update resume (JSON fields or re-parse PDF)
export async function PUT(request: NextRequest, context: Context) {
  try {
    const { id } = await context.params;
    const contentType = request.headers.get('content-type') || '';

    let resume;

    // Check if it's a file upload (re-parse) or JSON update
    if (contentType.includes('multipart/form-data')) {
      // Re-parse with new PDF
      const formData = await request.formData();
      const file = formData.get('file') as File | null;

      if (!file || file.type !== 'application/pdf') {
        return NextResponse.json(
          { error: 'Valid PDF file required' },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const base64 = Buffer.from(bytes).toString('base64');

      resume = await reparseResume(id, base64);
    } else {
      // Update JSON fields
      const body = await request.json();
      resume = await updateResume(id, body);
    }

    if (!resume) {
      return NextResponse.json(
        { error: 'Resume not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Resume updated successfully',
      resume,
    });
  } catch (error) {
    console.error('Failed to update resume:', error);
    return NextResponse.json(
      { error: 'Failed to update resume' },
      { status: 500 }
    );
  }
}

// DELETE - Delete resume
export async function DELETE(request: NextRequest, context: Context) {
  try {
    const { id } = await context.params;
    const deleted = await deleteResume(id);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Resume not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Resume deleted successfully',
    });
  } catch (error) {
    console.error('Failed to delete resume:', error);
    return NextResponse.json(
      { error: 'Failed to delete resume' },
      { status: 500 }
    );
  }
}