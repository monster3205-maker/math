// ═══════════════ VIEWMODEL: 대시보드 집계 ═══════════════
// 기존 데이터에서 파생되는 집계값만 계산합니다.
// 상태를 직접 변경하지 않으므로 useMemo로 최적화됩니다.
import { useMemo } from 'react';
import { calcAcc, avg, fmt, calcRankScore } from '../models/utils.js';

export function useDashboardVM(students, records, papers, assignments) {
  const today = new Date().toISOString().split('T')[0];

  const todayCount        = useMemo(() => records.filter((r) => r.date === today).length, [records, today]);
  const pendingAssignments = useMemo(() => assignments.filter((a) => !a.used).length, [assignments]);

  const overallAvgAcc = useMemo(() => {
    const accs = records.map((r) => { const p = papers.find((x) => x.id === r.paperId) || { total: 15 }; return calcAcc(r.score, p.total); });
    return avg(accs);
  }, [records, papers]);

  // 7주간 주별 평균 정답률
  const weeklyTrend = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const end = new Date(); end.setDate(end.getDate() - (6 - i) * 7);
    const start = new Date(end); start.setDate(end.getDate() - 7);
    const label = `${end.getMonth() + 1}/${end.getDate()}`;
    const wr = records.filter((r) => { const d = new Date(r.date); return d >= start && d <= end; });
    const accs = wr.map((r) => { const p = papers.find((x) => x.id === r.paperId) || { total: 15 }; return calcAcc(r.score, p.total); });
    return { label, value: accs.length ? avg(accs) : null };
  }), [records, papers]);

  // 단원별 평균 (낮은 순 6개 — 약점)
  const unitAccMap = useMemo(() => {
    const map = {};
    records.forEach((r) => {
      const p = papers.find((x) => x.id === r.paperId); if (!p) return;
      if (!map[p.unit]) map[p.unit] = [];
      map[p.unit].push(calcAcc(r.score, p.total));
    });
    return Object.entries(map).map(([unit, a]) => ({ unit, avg: avg(a) })).sort((a, b) => a.avg - b.avg).slice(0, 6);
  }, [records, papers]);

  // 다항목 랭킹
  const rankData = useMemo(() =>
    students.map((s) => { const sc = calcRankScore(s.id, records, papers); return sc ? { ...s, ...sc } : null; }).filter(Boolean),
  [students, records, papers]);

  // 최근 기록 6건
  const recentRecords = useMemo(() =>
    [...records].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6),
  [records]);

  return { today, todayCount, overallAvgAcc, pendingAssignments, weeklyTrend, unitAccMap, rankData, recentRecords };
}
