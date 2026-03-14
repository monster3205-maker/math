import AuthGuard from '@/components/AuthGuard';

function SettingsContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        <h1 className="text-lg font-bold text-gray-900">설정</h1>

        {[
          { title: '학원 정보', desc: '학원명, 연락처, 계좌 정보 등을 관리합니다.' },
          { title: 'AI 설정', desc: 'GPT / Claude API 키 및 기본 모델을 설정합니다.' },
          { title: '계정 관리', desc: '관리자 계정 및 접근 권한을 관리합니다.' },
          { title: '데이터 관리', desc: '학습 기록 백업 및 초기화를 관리합니다.' },
        ].map(({ title, desc }) => (
          <div key={title} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900 text-sm">{title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
            </div>
            <button className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
              관리
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
