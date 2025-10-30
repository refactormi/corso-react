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

```tsx
// 1. Dati fluiscono dal componente padre ai figli
interface User {
  name: string
  age: number
}

function App() {
  // Dati definiti nel componente padre
  const user: User = { name: 'Mario', age: 25 }
  
  return (
    <div>
      <UserProfile user={user} />
      <UserSettings user={user} />
    </div>
  )
}

// 2. I componenti figli ricevono i dati tramite props
interface UserProfileProps {
  user: User
}

function UserProfile({ user }: UserProfileProps) {
  return (
    <div>
      <h1>{user.name}</h1>
      <p>Età: {user.age}</p>
    </div>
  )
}

interface UserSettingsProps {
  user: User
}

function UserSettings({ user }: UserSettingsProps) {
  return (
    <div>
      <h2>Impostazioni per {user.name}</h2>
    </div>
  )
}
```

**Caratteristiche del flusso unidirezionale:**
- **Prevedibile** - I dati fluiscono sempre in una direzione
- **Debugging facile** - È sempre chiaro da dove vengono i dati
- **Performance** - React può ottimizzare gli aggiornamenti
- **Manutenibilità** - Codice più facile da comprendere e modificare

## 🎨 Pattern di Composizione

### **1. Composizione con Children**

```tsx
// Componente contenitore che accetta children
interface CardProps {
  title?: string
  children: React.ReactNode
  footer?: React.ReactNode
}

function Card({ title, children, footer }: CardProps) {
  return (
    <div className="card">
      {title && <div className="card-header">{title}</div>}
      <div className="card-body">
        {children}
      </div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  )
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
  )
}
```

### **2. Composizione con Props**

```tsx
// Componente che accetta componenti come props
interface LayoutProps {
  header: React.ReactNode
  sidebar: React.ReactNode
  main: React.ReactNode
  footer: React.ReactNode
}

function Layout({ header, sidebar, main, footer }: LayoutProps) {
  return (
    <div className="layout">
      <header className="layout-header">{header}</header>
      <div className="layout-content">
        <aside className="layout-sidebar">{sidebar}</aside>
        <main className="layout-main">{main}</main>
      </div>
      <footer className="layout-footer">{footer}</footer>
    </div>
  )
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
  )
}
```

### **3. Composizione con Render Props**

```tsx
// Componente che accetta una funzione come prop
interface DataDisplayProps<T> {
  data: T[]
  loading: boolean
  render: (props: { data: T[]; loading: boolean }) => React.ReactNode
}

function DataDisplay<T>({ data, loading, render }: DataDisplayProps<T>) {
  return render({ data, loading })
}

// Utilizzo
interface User {
  id: number
  name: string
}

function UserList() {
  // In una vera app, questi dati arriverebbero da un'API
  const users: User[] = [
    { id: 1, name: 'Mario' },
    { id: 2, name: 'Luigi' }
  ]
  const loading: boolean = false
  
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
  )
}
```

**Nota**: Il pattern render props è molto potente per creare componenti riutilizzabili. Nella prossima lezione imparerai come rendere questi dati dinamici!

## 🔧 Passaggio di Props

### **Props Semplici**

```tsx
// Passaggio di valori primitivi
interface ButtonProps {
  text: string
  onClick?: () => void
  disabled?: boolean
}

function Button({ text, onClick, disabled }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {text}
    </button>
  )
}

// Utilizzo
// <Button text="Clicca qui" onClick={handleClick} disabled={false} />
```

### **Props con Oggetti**

```tsx
// Passaggio di oggetti
interface User {
  id: number
  name: string
  email: string
}

interface UserCardProps {
  user: User
  onEdit: (user: User) => void
  onDelete: (id: number) => void
}

function UserCard({ user, onEdit, onDelete }: UserCardProps) {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <button onClick={() => onEdit(user)}>Modifica</button>
      <button onClick={() => onDelete(user.id)}>Elimina</button>
    </div>
  )
}

// Utilizzo
// const user: User = { id: 1, name: 'Mario', email: 'mario@example.com' }
// <UserCard 
//   user={user} 
//   onEdit={handleEdit} 
//   onDelete={handleDelete} 
// />
```

### **Props con Array**

