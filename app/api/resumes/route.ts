import { NextRequest, NextResponse } from 'next/server';
import { createResumeFromPDF, getAllResumes } from '@/lib/services/resume';

// POST - Upload and parse a resume
export async function POST(request: NextRequest) {
  try {
    // Get the PDF file from form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are supported' },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');

    // Use service to parse and save
    const resume = await createResumeFromPDF(base64);

    return NextResponse.json({
      message: 'Resume parsed and saved successfully',
      resume,
    }, { status: 201 });

  } catch (error) {
    console.error('Resume upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process resume' },
      { status: 500 }
    );
  }
}

// GET - List all resumes
export async function GET() {
  try {
    const allResumes = await getAllResumes();
    return NextResponse.json({ resumes: allResumes });
  } catch (error) {
    console.error('Failed to fetch resumes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resumes' },
      { status: 500 }
    );
  }
}