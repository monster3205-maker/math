'use client';

import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/AuthGuard';

const DUMMY_ACCOUNTS = [
  { id: 'admin01',    role: '관리자', createdAt: '2026-01-01' },
  { id: 'teacher01',  role: '선생님', createdAt: '2026-01-05' },
  { id: 'teacher02',  role: '선생님', createdAt: '2026-02-01' },
];

const ROLE_STYLE: Record<string, string> = {
  관리자: 'bg-purple-100 text-purple-700',
  선생님: 'bg-blue-100 text-blue-700',
};

function AccountsSettingsContent() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => router.push('/settings')} className="text-sm text-gray-400 hover:text-gray-700 transition-colors">← 설정</button>
          <span className="text-gray-300">/</span>
          <h1 className="text-lg font-bold text-gray-900">계정 관리</h1>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-800">계정 목록</p>
            <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors">+ 계정 추가</button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-600">
                <th className="text-left px-5 py-3 font-medium">아이디</th>
                <th className="text-left px-5 py-3 font-medium">권한</th>
                <th className="text-left px-5 py-3 font-medium">생성일</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {DUMMY_ACCOUNTS.map((a) => (
                <tr key={a.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="px-5 py-3 font-mono text-gray-800">{a.id}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${ROLE_STYLE[a.role]}`}>{a.role}</span>
                  </td>
                  <td className="px-5 py-3 text-gray-500">{a.createdAt}</td>
                  <td className="px-5 py-3 text-right">
                    <button className="text-xs text-red-400 hover:text-red-600 transition-colors">삭제</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default function AccountsSettingsPage() {
  return <AuthGuard allowedRoles={['admin']}><AccountsSettingsContent /></AuthGuard>;
}