```tsx
// Passaggio di array
interface User {
  id: number
  name: string
}

interface UserListProps {
  users: User[]
  onUserSelect: (user: User) => void
}

function UserList({ users, onUserSelect }: UserListProps) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id} onClick={() => onUserSelect(user)}>
          {user.name}
        </li>
      ))}
    </ul>
  )
}

// Utilizzo
// const users: User[] = [
//   { id: 1, name: 'Mario' },
//   { id: 2, name: 'Luigi' }
// ]
// <UserList users={users} onUserSelect={handleUserSelect} />
```

### **Props con Funzioni**

```tsx
// Passaggio di funzioni
interface FormProps {
  onSubmit: (formData: any) => void
  onCancel: () => void
  children: React.ReactNode
}

function Form({ onSubmit, onCancel, children }: FormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // onSubmit(formData) // formData dovrebbe essere gestito con stato
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {children}
      <button type="submit">Invia</button>
      <button type="button" onClick={onCancel}>Annulla</button>
    </form>
  )
}

// Utilizzo
// <Form 
//   onSubmit={handleSubmit} 
//   onCancel={handleCancel}
// >
//   <input type="text" name="name" />
//   <input type="email" name="email" />
// </Form>
```

## 🏗️ Esempi Pratici di Composizione

### **Esempio 1: Dashboard Modulare**

```tsx
// Componente base per widget
interface WidgetProps {
  title: string
  children: React.ReactNode
  actions?: React.ReactNode
}

function Widget({ title, children, actions }: WidgetProps) {
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
  )
}

// Widget specifico per statistiche
interface Stat {
  label: string
  value: number
}

interface StatsWidgetProps {
  stats: Stat[]
}

function StatsWidget({ stats }: StatsWidgetProps) {
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
  )
}

// Widget specifico per grafici
interface ChartWidgetProps {
  data: number[]
  type: string
}

function ChartWidget({ data, type }: ChartWidgetProps) {
  return (
    <Widget title={`Grafico ${type}`}>
      <div className="chart-container">
        {/* Logica per il grafico */}
        <p>Grafico {type} con {data.length} punti</p>
      </div>
    </Widget>
  )
}

// Dashboard che combina i widget
function Dashboard() {
  const stats: Stat[] = [
    { label: 'Utenti', value: 1250 },
    { label: 'Vendite', value: 8500 },
    { label: 'Ordini', value: 320 }
  ]
  
  const chartData: number[] = [10, 20, 30, 40, 50]
  
  return (
    <div className="dashboard">
      <StatsWidget stats={stats} />
      <ChartWidget data={chartData} type="Vendite" />
      <ChartWidget data={chartData} type="Utenti" />
    </div>
  )
}
```

### **Esempio 2: Form Modulare**

```tsx
// Componente base per campi form
interface FormFieldProps {
  label: string
  error?: string
  children: React.ReactNode
}

function FormField({ label, error, children }: FormFieldProps) {
  return (
    <div className="form-field">
      <label className="form-label">{label}</label>
      {children}
      {error && <span className="form-error">{error}</span>}
    </div>
  )
}

// Campo input specifico
interface TextInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  error?: string
}

function TextInput({ value, onChange, placeholder, error }: TextInputProps) {
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
  )
}

// Campo select specifico
interface Option {
  value: string
  label: string
}

interface SelectInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: Option[]
  error?: string
}

function SelectInput({ value, onChange, options, error }: SelectInputProps) {
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
  )
}

// Form che combina i campi
interface FormData {
  name?: string
  role?: string
}

interface FormErrors {
  name?: string
  role?: string
}

interface UserFormProps {
  formData: FormData
  onSubmit: (formData: FormData) => void
  errors?: FormErrors
}

function UserForm({ formData, onSubmit, errors = {} }: UserFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(formData)
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        value={formData.name || ''}
        placeholder="Inserisci il nome"
        error={errors.name}
        onChange={() => {}}
      />
      
      <SelectInput
        value={formData.role || ''}
        options={[
          { value: 'admin', label: 'Amministratore' },
          { value: 'user', label: 'Utente' }
        ]}
        error={errors.role}
        onChange={() => {}}
      />
      
      <button type="submit">Salva</button>
    </form>
  )
}

// Utilizzo del form
function UserFormExample() {
  const formData: FormData = { name: 'Mario', role: 'user' }
  const errors: FormErrors = {}
  
  const handleSubmit = (data: FormData) => {
    console.log('Form inviato:', data)
  }
  
  return <UserForm formData={formData} onSubmit={handleSubmit} errors={errors} />
}
```

