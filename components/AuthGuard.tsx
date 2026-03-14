'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getUser, canAccess } from '@/lib/auth';
import type { Role } from '@/lib/auth';

interface Props {
  allowedRoles?: Role[];
  children: React.ReactNode;
}

export default function AuthGuard({ allowedRoles, children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<'loading' | 'ok' | 'forbidden'>('loading');

  useEffect(() => {
    const user = getUser();
    if (!user) {
      router.replace('/login');
      return;
    }
    const allowed = allowedRoles
      ? allowedRoles.includes(user.role)
      : canAccess(user.role, pathname);

    setStatus(allowed ? 'ok' : 'forbidden');
  }, [pathname, allowedRoles, router]);

  if (status === 'loading') {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-400 text-sm">로딩 중...</div>
    </div>;
  }

  if (status === 'forbidden') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-4">🔒</p>
          <h1 className="text-lg font-semibold text-gray-800 mb-2">접근 권한이 없습니다</h1>
          <p className="text-sm text-gray-500 mb-6">이 페이지에 접근할 수 있는 권한이 없습니다.</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
