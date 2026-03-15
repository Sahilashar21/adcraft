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

    // Find the most recent user message for topic checking
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')?.content || '';

    // Simple on-topic check: allow advertising/marketing related queries only
    const isOnTopic = (text) => {
      if (!text || typeof text !== 'string') return false;
      const normalized = text.toLowerCase();
      const allowKeywords = [
        'ad', 'ads', 'advert', 'advertising', 'campaign', 'caption', 'instagram', 'tiktok', 'facebook',
        'marketing', 'product', 'brand', 'promotion', 'promote', 'copy', 'hook', 'headline', 'creative', 'video', 'image'
      ];
      return allowKeywords.some((kw) => normalized.includes(kw));
    };

    if (!isOnTopic(lastUserMessage)) {
      const refusals = [
        "I can help best with advertising, marketing, and creative campaign questions. Could you rephrase your request to focus on those areas?",
        "I'm tuned for ad and marketing support—if you reframe your question around campaigns, captions, or target audiences I'll be happy to help!",
        "That sounds interesting! I specialize in advertising and creative strategy. Try asking about promoting a product or creating a campaign.",
        "I focus on ads, captions, and campaign ideas. If you give me a product or marketing goal I can generate concepts and copy for you.",
        "I want to help with marketing and creative work—could you steer the question toward advertising or promotion?"
      ];

      const choice = refusals[Math.floor(Math.random() * refusals.length)];
      const snippet = lastUserMessage.trim().slice(0, 80);
      const message = snippet ? `${choice} (About: "${snippet}${snippet.length === 80 ? '...' : ''}")` : choice;

      return NextResponse.json({ message });
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
      max_tokens: 500,
      messages: [
        {
          role: 'system',
          content:
            'You are adcraft assistant, an expert advertising assistant. Provide concise, actionable ad ideas, hooks, captions, and campaign suggestions. Ask clarifying questions if needed. Keep responses focused on advertising, marketing, and creative direction.'
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
