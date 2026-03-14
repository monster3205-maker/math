// ═══════════════ VIEWMODEL: 시험지 관리 ═══════════════
import { useCallback } from 'react';
import { INIT_PAPERS } from '../models/initialData.js';
import { useLocalStorage } from './useLocalStorage.js';

export function usePapersVM() {
  const [papers, setPapers] = useLocalStorage('15q_papers_v3', INIT_PAPERS);

  const addPaper    = useCallback((p)  => setPapers((prev) => [...prev, { ...p }]),                      [setPapers]);
  const updatePaper = useCallback((p)  => setPapers((prev) => prev.map((x) => x.id === p.id ? p : x)),  [setPapers]);
  const deletePaper = useCallback((id) => setPapers((prev) => prev.filter((p) => p.id !== id)),          [setPapers]);

  return { papers, addPaper, updatePaper, deletePaper };
}
