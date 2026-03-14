'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AuthGuard from '@/components/AuthGuard';

function AISettingsContent() {
  const router = useRouter();
  const [defaultModel, setDefaultModel] = useState<'gpt' | 'claude'>('gpt');

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => router.push('/settings')} className="text-sm text-gray-400 hover:text-gray-700 transition-colors">← 설정</button>
          <span className="text-gray-300">/</span>
          <h1 className="text-lg font-bold text-gray-900">AI 설정</h1>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">기본 AI 모델</label>
            <div className="flex rounded-lg border border-gray-300 overflow-hidden w-fit text-sm font-medium">
              <button onClick={() => setDefaultModel('gpt')} className={`px-5 py-2 transition-colors ${defaultModel === 'gpt' ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>GPT-4o</button>
              <button onClick={() => setDefaultModel('claude')} className={`px-5 py-2 transition-colors border-l border-gray-300 ${defaultModel === 'claude' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>Claude</button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">OpenAI API 키</label>
            <input type="password" placeholder="sk-proj-..." className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-400 font-mono" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Anthropic API 키</label>
            <input type="password" placeholder="sk-ant-..." className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-400 font-mono" />
          </div>
        </div>

        <div className="flex justify-end">
          <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors">저장</button>
        </div>
      </main>
    </div>
  );
}

export default function AISettingsPage() {
  return <AuthGuard allowedRoles={['admin']}><AISettingsContent /></AuthGuard>;
}
