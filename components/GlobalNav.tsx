'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/',          icon: '📝', label: '학습 리포트' },
  { href: '/exam',      icon: '📐', label: '시험 관리' },
  { href: '/textbook',  icon: '📚', label: '교재비 관리' },
  { href: '/schedule',  icon: '📋', label: '배정표' },
];

export default function GlobalNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 h-12 flex items-center px-4 gap-1">
      <span className="text-sm font-bold text-gray-800 mr-3 whitespace-nowrap">이투스 수학학원</span>
      <div className="w-px h-5 bg-gray-200 mr-3" />
      {NAV.map(({ href, icon, label }) => {
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
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
