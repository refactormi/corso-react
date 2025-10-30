import { useState } from 'react';
import DemoLocalStorage from './DemoLocalStorage';
import DemoPrevious from './DemoPrevious';
import DemoDebouncedValue from './DemoDebouncedValue';
import DemoInterval from './DemoInterval';
import DemoApi from './DemoApi';

const demos = {
  localStorage: { label: 'useLocalStorage', Component: DemoLocalStorage },
  previous: { label: 'usePrevious', Component: DemoPrevious },
  debounced: { label: 'useDebouncedValue', Component: DemoDebouncedValue },
  interval: { label: 'useInterval', Component: DemoInterval },
  api: { label: 'useApi', Component: DemoApi },
};

export default function DemoSwitcher() {
  const [active, setActive] = useState('localStorage');
  const Active = demos[active].Component;
  return (
    <div style={{ border: '1px solid #999', padding: 16, borderRadius: 8 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {Object.entries(demos).map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            style={{
              padding: '6px 10px',
              borderRadius: 6,
              border: active === key ? '2px solid #646cff' : '1px solid #ccc',
              background: active === key ? '#eef' : 'white',
              cursor: 'pointer',
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <Active />
    </div>
  );
}


