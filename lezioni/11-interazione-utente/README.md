# Lezione 11: Interazione Utente e Validazione

## Obiettivi della Lezione

Al termine di questa lezione sarai in grado di:
- Gestire eventi utente in React
- Implementare form handling avanzato
- Creare sistemi di validazione robusti
- Gestire input controllati e non controllati
- Implementare feedback visivo per l'utente
- Gestire stati di loading e errori
- Creare esperienze utente fluide e responsive

## Teoria

### 1. Gestione Eventi in React

React gestisce gli eventi attraverso un sistema chiamato **Synthetic Events** (Eventi Sintetici), che normalizza le differenze tra browser e fornisce un'interfaccia unificata per gestire gli eventi.

#### Eventi Sintetici (Synthetic Events)

**Come Funziona:**
React crea un wrapper attorno agli eventi nativi del browser chiamato `SyntheticEvent`. Questo wrapper:
- Normalizza le differenze tra browser (es. Internet Explorer vs Chrome)
- Fornisce un'interfaccia consistente per tutti gli eventi
- Implementa il pattern di event delegation per migliorare le performance
- Permette di fermare la propagazione e prevenire comportamenti predefiniti

**Vantaggi:**
1. **Consistenza**: Gli eventi funzionano allo stesso modo in tutti i browser
2. **Performance**: React usa event delegation, registrando un solo listener alla radice
3. **Normalizzazione**: Le proprietà degli eventi sono normalizzate tra browser
4. **Type Safety**: TypeScript può tipizzare correttamente gli eventi

**Quando Usare:**
- Sempre quando gestisci eventi in React
- Quando devi prevenire comportamenti predefiniti (es. submit form)
- Quando devi fermare la propagazione degli eventi
- Quando lavori con eventi del DOM standard

**Esempio Pratico Completo:**

```tsx
import { useState } from 'react'

function EventExample(): JSX.Element {
  const [clickCount, setClickCount] = useState<number>(0)
  
  // ✅ Handler per evento click
  // event è un SyntheticEvent tipizzato come React.MouseEvent<HTMLButtonElement>
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // ✅ event è un SyntheticEvent - wrapper attorno all'evento nativo
    console.log('Evento cliccato:', event.type)
    
    // ✅ PreventDefault: previene il comportamento predefinito dell'elemento
    // Utile per link, form, ecc.
    event.preventDefault()
    
    // ✅ StopPropagation: ferma la propagazione dell'evento verso gli elementi padre
    // Utile quando non vuoi che l'evento si propaghi
    event.stopPropagation()
    
    // ✅ Aggiorna lo stato
    setClickCount(prev => prev + 1)
    
    // ✅ Accesso alle proprietà normalizzate dell'evento
    console.log('Coordinata X:', event.clientX)
    console.log('Coordinata Y:', event.clientY)
    console.log('Tasto premuto:', event.button) // 0 = sinistro, 1 = centrale, 2 = destro
  }
  
  // ✅ Handler per evento change in un input
  // event è tipizzato come React.ChangeEvent<HTMLInputElement>
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // ✅ event.target.value contiene il valore corrente dell'input
    console.log('Valore input:', event.target.value)
    
    // ✅ event.target è tipizzato correttamente come HTMLInputElement
    const input = event.target
    console.log('Nome campo:', input.name)
    console.log('Tipo campo:', input.type)
  }
  
  // ✅ Handler per evento submit di un form
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // ✅ Previene il comportamento predefinito (reload della pagina)
    event.preventDefault()
    
    // ✅ Accesso ai dati del form tramite FormData
    const formData = new FormData(event.currentTarget)
    console.log('Dati form:', Object.fromEntries(formData))
  }
  
  // ✅ Handler per evento keyboard
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // ✅ Gestione tasti speciali
    if (event.key === 'Enter') {
      console.log('Enter premuto!')
    }
    if (event.key === 'Escape') {
      console.log('Escape premuto!')
    }
    
    // ✅ Controllo combinazioni di tasti (es. Ctrl+C)
    if (event.ctrlKey && event.key === 'c') {
      event.preventDefault()
      console.log('Ctrl+C premuto!')
    }
  }
  
  return (
    <div>
      <h2>Esempi di Gestione Eventi</h2>
      
      {/* ✅ Gestione evento click */}
      <button onClick={handleClick}>
        Clicca qui (Count: {clickCount})
      </button>
      
      {/* ✅ Gestione evento change */}
      <input 
        onChange={handleInputChange} 
        placeholder="Digita qualcosa"
        style={{ marginLeft: '10px', padding: '8px' }}
      />
      
      {/* ✅ Gestione evento submit */}
      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        <input name="username" placeholder="Username" style={{ padding: '8px', marginRight: '10px' }} />
        <button type="submit">Invia</button>
      </form>
      
      {/* ✅ Gestione evento keyboard */}
      <input 
        onKeyDown={handleKeyDown}
        placeholder="Premi Enter o Escape"
        style={{ marginTop: '10px', padding: '8px', display: 'block' }}
      />
    </div>
  )
}
```

**❌ Anti-Pattern da Evitare:**

```tsx
// ❌ SBAGLIATO: Accedere direttamente agli eventi nativi
function BadEventExample() {
  const handleClick = (event: React.MouseEvent) => {
    // ❌ ERRORE: Non accedere direttamente a event.nativeEvent
    // senza una buona ragione
    const nativeEvent = event.nativeEvent
    console.log(nativeEvent) // Non necessario nella maggior parte dei casi
  }
  
  // ✅ CORRETTO: Usa le proprietà del SyntheticEvent
  const handleClickGood = (event: React.MouseEvent<HTMLButtonElement>) => {
    // ✅ Usa le proprietà normalizzate del SyntheticEvent
    console.log(event.clientX, event.clientY)
  }
  
  return <button onClick={handleClickGood}>Click</button>
}
```

**Note Importanti:**
- **SyntheticEvent vs NativeEvent**: Usa sempre le proprietà del SyntheticEvent a meno che non ti serva qualcosa di specifico del browser
- **Type Safety**: Tipizza sempre gli eventi con TypeScript per sicurezza
- **Event Pooling**: Gli eventi sintetici vengono riutilizzati per performance - non salvare riferimenti agli eventi
- **Propagazione**: Gli eventi si propagano naturalmente - usa `stopPropagation()` solo quando necessario
- **PreventDefault**: Usa `preventDefault()` per prevenire comportamenti predefiniti (es. submit form)

#### Pattern di Gestione Eventi

Esistono diversi pattern per gestire gli eventi in React. Ogni pattern ha i suoi vantaggi e casi d'uso specifici.

**Pattern 1: Handler Inline**

**Come Funziona:**
L'handler viene definito direttamente inline nel JSX usando una arrow function.

**Quando Usare:**
- Per handler molto semplici e brevi
- Quando l'handler non ha bisogno di logica complessa
- Per prototipazione rapida
- Quando l'handler non viene riutilizzato

**Vantaggi:**
- Semplice e diretto
- Nessuna funzione aggiuntiva da definire
- Buono per codice semplice

**Svantaggi:**
- Crea una nuova funzione ad ogni render (problema di performance)
- Difficile da testare isolatamente
- Il codice JSX può diventare verboso

**Esempio:**

```tsx
function InlineHandlers(): JSX.Element {
  const [count, setCount] = useState<number>(0)
  
  return (
    <div>
      {/* ✅ Handler inline: semplice ma crea nuova funzione ad ogni render */}
      <button onClick={() => {
        console.log('Cliccato!')
        setCount(prev => prev + 1)
      }}>
        Handler Inline (Count: {count})
      </button>
      
      {/* ❌ SBAGLIATO: Handler inline troppo complesso */}
      {/* <button onClick={() => {
        // Troppo codice qui rende il JSX difficile da leggere
        const result = someComplexCalculation()
        setState(result)
        doSomethingElse()
      }}> */}
      
      {/* ✅ CORRETTO: Per logica complessa, usa handler separato */}
    </div>
  )
}
```

**Pattern 2: Handler Separato**

**Come Funziona:**
L'handler viene definito come funzione separata nel componente e viene passato come riferimento alla prop dell'evento.

**Quando Usare:**
- Per handler con logica complessa
- Quando l'handler viene riutilizzato
- Quando vuoi testare l'handler separatamente
- Per codice più pulito e leggibile

**Vantaggi:**
- Più leggibile e mantenibile
- La funzione viene creata una sola volta (se usi useCallback)
- Facile da testare
- Codice più organizzato

**Svantaggi:**
- Richiede più codice
- Può essere verboso per handler molto semplici

**Esempio:**

```tsx
import { useState, useCallback } from 'react'

function SeparateHandlers(): JSX.Element {
  const [count, setCount] = useState<number>(0)
  const [message, setMessage] = useState<string>('')
  
  // ✅ Handler separato: più leggibile e riutilizzabile
  const handleClick = useCallback(() => {
    console.log('Cliccato!')
    setCount(prev => prev + 1)
  }, []) // useCallback evita ricreazioni della funzione
  
  // ✅ Handler con logica complessa
  const handleComplexClick = useCallback(() => {
    // Puoi includere logica complessa qui
    const result = count * 2
    setMessage(`Il doppio di ${count} è ${result}`)
    setCount(prev => prev + 1)
  }, [count]) // Dipende da count
  
  // ✅ Handler con validazione
  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (count > 10) {
      alert('Count troppo alto!')
      return
    }
    console.log('Form inviato con count:', count)
  }, [count])
  
  return (
    <div>
      {/* ✅ Passa il riferimento alla funzione, non la chiamata */}
      <button onClick={handleClick}>
        Handler Separato (Count: {count})
      </button>
      
      <button onClick={handleComplexClick} style={{ marginLeft: '10px' }}>
        Handler Complesso
      </button>
      
      {message && <p>{message}</p>}
      
      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        <button type="submit">Invia Form</button>
      </form>
    </div>
  )
}
```

