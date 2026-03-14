'use client';

import { useState } from 'react';
import InputTable from '@/components/InputTable';
import ReportCard from '@/components/ReportCard';
import type { LessonRecord, ReportData, GenerateReportRequest, GenerateReportResponse } from '@/lib/types';

const SAMPLE_RECORDS: LessonRecord[] = [
  { id: '1', date: '2024-03-05', studentName: '김지우', grade: '중2', studyUnit: '일차방정식', notes: '개념 이해 빠름, 풀이 과정 생략하는 습관 있음' },
  { id: '2', date: '2024-03-12', studentName: '김지우', grade: '중2', studyUnit: '연립방정식', notes: '과제 완료, 속도가 느린 편' },
  { id: '3', date: '2024-03-19', studentName: '김지우', grade: '중2', studyUnit: '부등식', notes: '집중력 좋음, 응용 문제 미숙' },
  { id: '4', date: '2024-03-07', studentName: '이준혁', grade: '중3', studyUnit: '이차방정식', notes: '공식 암기 부족' },
  { id: '5', date: '2024-03-14', studentName: '이준혁', grade: '중3', studyUnit: '이차함수', notes: '과제 미완료, 이해도 보통' },
  { id: '6', date: '2024-03-21', studentName: '이준혁', grade: '중3', studyUnit: '이차함수 활용', notes: '이전보다 집중력 향상, 질문 적극적으로 함' },
];

const GRADE_ORDER = ['초4','초5','초6','중1','중2','중3','고1','고2'];

type GradeTab = '전체' | string;

function GradeTabs({
  activeTab,
  availableGrades,
  onChange,
  counts,
}: {
  activeTab: GradeTab;
  availableGrades: string[];
  onChange: (tab: GradeTab) => void;
  counts: Record<string, number>;
}) {
  const sorted = GRADE_ORDER.filter((g) => availableGrades.includes(g));
  const tabs: GradeTab[] = ['전체', ...sorted];
  return (
    <div className="flex flex-wrap gap-1 mb-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
            activeTab === tab
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {tab}
          <span className={`ml-1.5 text-xs ${activeTab === tab ? 'text-blue-200' : 'text-gray-400'}`}>
            {counts[tab] ?? 0}
          </span>
        </button>
      ))}
    </div>
  );
}

function createEmptyRecord(): LessonRecord {
  return {
    id: crypto.randomUUID(),
    date: new Date().toISOString().slice(0, 10),
    studentName: '',
    grade: '',
    studyUnit: '',
    notes: '',
  };
}

export default function Home() {
  const today = new Date();
  const [records, setRecords] = useState<LessonRecord[]>(SAMPLE_RECORDS);
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [reports, setReports] = useState<ReportData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [inputTab, setInputTab] = useState<GradeTab>('전체');
  const [reportTab, setReportTab] = useState<GradeTab>('전체');

  const addRow = () => setRecords((prev) => [...prev, createEmptyRecord()]);
  const deleteRow = (id: string) => setRecords((prev) => prev.filter((r) => r.id !== id));
  const updateRow = (id: string, field: keyof LessonRecord, value: string) =>
    setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));

  // 입력 테이블 탭 필터
  const filteredRecords = inputTab === '전체' ? records : records.filter((r) => r.grade === inputTab);
  const inputCounts: Record<string, number> = { '전체': records.length };
  for (const g of GRADE_ORDER) inputCounts[g] = records.filter((r) => r.grade === g).length;

  // 보고서 탭 필터
  const filteredReports = reportTab === '전체' ? reports : reports.filter((r) => r.grade === reportTab);
  const reportCounts: Record<string, number> = { '전체': reports.length };
  for (const g of GRADE_ORDER) reportCounts[g] = reports.filter((r) => r.grade === g).length;

  const generateReports = async () => {
    const filtered = records.filter((r) => {
      const d = new Date(r.date);
      return d.getFullYear() === selectedYear && d.getMonth() + 1 === selectedMonth;
    });

    if (filtered.length === 0) {
      alert(`${selectedYear}년 ${selectedMonth}월에 해당하는 수업 기록이 없습니다.`);
      return;
    }

    const groups = new Map<string, { grade: string; records: LessonRecord[] }>();
    for (const r of filtered) {
      if (!r.studentName.trim()) continue;
      if (!groups.has(r.studentName)) {
        groups.set(r.studentName, { grade: r.grade, records: [] });
      }
      groups.get(r.studentName)!.records.push(r);
    }

    if (groups.size === 0) {
      alert('학생명이 입력된 기록이 없습니다.');
      return;
    }

    setIsLoading(true);
    setErrors({});
    setReports([]);
    setReportTab('전체');

    const newReports: ReportData[] = [];
    const newErrors: Record<string, string> = {};

    await Promise.all(
      Array.from(groups.entries()).map(async ([studentName, { grade, records: studentRecords }]) => {
        const body: GenerateReportRequest = {
          studentName,
          grade,
          month: selectedMonth,
          year: selectedYear,
          records: studentRecords.map(({ date, studyUnit, notes }) => ({ date, studyUnit, notes })),
        };

        try {
          const res = await fetch('/api/generate-report', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          });

          if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || `HTTP ${res.status}`);
          }

          const data: GenerateReportResponse = await res.json();
          newReports.push({
            ...data,
            studentName,
            grade,
            month: selectedMonth,
            year: selectedYear,
            records: body.records,
          });
        } catch (e) {
          newErrors[studentName] = e instanceof Error ? e.message : '총평 생성 실패';
        }
      })
    );

    setReports(newReports);
    setErrors(newErrors);
    setIsLoading(false);

    if (newReports.length > 0) {
      setTimeout(() => {
        document.getElementById('reports-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const years = Array.from({ length: 3 }, (_, i) => today.getFullYear() - 1 + i);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* 월 선택 + 생성 버튼 */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">보고서 기준월 선택</h2>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {years.map((y) => <option key={y} value={y}>{y}년</option>)}
            </select>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>{m}월</option>
              ))}
            </select>
            <button
              onClick={generateReports}
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              {isLoading ? '생성 중...' : '보고서 생성하기'}
            </button>
          </div>
        </section>

        {/* 수업 기록 입력 */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">수업 기록 입력</h2>
          <GradeTabs
            activeTab={inputTab}
            availableGrades={GRADE_ORDER}
            onChange={setInputTab}
            counts={inputCounts}
          />
          <InputTable
            records={filteredRecords}
            onAdd={addRow}
            onDelete={deleteRow}
            onChange={updateRow}
          />
        </section>

        {/* 에러 */}
        {Object.keys(errors).length > 0 && (
          <section className="bg-red-50 border border-red-200 rounded-xl p-4">
            <h2 className="text-sm font-semibold text-red-700 mb-2">생성 오류</h2>
            <ul className="space-y-1">
              {Object.entries(errors).map(([name, msg]) => (
                <li key={name} className="text-sm text-red-600">{name}: {msg}</li>
              ))}
            </ul>
          </section>
        )}

        {/* 보고서 출력 */}
        {reports.length > 0 && (
          <section id="reports-section" className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-base font-semibold text-gray-800">
                {selectedYear}년 {selectedMonth}월 보고서 ({filteredReports.length}/{reports.length}명)
              </h2>
            </div>
            <GradeTabs
              activeTab={reportTab}
              availableGrades={GRADE_ORDER}
              onChange={setReportTab}
              counts={reportCounts}
            />
            <div className="space-y-8">
              {filteredReports.map((report) => (
                <ReportCard key={report.studentName} report={report} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
