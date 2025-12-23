import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { resumes } from '@/lib/db/schema';

export async function GET() {
  try {
    // Try to query the resumes table (will be empty, that's ok)
    const result = await db.select().from(resumes).limit(1);
    
    return NextResponse.json({
      status: 'ok',
      message: 'Database connected successfully!',
      tables: {
        resumes: 'accessible',
      },
      data: result,
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}