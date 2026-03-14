import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { REPORT_SYSTEM_PROMPT, buildUserPrompt } from '@/lib/prompt';
import type { GenerateReportRequest, GenerateReportResponse } from '@/lib/types';

async function generateWithGPT(userPrompt: string): Promise<string> {
  if (!process.env.OPENAI_API_KEY) throw new Error('OpenAI API 키가 설정되지 않았습니다.');
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const completion = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: REPORT_SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  });
  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error('GPT 응답이 비어 있습니다.');
  return raw;
}

async function generateWithClaude(userPrompt: string): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) throw new Error('Claude API 키가 설정되지 않았습니다.');
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: REPORT_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userPrompt }],
    temperature: 0.7,
  });
  const block = message.content[0];
  if (block.type !== 'text') throw new Error('Claude 응답이 비어 있습니다.');
  return block.text;
}

export async function POST(req: NextRequest) {
  try {
    const body: GenerateReportRequest = await req.json();
    const { studentName, grade, month, year, records, provider = 'gpt' } = body;

    if (!studentName || !records || records.length === 0) {
      return NextResponse.json({ error: '학생 정보 또는 수업 기록이 없습니다.' }, { status: 400 });
    }

    const userPrompt = buildUserPrompt({ studentName, grade, month, year, records });
    const raw = provider === 'claude'
      ? await generateWithClaude(userPrompt)
      : await generateWithGPT(userPrompt);

    const result: GenerateReportResponse = JSON.parse(raw);
    return NextResponse.json({ ...result, _provider: provider });
  } catch (error) {
    console.error('[generate-report] error:', error);
    const message = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
