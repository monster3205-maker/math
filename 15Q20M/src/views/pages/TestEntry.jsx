// VIEW: 점수 직접 입력 페이지 (관리자 수동 입력)
import { useState } from 'react';
import { uid, calcAcc } from '../../models/utils.js';

export function TestEntry({ students, papers, onSave }) {
  const blank = { studentId:'', paperId:'', score:'', date:new Date().toISOString().split('T')[0], errorType:'', retake:false, memo:'' };
  const [form, setForm] = useState(blank);
  const [saved, setSaved] = useState(false);

  const paper = papers.find((p) => p.id === form.paperId);
  const acc   = paper && form.score !== '' ? calcAcc(parseInt(form.score), paper.total) : null;

  const handleSave = () => {
    if (!form.studentId || !form.paperId || form.score === '') { alert('학생, 시험지, 점수는 필수입니다.'); return; }
    onSave({ id:uid(), ...form, score:parseInt(form.score), solveMin:20, tags:paper?.unit || '', answers:{} }, null);
    setSaved(true); setTimeout(() => setSaved(false), 2000);
    setForm({ ...blank, studentId:form.studentId });
  };

  return (
    <div>
      <div className="ph"><div className="pt">점수 직접 입력</div><div className="ps">관리자가 수동으로 점수를 입력합니다</div></div>
      <div className="pb">
        <div style={{ maxWidth:600 }}>
          {saved && <div style={{ background:'#E8F8EE', border:'1px solid var(--green)', borderRadius:9, padding:'11px 15px', marginBottom:14, fontSize:13.5, color:'var(--green)' }}>✅ 저장되었습니다!</div>}
          <div className="card"><div className="ci">
            <div className="frow">
              <div className="fg"><label className="fl">학생 선택 *</label>
                <select className="fi fi-sel" value={form.studentId} onChange={(e) => setForm({ ...form, studentId:e.target.value })}>
                  <option value="">학생 선택</option>
                  {students.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
                </select>
              </div>
              <div className="fg"><label className="fl">시험지 선택 *</label>
                <select className="fi fi-sel" value={form.paperId} onChange={(e) => setForm({ ...form, paperId:e.target.value })}>
                  <option value="">시험지 선택</option>
                  {papers.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            </div>
            {paper && <p style={{ fontSize:12, color:'var(--blue)', margin:'-8px 0 14px', padding:'7px 11px', background:'var(--blue-light)', borderRadius:8 }}>📄 {paper.name} · {paper.total}문제 · {paper.difficulty} · {paper.unit}</p>}
            <div className="frow">
              <div className="fg"><label className="fl">점수 *{paper ? ` (0~${paper.total})` : ''}</label>
                <input className="fi" type="number" min={0} max={paper?.total || 99} placeholder="점수 입력" value={form.score}
                  onChange={(e) => setForm({ ...form, score:e.target.value })} style={{ fontSize:24, fontWeight:300, textAlign:'center' }}/>
                {acc !== null && <p style={{ textAlign:'center', marginTop:5, fontSize:15, fontWeight:600, color:acc>=80?'var(--green)':acc>=60?'var(--orange)':'var(--red)' }}>정답률 {acc}%</p>}
              </div>
              <div className="fg"><label className="fl">시험 날짜</label>
                <input className="fi" type="date" value={form.date} onChange={(e) => setForm({ ...form, date:e.target.value })}/>
              </div>
            </div>
            <div className="frow">
              <div className="fg"><label className="fl">오답 유형</label>
                <select className="fi fi-sel" value={form.errorType} onChange={(e) => setForm({ ...form, errorType:e.target.value })}>
                  <option value="">선택 안함</option><option>계산 실수</option><option>개념 부족</option><option>시간 부족</option>
                </select>
              </div>
              <div className="fg"><label className="fl">재시험 여부</label>
                <div style={{ display:'flex', alignItems:'center', gap:9, marginTop:9 }}>
                  <input type="checkbox" id="retake" checked={form.retake} onChange={(e) => setForm({ ...form, retake:e.target.checked })} style={{ width:17, height:17, accentColor:'var(--blue)' }}/>
                  <label htmlFor="retake" style={{ fontSize:13.5, cursor:'pointer' }}>재시험 필요</label>
                </div>
              </div>
            </div>
            <div className="fg"><label className="fl">교사 메모</label>
              <input className="fi" placeholder="메모 (선택)" value={form.memo} onChange={(e) => setForm({ ...form, memo:e.target.value })}/>
            </div>
            <div style={{ display:'flex', gap:10, marginTop:6 }}>
              <button className="btn btn-ghost" style={{ flex:1 }} onClick={() => setForm(blank)}>초기화</button>
              <button className="btn btn-primary" style={{ flex:2, justifyContent:'center', fontSize:15, padding:'12px' }} onClick={handleSave}>💾 저장</button>
            </div>
          </div></div>
        </div>
      </div>
    </div>
  );
}
