# 🚀 Corso React Base - Guida Completa

Un corso completo e pratico per imparare React dalle basi alle tecniche avanzate, con esempi funzionanti e best practices moderne.

> 🎯 **Stato Progetto**: **80% Completato** - Lezioni 1-15 complete con playground interattivo funzionante!

## 📋 Panoramica

Questo corso ti accompagnerà in un percorso completo di apprendimento di React, dalla creazione del primo progetto fino all'implementazione di pattern avanzati per la gestione dello stato e l'ottimizzazione delle performance.

### 🎯 Obiettivi del Corso

- **Imparare React dalle basi** con esempi pratici e funzionanti
- **Comprendere i concetti fondamentali** come componenti, props, stato e lifecycle
- **Padroneggiare gli hooks moderni** (useState, useEffect, useCallback, useMemo)
- **Implementare best practices** per performance e manutenibilità del codice
- **Utilizzare strumenti moderni** come Vite, React Query e React DevTools
- **Sviluppare applicazioni reali** con casi d'uso pratici

## 🏗️ Struttura del Corso

### ✅ Lezioni Fondamentali (1-6) - COMPLETATE
1. **[Introduzione a React](lezioni/01-introduzione-react/)** - Cos'è React e perché usarlo
2. **[Creare progetto React con Vite](lezioni/02-creare-progetto-vite/)** - Setup moderno con Vite
3. **[Avviare il progetto](lezioni/03-avviare-progetto/)** - Comandi e workflow di sviluppo
4. **[Introduzione JSX](lezioni/04-introduzione-jsx/)** - Sintassi e concetti base
5. **[Analisi avvio app](lezioni/05-analisi-avvio-app/)** - Cosa succede quando si avvia l'app
6. **[Virtual DOM](lezioni/06-virtual-dom/)** - Concetti e esempi pratici

### ✅ Componenti e Props (7a-7c) - COMPLETATE
7a. **[Logica componenti React](lezioni/07a-logica-componenti/)** - Componenti per UI e UX
7b. **[Composizione UI e props](lezioni/07b-composizione-ui-props/)** - Interazione tra componenti
7c. **[Conditional rendering](lezioni/07c-conditional-rendering/)** - Rendering condizionale

### ✅ State Management (8-10) - COMPLETATE + PLAYGROUND
8. **[Componenti stateless/stateful](lezioni/08-componenti-stateless-stateful/)** - useState e gestione stato
9. **[Tecniche gestione stato](lezioni/09-tecniche-gestione-stato/)** - Pattern e best practices
10. **[Passaggio stato tra componenti](lezioni/10-passaggio-stato-componenti/)** - Comunicazione tra componenti

### ✅ Interazione Utente (11) - COMPLETATA + PLAYGROUND
11. **[Interazione utente](lezioni/11-interazione-utente/)** - Input, validazione e gestione eventi

### ✅ useEffect e Lifecycle (12) - COMPLETATA + PLAYGROUND
12. **[useEffect e ciclo di vita](lezioni/12-useeffect-ciclo-vita/)** - Side effects, cleanup e gestione completa del lifecycle

### ✅ Performance e Ottimizzazione (13-15) - COMPLETATE + PLAYGROUND
13. **[useRef e manipolazione DOM](lezioni/13-useref-dom-performance/)** - Riferimenti DOM e performance
14. **[useMemo e useCallback](lezioni/14-usememo-usecallback/)** - Memoizzazione e ottimizzazione
15. **[Custom hooks](lezioni/15-custom-hooks/)** - Hook riutilizzabili e pattern avanzati

> 🎮 **Tutte le lezioni 08-15 sono disponibili nel [Playground Interattivo](progetto-base/)** con demo funzionanti e test completi!

### ⏳ React Query (16-16b) - IN SVILUPPO
16. **[Introduzione React Query](lezioni/16-introduzione-react-query/)** - Gestione stato server
16a. **[React Query cache](lezioni/16a-react-query-cache/)** - Ottimizzazione chiamate API
16b. **[Debug e monitoraggio](lezioni/16b-debug-monitoraggio/)** - Strumenti di sviluppo

### ✅ Suspense e Transizioni (17-17a) - COMPLETATE + PLAYGROUND
17. **[Suspense e transizioni](lezioni/17-suspense-transizioni/)** - Loading states e UX
17a. **[Esempi pratici Suspense](lezioni/17a-esempi-suspense/)** - Casi d'uso reali

## 🛠️ Prerequisiti

- **Conoscenza base di JavaScript ES6+** (arrow functions, destructuring, modules)
- **Familiarità con HTML/CSS**
- **Node.js 18+** installato sul sistema
- **Editor di codice** (VS Code consigliato)

