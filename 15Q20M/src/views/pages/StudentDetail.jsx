// VIEW: 학생 상세 페이지 (시험 기록 / 성적 차트 / 약점 분석 / 교사 메모)
import { useState } from 'react';
import { LineChart, BarChart, Doughnut } from '../components/Charts.jsx';
import { calcAcc, avg, avColor, ini } from '../../models/utils.js';

export function StudentDetail({ student, records, papers, onBack, onUpdateMemo }) {
  const [memo, setMemo] = useState(student.memo || '');
  const [tab, setTab]   = useState('history');

  const recs = [...records.filter((r) => r.studentId === student.id)].sort((a, b) => new Date(b.date) - new Date(a.date));
  const accs = recs.map((r) => { const p = papers.find((x) => x.id === r.paperId) || { total:15 }; return calcAcc(r.score, p.total); });
  const avgA = avg(accs);

  const unitMap = {};
  recs.forEach((r) => { const p = papers.find((x) => x.id === r.paperId); if (!p) return; if (!unitMap[p.unit]) unitMap[p.unit] = []; unitMap[p.unit].push(calcAcc(r.score, p.total)); });
  const unitD = Object.entries(unitMap).map(([u, a]) => ({ unit:u, avg:avg(a) })).sort((a, b) => a.avg - b.avg);

  const TABS = [['history','시험 기록'], ['chart','성적 차트'], ['weakness','약점 분석'], ['memo','교사 메모']];

  return (
    <div>
      <div className="ph">
        <button className="back" onClick={onBack}>‹ 학생 목록</button>
        <div style={{ display:'flex', alignItems:'center', gap:16, marginTop:6 }}>
          <div style={{ width:52, height:52, borderRadius:'50%', background:avColor(student.id), display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:22, fontWeight:700 }}>{ini(student.name)}</div>
          <div><div className="pt">{student.name}</div><div className="ps">{student.id} · {student.grade} · {student.school} · {student.phone}</div></div>
        </div>
      </div>
      <div className="pb">
        <div className="stat-grid" style={{ gridTemplateColumns:'repeat(3,1fr)' }}>
          <div className="stat-card"><div className="stat-lbl">총 시험 횟수</div><div className="stat-val blue">{recs.length}</div></div>
          <div className="stat-card"><div className="stat-lbl">평균 정답률</div><div className="stat-val" style={{ color:avgA>=80?'var(--green)':avgA>=60?'var(--orange)':'var(--red)' }}>{avgA}%</div></div>
          <div className="stat-card"><div className="stat-lbl">재시험 기록</div><div className="stat-val red">{recs.filter((r) => r.retake).length}</div></div>
        </div>
        <div className="tabs" style={{ marginBottom:18 }}>
          {TABS.map(([k, l]) => <div key={k} className={`tab${tab===k?' active':''}`} onClick={() => setTab(k)}>{l}</div>)}
        </div>

        {tab === 'history' && (
          <div className="tw"><table>
            <thead><tr><th>날짜</th><th>시험지</th><th>점수</th><th>정답률</th><th>풀이시간</th><th>오답유형</th><th>재시험</th><th>메모</th></tr></thead>
            <tbody>
              {recs.length === 0
                ? <tr><td colSpan={8}><div className="empty"><div className="empty-ico">📋</div><div className="empty-txt">시험 기록 없음</div></div></td></tr>
                : recs.map((r) => {
                    const p  = papers.find((x) => x.id === r.paperId) || { name:'?', total:15 };
                    const ac = calcAcc(r.score, p.total);
                    return <tr key={r.id}>
                      <td style={{ whiteSpace:'nowrap', fontSize:12 }}>{r.date}</td>
                      <td style={{ fontSize:12.5 }}>{p.name}</td>
                      <td><strong>{r.score}</strong><span style={{ color:'var(--text3)', fontSize:11 }}>/{p.total}</span></td>
                      <td><div style={{ display:'flex', alignItems:'center', gap:7 }}>
                        <div className="sco-bar" style={{ width:56 }}><div className="sco-fill" style={{ width:ac+'%', background:ac>=80?'var(--green)':ac>=60?'var(--orange)':'var(--red)' }}/></div>
                        <span style={{ fontSize:12, fontWeight:600, color:ac>=80?'var(--green)':ac>=60?'var(--orange)':'var(--red)' }}>{ac}%</span>
                      </div></td>
                      <td style={{ fontSize:12 }}>{r.solveMin}분</td>
                      <td>{r.errorType ? <span className="badge b-red">{r.errorType}</span> : <span style={{ color:'var(--text3)', fontSize:11 }}>-</span>}</td>
                      <td>{r.retake ? <span className="badge b-orange">재시험</span> : <span style={{ color:'var(--text3)', fontSize:11 }}>-</span>}</td>
                      <td style={{ fontSize:11, color:'var(--text2)', maxWidth:140, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.memo || '-'}</td>
                    </tr>;
                  })}
            </tbody>
          </table></div>
        )}

        {tab === 'chart' && (
          <div className="g2">
            <div className="card"><div className="ci">
              <h3 style={{ fontSize:14, fontWeight:600, marginBottom:14 }}>정답률 추이</h3>
              {recs.length >= 2
                ? <LineChart labels={[...recs].reverse().map((r) => r.date.slice(5))} datasets={[{ label:'정답률(%)', data:[...recs].reverse().map((r) => { const p = papers.find((x) => x.id===r.paperId)||{total:15}; return calcAcc(r.score,p.total); }), color:'#007AFF' }]} height={210}/>
                : <div className="empty"><div className="empty-txt">데이터 부족 (2회 이상 필요)</div></div>}
            </div></div>
            <div className="card"><div className="ci">
              <h3 style={{ fontSize:14, fontWeight:600, marginBottom:14 }}>점수 분포</h3>
              {recs.length > 0
                ? <BarChart labels={[...recs].reverse().map((r) => r.date.slice(5))} data={[...recs].reverse().map((r) => r.score)} color="#34C759" height={210}/>
                : <div className="empty"><div className="empty-txt">데이터 없음</div></div>}
            </div></div>
          </div>
        )}

        {tab === 'weakness' && (
          <div className="g2">
            <div className="card"><div className="ci">
              <h3 style={{ fontSize:14, fontWeight:600, marginBottom:14 }}>단원별 평균 정답률</h3>
              {unitD.length > 0 ? <>
                <BarChart labels={unitD.map((u) => u.unit)} data={unitD.map((u) => u.avg)} color="#FF9500" height={190}/>
                <div style={{ marginTop:14 }}>{unitD.slice(0, 3).map((u) => (
                  <div key={u.unit} style={{ display:'flex', alignItems:'center', gap:9, marginBottom:7 }}>
                    <span className="badge b-red">{u.unit}</span>
                    <div className="sco-bar" style={{ flex:1 }}><div className="sco-fill" style={{ width:u.avg+'%', background:'var(--red)' }}/></div>
                    <span style={{ fontSize:12, fontWeight:600, color:'var(--red)', minWidth:34 }}>{u.avg}%</span>
                  </div>
                ))}</div>
              </> : <div className="empty"><div className="empty-txt">데이터 없음</div></div>}
            </div></div>
            <div className="card"><div className="ci">
              <h3 style={{ fontSize:14, fontWeight:600, marginBottom:14 }}>오답 유형 분석</h3>
              {(() => {
                const t = {}; recs.forEach((r) => { if (r.errorType) t[r.errorType] = (t[r.errorType] || 0) + 1; });
                const e = Object.entries(t);
                return e.length
                  ? <Doughnut labels={e.map((x) => x[0])} data={e.map((x) => x[1])} colors={['#FF3B30','#FF9500','#007AFF']} height={190}/>
                  : <div className="empty"><div className="empty-txt">오답 유형 없음</div></div>;
              })()}
            </div></div>
          </div>
        )}

        {tab === 'memo' && (
          <div className="card"><div className="ci">
            <h3 style={{ fontSize:14, fontWeight:600, marginBottom:14 }}>교사 메모</h3>
            <textarea className="fi fi-ta" style={{ minHeight:150, fontSize:13.5, lineHeight:1.7 }}
              value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="학생에 대한 메모를 입력하세요..."/>
            <div style={{ marginTop:10, textAlign:'right' }}>
              <button className="btn btn-primary" onClick={() => { onUpdateMemo(student.id, memo); alert('저장되었습니다!'); }}>💾 저장</button>
            </div>
          </div></div>
        )}
      </div>
    </div>
  );
}
