'use client';

import { useRef } from 'react';
import type { ReportData } from '@/lib/types';

interface Props {
  report: ReportData;
}

export default function ReportCard({ report }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  async function handleSaveImage() {
    if (!cardRef.current) return;
    const { toPng } = await import('html-to-image');
    const dataUrl = await toPng(cardRef.current, {
      pixelRatio: 2,
      backgroundColor: '#ffffff',
    });
    const link = document.createElement('a');
    link.download = `${report.studentName}_${report.year}년_${report.month}월_학습리포트.png`;
    link.href = dataUrl;
    link.click();
  }

  function handlePrint() {
    if (!cardRef.current) return;
    const html = cardRef.current.innerHTML;
    const win = window.open('', '_blank', 'width=800,height=1000');
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html>
      <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <title>${report.studentName} ${report.year}년 ${report.month}월 학습리포트</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: Arial, Helvetica, sans-serif; background: #fff; color: #171717; padding: 32px; }
          .card { max-width: 640px; margin: 0 auto; }
          .text-center { text-align: center; }
          .mb-1 { margin-bottom: 4px; }
          .mb-3 { margin-bottom: 12px; }
          .mb-6 { margin-bottom: 24px; }
          .mb-8 { margin-bottom: 32px; }
          .mt-3 { margin-top: 12px; }
          .pb-6 { padding-bottom: 24px; }
          .pt-4 { padding-top: 16px; }
          .pl-4 { padding-left: 16px; }
          .p-4 { padding: 16px; }
          .text-sm { font-size: 13px; }
          .text-xs { font-size: 11px; }
          .text-2xl { font-size: 24px; }
          .text-lg { font-size: 18px; }
          .text-base { font-size: 15px; }
          .font-bold { font-weight: 700; }
          .font-semibold { font-weight: 600; }
          .leading-relaxed { line-height: 1.65; }
          .border-b { border-bottom: 1px solid #e5e7eb; }
          .border-t { border-top: 1px solid #e5e7eb; }
          .border-l-4 { border-left: 4px solid; }
          .border-green-300 { border-color: #86efac; }
          .text-gray-900 { color: #111827; }
          .text-gray-800 { color: #1f2937; }
          .text-gray-700 { color: #374151; }
          .text-gray-600 { color: #4b5563; }
          .text-gray-500 { color: #6b7280; }
          .text-gray-400 { color: #9ca3af; }
          .text-blue-700 { color: #1d4ed8; }
          .text-green-700 { color: #15803d; }
          .text-green-600 { color: #16a34a; }
          .text-orange-700 { color: #c2410c; }
          .bg-blue-50 { background-color: #eff6ff; border-radius: 8px; }
          .bg-orange-50 { background-color: #fff7ed; border-radius: 8px; }
          .space-y-3 > * + * { margin-top: 12px; }
          .space-y-1 > * + * { margin-top: 4px; }
          .flex { display: flex; }
          .items-center { align-items: center; }
          .justify-center { justify-content: center; }
          .gap-2 { gap: 8px; }
          .gap-4 { gap: 16px; }
          .whitespace-nowrap { white-space: nowrap; }
          .accent-bar { display: inline-block; width: 6px; height: 20px; border-radius: 9999px; }
          .bg-blue-600 { background-color: #2563eb; }
          .bg-green-600 { background-color: #16a34a; }
          .bg-orange-500 { background-color: #f97316; }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="card">${html}</div>
        <script>window.onload = function() { window.print(); window.close(); }<\/script>
      </body>
      </html>
    `);
    win.document.close();
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* 액션 버튼 */}
      <div className="flex justify-end gap-2 mb-2">
        <button
          onClick={handleSaveImage}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          이미지 저장
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 6 2 18 2 18 9" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect x="6" y="14" width="12" height="8" />
          </svg>
          인쇄
        </button>
      </div>

      {/* 카드 본문 */}
      <div ref={cardRef} className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
        {/* 헤더 */}
        <div className="text-center mb-8 pb-6 border-b border-gray-200">
          <p className="text-sm text-gray-500 mb-1">수학 학원</p>
          <h1 className="text-2xl font-bold text-gray-900">
            {report.month}월 학습 리포트
          </h1>
          <div className="mt-3 flex items-center justify-center gap-4 text-gray-700">
            <span className="text-lg font-semibold">{report.studentName}</span>
            <span className="text-gray-400">|</span>
            <span>{report.grade}</span>
            <span className="text-gray-400">|</span>
            <span>{report.year}년 {report.month}월</span>
          </div>
        </div>

        {/* 섹션 1: 학습 내역 */}
        <section className="mb-6">
          <h2 className="text-base font-bold text-blue-700 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-blue-600 rounded-full inline-block" />
            {report.month}월 학습 내역
          </h2>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-gray-800 leading-relaxed">{report.studySummary}</p>
            <ul className="mt-3 space-y-1">
              {report.records.map((r, i) => (
                <li key={i} className="text-sm text-gray-600 flex gap-2">
                  <span className="text-gray-400 whitespace-nowrap">{r.date}</span>
                  <span>{r.studyUnit}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 섹션 2: 총평 */}
        <section className="mb-6">
          <h2 className="text-base font-bold text-green-700 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-green-600 rounded-full inline-block" />
            {report.month}월 총평
          </h2>
          <div className="space-y-3">
            {[
              { label: '학습 내용 및 이해도', content: report.comment1 },
              { label: '수업 태도 및 참여도', content: report.comment2 },
              { label: '보완점', content: report.comment3 },
              { label: '지도 방향', content: report.comment4 },
            ].map(({ label, content }) => (
              <div key={label} className="border-l-4 border-green-300 pl-4">
                <p className="text-xs font-semibold text-green-600 mb-1">{label}</p>
                <p className="text-gray-800 text-sm leading-relaxed">{content}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 섹션 3: 수업 계획 */}
        <section className="mb-8">
          <h2 className="text-base font-bold text-orange-700 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-orange-500 rounded-full inline-block" />
            수업 계획
          </h2>
          <div className="bg-orange-50 rounded-lg p-4">
            <p className="text-gray-800 text-sm leading-relaxed">{report.nextPlan}</p>
          </div>
        </section>

        {/* 하단 안내문구 */}
        <div className="border-t border-gray-200 pt-4 text-center">
          <p className="text-xs text-gray-500 leading-relaxed">
            자세한 통계는 매쓰플랫 부모님 앱에서 확인할 수 있습니다.<br />
            기타 사항은 학원으로 문의 바랍니다.
          </p>
        </div>
      </div>
    </div>
  );
}
