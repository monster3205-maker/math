// ═══════════════ VIEWMODEL: 시험 기록 관리 ═══════════════
import { useCallback } from 'react';
import { INIT_RECORDS } from '../models/initialData.js';
import { exportCSV as _export } from '../models/utils.js';
import { useLocalStorage } from './useLocalStorage.js';

export function useRecordsVM(students, papers) {
  const [records, setRecords] = useLocalStorage('15q_records_v3', INIT_RECORDS);

  const addRecord    = useCallback((r)  => setRecords((p) => [...p, r]),                          [setRecords]);
  const deleteRecord = useCallback((id) => setRecords((p) => p.filter((r) => r.id !== id)),       [setRecords]);
  const exportCSV    = useCallback(()   => _export(records, students, papers), [records, students, papers]);

  return { records, addRecord, deleteRecord, exportCSV };
}
