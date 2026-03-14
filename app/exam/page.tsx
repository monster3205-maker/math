'use client';

import { useEffect, useState } from 'react';
import AuthGuard from '@/components/AuthGuard';
import { getUser } from '@/lib/auth';

function ExamContent() {
  const [src, setSrc] = useState('');

  useEffect(() => {
    const user = getUser();
    setSrc(user?.role === 'admin' ? '/exam-system.html?autoAdmin=1' : '/exam-system.html');
  }, []);

  if (!src) return null;

  return (
    <iframe
      src={src}
      className="w-full border-0"
      style={{ height: 'calc(100vh - 48px)' }}
      title="15Q20M 시험 관리 시스템"
    />
  );
}

export default function ExamPage() {
  return (
    <AuthGuard allowedRoles={['admin', 'student']}>
      <ExamContent />
    </AuthGuard>
  );
}
