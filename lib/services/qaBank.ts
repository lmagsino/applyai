import { db } from '@/lib/db';
import { qaBank, QAEntry, NewQAEntry } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';

// Valid categories
export const QA_CATEGORIES = ['behavioral', 'technical', 'hr', 'situational'] as const;
export type QACategory = typeof QA_CATEGORIES[number];

// Input type for creating Q&A
export interface CreateQAInput {
  question: string;
  answer: string;
  category: QACategory;
  tags?: string[];
}

// Input type for updating Q&A
export interface UpdateQAInput {
  question?: string;
  answer?: string;
  category?: QACategory;
  tags?: string[];
}

// Validation error
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Validate category
function validateCategory(category: string): category is QACategory {
  return QA_CATEGORIES.includes(category as QACategory);
}

// CREATE - Add new Q&A entry
export async function createQAEntry(input: CreateQAInput): Promise<QAEntry> {
  const { question, answer, category, tags } = input;

  // Validation
  if (!question?.trim()) {
    throw new ValidationError('Question is required');
  }
  if (!answer?.trim()) {
    throw new ValidationError('Answer is required');
  }
  if (!category) {
    throw new ValidationError('Category is required');
  }
  if (!validateCategory(category)) {
    throw new ValidationError(`Invalid category. Must be one of: ${QA_CATEGORIES.join(', ')}`);
  }

  // Save to database
  const [entry] = await db.insert(qaBank).values({
    question: question.trim(),
    answer: answer.trim(),
    category,
    tags: tags || [],
  }).returning();

  return entry;
}

// READ - Get all Q&A entries
export async function getAllQAEntries(): Promise<QAEntry[]> {
  return db
    .select()
    .from(qaBank)
    .orderBy(desc(qaBank.createdAt));
}

// READ - Get single Q&A entry by ID
export async function getQAEntryById(id: string): Promise<QAEntry | null> {
  const [entry] = await db
    .select()
    .from(qaBank)
    .where(eq(qaBank.id, id));
  
  return entry || null;
}

// UPDATE - Update Q&A entry
export async function updateQAEntry(id: string, input: UpdateQAInput): Promise<QAEntry | null> {
  // Check if entry exists
  const existing = await getQAEntryById(id);
  if (!existing) {
    return null;
  }

  // Validate category if provided
  if (input.category && !validateCategory(input.category)) {
    throw new ValidationError(`Invalid category. Must be one of: ${QA_CATEGORIES.join(', ')}`);
  }

  // Build update object (only include provided fields)
  const updateData: Partial<NewQAEntry> = {
    updatedAt: new Date(),
  };

  if (input.question !== undefined) updateData.question = input.question.trim();
  if (input.answer !== undefined) updateData.answer = input.answer.trim();
  if (input.category !== undefined) updateData.category = input.category;
  if (input.tags !== undefined) updateData.tags = input.tags;

  const [updated] = await db
    .update(qaBank)
    .set(updateData)
    .where(eq(qaBank.id, id))
    .returning();

  return updated;
}

// DELETE - Remove Q&A entry
export async function deleteQAEntry(id: string): Promise<boolean> {
  const result = await db
    .delete(qaBank)
    .where(eq(qaBank.id, id))
    .returning();

  return result.length > 0;
}

// READ - Get entries by category
export async function getQAEntriesByCategory(category: QACategory): Promise<QAEntry[]> {
  return db
    .select()
    .from(qaBank)
    .where(eq(qaBank.category, category))
    .orderBy(desc(qaBank.createdAt));
}