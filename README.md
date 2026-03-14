# 학습 리포트 생성기

학생 수업 기록을 입력하면 OpenAI GPT를 활용해 학생별 월간 학습 보고서를 자동 생성하는 내부 업무용 웹앱입니다.

## 실행 방법

### 1. 환경변수 설정

```bash
cp .env.example .env.local
```

`.env.local` 파일을 열어 OpenAI API 키를 입력합니다:

```
OPENAI_API_KEY=sk-...
```

### 2. 의존성 설치 및 실행

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 주요 기능

- 수업 기록 입력 (날짜, 학생명, 학년, 수업시간, 학습단원, 특이사항)
- 행 추가 / 삭제 가능
- 기준월 선택 후 보고서 생성
- 학생명 기준으로 자동 그룹화
- OpenAI GPT-4o로 총평 자동 생성
- 보고서 미리보기 (학습내역 / 총평 4문단 / 수업계획)

## 폴더 구조

```
academy-app/
├── app/
│   ├── page.tsx                    # 메인 페이지
│   ├── layout.tsx
│   ├── globals.css
│   └── api/
│       └── generate-report/
│           └── route.ts            # OpenAI API 서버 라우트
├── components/
│   ├── InputTable.tsx              # 수업 기록 입력 테이블
│   └── ReportCard.tsx              # 보고서 출력 카드
├── lib/
│   ├── types.ts                    # 타입 정의
│   └── prompt.ts                   # OpenAI 프롬프트 (수정 시 여기만)
├── .env.example
└── README.md
```

## 프롬프트 수정

`lib/prompt.ts` 파일의 `REPORT_SYSTEM_PROMPT` 상수를 수정하면 됩니다.
`buildUserPrompt` 함수는 학생 데이터를 프롬프트 형태로 조합합니다.

## 기술 스택

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- OpenAI SDK v6 (gpt-4o)
