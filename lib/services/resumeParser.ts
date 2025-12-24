import { askClaudeWithPDF } from '@/lib/ai/client';
import { ExperienceEntry, EducationEntry } from '@/lib/db/schema';

// The structured data we expect Claude to extract
export interface ParsedResume {
  name: string | null;
  email: string | null;
  phone: string | null;
  skills: string[];
  experience: ExperienceEntry[];
  education: EducationEntry[];
  fullText: string;
}

// System prompt that tells Claude how to behave
const SYSTEM_PROMPT = `You are a resume parser. Your job is to extract structured information from resumes.

You must ALWAYS respond with valid JSON only. No explanations, no markdown, just pure JSON.

Be thorough but accurate:
- Extract ALL skills mentioned (technical and soft skills)
- Capture EVERY job in work history
- Include ALL education entries
- If information is missing or unclear, use null for strings or empty arrays for lists`;

// The prompt template for parsing
const PARSE_PROMPT = `Parse this resume and extract the following information into JSON format:

{
  "name": "Full name or null if not found",
  "email": "Email address or null if not found",
  "phone": "Phone number or null if not found",
  "skills": ["Array", "of", "skills"],
  "experience": [
    {
      "title": "Job title",
      "company": "Company name",
      "startDate": "YYYY-MM or approximate",
      "endDate": "YYYY-MM or null if current",
      "highlights": ["Key achievement 1", "Key achievement 2"]
    }
  ],
  "education": [
    {
      "degree": "Degree name",
      "school": "School name",
      "graduationDate": "YYYY or YYYY-MM",
      "gpa": "GPA if mentioned or null"
    }
  ],
  "fullText": "Complete plain text extraction of the resume"
}

Important:
- Return ONLY valid JSON, no other text
- For dates, use YYYY-MM format when possible, or just YYYY
- For current jobs, set endDate to null
- Extract the full text for searchability`;

// Main parser function
export async function parseResume(pdfBase64: string): Promise<ParsedResume> {
  // Call Claude with the PDF
  const response = await askClaudeWithPDF(pdfBase64, PARSE_PROMPT, {
    system: SYSTEM_PROMPT,
    maxTokens: 8096, // Resumes can be long
  });

  // Parse the JSON response
  try {
    // Clean the response in case Claude added markdown code blocks
    let cleanedResponse = response.trim();
    
    // Remove markdown code blocks if present
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.slice(7);
    } else if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.slice(3);
    }
    if (cleanedResponse.endsWith('```')) {
      cleanedResponse = cleanedResponse.slice(0, -3);
    }
    
    const parsed = JSON.parse(cleanedResponse.trim());
    
    // Validate and return with defaults for missing fields
    return {
      name: parsed.name ?? null,
      email: parsed.email ?? null,
      phone: parsed.phone ?? null,
      skills: Array.isArray(parsed.skills) ? parsed.skills : [],
      experience: Array.isArray(parsed.experience) ? parsed.experience : [],
      education: Array.isArray(parsed.education) ? parsed.education : [],
      fullText: parsed.fullText ?? '',
    };
  } catch (error) {
    console.error('Failed to parse Claude response:', response);
    throw new Error('Failed to parse resume. Claude returned invalid JSON.');
  }
}