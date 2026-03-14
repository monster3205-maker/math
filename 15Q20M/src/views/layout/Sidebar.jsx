// VIEW: 사이드바 (네비게이션 렌더링만, 페이지 변경은 콜백으로 위임)
export const NAV_ITEMS = [
  { key:'dashboard', icon:'📊', label:'대시보드' },
  { key:'assign',    icon:'📬', label:'시험 배정' },
  { key:'students',  icon:'👥', label:'학생 목록' },
  { key:'entry',     icon:'✏️',  label:'점수 직접입력' },
  { key:'records',   icon:'📋', label:'시험 기록' },
  { key:'papers',    icon:'📄', label:'시험지 관리' },
  { key:'analytics', icon:'📈', label:'분석' },
  { key:'report',    icon:'📑', label:'학부모 리포트' },
];

export function Sidebar({ page, onChange, onLogout, counts }) {
  return (
    <div className="sidebar">
      <div className="sb-logo">
        <h1>📐 15Q20M</h1>
        <span>학원 시험 관리 시스템</span>
      </div>
      <nav className="sb-nav">
        <div className="nav-sec">메뉴</div>
        {NAV_ITEMS.map((n) => (
          <div key={n.key} className={`nav-item${page === n.key ? ' active' : ''}`} onClick={() => onChange(n.key)}>
            <span className="nav-icon">{n.icon}</span><span>{n.label}</span>
          </div>
        ))}
        <div className="nav-sec" style={{ marginTop: 10 }}>현황</div>
        {[['👤', `학생 ${counts.s}명`], ['📝', `기록 ${counts.r}건`], ['📬', `미완료 배정 ${counts.a}건`]].map(([ico, txt]) => (
          <div key={txt} className="nav-item" style={{ pointerEvents:'none' }}>
            <span className="nav-icon">{ico}</span><span>{txt}</span>
          </div>
        ))}
      </nav>
      <div className="sb-foot">
        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
          <div style={{ width:30, height:30, borderRadius:'50%', background:'var(--blue)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:12, fontWeight:600 }}>관</div>
          <div><div style={{ fontSize:13, fontWeight:500 }}>관리자</div>
            <div style={{ fontSize:11, color:'var(--blue)', cursor:'pointer' }} onClick={onLogout}>← 로그아웃</div>
          </div>
        </div>
      </div>
    </div>
  );
}
