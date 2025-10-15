# Lezione 2: Creare progetto React con Vite

## 🎯 Obiettivi della Lezione

Al termine di questa lezione sarai in grado di:
- Comprendere cos'è Vite e perché è preferibile ad altri build tools
- Creare un nuovo progetto React usando Vite
- Configurare l'ambiente di sviluppo
- Comprendere la struttura di un progetto Vite + React

## 🚀 Cos'è Vite?

**Vite** (pronunciato "veet", francese per "veloce") è un build tool moderno per applicazioni web frontend, creato da Evan You (creatore di Vue.js). È progettato per essere estremamente veloce sia in fase di sviluppo che di build.

### Caratteristiche Principali di Vite

#### ⚡ **Velocità di Sviluppo**
- **Hot Module Replacement (HMR)** istantaneo
- **Server di sviluppo** basato su ES modules nativi
- **Avvio rapido** del server di sviluppo (solitamente < 1 secondo)

#### 🏗️ **Build Ottimizzato**
- **Rollup** per il bundling di produzione
- **Tree shaking** automatico
- **Code splitting** intelligente
- **Ottimizzazioni** per performance

#### 🔧 **Flessibilità**
- **Plugin system** estensibile
- **Supporto TypeScript** out-of-the-box
- **CSS preprocessing** (Sass, Less, Stylus)
- **Framework agnostic** (React, Vue, Svelte, etc.)

## 🆚 Vite vs Altri Build Tools

### **Vite vs Create React App (CRA)**

| Caratteristica | Vite | Create React App |
|----------------|------|------------------|
| **Velocità di avvio** | ~1 secondo | ~30-60 secondi |
| **HMR** | Istantaneo | ~1-3 secondi |
| **Bundle size** | Più piccolo | Più grande |
| **Configurazione** | Flessibile | Limitata |
| **Manutenzione** | Attiva | In deprecazione |

### **Vite vs Webpack**

| Caratteristica | Vite | Webpack |
|----------------|------|---------|
| **Configurazione** | Zero-config | Complessa |
| **Velocità dev** | Molto veloce | Lenta |
| **Learning curve** | Dolce | Ripida |
| **Ecosistema** | In crescita | Maturo |

## 🛠️ Prerequisiti

Prima di iniziare, assicurati di avere:

- **Node.js 18+** installato
- **npm 8+** o **yarn** o **pnpm**
- **Editor di codice** (VS Code consigliato)

### Verifica dell'Installazione

```bash
# Verifica Node.js
node --version
# Output atteso: v18.x.x o superiore

# Verifica npm
npm --version
# Output atteso: 8.x.x o superiore
```

## 🚀 Creazione di un Progetto React con Vite

### Metodo 1: Comando Interattivo (Consigliato)

```bash
# Crea un nuovo progetto
npm create vite@latest

# Segui le istruzioni:
# ✓ Project name: › my-react-app
# ✓ Select a framework: › React
# ✓ Select a variant: › JavaScript
```

### Metodo 2: Comando Diretto

```bash
# Crea progetto con template specifico
npm create vite@latest my-react-app -- --template react
```

### Metodo 3: Con Varianti Specifiche

```bash
# Con TypeScript
npm create vite@latest my-react-app -- --template react-ts

# Con JavaScript
npm create vite@latest my-react-app -- --template react
```

## 📁 Struttura del Progetto Vite + React

Dopo aver creato il progetto, avrai questa struttura:

```
my-react-app/
├── public/                 # File statici
│   └── vite.svg           # Icona Vite
├── src/                   # Codice sorgente
│   ├── App.css           # Stili del componente App
│   ├── App.jsx           # Componente principale
│   ├── index.css         # Stili globali
│   ├── main.jsx          # Entry point dell'app
│   └── vite-env.d.ts     # Tipi TypeScript (se usi TS)
├── index.html            # Template HTML principale
├── package.json          # Dipendenze e script
├── vite.config.js        # Configurazione Vite
└── README.md            # Documentazione del progetto
```

### Analisi dei File Principali

