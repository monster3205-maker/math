// ═══════════════════════════════════════════════════════════════
// MODEL: 순수 유틸리티 함수
// 부수효과(side effect)가 전혀 없는 순수 함수만 모읍니다.
// 입력 → 출력 변환만 담당. 상태나 외부 의존성 없음.
// ═══════════════════════════════════════════════════════════════

export const fmt    = (n) => (n < 10 ? '0' + n : '' + n);
export const fmtSec = (s) => `${fmt(Math.floor(s / 60))}:${fmt(s % 60)}`;
export const uid    = () => 'id' + Date.now() + Math.random().toString(36).slice(2, 5);
export const calcAcc = (score, total) => total > 0 ? Math.round((score / total) * 100) : 0;
export const avg    = (arr) => arr.length ? Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10 : 0;
export const diffCol = (d) => d === 'Easy' ? 'b-green' : d === 'Hard' ? 'b-red' : 'b-orange';
export const avColor = (id) => ['#007AFF','#34C759','#FF9500','#FF3B30','#AF52DE','#5856D6','#FF2D55','#32ADE6'][parseInt(id) % 8];
export const ini    = (name) => (name ? name[0] : '?');

/**
 * 학생 종합 랭킹 점수 계산 (100점 만점)
 * - 정답률 40점 | 시험횟수 20점 | 향상도 20점 | 만점횟수 10점 | 성실도 10점
 */
export function calcRankScore(sid, records, papers) {
  const recs = records.filter((r) => r.studentId === sid);
  if (!recs.length) return null;

  const getAcc = (r) => { const p = papers.find((x) => x.id === r.paperId) || { total: 15 }; return calcAcc(r.score, p.total); };
  const sorted = [...recs].sort((a, b) => new Date(a.date) - new Date(b.date));
  const accs   = recs.map(getAcc);
  const avgAcc = avg(accs);

  const accScore  = Math.round((avgAcc / 100) * 40);
  const cntScore  = Math.min(20, Math.round((recs.length / 10) * 20));

  let improveScore = 10;
  if (sorted.length >= 4) {
    const half   = Math.floor(sorted.length / 2);
    const oldAvg = avg(sorted.slice(0, half).map(getAcc));
    const newAvg = avg(sorted.slice(-half).map(getAcc));
    improveScore = Math.min(20, Math.max(0, 10 + Math.round((newAvg - oldAvg) / 5)));
  }

  const perfectCnt  = recs.filter((r) => { const p = papers.find((x) => x.id === r.paperId) || { total: 15 }; return r.score === p.total; }).length;
  const perfectScore = Math.min(10, perfectCnt * 2);
  const retakeScore  = Math.round((1 - recs.filter((r) => r.retake).length / recs.length) * 10);

  return { total: accScore + cntScore + improveScore + perfectScore + retakeScore, accScore, cntScore, improveScore, perfectScore, retakeScore, avgAcc, cnt: recs.length, perfectCnt };
}

/**
 * 자동 채점: questions 배열 vs 학생 answers 객체 비교
 * @returns {number|null} 맞은 개수 (questions 없으면 null)
 */
export function autoGrade(questions, answers) {
  if (!questions?.length) return null;
  return questions.reduce((cnt, q) => {
    const a = (answers?.[q.no] ?? '').toString().trim().toLowerCase();
    const k = (q.answer ?? '').toString().trim().toLowerCase();
    return cnt + (k && a === k ? 1 : 0);
  }, 0);
}

/** 기록 배열 → CSV 다운로드 */
export function exportCSV(records, students, papers) {
  const hdr  = ['날짜','학번','학생명','시험지','점수','총점','정답률','오답유형','재시험','메모'];
  const rows = records.map((r) => {
    const s = students.find((x) => x.id === r.studentId) || { name: '?', id: r.studentId };
    const p = papers.find((x)   => x.id === r.paperId)   || { name: '?', total: 15 };
    return [r.date, s.id, s.name, p.name, r.score, p.total, calcAcc(r.score, p.total) + '%', r.errorType, r.retake ? 'Y' : 'N', r.memo];
  });
  const csv  = [hdr, ...rows].map((r) => r.join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = '시험기록.csv'; a.click();
  URL.revokeObjectURL(url);
}
