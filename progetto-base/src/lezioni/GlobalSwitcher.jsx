import DemoSwitcher15 from './15-custom-hooks/DemoSwitcher';
import Demo14 from './14-usememo-usecallback/Demo14';
import Demo16 from './16-introduzione-react-query/Demo16';
import Demo17 from './17-suspense-transizioni/Demo16';
import Demo17a from './17a-esempi-suspense/Demo16a';
import Demo08 from './08-componenti-stateless-stateful/Demo08';
import Demo09 from './09-tecniche-gestione-stato/Demo09';
import Demo10 from './10-passaggio-stato-componenti/Demo10';
import Demo11 from './11-interazione-utente-validazione/Demo11';
import Demo12 from './12-useeffect-ciclo-vita/Demo12';
import Demo13 from './13-useref-dom-performance/Demo13';

function Placeholder({ title }) {
  return (
    <div style={{ border: '1px dashed #bbb', padding: 16, borderRadius: 8 }}>
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      <p>Integrazione demo nel playground in corso (Task 10a.3).</p>
      <p>Consulta la cartella delle lezioni per i file originali.</p>
    </div>
  );
}

const demos = {
  '08 - Componenti stateless/stateful': Demo08,
  '09 - Tecniche gestione stato': Demo09,
  '10 - Passaggio stato tra componenti': Demo10,
  '11 - Interazione utente e validazione': Demo11,
  '12 - useEffect e ciclo di vita': Demo12,
  '13 - useRef e manipolazione DOM / Analisi performance': Demo13,
  '14 - useMemo e useCallback': Demo14,
  '15 - Custom Hooks': DemoSwitcher15,
  '16 - React Query (Introduzione)': Demo16,
  '17 - Suspense e Transitions': Demo17,
  '17a - Esempi Pratici Suspense': Demo17a,
};

import React, { useState } from 'react';

export default function GlobalSwitcher() {
  const entries = Object.entries(demos);
  const [firstLabel, FirstComp] = entries[0];
  const [active, setActive] = useState(firstLabel);
  const ActiveComp = demos[active];

  return (
    <div style={{ border: '1px solid #999', padding: 16, borderRadius: 8 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
        {entries.map(([label]) => (
          <button
            key={label}
            onClick={() => setActive(label)}
            style={{
              padding: '6px 10px',
              borderRadius: 6,
              border: active === label ? '2px solid #646cff' : '1px solid #ccc',
              background: active === label ? '#eef' : 'white',
              cursor: 'pointer',
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <ActiveComp />
    </div>
  );
}


