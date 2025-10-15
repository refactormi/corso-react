# Struttura del Repository - Corso React Base

## Organizzazione delle Cartelle

```
corso-react/
├── lezioni/                          # Tutte le lezioni del corso
│   ├── 01-introduzione-react/        # Lezione 1: Introduzione a React
│   ├── 02-creare-progetto-vite/      # Lezione 2: Creare progetto React con Vite
│   ├── 03-avviare-progetto/          # Lezione 3: Avviare il progetto
│   ├── 04-introduzione-jsx/          # Lezione 4: Introduzione JSX
│   ├── 05-analisi-avvio-app/         # Lezione 5: Analisi avvio app
│   ├── 06-virtual-dom/               # Lezione 6: Virtual DOM
│   ├── 07a-logica-componenti/        # Lezione 7a: Logica componenti React
│   ├── 07b-composizione-ui-props/    # Lezione 7b: Composizione UI e props
│   ├── 07c-conditional-rendering/    # Lezione 7c: Conditional rendering
│   ├── 08-componenti-stateless-stateful/ # Lezione 8: Componenti stateless/stateful
│   ├── 09-tecniche-gestione-stato/   # Lezione 9: Tecniche gestione stato
│   ├── 10-passaggio-stato-componenti/ # Lezione 10: Passaggio stato tra componenti
│   ├── 11-interazione-utente/        # Lezione 11: Interazione utente
│   ├── 12-introduzione-useeffect/    # Lezione 12: Introduzione useEffect
│   ├── 12b-ciclo-vita-componenti/    # Lezione 12b: Ciclo di vita componenti
│   ├── 12c-useeffect-dipendenze-vuote/ # Lezione 12c: useEffect dipendenze vuote
│   ├── 12d-useeffect-dipendenze-popolate/ # Lezione 12d: useEffect dipendenze popolate
│   ├── 12e-useeffect-senza-dipendenze/ # Lezione 12e: useEffect senza dipendenze
│   ├── 12f-useeffect-cleanup/        # Lezione 12f: useEffect e cleanup
│   ├── 13-analisi-performance/       # Lezione 13: Analisi performance
│   ├── 14-memoization-usecallback/   # Lezione 14: Memoization e useCallback
│   ├── 15-custom-hooks/              # Lezione 15: Custom hooks
│   ├── 15b-custom-hook-api/          # Lezione 15b: Custom hook per API
│   ├── 16-suspense-transizioni/      # Lezione 16: Suspense e transizioni
│   ├── 16a-esempi-suspense/          # Lezione 16a: Esempi pratici Suspense
│   ├── 17-introduzione-react-query/  # Lezione 17: Introduzione React Query
│   ├── 17a-react-query-cache/        # Lezione 17a: React Query cache
│   └── 17b-debug-monitoraggio/       # Lezione 17b: Debug e monitoraggio
├── esempi/                           # Esempi di codice organizzati per categoria
│   ├── base/                         # Esempi base e fondamentali
│   ├── avanzati/                     # Esempi avanzati e pattern complessi
│   └── performance/                  # Esempi di ottimizzazione performance
├── docs/                             # Documentazione aggiuntiva
├── assets/                           # Risorse statiche (immagini, file, etc.)
└── .cursor/                          # File di pianificazione e tracking
    └── scratchpad.md
```

## Struttura di Ogni Lezione

Ogni cartella lezione conterrà:
- `README.md` - Teoria e spiegazioni
- `esempi/` - Codice di esempio funzionante
- `esercizi/` - Esercizi pratici (se applicabile)
- `test/` - Test per validare gli esempi

## Convenzioni di Nomenclatura

- **Lezioni**: Numero progressivo + descrizione breve
- **File**: Nome descrittivo in kebab-case
- **Componenti**: PascalCase per i componenti React
- **Funzioni**: camelCase per funzioni e variabili
