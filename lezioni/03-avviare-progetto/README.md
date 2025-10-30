# Lezione 3: Avviare il Progetto

## 🎯 Obiettivi della Lezione

Al termine di questa lezione sarai in grado di:
- Avviare correttamente un progetto React con Vite
- Comprendere i comandi di sviluppo disponibili
- Utilizzare il server di sviluppo e le sue funzionalità
- Gestire il workflow di sviluppo quotidiano
- Risolvere problemi comuni di avvio

## 🚀 Avvio del Server di Sviluppo

### Comando Base

```bash
# Avvia il server di sviluppo
npm run dev
```

### Output Atteso

```bash
  VITE v7.1.4  ready in 284 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

## 🌐 Accesso all'Applicazione

### **URL Locale**
- **Indirizzo**: [http://localhost:5173](http://localhost:5173)
- **Porta predefinita**: 5173
- **Accesso**: Solo dal computer locale

### **URL di Rete** (Opzionale)
```bash
# Avvia con accesso di rete
npm run dev -- --host
```

**Output con accesso di rete:**
```bash
  VITE v7.1.4  ready in 284 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.100:5173/
  ➜  press h + enter to show help
```

## ⚙️ Opzioni di Avvio

### **Porta Personalizzata**

```bash
# Avvia su porta specifica
npm run dev -- --port 3000
```

### **Host Personalizzato**

```bash
# Avvia con host specifico
npm run dev -- --host 0.0.0.0
```

### **Modalità HTTPS**

```bash
# Avvia con HTTPS (richiede certificati)
npm run dev -- --https
```

### **Combinazione di Opzioni**

```bash
# Porta personalizzata + accesso di rete
npm run dev -- --port 3000 --host

# Modalità HTTPS + porta personalizzata
npm run dev -- --https --port 8080
```

## 🔧 Comandi di Sviluppo Disponibili

### **Script NPM Principali**

```json
{
  "scripts": {
    "dev": "vite",                    // Server di sviluppo
    "build": "vite build",            // Build di produzione
    "preview": "vite preview",        // Preview del build
    "lint": "eslint ."                // Linting del codice
  }
}
```

### **Comandi di Build**

```bash
# Build per produzione
npm run build

# Build con analisi del bundle
npm run build -- --analyze

# Build con modalità watch
npm run build -- --watch
```

### **Preview del Build**

```bash
# Preview del build di produzione
npm run preview

# Preview su porta specifica
npm run preview -- --port 4173
```

## 🔥 Hot Module Replacement (HMR)

### **Cos'è l'HMR?**

L'**Hot Module Replacement** è una funzionalità che permette di aggiornare i moduli dell'applicazione senza ricaricare completamente la pagina.

### **Come Funziona**

1. **Modifica** un file nel tuo progetto
2. **Salva** il file (Ctrl+S / Cmd+S)
3. **Vedi** le modifiche istantaneamente nel browser
4. **Mantieni** lo stato dell'applicazione

### **Esempio Pratico**

```tsx
// App.tsx - Stato iniziale
function App() {
  return (
    <div>
      <h1>Benvenuto in React con Vite</h1>
      <p>Questa è la mia prima app React!</p>
    </div>
  )
}
```

**Modifica il titolo:**
```tsx
// App.tsx - Dopo la modifica
function App() {
  return (
    <div>
      <h1>🚀 La Mia Prima App React con Vite</h1>  {/* Modificato */}
      <p>Questa è la mia prima app React!</p>
    </div>
  )
}
```

**Risultato**: Il titolo si aggiorna istantaneamente nel browser senza ricaricare la pagina!

## 🛠️ Workflow di Sviluppo

### **Flusso di Lavoro Tipico**

1. **Avvia** il server di sviluppo
   ```bash
   npm run dev
   ```

2. **Apri** il browser su [http://localhost:5173](http://localhost:5173)

3. **Modifica** il codice nei file sorgente

4. **Salva** il file (Ctrl+S / Cmd+S)

5. **Vedi** le modifiche istantaneamente

6. **Ripeti** il ciclo di modifica-salva-verifica

### **Struttura di Sviluppo Consigliata**

```
src/
├── components/          # Componenti riutilizzabili
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.css
│   │   └── index.ts
├── pages/              # Pagine dell'app
│   ├── Home.tsx
│   ├── About.tsx
│   └── Contact.tsx
├── hooks/              # Custom hooks
├── utils/              # Funzioni utility
├── services/           # Chiamate API
└── assets/             # Immagini, font, etc.
```

## 🔍 Debugging e DevTools

### **React DevTools**

1. **Installa** l'estensione del browser
   - [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
   - [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)
   - [Edge](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil)

2. **Apri** gli strumenti di sviluppo (F12)

3. **Trova** la tab "Components" o "React"

4. **Ispeziona** componenti, props, stato

### **Console del Browser**

```typescript
// Debugging nel codice
console.log('Valore del contatore:', count)
console.warn('Attenzione: valore alto')
console.error('Errore:', error)
```

### **Breakpoints**

```tsx
// Aggiungi breakpoints nel codice
function App() {
  const handleClick = () => {
    debugger // Breakpoint - l'esecuzione si fermerà qui
    console.log('Pulsante cliccato!')
  }
  
  return (
    <div>
      <h1>Debug Example</h1>
      <button onClick={handleClick}>
        Clicca qui
      </button>
    </div>
  )
}
```

## 🚨 Risoluzione Problemi Comuni

### **Problema: Porta già in uso**

```bash
# Errore
Error: listen EADDRINUSE: address already in use :::5173

