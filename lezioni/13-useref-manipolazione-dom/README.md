# Lezione 13: useRef e Manipolazione DOM

## Obiettivi della Lezione

Al termine di questa lezione sarai in grado di:
- Comprendere il concetto di useRef e riferimenti
- Utilizzare useRef per accedere agli elementi DOM
- Gestire valori persistenti tra i render
- Integrare librerie esterne con React
- Manipolare il DOM direttamente quando necessario
- Gestire focus e input programmaticamente
- Evitare errori comuni nell'uso di useRef
- Ottimizzare le performance con useRef

## Teoria

### 1. Cos'è useRef?

#### Concetto Base
`useRef` è un hook di React che restituisce un oggetto ref mutabile la cui proprietà `.current` viene inizializzata con l'argomento passato. L'oggetto restituito persisterà per l'intera durata del componente.

```jsx
import { useRef } from 'react';

function MyComponent() {
  const myRef = useRef(initialValue);
  
  // myRef.current contiene il valore corrente
  console.log(myRef.current);
  
  return <div ref={myRef}>Contenuto</div>;
}
```

#### Caratteristiche Principali
- **Persistenza**: Il valore persiste tra i render
- **Mutabilità**: Può essere modificato senza causare re-render
- **Non reattivo**: Le modifiche non triggerano aggiornamenti del componente
- **Versatile**: Può contenere qualsiasi tipo di valore

### 2. Tipi di useRef

#### 1. Ref per Elementi DOM
```jsx
function TextInput() {
  const inputRef = useRef(null);
  
  const focusInput = () => {
    inputRef.current.focus();
  };
  
  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={focusInput}>Focus Input</button>
    </div>
  );
}
```

#### 2. Ref per Valori Persistenti
```jsx
function Counter() {
  const [count, setCount] = useState(0);
  const prevCountRef = useRef();
  
  useEffect(() => {
    prevCountRef.current = count;
  });
  
  const prevCount = prevCountRef.current;
  
  return (
    <div>
      <p>Valore attuale: {count}</p>
      <p>Valore precedente: {prevCount}</p>
      <button onClick={() => setCount(count + 1)}>
        Incrementa
      </button>
    </div>
  );
}
```

#### 3. Ref per Timer e Interval
```jsx
function Timer() {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);
  
  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
  };
  
  const stopTimer = () => {
    clearInterval(intervalRef.current);
  };
  
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  return (
    <div>
      <p>Secondi: {seconds}</p>
      <button onClick={startTimer}>Avvia</button>
      <button onClick={stopTimer}>Ferma</button>
    </div>
  );
}
```

### 3. Manipolazione DOM con useRef

#### Accesso agli Elementi
```jsx
function DOMManipulation() {
  const divRef = useRef(null);
  const canvasRef = useRef(null);
  
  const changeBackground = () => {
    if (divRef.current) {
      divRef.current.style.backgroundColor = 'lightblue';
      divRef.current.style.padding = '20px';
    }
  };
  
  const drawOnCanvas = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.fillStyle = 'red';
      ctx.fillRect(10, 10, 100, 100);
    }
  };
  
  return (
    <div>
      <div ref={divRef} style={{ border: '1px solid black' }}>
        Elemento DOM
      </div>
      <canvas ref={canvasRef} width={200} height={200}></canvas>
      <button onClick={changeBackground}>Cambia Sfondo</button>
      <button onClick={drawOnCanvas}>Disegna</button>
    </div>
  );
}
```

#### Gestione Focus e Input
```jsx
function FocusManagement() {
  const inputRef = useRef(null);
  const textareaRef = useRef(null);
  
  const focusInput = () => {
    inputRef.current?.focus();
  };
  
  const selectAllText = () => {
    textareaRef.current?.select();
  };
  
  const getInputValue = () => {
    console.log('Valore input:', inputRef.current?.value);
  };
  
  return (
    <div>
      <input ref={inputRef} type="text" placeholder="Input di testo" />
      <textarea ref={textareaRef} placeholder="Textarea"></textarea>
      <button onClick={focusInput}>Focus Input</button>
      <button onClick={selectAllText}>Seleziona Tutto</button>
      <button onClick={getInputValue}>Log Valore</button>
    </div>
  );
}
```

### 4. Integrazione con Librerie Esterne

