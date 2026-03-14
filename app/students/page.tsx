'use client';

import { useState } from 'react';
import AuthGuard from '@/components/AuthGuard';

const DUMMY_STUDENTS = [
  { id: 's001', name: '김지우', grade: '중2', school: '장승중학교', parentPhone: '010-1234-5678', pin: '0001', status: '재원' },
  { id: 's002', name: '이준혁', grade: '중3', school: '중앙중학교', parentPhone: '010-2345-6789', pin: '0002', status: '재원' },
  { id: 's003', name: '박서연', grade: '초6', school: '한빛초등학교', parentPhone: '010-3456-7890', pin: '0003', status: '재원' },
  { id: 's004', name: '최민준', grade: '고1', school: '대한고등학교', parentPhone: '010-4567-8901', pin: '0004', status: '재원' },
  { id: 's005', name: '정하은', grade: '중1', school: '서울중학교', parentPhone: '010-5678-9012', pin: '0005', status: '휴원' },
  { id: 's006', name: '강도윤', grade: '초5', school: '미래초등학교', parentPhone: '010-6789-0123', pin: '0006', status: '퇴원' },
];

const GRADE_ORDER = ['전체', '초4', '초5', '초6', '중1', '중2', '중3', '고1', '고2'];
const STATUS_OPTIONS = ['전체', '재원', '휴원', '퇴원'];
const STATUS_STYLE: Record<string, string> = {
  재원: 'bg-green-100 text-green-700',
  휴원: 'bg-yellow-100 text-yellow-700',
  퇴원: 'bg-gray-100 text-gray-500',
};

function StudentsContent() {
  const [search, setSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState('전체');
  const [statusFilter, setStatusFilter] = useState('전체');

  const filtered = DUMMY_STUDENTS.filter((s) => {
    const matchSearch = s.name.includes(search) || s.school.includes(search);
    const matchGrade = gradeFilter === '전체' || s.grade === gradeFilter;
    const matchStatus = statusFilter === '전체' || s.status === statusFilter;
    return matchSearch && matchGrade && matchStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">학생 목록</h1>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors">
            + 학생 추가
          </button>
        </div>

        {/* 필터 영역 */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-wrap gap-3 items-center">
          <input
            type="text"
            placeholder="이름, 학교 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white outline-none focus:ring-2 focus:ring-blue-400 w-48"
          />
          <select value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white outline-none focus:ring-2 focus:ring-blue-400">
            {GRADE_ORDER.map((g) => <option key={g} value={g}>{g === '전체' ? '학년 전체' : g}</option>)}
          </select>
          <div className="flex gap-1">
            {STATUS_OPTIONS.map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${statusFilter === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {s}
              </button>
            ))}
          </div>
          <span className="ml-auto text-sm text-gray-400">{filtered.length}명</span>
        </div>

        {/* 학생 테이블 */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600">
                <th className="text-left px-4 py-3 font-medium">학생명</th>
                <th className="text-left px-4 py-3 font-medium">학년</th>
                <th className="text-left px-4 py-3 font-medium">학교</th>
                <th className="text-left px-4 py-3 font-medium">학부모 연락처</th>
                <th className="text-left px-4 py-3 font-medium">학생 PIN</th>
                <th className="text-left px-4 py-3 font-medium">상태</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">검색 결과가 없습니다.</td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{s.name}</td>
                    <td className="px-4 py-3 text-gray-600">{s.grade}</td>
                    <td className="px-4 py-3 text-gray-600">{s.school}</td>
                    <td className="px-4 py-3 text-gray-600">{s.parentPhone}</td>
                    <td className="px-4 py-3 font-mono text-gray-600">{s.pin}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLE[s.status]}`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default function StudentsPage() {
  return (
    <AuthGuard allowedRoles={['admin']}>
      <StudentsContent />
    </AuthGuard>
  );
}
