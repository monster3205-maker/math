// VIEW: 학부모 리포트 페이지 (인쇄/PDF 출력용)
import { useState } from 'react';
import { calcAcc, avg } from '../../models/utils.js';

export function ParentReport({ students, records, papers }) {
  const [selId, setSelId] = useState('');
  const student = students.find((s) => s.id === selId);
  const recs    = [...records.filter((r) => r.studentId === selId)].sort((a, b) => new Date(b.date) - new Date(a.date));
  const accs    = recs.map((r) => { const p = papers.find((x) => x.id === r.paperId) || { total:15 }; return calcAcc(r.score, p.total); });
  const avgA    = avg(accs);

  const unitMap = {};
  recs.forEach((r) => { const p = papers.find((x) => x.id === r.paperId); if (!p) return; if (!unitMap[p.unit]) unitMap[p.unit] = []; unitMap[p.unit].push(calcAcc(r.score, p.total)); });
  const weakU = Object.entries(unitMap).map(([u, a]) => ({ unit:u, avg:avg(a) })).sort((a, b) => a.avg - b.avg).slice(0, 3);

  const genComment = () => {
    if (!student || !recs.length) return '';
    if (avgA >= 90) return `${student.name} 학생은 전반적으로 매우 우수한 성취를 보이고 있습니다. 현재 페이스를 유지하며 심화 학습을 권장합니다.`;
    if (avgA >= 75) return `${student.name} 학생은 꾸준한 실력 향상을 보이고 있습니다. ${weakU[0]?.unit || '취약 단원'} 부분을 집중 보완한다면 더 좋은 결과를 기대할 수 있습니다.`;
    if (avgA >= 60) return `${student.name} 학생은 기초 개념 이해에 노력하고 있습니다. ${weakU.map((w) => w.unit).join(', ')} 단원의 반복 학습이 필요합니다.`;
    return `${student.name} 학생은 기초 개념부터 체계적인 학습이 필요한 상태입니다. 가정에서의 적극적인 관심과 지도를 부탁드립니다.`;
  };

  return (
    <div>
      <div className="ph"><div className="pt">학부모 리포트</div><div className="ps">개인 성적 리포트 생성 및 인쇄</div></div>
      <div className="pb">
        <div style={{ maxWidth:700 }}>
          <div className="card" style={{ marginBottom:18 }}><div className="ci">
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ flex:1 }}>
                <label className="fl">학생 선택</label>
                <select className="fi fi-sel" value={selId} onChange={(e) => setSelId(e.target.value)}>
                  <option value="">학생을 선택하세요</option>
                  {students.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.id}) · {s.grade}</option>)}
                </select>
              </div>
              {student && <button className="btn btn-primary" style={{ marginTop:18, flexShrink:0 }} onClick={() => window.print()}>🖨 인쇄/PDF</button>}
            </div>
          </div></div>

          {student && recs.length > 0 && (
            <div className="card"><div className="ci">
              <div style={{ textAlign:'center', paddingBottom:22, borderBottom:'2px solid var(--border)', marginBottom:22 }}>
                <div style={{ fontSize:11, color:'var(--text2)', letterSpacing:2, textTransform:'uppercase', marginBottom:6 }}>15Q20M · 학원 성적 리포트</div>
                <h1 style={{ fontSize:26, fontWeight:700, letterSpacing:'-.8px' }}>{student.name} 학생 성적 리포트</h1>
                <p style={{ color:'var(--text2)', marginTop:5, fontSize:13 }}>{student.grade} · {student.school} · 발행일: {new Date().toLocaleDateString('ko-KR')}</p>
              </div>
              <div className="stat-grid" style={{ gridTemplateColumns:'repeat(3,1fr)', marginBottom:22 }}>
                <div className="stat-card"><div className="stat-lbl">총 시험 횟수</div><div className="stat-val blue">{recs.length}회</div></div>
                <div className="stat-card"><div className="stat-lbl">평균 정답률</div><div className="stat-val" style={{ color:avgA>=80?'var(--green)':avgA>=60?'var(--orange)':'var(--red)' }}>{avgA}%</div></div>
                <div className="stat-card"><div className="stat-lbl">최근 시험</div><div className="stat-val" style={{ fontSize:18 }}>{recs[0].date}</div></div>
              </div>
              <h3 style={{ fontSize:14, fontWeight:600, marginBottom:10 }}>최근 시험 기록</h3>
              <div className="tw" style={{ marginBottom:22 }}>
                <table><thead><tr><th>날짜</th><th>시험지</th><th>점수</th><th>정답률</th><th>오답유형</th></tr></thead>
                <tbody>
                  {recs.slice(0, 5).map((r) => {
                    const p  = papers.find((x) => x.id === r.paperId) || { name:'?', total:15 };
                    const ac = calcAcc(r.score, p.total);
                    return <tr key={r.id}>
                      <td>{r.date}</td><td>{p.name}</td>
                      <td><strong>{r.score}</strong>/{p.total}</td>
                      <td style={{ color:ac>=80?'var(--green)':ac>=60?'var(--orange)':'var(--red)', fontWeight:600 }}>{ac}%</td>
                      <td>{r.errorType || '-'}</td>
                    </tr>;
                  })}
                </tbody></table>
              </div>
              {weakU.length > 0 && <>
                <h3 style={{ fontSize:14, fontWeight:600, marginBottom:10 }}>보완이 필요한 단원</h3>
                <div style={{ marginBottom:20 }}>{weakU.map((u) => (
                  <div key={u.unit} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:9 }}>
                    <span style={{ width:72, fontSize:12, fontWeight:500 }}>{u.unit}</span>
                    <div className="sco-bar" style={{ flex:1 }}><div className="sco-fill" style={{ width:u.avg+'%', background:u.avg>=80?'var(--green)':u.avg>=60?'var(--orange)':'var(--red)' }}/></div>
                    <span style={{ width:36, textAlign:'right', fontWeight:600, color:u.avg>=80?'var(--green)':u.avg>=60?'var(--orange)':'var(--red)', fontSize:12 }}>{u.avg}%</span>
                  </div>
                ))}</div>
              </>}
              <div style={{ background:'var(--blue-light)', borderRadius:12, padding:18, marginBottom:14 }}>
                <h3 style={{ fontSize:13, fontWeight:600, color:'var(--blue)', marginBottom:7 }}>📝 학습 코멘트</h3>
                <p style={{ fontSize:13.5, lineHeight:1.7 }}>{genComment()}</p>
              </div>
              {student.memo && (
                <div style={{ marginTop:14, background:'var(--bg)', borderRadius:11, padding:14 }}>
                  <h3 style={{ fontSize:13, fontWeight:600, marginBottom:5 }}>교사 메모</h3>
                  <p style={{ fontSize:13, lineHeight:1.7, color:'var(--text2)' }}>{student.memo}</p>
                </div>
              )}
              <div style={{ textAlign:'center', marginTop:24, paddingTop:18, borderTop:'1px solid var(--border)', fontSize:11, color:'var(--text3)' }}>
                본 리포트는 15Q20M 학원 시험 관리 시스템에서 자동 생성되었습니다.
              </div>
            </div></div>
          )}
          {student && recs.length === 0 && (
            <div className="card"><div className="ci"><div className="empty"><div className="empty-ico">📋</div><div className="empty-txt">시험 기록이 없습니다</div></div></div></div>
          )}
        </div>
      </div>
    </div>
  );
}
