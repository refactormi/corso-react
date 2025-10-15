# Esercizi - Lezione 7a: Logica dei Componenti React

## 🎯 Obiettivi degli Esercizi

Questi esercizi ti aiuteranno a consolidare i concetti di componenti React appresi nella lezione.

## 📝 Esercizio 1: Componente Button Riutilizzabile

**Obiettivo**: Creare un componente Button riutilizzabile con diverse varianti

**Istruzioni**:
1. Crea un componente `Button` che accetti le seguenti props:
   - `children`: contenuto del pulsante
   - `variant`: 'primary', 'secondary', 'danger'
   - `size`: 'small', 'medium', 'large'
   - `disabled`: boolean
   - `onClick`: funzione di callback

2. Implementa gli stili per ogni variante e dimensione

3. Aggiungi la gestione dello stato disabled

**Template**:
```jsx
function Button({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  onClick,
  ...props 
}) {
  // Il tuo codice qui
}
```

**Risultato atteso**: Un componente Button completamente funzionale e riutilizzabile.

---

## 📝 Esercizio 2: Componente Card

**Obiettivo**: Creare un componente Card per contenere contenuto

**Istruzioni**:
1. Crea un componente `Card` che accetti:
   - `title`: titolo opzionale della card
   - `children`: contenuto della card
   - `footer`: contenuto opzionale del footer

2. Implementa una struttura con header, body e footer

3. Aggiungi stili CSS per rendere la card accattivante

**Template**:
```jsx
function Card({ title, children, footer, className = '' }) {
  return (
    <div className={`card ${className}`}>
      {/* Il tuo codice qui */}
    </div>
  );
}
```

**Risultato atteso**: Una card stilizzata con header, body e footer opzionali.

---

## 📝 Esercizio 3: Componente UserCard

**Obiettivo**: Creare un componente per visualizzare informazioni utente

**Istruzioni**:
1. Crea un componente `UserCard` che accetti un oggetto `user` con:
   - `name`: nome dell'utente
   - `email`: email dell'utente
   - `avatar`: URL dell'avatar
   - `role`: ruolo dell'utente

2. Utilizza il componente `Card` creato nell'esercizio precedente

3. Aggiungi pulsanti per "Modifica" e "Elimina"

**Template**:
```jsx
function UserCard({ user, onEdit, onDelete }) {
  return (
    <Card 
      title={user.name}
      footer={
        <div>
          <Button onClick={() => onEdit(user)}>Modifica</Button>
          <Button variant="danger" onClick={() => onDelete(user.id)}>
            Elimina
          </Button>
        </div>
      }
    >
      {/* Il tuo codice qui */}
    </Card>
  );
}
```

**Risultato atteso**: Una card utente con informazioni e azioni.

---

## 📝 Esercizio 4: Componente Lista Utenti

**Obiettivo**: Creare un componente container per gestire una lista di utenti

**Istruzioni**:
1. Crea un componente `UserList` che:
   - Gestisca uno stato `users` con useState
   - Simuli il caricamento con useEffect
   - Mostri uno stato di loading
   - Utilizzi il componente `UserCard`

2. Implementa le funzioni per modificare ed eliminare utenti

3. Aggiungi la gestione degli errori

**Template**:
```jsx
function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simula caricamento dati
    setTimeout(() => {
      setUsers([
        { id: 1, name: 'Mario Rossi', email: 'mario@example.com', role: 'Developer' },
        // Altri utenti...
      ]);
      setLoading(false);
    }, 1000);
  }, []);
  
  const handleEdit = (user) => {
    // Logica per modificare utente
  };
  
  const handleDelete = (userId) => {
    // Logica per eliminare utente
  };
  
  if (loading) {
    return <div>Caricamento...</div>;
  }
  
  return (
    <div>
      {users.map(user => (
        <UserCard 
          key={user.id} 
          user={user} 
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
```

**Risultato atteso**: Una lista di utenti con funzionalità CRUD.

---

## 📝 Esercizio 5: Componente Form Utente

