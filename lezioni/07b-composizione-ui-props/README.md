# Lezione 7b: Composizione della User Interface - Interazione tra Componenti

## 🎯 Obiettivi della Lezione

Al termine di questa lezione sarai in grado di:
- Comprendere come i componenti interagiscono tra loro
- Padroneggiare il passaggio di props tra componenti
- Implementare pattern di composizione efficaci
- Gestire il flusso di dati unidirezionale
- Creare interfacce modulari e scalabili

## 📚 Cos'è la Composizione UI?

La **composizione UI** è il processo di combinare componenti più piccoli per creare interfacce più complesse. È uno dei principi fondamentali di React che permette di costruire applicazioni modulari e riutilizzabili.

### Definizione Ufficiale
> "La composizione è uno dei principi fondamentali di React. Invece di ereditarietà, React raccomanda la composizione per riutilizzare il codice tra componenti." - [React.dev](https://react.dev/learn/passing-props-to-a-component)

## 🔄 Flusso di Dati in React

### **Flusso Unidirezionale**

```jsx
// 1. Dati fluiscono dal componente padre ai figli
function App() {
  // Dati definiti nel componente padre
  const user = { name: 'Mario', age: 25 };
  
  return (
    <div>
      <UserProfile user={user} />
      <UserSettings user={user} />
    </div>
  );
}

// 2. I componenti figli ricevono i dati tramite props
function UserProfile({ user }) {
  return (
    <div>
      <h1>{user.name}</h1>
      <p>Età: {user.age}</p>
    </div>
  );
}

function UserSettings({ user }) {
  return (
    <div>
      <h2>Impostazioni per {user.name}</h2>
    </div>
  );
}
```

**Caratteristiche del flusso unidirezionale:**
- **Prevedibile** - I dati fluiscono sempre in una direzione
- **Debugging facile** - È sempre chiaro da dove vengono i dati
- **Performance** - React può ottimizzare gli aggiornamenti
- **Manutenibilità** - Codice più facile da comprendere e modificare

## 🎨 Pattern di Composizione

### **1. Composizione con Children**

```jsx
// Componente contenitore che accetta children
function Card({ title, children, footer }) {
  return (
    <div className="card">
      {title && <div className="card-header">{title}</div>}
      <div className="card-body">
        {children}
      </div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
}

// Utilizzo con children
function UserProfile() {
  return (
    <Card 
      title="Profilo Utente"
      footer={<button>Modifica</button>}
    >
      <img src="/avatar.jpg" alt="Avatar" />
      <h3>Mario Rossi</h3>
      <p>mario@example.com</p>
    </Card>
  );
}
```

### **2. Composizione con Props**

```jsx
// Componente che accetta componenti come props
function Layout({ header, sidebar, main, footer }) {
  return (
    <div className="layout">
      <header className="layout-header">{header}</header>
      <div className="layout-content">
        <aside className="layout-sidebar">{sidebar}</aside>
        <main className="layout-main">{main}</main>
      </div>
      <footer className="layout-footer">{footer}</footer>
    </div>
  );
}

// Utilizzo
function App() {
  return (
    <Layout
      header={<Header />}
      sidebar={<Sidebar />}
      main={<MainContent />}
      footer={<Footer />}
    />
  );
}
```

### **3. Composizione con Render Props**

```jsx
// Componente che accetta una funzione come prop
function DataDisplay({ data, loading, render }) {
  return render({ data, loading });
}

// Utilizzo
function UserList() {
  // In una vera app, questi dati arriverebbero da un'API
  const users = [
    { id: 1, name: 'Mario' },
    { id: 2, name: 'Luigi' }
  ];
  const loading = false;
  
  return (
    <DataDisplay
      data={users}
      loading={loading}
      render={({ data, loading }) => (
        loading ? (
          <div>Caricamento...</div>
        ) : (
          <ul>
            {data.map(user => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
        )
      )}
    />
  );
}
```

**Nota**: Il pattern render props è molto potente per creare componenti riutilizzabili. Nella prossima lezione imparerai come rendere questi dati dinamici!

## 🔧 Passaggio di Props

### **Props Semplici**

```jsx
// Passaggio di valori primitivi
function Button({ text, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {text}
    </button>
  );
}

// Utilizzo
<Button text="Clicca qui" onClick={handleClick} disabled={false} />
```

### **Props con Oggetti**

```jsx
// Passaggio di oggetti
function UserCard({ user, onEdit, onDelete }) {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <button onClick={() => onEdit(user)}>Modifica</button>
      <button onClick={() => onDelete(user.id)}>Elimina</button>
    </div>
  );
}

// Utilizzo
const user = { id: 1, name: 'Mario', email: 'mario@example.com' };
<UserCard 
  user={user} 
  onEdit={handleEdit} 
  onDelete={handleDelete} 
/>
```

### **Props con Array**

```jsx
// Passaggio di array
function UserList({ users, onUserSelect }) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id} onClick={() => onUserSelect(user)}>
          {user.name}
        </li>
      ))}
    </ul>
  );
}

// Utilizzo
const users = [
  { id: 1, name: 'Mario' },
  { id: 2, name: 'Luigi' }
];
<UserList users={users} onUserSelect={handleUserSelect} />
```

### **Props con Funzioni**

```jsx
// Passaggio di funzioni
function Form({ onSubmit, onCancel, children }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {children}
      <button type="submit">Invia</button>
      <button type="button" onClick={onCancel}>Annulla</button>
    </form>
  );
}

// Utilizzo
<Form 
  onSubmit={handleSubmit} 
  onCancel={handleCancel}
>
  <input type="text" name="name" />
  <input type="email" name="email" />
</Form>
```

## 🏗️ Esempi Pratici di Composizione

### **Esempio 1: Dashboard Modulare**

```jsx
// Componente base per widget
function Widget({ title, children, actions }) {
  return (
    <div className="widget">
      <div className="widget-header">
        <h3>{title}</h3>
        {actions && <div className="widget-actions">{actions}</div>}
      </div>
      <div className="widget-content">
        {children}
      </div>
    </div>
  );
}

// Widget specifico per statistiche
function StatsWidget({ stats }) {
  return (
    <Widget 
      title="Statistiche"
      actions={<button>Aggiorna</button>}
    >
      <div className="stats-grid">
        {stats.map(stat => (
          <div key={stat.label} className="stat-item">
            <span className="stat-value">{stat.value}</span>
            <span className="stat-label">{stat.label}</span>
          </div>
        ))}
      </div>
    </Widget>
  );
}

// Widget specifico per grafici
function ChartWidget({ data, type }) {
  return (
    <Widget title={`Grafico ${type}`}>
      <div className="chart-container">
        {/* Logica per il grafico */}
        <p>Grafico {type} con {data.length} punti</p>
      </div>
    </Widget>
  );
}

// Dashboard che combina i widget
function Dashboard() {
  const stats = [
    { label: 'Utenti', value: 1250 },
    { label: 'Vendite', value: 8500 },
    { label: 'Ordini', value: 320 }
  ];
  
  const chartData = [10, 20, 30, 40, 50];
  
  return (
    <div className="dashboard">
      <StatsWidget stats={stats} />
      <ChartWidget data={chartData} type="Vendite" />
      <ChartWidget data={chartData} type="Utenti" />
    </div>
  );
}
```

### **Esempio 2: Form Modulare**

```jsx
// Componente base per campi form
function FormField({ label, error, children }) {
  return (
    <div className="form-field">
      <label className="form-label">{label}</label>
      {children}
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}

// Campo input specifico
function TextInput({ value, onChange, placeholder, error }) {
  return (
    <FormField label="Nome" error={error}>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={error ? 'error' : ''}
      />
    </FormField>
  );
}

// Campo select specifico
function SelectInput({ value, onChange, options, error }) {
  return (
    <FormField label="Ruolo" error={error}>
      <select value={value} onChange={onChange}>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  );
}

// Form che combina i campi
function UserForm({ formData, onSubmit, errors = {} }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        value={formData.name || ''}
        placeholder="Inserisci il nome"
        error={errors.name}
      />
      
      <SelectInput
        value={formData.role || ''}
        options={[
          { value: 'admin', label: 'Amministratore' },
          { value: 'user', label: 'Utente' }
        ]}
        error={errors.role}
      />
      
      <button type="submit">Salva</button>
    </form>
  );
}

// Utilizzo del form
function UserFormExample() {
  const formData = { name: 'Mario', role: 'user' };
  const errors = {};
  
  const handleSubmit = (data) => {
    console.log('Form inviato:', data);
  };
  
  return <UserForm formData={formData} onSubmit={handleSubmit} errors={errors} />;
}
```

### **Esempio 3: Lista con Filtri**

```jsx
// Componente per filtri
function FilterBar({ filters, onFilterChange }) {
  return (
    <div className="filter-bar">
      {filters.map(filter => (
        <div key={filter.key} className="filter-item">
          <label>{filter.label}</label>
          <input
            type={filter.type}
            value={filter.value}
            onChange={(e) => onFilterChange(filter.key, e.target.value)}
            placeholder={filter.placeholder}
          />
        </div>
      ))}
    </div>
  );
}

// Componente per la lista
function ItemList({ items, renderItem, emptyMessage }) {
  if (items.length === 0) {
    return <div className="empty-state">{emptyMessage}</div>;
  }
  
  return (
    <div className="item-list">
      {items.map(item => (
        <div key={item.id} className="item">
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
}

// Componente che combina filtri e lista
function FilterableList({ 
  items, 
  filters, 
  renderItem,
  emptyMessage = "Nessun elemento trovato"
}) {
  // Filtra gli items basandosi sui filtri attivi
  const filteredItems = items.filter(item => {
    return filters.every(filter => {
      if (!filter.value) return true;
      return item[filter.key]
        .toLowerCase()
        .includes(filter.value.toLowerCase());
    });
  });
  
  return (
    <div>
      <FilterBar filters={filters} />
      <ItemList 
        items={filteredItems} 
        renderItem={renderItem}
        emptyMessage={emptyMessage}
      />
    </div>
  );
}

// Utilizzo
function UserManagement() {
  const users = [
    { id: 1, name: 'Mario Rossi', role: 'admin', email: 'mario@example.com' },
    { id: 2, name: 'Luigi Bianchi', role: 'user', email: 'luigi@example.com' },
    { id: 3, name: 'Anna Verdi', role: 'user', email: 'anna@example.com' }
  ];
  
  // Filtri simulati (in una vera app, questi sarebbero dinamici)
  const filters = [
    { key: 'name', label: 'Nome', type: 'text', value: '', placeholder: 'Filtra per nome' },
    { key: 'role', label: 'Ruolo', type: 'text', value: '', placeholder: 'Filtra per ruolo' }
  ];
  
  const renderUser = (user) => (
    <div>
      <h4>{user.name}</h4>
      <p>{user.email} - {user.role}</p>
    </div>
  );
  
  return (
    <FilterableList
      items={users}
      filters={filters}
      renderItem={renderUser}
      emptyMessage="Nessun utente trovato"
    />
  );
}
```

**Nota importante**: In questo esempio, i filtri sono statici. Nella prossima lezione imparerai come rendere i filtri interattivi con lo stato!

## 🎯 Best Practices per la Composizione

### **1. Props Drilling**

```jsx
// ❌ PROBLEMA - Props drilling eccessivo
function App() {
  const user = { name: 'Mario', email: 'mario@example.com' };
  
  return (
    <div>
      <Header user={user} />
      <Main user={user} />
      <Footer user={user} />
    </div>
  );
}

function Main({ user }) {
  return (
    <div>
      <Content user={user} />
      <Sidebar user={user} />
    </div>
  );
}

function Content({ user }) {
  return <UserProfile user={user} />;
}

function UserProfile({ user }) {
  // Finalmente possiamo usare user qui!
  // Ma abbiamo passato le props attraverso 3 livelli
  return <div>{user.name}</div>;
}
```

**Problema**: Le props devono essere passate attraverso molti livelli di componenti.

**Nota**: Nella prossima lezione imparerai soluzioni come il Context API per evitare il props drilling!

### **2. Composizione vs Ereditarietà**

```jsx
// ✅ CORRETTO - Composizione
function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function ConfirmModal({ isOpen, onClose, onConfirm, message }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="confirm-modal">
        <p>{message}</p>
        <div className="modal-actions">
          <button onClick={onClose}>Annulla</button>
          <button onClick={onConfirm}>Conferma</button>
        </div>
      </div>
    </Modal>
  );
}

// ❌ SBAGLIATO - Ereditarietà complessa
class BaseModal extends React.Component {
  render() {
    return <div className="modal">{this.renderContent()}</div>;
  }
}

class ConfirmModal extends BaseModal {
  renderContent() {
    return <div>Confirm content</div>;
  }
}
```

### **3. Gestione degli Errori con Props**

```jsx
// Componente per gestire errori
function ErrorBoundary({ children, hasError, fallback }) {
  if (hasError) {
    return fallback || <div>Qualcosa è andato storto</div>;
  }
  
  return children;
}

// Utilizzo
function App() {
  const hasError = false; // In una vera app, questo sarebbe dinamico
  
  return (
    <ErrorBoundary 
      hasError={hasError}
      fallback={<div>Errore nell'applicazione</div>}
    >
      <UserList />
      <UserForm />
    </ErrorBoundary>
  );
}
```

**Nota**: Questo è un esempio semplificato. Nelle prossime lezioni imparerai pattern più avanzati per la gestione degli errori!

## 🐛 Errori Comuni e Soluzioni

### **Errore: Props non passate correttamente**

```jsx
// ❌ SBAGLIATO - Props mancanti
function UserCard({ user }) {
  return (
    <div>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
}

// Utilizzo senza props
<UserCard /> // Errore: user è undefined

// ✅ CORRETTO - Props di default
function UserCard({ user = {} }) {
  return (
    <div>
      <h3>{user.name || 'Nome non disponibile'}</h3>
      <p>{user.email || 'Email non disponibile'}</p>
    </div>
  );
}
```

### **Errore: Mutazione diretta delle props**

```jsx
// ❌ SBAGLIATO - Mutazione delle props
function UserList({ users }) {
  const handleDelete = (id) => {
    users.splice(users.findIndex(u => u.id === id), 1); // Mutazione!
  };
  
  return (
    <div>
      {users.map(user => (
        <UserCard key={user.id} user={user} onDelete={handleDelete} />
      ))}
    </div>
  );
}

// ✅ CORRETTO - Callback per aggiornare lo stato
function UserList({ users, onDeleteUser }) {
  const handleDelete = (id) => {
    onDeleteUser(id); // Chiama la funzione del componente padre
  };
  
  return (
    <div>
      {users.map(user => (
        <UserCard key={user.id} user={user} onDelete={handleDelete} />
      ))}
    </div>
  );
}
```

### **Errore: Composizione troppo complessa**

```jsx
// ❌ SBAGLIATO - Troppi livelli di annidamento
function App() {
  return (
    <Layout>
      <Header>
        <Navigation>
          <Menu>
            <MenuItem>
              <Link>
                <Icon />
                <Text />
              </Link>
            </MenuItem>
          </Menu>
        </Navigation>
      </Header>
    </Layout>
  );
}

// ✅ CORRETTO - Composizione più semplice
function App() {
  return (
    <Layout>
      <Header>
        <Navigation items={menuItems} />
      </Header>
    </Layout>
  );
}
```

## 📚 Risorse Aggiuntive

- **[Passing Props to a Component](https://react.dev/learn/passing-props-to-a-component)**
- **[Composition vs Inheritance](https://react.dev/learn/thinking-in-react)**
- **[Context API](https://react.dev/learn/passing-data-deeply-with-context)**
- **[Component Composition Patterns](https://react.dev/learn/thinking-in-react)**

---

## 🔜 Il Prossimo Passo

Hai imparato come **comporre componenti** usando props, children e pattern avanzati come render props. Questi pattern sono fondamentali e li userai costantemente nello sviluppo React!

**Cosa succede ora?**

- **Lezione 7c** - Imparerai il **conditional rendering** per mostrare/nascondere parti dell'UI basandoti sulle props
- **Lezione 8** - Scoprirai gli **hooks** e **useState** per rendere i tuoi componenti **veramente interattivi e dinamici**

> 💡 **Nota Importante**: Gli esempi di questa lezione usano dati statici passati tramite props. Nella **Lezione 8** imparerai come gestire dati che **cambiano nel tempo** usando lo **stato** (state). Potrai poi applicare tutti i pattern di composizione che hai imparato qui, ma con dati dinamici che rispondono alle azioni dell'utente!
> 
> Ad esempio, il `UserForm` potrà realmente validare l'input mentre l'utente digita, e il `FilterableList` potrà filtrare i dati in tempo reale! 🚀

---

**Prossima Lezione**: [Lezione 7c - Conditional rendering](../07c-conditional-rendering/README.md)