## 🚀 Quick Start

### 1. Clona il Repository
```bash
git clone https://github.com/username/corso-react-base.git
cd corso-react-base
```

### 2. Installa le Dipendenze
```bash
cd progetto-base
npm install
```

### 3. Avvia il Playground Interattivo
```bash
npm run dev
```

### 4. Esplora le Demo
Vai su [http://localhost:5173](http://localhost:5173) per accedere al **Playground Interattivo** con tutte le demo delle lezioni 08-15.

### 5. Testa le Funzionalità
```bash
npm test        # Esegui i test degli hook personalizzati
npm run build   # Verifica che tutto compili correttamente
```

## 📁 Struttura del Repository

```
corso-react-base/
├── 📚 lezioni/                     # Tutte le lezioni del corso (1-17)
│   ├── 01-introduzione-react/      # ✅ Lezione 1 - Teoria + esempi
│   ├── 02-creare-progetto-vite/    # ✅ Lezione 2 - Setup Vite
│   ├── ...                         # ✅ Lezioni 3-15 complete
│   ├── 16-suspense-transizioni/    # ⏳ In sviluppo
│   └── 17-introduzione-react-query/ # ⏳ In sviluppo
├── 🎮 progetto-base/               # Playground interattivo React
│   ├── src/lezioni/                # Demo integrate (08-15)
│   │   ├── GlobalSwitcher.jsx      # Switcher principale
│   │   ├── 08-componenti-stateless-stateful/
│   │   ├── 09-tecniche-gestione-stato/
│   │   └── ...                     # Demo per ogni lezione
│   ├── src/hooks/                  # Custom hooks testati
│   └── package.json                # Dipendenze + script test
├── 📖 docs/                        # Documentazione aggiuntiva
└── 🎯 README.md                    # Questa guida
```

## 🎓 Come Utilizzare il Corso

### 🎮 Playground Interattivo (Lezioni 08-15)
Il modo più veloce per esplorare le funzionalità di React:

1. **Avvia il playground**: `cd progetto-base && npm run dev`
2. **Seleziona una lezione** dal dropdown nel browser
3. **Interagisci con le demo** per vedere React in azione
4. **Studia il codice sorgente** in `progetto-base/src/lezioni/`

### 📚 Studio Approfondito (Tutte le Lezioni)
Per ogni lezione:
1. **Leggi la teoria** nel file `README.md` della lezione
2. **Studia gli esempi** nella cartella `esempi/`
3. **Prova nel playground** (se disponibile)
4. **Sperimenta** modificando il codice
5. **Testa le modifiche** per consolidare l'apprendimento

### 🧪 Testing e Sviluppo
```bash
cd progetto-base
npm test          # Test degli hook personalizzati (Lezione 15)
npm run build     # Verifica build di produzione
npm run dev       # Sviluppo con hot reload
```

### 📖 Esempi di Codice:
- Ogni esempio è **completamente funzionante**
- Può essere **eseguito indipendentemente**
- Include **commenti dettagliati**
- Segue le **best practices** moderne

## 🔧 Script Disponibili

### Playground (progetto-base/)
```bash
cd progetto-base

# Sviluppo
npm run dev          # Avvia playground interattivo
npm run build        # Build per produzione
npm run preview      # Preview del build

# Testing
npm test             # Test hook personalizzati (Vitest)
npm run test:ui      # Test con interfaccia grafica

# Qualità del codice
npm run lint         # ESLint per controllo codice
```

### Repository Principale
```bash
# Setup iniziale
npm run setup        # Installa tutte le dipendenze
npm run install-all  # Installa dipendenze principali e progetto base
```

## 📖 Risorse Aggiuntive

- **[Documentazione ufficiale React](https://react.dev/)**
- **[Vite Documentation](https://vitejs.dev/)**
- **[React Query Documentation](https://tanstack.com/query/latest)**
- **[React DevTools](https://react.dev/learn/react-developer-tools)**

## 🤝 Contributi

I contributi sono benvenuti! Se trovi errori o vuoi migliorare il corso:

1. Fai un fork del repository
2. Crea un branch per la tua modifica
3. Fai commit delle modifiche
4. Apri una Pull Request

## 📄 Licenza

Questo progetto è rilasciato sotto licenza MIT. Vedi il file [LICENSE](LICENSE) per i dettagli.

## 🆘 Supporto

Se hai domande o problemi:

- Apri una [issue](https://github.com/username/corso-react-base/issues)
- Consulta la [documentazione](docs/)
- Controlla gli [esempi](esempi/)

---

**Buon apprendimento! 🎉**

*Questo corso è progettato per essere pratico e hands-on. Non esitare a sperimentare con il codice e a fare domande lungo il percorso.*