### **Esempio 3: Lista con Filtri**

```tsx
// Componente per filtri
interface Filter {
  key: string
  label: string
  type: string
  value: string
  placeholder?: string
}

interface FilterBarProps {
  filters: Filter[]
  onFilterChange: (key: string, value: string) => void
}

function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  return (
    <div className="filter-bar">
      {filters.map(filter => (
        <div key={filter.key} className="filter-item">
          <label>{filter.label}</label>
          <input
            type={filter.type}
            value={filter.value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFilterChange(filter.key, e.target.value)}
            placeholder={filter.placeholder}
          />
        </div>
      ))}
    </div>
  )
}

// Componente per la lista
interface ItemListProps<T> {
  items: T[]
  renderItem: (item: T) => React.ReactNode
  emptyMessage?: string
}

function ItemList<T extends { id: number | string }>({ items, renderItem, emptyMessage = "Nessun elemento trovato" }: ItemListProps<T>) {
  if (items.length === 0) {
    return <div className="empty-state">{emptyMessage}</div>
  }
  
  return (
    <div className="item-list">
      {items.map(item => (
        <div key={item.id} className="item">
          {renderItem(item)}
        </div>
      ))}
    </div>
  )
}

// Componente che combina filtri e lista
interface FilterableListProps<T extends Record<string, any>> {
  items: T[]
  filters: Filter[]
  renderItem: (item: T) => React.ReactNode
  emptyMessage?: string
}

function FilterableList<T extends Record<string, any>>({ 
  items, 
  filters, 
  renderItem,
  emptyMessage = "Nessun elemento trovato"
}: FilterableListProps<T>) {
  // Filtra gli items basandosi sui filtri attivi
  const filteredItems = items.filter(item => {
    return filters.every(filter => {
      if (!filter.value) return true
      const itemValue = String(item[filter.key] || '').toLowerCase()
      return itemValue.includes(filter.value.toLowerCase())
    })
  })
  
  return (
    <div>
      <FilterBar filters={filters} onFilterChange={() => {}} />
      <ItemList 
        items={filteredItems} 
        renderItem={renderItem}
        emptyMessage={emptyMessage}
      />
    </div>
  )
}

// Utilizzo
interface User {
  id: number
  name: string
  role: string
  email: string
}

function UserManagement() {
  const users: User[] = [
    { id: 1, name: 'Mario Rossi', role: 'admin', email: 'mario@example.com' },
    { id: 2, name: 'Luigi Bianchi', role: 'user', email: 'luigi@example.com' },
    { id: 3, name: 'Anna Verdi', role: 'user', email: 'anna@example.com' }
  ]
  
  // Filtri simulati (in una vera app, questi sarebbero dinamici)
  const filters: Filter[] = [
    { key: 'name', label: 'Nome', type: 'text', value: '', placeholder: 'Filtra per nome' },
    { key: 'role', label: 'Ruolo', type: 'text', value: '', placeholder: 'Filtra per ruolo' }
  ]
  
  const renderUser = (user: User) => (
    <div>
      <h4>{user.name}</h4>
      <p>{user.email} - {user.role}</p>
    </div>
  )
  
  return (
    <FilterableList
      items={users}
      filters={filters}
      renderItem={renderUser}
      emptyMessage="Nessun utente trovato"
    />
  )
}
```

**Nota importante**: In questo esempio, i filtri sono statici. Nella prossima lezione imparerai come rendere i filtri interattivi con lo stato!

## 🎯 Best Practices per la Composizione

### **1. Props Drilling**

```tsx
// ❌ PROBLEMA - Props drilling eccessivo
interface User {
  name: string
  email: string
}

function App() {
  const user: User = { name: 'Mario', email: 'mario@example.com' }
  
  return (
    <div>
      <Header user={user} />
      <Main user={user} />
      <Footer user={user} />
    </div>
  )
}

interface MainProps {
  user: User
}

function Main({ user }: MainProps) {
  return (
    <div>
      <Content user={user} />
      <Sidebar user={user} />
    </div>
  )
}

interface ContentProps {
  user: User
}

function Content({ user }: ContentProps) {
  return <UserProfile user={user} />
}

interface UserProfileProps {
  user: User
}

function UserProfile({ user }: UserProfileProps) {
  // Finalmente possiamo usare user qui!
  // Ma abbiamo passato le props attraverso 3 livelli
  return <div>{user.name}</div>
}
```

