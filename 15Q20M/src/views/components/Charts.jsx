// VIEW: Chart.js 래퍼 컴포넌트 (렌더링 전용, 상태/로직 없음)
import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

const TIP = { backgroundColor:'#fff', titleColor:'#1D1D1F', bodyColor:'#6E6E73', borderColor:'rgba(0,0,0,.1)', borderWidth:1, padding:11, cornerRadius:9 };

export function LineChart({ labels, datasets, height = 200 }) {
  const ref = useRef(); const inst = useRef();
  useEffect(() => {
    inst.current?.destroy();
    if (!ref.current) return;
    inst.current = new Chart(ref.current, {
      type: 'line',
      data: { labels, datasets: datasets.map((d) => ({
        label: d.label, data: d.data,
        borderColor: d.color || '#007AFF', backgroundColor: (d.color || '#007AFF') + '22',
        borderWidth: 2.5, pointRadius: 4, pointHoverRadius: 6, fill: true, tension: 0.35,
        pointBackgroundColor: '#fff', pointBorderColor: d.color || '#007AFF', pointBorderWidth: 2,
      })) },
      options: { responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: datasets.length > 1, position:'bottom', labels:{ font:{size:12}, color:'#6E6E73', boxWidth:12, padding:14 } }, tooltip: { mode:'index', intersect:false, ...TIP } },
        scales: { x: { grid:{display:false}, ticks:{color:'#6E6E73',font:{size:11}} }, y: { grid:{color:'rgba(0,0,0,.04)'}, ticks:{color:'#6E6E73',font:{size:11}}, beginAtZero:true } },
        interaction: { mode:'nearest', axis:'x', intersect:false } },
    });
    return () => inst.current?.destroy();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(labels), JSON.stringify(datasets)]);
  return <div style={{ position:'relative', height: height+'px', width:'100%' }}><canvas ref={ref}/></div>;
}

export function BarChart({ labels, data, color = '#007AFF', height = 190 }) {
  const ref = useRef(); const inst = useRef();
  useEffect(() => {
    inst.current?.destroy();
    if (!ref.current) return;
    inst.current = new Chart(ref.current, {
      type: 'bar',
      data: { labels, datasets: [{ data, backgroundColor: color+'BB', borderRadius:6, borderSkipped:false }] },
      options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{display:false}, tooltip:{...TIP, padding:10, cornerRadius:8} }, scales:{ x:{grid:{display:false},ticks:{color:'#6E6E73',font:{size:11}}}, y:{grid:{color:'rgba(0,0,0,.04)'},ticks:{color:'#6E6E73',font:{size:11}},beginAtZero:true} } },
    });
    return () => inst.current?.destroy();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(labels), JSON.stringify(data), color]);
  return <div style={{ position:'relative', height: height+'px', width:'100%' }}><canvas ref={ref}/></div>;
}

export function Doughnut({ labels, data, colors, height = 180 }) {
  const ref = useRef(); const inst = useRef();
  useEffect(() => {
    inst.current?.destroy();
    if (!ref.current) return;
    inst.current = new Chart(ref.current, {
      type: 'doughnut',
      data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth:0, hoverOffset:4 }] },
      options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{position:'right', labels:{font:{size:12},color:'#6E6E73',padding:12,boxWidth:12}} }, cutout:'68%' },
    });
    return () => inst.current?.destroy();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(labels), JSON.stringify(data)]);
  return <div style={{ position:'relative', height: height+'px', width:'100%' }}><canvas ref={ref}/></div>;
}
