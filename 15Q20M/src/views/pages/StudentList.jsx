// VIEW: 학생 목록 페이지 (개별/일괄 추가, 정렬, 상세 이동)
import { useState } from 'react';
import { SortIcon, useSortable } from '../components/SortIcon.jsx';
import { calcAcc, avg, avColor, ini } from '../../models/utils.js';

export function StudentList({ students, records, papers, onSelect, onAdd, onAddBulk, onDelete }) {
  const [search, setSearch]     = useState('');
  const [showModal, setShowModal] = useState(false);
  const [addTab, setAddTab]     = useState('single');
  const [form, setForm]         = useState({ id:'', name:'', grade:'중2', school:'장승중학교', phone:'', memo:'' });
  const [err, setErr]           = useState('');
  const [bulkText, setBulkText] = useState('');
  const [bulkPreview, setBulkPreview] = useState([]);
  const [bulkErr, setBulkErr]   = useState('');
  const sort = useSortable('name', 1);

  const filtered = students.filter((s) =>
    s.name.includes(search) || s.id.includes(search) || s.grade.includes(search) || s.school.includes(search)
  );

  const sorted = [...filtered].sort((a, b) => {
    const getV = (s) => {
      if (sort.key === 'name')  return s.name;
      if (sort.key === 'id')    return s.id;
      if (sort.key === 'grade') return s.grade;
      if (sort.key === 'cnt')   return records.filter((x) => x.studentId === s.id).length;
      if (sort.key === 'avg') {
        const r  = records.filter((x) => x.studentId === s.id);
        const ac = r.map((x) => { const p = papers.find((y) => y.id === x.paperId) || { total:15 }; return calcAcc(x.score, p.total); });
        return avg(ac) || 0;
      }
      return s.name;
    };
    const va = getV(a), vb = getV(b);
    return typeof va === 'number' ? sort.dir * (va - vb) : sort.dir * va.localeCompare(vb, 'ko');
  });

  const save = () => {
    if (!form.id || !form.name)             { setErr('학번과 이름은 필수입니다.'); return; }
    if (!/^\d{4}$/.test(form.id))           { setErr('학번은 4자리 숫자여야 합니다.'); return; }
    if (students.find((s) => s.id === form.id)) { setErr('이미 존재하는 학번입니다.'); return; }
    onAdd({ ...form }); setShowModal(false); setForm({ id:'', name:'', grade:'중2', school:'장승중학교', phone:'', memo:'' });
  };

  const parseBulk = (text) => {
    setBulkErr('');
    const lines = text.split('\n').map((l) => l.trim()).filter((l) => l);
    const res = []; const errs = [];
    lines.forEach((line, i) => {
      const cols  = line.split(/[,\t]/).map((c) => c.trim());
      const id    = cols[0]; const name = cols[1]; const grade = cols[2] || '중2'; const school = cols[3] || '장승중학교';
      if (!id || !name)            { errs.push(`${i+1}번째 줄: 학번/이름 누락`); return; }
      if (!/^\d{4}$/.test(id))     { errs.push(`${i+1}번째 줄: 학번 오류(${id})`); return; }
      if (students.find((s) => s.id === id) || res.find((r) => r.id === id)) { errs.push(`${i+1}번째 줄: 중복 학번(${id})`); return; }
      res.push({ id, name, grade, school, phone:'', memo:'' });
    });
    setBulkPreview(res); if (errs.length) setBulkErr(errs.join('\n'));
    return res;
  };

  const saveBulk = () => {
    if (!bulkPreview.length) { setBulkErr('추가할 학생이 없습니다.'); return; }
    onAddBulk(bulkPreview); setShowModal(false); setBulkText(''); setBulkPreview([]); setBulkErr('');
  };

  const getStats = (sid) => {
    const r = records.filter((x) => x.studentId === sid);
    if (!r.length) return { cnt:0, avgStr:'-' };
    const ac = r.map((x) => { const p = papers.find((y) => y.id === x.paperId) || { total:15 }; return calcAcc(x.score, p.total); });
    return { cnt: r.length, avgStr: avg(ac) + '%' };
  };

  const Th = ({ k, label }) => (
    <th className={`sortable${sort.key===k?' sort-active':''}`} onClick={() => sort.toggle(k)}>
      {label} <SortIcon active={sort.key===k} dir={sort.dir}/>
    </th>
  );

  return (
    <div>
      <div className="ph"><div className="pt">학생 목록</div><div className="ps">등록 학생 {students.length}명</div></div>
      <div className="pb">
        <div className="tb">
          <div className="tb-l">
            <div className="sbar" style={{ flex:1, maxWidth:300 }}><span>🔍</span>
              <input placeholder="이름, 학번, 학년 검색..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="tb-r">
            <button className="btn btn-primary" onClick={() => { setShowModal(true); setAddTab('single'); setErr(''); setBulkText(''); setBulkPreview([]); setBulkErr(''); }}>+ 학생 추가</button>
          </div>
        </div>
        <div className="tw"><table>
          <thead><tr>
            <Th k="id" label="학번"/><Th k="name" label="학생명"/><Th k="grade" label="학년"/>
            <th>학교</th><Th k="cnt" label="시험 횟수"/><Th k="avg" label="평균 정답률"/><th>연락처</th><th>액션</th>
          </tr></thead>
          <tbody>
            {sorted.length === 0
              ? <tr><td colSpan={8}><div className="empty"><div className="empty-ico">🔍</div><div className="empty-txt">검색 결과 없음</div></div></td></tr>
              : sorted.map((s) => {
                  const st = getStats(s.id);
                  return (
                    <tr key={s.id} style={{ cursor:'pointer' }} onClick={() => onSelect(s)}>
                      <td><span className="badge b-gray">{s.id}</span></td>
                      <td>
                        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                          <div style={{ width:30, height:30, borderRadius:'50%', background:avColor(s.id), display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:12, fontWeight:600, flexShrink:0 }}>{ini(s.name)}</div>
                          <span style={{ fontWeight:500 }}>{s.name}</span>
                        </div>
                      </td>
                      <td>{s.grade}</td><td>{s.school}</td>
                      <td><span className="badge b-blue">{st.cnt}회</span></td>
                      <td><span style={{ fontWeight:600, color: st.avgStr==='-'?'var(--text3)':parseInt(st.avgStr)>=80?'var(--green)':parseInt(st.avgStr)>=60?'var(--orange)':'var(--red)' }}>{st.avgStr}</span></td>
                      <td style={{ color:'var(--text2)', fontSize:12 }}>{s.phone}</td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <button className="btn btn-danger btn-sm" onClick={() => { if (window.confirm(`${s.name} 학생을 삭제하시겠습니까?`)) onDelete(s.id); }}>삭제</button>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table></div>

        {showModal && (
          <div className="mo" onClick={() => setShowModal(false)}>
            <div className="mc" style={{ width:560 }} onClick={(e) => e.stopPropagation()}>
              <h2>학생 추가</h2>
              <div className="tabs" style={{ marginBottom:18 }}>
                <div className={`tab${addTab==='single'?' active':''}`} onClick={() => setAddTab('single')}>개별 추가</div>
                <div className={`tab${addTab==='bulk'?' active':''}`} onClick={() => setAddTab('bulk')}>일괄 추가 📋</div>
              </div>

              {addTab === 'single' && <>
                {err && <p style={{ color:'var(--red)', fontSize:12, marginBottom:10, padding:'7px 11px', background:'#FFF0EE', borderRadius:8 }}>{err}</p>}
                <div className="frow">
                  <div className="fg"><label className="fl">학번 (4자리) *</label><input className="fi" placeholder="예: 0011" maxLength={4} value={form.id} onChange={(e) => setForm({ ...form, id:e.target.value })}/></div>
                  <div className="fg"><label className="fl">이름 *</label><input className="fi" placeholder="이름" value={form.name} onChange={(e) => setForm({ ...form, name:e.target.value })}/></div>
                </div>
                <div className="frow">
                  <div className="fg"><label className="fl">학년</label>
                    <select className="fi fi-sel" value={form.grade} onChange={(e) => setForm({ ...form, grade:e.target.value })}>
                      {['중1','중2','중3','고1','고2','고3'].map((g) => <option key={g}>{g}</option>)}
                    </select>
                  </div>
                  <div className="fg"><label className="fl">학교</label><input className="fi" placeholder="학교명" value={form.school} onChange={(e) => setForm({ ...form, school:e.target.value })}/></div>
                </div>
                <div className="fg"><label className="fl">연락처</label><input className="fi" placeholder="010-0000-0000" value={form.phone} onChange={(e) => setForm({ ...form, phone:e.target.value })}/></div>
                <div className="mf">
                  <button className="btn btn-ghost" onClick={() => { setShowModal(false); setErr(''); }}>취소</button>
                  <button className="btn btn-primary" onClick={save}>추가</button>
                </div>
              </>}

              {addTab === 'bulk' && <>
                <div style={{ background:'var(--blue-light)', borderRadius:9, padding:13, marginBottom:14, fontSize:12.5, color:'var(--blue)', lineHeight:1.7 }}>
                  <strong>형식:</strong> 한 줄에 한 명 · <code style={{ background:'rgba(0,122,255,.12)', padding:'1px 5px', borderRadius:4 }}>학번,이름,학년,학교</code> (학년·학교 생략 가능)
                </div>
                <div className="fg"><label className="fl">학생 목록 붙여넣기</label>
                  <textarea className="fi fi-ta" style={{ minHeight:150, fontFamily:'monospace', fontSize:12.5, lineHeight:1.8 }}
                    placeholder={"0009,홍길동,중2,장승중학교\n0010,김철수,중3"}
                    value={bulkText} onChange={(e) => { setBulkText(e.target.value); parseBulk(e.target.value); }}/>
                </div>
                {bulkErr && <div style={{ background:'#FFF0EE', border:'1px solid var(--red)', borderRadius:8, padding:'9px 12px', marginBottom:10, fontSize:12, color:'var(--red)', whiteSpace:'pre-line' }}>{bulkErr}</div>}
                {bulkPreview.length > 0 && (
                  <div style={{ background:'#E8F8EE', border:'1px solid var(--green)', borderRadius:9, padding:12, marginBottom:14 }}>
                    <p style={{ fontSize:12.5, fontWeight:600, color:'var(--green)', marginBottom:7 }}>✅ 추가 예정 {bulkPreview.length}명</p>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>{bulkPreview.map((s) => <span key={s.id} className="badge b-green">{s.id} {s.name} {s.grade}</span>)}</div>
                  </div>
                )}
                <div className="mf">
                  <button className="btn btn-ghost" onClick={() => setShowModal(false)}>취소</button>
                  <button className="btn btn-primary" onClick={saveBulk} disabled={!bulkPreview.length}>+ {bulkPreview.length}명 일괄 추가</button>
                </div>
              </>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
