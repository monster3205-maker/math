'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUser, logout } from '@/lib/auth';
import type { AuthUser } from '@/lib/auth';

const NAV_BY_ROLE = {
  admin: [
    { href: '/reports',  icon: '📝', label: '학습 리포트' },
    { href: '/exam',     icon: '📐', label: '시험 관리' },
    { href: '/students', icon: '👥', label: '학생 목록' },
    { href: '/textbook', icon: '📚', label: '교재비 관리' },
    { href: '/schedule', icon: '📋', label: '배정표' },
    { href: '/settings', icon: '⚙️', label: '설정' },
  ],
  teacher: [
    { href: '/reports',  icon: '📝', label: '학습 리포트' },
    { href: '/schedule', icon: '📋', label: '배정표' },
  ],
  student: [
    { href: '/student',  icon: '📖', label: '학생모드' },
  ],
};

const ROLE_LABEL: Record<string, string> = {
  admin: '관리자',
  teacher: '선생님',
  student: '학생',
};

export default function GlobalNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, [pathname]);

  if (!user || pathname === '/login') return null;

  const navItems = NAV_BY_ROLE[user.role] ?? [];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 h-12 flex items-center px-4 gap-1">
      <span className="text-sm font-bold text-gray-800 mr-2 whitespace-nowrap hidden sm:block">
        이투스
      </span>
      <div className="w-px h-5 bg-gray-200 mr-2 hidden sm:block" />

      {navItems.map(({ href, icon, label }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              isActive
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <span>{icon}</span>
            <span className="hidden sm:inline">{label}</span>
          </Link>
        );
      })}

      <div className="ml-auto flex items-center gap-2">
        <span className="text-xs text-gray-400 hidden sm:block">
          {user.userId} · <span className="text-gray-500">{ROLE_LABEL[user.role]}</span>
        </span>
        <button
          onClick={handleLogout}
          className="px-3 py-1.5 text-xs text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          로그아웃
        </button>
      </div>
    </nav>
  );
}
