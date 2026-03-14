'use client';

import type { LessonRecord } from '@/lib/types';

interface Props {
  records: LessonRecord[];
  onAdd: () => void;
  onDelete: (id: string) => void;
  onChange: (id: string, field: keyof LessonRecord, value: string) => void;
}

const GRADE_OPTIONS = [
  '초1', '초2', '초3', '초4', '초5', '초6',
  '중1', '중2', '중3',
  '고1', '고2', '고3',
];

export default function InputTable({ records, onAdd, onDelete, onChange }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="border border-gray-300 px-3 py-2 whitespace-nowrap">날짜</th>
            <th className="border border-gray-300 px-3 py-2 whitespace-nowrap">학생명</th>
            <th className="border border-gray-300 px-3 py-2 whitespace-nowrap">학년</th>
            <th className="border border-gray-300 px-3 py-2 whitespace-nowrap">학습단원</th>
            <th className="border border-gray-300 px-3 py-2">특이사항</th>
            <th className="border border-gray-300 px-3 py-2 whitespace-nowrap">삭제</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 p-1">
                <input
                  type="date"
                  value={record.date}
                  onChange={(e) => onChange(record.id, 'date', e.target.value)}
                  className="w-full px-2 py-1 text-sm text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-blue-400 rounded"
                />
              </td>
              <td className="border border-gray-300 p-1">
                <input
                  type="text"
                  value={record.studentName}
                  onChange={(e) => onChange(record.id, 'studentName', e.target.value)}
                  placeholder="홍길동"
                  className="w-24 px-2 py-1 text-sm text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-blue-400 rounded"
                />
              </td>
              <td className="border border-gray-300 p-1">
                <select
                  value={record.grade}
                  onChange={(e) => onChange(record.id, 'grade', e.target.value)}
                  className="w-20 px-2 py-1 text-sm text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-blue-400 rounded"
                >
                  <option value="">선택</option>
                  {GRADE_OPTIONS.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </td>
              <td className="border border-gray-300 p-1">
                <input
                  type="text"
                  value={record.studyUnit}
                  onChange={(e) => onChange(record.id, 'studyUnit', e.target.value)}
                  placeholder="일차방정식"
                  className="w-32 px-2 py-1 text-sm text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-blue-400 rounded"
                />
              </td>
              <td className="border border-gray-300 p-1">
                <input
                  type="text"
                  value={record.notes}
                  onChange={(e) => onChange(record.id, 'notes', e.target.value)}
                  placeholder="특이사항 없음"
                  className="w-full min-w-48 px-2 py-1 text-sm text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-blue-400 rounded"
                />
              </td>
              <td className="border border-gray-300 p-1 text-center">
                <button
                  onClick={() => onDelete(record.id)}
                  className="text-red-500 hover:text-red-700 font-bold px-2 py-1 rounded hover:bg-red-50 transition-colors"
                  title="행 삭제"
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={onAdd}
        className="mt-3 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border border-dashed border-gray-400 transition-colors"
      >
        + 행 추가
      </button>
    </div>
  );
}