#### Chart.js
```jsx
import { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

function ChartComponent({ data }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  
  useEffect(() => {
    if (canvasRef.current && data) {
      // Distruggi il chart precedente se esiste
      if (chartRef.current) {
        chartRef.current.destroy();
      }
      
      // Crea nuovo chart
      chartRef.current = new Chart(canvasRef.current, {
        type: 'bar',
        data: {
          labels: data.labels,
          datasets: [{
            label: 'Vendite',
            data: data.values,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
    
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data]);
  
  return <canvas ref={canvasRef}></canvas>;
}
```

#### D3.js
```jsx
import { useRef, useEffect } from 'react';
import * as d3 from 'd3';

function D3Visualization({ data }) {
  const svgRef = useRef(null);
  
  useEffect(() => {
    if (svgRef.current && data) {
      const svg = d3.select(svgRef.current);
      
      // Pulisci il contenuto precedente
      svg.selectAll('*').remove();
      
      // Crea la visualizzazione
      const circles = svg.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', (d, i) => i * 50 + 25)
        .attr('cy', 50)
        .attr('r', d => d.value)
        .attr('fill', 'steelblue');
    }
  }, [data]);
  
  return <svg ref={svgRef} width={400} height={100}></svg>;
}
```

#### Leaflet Maps
```jsx
import { useRef, useEffect } from 'react';
import L from 'leaflet';

function MapComponent({ center, zoom }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  
  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      // Inizializza la mappa
      mapInstanceRef.current = L.map(mapRef.current).setView(center, zoom);
      
      // Aggiungi layer tile
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);
    }
    
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center, zoom]);
  
  return <div ref={mapRef} style={{ height: '400px', width: '100%' }}></div>;
}
```

### 5. Hook Personalizzati con useRef

#### Hook per Media Queries
```jsx
function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);
  const mediaQueryRef = useRef(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      mediaQueryRef.current = window.matchMedia(query);
      setMatches(mediaQueryRef.current.matches);
      
      const handler = (event) => setMatches(event.matches);
      mediaQueryRef.current.addEventListener('change', handler);
      
      return () => {
        if (mediaQueryRef.current) {
          mediaQueryRef.current.removeEventListener('change', handler);
        }
      };
    }
  }, [query]);
  
  return matches;
}

function ResponsiveComponent() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  
  return (
    <div>
      <p>Dispositivo: {isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'}</p>
    </div>
  );
}
```

#### Hook per Intersection Observer
```jsx
function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const elementRef = useRef(null);
  const observerRef = useRef(null);
  
  useEffect(() => {
    if (elementRef.current) {
      observerRef.current = new IntersectionObserver(([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      }, options);
      
      observerRef.current.observe(elementRef.current);
    }
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [options, hasIntersected]);
  
  return [elementRef, isIntersecting, hasIntersected];
}

function LazyLoadComponent() {
  const [ref, isIntersecting, hasIntersected] = useIntersectionObserver({
    threshold: 0.1
  });
  
  return (
    <div ref={ref} style={{ minHeight: '200px', border: '1px solid #ccc' }}>
      {hasIntersected ? (
        <div>
          <h3>Contenuto Caricato</h3>
          <p>Questo contenuto è stato caricato quando è diventato visibile!</p>
        </div>
      ) : (
        <div>Caricamento...</div>
      )}
    </div>
  );
}
```

#### Hook per Resize Observer
```jsx
function useResizeObserver() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const elementRef = useRef(null);
  const observerRef = useRef(null);
  
  useEffect(() => {
    if (elementRef.current) {
      observerRef.current = new ResizeObserver((entries) => {
        const { width, height } = entries[0].contentRect;
        setDimensions({ width, height });
      });
      
      observerRef.current.observe(elementRef.current);
    }
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);
  
  return [elementRef, dimensions];
}

function ResizableComponent() {
  const [ref, dimensions] = useResizeObserver();
  
  return (
    <div ref={ref} style={{ 
      border: '2px solid #007bff', 
      padding: '20px',
      resize: 'both',
      overflow: 'auto'
    }}>
      <h3>Componente Ridimensionabile</h3>
      <p>Dimensioni: {Math.round(dimensions.width)} x {Math.round(dimensions.height)} px</p>
      <p>Ridimensiona questo elemento per vedere le dimensioni aggiornarsi!</p>
    </div>
  );
}
```

### 6. Pattern Avanzati

