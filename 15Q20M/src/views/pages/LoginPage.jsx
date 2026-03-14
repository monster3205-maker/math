// VIEW: 로그인 페이지 (숫자패드 + 관리자 비밀번호)
// 인증 결과는 onStudent / onAdmin 콜백으로 부모에게 위임합니다.
import { useState } from 'react';

const ADMIN_PW = 'admin123';

export function LoginPage({ students, onStudent, onAdmin }) {
  const [pin, setPin]       = useState('');
  const [err, setErr]       = useState('');
  const [adminMode, setAdminMode] = useState(false);
  const [pw, setPw]         = useState('');
  const [pwErr, setPwErr]   = useState('');

  const press = (k) => {
    setErr('');
    if (k === 'del') { setPin((p) => p.slice(0, -1)); return; }
    if (pin.length >= 4) return;
    const next = pin + k;
    setPin(next);
    if (next.length === 4) {
      setTimeout(() => {
        const s = students.find((x) => x.id === next);
        if (s) { onStudent(s); setPin(''); }
        else   { setErr('등록된 학생번호가 아닙니다.'); setPin(''); }
      }, 150);
    }
  };

  const tryAdmin = () => {
    if (pw === ADMIN_PW) { onAdmin(); setPw(''); setAdminMode(false); }
    else setPwErr('비밀번호가 틀렸습니다.');
  };

  if (adminMode) return (
    <div className="lp"><div className="lc">
      <div className="ll"><div style={{ fontSize:30, marginBottom:6 }}>🔐</div><h1>관리자 로그인</h1><p>비밀번호를 입력하세요</p></div>
      <div className="fg">
        <input className="fi" type="password" placeholder="비밀번호 (admin123)" value={pw}
          onChange={(e) => { setPw(e.target.value); setPwErr(''); }}
          onKeyDown={(e) => e.key === 'Enter' && tryAdmin()} autoFocus />
        {pwErr && <p style={{ color:'var(--red)', fontSize:12, marginTop:4 }}>{pwErr}</p>}
      </div>
      <div style={{ display:'flex', gap:9 }}>
        <button className="btn btn-ghost" style={{ flex:1 }} onClick={() => { setAdminMode(false); setPw(''); setPwErr(''); }}>← 뒤로</button>
        <button className="btn btn-primary" style={{ flex:1 }} onClick={tryAdmin}>로그인</button>
      </div>
    </div></div>
  );

  return (
    <div className="lp"><div className="lc">
      <div className="ll"><div style={{ fontSize:30, marginBottom:6 }}>📐</div><h1>15Q20M</h1><p>학원 시험 관리 시스템 · 학생번호 4자리 입력</p></div>
      <div className="pin-disp" style={{ color: pin ? 'var(--text)' : 'var(--text3)' }}>
        {pin ? '●'.repeat(pin.length) + '○'.repeat(4 - pin.length) : '_ _ _ _'}
      </div>
      {err && <p style={{ color:'var(--red)', fontSize:12, textAlign:'center', marginBottom:8 }}>{err}</p>}
      <div className="numpad">
        {['1','2','3','4','5','6','7','8','9'].map((k) => (
          <button key={k} className="nbtn" onClick={() => press(k)}>{k}</button>
        ))}
        <button className="nbtn" style={{ fontSize:12, color:'var(--blue)', fontWeight:600 }} onClick={() => setAdminMode(true)}>관리자</button>
        <button className="nbtn" onClick={() => press('0')}>0</button>
        <button className="nbtn red-btn" onClick={() => press('del')}>⌫</button>
      </div>
      <p style={{ textAlign:'center', fontSize:11, color:'var(--text3)', marginTop:16 }}>학생번호를 모를 경우 선생님께 문의하세요</p>
    </div></div>
  );
}
