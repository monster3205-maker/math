// ═══════════════════════════════════════════════════════════════
// VIEWMODEL: 앱 루트 VM
// 모든 서브 VM을 조합하고, 앱 전체 모드/페이지 상태를 관리합니다.
// App.jsx는 이 훅 하나만 호출하면 됩니다.
//
// mode: 'login' | 'student' | 'admin'
// page: 'dashboard' | 'assign' | 'students' | 'studentDetail'
//       'entry' | 'records' | 'papers' | 'analytics' | 'report'
// ═══════════════════════════════════════════════════════════════
import { useState, useCallback } from 'react';
import { useStudentsVM }    from './useStudentsVM.js';
import { usePapersVM }      from './usePapersVM.js';
import { useRecordsVM }     from './useRecordsVM.js';
import { useAssignmentsVM } from './useAssignmentsVM.js';
import { useDashboardVM }   from './useDashboardVM.js';

export function useAppVM() {
  const [mode, setMode]                   = useState('login');
  const [page, setPage]                   = useState('dashboard');
  const [currentStudent, setCurrentStudent]   = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const studentsVM    = useStudentsVM();
  const papersVM      = usePapersVM();
  const assignmentsVM = useAssignmentsVM();
  const recordsVM     = useRecordsVM(studentsVM.students, papersVM.papers);
  const dashboardVM   = useDashboardVM(studentsVM.students, recordsVM.records, papersVM.papers, assignmentsVM.assignments);

  const onStudentLogin = useCallback((s) => { setCurrentStudent(s); setMode('student'); }, []);
  const onAdminLogin   = useCallback(()  => { setMode('admin'); setPage('dashboard'); }, []);
  const onLogout       = useCallback(()  => { setMode('login'); setCurrentStudent(null); }, []);

  const navigateTo = useCallback((p) => { setPage(p); setSelectedStudent(null); }, []);
  const openStudentDetail = useCallback((s) => { setSelectedStudent(s); setPage('studentDetail'); }, []);

  // 기록 저장 + 배정 완료 연동
  const saveRecord = useCallback((record, assignmentId) => {
    recordsVM.addRecord(record);
    if (assignmentId) assignmentsVM.completeAssignment(assignmentId);
  }, [recordsVM, assignmentsVM]);

  return {
    mode, page, currentStudent, selectedStudent,
    onStudentLogin, onAdminLogin, onLogout, navigateTo, openStudentDetail, saveRecord,
    dashboard: dashboardVM,
    ...studentsVM,
    ...papersVM,
    ...recordsVM,
    ...assignmentsVM,
  };
}
