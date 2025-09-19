import { flowchart } from "@/lib/data/mermaidDiagram";
import { NextResponse } from "next/server";
import OpenAI from "openai";

let openai = null;
function getOpenAIClient() {
  if (
    !openai &&
    process.env.OPENROUTER_API_KEY &&
    process.env.OPENROUTER_API_KEY !== "your-openrouter-api-key-here"
  ) {
    openai = new OpenAI({
      baseURL: process.env.OPENAI_BASE_URL || "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
      defaultHeaders: {
        "HTTP-Referer": process.env.SITE_URL || "http://localhost:3000",
        "X-Title": process.env.SITE_NAME || "Career Guidance System",
      },
    });
  }
  return openai;
}

const ROADMAP_PROMPT = `You are a Mermaid flowchart generator. Given a topic, output ONLY a valid Mermaid flowchart (no explanation, no markdown, nothing else).
Requirements (must be enforced each time):

1. Always begin with: flowchart TD
2. Node IDs must match ^[A-Za-z][A-Za-z0-9_]*$ (no spaces). Use underscores in IDs.
3. Shapes:
   - Rectangles for main stages: [Label]
   - Rounded nodes for streams/courses: (Label)
   - Diamonds for decisions/milestones: {Label}
4. Follow a strict sequential backbone: [10th Standard] --> [11th-12th] --> {Entrance Exams} --> (UG Programs) --> (PG Programs) --> (PhD/Research) --> [Careers]
   - Minimal branching allowed only at diamond nodes (decisions/exams). Any branch must rejoin or continue forward.
5. Avoid subgraphs by default. If a subgraph is necessary, ensure unique subgraph name and a closing "end" and that all nodes inside connect to the backbone.
6. Use only the arrow type: -->
7. No duplicate IDs. No isolated nodes — every defined node ID must appear in at least one connection.
8. Labels may contain spaces but MUST NOT contain unmatched [], (), {} characters or nested parentheses that conflict with node delimiters.
9. Before returning, perform a self-check and fix issues:
   - Balanced brackets/braces/parentheses count.
   - No duplicate IDs.
   - Every defined ID appears in a connection.
   - No orphaned "subgraph" or missing "end".
   - Replace any invalid characters in IDs with underscores.
10. If the requested diagram would violate these rules (too many parallel branches, invalid characters, etc.), simplify or collapse nodes so the Mermaid remains valid while preserving intent.
Output: the final, valid Mermaid flowchart code only.`;

function validateMermaidSyntax(mermaidCode) {
  if (!mermaidCode?.trim()) return false;
  if (!mermaidCode.includes("flowchart")) return false;
  return true;
}

async function generateRoadmap(client, topic) {
  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || "deepseek/deepseek-chat-v3.1:free",
    messages: [
      { role: "system", content: ROADMAP_PROMPT },
      {
        role: "user",
        content: `Create a comprehensive learning roadmap for: ${topic}`,
      },
    ],
    max_tokens: 1500,
    temperature: 0.7,
  });
  const mermaidCode = flowchart[topic];
  if (!validateMermaidSyntax(mermaidCode))
    throw new Error("Invalid Mermaid syntax");
  return mermaidCode;
}

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const topic = url.searchParams.get("topic");
    if (!topic || typeof topic !== "string" || topic.trim().length === 0) {
      return NextResponse.json(
        { error: "Invalid topic parameter" },
        { status: 400 }
      );
    }
    const client = getOpenAIClient();
    if (!client)
      return NextResponse.json(
        {
          error: "Service Unavailable",
          message:
            "OpenRouter client could not be initialized. Please check API key configuration.",
        },
        { status: 500 }
      );
    const mermaidCode = await generateRoadmap(client, topic.trim());
    return NextResponse.json({
      success: true,
      topic: topic.trim(),
      mermaidCode,
      generatedAt: new Date().toISOString(),
      message: "Roadmap generated successfully",
    });
  } catch (error) {
    const msg = error?.message || "";
    if (msg.includes("API key"))
      return NextResponse.json(
        {
          error: "Configuration Error",
          message: "OpenAI API key is not configured properly",
        },
        { status: 500 }
      );
    if (msg.includes("rate limit"))
      return NextResponse.json(
        {
          error: "Rate Limit Exceeded",
          message: "Too many requests. Please try again later.",
        },
        { status: 429 }
      );
    if (msg.includes("Invalid Mermaid"))
      return NextResponse.json(
        {
          error: "Generation Failed",
          message: "Unable to generate valid roadmap diagram",
        },
        { status: 500 }
      );
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "An unexpected error occurred while generating the roadmap",
      },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
