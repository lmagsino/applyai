import { db } from '@/lib/db';
import { resumes, Resume, NewResume } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { parseResume, ParsedResume } from './resumeParser';

// Custom errors
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

// CREATE - Upload and parse a resume from PDF
export async function createResumeFromPDF(pdfBase64: string): Promise<Resume> {
  // Parse with Claude
  const parsed = await parseResume(pdfBase64);

  // Save to database
  const [saved] = await db.insert(resumes).values({
    fullText: parsed.fullText,
    name: parsed.name,
    email: parsed.email,
    phone: parsed.phone,
    skills: parsed.skills,
    experience: parsed.experience,
    education: parsed.education,
  }).returning();

  return saved;
}

// READ - Get all resumes
export async function getAllResumes(): Promise<Resume[]> {
  return db
    .select()
    .from(resumes)
    .orderBy(desc(resumes.createdAt));
}

// READ - Get single resume by ID
export async function getResumeById(id: string): Promise<Resume | null> {
  const [resume] = await db
    .select()
    .from(resumes)
    .where(eq(resumes.id, id));

  return resume || null;
}

// UPDATE - Update resume fields
export async function updateResume(
  id: string, 
  input: Partial<Pick<NewResume, 'name' | 'email' | 'phone' | 'skills' | 'experience' | 'education'>>
): Promise<Resume | null> {
  const existing = await getResumeById(id);
  if (!existing) {
    return null;
  }

  const [updated] = await db
    .update(resumes)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(eq(resumes.id, id))
    .returning();

  return updated;
}

// DELETE - Remove resume
export async function deleteResume(id: string): Promise<boolean> {
  const result = await db
    .delete(resumes)
    .where(eq(resumes.id, id))
    .returning();

  return result.length > 0;
}

// RE-PARSE - Upload new PDF for existing resume
export async function reparseResume(id: string, pdfBase64: string): Promise<Resume | null> {
  const existing = await getResumeById(id);
  if (!existing) {
    return null;
  }

  // Parse new PDF
  const parsed = await parseResume(pdfBase64);

  // Update existing record
  const [updated] = await db
    .update(resumes)
    .set({
      fullText: parsed.fullText,
      name: parsed.name,
      email: parsed.email,
      phone: parsed.phone,
      skills: parsed.skills,
      experience: parsed.experience,
      education: parsed.education,
      updatedAt: new Date(),
    })
    .where(eq(resumes.id, id))
    .returning();

  return updated;
}