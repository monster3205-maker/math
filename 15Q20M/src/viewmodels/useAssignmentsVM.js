// ═══════════════ VIEWMODEL: 시험 배정 관리 ═══════════════
import { useCallback } from 'react';
import { INIT_ASSIGNMENTS } from '../models/initialData.js';
import { uid } from '../models/utils.js';
import { useLocalStorage } from './useLocalStorage.js';

export function useAssignmentsVM() {
  const [assignments, setAssignments] = useLocalStorage('15q_assignments_v3', INIT_ASSIGNMENTS);

  const addAssignment = useCallback((a) =>
    setAssignments((p) => [...p, { id: uid(), ...a, assignedAt: new Date().toISOString().split('T')[0], used: false }]),
  [setAssignments]);

  const deleteAssignment   = useCallback((id) => setAssignments((p) => p.filter((a) => a.id !== id)), [setAssignments]);
  const completeAssignment = useCallback((id) => setAssignments((p) => p.map((a) => a.id === id ? { ...a, used: true } : a)), [setAssignments]);

  return { assignments, addAssignment, deleteAssignment, completeAssignment };
}
