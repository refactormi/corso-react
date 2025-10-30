# Struttura del Repository - Corso React Base

## Organizzazione delle Cartelle

```
corso-react/
├── lezioni/                          # Tutte le lezioni del corso (21 lezioni totali)
│   ├── 01-introduzione-react/        # Lezione 1: Introduzione a React
│   ├── 02-creare-progetto-vite/      # Lezione 2: Creare progetto React con Vite
│   ├── 03-avviare-progetto/          # Lezione 3: Avviare il progetto
│   ├── 04-introduzione-jsx/         # Lezione 4: Introduzione JSX
│   ├── 05-analisi-avvio-app/        # Lezione 5: Analisi avvio app
│   ├── 06-virtual-dom/              # Lezione 6: Virtual DOM
│   ├── 07a-logica-componenti/       # Lezione 7a: Logica componenti React
│   ├── 07b-composizione-ui-props/   # Lezione 7b: Composizione UI e props
│   ├── 07c-conditional-rendering/   # Lezione 7c: Conditional rendering
│   ├── 08-componenti-stateless-stateful/ # Lezione 8: Componenti stateless/stateful
│   ├── 09-tecniche-gestione-stato/  # Lezione 9: Tecniche gestione stato
│   ├── 10-passaggio-stato-componenti/ # Lezione 10: Passaggio stato tra componenti
│   ├── 11-interazione-utente/       # Lezione 11: Interazione utente
│   ├── 12-useeffect-ciclo-vita/      # Lezione 12: useEffect e ciclo di vita
│   ├── 13-analisi-performance/      # Lezione 13: Analisi performance e rendering
│   ├── 14-context-api/              # Lezione 14: Context API
│   ├── 14a-context-vs-zustand/      # Lezione 14a: Context API vs Zustand
│   ├── 15-useref-manipolazione-dom/ # Lezione 15: useRef e manipolazione DOM
│   ├── 16-usememo-usecallback/      # Lezione 16: useMemo e useCallback
│   ├── 17-custom-hooks/             # Lezione 17: Custom hooks
│   ├── 18-introduzione-react-query/ # Lezione 18: Introduzione React Query
│   ├── 18a-react-query-cache/       # Lezione 18a: React Query cache
│   ├── 18b-debug-monitoraggio/      # Lezione 18b: Debug e monitoraggio
│   ├── 19-suspense-transizioni/      # Lezione 19: Suspense e transizioni
│   └── 19a-esempi-suspense/         # Lezione 19a: Esempi pratici Suspense
├── progetto-base/                   # Playground interattivo React
│   ├── src/
│   │   ├── lezioni/                  # Demo integrate (08-19a)
│   │   │   ├── GlobalSwitcher.tsx    # Switcher principale
│   │   │   ├── 08-componenti-stateless-stateful/
│   │   │   ├── 09-tecniche-gestione-stato/
│   │   │   ├── 10-passaggio-stato-componenti/
│   │   │   ├── 11-interazione-utente-validazione/
│   │   │   ├── 12-useeffect-ciclo-vita/
│   │   │   ├── 15-useref-manipolazione-dom/
│   │   │   ├── 16-usememo-usecallback/
│   │   │   ├── 17-custom-hooks/
│   │   │   ├── 18-introduzione-react-query/
│   │   │   ├── 19-suspense-transizioni/
│   │   │   └── 19a-esempi-suspense/
│   │   ├── hooks/                    # Custom hooks testati
│   │   ├── App.tsx                    # Componente principale
│   │   └── main.tsx                   # Entry point
│   └── package.json                   # Dipendenze e script
├── assets/                           # Risorse statiche (immagini, file, etc.)
└── .cursor/                          # File di pianificazione e tracking
    └── scratchpad.md
```

## Struttura di Ogni Lezione

Ogni cartella lezione conterrà:
- `README.md` - Teoria e spiegazioni dettagliate
- `esempi/` - Codice di esempio funzionante (TypeScript)
- `esercizi/` - Esercizi pratici (se applicabile)
- `test/` - Test per validare gli esempi (se applicabile)

## Convenzioni di Nomenclatura

- **Lezioni**: Numero progressivo + descrizione breve in kebab-case
- **File**: Nome descrittivo in kebab-case con estensione `.tsx` (TypeScript)
- **Componenti**: PascalCase per i componenti React
- **Funzioni**: camelCase per funzioni e variabili
- **Hooks**: camelCase con prefisso "use" (es: `useLocalStorage`, `useCounter`)

## Sequenza delle Lezioni

### Lezioni Fondamentali (1-6)
Introduzione, setup progetto, JSX, Virtual DOM

### Componenti e Props (7a-7c)
Logica componenti, composizione, rendering condizionale

### State Management (8-10)
useState, pattern avanzati, comunicazione tra componenti

### Interazione e Lifecycle (11-12)
Gestione eventi, validazione, useEffect e side effects

### Performance e Analisi (13-14a)
Analisi performance, Context API, Context API vs Zustand

### Ottimizzazione (15-17)
useRef, memoizzazione, custom hooks

### React Query (18-18b)
Gestione stato server, cache, debug

### Suspense e Transizioni (19-19a)
Loading states, transizioni, pattern avanzati

## Tecnologie Utilizzate

- **React 19.1.1** - Libreria UI moderna
- **TypeScript 5.9.3** - Type safety e migliore developer experience
- **Vite 7.1.4** - Build tool veloce e moderno
- **Vitest** - Framework di testing
- **React Query** - Gestione stato server (Lezioni 18-18b)
- **Zustand** - State management moderno (Lezione 14a)

## Note Importanti

- Tutte le lezioni utilizzano **TypeScript** per type safety
- Le demo interattive sono disponibili nel **playground** (lezioni 08-19a)
- Ogni esempio è completamente funzionante e può essere eseguito indipendentemente
- I file sono organizzati per facilitare l'apprendimento progressivo
