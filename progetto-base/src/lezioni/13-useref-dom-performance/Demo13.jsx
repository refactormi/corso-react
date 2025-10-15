import { useRef, useState, useEffect } from 'react';

// Componente per focus automatico
function AutoFocusInput() {
  const inputRef = useRef(null);
  const [value, setValue] = useState('');

  useEffect(() => {
    // Focus automatico al mount
    inputRef.current?.focus();
  }, []);

  const handleReset = () => {
    setValue('');
    inputRef.current?.focus();
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8 }}>
      <h4>Focus Automatico</h4>
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Input con focus automatico"
        style={{ marginRight: 8, padding: 4 }}
      />
      <button onClick={handleReset}>Reset & Focus</button>
      <p>Valore: {value}</p>
    </div>
  );
}

// Componente per scroll to element
function ScrollToElement() {
  const topRef = useRef(null);
  const middleRef = useRef(null);
  const bottomRef = useRef(null);

  const scrollToRef = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8 }}>
      <h4>Scroll to Element</h4>
      
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => scrollToRef(topRef)} style={{ marginRight: 8 }}>
          Top
        </button>
        <button onClick={() => scrollToRef(middleRef)} style={{ marginRight: 8 }}>
          Middle
        </button>
        <button onClick={() => scrollToRef(bottomRef)}>
          Bottom
        </button>
      </div>

      <div style={{ height: 200, overflow: 'auto', border: '1px solid #eee' }}>
        <div ref={topRef} style={{ height: 100, backgroundColor: '#ffebee', padding: 8 }}>
          <strong>TOP SECTION</strong>
          <p>Questa è la sezione superiore del contenuto scrollabile.</p>
        </div>
        
        <div style={{ height: 100, backgroundColor: '#f3e5f5', padding: 8 }}>
          <p>Contenuto intermedio...</p>
        </div>
        
        <div ref={middleRef} style={{ height: 100, backgroundColor: '#e8f5e8', padding: 8 }}>
          <strong>MIDDLE SECTION</strong>
          <p>Questa è la sezione centrale del contenuto.</p>
        </div>
        
        <div style={{ height: 100, backgroundColor: '#fff3e0', padding: 8 }}>
          <p>Altro contenuto...</p>
        </div>
        
        <div ref={bottomRef} style={{ height: 100, backgroundColor: '#e3f2fd', padding: 8 }}>
          <strong>BOTTOM SECTION</strong>
          <p>Questa è la sezione inferiore del contenuto scrollabile.</p>
        </div>
      </div>
    </div>
  );
}

// Componente per misurazioni DOM
function DOMmeasurements() {
  const divRef = useRef(null);
  const [measurements, setMeasurements] = useState({});
  const [content, setContent] = useState('Contenuto iniziale');

  const measureElement = () => {
    if (divRef.current) {
      const rect = divRef.current.getBoundingClientRect();
      setMeasurements({
        width: rect.width,
        height: rect.height,
        top: rect.top,
        left: rect.left,
        scrollWidth: divRef.current.scrollWidth,
        scrollHeight: divRef.current.scrollHeight
      });
    }
  };

  useEffect(() => {
    measureElement();
  }, [content]);

  return (
    <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8 }}>
      <h4>Misurazioni DOM</h4>
      
      <div
        ref={divRef}
        style={{
          border: '2px solid #007bff',
          padding: 16,
          marginBottom: 12,
          backgroundColor: '#f8f9fa',
          minHeight: 50,
          resize: 'both',
          overflow: 'auto'
        }}
      >
        {content}
      </div>

      <div style={{ marginBottom: 12 }}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ width: '100%', height: 60, padding: 4 }}
          placeholder="Modifica il contenuto..."
        />
        <button onClick={measureElement} style={{ marginTop: 4 }}>
          Misura Elemento
        </button>
      </div>

      <div style={{ fontSize: 12, backgroundColor: '#f8f9fa', padding: 8, borderRadius: 4 }}>
        <strong>Misurazioni:</strong>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>Larghezza: {measurements.width?.toFixed(1)}px</li>
          <li>Altezza: {measurements.height?.toFixed(1)}px</li>
          <li>Top: {measurements.top?.toFixed(1)}px</li>
          <li>Left: {measurements.left?.toFixed(1)}px</li>
          <li>Scroll Width: {measurements.scrollWidth}px</li>
          <li>Scroll Height: {measurements.scrollHeight}px</li>
        </ul>
      </div>
    </div>
  );
}

