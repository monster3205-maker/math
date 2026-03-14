'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login, getUser, ROLE_HOME } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const user = getUser();
    if (user) router.replace(ROLE_HOME[user.role]);
  }, [router]);

  const handleLogin = () => {
    setError('');
    const user = login(userId);
    if (!user) {
      setError('등록되지 않은 아이디입니다. 아이디를 확인해주세요.');
      return;
    }
    router.push(ROLE_HOME[user.role]);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* 로고 영역 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-4 text-2xl">
            📐
          </div>
          <h1 className="text-xl font-bold text-gray-900">이투스 수학학원</h1>
          <p className="text-sm text-gray-500 mt-1">통합 관리 시스템</p>
        </div>

        {/* 로그인 카드 */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">아이디</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => { setUserId(e.target.value); setError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="아이디를 입력하세요"
              autoFocus
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 mb-4">{error}</p>
          )}

          <button
            onClick={handleLogin}
            disabled={!userId.trim()}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            로그인
          </button>
        </div>

        {/* 테스트 계정 안내 */}
        <div className="mt-4 bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-semibold text-gray-500 mb-2">테스트 계정</p>
          <div className="space-y-1.5 text-xs text-gray-600">
            <div className="flex justify-between">
              <span className="text-gray-400">관리자</span>
              <code className="bg-gray-100 px-2 py-0.5 rounded text-gray-700">admin01</code>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">선생님</span>
              <code className="bg-gray-100 px-2 py-0.5 rounded text-gray-700">teacher01</code>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">학생</span>
              <code className="bg-gray-100 px-2 py-0.5 rounded text-gray-700">student0001</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
