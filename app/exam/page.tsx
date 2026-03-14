import AuthGuard from '@/components/AuthGuard';

export default function ExamPage() {
  return (
    <AuthGuard allowedRoles={['admin']}>
      <iframe
        src="/exam-system.html"
        className="w-full border-0"
        style={{ height: 'calc(100vh - 48px)' }}
        title="15Q20M 시험 관리 시스템"
      />
    </AuthGuard>
  );
}