// Componente per contatore senza re-render
function CounterWithoutRerender() {
  const countRef = useRef(0);
  const [displayCount, setDisplayCount] = useState(0);
  const renderCountRef = useRef(0);

  // Incrementa il contatore di render ad ogni render
  renderCountRef.current += 1;

  const incrementRef = () => {
    countRef.current += 1;
    console.log('Ref count:', countRef.current);
  };

  const incrementState = () => {
    setDisplayCount(prev => prev + 1);
  };

  const showRefValue = () => {
    alert(`Valore ref: ${countRef.current}`);
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8 }}>
      <h4>Contatore senza Re-render</h4>
      
      <div style={{ marginBottom: 12 }}>
        <p>Contatore State: {displayCount}</p>
        <p>Numero di render: {renderCountRef.current}</p>
      </div>

      <div style={{ marginBottom: 12 }}>
        <button onClick={incrementRef} style={{ marginRight: 8 }}>
          Incrementa Ref (no re-render)
        </button>
        <button onClick={incrementState} style={{ marginRight: 8 }}>
          Incrementa State (re-render)
        </button>
        <button onClick={showRefValue}>
          Mostra Valore Ref
        </button>
      </div>

      <div style={{ fontSize: 12, backgroundColor: '#fff3cd', padding: 8, borderRadius: 4 }}>
        <strong>Nota:</strong> Il contatore ref non causa re-render. 
        Apri la console per vedere i valori o clicca "Mostra Valore Ref".
      </div>
    </div>
  );
}

// Hook personalizzato per previous value
function usePrevious(value) {
  const ref = useRef();
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
}

// Componente che usa usePrevious
function PreviousValueDemo() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('Mario');
  
  const prevCount = usePrevious(count);
  const prevName = usePrevious(name);

  return (
    <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8 }}>
      <h4>Valore Precedente (Hook Personalizzato)</h4>
      
      <div style={{ marginBottom: 12 }}>
        <div style={{ marginBottom: 8 }}>
          <label>Contatore: </label>
          <button onClick={() => setCount(count - 1)}>-</button>
          <span style={{ margin: '0 8px' }}>{count}</span>
          <button onClick={() => setCount(count + 1)}>+</button>
        </div>
        <div>Valore precedente: {prevCount}</div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ marginBottom: 8 }}>
          <label>Nome: </label>
          <select value={name} onChange={(e) => setName(e.target.value)}>
            <option value="Mario">Mario</option>
            <option value="Luigi">Luigi</option>
            <option value="Peach">Peach</option>
            <option value="Bowser">Bowser</option>
          </select>
        </div>
        <div>Nome precedente: {prevName}</div>
      </div>
    </div>
  );
}

// Componente per performance monitoring
function PerformanceMonitor() {
  const renderCountRef = useRef(0);
  const lastRenderTime = useRef(Date.now());
  const [forceUpdate, setForceUpdate] = useState(0);

  renderCountRef.current += 1;
  const currentTime = Date.now();
  const timeSinceLastRender = currentTime - lastRenderTime.current;
  lastRenderTime.current = currentTime;

  return (
    <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8 }}>
      <h4>Performance Monitor</h4>
      
      <div style={{ marginBottom: 12 }}>
        <p>Numero di render: {renderCountRef.current}</p>
        <p>Tempo dall'ultimo render: {timeSinceLastRender}ms</p>
        <p>Timestamp: {new Date().toLocaleTimeString()}</p>
      </div>

      <button onClick={() => setForceUpdate(prev => prev + 1)}>
        Forza Re-render ({forceUpdate})
      </button>

      <div style={{ fontSize: 12, backgroundColor: '#d1ecf1', padding: 8, borderRadius: 4, marginTop: 8 }}>
        <strong>Info:</strong> useRef mantiene i valori tra i render senza causarne di nuovi.
        Utile per contatori, timer, e riferimenti DOM.
      </div>
    </div>
  );
}

export default function Demo13() {
  return (
    <div style={{ padding: 12 }}>
      <h3>Lezione 13: useRef e Manipolazione DOM</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 16 }}>
        <AutoFocusInput />
        <ScrollToElement />
        <DOMmeasurements />
        <CounterWithoutRerender />
        <PreviousValueDemo />
        <PerformanceMonitor />
      </div>

      <div style={{ marginTop: 20, padding: 12, backgroundColor: '#f8f9fa', borderRadius: 8 }}>
        <h4>Concetti Chiave useRef:</h4>
        <ul style={{ margin: 0 }}>
          <li><strong>Riferimenti DOM:</strong> Accesso diretto agli elementi</li>
          <li><strong>Valori persistenti:</strong> Mantiene valori tra render senza causarne</li>
          <li><strong>Performance:</strong> Evita re-render inutili</li>
          <li><strong>Hook personalizzati:</strong> usePrevious, useInterval, etc.</li>
          <li><strong>Misurazione:</strong> getBoundingClientRect, scroll, focus</li>
        </ul>
      </div>
    </div>
  );
}
