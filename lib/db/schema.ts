import { 
  pgTable, 
  uuid, 
  text, 
  varchar, 
  timestamp, 
  jsonb,
  pgEnum,
  vector,
  integer
} from 'drizzle-orm/pg-core';

// ============================================
// ENUMS
// ============================================

// Job application status
export const applicationStatusEnum = pgEnum('application_status', [
  'wishlist',
  'applied', 
  'interviewing', 
  'offered', 
  'rejected', 
  'accepted'
]);

// Q&A categories
export const qaCategoryEnum = pgEnum('qa_category', [
  'behavioral',
  'technical', 
  'hr', 
  'situational'
]);

// Generated output types
export const outputTypeEnum = pgEnum('output_type', [
  'cover_letter',
  'interview_prep',
  'gap_analysis',
  'tailored_qa'
]);

// ============================================
// TABLES
// ============================================

// --------------------------------------------
// RESUMES
// Stores parsed resume data
// --------------------------------------------
export const resumes = pgTable('resumes', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  // Raw text for AI context
  fullText: text('full_text').notNull(),
  
  // Parsed contact info
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  
  // Structured data (flexible JSON)
  skills: jsonb('skills').$type<string[]>().default([]),
  experience: jsonb('experience').$type<ExperienceEntry[]>().default([]),
  education: jsonb('education').$type<EducationEntry[]>().default([]),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// --------------------------------------------
// QA BANK
// Your interview Q&A library
// --------------------------------------------
export const qaBank = pgTable('qa_bank', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  // The Q&A content
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  
  // Categorization
  category: qaCategoryEnum('category').notNull(),
  tags: text('tags').array().default([]),
  
  // Vector embedding for semantic search
  // 1536 dimensions = OpenAI/Claude embedding size
  embedding: vector('embedding', { dimensions: 1536 }),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// --------------------------------------------
// JOB APPLICATIONS
// Track where you've applied
// --------------------------------------------
export const jobApplications = pgTable('job_applications', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  // Link to resume used
  resumeId: uuid('resume_id').references(() => resumes.id),
  
  // Job details
  company: varchar('company', { length: 255 }).notNull(),
  position: varchar('position', { length: 255 }).notNull(),
  jobDescription: text('job_description'),
  jobUrl: varchar('job_url', { length: 500 }),
  
  // Tracking
  status: applicationStatusEnum('status').default('wishlist').notNull(),
  notes: text('notes'),
  appliedAt: timestamp('applied_at'),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// --------------------------------------------
// GENERATED OUTPUTS
// AI-generated content linked to applications
// --------------------------------------------
export const generatedOutputs = pgTable('generated_outputs', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  // Link to application
  applicationId: uuid('application_id')
    .references(() => jobApplications.id)
    .notNull(),
  
  // Output details
  type: outputTypeEnum('type').notNull(),
  content: text('content').notNull(),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================
// TYPESCRIPT TYPES
// ============================================

// Types for JSONB columns
export interface ExperienceEntry {
  title: string;
  company: string;
  startDate: string;
  endDate: string | null;
  highlights: string[];
}

export interface EducationEntry {
  degree: string;
  school: string;
  graduationDate: string;
  gpa?: string;
}

// Infer types from schema (for use in app)
export type Resume = typeof resumes.$inferSelect;
export type NewResume = typeof resumes.$inferInsert;

export type QAEntry = typeof qaBank.$inferSelect;
export type NewQAEntry = typeof qaBank.$inferInsert;

export type JobApplication = typeof jobApplications.$inferSelect;
export type NewJobApplication = typeof jobApplications.$inferInsert;

export type GeneratedOutput = typeof generatedOutputs.$inferSelect;
export type NewGeneratedOutput = typeof generatedOutputs.$inferInsert;