#### **index.html**
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

#### **main.jsx** (Entry Point)
```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

#### **App.jsx** (Componente Principale)
```jsx
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
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

export default App
```

## ⚙️ Configurazione Vite

### **vite.config.js** (Configurazione Base)

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
```

### Configurazioni Avanzate

#### **Con Alias di Percorso**
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
})
```

#### **Con Variabili d'Ambiente**
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
})
```

## 📦 Script NPM Disponibili

### **Script di Sviluppo**
```bash
# Avvia il server di sviluppo
npm run dev

# Avvia con host esposto (accessibile da rete)
npm run dev -- --host

# Avvia con porta specifica
npm run dev -- --port 3000
```

### **Script di Build**
```bash
# Build per produzione
npm run build

# Preview del build di produzione
npm run preview

# Build con analisi del bundle
npm run build -- --analyze
```

### **Script di Qualità**
```bash
# Linting con ESLint
npm run lint

# Linting con fix automatico
npm run lint -- --fix
```

## 🔧 Installazione Dipendenze

### **Dipendenze di Produzione**
```bash
# React e React DOM
npm install react react-dom

# React Router (per routing)
npm install react-router-dom

# Axios (per chiamate HTTP)
npm install axios

# React Query (per gestione stato server)
npm install @tanstack/react-query
```

### **Dipendenze di Sviluppo**
```bash
# TypeScript (se usi TS)
npm install -D typescript @types/react @types/react-dom

# ESLint
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin

# Prettier
npm install -D prettier eslint-config-prettier

# Testing
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

## 🎨 Personalizzazione del Progetto

### **Modifica del Template HTML**

```html
<!-- index.html -->
<!doctype html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>La Mia App React</title>
    <meta name="description" content="Descrizione della mia app" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### **Configurazione CSS Globale**

```css
/* src/index.css */
:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
  
  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;
  
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}

#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}
```

## 🚀 Avvio del Progetto

### **1. Installa le Dipendenze**
```bash
cd my-react-app
npm install
```

### **2. Avvia il Server di Sviluppo**
```bash
npm run dev
```

### **3. Apri il Browser**
Vai su [http://localhost:5173](http://localhost:5173)

## 🔍 Debugging e DevTools

### **React DevTools**
- Installa l'estensione del browser
- Disponibile per Chrome, Firefox, Edge
- Permette di ispezionare componenti, props, stato

### **Vite DevTools**
- Console del browser per errori
- Network tab per richieste
- Performance tab per analisi

## 📚 Best Practices

### **Organizzazione del Codice**
```
src/
├── components/          # Componenti riutilizzabili
│   ├── Button/
│   │   ├── Button.jsx
│   │   ├── Button.css
│   │   └── index.js
├── pages/              # Pagine dell'app
├── hooks/              # Custom hooks
├── utils/              # Funzioni utility
├── services/           # Chiamate API
├── assets/             # Immagini, font, etc.
└── styles/             # Stili globali
```

### **Naming Conventions**
- **Componenti**: PascalCase (`UserProfile.jsx`)
- **File**: kebab-case (`user-profile.jsx`)
- **Variabili**: camelCase (`userName`)
- **Costanti**: UPPER_SNAKE_CASE (`API_BASE_URL`)

## 🎯 Prossimi Passi

Ora che hai creato il tuo progetto React con Vite, nelle prossime lezioni imparerai:

1. **Come avviare e sviluppare** l'applicazione
2. **La sintassi JSX** in dettaglio
3. **L'analisi del codice** di avvio
4. **Il Virtual DOM** e come funziona

## 📖 Risorse Aggiuntive

- **[Documentazione ufficiale Vite](https://vitejs.dev/)**
- **[Vite Guide per React](https://vitejs.dev/guide/)**
- **[Vite Config Reference](https://vitejs.dev/config/)**
- **[Vite Plugins](https://vitejs.dev/plugins/)**

---

**Prossima Lezione**: [Lezione 3 - Avviare il progetto](../03-avviare-progetto/README.md)
