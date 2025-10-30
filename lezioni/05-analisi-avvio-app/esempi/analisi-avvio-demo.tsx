// Demo Analisi Avvio App - Esempi pratici del flusso di avvio
// Questo file dimostra cosa succede quando viene avviata un'app React

import { useState, useEffect, useRef } from 'react'

interface LifecycleTrackerProps {
  name: string
}

interface ShowComponents {
  lifecycle: boolean
  rendering: boolean
  strictMode: boolean
  virtualDOM: boolean
}

// Componente per tracciare il ciclo di vita
function LifecycleTracker({ name }: LifecycleTrackerProps) {
  const [mounted, setMounted] = useState<boolean>(false)
  const [updates, setUpdates] = useState<number>(0)
  const mountTime = useRef<number | null>(null)
  
  // Simula il mounting
  useEffect(() => {
    mountTime.current = Date.now()
    setMounted(true)
    console.log(`🟢 ${name} - Componente montato`)
    
    return () => {
      console.log(`🔴 ${name} - Componente smontato`)
    }
  }, [name])
  
  // Traccia gli aggiornamenti
  useEffect(() => {
    if (mounted) {
      setUpdates(prev => prev + 1)
      console.log(`🔄 ${name} - Componente aggiornato (${updates + 1} volte)`)
    }
  }, [mounted, name, updates])
  
  const handleUpdate = () => {
    setUpdates(prev => prev + 1)
  }
  
  return (
    <div style={{ 
      border: '2px solid #61dafb', 
      padding: '15px', 
      margin: '10px 0',
      borderRadius: '8px',
      backgroundColor: '#f8f9fa'
    }}>
      <h3>📊 {name} - Lifecycle Tracker</h3>
      <p><strong>Stato:</strong> {mounted ? '✅ Montato' : '⏳ In montaggio'}</p>
      <p><strong>Aggiornamenti:</strong> {updates}</p>
      <p><strong>Tempo di montaggio:</strong> {mountTime.current ? new Date(mountTime.current).toLocaleTimeString() : 'N/A'}</p>
      <button onClick={handleUpdate} style={{ 
        backgroundColor: '#61dafb', 
        color: 'white', 
        border: 'none', 
        padding: '8px 16px', 
        borderRadius: '4px',
        cursor: 'pointer'
      }}>
        Forza Aggiornamento
      </button>
    </div>
  )
}

// Componente per dimostrare il flusso di rendering
function RenderingFlow() {
  const [step, setStep] = useState<number>(0)
  const [logs, setLogs] = useState<string[]>([])
  
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, `[${timestamp}] ${message}`])
  }
  
  useEffect(() => {
    addLog('🚀 RenderingFlow - Componente montato')
    
    return () => {
      addLog('🔴 RenderingFlow - Componente smontato')
    }
  }, [])
  
  useEffect(() => {
    addLog(`🔄 RenderingFlow - Step cambiato a: ${step}`)
  }, [step])
  
  const nextStep = () => {
    setStep(prev => prev + 1)
  }
  
  const reset = () => {
    setStep(0)
    setLogs([])
  }
  
  return (
    <div style={{ 
      border: '2px solid #28a745', 
      padding: '20px', 
      margin: '20px 0',
      borderRadius: '8px',
      backgroundColor: '#d4edda'
    }}>
      <h3>🔄 Flusso di Rendering</h3>
      <p><strong>Step corrente:</strong> {step}</p>
      
      <div style={{ margin: '15px 0' }}>
        <button onClick={nextStep} style={{ 
          backgroundColor: '#28a745', 
          color: 'white', 
          border: 'none', 
          padding: '10px 20px', 
          borderRadius: '4px',
          cursor: 'pointer',
          marginRight: '10px'
        }}>
          Prossimo Step
        </button>
        <button onClick={reset} style={{ 
          backgroundColor: '#dc3545', 
          color: 'white', 
          border: 'none', 
          padding: '10px 20px', 
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Reset
        </button>
      </div>
      
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '15px', 
        borderRadius: '4px',
        maxHeight: '200px',
        overflowY: 'auto'
      }}>
        <h4>📝 Log di Rendering:</h4>
        {logs.map((log, index) => (
          <div key={index} style={{ 
            fontFamily: 'monospace', 
            fontSize: '12px',
            margin: '2px 0',
            color: '#495057'
          }}>
            {log}
          </div>
        ))}
      </div>
    </div>
  )
}

