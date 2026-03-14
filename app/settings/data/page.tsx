'use client';

import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/AuthGuard';

function DataSettingsContent() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => router.push('/settings')} className="text-sm text-gray-400 hover:text-gray-700 transition-colors">← 설정</button>
          <span className="text-gray-300">/</span>
          <h1 className="text-lg font-bold text-gray-900">데이터 관리</h1>
        </div>

        {[
          {
            title: '데이터 내보내기',
            desc: '학습 기록, 학생 정보를 CSV 파일로 내보냅니다.',
            btn: '내보내기',
            btnStyle: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
          },
          {
            title: '데이터 가져오기',
            desc: 'CSV 파일로 학생 정보를 일괄 등록합니다.',
            btn: '파일 선택',
            btnStyle: 'border border-blue-300 text-blue-700 hover:bg-blue-50',
          },
          {
            title: '수업 기록 초기화',
            desc: '선택한 기간의 수업 기록을 삭제합니다. 되돌릴 수 없습니다.',
            btn: '초기화',
            btnStyle: 'border border-red-300 text-red-600 hover:bg-red-50',
          },
        ].map(({ title, desc, btn, btnStyle }) => (
          <div key={title} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-gray-900 text-sm">{title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
            </div>
            <button className={`shrink-0 px-4 py-1.5 text-sm rounded-lg font-medium transition-colors ${btnStyle}`}>{btn}</button>
          </div>
        ))}
      </main>
    </div>
  );
}

export default function DataSettingsPage() {
  return <AuthGuard allowedRoles={['admin']}><DataSettingsContent /></AuthGuard>;
}