# Soluzione 1: Usa porta diversa
npm run dev -- --port 3000

# Soluzione 2: Trova e termina il processo
lsof -ti:5173 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :5173   # Windows
```

### **Problema: Moduli non trovati**

```bash
# Errore
Error: Cannot find module 'react'

# Soluzione: Reinstalla dipendenze
rm -rf node_modules package-lock.json
npm install
```

### **Problema: HMR non funziona**

```bash
# Verifica che il file sia salvato
# Controlla la console per errori
# Riavvia il server di sviluppo
npm run dev
```

### **Problema: Build fallisce**

```bash
# Verifica errori di sintassi
npm run lint

# Controlla la console per errori specifici
npm run build
```

## 📊 Performance e Ottimizzazione

### **Modalità di Sviluppo vs Produzione**

| Caratteristica | Sviluppo | Produzione |
|----------------|----------|------------|
| **Velocità** | Ottimizzata per HMR | Ottimizzata per performance |
| **Bundle Size** | Più grande | Minificato e ottimizzato |
| **Source Maps** | Disponibili | Opzionali |
| **Error Messages** | Dettagliati | Minimi |

### **Monitoraggio Performance**

```bash
# Build con analisi
npm run build -- --analyze

# Preview con metriche
npm run preview -- --port 4173
```

## 🎯 Best Practices

### **Organizzazione del Codice**

1. **Separa** le responsabilità
2. **Usa** nomi descrittivi
3. **Mantieni** componenti piccoli
4. **Documenta** il codice

### **Workflow Efficace**

1. **Avvia** sempre con `npm run dev`
2. **Testa** frequentemente nel browser
3. **Usa** il linting per qualità codice
4. **Fai** commit regolari

### **Debugging Efficace**

1. **Usa** React DevTools
2. **Aggiungi** console.log strategici
3. **Testa** componenti isolatamente
4. **Verifica** la console per errori

## 🔄 Comandi di Utilità

### **Gestione Processi**

```bash
# Termina il server (Ctrl+C)
# Oppure trova e termina il processo
ps aux | grep vite
kill -9 <PID>
```

### **Pulizia Cache**

```bash
# Pulisci cache npm
npm cache clean --force

# Pulisci cache Vite
rm -rf node_modules/.vite
```

### **Aggiornamento Dipendenze**

```bash
# Controlla dipendenze obsolete
npm outdated

# Aggiorna dipendenze
npm update
```

## 📚 Risorse Utili

### **Documentazione**
- [Vite Dev Server](https://vitejs.dev/config/server-options.html)
- [Vite CLI](https://vitejs.dev/guide/cli.html)
- [React DevTools](https://react.dev/learn/react-developer-tools)

### **Strumenti**
- [VS Code React Snippets](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets)
- [React Developer Tools](https://react.dev/learn/react-developer-tools)
- [Vite Plugin React](https://github.com/vitejs/vite-plugin-react)

## 🎓 Esercizi Pratici

### **Esercizio 1: Avvio Base**
1. Avvia il server di sviluppo
2. Apri l'app nel browser
3. Modifica il titolo e verifica l'HMR

### **Esercizio 2: Configurazione Avanzata**
1. Avvia il server su porta 3000
2. Abilita l'accesso di rete
3. Testa l'accesso da un altro dispositivo

### **Esercizio 3: Debugging**
1. Aggiungi console.log nel codice
2. Usa React DevTools per ispezionare i componenti
3. Aggiungi breakpoints e debugga

---

**Prossima Lezione**: [Lezione 4 - Introduzione JSX](../04-introduzione-jsx/README.md)
