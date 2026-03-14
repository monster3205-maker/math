// VIEW: 학생 시험 화면
// setup → running/paused → done(OMR) → result 4단계 플로우
// 채점/저장은 autoGrade + onSave 콜백으로 ViewModel에 위임합니다.
import { useState, useEffect, useRef } from 'react';
import { autoGrade, calcAcc, fmtSec, uid } from '../../models/utils.js';

export function StudentExam({ student, assignments, papers, onSave, onLogout }) {
  const [phase, setPhase]       = useState('setup');
  const [selAssign, setSelAssign] = useState(null);
  const [elapsed, setElapsed]   = useState(0);
  const [remaining, setRemaining] = useState(1200);
  const [answers, setAnswers]   = useState({});
  const [memo, setMemo]         = useState('');
  const itvRef = useRef();

  const myAssigns = assignments.filter((a) => a.studentId === student.id && !a.used);
  const paper     = selAssign ? papers.find((p) => p.id === selAssign.paperId) : null;
  const timeSec   = selAssign
    ? (selAssign.timeMode === '20' ? 1200 : selAssign.timeMode === '45' ? 2700 : parseInt(selAssign.customMin || 20) * 60)
    : 1200;

  useEffect(() => {
    if (phase === 'running') {
      itvRef.current = setInterval(() => {
        setRemaining((r) => { if (r <= 1) { clearInterval(itvRef.current); setPhase('done'); playAlarm(); return 0; } return r - 1; });
        setElapsed((e) => e + 1);
      }, 1000);
    } else clearInterval(itvRef.current);
    return () => clearInterval(itvRef.current);
  }, [phase]);

  const playAlarm = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      [0, 500, 1000].forEach((d) => {
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination); o.frequency.value = 880; g.gain.value = 0.3;
        o.start(ctx.currentTime + d / 1000); o.stop(ctx.currentTime + d / 1000 + 0.4);
      });
    } catch {}
  };

  const handleSubmit = () => {
    const score = autoGrade(paper?.questions, answers) ?? 0;
    onSave({
      id: uid(), studentId: student.id, paperId: selAssign.paperId, score,
      date: new Date().toISOString().split('T')[0], solveMin: Math.round(elapsed / 60),
      errorType: '', retake: score / (paper?.total || 15) < 0.6,
      memo, tags: paper?.unit || '', answers,
    }, selAssign.id);
    setPhase('result');
  };

  const urgent = remaining <= 180 && remaining > 0;

  // ── 배정 없음 ──
  if (myAssigns.length === 0 && phase === 'setup') return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#F5F5F7,#E8F1FF)', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ background:'#fff', borderRadius:24, padding:40, width:460, boxShadow:'0 20px 60px rgba(0,0,0,.12)', textAlign:'center' }}>
        <div style={{ fontSize:52, marginBottom:16 }}>🕐</div>
        <h1 style={{ fontSize:22, fontWeight:700, marginBottom:8 }}>배정된 시험이 없습니다</h1>
        <p style={{ color:'var(--text2)', fontSize:14 }}>선생님이 시험을 배정하면 이 화면에서 시작할 수 있습니다.</p>
        <p style={{ fontSize:13, color:'var(--text3)', margin:'16px 0' }}>학번 {student.id} · {student.name} · {student.grade}</p>
        <button className="btn btn-ghost" onClick={onLogout}>← 로그아웃</button>
      </div>
    </div>
  );

  // ── 시험 선택 ──
  if (phase === 'setup') return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#F5F5F7,#E8F1FF)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ background:'#fff', borderRadius:24, padding:36, width:540, boxShadow:'0 20px 60px rgba(0,0,0,.12)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
          <div><h1 style={{ fontSize:20, fontWeight:700 }}>안녕하세요, {student.name}! 👋</h1><p style={{ color:'var(--text2)', fontSize:13 }}>{student.id} · {student.grade}</p></div>
          <button className="btn btn-ghost btn-sm" onClick={onLogout}>로그아웃</button>
        </div>
        <p style={{ fontSize:13, color:'var(--text2)', marginBottom:12 }}>배정된 시험 ({myAssigns.length}개)</p>
        <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:20 }}>
          {myAssigns.map((a) => {
            const p  = papers.find((x) => x.id === a.paperId);
            const tL = a.timeMode === '20' ? '20분' : a.timeMode === '45' ? '45분' : a.customMin + '분';
            return (
              <div key={a.id}
                style={{ border:`2px solid ${selAssign?.id === a.id ? 'var(--blue)' : 'var(--border)'}`, background: selAssign?.id === a.id ? 'var(--blue-light)' : '#fff', borderRadius:14, padding:'14px 18px', cursor:'pointer', transition:'all .2s' }}
                onClick={() => setSelAssign(a)}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ fontSize:26 }}>📄</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:15, fontWeight:600 }}>{p?.name || '?'}</div>
                    <div style={{ fontSize:12, color:'var(--text2)', marginTop:2 }}>{p?.unit} · {p?.difficulty} · {tL} · {p?.total}문제</div>
                  </div>
                  {selAssign?.id === a.id && <span style={{ color:'var(--blue)', fontSize:18 }}>✓</span>}
                </div>
              </div>
            );
          })}
        </div>
        <button className="btn btn-primary" style={{ width:'100%', justifyContent:'center', fontSize:15, padding:13 }}
          onClick={() => { setRemaining(timeSec); setElapsed(0); setPhase('running'); }} disabled={!selAssign}>
          🚀 시험 시작
        </button>
      </div>
    </div>
  );

  // ── 타이머 ──
  if (phase === 'running' || phase === 'paused') return (
    <div className="exam-bg">
      <div style={{ textAlign:'center', marginBottom:36 }}>
        <h2 style={{ fontSize:20, fontWeight:500, opacity:.9 }}>{student.name} · {paper?.name}</h2>
        <p style={{ fontSize:14, opacity:.5, marginTop:5 }}>{student.id}</p>
      </div>
      <div className={`exam-timer${urgent ? ' urgent' : ''}`}>{fmtSec(remaining)}</div>
      <p style={{ opacity:.35, marginTop:14, fontSize:13 }}>경과 {fmtSec(elapsed)}</p>
      <div className="timer-ctrl">
        {phase === 'running' && <button className="tbtn" onClick={() => setPhase('paused')}>⏸ 일시정지</button>}
        {phase === 'paused'  && <button className="tbtn primary" onClick={() => setPhase('running')}>▶ 재시작</button>}
        <button className="tbtn danger" onClick={() => setPhase('done')}>■ 시험 종료</button>
      </div>
    </div>
  );

  // ── OMR 답안 입력 ──
  if (phase === 'done') {
    const questions = paper?.questions || [];
    const filled    = questions.filter((q) => (answers[q.no] ?? '').toString().trim()).length;
    return (
      <div className="omr-page">
        <div className="omr-header">
          <div style={{ background:'var(--blue)', color:'#fff', borderRadius:99, padding:'4px 16px', fontSize:12, fontWeight:600, display:'inline-block', marginBottom:12 }}>📝 답안 입력</div>
          <h1>{paper?.name}</h1>
          <p>{student.name} · 풀이 {fmtSec(elapsed)} · 총 {questions.length}문제</p>
          <div style={{ marginTop:8, fontSize:13, color: filled === questions.length ? 'var(--green)' : 'var(--orange)', fontWeight:600 }}>{filled}/{questions.length}문제 입력됨</div>
        </div>
        <div className="omr-grid" style={{ gridTemplateColumns:`repeat(${Math.min(5, questions.length)},1fr)` }}>
          {questions.map((q) => (
            <div key={q.no} className="omr-q">
              <div className="omr-qno">문 {q.no}</div>
              {q.type === 'MC' ? (
                <div className="omr-choices">
                  {['1','2','3','4','5'].map((n) => (
                    <div key={n} className={`omr-circle${answers[q.no] === n ? ' sel' : ''}`}
                      onClick={() => setAnswers((a) => ({ ...a, [q.no]: a[q.no] === n ? '' : n }))}>{n}</div>
                  ))}
                </div>
              ) : (
                <input className="omr-sa" placeholder="답 입력" value={answers[q.no] || ''}
                  onChange={(e) => setAnswers((a) => ({ ...a, [q.no]: e.target.value }))} />
              )}
            </div>
          ))}
        </div>
        <div style={{ width:'100%', maxWidth:760, marginBottom:16 }}>
          <input className="fi" placeholder="메모 (선택)" value={memo} onChange={(e) => setMemo(e.target.value)} />
        </div>
        <div style={{ display:'flex', gap:10, width:'100%', maxWidth:760 }}>
          <button className="btn btn-ghost" style={{ flex:1, justifyContent:'center' }} onClick={() => setPhase('running')}>← 돌아가기</button>
          <button className="btn btn-primary" style={{ flex:2, justifyContent:'center', fontSize:15, padding:13 }} onClick={handleSubmit}>
            ✅ 제출하기 ({filled}/{questions.length})
          </button>
        </div>
      </div>
    );
  }

  // ── 결과 ──
  if (phase === 'result') {
    const questions = paper?.questions || [];
    const score     = autoGrade(questions, answers) ?? 0;
    const acc       = calcAcc(score, questions.length);
    return (
      <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#F0F9FF,#E8F1FF)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
        <div style={{ background:'#fff', borderRadius:24, padding:40, width:520, boxShadow:'0 24px 80px rgba(0,122,255,.14)' }}>
          <div style={{ textAlign:'center', marginBottom:28 }}>
            <div style={{ width:72, height:72, borderRadius:'50%', background: acc>=80?'var(--green)':acc>=60?'var(--orange)':'var(--red)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:30, margin:'0 auto 14px', boxShadow:'0 8px 24px rgba(0,0,0,.15)' }}>
              {acc >= 80 ? '🎉' : acc >= 60 ? '👍' : '💪'}
            </div>
            <h1 style={{ fontSize:24, fontWeight:700 }}>{score} / {questions.length}문제</h1>
            <div style={{ fontSize:32, fontWeight:700, color: acc>=80?'var(--green)':acc>=60?'var(--orange)':'var(--red)', marginTop:4 }}>{acc}%</div>
            <p style={{ color:'var(--text2)', fontSize:13, marginTop:8 }}>{paper?.name} · 풀이 {fmtSec(elapsed)}</p>
          </div>
          <div style={{ maxHeight:240, overflowY:'auto', marginBottom:20 }}>
            {questions.map((q) => {
              const a = (answers[q.no] ?? '').toString().trim();
              const k = (q.answer ?? '').toString().trim();
              const ok = k && a.toLowerCase() === k.toLowerCase();
              return (
                <div key={q.no} style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 10px', borderRadius:10, marginBottom:5, background: ok ? '#E8F8EE' : '#FFF0EE' }}>
                  <span style={{ width:28, height:28, borderRadius:'50%', background: ok?'var(--green)':'var(--red)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, flexShrink:0 }}>{ok ? '✓' : '✗'}</span>
                  <span style={{ fontSize:13, flex:1 }}><strong>문 {q.no}</strong> · 내 답: <strong>{a || '미입력'}</strong>{!ok && <span style={{ color:'var(--red)' }}> → 정답: {k}</span>}</span>
                </div>
              );
            })}
          </div>
          <button className="btn btn-primary" style={{ width:'100%', justifyContent:'center', fontSize:15, padding:13 }} onClick={onLogout}>완료 · 로그아웃</button>
        </div>
      </div>
    );
  }
  return null;
}
