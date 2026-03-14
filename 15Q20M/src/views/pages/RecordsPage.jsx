// VIEW: 시험 기록 페이지 (필터, 정렬, CSV 내보내기)
import { useState } from 'react';
import { SortIcon, useSortable } from '../components/SortIcon.jsx';
import { calcAcc, avColor, ini } from '../../models/utils.js';

export function RecordsPage({ records, students, papers, onDelete, onExport }) {
  const [search, setSearch]   = useState('');
  const [filterS, setFilterS] = useState('');
  const [filterP, setFilterP] = useState('');
  const sort = useSortable('date', -1);

  const filtered = records.filter((r) => {
    const s = students.find((x) => x.id === r.studentId) || { name:'' };
    const p = papers.find((x)   => x.id === r.paperId)   || { name:'' };
    const q = search.toLowerCase();
    return (!filterS || r.studentId === filterS) && (!filterP || r.paperId === filterP)
      && (!q || s.name.includes(q) || p.name.toLowerCase().includes(q) || r.date.includes(q));
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort.key === 'date')  return sort.dir * (new Date(a.date) - new Date(b.date));
    if (sort.key === 'score') return sort.dir * (a.score - b.score);
    if (sort.key === 'acc') {
      const pa = papers.find((x) => x.id === a.paperId) || { total:15 };
      const pb = papers.find((x) => x.id === b.paperId) || { total:15 };
      return sort.dir * (calcAcc(a.score, pa.total) - calcAcc(b.score, pb.total));
    }
    if (sort.key === 'name') {
      const sa = students.find((x) => x.id === a.studentId)?.name || '';
      const sb = students.find((x) => x.id === b.studentId)?.name || '';
      return sort.dir * sa.localeCompare(sb, 'ko');
    }
    if (sort.key === 'paper') {
      const pa = papers.find((x) => x.id === a.paperId)?.name || '';
      const pb = papers.find((x) => x.id === b.paperId)?.name || '';
      return sort.dir * pa.localeCompare(pb, 'ko');
    }
    return 0;
  });

  const Th = ({ k, label }) => (
    <th className={`sortable${sort.key===k?' sort-active':''}`} onClick={() => sort.toggle(k)}>
      {label} <SortIcon active={sort.key===k} dir={sort.dir}/>
    </th>
  );

  return (
    <div>
      <div className="ph"><div className="pt">시험 기록</div><div className="ps">총 {records.length}건</div></div>
      <div className="pb">
        <div className="tb">
          <div className="tb-l" style={{ flexWrap:'wrap', gap:8 }}>
            <div className="sbar" style={{ width:210 }}><span>🔍</span>
              <input placeholder="검색..." value={search} onChange={(e) => setSearch(e.target.value)}/>
            </div>
            <select className="fi fi-sel" style={{ width:130 }} value={filterS} onChange={(e) => setFilterS(e.target.value)}>
              <option value="">전체 학생</option>{students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <select className="fi fi-sel" style={{ width:160 }} value={filterP} onChange={(e) => setFilterP(e.target.value)}>
              <option value="">전체 시험지</option>{papers.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="tb-r">
            <span style={{ fontSize:12, color:'var(--text2)' }}>{sorted.length}건</span>
            <button className="btn btn-ghost" onClick={onExport}>⬇ CSV</button>
          </div>
        </div>
        <div className="tw"><table>
          <thead><tr>
            <Th k="date" label="날짜"/><Th k="name" label="학생"/><Th k="paper" label="시험지"/>
            <Th k="score" label="점수"/><Th k="acc" label="정답률"/>
            <th>오답유형</th><th>재시험</th><th>메모</th><th>삭제</th>
          </tr></thead>
          <tbody>
            {sorted.length === 0
              ? <tr><td colSpan={9}><div className="empty"><div className="empty-ico">📭</div><div className="empty-txt">기록 없음</div></div></td></tr>
              : sorted.map((r) => {
                  const s  = students.find((x) => x.id === r.studentId) || { name:'?' };
                  const p  = papers.find((x)   => x.id === r.paperId)   || { name:'?', total:15 };
                  const ac = calcAcc(r.score, p.total);
                  return <tr key={r.id}>
                    <td style={{ whiteSpace:'nowrap', fontSize:12 }}>{r.date}</td>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <div style={{ width:26, height:26, borderRadius:'50%', background:avColor(r.studentId), display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:10, fontWeight:600 }}>{ini(s.name)}</div>
                        <span style={{ fontSize:12.5, fontWeight:500 }}>{s.name}</span>
                      </div>
                    </td>
                    <td style={{ fontSize:12.5 }}>{p.name}</td>
                    <td><strong>{r.score}</strong><span style={{ color:'var(--text3)', fontSize:11 }}>/{p.total}</span></td>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                        <div className="sco-bar" style={{ width:46 }}><div className="sco-fill" style={{ width:ac+'%', background:ac>=80?'var(--green)':ac>=60?'var(--orange)':'var(--red)' }}/></div>
                        <span style={{ fontSize:12, fontWeight:600, color:ac>=80?'var(--green)':ac>=60?'var(--orange)':'var(--red)' }}>{ac}%</span>
                      </div>
                    </td>
                    <td>{r.errorType ? <span className="badge b-red" style={{ fontSize:10 }}>{r.errorType}</span> : <span style={{ color:'var(--text3)', fontSize:11 }}>-</span>}</td>
                    <td>{r.retake ? <span className="badge b-orange" style={{ fontSize:10 }}>Y</span> : <span style={{ color:'var(--text3)', fontSize:11 }}>-</span>}</td>
                    <td style={{ fontSize:11, color:'var(--text2)', maxWidth:110, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.memo || '-'}</td>
                    <td><button className="btn-icon" onClick={() => { if (window.confirm('삭제?')) onDelete(r.id); }}>🗑</button></td>
                  </tr>;
                })}
          </tbody>
        </table></div>
      </div>
    </div>
  );
}
