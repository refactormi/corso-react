# Esercizi - Lezione 1: Introduzione a React

## 🎯 Obiettivi degli Esercizi

Questi esercizi ti aiuteranno a consolidare i concetti fondamentali di React appresi nella lezione.

## 📝 Esercizio 1: Primo Componente

**Obiettivo**: Creare il tuo primo componente React

**Istruzioni**:
1. Apri il file `hello-world.html` nella cartella esempi
2. Modifica il componente `Welcome` per includere il tuo nome
3. Aggiungi un'emoji personalizzata
4. Cambia il colore del testo

**Codice di partenza**:
```jsx
function Welcome() {
    return <h2>Benvenuto in React! 🎉</h2>;
}
```

**Risultato atteso**: Un componente che mostra "Ciao, [Tuo Nome]! [Tua Emoji]" con un colore personalizzato.

---

## 📝 Esercizio 2: Componente con Props

**Obiettivo**: Creare un componente che accetta e utilizza props

**Istruzioni**:
1. Crea un nuovo componente chiamato `UserCard`
2. Il componente deve accettare le props: `name`, `email`, `role`
3. Mostra le informazioni in una card stilizzata
4. Aggiungi un'immagine placeholder

**Template**:
```jsx
function UserCard({ name, email, role }) {
    return (
        <div className="user-card">
            {/* Il tuo codice qui */}
        </div>
    );
}
```

**Risultato atteso**: Una card che mostra nome, email e ruolo di un utente.

---

## 📝 Esercizio 3: Componente con Stato

**Obiettivo**: Implementare un componente con stato interno

**Istruzioni**:
1. Crea un componente `TodoItem`
2. Usa `useState` per gestire lo stato "completato"
3. Aggiungi un pulsante per toggleare lo stato
4. Cambia lo stile in base allo stato

**Template**:
```jsx
function TodoItem({ text }) {
    const [completed, setCompleted] = React.useState(false);
    
    return (
        <div className={`todo-item ${completed ? 'completed' : ''}`}>
            {/* Il tuo codice qui */}
        </div>
    );
}
```

**Risultato atteso**: Un elemento todo che può essere marcato come completato.

---

## 📝 Esercizio 4: Componente Interattivo Avanzato

**Obiettivo**: Creare un componente con multiple interazioni

**Istruzioni**:
1. Crea un componente `ColorPicker`
2. Usa `useState` per gestire il colore selezionato
3. Aggiungi almeno 5 colori predefiniti
4. Mostra il nome del colore selezionato
5. Aggiungi un pulsante per colore casuale

**Template**:
```jsx
function ColorPicker() {
    const [selectedColor, setSelectedColor] = React.useState('#61dafb');
    const colors = ['#61dafb', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'];
    
    return (
        <div>
            {/* Il tuo codice qui */}
        </div>
    );
}
```

**Risultato atteso**: Un selettore di colori interattivo con preview.

---

## 🎯 Esercizio Bonus: Mini Applicazione

**Obiettivo**: Combinare tutti i concetti appresi

**Istruzioni**:
1. Crea un componente `App` principale
2. Includi tutti i componenti creati negli esercizi precedenti
3. Aggiungi un header con il titolo dell'applicazione
4. Organizza i componenti in sezioni logiche
5. Aggiungi stili CSS per rendere l'app accattivante

**Template**:
```jsx
function App() {
    return (
        <div className="app">
            <header>
                <h1>La Mia Prima App React! 🚀</h1>
            </header>
            <main>
                {/* I tuoi componenti qui */}
            </main>
        </div>
    );
}
```

---

## 🔍 Domande di Riflessione

1. **Componenti vs Funzioni**: Qual è la differenza tra una funzione JavaScript normale e un componente React?

2. **Props vs Stato**: Quando useresti le props e quando lo stato interno?

3. **JSX vs HTML**: Quali sono le principali differenze tra JSX e HTML?

4. **Performance**: Perché React utilizza il Virtual DOM?

5. **Riutilizzabilità**: Come rendi un componente più riutilizzabile?

---

## ✅ Checklist di Completamento

- [ ] Ho creato il mio primo componente React
- [ ] Ho utilizzato le props per passare dati
- [ ] Ho implementato lo stato con useState
- [ ] Ho gestito eventi e interazioni
- [ ] Ho combinato più componenti in un'app
- [ ] Ho aggiunto stili CSS personalizzati
- [ ] Ho testato tutti i componenti nel browser

---

## 🆘 Suggerimenti

- **Inizia semplice**: Non cercare di fare tutto in una volta
- **Testa spesso**: Apri il file HTML nel browser per vedere i risultati
- **Usa la console**: Controlla la console del browser per eventuali errori
- **Sperimenta**: Prova a modificare i valori e vedere cosa succede
- **Documenta**: Aggiungi commenti al tuo codice per spiegare cosa fa

---

## 📚 Risorse Utili

- [React DevTools](https://react.dev/learn/react-developer-tools) - Per debugging
- [JSX in Depth](https://react.dev/learn/writing-markup-with-jsx) - Per approfondire JSX
- [React Hooks](https://react.dev/reference/react) - Per esplorare gli hooks

---

**Prossima Lezione**: [Lezione 2 - Creare progetto React con Vite](../02-creare-progetto-vite/README.md)