**Pattern 3: Handler con Parametri**

**Come Funziona:**
L'handler accetta parametri e viene chiamato tramite una arrow function inline che passa i parametri.

**Quando Usare:**
- Quando l'handler deve ricevere dati specifici (es. ID, index)
- Quando gestisci liste di elementi (es. map)
- Quando devi passare dati aggiuntivi all'handler
- Quando l'handler è generico e riutilizzabile

**Vantaggi:**
- Flessibile per passare parametri
- Buono per liste e iterazioni
- Permette handler generici riutilizzabili

**Svantaggi:**
- Crea una nuova funzione ad ogni render (problema di performance)
- Può essere verboso

**Esempio:**

```tsx
import { useState } from 'react'

interface Todo {
  id: number
  name: string
  completed: boolean
}

function ParameterizedHandlers(): JSX.Element {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, name: 'Mario', completed: false },
    { id: 2, name: 'Luigi', completed: false },
    { id: 3, name: 'Peach', completed: false }
  ])
  
  // ✅ Handler generico che accetta parametri
  const handleClick = (id: number, name: string) => {
    console.log(`Cliccato item ${id}: ${name}`)
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }
  
  // ✅ Handler con più parametri
  const handleAction = (action: 'add' | 'remove' | 'update', id: number, data?: any) => {
    switch (action) {
      case 'add':
        console.log('Aggiungi:', data)
        break
      case 'remove':
        console.log('Rimuovi:', id)
        setTodos(prev => prev.filter(todo => todo.id !== id))
        break
      case 'update':
        console.log('Aggiorna:', id, data)
        break
    }
  }
  
  return (
    <div>
      <h3>Lista Todo</h3>
      
      {/* ✅ Handler con parametri: usa arrow function per passare i parametri */}
      {todos.map(todo => (
        <div key={todo.id} style={{ marginBottom: '10px' }}>
          <button 
            onClick={() => handleClick(todo.id, todo.name)}
            style={{
              padding: '10px 20px',
              marginRight: '10px',
              backgroundColor: todo.completed ? '#4CAF50' : '#f0f0f0',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {todo.name} {todo.completed ? '✅' : '⏳'}
          </button>
          
          {/* ✅ Handler con più parametri */}
          <button 
            onClick={() => handleAction('remove', todo.id)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Rimuovi
          </button>
        </div>
      ))}
    </div>
  )
}

// ✅ Pattern ottimizzato con useCallback per evitare ricreazioni
function OptimizedHandlers(): JSX.Element {
  const [items, setItems] = useState<string[]>(['Item 1', 'Item 2', 'Item 3'])
  
  // ✅ Usa useCallback per evitare ricreazioni della funzione
  const handleItemClick = useCallback((index: number) => {
    console.log(`Cliccato item all'indice ${index}`)
    setItems(prev => prev.filter((_, i) => i !== index))
  }, [])
  
  return (
    <div>
      {items.map((item, index) => (
        <button 
          key={index}
          onClick={() => handleItemClick(index)}
        >
          {item}
        </button>
      ))}
    </div>
  )
}
```

**❌ Anti-Pattern da Evitare:**

```tsx
// ❌ SBAGLIATO: Chiamare la funzione invece di passare il riferimento
function BadHandlers() {
  const handleClick = () => {
    console.log('Cliccato!')
  }
  
  return (
    <div>
      {/* ❌ ERRORE: handleClick() viene chiamato immediatamente al render! */}
      <button onClick={handleClick()}>Click</button>
      
      {/* ✅ CORRETTO: Passa il riferimento, non la chiamata */}
      <button onClick={handleClick}>Click</button>
    </div>
  )
}

// ❌ SBAGLIATO: Handler inline troppo complesso
function BadInlineHandler() {
  return (
    <button onClick={() => {
      // ❌ ERRORE: Troppo codice inline rende il JSX difficile da leggere
      const result = someComplexCalculation()
      setState(result)
      doSomethingElse()
      if (condition) {
        doMoreThings()
      }
    }}>
      Click
    </button>
  )
}

// ✅ CORRETTO: Estrai handler complessi in funzione separata
function GoodHandler() {
  const handleClick = useCallback(() => {
    const result = someComplexCalculation()
    setState(result)
    doSomethingElse()
    if (condition) {
      doMoreThings()
    }
  }, [dependencies])
  
  return <button onClick={handleClick}>Click</button>
}
```

**Confronto dei Pattern:**

| Pattern | Quando Usare | Vantaggi | Svantaggi |
|---------|--------------|----------|-----------|
| **Handler Inline** | Handler semplici, prototipazione | Veloce da scrivere | Performance, difficile da testare |
| **Handler Separato** | Logica complessa, riutilizzabilità | Leggibile, testabile | Più verboso |
| **Handler con Parametri** | Liste, dati dinamici | Flessibile | Performance (crea nuove funzioni) |

**Note Importanti:**
- **useCallback**: Usa `useCallback` per handler separati che vengono passati a componenti figli per evitare re-render inutili
- **Riferimenti vs Chiamate**: Passa sempre il riferimento alla funzione (`onClick={handleClick}`), non la chiamata (`onClick={handleClick()}`)
- **Performance**: Handler inline creano nuove funzioni ad ogni render - considera `useCallback` per ottimizzare
- **Testabilità**: Handler separati sono più facili da testare isolatamente
- **Leggibilità**: Estrai handler complessi in funzioni separate per mantenere il JSX pulito

### 2. Form Handling

Il form handling è una parte fondamentale dell'interazione utente. React offre due approcci principali: **input controllati** e **input non controllati**.

#### Input Controllati vs Non Controllati

**Differenza Fondamentale:**
- **Input Controllati**: React controlla completamente il valore dell'input attraverso lo stato
- **Input Non Controllati**: Il DOM controlla il valore dell'input direttamente

**Input Controllati:**

**Come Funziona:**
Un input controllato ha il suo valore gestito completamente da React tramite lo stato. Il valore viene passato come prop `value` e ogni cambiamento viene gestito tramite `onChange`.

**Quando Usare:**
- Quando devi validare in tempo reale
- Quando devi sincronizzare l'input con altri componenti
- Quando devi controllare il valore programmaticamente
- Per la maggior parte dei casi d'uso
- Quando vuoi feedback immediato all'utente

**Vantaggi:**
1. **Controllo completo**: Hai controllo totale sul valore
2. **Validazione in tempo reale**: Puoi validare mentre l'utente digita
3. **Sincronizzazione**: Puoi sincronizzare con altri componenti o stato
4. **Prevedibilità**: Il valore è sempre sincronizzato con lo stato
5. **Testabilità**: Più facile da testare

**Svantaggi:**
- Leggermente più verboso
- Ogni cambiamento causa un re-render

**Esempio Pratico Completo:**

```tsx
import { useState } from 'react'

// ✅ INPUT CONTROLLATO: React gestisce completamente il valore
function ControlledInput(): JSX.Element {
  // ✅ Stato che controlla il valore dell'input
  const [value, setValue] = useState<string>('')
  
  // ✅ Handler che aggiorna lo stato quando l'utente digita
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // ✅ Aggiorna lo stato, che causa un re-render con il nuovo valore
    setValue(event.target.value)
  }
  
  // ✅ Funzione per controllare programmaticamente il valore
  const handleReset = () => {
    setValue('') // ✅ Puoi modificare il valore dall'esterno
  }
  
  // ✅ Validazione in tempo reale
  const isValid = value.length >= 3
  const errorMessage = value.length > 0 && value.length < 3 
    ? 'Il valore deve essere di almeno 3 caratteri' 
    : ''
  
  return (
    <div>
      {/* ✅ INPUT CONTROLLATO: value e onChange sono collegati allo stato */}
      <input
        type="text"
        value={value}                    // ✅ Il valore viene da React state
        onChange={handleChange}          // ✅ Ogni cambiamento aggiorna lo stato
        placeholder="Input controllato"
        style={{
          padding: '10px',
          border: errorMessage ? '2px solid red' : '1px solid #ddd',
          borderRadius: '4px',
          width: '300px'
        }}
      />
      
      {/* ✅ Feedback visivo basato sul valore controllato */}
      {errorMessage && (
        <p style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>
          {errorMessage}
        </p>
      )}
      
      {isValid && (
        <p style={{ color: 'green', fontSize: '12px', marginTop: '5px' }}>
          ✓ Valore valido!
        </p>
      )}
      
      {/* ✅ Controllo programmatico del valore */}
      <button 
        onClick={handleReset}
        style={{
          marginTop: '10px',
          padding: '8px 16px',
          backgroundColor: '#f44336',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Reset
      </button>
      
      {/* ✅ Il valore è sempre sincronizzato con lo stato */}
      <p style={{ marginTop: '10px' }}>
        Valore corrente: <strong>{value || '(vuoto)'}</strong>
      </p>
    </div>
  )
}

// ✅ Esempio avanzato: Input controllato con trasformazione
function ControlledInputWithTransform(): JSX.Element {
  const [value, setValue] = useState<string>('')
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // ✅ Puoi trasformare il valore prima di salvarlo nello stato
    const inputValue = event.target.value
    
    // Esempio: converte tutto in maiuscolo
    const transformedValue = inputValue.toUpperCase()
    
    setValue(transformedValue)
  }
  
  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      placeholder="Tutto in maiuscolo"
    />
  )
}
```

**Input Non Controllati:**

**Come Funziona:**
Un input non controllato lascia che il DOM gestisca direttamente il valore. React accede al valore tramite un `ref` quando necessario (es. al submit del form).

**Quando Usare:**
- Per input semplici dove non serve validazione in tempo reale
- Quando lavori con librerie di terze parti che gestiscono il DOM
- Per performance quando hai molti input (meno re-render)
- Per form semplici dove accedi ai valori solo al submit
- Quando integri con codice non-React

**Vantaggi:**
1. **Performance**: Meno re-render (React non aggiorna ad ogni keystroke)
2. **Semplicità**: Meno codice per input semplici
3. **Integrazione**: Facile integrare con librerie esterne
4. **Comportamento nativo**: Il DOM gestisce il valore nativamente

**Svantaggi:**
- Nessun controllo sul valore durante la digitazione
- Nessuna validazione in tempo reale
- Difficile sincronizzare con altri componenti
- Accesso al valore solo tramite ref

**Esempio Pratico Completo:**

```tsx
import { useRef } from 'react'

