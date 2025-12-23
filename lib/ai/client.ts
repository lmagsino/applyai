import Anthropic from '@anthropic-ai/sdk';

// Initialize Claude client
// API key is read automatically from ANTHROPIC_API_KEY env var
export const claude = new Anthropic();

// Default model - Claude 3.5 Sonnet for best balance of speed/quality
export const DEFAULT_MODEL = 'claude-sonnet-4-20250514';

// Type for document (PDF) content
type DocumentContent = {
  type: 'document';
  source: {
    type: 'base64';
    media_type: 'application/pdf';
    data: string;
  };
};

// Type for text content
type TextContent = {
  type: 'text';
  text: string;
};

// Combined content type
type MessageContent = DocumentContent | TextContent;

// Helper to call Claude with text prompt
export async function askClaude(prompt: string, options?: {
  system?: string;
  maxTokens?: number;
}) {
  const response = await claude.messages.create({
    model: DEFAULT_MODEL,
    max_tokens: options?.maxTokens ?? 4096,
    system: options?.system,
    messages: [
      { role: 'user', content: prompt }
    ],
  });

  // Extract text from response
  const textBlock = response.content.find(block => block.type === 'text');
  return textBlock?.text ?? '';
}

// Helper to call Claude with PDF document
export async function askClaudeWithPDF(
  pdfBase64: string, 
  prompt: string,
  options?: {
    system?: string;
    maxTokens?: number;
  }
) {
  const content: MessageContent[] = [
    {
      type: 'document',
      source: {
        type: 'base64',
        media_type: 'application/pdf',
        data: pdfBase64,
      },
    },
    {
      type: 'text',
      text: prompt,
    },
  ];

  const response = await claude.messages.create({
    model: DEFAULT_MODEL,
    max_tokens: options?.maxTokens ?? 4096,
    system: options?.system,
    messages: [
      { role: 'user', content }
    ],
  });

  // Extract text from response
  const textBlock = response.content.find(block => block.type === 'text');
  return textBlock?.text ?? '';
}