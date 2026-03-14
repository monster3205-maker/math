// VIEW: 시험 배정 페이지
import { useState } from 'react';
import { SortIcon, useSortable } from '../components/SortIcon.jsx';
import { avColor, ini } from '../../models/utils.js';

export function AssignPage({ students, papers, assignments, onAdd, onDelete }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ studentId:'', paperId:'', timeMode:'20', customMin:'30' });
  const sort = useSortable('assignedAt', -1);

  const pending = assignments.filter((a) => !a.used);
  const done    = assignments.filter((a) =>  a.used);

  const save = () => {
    if (!form.studentId || !form.paperId) { alert('학생과 시험지를 선택하세요'); return; }
    onAdd(form); setShowModal(false); setForm({ studentId:'', paperId:'', timeMode:'20', customMin:'30' });
  };

  const sortFn = (list) => [...list].sort((a, b) => {
    if (sort.key === 'assignedAt') return sort.dir * (new Date(a.assignedAt) - new Date(b.assignedAt));
    if (sort.key === 'name') {
      const sa = students.find((x) => x.id === a.studentId)?.name || '';
      const sb = students.find((x) => x.id === b.studentId)?.name || '';
      return sort.dir * sa.localeCompare(sb, 'ko');
    }
    return 0;
  });

  const Table = ({ list, title, badge, canDelete }) => (
    <div style={{ marginBottom:24 }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
        <h3 style={{ fontSize:15, fontWeight:600 }}>{title}</h3>
        <span className={`badge ${badge}`}>{list.length}건</span>
      </div>
      <div className="tw"><table>
        <thead><tr>
          <th className={`sortable${sort.key==='name'?' sort-active':''}`} onClick={() => sort.toggle('name')}>학생 <SortIcon active={sort.key==='name'} dir={sort.dir}/></th>
          <th>시험지</th><th>시간</th>
          <th className={`sortable${sort.key==='assignedAt'?' sort-active':''}`} onClick={() => sort.toggle('assignedAt')}>배정일 <SortIcon active={sort.key==='assignedAt'} dir={sort.dir}/></th>
          <th>상태</th>
          {canDelete && <th>삭제</th>}
        </tr></thead>
        <tbody>
          {sortFn(list).length === 0
            ? <tr><td colSpan={6}><div className="empty"><div className="empty-ico">📭</div><div className="empty-txt">없음</div></div></td></tr>
            : sortFn(list).map((a) => {
                const s  = students.find((x) => x.id === a.studentId) || { name:'?' };
                const p  = papers.find((x)   => x.id === a.paperId)   || { name:'?' };
                const tL = a.timeMode==='20'?'20분':a.timeMode==='45'?'45분':a.customMin+'분';
                return (
                  <tr key={a.id}>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                        <div style={{ width:28, height:28, borderRadius:'50%', background:avColor(a.studentId), display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:11, fontWeight:600 }}>{ini(s.name)}</div>
                        <div><div style={{ fontSize:13, fontWeight:500 }}>{s.name}</div><div style={{ fontSize:11, color:'var(--text3)' }}>{s.id}</div></div>
                      </div>
                    </td>
                    <td style={{ fontSize:13, fontWeight:500 }}>{p.name}</td>
                    <td><span className="badge b-blue">{tL}</span></td>
                    <td style={{ fontSize:12, color:'var(--text2)' }}>{a.assignedAt}</td>
                    <td>{a.used ? <span className="badge b-green">완료</span> : <span className="badge b-orange">대기중</span>}</td>
                    {canDelete && <td><button className="btn-icon" onClick={() => { if (window.confirm('배정 취소?')) onDelete(a.id); }}>🗑</button></td>}
                  </tr>
                );
              })}
        </tbody>
      </table></div>
    </div>
  );

  return (
    <div>
      <div className="ph"><div className="pt">시험 배정</div><div className="ps">관리자가 학생에게 시험지를 배정합니다</div></div>
      <div className="pb">
        <div className="tb"><div className="tb-l"/><div className="tb-r"><button className="btn btn-primary" onClick={() => setShowModal(true)}>+ 시험 배정</button></div></div>
        <Table list={pending} title="📬 대기 중인 배정" badge="b-orange" canDelete />
        <Table list={done}    title="✅ 완료된 배정"    badge="b-green"  canDelete={false} />

        {showModal && (
          <div className="mo" onClick={() => setShowModal(false)}>
            <div className="mc" onClick={(e) => e.stopPropagation()}>
              <h2>📬 시험 배정</h2>
              <div className="fg"><label className="fl">학생 선택 *</label>
                <select className="fi fi-sel" value={form.studentId} onChange={(e) => setForm({ ...form, studentId:e.target.value })}>
                  <option value="">학생 선택</option>
                  {students.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.id}) · {s.grade}</option>)}
                </select>
              </div>
              <div className="fg"><label className="fl">시험지 선택 *</label>
                <select className="fi fi-sel" value={form.paperId} onChange={(e) => setForm({ ...form, paperId:e.target.value })}>
                  <option value="">시험지 선택</option>
                  {papers.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.total}문제 · {p.difficulty})</option>)}
                </select>
              </div>
              <div className="fg"><label className="fl">시험 시간</label>
                <div className="tabs" style={{ marginBottom:10 }}>
                  {[['20','20분'],['45','45분'],['custom','직접설정']].map(([m, l]) => (
                    <div key={m} className={`tab${form.timeMode===m?' active':''}`} onClick={() => setForm({ ...form, timeMode:m })}>{l}</div>
                  ))}
                </div>
                {form.timeMode === 'custom' && (
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <input className="fi" type="number" value={form.customMin} min={5} max={180}
                      onChange={(e) => setForm({ ...form, customMin:e.target.value })} style={{ width:90 }} />
                    <span style={{ color:'var(--text2)', fontSize:13 }}>분</span>
                  </div>
                )}
              </div>
              <div className="mf">
                <button className="btn btn-ghost" onClick={() => setShowModal(false)}>취소</button>
                <button className="btn btn-primary" onClick={save}>배정</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
