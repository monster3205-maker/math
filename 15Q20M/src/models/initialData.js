// ═══════════════════════════════════════════════════════════════
// MODEL: 초기 데이터 상수
// 앱 최초 실행 시 localStorage가 비어있을 때 사용.
// 이 파일은 읽기 전용 상수만 포함합니다.
// ═══════════════════════════════════════════════════════════════

function _d(n) { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().split('T')[0]; }
function _q(n, t = 'MC') { return Array.from({ length: n }, (_, i) => ({ no: i + 1, type: t, answer: '' })); }

export const INIT_STUDENTS = [
  { id: '0001', name: '김민준', grade: '중2', school: '장승중학교', phone: '010-1234-5678', memo: '' },
  { id: '0002', name: '이서연', grade: '중2', school: '장승중학교', phone: '010-2345-6789', memo: '' },
  { id: '0003', name: '박도윤', grade: '중3', school: '장승중학교', phone: '010-3456-7890', memo: '꼼꼼한 풀이 스타일' },
  { id: '0004', name: '최지아', grade: '중1', school: '장승중학교', phone: '010-4567-8901', memo: '' },
  { id: '0005', name: '정우진', grade: '중2', school: '장승중학교', phone: '010-5678-9012', memo: '계산 실수 잦음' },
  { id: '0006', name: '김하은', grade: '중3', school: '장승중학교', phone: '010-6789-0123', memo: '' },
  { id: '0007', name: '이준혁', grade: '중1', school: '장승중학교', phone: '010-7890-1234', memo: '기하 단원 약점' },
  { id: '0008', name: '박서현', grade: '중2', school: '장승중학교', phone: '010-8901-2345', memo: '' },
];

export const INIT_PAPERS = [
  { id: 'p1', name: '중2-방정식 기초', unit: '방정식', grade: '중2', difficulty: 'Easy', total: 15, type: 'Daily Test',
    questions: [
      {no:1,type:'MC',answer:'3'},{no:2,type:'MC',answer:'1'},{no:3,type:'MC',answer:'4'},
      {no:4,type:'MC',answer:'2'},{no:5,type:'MC',answer:'5'},{no:6,type:'MC',answer:'3'},
      {no:7,type:'MC',answer:'1'},{no:8,type:'MC',answer:'2'},{no:9,type:'MC',answer:'4'},
      {no:10,type:'MC',answer:'3'},{no:11,type:'SA',answer:'6'},{no:12,type:'SA',answer:'12'},
      {no:13,type:'SA',answer:'-3'},{no:14,type:'SA',answer:'9'},{no:15,type:'SA',answer:'4'},
    ] },
  { id: 'p2', name: '중2-부등식 심화', unit: '부등식', grade: '중2', difficulty: 'Hard', total: 15, type: 'Daily Test',
    questions: _q(15).map((q, i) => ({ ...q, answer: String((i % 5) + 1) })) },
  { id: 'p3', name: '중2-함수 기본', unit: '함수', grade: '중2', difficulty: 'Normal', total: 15, type: 'Daily Test',
    questions: _q(15).map((q, i) => ({ ...q, answer: String(((i * 2) % 5) + 1) })) },
  { id: 'p4', name: '중3-이차방정식', unit: '이차방정식', grade: '중3', difficulty: 'Normal', total: 15, type: 'Weekly Test',
    questions: [..._q(10).map((q, i) => ({ ...q, answer: String((i % 5) + 1) })),
                ..._q(5, 'SA').map((q, i) => ({ ...q, no: i + 11, answer: String(i + 1) }))] },
  { id: 'p5', name: '중1-정수와 유리수', unit: '정수', grade: '중1', difficulty: 'Easy', total: 15, type: 'Daily Test',
    questions: _q(15).map((q, i) => ({ ...q, answer: String((i % 4) + 1) })) },
  { id: 'p6', name: '주간테스트 A형', unit: '종합', grade: '전체', difficulty: 'Normal', total: 15, type: 'Weekly Test',
    questions: _q(15).map((q, i) => ({ ...q, answer: String((i % 5) + 1) })) },
];

export const INIT_RECORDS = [
  { id:'r01', studentId:'0001', paperId:'p1', score:13, date:_d(2),  solveMin:18, errorType:'계산 실수', retake:false, memo:'', tags:'방정식', answers:{} },
  { id:'r02', studentId:'0001', paperId:'p3', score:11, date:_d(9),  solveMin:20, errorType:'개념 부족', retake:false, memo:'함수 개념 재학습 필요', tags:'함수', answers:{} },
  { id:'r03', studentId:'0001', paperId:'p6', score:14, date:_d(16), solveMin:17, errorType:'',         retake:false, memo:'잘함', tags:'종합', answers:{} },
  { id:'r04', studentId:'0002', paperId:'p1', score:14, date:_d(3),  solveMin:16, errorType:'',         retake:false, memo:'우수', tags:'방정식', answers:{} },
  { id:'r05', studentId:'0002', paperId:'p3', score:13, date:_d(10), solveMin:19, errorType:'계산 실수', retake:false, memo:'', tags:'함수', answers:{} },
  { id:'r06', studentId:'0003', paperId:'p4', score:14, date:_d(1),  solveMin:18, errorType:'',         retake:false, memo:'', tags:'이차방정식', answers:{} },
  { id:'r07', studentId:'0003', paperId:'p6', score:13, date:_d(8),  solveMin:19, errorType:'계산 실수', retake:false, memo:'', tags:'종합', answers:{} },
  { id:'r08', studentId:'0004', paperId:'p5', score:12, date:_d(4),  solveMin:17, errorType:'개념 부족', retake:true,  memo:'정수 개념 부족', tags:'정수', answers:{} },
  { id:'r09', studentId:'0005', paperId:'p1', score:9,  date:_d(5),  solveMin:20, errorType:'계산 실수', retake:true,  memo:'계산 연습 필요', tags:'방정식', answers:{} },
  { id:'r10', studentId:'0006', paperId:'p4', score:15, date:_d(2),  solveMin:15, errorType:'',         retake:false, memo:'만점', tags:'이차방정식', answers:{} },
  { id:'r11', studentId:'0007', paperId:'p5', score:13, date:_d(3),  solveMin:18, errorType:'개념 부족', retake:false, memo:'', tags:'정수', answers:{} },
  { id:'r12', studentId:'0008', paperId:'p1', score:12, date:_d(6),  solveMin:19, errorType:'계산 실수', retake:false, memo:'', tags:'방정식', answers:{} },
];

export const INIT_ASSIGNMENTS = [
  { id:'a1', studentId:'0001', paperId:'p2', timeMode:'20', customMin:'20', assignedAt:_d(0), used:false },
  { id:'a2', studentId:'0003', paperId:'p4', timeMode:'45', customMin:'45', assignedAt:_d(0), used:false },
];