// ✅ INPUT NON CONTROLLATO: Il DOM gestisce il valore direttamente
function UncontrolledInput(): JSX.Element {
  // ✅ useRef per accedere all'elemento DOM direttamente
  const inputRef = useRef<HTMLInputElement>(null)
  
  // ✅ Accesso al valore solo quando necessario (es. al submit)
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    // ✅ Accedi al valore tramite ref.current
    const value = inputRef.current?.value
    console.log('Valore:', value)
    
    // ✅ Puoi leggere il valore ma non controllarlo direttamente
    if (value && value.length < 3) {
      alert('Il valore deve essere di almeno 3 caratteri')
      return
    }
    
    // ✅ Puoi anche modificare il valore tramite ref
    if (inputRef.current) {
      inputRef.current.value = '' // Reset dopo submit
    }
  }
  
  // ✅ Funzione per accedere al valore quando necessario
  const handleGetValue = () => {
    const value = inputRef.current?.value
    alert(`Valore corrente: ${value || '(vuoto)'}`)
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {/* ✅ INPUT NON CONTROLLATO: nessun value prop, solo ref */}
      <input
        ref={inputRef}              // ✅ Ref per accedere al DOM element
        type="text"
        placeholder="Input non controllato"
        style={{
          padding: '10px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          width: '300px'
        }}
      />
      
      <div style={{ marginTop: '10px' }}>
        <button type="submit">
          Invia
        </button>
        
        <button 
          type="button"
          onClick={handleGetValue}
          style={{ marginLeft: '10px' }}
        >
          Leggi Valore
        </button>
      </div>
    </form>
  )
}

// ✅ Esempio avanzato: Form con multiple input non controllati
interface FormData {
  name: string
  email: string
  message: string
}

function UncontrolledForm(): JSX.Element {
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    // ✅ Raccogli tutti i valori dai ref
    const formData: FormData = {
      name: nameRef.current?.value || '',
      email: emailRef.current?.value || '',
      message: messageRef.current?.value || ''
    }
    
    console.log('Dati form:', formData)
    
    // ✅ Validazione dopo aver raccolto i valori
    if (!formData.name || !formData.email) {
      alert('Compila tutti i campi obbligatori')
      return
    }
    
    // ✅ Invia i dati
    // handleSubmitToServer(formData)
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '15px' }}>
        <label>
          Nome:
          <input
            ref={nameRef}
            type="text"
            placeholder="Nome"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </label>
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <label>
          Email:
          <input
            ref={emailRef}
            type="email"
            placeholder="Email"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </label>
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <label>
          Messaggio:
          <textarea
            ref={messageRef}
            placeholder="Messaggio"
            rows={4}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </label>
      </div>
      
      <button type="submit">
        Invia
      </button>
    </form>
  )
}
```

**❌ Anti-Pattern da Evitare:**

```tsx
// ❌ SBAGLIATO: Mixare controllato e non controllato
function BadMixedInput() {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  
  return (
    <input
      value={value}              // ❌ ERRORE: Controllato...
      ref={inputRef}             // ❌ ...e non controllato insieme!
      onChange={(e) => setValue(e.target.value)}
    />
  )
}

// ✅ CORRETTO: Scegli un approccio
// Opzione 1: Solo controllato
function GoodControlled() {
  const [value, setValue] = useState('')
  return <input value={value} onChange={(e) => setValue(e.target.value)} />
}

// Opzione 2: Solo non controllato
function GoodUncontrolled() {
  const ref = useRef<HTMLInputElement>(null)
  return <input ref={ref} />
}

// ❌ SBAGLIATO: Modificare ref.current.value direttamente in input controllato
function BadControlled() {
  const [value, setValue] = useState('')
  const ref = useRef<HTMLInputElement>(null)
  
  const handleSomething = () => {
    // ❌ ERRORE: Non modificare direttamente il DOM in input controllato!
    if (ref.current) {
      ref.current.value = 'Nuovo valore' // React perderà il controllo
    }
  }
  
  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      ref={ref}
    />
  )
}
```

**Confronto: Controllato vs Non Controllato**

| Caratteristica | Controllato | Non Controllato |
|----------------|-------------|-----------------|
| **Gestione valore** | React (state) | DOM (nativo) |
| **Validazione in tempo reale** | ✅ Sì | ❌ No |
| **Re-render** | Ad ogni cambio | Solo quando necessario |
| **Accesso valore** | Da state | Da ref |
| **Controllo programmatico** | ✅ Sì | ❌ Limitato |
| **Sincronizzazione** | ✅ Facile | ❌ Difficile |
| **Performance** | Più re-render | Meno re-render |
| **Complessità** | Maggiore | Minore |

**Note Importanti:**
- **Preferisci input controllati**: Per la maggior parte dei casi, usa input controllati per maggiore controllo e prevedibilità
- **Non mischiare**: Non usare sia `value` che `ref` sullo stesso input - scegli un approccio
- **Performance**: Input non controllati possono essere più performanti con molti input, ma il vantaggio è minimo nella maggior parte dei casi
- **Validazione**: Input controllati permettono validazione in tempo reale, input non controllati solo al submit
- **Accessibilità**: Entrambi gli approcci funzionano con screen reader e accessibilità
- **Default values**: Per input non controllati, usa `defaultValue` invece di `value`

#### Form Complesso con Validazione

La gestione di form complessi richiede un approccio strutturato per gestire valori, errori, touched state e validazione. Questo pattern è fondamentale per creare form robusti e user-friendly.

**Come Funziona:**
Il pattern gestisce tre stati principali:
1. **FormData**: I valori correnti del form
2. **Errors**: Gli errori di validazione per ogni campo
3. **Touched**: Indica quali campi sono stati interagiti dall'utente

**Quando Usare:**
- Per form con più campi
- Quando serve validazione in tempo reale
- Quando vuoi migliorare l'UX con feedback immediato
- Per form di registrazione, login, contatti, ecc.
- Quando serve validazione complessa con dipendenze tra campi

**Vantaggi:**
1. **UX migliore**: Validazione in tempo reale con feedback immediato
2. **Meno frustrazione**: L'utente vede gli errori prima di inviare
3. **Validazione strutturata**: Logica di validazione centralizzata
4. **Stato gestito**: Tutti gli stati del form in un unico posto
5. **Manutenibilità**: Codice organizzato e facile da modificare

**Esempio Pratico Completo:**

```tsx
import { useState } from 'react'

// ✅ Definizione delle interfacce per type safety
interface FormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  terms: boolean
}

interface FormErrors {
  [key: string]: string  // Mappa nome campo -> messaggio errore
}

interface FormTouched {
  [key: string]: boolean  // Mappa nome campo -> è stato toccato?
}

