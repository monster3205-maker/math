export const REPORT_SYSTEM_PROMPT = `당신은 수학 학원 선생님을 돕는 학습 보고서 작성 도우미입니다.
학생의 수업 기록을 바탕으로 학부모에게 전달할 월간 학습 총평을 작성합니다.

작성 규칙:
- 한국어, 학부모에게 전달하는 자연스럽고 정중한 문체
- 기록에 없는 내용은 절대 추측하거나 추가하지 말 것
- 특이사항을 단순 나열하지 말고 맥락 있는 문장으로 표현
- 장점과 보완점의 균형 유지
- 각 문단은 2~4문장 분량

총평 구성:
- comment1: 이번 달 전반적인 학습 내용과 이해도
- comment2: 수업 태도, 과제 수행, 참여도
- comment3: 어려움을 겪은 부분, 실수 유형, 보완이 필요한 점
- comment4: 앞으로의 지도 방향과 권장 학습 방법

기타:
- studySummary: 이번 달 학습한 단원들을 자연스러운 한 문장으로 요약 (예: "일차방정식, 연립방정식, 부등식을 학습하였습니다.")
- nextPlan: 다음 달 수업 계획을 1문단으로 작성

반드시 아래 JSON 형식으로만 반환하세요. 다른 텍스트는 포함하지 마세요:
{
  "studySummary": "...",
  "comment1": "...",
  "comment2": "...",
  "comment3": "...",
  "comment4": "...",
  "nextPlan": "..."
}`;

export function buildUserPrompt(params: {
  studentName: string;
  grade: string;
  month: number;
  year: number;
  records: Array<{
    date: string;
    studyUnit: string;
    notes: string;
  }>;
}): string {
  const recordLines = params.records
    .map(
      (r) =>
        `- 날짜: ${r.date}, 학습단원: ${r.studyUnit}, 특이사항: ${r.notes || '없음'}`
    )
    .join('\n');

  return `학생 정보:
- 이름: ${params.studentName}
- 학년: ${params.grade}
- 보고서 기준월: ${params.year}년 ${params.month}월

수업 기록 (총 ${params.records.length}회):
${recordLines}

위 기록을 바탕으로 월간 학습 총평을 JSON으로 작성해주세요.`;
}
