// ═══════════════ VIEWMODEL: 학생 관리 ═══════════════
// 학생 목록의 상태와 CRUD 로직을 담당합니다.
// View는 이 훅이 반환하는 값과 함수만 사용합니다.
import { useCallback } from 'react';
import { INIT_STUDENTS } from '../models/initialData.js';
import { useLocalStorage } from './useLocalStorage.js';

export function useStudentsVM() {
  const [students, setStudents] = useLocalStorage('15q_students_v3', INIT_STUDENTS);

  const addStudent      = useCallback((s)    => setStudents((p) => [...p, { ...s }]),            [setStudents]);
  const addBulkStudents = useCallback((list) => setStudents((p) => [...p, ...list]),              [setStudents]);
  const deleteStudent   = useCallback((id)   => setStudents((p) => p.filter((s) => s.id !== id)), [setStudents]);
  const updateMemo      = useCallback((id, memo) => setStudents((p) => p.map((s) => s.id === id ? { ...s, memo } : s)), [setStudents]);

  return { students, addStudent, addBulkStudents, deleteStudent, updateMemo };
}