#### Pattern 1: Forwarding Refs
```jsx
import { forwardRef, useRef, useImperativeHandle } from 'react';

const CustomInput = forwardRef((props, ref) => {
  const inputRef = useRef(null);
  
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
    clear: () => {
      inputRef.current.value = '';
    },
    getValue: () => {
      return inputRef.current.value;
    }
  }));
  
  return <input ref={inputRef} {...props} />;
});

function ParentComponent() {
  const customInputRef = useRef(null);
  
  const handleFocus = () => {
    customInputRef.current.focus();
  };
  
  const handleClear = () => {
    customInputRef.current.clear();
  };
  
  const handleGetValue = () => {
    console.log('Valore:', customInputRef.current.getValue());
  };
  
  return (
    <div>
      <CustomInput ref={customInputRef} placeholder="Input personalizzato" />
      <button onClick={handleFocus}>Focus</button>
      <button onClick={handleClear}>Pulisci</button>
      <button onClick={handleGetValue}>Ottieni Valore</button>
    </div>
  );
}
```

#### Pattern 2: Ref Callback
```jsx
function RefCallbackExample() {
  const [elements, setElements] = useState([]);
  
  const refCallback = (element) => {
    if (element) {
      setElements(prev => [...prev, element]);
    }
  };
  
  const logElements = () => {
    console.log('Elementi raccolti:', elements);
  };
  
  return (
    <div>
      <div ref={refCallback}>Elemento 1</div>
      <div ref={refCallback}>Elemento 2</div>
      <div ref={refCallback}>Elemento 3</div>
      <button onClick={logElements}>Log Elementi</button>
    </div>
  );
}
```

#### Pattern 3: Multiple Refs
```jsx
function MultipleRefsExample() {
  const refs = useRef([]);
  
  const addToRefs = (el) => {
    if (el && !refs.current.includes(el)) {
      refs.current.push(el);
    }
  };
  
  const focusAll = () => {
    refs.current.forEach(ref => {
      if (ref && ref.focus) {
        ref.focus();
      }
    });
  };
  
  const logAllValues = () => {
    refs.current.forEach((ref, index) => {
      console.log(`Input ${index}:`, ref?.value);
    });
  };
  
  return (
    <div>
      <input ref={addToRefs} placeholder="Input 1" />
      <input ref={addToRefs} placeholder="Input 2" />
      <input ref={addToRefs} placeholder="Input 3" />
      <button onClick={focusAll}>Focus Tutti</button>
      <button onClick={logAllValues}>Log Valori</button>
    </div>
  );
}
```

### 7. Gestione Eventi e useRef

#### Event Listeners con useRef
```jsx
function EventListenerExample() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const elementRef = useRef(null);
  
  useEffect(() => {
    const element = elementRef.current;
    
    const handleMouseMove = (e) => {
      setPosition({
        x: e.clientX - element.offsetLeft,
        y: e.clientY - element.offsetTop
      });
    };
    
    if (element) {
      element.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => {
      if (element) {
        element.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);
  
  return (
    <div
      ref={elementRef}
      style={{
        width: '300px',
        height: '200px',
        border: '2px solid #007bff',
        position: 'relative',
        cursor: 'crosshair'
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: position.x - 5,
          top: position.y - 5,
          width: '10px',
          height: '10px',
          backgroundColor: 'red',
          borderRadius: '50%',
          pointerEvents: 'none'
        }}
      />
      <p>Posizione: {position.x}, {position.y}</p>
    </div>
  );
}
```

