import { NextResponse } from 'next/server';
import OpenAI from 'openai';

let openai = null;
function getOpenAIClient() {
  if (!openai && process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY !== 'your-openrouter-api-key-here') {
    openai = new OpenAI({
      baseURL: process.env.OPENAI_BASE_URL || 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY,
      defaultHeaders: {
        'HTTP-Referer': process.env.SITE_URL || 'http://localhost:3000',
        'X-Title': process.env.SITE_NAME || 'Career Guidance System',
      },
    });
  }
  return openai;
}

const ROADMAP_PROMPT = `Generate a detailed learning roadmap for the given topic. 
Create a Mermaid flowchart diagram that shows:
1. Clear progression from beginner to advanced levels
2. Specific skills, technologies, or concepts to learn
3. Logical dependencies between topics
4. Estimated timeframes for each phase
5. Key milestones and projects

Format the response as valid Mermaid flowchart syntax only. Use:
- flowchart TD (top-down direction)
- Rectangle nodes for main topics: [Topic Name]
- Rounded rectangle nodes for skills: (Skill Name)
- Diamond nodes for decisions/milestones: {Milestone}
- Arrows to show progression: -->
- Subgraphs for grouping related concepts

Make sure the diagram is syntactically correct and follows Mermaid standards.
Only return the Mermaid code, no explanations or markdown formatting.`;

function validateMermaidSyntax(mermaidCode) {
  if (!mermaidCode?.trim()) return false;
  if (!mermaidCode.includes('flowchart')) return false;
  return true;
}

async function generateRoadmap(client, topic) {
  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'deepseek/deepseek-chat-v3.1:free',
    messages: [
      { role: 'system', content: ROADMAP_PROMPT },
      { role: 'user', content: `Create a comprehensive learning roadmap for: ${topic}` },
    ],
    max_tokens: 1500,
    temperature: 0.7,
  });
  const mermaidCode = completion.choices[0].message.content.trim();
  if (!validateMermaidSyntax(mermaidCode)) throw new Error('Invalid Mermaid syntax');
  return mermaidCode;
}

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const topic = url.searchParams.get('topic');
    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return NextResponse.json({ error: 'Invalid topic parameter' }, { status: 400 });
    }
    const client = getOpenAIClient();
    if (!client) return NextResponse.json({ error: 'Service Unavailable', message: 'OpenRouter client could not be initialized. Please check API key configuration.' }, { status: 500 });
    const mermaidCode = await generateRoadmap(client, topic.trim());
    return NextResponse.json({ success: true, topic: topic.trim(), mermaidCode, generatedAt: new Date().toISOString(), message: 'Roadmap generated successfully' });
  } catch (error) {
    const msg = error?.message || '';
    if (msg.includes('API key')) return NextResponse.json({ error: 'Configuration Error', message: 'OpenAI API key is not configured properly' }, { status: 500 });
    if (msg.includes('rate limit')) return NextResponse.json({ error: 'Rate Limit Exceeded', message: 'Too many requests. Please try again later.' }, { status: 429 });
    if (msg.includes('Invalid Mermaid')) return NextResponse.json({ error: 'Generation Failed', message: 'Unable to generate valid roadmap diagram' }, { status: 500 });
    return NextResponse.json({ error: 'Internal Server Error', message: 'An unexpected error occurred while generating the roadmap' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