// Componente per dimostrare React.StrictMode
function StrictModeDemo() {
  const [count, setCount] = useState<number>(0)
  const [effects, setEffects] = useState<number>(0)
  
  // Questo useEffect verrà eseguito due volte in StrictMode
  useEffect(() => {
    setEffects(prev => prev + 1)
    console.log('🔍 StrictMode - useEffect eseguito')
  }, [])
  
  const increment = () => {
    setCount(prev => prev + 1)
  }
  
  return (
    <div style={{ 
      border: '2px solid #ffc107', 
      padding: '20px', 
      margin: '20px 0',
      borderRadius: '8px',
      backgroundColor: '#fff3cd'
    }}>
      <h3>⚠️ React.StrictMode Demo</h3>
      <p><strong>Contatore:</strong> {count}</p>
      <p><strong>useEffect eseguito:</strong> {effects} volte</p>
      <p><em>Nota: In StrictMode, useEffect viene eseguito due volte in sviluppo</em></p>
      
      <button onClick={increment} style={{ 
        backgroundColor: '#ffc107', 
        color: '#212529', 
        border: 'none', 
        padding: '10px 20px', 
        borderRadius: '4px',
        cursor: 'pointer'
      }}>
        Incrementa
      </button>
    </div>
  )
}

// Componente per dimostrare il Virtual DOM
function VirtualDOMDemo() {
  const [items, setItems] = useState<string[]>(['Item 1', 'Item 2', 'Item 3'])
  const [renderCount, setRenderCount] = useState<number>(0)
  
  useEffect(() => {
    setRenderCount(prev => prev + 1)
  })
  
  const addItem = () => {
    setItems(prev => [...prev, `Item ${prev.length + 1}`])
  }
  
  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index))
  }
  
  const shuffleItems = () => {
    setItems(prev => [...prev].sort(() => Math.random() - 0.5))
  }
  
  return (
    <div style={{ 
      border: '2px solid #6f42c1', 
      padding: '20px', 
      margin: '20px 0',
      borderRadius: '8px',
      backgroundColor: '#e2e3f1'
    }}>
      <h3>🌐 Virtual DOM Demo</h3>
      <p><strong>Render count:</strong> {renderCount}</p>
      <p><strong>Items:</strong> {items.length}</p>
      
      <div style={{ margin: '15px 0' }}>
        <button onClick={addItem} style={{ 
          backgroundColor: '#6f42c1', 
          color: 'white', 
          border: 'none', 
          padding: '8px 16px', 
          borderRadius: '4px',
          cursor: 'pointer',
          margin: '5px'
        }}>
          Aggiungi Item
        </button>
        <button onClick={shuffleItems} style={{ 
          backgroundColor: '#6f42c1', 
          color: 'white', 
          border: 'none', 
          padding: '8px 16px', 
          borderRadius: '4px',
          cursor: 'pointer',
          margin: '5px'
        }}>
          Mescola Items
        </button>
      </div>
      
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {items.map((item, index) => (
          <li key={item} style={{ 
            backgroundColor: 'white', 
            padding: '10px', 
            margin: '5px 0', 
            borderRadius: '4px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>{item}</span>
            <button onClick={() => removeItem(index)} style={{ 
              backgroundColor: '#dc3545', 
              color: 'white', 
              border: 'none', 
              padding: '5px 10px', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              Rimuovi
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

// Componente principale che combina tutti gli esempi
function AppStartupAnalysis() {
  const [showComponents, setShowComponents] = useState<ShowComponents>({
    lifecycle: true,
    rendering: true,
    strictMode: true,
    virtualDOM: true
  })
  
  const toggleComponent = (component: keyof ShowComponents) => {
    setShowComponents(prev => ({
      ...prev,
      [component]: !prev[component]
    }))
  }
  
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <h1>🔍 Analisi Avvio App React</h1>
      <p>Questa demo mostra cosa succede quando viene avviata un'applicazione React.</p>
      
      <div style={{ 
        backgroundColor: '#e9ecef', 
        padding: '15px', 
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        <h3>🎛️ Controlli</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {Object.entries(showComponents).map(([key, value]) => (
            <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input 
                type="checkbox" 
                checked={value}
                onChange={() => toggleComponent(key as keyof ShowComponents)}
              />
              {key}
            </label>
          ))}
        </div>
      </div>
      
      {showComponents.lifecycle && <LifecycleTracker name="Componente A" />}
      {showComponents.lifecycle && <LifecycleTracker name="Componente B" />}
      
      {showComponents.rendering && <RenderingFlow />}
      
      {showComponents.strictMode && <StrictModeDemo />}
      
      {showComponents.virtualDOM && <VirtualDOMDemo />}
      
      <div style={{ 
        backgroundColor: '#d1ecf1', 
        padding: '20px', 
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        <h3>💡 Istruzioni</h3>
        <ol>
          <li>Apri la console del browser (F12) per vedere i log</li>
          <li>Interagisci con i componenti per vedere il flusso di rendering</li>
          <li>Osserva come React aggiorna solo le parti necessarie</li>
          <li>Nota come StrictMode esegue gli effetti due volte in sviluppo</li>
        </ol>
      </div>
    </div>
  )
}

export default AppStartupAnalysis

