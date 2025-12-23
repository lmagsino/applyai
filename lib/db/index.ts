import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Connection string from environment
const connectionString = process.env.DATABASE_URL!;

// Create postgres client
// max: 1 for serverless environments (like Vercel)
const client = postgres(connectionString, { 
  max: 1,
  ssl: 'require'
});

// Create drizzle instance with schema
export const db = drizzle(client, { schema });

// Export for use elsewhere
export type Database = typeof db;