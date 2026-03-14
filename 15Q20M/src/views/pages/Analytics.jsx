// VIEW: 분석 페이지 (전체 데이터 기반 차트)
import { LineChart, BarChart, Doughnut } from '../components/Charts.jsx';
import { calcAcc, avg, fmt } from '../../models/utils.js';

export function Analytics({ students, records, papers }) {
  const allAcc    = records.map((r) => { const p = papers.find((x) => x.id === r.paperId) || { total:15 }; return calcAcc(r.score, p.total); });
  const retakePct = records.length ? Math.round(records.filter((r) => r.retake).length / records.length * 100) : 0;

  // 최근 6개월 월별 데이터
  const months = Array.from({ length:6 }, (_, i) => {
    const d = new Date(); d.setMonth(d.getMonth() - (5 - i));
    const ym  = `${d.getFullYear()}-${fmt(d.getMonth()+1)}`;
    const recs = records.filter((r) => r.date.startsWith(ym));
    const ac   = recs.map((r) => { const p = papers.find((x) => x.id === r.paperId) || { total:15 }; return calcAcc(r.score, p.total); });
    return { label:`${d.getMonth()+1}월`, cnt:recs.length, avg:avg(ac) || 0 };
  });

  // 유형별 평균
  const typeMap = {};
  records.forEach((r) => { const p = papers.find((x) => x.id === r.paperId); if (!p) return; if (!typeMap[p.type]) typeMap[p.type] = []; typeMap[p.type].push(calcAcc(r.score, p.total)); });
  const typeE = Object.entries(typeMap);

  // 학생별 평균 비교
  const studentComp = students
    .map((s) => { const r = records.filter((x) => x.studentId === s.id); const ac = r.map((x) => { const p = papers.find((y) => y.id === x.paperId) || { total:15 }; return calcAcc(x.score, p.total); }); return { name:s.name, avg:avg(ac), cnt:r.length }; })
    .filter((s) => s.cnt > 0).sort((a, b) => b.avg - a.avg);

  // 오답 유형
  const errMap = {};
  records.forEach((r) => { if (r.errorType) errMap[r.errorType] = (errMap[r.errorType] || 0) + 1; });
  const errE = Object.entries(errMap);

  return (
    <div>
      <div className="ph"><div className="pt">분석</div><div className="ps">전체 데이터 기반 성적 분석</div></div>
      <div className="pb">
        <div className="stat-grid">
          <div className="stat-card"><div className="stat-lbl">전체 평균 정답률</div><div className="stat-val blue">{avg(allAcc)}%</div></div>
          <div className="stat-card"><div className="stat-lbl">총 시험 횟수</div><div className="stat-val">{records.length}</div></div>
          <div className="stat-card"><div className="stat-lbl">재시험 비율</div><div className="stat-val orange">{retakePct}%</div></div>
          <div className="stat-card"><div className="stat-lbl">활성 학생</div><div className="stat-val green">{[...new Set(records.map((r) => r.studentId))].length}</div></div>
        </div>
        <div className="g2" style={{ marginBottom:18 }}>
          <div className="card"><div className="ci">
            <h3 style={{ fontSize:14, fontWeight:600, marginBottom:14 }}>월별 시험 횟수 & 평균 정답률</h3>
            <LineChart labels={months.map((m) => m.label)} datasets={[{ label:'평균 정답률(%)', data:months.map((m) => m.avg), color:'#007AFF' }, { label:'시험 횟수', data:months.map((m) => m.cnt), color:'#34C759' }]} height={200}/>
          </div></div>
          <div className="card"><div className="ci">
            <h3 style={{ fontSize:14, fontWeight:600, marginBottom:14 }}>학생별 평균 정답률 비교</h3>
            <BarChart labels={studentComp.map((s) => s.name)} data={studentComp.map((s) => s.avg)} color="#5856D6" height={200}/>
          </div></div>
        </div>
        <div className="g2">
          <div className="card"><div className="ci">
            <h3 style={{ fontSize:14, fontWeight:600, marginBottom:14 }}>시험 유형별 평균 정답률</h3>
            {typeE.length > 0
              ? <BarChart labels={typeE.map((e) => e[0])} data={typeE.map(([, a]) => avg(a))} color="#FF9500" height={190}/>
              : <div className="empty"><div className="empty-txt">데이터 없음</div></div>}
          </div></div>
          <div className="card"><div className="ci">
            <h3 style={{ fontSize:14, fontWeight:600, marginBottom:14 }}>오답 유형 분포</h3>
            {errE.length > 0
              ? <Doughnut labels={errE.map((e) => e[0])} data={errE.map((e) => e[1])} colors={['#FF3B30','#FF9500','#007AFF']} height={190}/>
              : <div className="empty"><div className="empty-txt">오답 유형 데이터 없음</div></div>}
          </div></div>
        </div>
      </div>
    </div>
  );
}