function AdvancedForm(): JSX.Element {
  // ✅ STATO PRINCIPALE: Valori del form
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false
  })
  
  // ✅ STATO ERRORI: Messaggi di errore per ogni campo
  const [errors, setErrors] = useState<FormErrors>({})
  
  // ✅ STATO TOUCHED: Traccia quali campi sono stati toccati dall'utente
  // Mostriamo errori solo dopo che l'utente ha interagito con il campo
  const [touched, setTouched] = useState<FormTouched>({})
  
  // ✅ FUNZIONE DI VALIDAZIONE: Centralizza tutta la logica di validazione
  // Ritorna una stringa vuota se valido, altrimenti il messaggio di errore
  const validateField = (name: string, value: any): string => {
    switch (name) {
      case 'name':
        // Validazione: nome deve essere di almeno 2 caratteri
        if (value.length < 2) {
          return 'Nome deve essere di almeno 2 caratteri'
        }
        if (value.length > 50) {
          return 'Nome non può superare i 50 caratteri'
        }
        return ''
        
      case 'email':
        // Validazione: formato email valido
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          return 'Email non valida'
        }
        return ''
        
      case 'password':
        // Validazione: password deve essere di almeno 8 caratteri
        if (value.length < 8) {
          return 'Password deve essere di almeno 8 caratteri'
        }
        // Validazione: password deve contenere almeno una maiuscola, una minuscola e un numero
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          return 'Password deve contenere almeno una maiuscola, una minuscola e un numero'
        }
        return ''
        
      case 'confirmPassword':
        // Validazione: password di conferma deve corrispondere alla password
        if (value !== formData.password) {
          return 'Le password non coincidono'
        }
        return ''
        
      case 'terms':
        // Validazione: checkbox terms deve essere selezionata
        if (!value) {
          return 'Devi accettare i termini e condizioni'
        }
        return ''
        
      default:
        return ''
    }
  }
  
  // ✅ HANDLER CHANGE: Gestisce i cambiamenti nei campi del form
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target
    
    // ✅ Gestisce sia input text che checkbox
    const fieldValue = type === 'checkbox' ? checked : value
    
    // ✅ Aggiorna i valori del form
    setFormData(prev => ({
      ...prev,
      [name]: fieldValue
    }))
    
    // ✅ Validazione in tempo reale: valida solo se il campo è stato toccato
    // Questo evita di mostrare errori prima che l'utente abbia iniziato a digitare
    if (touched[name]) {
      const error = validateField(name, fieldValue)
      setErrors(prev => ({
        ...prev,
        [name]: error
      }))
    }
  }
  
  // ✅ HANDLER BLUR: Gestisce quando l'utente esce da un campo
  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target
    const fieldValue = type === 'checkbox' ? checked : value
    
    // ✅ Marca il campo come "touched" quando l'utente esce
    setTouched(prev => ({ ...prev, [name]: true }))
    
    // ✅ Valida il campo quando l'utente esce
    const error = validateField(name, fieldValue)
    setErrors(prev => ({
      ...prev,
      [name]: error
    }))
  }
  
  // ✅ HANDLER SUBMIT: Gestisce l'invio del form
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    // ✅ Validazione completa: valida tutti i campi prima di inviare
    const newErrors: FormErrors = {}
    Object.keys(formData).forEach(name => {
      const error = validateField(name, formData[name as keyof FormData])
      if (error) {
        newErrors[name] = error
      }
    })
    
    // ✅ Aggiorna gli errori e marca tutti i campi come touched
    setErrors(newErrors)
    setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}))
    
    // ✅ Se non ci sono errori, il form è valido
    if (Object.keys(newErrors).length === 0) {
      console.log('Form valido:', formData)
      // ✅ Qui invieresti i dati al server
      // await submitForm(formData)
    } else {
      console.log('Form non valido:', newErrors)
    }
  }
  
  // ✅ Calcola se il form è valido (nessun errore)
  const isValid = Object.keys(errors).every(key => !errors[key])
  
  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h2>Registrazione</h2>
      
      {/* ✅ CAMPO NOME */}
      <div style={{ marginBottom: '15px' }}>
        <label>
          Nome:
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Nome"
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '5px',
              border: errors.name && touched.name ? '2px solid red' : '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </label>
        {/* ✅ Mostra errore solo se il campo è stato toccato */}
        {errors.name && touched.name && (
          <span style={{ color: 'red', fontSize: '12px', display: 'block', marginTop: '5px' }}>
            {errors.name}
          </span>
        )}
      </div>
      
      {/* ✅ CAMPO EMAIL */}
      <div style={{ marginBottom: '15px' }}>
        <label>
          Email:
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Email"
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '5px',
              border: errors.email && touched.email ? '2px solid red' : '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </label>
        {errors.email && touched.email && (
          <span style={{ color: 'red', fontSize: '12px', display: 'block', marginTop: '5px' }}>
            {errors.email}
          </span>
        )}
      </div>
      
      {/* ✅ CAMPO PASSWORD */}
      <div style={{ marginBottom: '15px' }}>
        <label>
          Password:
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Password"
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '5px',
              border: errors.password && touched.password ? '2px solid red' : '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </label>
        {errors.password && touched.password && (
          <span style={{ color: 'red', fontSize: '12px', display: 'block', marginTop: '5px' }}>
            {errors.password}
          </span>
        )}
      </div>
      
      {/* ✅ CAMPO CONFERMA PASSWORD */}
      <div style={{ marginBottom: '15px' }}>
        <label>
          Conferma Password:
          <input
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Conferma Password"
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '5px',
              border: errors.confirmPassword && touched.confirmPassword ? '2px solid red' : '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </label>
        {errors.confirmPassword && touched.confirmPassword && (
          <span style={{ color: 'red', fontSize: '12px', display: 'block', marginTop: '5px' }}>
            {errors.confirmPassword}
          </span>
        )}
      </div>
      
      {/* ✅ CHECKBOX TERMINI */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input
            name="terms"
            type="checkbox"
            checked={formData.terms}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{ marginRight: '8px', cursor: 'pointer' }}
          />
          Accetto i termini e condizioni
        </label>
        {errors.terms && touched.terms && (
          <span style={{ color: 'red', fontSize: '12px', display: 'block', marginTop: '5px' }}>
            {errors.terms}
          </span>
        )}
      </div>
      
      {/* ✅ PULSANTE SUBMIT */}
      <button
        type="submit"
        disabled={!isValid}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: isValid ? '#4CAF50' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '16px',
          cursor: isValid ? 'pointer' : 'not-allowed'
        }}
      >
        Registrati
      </button>
      
      {/* ✅ Debug: mostra lo stato del form */}
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px', fontSize: '12px' }}>
        <strong>Debug:</strong>
        <pre style={{ margin: '5px 0', fontSize: '11px' }}>
          Valid: {isValid ? '✓' : '✗'}<br />
          Touched: {Object.keys(touched).filter(k => touched[k]).join(', ') || 'nessuno'}<br />
          Errors: {Object.keys(errors).filter(k => errors[k]).length || 'nessuno'}
        </pre>
      </div>
    </form>
  )
}
```

**❌ Anti-Pattern da Evitare:**

```tsx
// ❌ SBAGLIATO: Validare solo al submit senza feedback in tempo reale
function BadForm() {
  const [formData, setFormData] = useState({ name: '', email: '' })
  const [errors, setErrors] = useState({})
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // ❌ ERRORE: Validazione solo al submit - UX pessima!
    const newErrors: any = {}
    if (!formData.name) newErrors.name = 'Nome richiesto'
    if (!formData.email) newErrors.email = 'Email richiesta'
    setErrors(newErrors)
    // ...
  }
  
  // ❌ Nessuna validazione durante la digitazione
  return <form onSubmit={handleSubmit}>...</form>
}

// ✅ CORRETTO: Validazione in tempo reale con touched state
function GoodForm() {
  const [formData, setFormData] = useState({ name: '', email: '' })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  
  const handleBlur = (e: React.FocusEvent) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }))
    // Valida quando l'utente esce dal campo
    validateField(e.target.name, e.target.value)
  }
  
  // ✅ Validazione in tempo reale dopo che l'utente ha toccato il campo
  // ...
}
```

**Note Importanti:**
- **Touched State**: Usa lo stato `touched` per mostrare errori solo dopo che l'utente ha interagito con il campo - migliora l'UX
- **Validazione in tempo reale**: Valida i campi mentre l'utente digita dopo che sono stati toccati (`onBlur` o dopo `touched`)
- **Validazione al submit**: Valida sempre tutti i campi al submit, anche se non sono stati toccati
- **Feedback visivo**: Usa bordi colorati e messaggi di errore chiari per guidare l'utente
- **Accessibilità**: Associa sempre gli errori ai campi con `aria-describedby` e `aria-invalid`
- **Reset form**: Implementa sempre una funzione di reset per pulire il form dopo submit riuscito

### 3. Validazione Avanzata

Per evitare di duplicare la logica di validazione in ogni componente, è utile creare un **custom hook** che gestisca la validazione in modo riutilizzabile e strutturato.

#### Hook Personalizzato per Validazione

**Come Funziona:**
Un custom hook per validazione estrae tutta la logica di gestione form (valori, errori, touched state, validazione) in un hook riutilizzabile. Questo permette di usare la stessa logica in più componenti senza duplicazione.

**Quando Usare:**
- Quando hai più form nella stessa applicazione
- Quando vuoi riutilizzare la logica di validazione
- Quando vuoi separare la logica dalla presentazione
- Quando vuoi testare la validazione isolatamente
- Quando hai bisogno di validazione complessa con dipendenze tra campi

**Vantaggi:**
1. **Riutilizzabilità**: La stessa logica può essere usata in più componenti
2. **Separazione delle responsabilità**: Logica separata dalla presentazione
3. **Testabilità**: Il hook può essere testato indipendentemente
4. **Manutenibilità**: Modifiche alla logica di validazione in un unico posto
5. **Flessibilità**: Puoi definire regole di validazione complesse

**Esempio Pratico Completo:**

```tsx
import { useState } from 'react'

// ✅ TIPO: Regola di validazione
// Una regola è una funzione che riceve il valore e tutti i valori del form
// e ritorna una stringa di errore (vuota se valido)
type ValidationRule<T = any> = (value: any, allValues?: T) => string

// ✅ TIPO: Regole di validazione per ogni campo
// Ogni campo può avere multiple regole di validazione
interface ValidationRules<T = any> {
  [key: string]: ValidationRule<T>[]  // nome campo -> array di regole
}

// ✅ INTERFACCIA: Tipo di ritorno del hook
interface UseValidationReturn<T> {
  values: T                              // Valori correnti del form
  errors: Record<string, string>         // Errori per ogni campo
  touched: Record<string, boolean>       // Campi toccati
  setValue: (name: string, value: any) => void  // Funzione per aggiornare un valore
  setFieldTouched: (name: string) => void        // Funzione per marcare un campo come touched
  validateAll: () => boolean             // Funzione per validare tutti i campi
  reset: () => void                      // Funzione per resettare il form
  isValid: boolean                       // Se il form è valido
}

