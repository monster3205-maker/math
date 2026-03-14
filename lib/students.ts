// 웹앱 학생 계정과 시험 시스템 학생 데이터를 연결하는 마스터 데이터
// examPin = exam-system.html 내 학생 id (4자리)
export interface StudentAccount {
  userId: string;    // 웹앱 로그인 아이디 (student0001 등)
  name: string;      // 표시 이름
  grade: string;
  examPin: string;   // 시험 시스템 학생 id
}

export const STUDENT_ACCOUNTS: StudentAccount[] = [
  { userId: 'student0001', name: '김민준', grade: '중2', examPin: '0001' },
  { userId: 'student0002', name: '이서연', grade: '중2', examPin: '0002' },
  { userId: 'student0003', name: '박도윤', grade: '중3', examPin: '0003' },
  { userId: 'student0004', name: '최지아', grade: '중1', examPin: '0004' },
  { userId: 'student0005', name: '정우진', grade: '중2', examPin: '0005' },
  { userId: 'student0006', name: '김하은', grade: '중3', examPin: '0006' },
  { userId: 'student0007', name: '이준혁', grade: '중1', examPin: '0007' },
  { userId: 'student0008', name: '박서현', grade: '중2', examPin: '0008' },
];

export function getStudentAccount(userId: string): StudentAccount | null {
  return STUDENT_ACCOUNTS.find((s) => s.userId === userId) ?? null;
}
