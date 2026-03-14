// VIEW: 시험지 관리 페이지 (추가/수정 2단계 모달)
import { useState } from 'react';
import { SortIcon, useSortable } from '../components/SortIcon.jsx';
import { uid, diffCol } from '../../models/utils.js';

export function PaperMgmt({ papers, records, onAdd, onDelete, onUpdate }) {
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [step, setStep] = useState(1);
  const blank = { name:'', unit:'', grade:'중2', difficulty:'Normal', total:'15', type:'Daily Test' };
  const [form, setForm] = useState(blank);
  const [questions, setQuestions] = useState([]);
  const sort = useSortable('name', 1);

  const makeQs = (n) => Array.from({ length:n }, (_, i) => ({ no:i+1, type:'MC', answer:'' }));

  const sorted = [...papers].sort((a, b) => {
    const getV = (p) => {
      if (sort.key === 'name')      return p.name;
      if (sort.key === 'unit')      return p.unit;
      if (sort.key === 'grade')     return p.grade;
      if (sort.key === 'difficulty') return ['Easy','Normal','Hard'].indexOf(p.difficulty);
      if (sort.key === 'total')     return p.total;
      if (sort.key === 'type')      return p.type;
      if (sort.key === 'useCnt')    return records.filter((r) => r.paperId === p.id).length;
      return p.name;
    };
    const va = getV(a), vb = getV(b);
    return typeof va === 'number' ? sort.dir * (va - vb) : sort.dir * va.localeCompare(vb, 'ko');
  });

  const openAdd = () => { setEditTarget(null); setStep(1); setForm(blank); setQuestions([]); setShowModal(true); };
  const openEdit = (p) => {
    setEditTarget(p); setStep(1);
    setForm({ name:p.name, unit:p.unit, grade:p.grade, difficulty:p.difficulty, total:String(p.total), type:p.type });
    setQuestions(p.questions?.length ? p.questions.map((q) => ({ ...q })) : makeQs(p.total));
    setShowModal(true);
  };

  const goStep2 = () => {
    if (!form.name || !form.unit) { alert('시험지명과 단원은 필수입니다.'); return; }
    const n = parseInt(form.total) || 15;
    setQuestions((prev) => {
      if (prev.length === n) return prev;
      if (prev.length < n) return [...prev, ...makeQs(n - prev.length).map((q, i) => ({ ...q, no:prev.length+i+1 }))];
      return prev.slice(0, n);
    });
    setStep(2);
  };

  const setQ = (i, field, val) => {
    setQuestions((qs) => qs.map((q, idx) => {
      if (idx !== i) return q;
      if (field === 'type') return { ...q, type:val, answer:'' };
      return { ...q, [field]:val };
    }));
  };

  const save = () => {
    const data = { ...form, total:parseInt(form.total) || 15, questions };
    if (editTarget) onUpdate({ ...editTarget, ...data });
    else            onAdd({ id:uid(), ...data });
    setShowModal(false);
  };

  const Th = ({ k, label }) => (
    <th className={`sortable${sort.key===k?' sort-active':''}`} onClick={() => sort.toggle(k)}>
      {label} <SortIcon active={sort.key===k} dir={sort.dir}/>
    </th>
  );

  return (
    <div>
      <div className="ph"><div className="pt">시험지 관리</div><div className="ps">등록 시험지 {papers.length}개</div></div>
      <div className="pb">
        <div className="tb"><div className="tb-l"/><div className="tb-r"><button type="button" className="btn btn-primary" onClick={openAdd}>+ 시험지 추가</button></div></div>
        <div className="tw"><table>
          <thead><tr>
            <Th k="name" label="시험지명"/><Th k="unit" label="단원"/><Th k="grade" label="학년"/>
            <Th k="difficulty" label="난이도"/><Th k="total" label="문제 수"/>
            <Th k="type" label="유형"/><th>정답키</th><Th k="useCnt" label="사용 횟수"/>
            <th>수정</th><th>삭제</th>
          </tr></thead>
          <tbody>
            {sorted.length === 0
              ? <tr><td colSpan={10}><div className="empty"><div className="empty-ico">📄</div><div className="empty-txt">등록된 시험지 없음</div></div></td></tr>
              : sorted.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight:500, fontSize:13 }}>{p.name}</td>
                    <td><span className="badge b-blue">{p.unit}</span></td>
                    <td style={{ fontSize:12.5 }}>{p.grade}</td>
                    <td><span className={`badge ${diffCol(p.difficulty)}`}>{p.difficulty}</span></td>
                    <td style={{ fontSize:13 }}>{p.total}문제</td>
                    <td><span className="badge b-gray" style={{ fontSize:11, maxWidth:90, overflow:'hidden', textOverflow:'ellipsis', display:'inline-block', whiteSpace:'nowrap' }}>{p.type}</span></td>
                    <td>{p.questions?.length ? <span className="badge b-green">✓ {p.questions.filter((q) => q.answer).length}/{p.questions.length}</span> : <span className="badge b-gray">미설정</span>}</td>
                    <td>{records.filter((r) => r.paperId === p.id).length}회</td>
                    <td><button type="button" className="btn btn-ghost btn-sm" onClick={() => openEdit(p)}>✏️ 수정</button></td>
                    <td><button type="button" className="btn-icon" onClick={() => { if (window.confirm('삭제?')) onDelete(p.id); }}>🗑</button></td>
                  </tr>
                ))}
          </tbody>
        </table></div>

        {showModal && (
          <div className="mo" onClick={() => setShowModal(false)}>
            <div className="mc" style={{ width:step===2?720:520 }} onClick={(e) => e.stopPropagation()}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
                <h2 style={{ margin:0 }}>{editTarget ? '✏️ 시험지 수정' : '+ 시험지 추가'} — {step===1?'기본 정보':'정답 키 입력'}</h2>
                <span style={{ fontSize:12, color:'var(--text2)', marginLeft:'auto' }}>{step}/2단계</span>
              </div>
              <div style={{ display:'flex', gap:6, marginBottom:20 }}>
                {[1,2].map((s) => <div key={s} style={{ flex:1, height:4, borderRadius:99, background:s<=step?'var(--blue)':'var(--border)' }}/>)}
              </div>

              {step === 1 && <>
                <div className="fg"><label className="fl">시험지명 *</label><input className="fi" placeholder="예: 중2-방정식 기초" value={form.name} onChange={(e) => setForm({ ...form, name:e.target.value })}/></div>
                <div className="frow">
                  <div className="fg"><label className="fl">단원 *</label><input className="fi" placeholder="예: 방정식" value={form.unit} onChange={(e) => setForm({ ...form, unit:e.target.value })}/></div>
                  <div className="fg"><label className="fl">학년</label>
                    <select className="fi fi-sel" value={form.grade} onChange={(e) => setForm({ ...form, grade:e.target.value })}>
                      {['중1','중2','중3','고1','고2','고3','전체'].map((g) => <option key={g}>{g}</option>)}
                    </select>
                  </div>
                </div>
                <div className="frow">
                  <div className="fg"><label className="fl">난이도</label>
                    <select className="fi fi-sel" value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty:e.target.value })}>
                      {['Easy','Normal','Hard'].map((d) => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="fg"><label className="fl">총 문제 수</label>
                    <input className="fi" type="number" min={1} max={50} value={form.total} onChange={(e) => setForm({ ...form, total:e.target.value })}/>
                  </div>
                </div>
                <div className="fg">
                  <label className="fl">시험 유형 <span style={{ fontSize:11, color:'var(--text3)', fontWeight:400 }}>(직접 입력 또는 목록에서 선택)</span></label>
                  <input className="fi" list="pm-type-list" placeholder="예: Daily Test, 오답노트..." value={form.type} onChange={(e) => setForm({ ...form, type:e.target.value })}/>
                  <datalist id="pm-type-list">
                    <option value="Daily Test"/><option value="Weekly Test"/><option value="Mock Test"/>
                    <option value="오답노트"/><option value="선행테스트"/><option value="복습테스트"/><option value="형성평가"/>
                  </datalist>
                </div>
                <div className="mf">
                  <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>취소</button>
                  <button type="button" className="btn btn-primary" onClick={goStep2}>다음 → 정답 키 입력</button>
                </div>
              </>}

              {step === 2 && <>
                <div style={{ background:'var(--blue-light)', borderRadius:9, padding:'9px 13px', marginBottom:14, fontSize:12.5, color:'var(--blue)' }}>
                  <strong>객관식</strong>: 번호 클릭으로 정답 선택 · <strong>서답형</strong>: 직접 답 입력 · 유형 버튼으로 전환
                </div>
                <div style={{ maxHeight:420, overflowY:'auto', padding:'2px' }}>
                  <div className="ak-grid" style={{ gridTemplateColumns:`repeat(${Math.min(5, questions.length)},1fr)` }}>
                    {questions.map((q, i) => (
                      <div key={i} className="ak-item">
                        <div className="ak-qno">문 {q.no}</div>
                        <div className="ak-type-btns">
                          <button type="button" className={`ak-tbtn${q.type==='MC'?' active-mc':''}`}
                            onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); setQ(i,'type','MC'); }}>객관식</button>
                          <button type="button" className={`ak-tbtn${q.type==='SA'?' active-sa':''}`}
                            onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); setQ(i,'type','SA'); }}>서답형</button>
                        </div>
                        {q.type === 'MC' ? (
                          <div className="ak-choices">
                            {['1','2','3','4','5'].map((n) => (
                              <div key={n} className={`ak-c${q.answer===n?' sel':''}`}
                                onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); setQ(i,'answer',q.answer===n?'':n); }}>{n}</div>
                            ))}
                          </div>
                        ) : (
                          <input className="ak-sa-in" placeholder="정답" value={q.answer || ''}
                            onChange={(e) => setQ(i, 'answer', e.target.value)}
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => e.stopPropagation()}/>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ marginTop:12, padding:'9px 13px', background:'var(--bg)', borderRadius:9, fontSize:12.5, color:'var(--text2)' }}>
                  정답 입력: <strong style={{ color:'var(--blue)' }}>{questions.filter((q) => q.answer).length}/{questions.length}</strong>문제 완료
                  {questions.filter((q) => !q.answer).length > 0 && <span style={{ color:'var(--orange)', marginLeft:8 }}>⚠ 미입력 문제는 자동채점 제외</span>}
                </div>
                <div className="mf">
                  <button type="button" className="btn btn-ghost" onClick={() => setStep(1)}>← 이전</button>
                  <button type="button" className="btn btn-primary" onClick={save}>{editTarget ? '✅ 수정 완료' : '✅ 시험지 저장'}</button>
                </div>
              </>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
