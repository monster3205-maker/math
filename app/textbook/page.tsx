import AuthGuard from '@/components/AuthGuard';

export default function TextbookPage() {
  return (
    <AuthGuard allowedRoles={['admin']}>
      <iframe
        src="/textbook.html"
        className="w-full border-0"
        style={{ height: 'calc(100vh - 48px)' }}
        title="교재비 관리"
      />
    </AuthGuard>
  );
}
