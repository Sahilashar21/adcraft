import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages are required' },
        { status: 400 }
      );
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
      max_tokens: 500,
      messages: [
        {
          role: 'system',
          content:
            'You are Shraddha, an expert advertising assistant. Provide concise, actionable ad ideas, hooks, captions, and campaign suggestions. Ask clarifying questions if needed. Keep responses focused on advertising, marketing, and creative direction.'
        },
        ...messages.map((m) => ({ role: m.role, content: m.content }))
      ]
    });

    const message = completion.choices?.[0]?.message?.content?.trim();

    return NextResponse.json({
      message: message || 'I could not generate a response. Please try again.'
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
