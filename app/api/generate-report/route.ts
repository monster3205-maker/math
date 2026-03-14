import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { REPORT_SYSTEM_PROMPT, buildUserPrompt } from '@/lib/prompt';
import type { GenerateReportRequest, GenerateReportResponse } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body: GenerateReportRequest = await req.json();
    const { studentName, grade, month, year, records } = body;

    if (!studentName || !records || records.length === 0) {
      return NextResponse.json({ error: '학생 정보 또는 수업 기록이 없습니다.' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API 키가 설정되지 않았습니다.' }, { status: 500 });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const userPrompt = buildUserPrompt({ studentName, grade, month, year, records });

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
    if (!raw) {
      return NextResponse.json({ error: 'OpenAI 응답이 비어 있습니다.' }, { status: 500 });
    }

    const result: GenerateReportResponse = JSON.parse(raw);
    return NextResponse.json(result);
  } catch (error) {
    console.error('[generate-report] error:', error);
    const message = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