// ✅ CUSTOM HOOK: useValidation
// Gestisce valori, errori, touched state e validazione in modo riutilizzabile
function useValidation<T extends Record<string, any>>(
  initialValues: T,
  validationRules: ValidationRules<T>
): UseValidationReturn<T> {
  // ✅ STATO: Valori del form
  const [values, setValues] = useState<T>(initialValues)
  
  // ✅ STATO: Errori di validazione
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  // ✅ STATO: Campi toccati dall'utente
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  
  // ✅ FUNZIONE: Valida un singolo campo
  // Applica tutte le regole di validazione per il campo e ritorna il primo errore trovato
  const validateField = (name: string, value: any): string => {
    const rules = validationRules[name]
    if (!rules) return ''  // Nessuna regola per questo campo
    
    // ✅ Applica tutte le regole finché non trova un errore
    for (const rule of rules) {
      const error = rule(value, values)  // Passa anche tutti i valori per validazioni dipendenti
      if (error) return error            // Ritorna il primo errore trovato
    }
    return ''  // Nessun errore trovato
  }
  
  // ✅ FUNZIONE: Aggiorna un valore del form
  const setValue = (name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }))
    
    // ✅ Validazione in tempo reale: valida solo se il campo è stato toccato
    if (touched[name]) {
      const error = validateField(name, value)
      setErrors(prev => ({ ...prev, [name]: error }))
    }
  }
  
  // ✅ FUNZIONE: Marca un campo come "touched"
  const setFieldTouched = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }))
    // ✅ Valida immediatamente quando il campo viene toccato
    const error = validateField(name, values[name])
    setErrors(prev => ({ ...prev, [name]: error }))
  }
  
  // ✅ FUNZIONE: Valida tutti i campi
  const validateAll = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    // ✅ Applica la validazione a tutti i campi con regole
    Object.keys(validationRules).forEach(name => {
      const error = validateField(name, values[name])
      if (error) {
        newErrors[name] = error
      }
    })
    
    // ✅ Aggiorna gli errori e marca tutti i campi come touched
    setErrors(newErrors)
    setTouched(Object.keys(validationRules).reduce((acc, key) => ({ ...acc, [key]: true }), {}))
    
    // ✅ Ritorna true se non ci sono errori
    return Object.keys(newErrors).length === 0
  }
  
  // ✅ FUNZIONE: Resetta il form ai valori iniziali
  const reset = () => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }
  
  // ✅ Calcola se il form è valido (nessun errore)
  const isValid = Object.keys(errors).every(key => !errors[key])
  
  return {
    values,           // Valori correnti del form
    errors,           // Errori di validazione
    touched,          // Campi toccati
    setValue,         // Funzione per aggiornare un valore
    setFieldTouched,  // Funzione per marcare un campo come touched
    validateAll,      // Funzione per validare tutti i campi
    reset,            // Funzione per resettare il form
    isValid           // Se il form è valido
  }
}

// ✅ DEFINIZIONE REGOLE DI VALIDAZIONE
// Le regole sono funzioni pure che validano un valore
interface FormValues {
  name: string
  email: string
  password: string
  confirmPassword: string
}

const validationRules: ValidationRules<FormValues> = {
  // ✅ Regole per il campo name
  name: [
    // Regola 1: Campo richiesto
    (value: string) => !value ? 'Nome richiesto' : '',
    
    // Regola 2: Lunghezza minima
    (value: string) => value.length < 2 ? 'Nome troppo corto' : '',
    
    // Regola 3: Lunghezza massima
    (value: string) => value.length > 50 ? 'Nome troppo lungo' : ''
  ],
  
  // ✅ Regole per il campo email
  email: [
    // Regola 1: Campo richiesto
    (value: string) => !value ? 'Email richiesta' : '',
    
    // Regola 2: Formato email valido
    (value: string) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Email non valida' : ''
  ],
  
  // ✅ Regole per il campo password
  password: [
    // Regola 1: Campo richiesto
    (value: string) => !value ? 'Password richiesta' : '',
    
    // Regola 2: Lunghezza minima
    (value: string) => value.length < 8 ? 'Password troppo corta' : '',
    
    // Regola 3: Complessità password (maiuscole, minuscole, numeri)
    (value: string) => !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value) 
      ? 'Password deve contenere maiuscole, minuscole e numeri' 
      : ''
  ],
  
  // ✅ Regole per il campo confirmPassword
  // Nota: questa regola ha bisogno di tutti i valori per confrontare le password
  confirmPassword: [
    // Regola: Password di conferma deve corrispondere alla password
    (value: string, allValues?: FormValues) => 
      value !== allValues?.password ? 'Le password non coincidono' : ''
  ]
}

// ✅ ESEMPIO DI UTILIZZO DEL HOOK
function RegistrationFormWithHook(): JSX.Element {
  // ✅ Usa il custom hook per gestire il form
  const {
    values,
    errors,
    touched,
    setValue,
    setFieldTouched,
    validateAll,
    reset,
    isValid
  } = useValidation<FormValues>(
    { name: '', email: '', password: '', confirmPassword: '' },
    validationRules
  )
  
  // ✅ Handler per gestire i cambiamenti
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setValue(name, value)
  }
  
  // ✅ Handler per gestire il blur
  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { name } = event.target
    setFieldTouched(name)
  }
  
  // ✅ Handler per il submit
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    // ✅ Valida tutti i campi
    if (validateAll()) {
      console.log('Form valido:', values)
      // Invia i dati al server
      // await submitForm(values)
      reset()  // Reset dopo submit riuscito
    } else {
      console.log('Form non valido:', errors)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h2>Registrazione con Hook</h2>
      
      <div style={{ marginBottom: '15px' }}>
        <label>
          Nome:
          <input
            name="name"
            type="text"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '5px',
              border: errors.name && touched.name ? '2px solid red' : '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </label>
        {errors.name && touched.name && (
          <span style={{ color: 'red', fontSize: '12px', display: 'block', marginTop: '5px' }}>
            {errors.name}
          </span>
        )}
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <label>
          Email:
          <input
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '5px',
              border: errors.email && touched.email ? '2px solid red' : '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </label>
        {errors.email && touched.email && (
          <span style={{ color: 'red', fontSize: '12px', display: 'block', marginTop: '5px' }}>
            {errors.email}
          </span>
        )}
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <label>
          Password:
          <input
            name="password"
            type="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '5px',
              border: errors.password && touched.password ? '2px solid red' : '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </label>
        {errors.password && touched.password && (
          <span style={{ color: 'red', fontSize: '12px', display: 'block', marginTop: '5px' }}>
            {errors.password}
          </span>
        )}
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <label>
          Conferma Password:
          <input
            name="confirmPassword"
            type="password"
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '5px',
              border: errors.confirmPassword && touched.confirmPassword ? '2px solid red' : '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </label>
        {errors.confirmPassword && touched.confirmPassword && (
          <span style={{ color: 'red', fontSize: '12px', display: 'block', marginTop: '5px' }}>
            {errors.confirmPassword}
          </span>
        )}
      </div>
      
      <button
        type="submit"
        disabled={!isValid}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: isValid ? '#4CAF50' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '16px',
          cursor: isValid ? 'pointer' : 'not-allowed'
        }}
      >
        Registrati
      </button>
    </form>
  )
}
```

**❌ Anti-Pattern da Evitare:**

```tsx
// ❌ SBAGLIATO: Duplicare la logica di validazione in ogni componente
function BadForm1() {
  const [values, setValues] = useState({ name: '', email: '' })
  const [errors, setErrors] = useState({})
  // ... stessa logica ripetuta
}

function BadForm2() {
  const [values, setValues] = useState({ name: '', email: '' })
  const [errors, setErrors] = useState({})
  // ❌ ERRORE: Stessa logica duplicata!
}

// ✅ CORRETTO: Usa il custom hook
function GoodForm() {
  const { values, errors, setValue, setFieldTouched } = useValidation(...)
  // Logica riutilizzabile!
}
```

**Note Importanti:**
- **Regole come funzioni**: Le regole di validazione sono funzioni pure che ritornano stringhe di errore
- **Validazione dipendente**: Le regole possono accedere a tutti i valori del form per validazioni dipendenti (es. password di conferma)
- **Ordine delle regole**: Le regole vengono eseguite in ordine - il primo errore trovato viene ritornato
- **Riutilizzabilità**: Lo stesso hook può essere usato in più componenti con regole diverse
- **Type Safety**: TypeScript può verificare i tipi dei valori e delle regole
- **Testabilità**: Il hook può essere testato isolatamente senza renderizzare componenti
- **Composizione**: Puoi comporre regole complesse combinando regole semplici

### 4. Feedback Visivo e Stati di Loading

Fornire feedback visivo all'utente è fondamentale per una buona UX. Gli stati di loading, successo ed errore aiutano l'utente a capire cosa sta succedendo nell'applicazione.

#### Componente con Stati di Loading

**Come Funziona:**
Gli stati di loading indicano quando un'operazione asincrona è in corso. Il componente mostra uno spinner o un indicatore visivo e disabilita le azioni durante il caricamento.

**Quando Usare:**
- Per operazioni asincrone (chiamate API, submit form, upload file)
- Quando un'operazione richiede più di qualche secondo
- Per fornire feedback immediato all'utente
- Per prevenire azioni multiple durante un'operazione
- Per migliorare la percezione delle performance

**Vantaggi:**
1. **UX migliore**: L'utente sa che qualcosa sta succedendo
2. **Prevenzione errori**: Disabilita azioni durante operazioni in corso
3. **Feedback visivo**: Spinner e indicatori mostrano il progresso
4. **Gestione stati**: Gestisce stati di loading, successo ed errore
5. **Accessibilità**: Può essere annunciato da screen reader

**Esempio Pratico Completo:**

```tsx
import { useState } from 'react'

// ✅ INTERFACCIA: Props del componente LoadingButton
interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean      // Prop: indica se l'operazione è in corso
  children: React.ReactNode
}

// ✅ COMPONENTE: LoadingButton con stato di loading
function LoadingButton({ onClick, children, loading, disabled, ...props }: LoadingButtonProps): JSX.Element {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}  // ✅ Disabilita durante il loading
      style={{
        position: 'relative',
        opacity: loading ? 0.7 : 1,    // ✅ Riduce opacità durante loading
        cursor: loading ? 'not-allowed' : 'pointer',  // ✅ Cambia cursore
        padding: '10px 20px',
        backgroundColor: loading ? '#ccc' : '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px'
      } as React.CSSProperties}
      {...props}
    >
      {/* ✅ Spinner animato durante il loading */}
      {loading && (
        <span style={{
          position: 'absolute',
          left: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '16px',
          height: '16px',
          border: '2px solid #f3f3f3',
          borderTop: '2px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        } as React.CSSProperties} 
        aria-label="Caricamento in corso"
        />
      )}
      {children}
    </button>
  )
}