**Obiettivo**: Creare un form per aggiungere/modificare utenti

**Istruzioni**:
1. Crea un componente `UserForm` che:
   - Gestisca lo stato del form con useState
   - Validazione dei campi obbligatori
   - Gestione degli errori
   - Submit del form

2. Implementa la validazione per:
   - Nome (obbligatorio)
   - Email (obbligatorio, formato valido)
   - Età (obbligatorio, minimo 18)

3. Utilizza il componente `Button` per il submit

**Template**:
```jsx
function UserForm({ onSubmit, initialUser = null }) {
  const [formData, setFormData] = useState({
    name: initialUser?.name || '',
    email: initialUser?.email || '',
    age: initialUser?.age || ''
  });
  
  const [errors, setErrors] = useState({});
  
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const validateForm = () => {
    // Logica di validazione
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* I tuoi campi qui */}
    </form>
  );
}
```

**Risultato atteso**: Un form funzionale con validazione.

---

## 🎯 Esercizio Bonus: Applicazione Completa

**Obiettivo**: Combinare tutti i componenti in un'applicazione funzionale

**Istruzioni**:
1. Crea un componente `UserManager` che:
   - Utilizzi `UserList` per mostrare gli utenti
   - Utilizzi `UserForm` per aggiungere/modificare utenti
   - Gestisca lo stato globale degli utenti

2. Implementa le funzionalità:
   - Aggiungere nuovo utente
   - Modificare utente esistente
   - Eliminare utente
   - Validazione completa

3. Aggiungi uno stato di modifica per distinguere tra creazione e modifica

**Template**:
```jsx
function UserManager() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  const handleAddUser = (userData) => {
    // Logica per aggiungere utente
  };
  
  const handleEditUser = (user) => {
    // Logica per modificare utente
  };
  
  const handleDeleteUser = (userId) => {
    // Logica per eliminare utente
  };
  
  return (
    <div>
      <Button onClick={() => setShowForm(true)}>
        Aggiungi Utente
      </Button>
      
      {showForm && (
        <UserForm 
          onSubmit={handleAddUser}
          initialUser={editingUser}
        />
      )}
      
      <UserList 
        users={users}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
      />
    </div>
  );
}
```

**Risultato atteso**: Un'applicazione completa per la gestione utenti.

---

## 🔍 Domande di Riflessione

1. **Componenti Presentazionali vs Container**: Qual è la differenza e quando usare l'uno o l'altro?

2. **Single Responsibility**: Come applicare il principio di responsabilità singola ai componenti?

3. **Riutilizzabilità**: Come rendere un componente più riutilizzabile?

4. **Performance**: Quali tecniche usare per ottimizzare le performance dei componenti?

5. **Composizione**: Come usare la composizione invece dell'ereditarietà?

---

## ✅ Checklist di Completamento

- [ ] Ho creato un componente Button riutilizzabile
- [ ] Ho implementato un componente Card modulare
- [ ] Ho sviluppato un UserCard con azioni
- [ ] Ho costruito una UserList con gestione stato
- [ ] Ho realizzato un UserForm con validazione
- [ ] Ho combinato tutti i componenti in un'app completa
- [ ] Ho testato tutte le funzionalità
- [ ] Ho applicato i principi di design appresi

---

## 🆘 Suggerimenti

- **Inizia semplice**: Crea prima i componenti base, poi combinali
- **Testa spesso**: Verifica ogni componente individualmente
- **Usa la console**: Aggiungi console.log per debuggare
- **Sperimenta**: Prova diverse varianti e stili
- **Documenta**: Aggiungi commenti per spiegare la logica

---

## 📚 Risorse Utili

- [React Components](https://react.dev/learn/your-first-component)
- [Component Composition](https://react.dev/learn/passing-props-to-a-component)
- [Thinking in React](https://react.dev/learn/thinking-in-react)
- [Component Best Practices](https://react.dev/learn/keeping-components-pure)

---

**Prossima Lezione**: [Lezione 7b - Composizione UI e props](../07b-composizione-ui-props/README.md)
