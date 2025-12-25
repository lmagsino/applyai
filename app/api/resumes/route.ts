import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { resumes } from '@/lib/db/schema';
import { parseResume } from '@/lib/services/resumeParser';
import { desc } from 'drizzle-orm';

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

    // Parse with Claude
    const parsed = await parseResume(base64);

    // Save to database
    const [savedResume] = await db.insert(resumes).values({
      fullText: parsed.fullText,
      name: parsed.name,
      email: parsed.email,
      phone: parsed.phone,
      skills: parsed.skills,
      experience: parsed.experience,
      education: parsed.education,
    }).returning();

    return NextResponse.json({
      message: 'Resume parsed and saved successfully',
      resume: savedResume,
    });

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
    const allResumes = await db
      .select()
      .from(resumes)
      .orderBy(desc(resumes.createdAt));

    return NextResponse.json({ resumes: allResumes });
  } catch (error) {
    console.error('Failed to fetch resumes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resumes' },
      { status: 500 }
    );
  }
}