// ✅ COMPONENTE: Form con gestione completa degli stati
function FormWithLoading(): JSX.Element {
  // ✅ STATI: loading, success, error
  const [loading, setLoading] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  
  // ✅ Funzione per gestire il submit con stati
  const handleSubmit = async (formData: Record<string, any>) => {
    // ✅ Inizia il loading
    setLoading(true)
    setError(null)
    setSuccess(false)
    
    try {
      // ✅ Simula chiamata API (in un'app reale, sarebbe una chiamata fetch/axios)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // ✅ Simula successo casuale (per demo)
      if (Math.random() > 0.3) {
        setSuccess(true)
        // ✅ Reset dopo 3 secondi
        setTimeout(() => {
          setSuccess(false)
        }, 3000)
      } else {
        throw new Error('Errore durante l\'invio')
      }
    } catch (err) {
      // ✅ Gestisce l'errore
      const errorMessage = err instanceof Error ? err.message : 'Errore durante l\'invio'
      setError(errorMessage)
    } finally {
      // ✅ Termina il loading sempre, anche in caso di errore
      setLoading(false)
    }
  }
  
  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h2>Form con Stati</h2>
      
      {/* ✅ MESSAGGIO DI SUCCESSO */}
      {success && (
        <div style={{
          color: '#155724',
          padding: '15px',
          backgroundColor: '#d4edda',
          border: '1px solid #c3e6cb',
          borderRadius: '4px',
          marginBottom: '20px'
        } as React.CSSProperties}>
          ✅ Form inviato con successo!
        </div>
      )}
      
      {/* ✅ MESSAGGIO DI ERRORE */}
      {error && (
        <div style={{
          color: '#721c24',
          padding: '15px',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          marginBottom: '20px'
        } as React.CSSProperties}>
          ❌ {error}
        </div>
      )}
      
      {/* ✅ PULSANTE CON LOADING */}
      <LoadingButton
        onClick={() => handleSubmit({})}
        loading={loading}
      >
        {loading ? 'Invio in corso...' : 'Invia Form'}
      </LoadingButton>
    </div>
  )
}

// ✅ Esempio avanzato: Componente con stati multipli
interface AsyncActionState {
  idle: boolean
  loading: boolean
  success: boolean
  error: boolean
}

function AdvancedFormWithStates(): JSX.Element {
  const [state, setState] = useState<AsyncActionState>({
    idle: true,
    loading: false,
    success: false,
    error: false
  })
  const [errorMessage, setErrorMessage] = useState<string>('')
  
  const handleAction = async () => {
    // ✅ Transizione: idle -> loading
    setState({ idle: false, loading: true, success: false, error: false })
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // ✅ Transizione: loading -> success
      setState({ idle: false, loading: false, success: true, error: false })
      
      // ✅ Dopo 3 secondi, torna a idle
      setTimeout(() => {
        setState({ idle: true, loading: false, success: false, error: false })
      }, 3000)
    } catch (err) {
      // ✅ Transizione: loading -> error
      const message = err instanceof Error ? err.message : 'Errore sconosciuto'
      setErrorMessage(message)
      setState({ idle: false, loading: false, success: false, error: true })
    }
  }
  
  return (
    <div>
      {/* ✅ Renderizza in base allo stato corrente */}
      {state.idle && (
        <button onClick={handleAction}>
          Avvia Operazione
        </button>
      )}
      
      {state.loading && (
        <div>
          <LoadingButton loading={true}>
            Operazione in corso...
          </LoadingButton>
        </div>
      )}
      
      {state.success && (
        <div style={{ color: 'green', padding: '10px' }}>
          ✅ Operazione completata!
        </div>
      )}
      
      {state.error && (
        <div>
          <div style={{ color: 'red', padding: '10px' }}>
            ❌ Errore: {errorMessage}
          </div>
          <button onClick={handleAction}>
            Riprova
          </button>
        </div>
      )}
    </div>
  )
}
```

**❌ Anti-Pattern da Evitare:**

```tsx
// ❌ SBAGLIATO: Non gestire stati di loading
function BadForm() {
  const handleSubmit = async () => {
    // ❌ ERRORE: Nessuno stato di loading - l'utente non sa cosa sta succedendo!
    await fetch('/api/submit')
  }
  
  return <button onClick={handleSubmit}>Invia</button>
}

// ✅ CORRETTO: Gestisci sempre gli stati
function GoodForm() {
  const [loading, setLoading] = useState(false)
  
  const handleSubmit = async () => {
    setLoading(true)
    try {
      await fetch('/api/submit')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <button onClick={handleSubmit} disabled={loading}>
      {loading ? 'Invio...' : 'Invia'}
    </button>
  )
}
```

**Note Importanti:**
- **Sempre gestire loading**: Per ogni operazione asincrona, gestisci lo stato di loading
- **Disabilita azioni**: Disabilita pulsanti e input durante il loading per prevenire azioni multiple
- **Feedback visivo**: Usa spinner, indicatori di progresso o testo per mostrare il loading
- **Gestione errori**: Gestisci sempre gli errori e mostra messaggi chiari all'utente
- **Stati multipli**: Considera stati multipli (idle, loading, success, error) per UX migliore
- **Accessibilità**: Aggiungi `aria-label` per screen reader durante il loading
- **Cleanup**: Assicurati di resettare lo stato di loading anche in caso di errore (usa `finally`)

### 5. Gestione Input Avanzata

Per migliorare l'UX, è possibile implementare pattern avanzati per la gestione degli input come debouncing e autocomplete.

#### Input con Debouncing

**Come Funziona:**
Il debouncing ritarda l'esecuzione di una funzione fino a quando l'utente non smette di digitare per un certo periodo di tempo. Questo è utile per evitare chiamate API eccessive durante la digitazione.

**Quando Usare:**
- Per input di ricerca che richiedono chiamate API
- Quando vuoi ridurre il numero di operazioni durante la digitazione
- Per migliorare le performance riducendo chiamate non necessarie
- Per input che richiedono calcoli pesanti

**Vantaggi:**
1. **Performance**: Riduce il numero di chiamate API
2. **UX migliore**: Evita lag durante la digitazione
3. **Risparmio risorse**: Meno operazioni sul server
4. **Smooth experience**: Esperienza più fluida per l'utente

> 💡 **Nota**: Il debouncing richiede l'uso di `useEffect` per gestire timer e cleanup. Questo pattern verrà approfondito nella Lezione 12 dopo aver imparato `useEffect`. Per ora, puoi implementare la ricerca senza debouncing, chiamando `onSearch` direttamente nell'`onChange`.

**Esempio Pratico:**

```tsx
import { useState } from 'react'

interface SearchInputProps {
  onSearch: (query: string) => void  // Callback chiamata quando l'utente cerca
}

function SearchInput({ onSearch }: SearchInputProps): JSX.Element {
  const [query, setQuery] = useState<string>('')
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value
    setQuery(newQuery)
    
    // ⚠️ NOTA: Senza debouncing, chiama onSearch ad ogni keystroke
    // Questo può causare troppe chiamate API
    // Per implementare debouncing serve useEffect (Lezione 12)
    if (newQuery.trim()) {
      onSearch(newQuery)
    }
  }
  
  return (
    <input
      type="text"
      value={query}
      onChange={handleChange}
      placeholder="Cerca..."
      style={{
        padding: '10px',
        width: '300px',
        border: '1px solid #ddd',
        borderRadius: '4px'
      }}
    />
  )
}

// ✅ Esempio con debouncing (richiede useEffect dalla Lezione 12)
// Per ora, questo è solo un esempio della struttura che userai:
/*
function SearchInputWithDebounce({ onSearch }: SearchInputProps) {
  const [query, setQuery] = useState<string>('')
  
  useEffect(() => {
    // Timer che esegue la ricerca dopo 500ms di inattività
    const timer = setTimeout(() => {
      if (query.trim()) {
        onSearch(query)
      }
    }, 500)
    
    // Cleanup: cancella il timer se l'utente continua a digitare
    return () => clearTimeout(timer)
  }, [query, onSearch])
  
  return (
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Cerca..."
    />
  )
}
*/
```

#### Input con Autocomplete

**Come Funziona:**
L'autocomplete mostra suggerimenti mentre l'utente digita, filtrando una lista di opzioni predefinite basate sul testo inserito.

**Quando Usare:**
- Per input di ricerca con suggerimenti
- Quando hai una lista fissa di opzioni possibili
- Per migliorare l'UX fornendo suggerimenti
- Per ridurre errori di digitazione
- Per accelerare l'inserimento di dati comuni

**Vantaggi:**
1. **UX migliore**: L'utente vede suggerimenti mentre digita
2. **Velocità**: Accelera l'inserimento di dati
3. **Meno errori**: Riduce errori di digitazione
4. **Intuitività**: Più intuitivo per l'utente

**Esempio Pratico Completo:**

```tsx
import { useState } from 'react'

interface AutocompleteInputProps {
  suggestions: string[]              // Lista di suggerimenti disponibili
  onSelect: (suggestion: string) => void  // Callback quando un suggerimento viene selezionato
  placeholder?: string
}

