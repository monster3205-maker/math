// VIEW: 정렬 아이콘 + useSortable 훅 (UI 유틸)
import { useState } from 'react';

export function SortIcon({ active, dir }) {
  if (!active) return <span style={{ color: '#C7C7CC', marginLeft: 3 }}>↕</span>;
  return <span style={{ color: 'var(--blue)', marginLeft: 3 }}>{dir === 1 ? '↑' : '↓'}</span>;
}

export function useSortable(initKey = 'date', initDir = -1) {
  const [key, setKey] = useState(initKey);
  const [dir, setDir] = useState(initDir);
  const toggle = (k) => { if (k === key) setDir((d) => -d); else { setKey(k); setDir(-1); } };
  return { key, dir, toggle };
}