**Problema**: Le props devono essere passate attraverso molti livelli di componenti.

**Nota**: Nella prossima lezione imparerai soluzioni come il Context API per evitare il props drilling!

### **2. Composizione vs Ereditarietà**

```tsx
// ✅ CORRETTO - Composizione
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  message: string
}

function ConfirmModal({ isOpen, onClose, onConfirm, message }: ConfirmModalProps) {
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
  )
}

// ❌ SBAGLIATO - Ereditarietà complessa (esempio legacy)
// class BaseModal extends React.Component {
//   render() {
//     return <div className="modal">{this.renderContent()}</div>
//   }
// }
//
// class ConfirmModal extends BaseModal {
//   renderContent() {
//     return <div>Confirm content</div>
//   }
// }
```

### **3. Gestione degli Errori con Props**

```tsx
// Componente per gestire errori
interface ErrorBoundaryProps {
  children: React.ReactNode
  hasError: boolean
  fallback?: React.ReactNode
}

function ErrorBoundary({ children, hasError, fallback }: ErrorBoundaryProps) {
  if (hasError) {
    return fallback || <div>Qualcosa è andato storto</div>
  }
  
  return <>{children}</>
}

// Utilizzo
function App() {
  const hasError: boolean = false // In una vera app, questo sarebbe dinamico
  
  return (
    <ErrorBoundary 
      hasError={hasError}
      fallback={<div>Errore nell'applicazione</div>}
    >
      <UserList />
      <UserForm />
    </ErrorBoundary>
  )
}
```

**Nota**: Questo è un esempio semplificato. Nelle prossime lezioni imparerai pattern più avanzati per la gestione degli errori!

## 🐛 Errori Comuni e Soluzioni

### **Errore: Props non passate correttamente**

```tsx
// ❌ SBAGLIATO - Props mancanti
interface User {
  name: string
  email: string
}

interface UserCardProps {
  user?: User
}

function UserCard({ user }: UserCardProps) {
  return (
    <div>
      <h3>{user!.name}</h3> {/* Potrebbe essere undefined */}
      <p>{user!.email}</p>
    </div>
  )
}

// Utilizzo senza props
// <UserCard /> // Errore: user è undefined

// ✅ CORRETTO - Props di default
function UserCardWithDefault({ user = { name: 'Nome non disponibile', email: 'Email non disponibile' } }: UserCardProps) {
  return (
    <div>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  )
}
```

### **Errore: Mutazione diretta delle props**

```tsx
// ❌ SBAGLIATO - Mutazione delle props
interface User {
  id: number
  name: string
}

interface UserListProps {
  users: User[]
}

function UserListBad({ users }: UserListProps) {
  const handleDelete = (id: number) => {
    // users.splice(users.findIndex(u => u.id === id), 1) // Mutazione! NON FARE
  }
  
  return (
    <div>
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  )
}

// ✅ CORRETTO - Callback per aggiornare lo stato
interface UserListCorrectProps {
  users: User[]
  onDeleteUser: (id: number) => void
}

function UserListCorrect({ users, onDeleteUser }: UserListCorrectProps) {
  const handleDelete = (id: number) => {
    onDeleteUser(id) // Chiama la funzione del componente padre
  }
  
  return (
    <div>
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  )
}
```

### **Errore: Composizione troppo complessa**

```tsx
// ❌ SBAGLIATO - Troppi livelli di annidamento
// function App() {
//   return (
//     <Layout>
//       <Header>
//         <Navigation>
//           <Menu>
//             <MenuItem>
//               <Link>
//                 <Icon />
//                 <Text />
//               </Link>
//             </MenuItem>
//           </Menu>
//         </Navigation>
//       </Header>
//     </Layout>
//   )
// }

// ✅ CORRETTO - Composizione più semplice
interface MenuItem {
  id: string
  label: string
  href: string
}

interface NavigationProps {
  items: MenuItem[]
}

function Navigation({ items }: NavigationProps) {
  return (
    <nav>
      {items.map(item => (
        <a key={item.id} href={item.href}>{item.label}</a>
      ))}
    </nav>
  )
}

function App() {
  const menuItems: MenuItem[] = [
    { id: '1', label: 'Home', href: '/' },
    { id: '2', label: 'About', href: '/about' }
  ]
  
  return (
    <Layout>
      <Header>
        <Navigation items={menuItems} />
      </Header>
    </Layout>
  )
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