function AutocompleteInput({ suggestions, onSelect, placeholder }: AutocompleteInputProps): JSX.Element {
  // ✅ STATO: Valore corrente dell'input
  const [value, setValue] = useState<string>('')
  
  // ✅ STATO: Mostra/nascondi la lista di suggerimenti
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false)
  
  // ✅ CALCOLO: Filtra i suggerimenti basandosi sul valore corrente
  // Filtra i suggerimenti che contengono il testo digitato (case-insensitive)
  // ⚠️ NOTA: Per ottimizzare con memoizzazione serve useMemo (Lezione 14)
  const filteredSuggestions = value 
    ? suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      )
    : []
  
  // ✅ HANDLER: Gestisce i cambiamenti nell'input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    // ✅ Mostra i suggerimenti quando l'utente inizia a digitare
    setShowSuggestions(true)
  }
  
  // ✅ HANDLER: Gestisce la selezione di un suggerimento
  const handleSelect = (suggestion: string) => {
    setValue(suggestion)
    setShowSuggestions(false)
    // ✅ Chiama la callback per notificare la selezione
    onSelect(suggestion)
  }
  
  // ✅ HANDLER: Gestisce il click fuori dall'input (chiude i suggerimenti)
  // Nota: Per implementare click-outside serve useEffect e ref (Lezione 12)
  
  return (
    <div style={{ position: 'relative', width: '300px' } as React.CSSProperties}>
      {/* ✅ INPUT PRINCIPALE */}
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onFocus={() => setShowSuggestions(true)}  // ✅ Mostra suggerimenti quando focus
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '10px',
          border: '1px solid #ddd',
          borderRadius: '4px'
        }}
      />
      
      {/* ✅ LISTA SUGGERIMENTI */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderTop: 'none',
          maxHeight: '200px',
          overflowY: 'auto',
          zIndex: 1000,
          margin: 0,
          padding: 0,
          listStyle: 'none',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        } as React.CSSProperties}>
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSelect(suggestion)}  // ✅ Seleziona il suggerimento al click
              style={{
                padding: '10px',
                cursor: 'pointer',
                borderBottom: '1px solid #eee',
                backgroundColor: 'transparent',
                transition: 'background-color 0.2s'
              } as React.CSSProperties}
              onMouseEnter={(e) => {
                // ✅ Highlight al hover
                e.currentTarget.style.backgroundColor = '#f0f0f0'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              {/* ✅ Evidenzia la parte corrispondente del suggerimento */}
              {suggestion.split(new RegExp(`(${value})`, 'gi')).map((part, i) => (
                <span
                  key={i}
                  style={{
                    fontWeight: part.toLowerCase() === value.toLowerCase() ? 'bold' : 'normal',
                    backgroundColor: part.toLowerCase() === value.toLowerCase() ? '#fff3cd' : 'transparent'
                  }}
                >
                  {part}
                </span>
              ))}
            </li>
          ))}
        </ul>
      )}
      
      {/* ✅ Messaggio quando non ci sono suggerimenti */}
      {showSuggestions && value && filteredSuggestions.length === 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderTop: 'none',
          padding: '10px',
          color: '#666'
        } as React.CSSProperties}>
          Nessun suggerimento trovato
        </div>
      )}
    </div>
  )
}

// ✅ Esempio di utilizzo
function AutocompleteExample(): JSX.Element {
  const cities = [
    'Roma', 'Milano', 'Napoli', 'Torino', 'Palermo', 
    'Genova', 'Bologna', 'Firenze', 'Bari', 'Catania'
  ]
  
  const handleSelect = (city: string) => {
    console.log('Città selezionata:', city)
  }
  
  return (
    <div style={{ padding: '20px' }}>
      <h3>Cerca Città</h3>
      <AutocompleteInput
        suggestions={cities}
        onSelect={handleSelect}
        placeholder="Inizia a digitare..."
      />
    </div>
  )
}
```

**Note Importanti:**
- **Debouncing**: Riduce chiamate API durante la digitazione - implementa con useEffect (Lezione 12)
- **Performance**: Filtraggio dei suggerimenti può essere ottimizzato con useMemo (Lezione 14)
- **Click outside**: Per chiudere i suggerimenti quando si clicca fuori serve useEffect e ref
- **Keyboard navigation**: Aggiungi supporto per frecce su/giù e Enter per navigare i suggerimenti
- **Accessibilità**: Usa `aria-autocomplete` e `aria-expanded` per screen reader

### 6. Gestione Errori e Feedback

Un sistema di notifiche ben progettato è essenziale per comunicare efficacemente con l'utente, mostrando successi, errori e informazioni importanti.

#### Sistema di Notifiche

**Come Funziona:**
Un sistema di notifiche gestisce messaggi temporanei che appaiono e scompaiono automaticamente. Le notifiche possono essere di diversi tipi (successo, errore, info, warning) e vengono visualizzate in modo non invasivo.

**Quando Usare:**
- Per confermare azioni completate con successo
- Per mostrare errori che non bloccano il flusso
- Per informare l'utente di eventi importanti
- Per feedback immediato dopo azioni dell'utente
- Per sostituire alert/confirm nativi del browser

**Vantaggi:**
1. **UX migliore**: Feedback immediato e non invasivo
2. **Flessibilità**: Supporta diversi tipi di notifiche
3. **Auto-dismiss**: Le notifiche scompaiono automaticamente
4. **Riutilizzabilità**: Un sistema che può essere usato ovunque
5. **Accessibilità**: Può essere annunciato da screen reader

**Esempio Pratico Completo:**

```tsx
import { useState } from 'react'

// ✅ INTERFACCIA: Struttura di una notifica
interface Notification {
  id: number                 // ID univoco per identificare la notifica
  type: 'success' | 'error' | 'info' | 'warning'  // Tipo di notifica
  message: string            // Messaggio da mostrare
}

// ✅ INTERFACCIA: Valore di ritorno del custom hook
interface UseNotificationsReturn {
  notifications: Notification[]                                    // Array di notifiche attive
  addNotification: (notification: Omit<Notification, 'id'>) => void  // Funzione per aggiungere notifica
  removeNotification: (id: number) => void                        // Funzione per rimuovere notifica
}

// ✅ CUSTOM HOOK: useNotifications
// Gestisce le notifiche con auto-dismiss e rimozione manuale
function useNotifications(): UseNotificationsReturn {
  // ✅ STATO: Array di notifiche attive
  const [notifications, setNotifications] = useState<Notification[]>([])
  
  // ✅ FUNZIONE: Aggiunge una nuova notifica
  const addNotification = (notification: Omit<Notification, 'id'>) => {
    // ✅ Genera un ID univoco usando timestamp
    const id = Date.now()
    
    // ✅ Aggiunge la notifica all'array
    setNotifications(prev => [...prev, { id, ...notification }])
    
    // ✅ Auto-remove dopo 5 secondi (puoi personalizzare il timeout)
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 5000)
  }
  
  // ✅ FUNZIONE: Rimuove una notifica manualmente
  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }
  
  return {
    notifications,
    addNotification,
    removeNotification
  }
}

