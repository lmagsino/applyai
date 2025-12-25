import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { qaBank } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

// POST - Create a new Q&A entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { question, answer, category, tags } = body;

    // Validate required fields
    if (!question || !answer || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: question, answer, category' },
        { status: 400 }
      );
    }

    // Validate category
    const validCategories = ['behavioral', 'technical', 'hr', 'situational'];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: `Invalid category. Must be one of: ${validCategories.join(', ')}` },
        { status: 400 }
      );
    }

    // Save to database
    const [savedEntry] = await db.insert(qaBank).values({
      question,
      answer,
      category,
      tags: tags || [],
    }).returning();

    return NextResponse.json({
      message: 'Q&A entry created successfully',
      entry: savedEntry,
    });

  } catch (error) {
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
    const entries = await db
      .select()
      .from(qaBank)
      .orderBy(desc(qaBank.createdAt));

    return NextResponse.json({ entries });
  } catch (error) {
    console.error('Failed to fetch Q&A entries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Q&A entries' },
      { status: 500 }
    );
  }
}