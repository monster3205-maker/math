'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/AuthGuard';
import { getUser } from '@/lib/auth';
import { getStudentAccount } from '@/lib/students';
import type { StudentAccount } from '@/lib/students';

// 더미 배정 데이터 (실제 연동 시 examPin 기준으로 조회)
const DUMMY_ASSIGNMENTS: Record<string, { id: string; subject: string; timeLimit: string; assignedAt: string; status: string }[]> = {
  '0001': [
    { id: 'a1', subject: '중2-방정식 기초', timeLimit: '20분', assignedAt: '2026-03-14', status: 'pending' },
    { id: 'a2', subject: '중2-연립방정식 응용', timeLimit: '20분', assignedAt: '2026-03-10', status: 'done' },
  ],
  '0002': [
    { id: 'a3', subject: '중2-이차함수 기초', timeLimit: '20분', assignedAt: '2026-03-14', status: 'pending' },
  ],
};

function StudentContent() {
  const router = useRouter();
  const [account, setAccount] = useState<StudentAccount | null>(null);

  useEffect(() => {
    const user = getUser();
    if (user) setAccount(getStudentAccount(user.userId));
  }, []);

  const assignments = account ? (DUMMY_ASSIGNMENTS[account.examPin] ?? []) : [];
  const pending = assignments.filter((a) => a.status === 'pending');
  const done = assignments.filter((a) => a.status === 'done');

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-xl mx-auto px-4 py-8 space-y-6">

        {/* 학생 인사 */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <p className="text-sm text-gray-500 mb-1">안녕하세요</p>
          <h1 className="text-xl font-bold text-gray-900">
            {account ? `${account.name} 학생` : '로딩 중...'}
          </h1>
          {account && (
            <p className="text-sm text-gray-400 mt-1">{account.grade}</p>
          )}
        </div>

        {/* 배정된 시험 */}
        <div>
          <h2 className="text-sm font-semibold text-gray-600 mb-3">📬 배정된 시험</h2>
          {pending.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center text-sm text-gray-400">
              배정된 시험이 없습니다.
            </div>
          ) : (
            <div className="space-y-3">
              {pending.map((a) => (
                <div key={a.id} className="bg-white rounded-xl border border-blue-100 shadow-sm p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{a.subject}</p>
                      <p className="text-xs text-gray-400 mt-0.5">제한시간 {a.timeLimit} · 배정일 {a.assignedAt}</p>
                    </div>
                    <button
                      onClick={() => router.push('/exam')}
                      className="shrink-0 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors"
                    >
                      시험 시작
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 완료된 시험 */}
        {done.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-gray-600 mb-3">✅ 완료된 시험</h2>
            <div className="space-y-2">
              {done.map((a) => (
                <div key={a.id} className="bg-white rounded-xl border border-gray-100 p-4 opacity-60">
                  <p className="text-sm font-medium text-gray-700">{a.subject}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{a.assignedAt} 완료</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function StudentPage() {
  return (
    <AuthGuard allowedRoles={['student']}>
      <StudentContent />
    </AuthGuard>
  );
}