// ✅ COMPONENTE: Sistema di notifiche con UI
function NotificationSystem(): JSX.Element {
  // ✅ Usa il custom hook per gestire le notifiche
  const { notifications, addNotification, removeNotification } = useNotifications()
  
  // ✅ Funzioni helper per aggiungere notifiche di diversi tipi
  const showSuccess = () => {
    addNotification({
      type: 'success',
      message: 'Operazione completata con successo!'
    })
  }
  
  const showError = () => {
    addNotification({
      type: 'error',
      message: 'Si è verificato un errore durante l\'operazione!'
    })
  }
  
  const showInfo = () => {
    addNotification({
      type: 'info',
      message: 'Questa è una notifica informativa.'
    })
  }
  
  const showWarning = () => {
    addNotification({
      type: 'warning',
      message: 'Attenzione: questa operazione richiede attenzione.'
    })
  }
  
  // ✅ Funzione helper per ottenere lo stile in base al tipo
  const getNotificationStyle = (type: Notification['type']) => {
    const styles = {
      success: {
        backgroundColor: '#d4edda',
        borderColor: '#c3e6cb',
        color: '#155724'
      },
      error: {
        backgroundColor: '#f8d7da',
        borderColor: '#f5c6cb',
        color: '#721c24'
      },
      info: {
        backgroundColor: '#d1ecf1',
        borderColor: '#bee5eb',
        color: '#0c5460'
      },
      warning: {
        backgroundColor: '#fff3cd',
        borderColor: '#ffeaa7',
        color: '#856404'
      }
    }
    return styles[type]
  }
  
  return (
    <div style={{ padding: '20px' }}>
      <h2>Sistema di Notifiche</h2>
      
      {/* ✅ PULSANTI DI TEST */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button
          onClick={showSuccess}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Mostra Successo
        </button>
        
        <button
          onClick={showError}
          style={{
            padding: '10px 20px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Mostra Errore
        </button>
        
        <button
          onClick={showInfo}
          style={{
            padding: '10px 20px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Mostra Info
        </button>
        
        <button
          onClick={showWarning}
          style={{
            padding: '10px 20px',
            backgroundColor: '#ff9800',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Mostra Warning
        </button>
      </div>
      
      {/* ✅ CONTAINER DELLE NOTIFICHE */}
      {/* Posizionato fixed in alto a destra per non interferire con il contenuto */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '400px'
      } as React.CSSProperties}>
        {notifications.map(notification => {
          const style = getNotificationStyle(notification.type)
          
          return (
            <div
              key={notification.id}
              style={{
                padding: '15px 20px',
                backgroundColor: style.backgroundColor,
                border: `1px solid ${style.borderColor}`,
                borderRadius: '4px',
                color: style.color,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '15px',
                animation: 'slideIn 0.3s ease-out'
              } as React.CSSProperties}
              role="alert"
              aria-live="polite"
            >
              {/* ✅ ICONA BASATA SUL TIPO */}
              <span style={{ fontSize: '20px' }}>
                {notification.type === 'success' && '✅'}
                {notification.type === 'error' && '❌'}
                {notification.type === 'info' && 'ℹ️'}
                {notification.type === 'warning' && '⚠️'}
              </span>
              
              {/* ✅ MESSAGGIO */}
              <span style={{ flex: 1 }}>
                {notification.message}
              </span>
              
              {/* ✅ PULSANTE CHIUDI */}
              <button
                onClick={() => removeNotification(notification.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: style.color,
                  padding: '0',
                  lineHeight: '1'
                } as React.CSSProperties}
                aria-label="Chiudi notifica"
              >
                ✕
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ✅ Esempio avanzato: Notifiche con posizioni diverse
function NotificationSystemWithPositions(): JSX.Element {
  const { notifications, addNotification, removeNotification } = useNotifications()
  
  return (
    <div>
      {/* ✅ Notifiche possono essere posizionate in diversi punti */}
      {/* top-left, top-right, bottom-left, bottom-right, top-center, bottom-center */}
      
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      } as React.CSSProperties}>
        {notifications.map(notification => (
          <div
            key={notification.id}
            style={{
              padding: '15px',
              backgroundColor: notification.type === 'success' ? '#d4edda' : '#f8d7da',
              borderRadius: '4px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            } as React.CSSProperties}
          >
            {notification.message}
            <button onClick={() => removeNotification(notification.id)}>✕</button>
          </div>
        ))}
      </div>
    </div>
  )
}
```

**❌ Anti-Pattern da Evitare:**

```tsx
// ❌ SBAGLIATO: Usare alert/confirm nativi del browser
function BadForm() {
  const handleSubmit = async () => {
    try {
      await submitForm()
      // ❌ ERRORE: Alert blocca il flusso e non è elegante
      alert('Form inviato!')
    } catch (error) {
      alert('Errore!')
    }
  }
  
  return <button onClick={handleSubmit}>Invia</button>
}

// ✅ CORRETTO: Usa sistema di notifiche
function GoodForm() {
  const { addNotification } = useNotifications()
  
  const handleSubmit = async () => {
    try {
      await submitForm()
      addNotification({ type: 'success', message: 'Form inviato!' })
    } catch (error) {
      addNotification({ type: 'error', message: 'Errore durante l\'invio' })
    }
  }
  
  return <button onClick={handleSubmit}>Invia</button>
}
```

**Note Importanti:**
- **Auto-dismiss**: Le notifiche dovrebbero scomparire automaticamente dopo un timeout (es. 5 secondi)
- **Rimozione manuale**: Permetti sempre all'utente di chiudere manualmente le notifiche
- **Posizionamento**: Posiziona le notifiche in modo non invasivo (es. top-right, top-center)
- **Accessibilità**: Usa `role="alert"` e `aria-live` per screen reader
- **Limitazione**: Limita il numero di notifiche visibili contemporaneamente
- **Gerarchia**: Usa colori e icone diverse per distinguere i tipi di notifica
- **Animazioni**: Aggiungi animazioni di entrata/uscita per migliore UX
- **Cleanup**: Rimuovi sempre i timeout quando il componente viene smontato (usa useEffect)

### 7. Best Practices

#### ✅ Best Practices:

1. **Usa input controllati** per la maggior parte dei casi
2. **Valida in tempo reale** per migliorare l'UX
3. **Fornisci feedback immediato** all'utente
4. **Gestisci stati di loading** per operazioni asincrone
5. **Usa debouncing** per input che richiedono chiamate API
6. **Implementa gestione errori** robusta
7. **Mantieni l'accessibilità** con label e ARIA
8. **Testa tutti gli stati** del form

#### ❌ Anti-Patterns da Evitare:

1. **Non validare solo al submit** - valida in tempo reale
2. **Non dimenticare stati di loading** per operazioni asincrone
3. **Non ignorare la gestione errori** di rete
4. **Non usare input non controllati** senza necessità
5. **Non dimenticare l'accessibilità** (label, ARIA)
6. **Non validare solo lato client** - sempre anche lato server
7. **Non mostrare errori generici** - sii specifico
8. **Non dimenticare il cleanup** per timeout e interval

## Esempi Pratici

### Esempio 1: Form di Registrazione Completo
```tsx
interface RegistrationFormData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  dateOfBirth: string
  gender: string
  newsletter: boolean
  terms: boolean
}

function RegistrationForm(): JSX.Element {
  const [formData, setFormData] = useState<RegistrationFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    gender: '',
    newsletter: false,
    terms: false
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false)
  
  const validateField = (name: string, value: any): string => {
    const validations: Record<string, string> = {
      firstName: value.length < 2 ? 'Nome deve essere di almeno 2 caratteri' : '',
      lastName: value.length < 2 ? 'Cognome deve essere di almeno 2 caratteri' : '',
      email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Email non valida' : '',
      password: value.length < 8 ? 'Password deve essere di almeno 8 caratteri' : '',
      confirmPassword: value !== formData.password ? 'Le password non coincidono' : '',
      dateOfBirth: !value ? 'Data di nascita richiesta' : '',
      gender: !value ? 'Genere richiesto' : '',
      terms: !value ? 'Devi accettare i termini' : ''
    }
    return validations[name] || ''
  }
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = event.target
    const checked = (event.target as HTMLInputElement).checked
    const fieldValue = type === 'checkbox' ? checked : value
    
    setFormData(prev => ({ ...prev, [name]: fieldValue }))
    
    if (touched[name]) {
      const error = validateField(name, fieldValue)
      setErrors(prev => ({ ...prev, [name]: error }))
    }
  }
  
  const handleBlur = (event: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = event.target
    const checked = (event.target as HTMLInputElement).checked
    const fieldValue = type === 'checkbox' ? checked : value
    
    setTouched(prev => ({ ...prev, [name]: true }))
    const error = validateField(name, fieldValue)
    setErrors(prev => ({ ...prev, [name]: error }))
  }
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    // Valida tutti i campi
    const newErrors: Record<string, string> = {}
    Object.keys(formData).forEach(name => {
      const error = validateField(name, formData[name as keyof RegistrationFormData])
      if (error) newErrors[name] = error
    })
    
    setErrors(newErrors)
    setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}))
    
    if (Object.keys(newErrors).length === 0) {
      setLoading(true)
      try {
        // Simula chiamata API
        await new Promise(resolve => setTimeout(resolve, 2000))
        setSuccess(true)
      } catch (error) {
        console.error('Errore registrazione:', error)
      } finally {
        setLoading(false)
      }
    }
  }
  
  if (success) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h2>✅ Registrazione Completata!</h2>
        <p>Benvenuto! La tua registrazione è stata completata con successo.</p>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h2>Registrazione</h2>
      
      <div style={{ marginBottom: '15px' }}>
        <input
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Nome"
          style={{ width: '100%', padding: '10px', marginBottom: '5px' }}
        />
        {errors.firstName && <span style={{color: 'red', fontSize: '14px'}}>{errors.firstName}</span>}
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <input
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Cognome"
          style={{ width: '100%', padding: '10px', marginBottom: '5px' }}
        />
        {errors.lastName && <span style={{color: 'red', fontSize: '14px'}}>{errors.lastName}</span>}
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Email"
          style={{ width: '100%', padding: '10px', marginBottom: '5px' }}
        />
        {errors.email && <span style={{color: 'red', fontSize: '14px'}}>{errors.email}</span>}
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Password"
          style={{ width: '100%', padding: '10px', marginBottom: '5px' }}
        />
        {errors.password && <span style={{color: 'red', fontSize: '14px'}}>{errors.password}</span>}
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <input
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Conferma Password"
          style={{ width: '100%', padding: '10px', marginBottom: '5px' }}
        />
        {errors.confirmPassword && <span style={{color: 'red', fontSize: '14px'}}>{errors.confirmPassword}</span>}
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <input
          name="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={handleChange}
          onBlur={handleBlur}
          style={{ width: '100%', padding: '10px', marginBottom: '5px' }}
        />
        {errors.dateOfBirth && <span style={{color: 'red', fontSize: '14px'}}>{errors.dateOfBirth}</span>}
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          onBlur={handleBlur}
          style={{ width: '100%', padding: '10px', marginBottom: '5px' }}
        >
          <option value="">Seleziona genere</option>
          <option value="male">Maschio</option>
          <option value="female">Femmina</option>
          <option value="other">Altro</option>
        </select>
        {errors.gender && <span style={{color: 'red', fontSize: '14px'}}>{errors.gender}</span>}
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <label>
          <input
            name="newsletter"
            type="checkbox"
            checked={formData.newsletter}
            onChange={handleChange}
            style={{ marginRight: '8px' }}
          />
          Iscrivimi alla newsletter
        </label>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label>
          <input
            name="terms"
            type="checkbox"
            checked={formData.terms}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{ marginRight: '8px' }}
          />
          Accetto i termini e condizioni
        </label>
        {errors.terms && <span style={{color: 'red', fontSize: '14px', display: 'block'}}>{errors.terms}</span>}
      </div>
      
      <button
        type="submit"
        disabled={loading}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '16px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Registrazione in corso...' : 'Registrati'}
      </button>
    </form>
  );
}
```

## Esercizi

### Esercizio 1: Form di Contatto
Crea un form di contatto con:
- Validazione in tempo reale
- Stati di loading
- Gestione errori
- Feedback visivo

### Esercizio 2: Sistema di Login
Implementa un sistema di login con:
- Validazione email/password
- Gestione errori di autenticazione
- Stati di loading
- Redirect dopo login

### Esercizio 3: Form Multi-Step
Crea un form multi-step con:
- Navigazione tra step
- Validazione per step
- Salvataggio progresso
- Riepilogo finale

## Riepilogo

In questa lezione abbiamo imparato:

- **Gestione eventi** in React con Synthetic Events
- **Form handling** con input controllati e non controllati
- **Validazione avanzata** con hook personalizzati
- **Feedback visivo** e stati di loading
- **Gestione errori** e notifiche
- **Input avanzati** con debouncing e autocomplete
- **Best practices** per l'interazione utente

L'interazione utente è fondamentale per creare applicazioni React user-friendly e robuste. Ricorda sempre di:

- Validare in tempo reale per migliorare l'UX
- Fornire feedback immediato all'utente
- Gestire stati di loading e errori
- Mantenere l'accessibilità
- Testare tutti gli stati del form

Nella prossima lezione esploreremo useEffect e il ciclo di vita dei componenti.
