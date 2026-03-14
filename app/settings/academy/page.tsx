'use client';

import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/AuthGuard';

function AcademySettingsContent() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => router.push('/settings')} className="text-sm text-gray-400 hover:text-gray-700 transition-colors">← 설정</button>
          <span className="text-gray-300">/</span>
          <h1 className="text-lg font-bold text-gray-900">학원 정보</h1>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          {[
            { label: '학원명', placeholder: '이투스 수학학원', type: 'text' },
            { label: '대표 연락처', placeholder: '010-0000-0000', type: 'tel' },
            { label: '주소', placeholder: '서울시 강남구...', type: 'text' },
          ].map(({ label, placeholder, type }) => (
            <div key={label}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input type={type} placeholder={placeholder} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-800">계좌 정보</h2>
          {[
            { label: '은행', placeholder: '우리은행' },
            { label: '계좌번호', placeholder: '1002-000-000000' },
            { label: '예금주', placeholder: '홍길동' },
          ].map(({ label, placeholder }) => (
            <div key={label}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input type="text" placeholder={placeholder} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors">저장</button>
        </div>
      </main>
    </div>
  );
}

export default function AcademySettingsPage() {
  return <AuthGuard allowedRoles={['admin']}><AcademySettingsContent /></AuthGuard>;
}
