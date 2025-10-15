# Guida Pratica: Creazione Progetto React con Vite

## 🎯 Obiettivo

Questa guida ti accompagnerà passo-passo nella creazione del tuo primo progetto React usando Vite.

## 📋 Checklist Prerequisiti

Prima di iniziare, verifica di avere:

- [ ] **Node.js 18+** installato
- [ ] **npm 8+** installato
- [ ] **Editor di codice** (VS Code consigliato)
- [ ] **Terminale/Command Prompt** accessibile

### Verifica Installazione

```bash
# Verifica Node.js
node --version
# Output atteso: v18.x.x o superiore

# Verifica npm
npm --version
# Output atteso: 8.x.x o superiore
```

## 🚀 Passo 1: Creazione del Progetto

### Opzione A: Comando Interattivo (Consigliato)

```bash
# Esegui questo comando nella directory dove vuoi creare il progetto
npm create vite@latest
```

**Risposte alle domande:**
```
✔ Project name: › my-first-react-app
✔ Select a framework: › React
✔ Select a variant: › JavaScript
```

### Opzione B: Comando Diretto

```bash
# Crea direttamente con template React
npm create vite@latest my-first-react-app -- --template react
```

## 📁 Passo 2: Navigazione e Installazione

```bash
# Entra nella directory del progetto
cd my-first-react-app

# Installa le dipendenze
npm install
```

## 🎨 Passo 3: Personalizzazione Iniziale

### Modifica il Titolo dell'App

Apri `index.html` e modifica il titolo:

```html
<!-- Prima -->
<title>Vite + React</title>

<!-- Dopo -->
<title>La Mia Prima App React</title>
```

### Modifica il Componente Principale

Apri `src/App.jsx` e personalizza:

```jsx
// Prima
function App() {
  const [count, setCount] = useState(0)
  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

// Dopo
function App() {
  const [count, setCount] = useState(0)
  
  return (
    <div className="App">
      <header>
        <h1>🚀 Benvenuto nella Mia Prima App React!</h1>
        <p>Creata con Vite per massime performance</p>
      </header>
      
      <main>
        <div className="counter-section">
          <h2>Contatore Interattivo</h2>
          <div className="counter">
            <span className="count-display">{count}</span>
            <div className="buttons">
              <button onClick={() => setCount(count + 1)}>
                ➕ Incrementa
              </button>
              <button onClick={() => setCount(count - 1)}>
                ➖ Decrementa
              </button>
              <button onClick={() => setCount(0)}>
                🔄 Reset
              </button>
            </div>
          </div>
        </div>
        
        <div className="info-section">
          <h3>💡 Informazioni</h3>
          <ul>
            <li>✅ Progetto creato con Vite</li>
            <li>✅ React 19.1.1 installato</li>
            <li>✅ Hot Module Replacement attivo</li>
            <li>✅ Build ottimizzato per produzione</li>
          </ul>
        </div>
      </main>
      
      <footer>
        <p>
          Modifica <code>src/App.jsx</code> e salva per vedere l'HMR in azione!
        </p>
      </footer>
    </div>
  )
}
```

### Aggiungi Stili Personalizzati

Apri `src/App.css` e aggiungi:

```css
/* Stili per il nuovo layout */
.App {
  text-align: center;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

header {
  margin-bottom: 3rem;
}

header h1 {
  color: #61dafb;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

header p {
  color: #888;
  font-size: 1.2rem;
}

.counter-section {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.counter h2 {
  color: #333;
  margin-bottom: 1.5rem;
}

.count-display {
  display: block;
  font-size: 4rem;
  font-weight: bold;
  color: #61dafb;
  margin-bottom: 1rem;
}

.buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.buttons button {
  background: #61dafb;
  color: #282c34;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.buttons button:hover {
  background: #21a0c4;
  transform: translateY(-2px);
}

.info-section {
  background: #e3f2fd;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.info-section h3 {
  color: #1976d2;
  margin-bottom: 1rem;
}

.info-section ul {
  list-style: none;
  padding: 0;
  text-align: left;
  max-width: 400px;
  margin: 0 auto;
}

.info-section li {
  padding: 0.5rem 0;
  color: #333;
}

footer {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
  color: #666;
}

footer code {
  background: #f1f1f1;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
}
```

## 🚀 Passo 4: Avvio del Progetto

```bash
# Avvia il server di sviluppo
npm run dev
```

**Output atteso:**
```
  VITE v7.1.4  ready in 284 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

## 🌐 Passo 5: Verifica nel Browser

1. **Apri il browser** e vai su [http://localhost:5173](http://localhost:5173)
2. **Verifica** che l'app si carichi correttamente
3. **Testa** i pulsanti del contatore
4. **Modifica** il codice e verifica l'HMR (Hot Module Replacement)

## 🔧 Passo 6: Comandi Utili

### Script di Sviluppo
```bash
# Avvia server di sviluppo
npm run dev

# Avvia con host esposto (accessibile da rete)
npm run dev -- --host

# Avvia con porta specifica
npm run dev -- --port 3000
```

### Script di Build
```bash
# Build per produzione
npm run build

# Preview del build
npm run preview
```

### Script di Qualità
```bash
# Linting
npm run lint

# Linting con fix automatico
npm run lint -- --fix
```

## 📁 Struttura Finale del Progetto

```
my-first-react-app/
├── public/
│   └── vite.svg
├── src/
│   ├── App.css          # Stili personalizzati
│   ├── App.jsx          # Componente principale modificato
│   ├── index.css        # Stili globali
│   ├── main.jsx         # Entry point
│   └── vite-env.d.ts    # Tipi TypeScript
├── index.html           # Template HTML
├── package.json         # Dipendenze e script
├── vite.config.js       # Configurazione Vite
└── README.md           # Documentazione
```

## 🎯 Test di Funzionalità

### ✅ Checklist di Verifica

- [ ] Il progetto si avvia senza errori
- [ ] L'app si carica nel browser
- [ ] Il contatore funziona correttamente
- [ ] L'HMR funziona (modifica il codice e salva)
- [ ] Gli stili sono applicati correttamente
- [ ] Il build di produzione funziona (`npm run build`)

### 🐛 Risoluzione Problemi Comuni

#### **Errore: "command not found: npm"**
```bash
# Installa Node.js da https://nodejs.org/
# Riavvia il terminale dopo l'installazione
```

#### **Errore: "Port 5173 is already in use"**
```bash
# Usa una porta diversa
npm run dev -- --port 3000
```

#### **Errore: "Cannot find module"**
```bash
# Reinstalla le dipendenze
rm -rf node_modules package-lock.json
npm install
```

## 🎉 Congratulazioni!

Hai creato con successo il tuo primo progetto React con Vite! 

### Prossimi Passi:
1. **Sperimenta** con il codice
2. **Modifica** i componenti
3. **Aggiungi** nuove funzionalità
4. **Procedi** con la Lezione 3 per imparare come avviare e sviluppare

---

**Prossima Lezione**: [Lezione 3 - Avviare il progetto](../03-avviare-progetto/README.md)
