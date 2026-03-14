// VIEW: 대시보드 — useDashboardVM의 결과를 받아 렌더링만 합니다.
import { useState } from 'react';
import { LineChart, BarChart } from '../components/Charts.jsx';
import { calcAcc, avColor, ini } from '../../models/utils.js';

const RANK_TABS = [
  { key:'total',   label:'🏆 종합',  val:(r) => r.total,        unit:'점', max:100 },
  { key:'acc',     label:'📊 정답률', val:(r) => r.avgAcc,       unit:'%',  max:100 },
  { key:'cnt',     label:'📝 횟수',  val:(r) => r.cnt,          unit:'회', max:null },
  { key:'improve', label:'📈 향상도', val:(r) => r.improveScore, unit:'점', max:20 },
  { key:'perfect', label:'💯 만점',  val:(r) => r.perfectCnt,   unit:'회', max:null },
];

export function Dashboard({ students, papers, records, dashboard, onNav }) {
  const [rankTab, setRankTab] = useState('total');
  const { todayCount, overallAvgAcc, pendingAssignments, weeklyTrend, unitAccMap, rankData, recentRecords } = dashboard;

  const cur      = RANK_TABS.find((t) => t.key === rankTab);
  const topRank  = [...rankData].sort((a, b) => cur.val(b) - cur.val(a)).slice(0, 6);
  const barColor = (v, max) => { if (!max) return 'var(--blue)'; const p = v / max * 100; return p >= 80 ? 'var(--green)' : p >= 60 ? 'var(--blue)' : 'var(--orange)'; };

  return (
    <div>
      <div className="ph"><div className="pt">대시보드</div><div className="ps">{new Date().toLocaleDateString('ko-KR')}</div></div>
      <div className="pb">
        <div className="stat-grid">
          <div className="stat-card"><div className="stat-lbl">전체 학생</div><div className="stat-val blue">{students.length}</div></div>
          <div className="stat-card"><div className="stat-lbl">오늘 시험</div><div className="stat-val green">{todayCount}</div></div>
          <div className="stat-card"><div className="stat-lbl">전체 평균 정답률</div><div className="stat-val orange">{overallAvgAcc}%</div></div>
          <div className="stat-card"><div className="stat-lbl">미완료 배정</div><div className="stat-val red">{pendingAssignments}</div></div>
        </div>

        <div className="g2" style={{ marginBottom:18 }}>
          <div className="card"><div className="ci">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
              <h3 style={{ fontSize:14, fontWeight:600 }}>주간 성적 추세</h3><span className="badge b-blue">7주</span>
            </div>
            <LineChart labels={weeklyTrend.map((w) => w.label)} datasets={[{ label:'평균 정답률(%)', data:weeklyTrend.map((w) => w.value), color:'#007AFF' }]} height={195} />
          </div></div>
          <div className="card"><div className="ci">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
              <h3 style={{ fontSize:14, fontWeight:600 }}>단원별 평균 정답률</h3><span className="badge b-orange">약점 분석</span>
            </div>
            <BarChart labels={unitAccMap.map((u) => u.unit)} data={unitAccMap.map((u) => u.avg)} color="#FF9500" height={195} />
          </div></div>
        </div>

        <div className="g2">
          {/* 다항목 랭킹 */}
          <div className="card"><div className="ci">
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
              <h3 style={{ fontSize:14, fontWeight:600 }}>🏆 학생 랭킹</h3>
              <div style={{ display:'flex', gap:3, flexWrap:'wrap' }}>
                {RANK_TABS.map((t) => (
                  <button type="button" key={t.key}
                    style={{ padding:'3px 9px', borderRadius:99, border:`1px solid ${rankTab===t.key?'var(--blue)':'var(--border)'}`, background:rankTab===t.key?'var(--blue)':'var(--bg)', color:rankTab===t.key?'#fff':'var(--text2)', fontSize:11, fontWeight:600, cursor:'pointer' }}
                    onClick={() => setRankTab(t.key)}>{t.label}</button>
                ))}
              </div>
            </div>
            {rankTab === 'total' && (
              <div style={{ background:'var(--blue-light)', borderRadius:9, padding:'8px 12px', marginBottom:12, display:'flex', gap:6, flexWrap:'wrap' }}>
                {[['정답률','40점'],['시험횟수','20점'],['향상도','20점'],['만점','10점'],['성실도','10점']].map(([l,p]) => (
                  <span key={l} style={{ fontSize:10.5, color:'var(--blue)', background:'rgba(0,122,255,.08)', padding:'2px 7px', borderRadius:99, fontWeight:600 }}>{l} {p}</span>
                ))}
              </div>
            )}
            {rankData.length === 0
              ? <div className="empty"><div className="empty-ico">📊</div><div className="empty-txt">기록 없음</div></div>
              : topRank.map((s, i) => {
                  const v = cur.val(s);
                  const dmax = cur.max || Math.max(...topRank.map(cur.val));
                  const pct  = dmax ? Math.round(v / dmax * 100) : 100;
                  const cls  = i === 0 ? ' gold' : i === 1 ? ' silver' : i === 2 ? ' bronze' : '';
                  return (
                    <div key={s.id} style={{ marginBottom:10 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:3 }}>
                        <div className={`rank-n${cls}`}>{i + 1}</div>
                        <div style={{ flex:1 }}>
                          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                            <span style={{ fontSize:13, fontWeight:600 }}>{s.name}</span>
                            <span style={{ fontSize:14, fontWeight:700, color:barColor(v, cur.max) }}>{v}{cur.unit}</span>
                          </div>
                          {rankTab === 'total' ? (
                            <div style={{ display:'flex', gap:4, marginTop:2 }}>
                              {[{v:s.accScore,m:40,c:'#007AFF'},{v:s.cntScore,m:20,c:'#34C759'},{v:s.improveScore,m:20,c:'#FF9500'},{v:s.perfectScore,m:10,c:'#AF52DE'},{v:s.retakeScore,m:10,c:'#5856D6'}].map((it, idx) => (
                                <div key={idx} style={{ height:4, flex:it.m, borderRadius:99, background:it.c+'33', position:'relative', overflow:'hidden' }}>
                                  <div style={{ position:'absolute', left:0, top:0, height:'100%', width:(it.v/it.m*100)+'%', background:it.c, borderRadius:99 }} />
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div style={{ height:4, background:'var(--bg)', borderRadius:99, marginTop:3, overflow:'hidden' }}>
                              <div style={{ height:'100%', width:pct+'%', background:barColor(v, cur.max), borderRadius:99 }} />
                            </div>
                          )}
                        </div>
                      </div>
                      {rankTab === 'total' && <div style={{ paddingLeft:40, fontSize:10.5, color:'var(--text2)' }}>평균 {s.avgAcc}% · 시험 {s.cnt}회 · 만점 {s.perfectCnt}회</div>}
                    </div>
                  );
                })}
          </div></div>

          {/* 최근 기록 */}
          <div className="card"><div className="ci">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
              <h3 style={{ fontSize:14, fontWeight:600 }}>최근 시험 기록</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => onNav('records')}>전체 보기</button>
            </div>
            {recentRecords.map((r) => {
              const s  = students.find((x) => x.id === r.studentId) || { name:'?' };
              const p  = papers.find((x)   => x.id === r.paperId)   || { name:'?', total:15 };
              const ac = calcAcc(r.score, p.total);
              return (
                <div key={r.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 0', borderBottom:'1px solid var(--border)' }}>
                  <div style={{ width:30, height:30, borderRadius:'50%', background:avColor(r.studentId), display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:11, fontWeight:600, flexShrink:0 }}>{ini(s.name)}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12.5, fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s.name} · {p.name}</div>
                    <div style={{ fontSize:11, color:'var(--text3)' }}>{r.date}</div>
                  </div>
                  <div style={{ fontSize:13, fontWeight:700, color: ac>=80?'var(--green)':ac>=60?'var(--orange)':'var(--red)' }}>{ac}%</div>
                </div>
              );
            })}
          </div></div>
        </div>
      </div>
    </div>
  );
}
