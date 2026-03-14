// ViewModel 공통: localStorage 동기화 훅
// React state와 localStorage를 자동 동기화합니다.
// 모든 VM이 이 훅을 통해 데이터를 영속화합니다.
import { useState, useCallback } from 'react';

export function useLocalStorage(key, init) {
  const [value, setValue] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : init; }
    catch { return init; }
  });

  const save = useCallback((updater) => {
    setValue((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
      return next;
    });
  }, [key]);

  return [value, save];
}
