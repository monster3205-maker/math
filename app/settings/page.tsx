'use client';

import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/AuthGuard';

const SETTINGS_ITEMS = [
  { title: '학원 정보', desc: '학원명, 연락처, 계좌 정보 등을 관리합니다.', href: '/settings/academy' },
  { title: 'AI 설정',   desc: 'GPT / Claude API 키 및 기본 모델을 설정합니다.', href: '/settings/ai' },
  { title: '계정 관리', desc: '관리자 계정 및 접근 권한을 관리합니다.', href: '/settings/accounts' },
  { title: '데이터 관리', desc: '학습 기록 백업 및 초기화를 관리합니다.', href: '/settings/data' },
];

function SettingsContent() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-3xl mx-auto px-6 py-8 space-y-4">
        <h1 className="text-lg font-bold text-gray-900 mb-6">설정</h1>
        {SETTINGS_ITEMS.map(({ title, desc, href }) => (
          <div key={href} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900 text-sm">{title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
            </div>
            <button
              onClick={() => router.push(href)}
              className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
            >
              관리 →
            </button>
          </div>
        ))}
      </main>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <AuthGuard allowedRoles={['admin']}>
      <SettingsContent />
    </AuthGuard>
  );
}
