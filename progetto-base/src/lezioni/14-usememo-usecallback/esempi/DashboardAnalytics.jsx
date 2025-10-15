import { useMemo, useState } from 'react';

export default function DashboardAnalytics() {
  const [numItems, setNumItems] = useState(10000);
  const data = useMemo(() => Array.from({ length: numItems }, (_, i) => i + 1), [numItems]);
  const sum = useMemo(() => data.reduce((a, b) => a + b, 0), [data]);

  return (
    <div style={{ padding: 12 }}>
      <h3>Demo useMemo: calcolo somma</h3>
      <p>Elementi: {numItems.toLocaleString()}</p>
      <p>Somma: {sum.toLocaleString()}</p>
      <button onClick={() => setNumItems((x) => x + 10000)}>+10k</button>
      <button onClick={() => setNumItems(10000)} style={{ marginLeft: 8 }}>Reset</button>
    </div>
  );
}
 


