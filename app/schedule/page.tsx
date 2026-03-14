import AuthGuard from '@/components/AuthGuard';

export default function SchedulePage() {
  return (
    <AuthGuard allowedRoles={['admin', 'teacher']}>
      <iframe
        src="/schedule.html"
        className="w-full border-0"
        style={{ height: 'calc(100vh - 48px)' }}
        title="학원 배정표"
      />
    </AuthGuard>
  );
}
