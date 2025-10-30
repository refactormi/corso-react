# 🎮 Playground Interattivo - Corso React Base

Un ambiente di sviluppo interattivo per esplorare le funzionalità di React con demo pratiche delle lezioni 08-19.

## 🚀 Quick Start

### 1. Installa le Dipendenze
```bash
npm install
```

### 2. Avvia il Playground
```bash
npm run dev
```

### 3. Apri il Browser
Vai su [http://localhost:5173](http://localhost:5173) per accedere al playground.

## 🎯 Cosa Troverai

### 📚 Demo Interattive Disponibili

| Lezione | Argomento | Demo Incluse |
|---------|-----------|--------------|
| **08** | Componenti Stateless/Stateful | Counter, TodoList, useState |
| **09** | Tecniche Gestione Stato | useReducer (carrello), validazione form |
| **10** | Passaggio Stato | Context API, lifting state up, comunicazione |
| **11** | Interazione Utente | Form complessi, validazione avanzata, eventi |
| **12** | useEffect e Ciclo di Vita | Timer, fetch dati, localStorage, cleanup |
| **15** | useRef e DOM | Focus, scroll, misurazioni, performance |
| **16** | useMemo e useCallback | Ottimizzazioni, memoizzazione, calcoli |
| **17** | Custom Hooks | useLocalStorage, usePrevious, useApi, ecc. |
| **18** | React Query | Query, mutations, cache, refetch |
| **19** | Suspense e Transizioni | Loading states, transizioni, nested suspense |
| **19a** | Esempi Suspense | Error boundaries, lazy routing, progressive loading |

### 🎛️ Come Navigare

1. **Selettore Lezioni**: Usa il dropdown in alto per scegliere la lezione
2. **Demo Interattive**: Ogni lezione ha componenti funzionanti da testare
3. **Codice Sorgente**: Esplora `src/lezioni/` per vedere l'implementazione

## 🧪 Testing

### Test degli Hook Personalizzati (Lezione 17)
```bash
# Esegui tutti i test
npm test

# Test con interfaccia grafica
npm run test:ui

# Test in modalità watch
npm run test:watch
```

### Test Coverage
- ✅ `useLocalStorage` - 5/5 test
- ✅ `usePrevious` - 4/4 test  
- ✅ `useDebouncedValue` - 4/4 test
- ✅ `useInterval` - 3/3 test
- ✅ `useApi` - 4/4 test

## 🏗️ Struttura del Progetto

```
progetto-base/
├── src/
│   ├── lezioni/                    # Demo delle lezioni
│   │   ├── 08-componenti-stateless-stateful/
│   │   ├── 09-tecniche-gestione-stato/
│   │   ├── 10-passaggio-stato-componenti/
│   │   ├── 11-interazione-utente-validazione/
│   │   ├── 12-useeffect-ciclo-vita/
│   │   ├── 15-useref-manipolazione-dom/
│   │   ├── 16-usememo-usecallback/
│   │   ├── 17-custom-hooks/
│   │   ├── 18-introduzione-react-query/
│   │   ├── 19-suspense-transizioni/
│   │   ├── 19a-esempi-suspense/
│   │   └── GlobalSwitcher.tsx     # Selettore demo
│   ├── hooks/                     # Custom hooks (Lezione 17)
│   │   ├── useLocalStorage.ts
│   │   ├── usePrevious.ts
│   │   ├── useDebouncedValue.ts
│   │   ├── useInterval.ts
│   │   └── useApi.ts
│   ├── App.tsx                    # Componente principale
│   └── main.tsx                   # Entry point
├── vitest.config.ts               # Configurazione test
├── vitest.setup.ts                # Setup test environment
└── package.json                   # Dipendenze e script
```

## 🔧 Script Disponibili

```bash
# Sviluppo
npm run dev          # Avvia server di sviluppo (http://localhost:5173)
npm run build        # Build per produzione
npm run preview      # Preview del build

# Testing
npm test             # Esegui test (Vitest)
npm run test:ui      # Test con interfaccia grafica
npm run test:watch   # Test in modalità watch

# Qualità del codice
npm run lint         # ESLint per controllo codice
```

## 🎨 Tecnologie Utilizzate

- **⚡ Vite** - Build tool veloce e moderno
- **⚛️ React 19** - Libreria UI con hooks moderni
- **📘 TypeScript** - Type safety e migliore developer experience
- **🧪 Vitest** - Framework di testing veloce
- **🎭 JSDOM** - Ambiente DOM per test
- **🧩 React Testing Library** - Utility per test componenti

## 💡 Suggerimenti per l'Apprendimento

### 🔍 Esplorazione del Codice
1. **Inizia dalle demo semplici** (Lezione 08) e procedi gradualmente
2. **Modifica il codice** per vedere come cambia il comportamento
3. **Usa gli strumenti di sviluppo** del browser (React DevTools)
4. **Esegui i test** per capire come funzionano gli hook

### 🎯 Focus per Lezione
- **08-09**: Comprendi la gestione dello stato
- **10**: Impara la comunicazione tra componenti  
- **11**: Padroneggia form e validazione
- **12**: Domina useEffect e side effects
- **13-14**: Analizza performance e usa Context API
- **15**: Esplora useRef e manipolazione DOM
- **16**: Ottimizza con memoizzazione
- **17**: Crea hook riutilizzabili
- **18**: Gestisci stato server con React Query
- **19-19a**: Implementa Suspense e transizioni

### 🚀 Prossimi Passi
Dopo aver esplorato il playground:
1. Studia la teoria nelle cartelle `lezioni/`
2. Prova a creare i tuoi componenti
3. Implementa i pattern appresi nei tuoi progetti
4. Completa tutte le 20 lezioni del corso

## 🆘 Risoluzione Problemi

### Port già in uso
```bash
# Se la porta 5173 è occupata
npm run dev -- --port 3000
```

### Errori di dipendenze
```bash
# Reinstalla le dipendenze
rm -rf node_modules package-lock.json
npm install
```

### Test non funzionanti
```bash
# Verifica setup test
npm run test -- --reporter=verbose
```

---

**Buon apprendimento! 🎉**

*Questo playground è progettato per essere hands-on. Sperimenta, modifica il codice e divertiti a imparare React!*