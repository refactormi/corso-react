import { useState } from 'react'
import DemoSwitcher17 from './17-custom-hooks/DemoSwitcher'
import Demo16 from './16-usememo-usecallback/Demo14'
import Demo18 from './18-introduzione-react-query/Demo16'
import Demo19 from './19-suspense-transizioni/Demo16'
import Demo19a from './19a-esempi-suspense/Demo16a'
import Demo08 from './08-componenti-stateless-stateful/Demo08'
import Demo09 from './09-tecniche-gestione-stato/Demo09'
import Demo10 from './10-passaggio-stato-componenti/Demo10'
import Demo11 from './11-interazione-utente-validazione/Demo11'
import Demo12 from './12-useeffect-ciclo-vita/Demo12'
import Demo15 from './15-useref-manipolazione-dom/Demo13'

interface PlaceholderProps {
  title: string
}

function Placeholder({ title }: PlaceholderProps) {
  return (
    <div style={{ border: '1px dashed #bbb', padding: 16, borderRadius: 8 }}>
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      <p>Integrazione demo nel playground in corso (Task 10a.3).</p>
      <p>Consulta la cartella delle lezioni per i file originali.</p>
    </div>
  )
}

type DemoComponent = () => JSX.Element

const demos: Record<string, DemoComponent> = {
  '08 - Componenti stateless/stateful': Demo08,
  '09 - Tecniche gestione stato': Demo09,
  '10 - Passaggio stato tra componenti': Demo10,
  '11 - Interazione utente e validazione': Demo11,
  '12 - useEffect e ciclo di vita': Demo12,
  '15 - useRef e manipolazione DOM': Demo15,
  '16 - useMemo e useCallback': Demo16,
  '17 - Custom Hooks': DemoSwitcher17,
  '18 - React Query (Introduzione)': Demo18,
  '19 - Suspense e Transitions': Demo19,
  '19a - Esempi Pratici Suspense': Demo19a,
}

export default function GlobalSwitcher() {
  const entries = Object.entries(demos)
  const [firstLabel] = entries[0]
  const [active, setActive] = useState<string>(firstLabel)
  const ActiveComp = demos[active]

  const handleButtonClick = (label: string) => {
    setActive(label)
  }

  return (
    <div style={{ border: '1px solid #999', padding: 16, borderRadius: 8 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
        {entries.map(([label]) => (
          <button
            key={label}
            onClick={() => handleButtonClick(label)}
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
  )
}

