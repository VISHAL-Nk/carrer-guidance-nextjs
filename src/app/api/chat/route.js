
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


async function generateWithRetry(model, prompt, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt }
            ]
          }
        ]
      });
      return result;
    } catch (error) {
      if (error.status === 503 && attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
}

export async function POST(req){
  const { message, lang } = await req.json();
  try {
    
    const prompt = `You are a career guidance assistant for students (10th and 12th standard). Answer only questions related to career guidance. For each query, provide advice and a neat and provide clear step by step roadmap of the suitable career. and give the information about suitable exams and  scholorships.Query: ${message}.Respond in ${lang} language.`;
    const result = await generateWithRetry(model, prompt);

    const aiResponse = result.response.text();
    return NextResponse.json({ reply: aiResponse });
  } catch (err) {
    console.error(err);
    if (err.status === 503) {
      return NextResponse.json({ reply: "The AI service is currently overloaded. Please try again in a few moments." }, { status: 503 });
    }
    return NextResponse.json({ reply: "Something went wrong while fetching AI response." }, { status: 500 });
  }
};