#### Gestione Scroll
```jsx
function ScrollExample() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef(null);
  
  useEffect(() => {
    const container = containerRef.current;
    
    const handleScroll = () => {
      setScrollPosition(container.scrollTop);
    };
    
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);
  
  const scrollToTop = () => {
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const scrollToBottom = () => {
    containerRef.current?.scrollTo({ 
      top: containerRef.current.scrollHeight, 
      behavior: 'smooth' 
    });
  };
  
  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={scrollToTop}>Scroll to Top</button>
        <button onClick={scrollToBottom}>Scroll to Bottom</button>
        <span>Posizione: {scrollPosition}px</span>
      </div>
      
      <div
        ref={containerRef}
        style={{
          height: '200px',
          overflow: 'auto',
          border: '1px solid #ccc',
          padding: '10px'
        }}
      >
        {Array.from({ length: 50 }, (_, i) => (
          <div key={i} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
            Elemento {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 8. Ottimizzazione e Performance

#### useRef vs useState per Valori Non Reattivi
```jsx
function PerformanceExample() {
  const [count, setCount] = useState(0);
  const renderCountRef = useRef(0);
  const [renderCount, setRenderCount] = useState(0);
  
  // Incrementa il contatore dei render
  renderCountRef.current += 1;
  
  const incrementRenderCount = () => {
    setRenderCount(prev => prev + 1);
  };
  
  return (
    <div>
      <p>Count: {count}</p>
      <p>Render con useRef: {renderCountRef.current}</p>
      <p>Render con useState: {renderCount}</p>
      <button onClick={() => setCount(count + 1)}>Incrementa Count</button>
      <button onClick={incrementRenderCount}>Incrementa Render Count</button>
    </div>
  );
}
```

#### Memoizzazione di Funzioni con useRef
```jsx
function MemoizedFunctionExample() {
  const [count, setCount] = useState(0);
  const expensiveFunctionRef = useRef();
  
  if (!expensiveFunctionRef.current) {
    expensiveFunctionRef.current = () => {
      console.log('Funzione costosa eseguita');
      return Math.random() * 1000;
    };
  }
  
  const handleClick = () => {
    const result = expensiveFunctionRef.current();
    console.log('Risultato:', result);
  };
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Incrementa</button>
      <button onClick={handleClick}>Esegui Funzione Costosa</button>
    </div>
  );
}
```

### 9. Errori Comuni e Best Practices

#### ❌ Errori Comuni

1. **Accedere a ref prima che sia assegnato**
```jsx
// ❌ Errore
function BadExample() {
  const inputRef = useRef(null);
  
  const handleClick = () => {
    inputRef.current.focus(); // Potrebbe essere null
  };
  
  return (
    <div>
      <button onClick={handleClick}>Focus</button>
      <input ref={inputRef} />
    </div>
  );
}
```

2. **Non pulire i ref nei cleanup**
```jsx
// ❌ Errore
function BadCleanup() {
  const intervalRef = useRef(null);
  
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      console.log('Tick');
    }, 1000);
    
    // Manca il cleanup
  }, []);
  
  return <div>Component</div>;
}
```

3. **Usare ref per valori che dovrebbero triggerare re-render**
```jsx
// ❌ Errore
function BadReactiveValue() {
  const countRef = useRef(0);
  
  const increment = () => {
    countRef.current += 1; // Non triggera re-render
  };
  
  return (
    <div>
      <p>Count: {countRef.current}</p> {/* Non si aggiorna */}
      <button onClick={increment}>Incrementa</button>
    </div>
  );
}
```

#### ✅ Best Practices

1. **Controllare sempre se ref.current esiste**
```jsx
// ✅ Corretto
function GoodExample() {
  const inputRef = useRef(null);
  
  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  return (
    <div>
      <button onClick={handleClick}>Focus</button>
      <input ref={inputRef} />
    </div>
  );
}
```

2. **Pulire sempre i ref nei cleanup**
```jsx
// ✅ Corretto
function GoodCleanup() {
  const intervalRef = useRef(null);
  
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      console.log('Tick');
    }, 1000);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  return <div>Component</div>;
}
```

3. **Usare useState per valori reattivi**
```jsx
// ✅ Corretto
function GoodReactiveValue() {
  const [count, setCount] = useState(0);
  
  const increment = () => {
    setCount(prev => prev + 1);
  };
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Incrementa</button>
    </div>
  );
}
```

### 10. Debugging useRef

#### Console Logging
```jsx
function DebugRefExample() {
  const inputRef = useRef(null);
  const [value, setValue] = useState('');
  
  useEffect(() => {
    console.log('Ref current:', inputRef.current);
    console.log('Ref value:', inputRef.current?.value);
  });
  
  const logRefInfo = () => {
    console.log('=== Ref Debug Info ===');
    console.log('Ref exists:', !!inputRef.current);
    console.log('Ref value:', inputRef.current?.value);
    console.log('State value:', value);
    console.log('Ref === State:', inputRef.current?.value === value);
  };
  
  return (
    <div>
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Digita qualcosa"
      />
      <button onClick={logRefInfo}>Debug Ref</button>
    </div>
  );
}
```

#### React DevTools
- Usa React DevTools per ispezionare i ref
- Controlla che i ref siano assegnati correttamente
- Verifica che i cleanup vengano eseguiti

## Esempi Pratici

### Esempio 1: Editor di Testo con useRef
```jsx
function TextEditor() {
  const editorRef = useRef(null);
  const [content, setContent] = useState('');
  const [isBold, setIsBold] = useState(false);
  
  const insertText = (text) => {
    if (editorRef.current) {
      const start = editorRef.current.selectionStart;
      const end = editorRef.current.selectionEnd;
      const newContent = content.substring(0, start) + text + content.substring(end);
      setContent(newContent);
      
      // Ripristina il focus e la selezione
      setTimeout(() => {
        editorRef.current.focus();
        editorRef.current.setSelectionRange(start + text.length, start + text.length);
      }, 0);
    }
  };
  
  const toggleBold = () => {
    if (editorRef.current) {
      const start = editorRef.current.selectionStart;
      const end = editorRef.current.selectionEnd;
      const selectedText = content.substring(start, end);
      
      if (selectedText) {
        const newText = isBold ? selectedText.replace(/\*\*(.*?)\*\*/g, '$1') : `**${selectedText}**`;
        const newContent = content.substring(0, start) + newText + content.substring(end);
        setContent(newContent);
        setIsBold(!isBold);
      }
    }
  };
  
  const getCursorPosition = () => {
    if (editorRef.current) {
      const pos = editorRef.current.selectionStart;
      console.log('Posizione cursore:', pos);
    }
  };
  
  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={() => insertText('Hello')}>Inserisci "Hello"</button>
        <button onClick={toggleBold}>Bold</button>
        <button onClick={getCursorPosition}>Posizione Cursore</button>
      </div>
      
      <textarea
        ref={editorRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{
          width: '100%',
          height: '200px',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}
        placeholder="Inizia a scrivere..."
      />
      
      <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
        Caratteri: {content.length} | Righe: {content.split('\n').length}
      </div>
    </div>
  );
}
```

### Esempio 2: Galleria Immagini con Lazy Loading
```jsx
function ImageGallery({ images }) {
  const [visibleImages, setVisibleImages] = useState([]);
  const observerRef = useRef(null);
  
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            setVisibleImages(prev => {
              if (!prev.includes(index)) {
                return [...prev, index];
              }
              return prev;
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);
  
  const imageRef = useCallback((node) => {
    if (observerRef.current) {
      observerRef.current.observe(node);
    }
  }, []);
  
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
      {images.map((image, index) => (
        <div
          key={index}
          ref={imageRef}
          data-index={index}
          style={{
            height: '200px',
            backgroundColor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            overflow: 'hidden'
          }}
        >
          {visibleImages.includes(index) ? (
            <img
              src={image.url}
              alt={image.alt}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          ) : (
            <div>Caricamento...</div>
          )}
        </div>
      ))}
    </div>
  );
}
```

## Esercizi

### Esercizio 1: Calcolatrice con useRef
Crea una calcolatrice che:
- Usa useRef per gestire l'input
- Implementa operazioni matematiche
- Gestisce la cronologia dei calcoli
- Ha pulsanti per copiare e incollare

### Esercizio 2: Player Video Personalizzato
Implementa un player video che:
- Usa useRef per controllare l'elemento video
- Gestisce play/pause, volume, tempo
- Mostra controlli personalizzati
- Implementa keyboard shortcuts

### Esercizio 3: Drag and Drop con useRef
Crea un sistema drag and drop che:
- Usa useRef per tracciare gli elementi
- Gestisce eventi mouse/touch
- Mostra feedback visivo durante il drag
- Implementa drop zones

## Riepilogo

In questa lezione abbiamo imparato:

- **useRef** per riferimenti persistenti
- **Manipolazione DOM** diretta quando necessario
- **Integrazione librerie esterne** (Chart.js, D3, Leaflet)
- **Hook personalizzati** con useRef
- **Pattern avanzati** (forwarding refs, callback refs)
- **Gestione eventi** e osservatori
- **Ottimizzazione performance** con useRef
- **Best practices** e errori da evitare

useRef è uno strumento potente per:
- Accedere agli elementi DOM
- Mantenere valori persistenti
- Integrare librerie esterne
- Gestire timer e interval
- Ottimizzare le performance

Nella prossima lezione esploreremo useMemo e useCallback per l'ottimizzazione delle performance.
