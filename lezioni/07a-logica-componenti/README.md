# Lezione 7a: Logica dei Componenti in React

## 🎯 Obiettivi della Lezione

Al termine di questa lezione sarai in grado di:
- Comprendere cos'è un componente React e perché è importante
- Creare componenti funzionali e class-based
- Distinguere tra componenti presentazionali e container
- Comprendere il principio di single responsibility
- Organizzare i componenti in modo modulare e riutilizzabile

## 📚 Cos'è un Componente React?

Un **componente React** è un pezzo di codice riutilizzabile che incapsula la logica e l'interfaccia utente. È l'unità fondamentale di un'applicazione React.

### Definizione Ufficiale
> "I componenti sono come funzioni JavaScript. Accettano input arbitrari (chiamati "props") e restituiscono elementi React che descrivono cosa dovrebbe apparire sullo schermo." - [React.dev](https://react.dev/learn/your-first-component)

## 🏗️ Tipi di Componenti

### **1. Componenti Funzionali (Function Components)**

```tsx
// Componente funzionale semplice
function Welcome() {
  return <h1>Ciao, mondo!</h1>
}

// Componente funzionale con props
interface WelcomeProps {
  name: string
}

function Welcome({ name }: WelcomeProps) {
  return <h1>Ciao, {name}!</h1>
}

// Componente funzionale con arrow function
const Welcome = ({ name }: WelcomeProps) => {
  return <h1>Ciao, {name}!</h1>
}
```

**Caratteristiche:**
- **Sintassi moderna** - Preferiti in React moderno
- **Più leggeri** - Meno overhead rispetto alle classi
- **Hooks** - Possono utilizzare useState e altri hooks
- **Più semplici** - Meno codice boilerplate

### **2. Componenti a Classe (Class Components)**

```tsx
// Componente a classe
class Welcome extends React.Component {
  render() {
    return <h1>Ciao, mondo!</h1>
  }
}

// Componente a classe con props
interface WelcomeProps {
  name: string
}

class Welcome extends React.Component<WelcomeProps> {
  render() {
    return <h1>Ciao, {this.props.name}!</h1>
  }
}

// Componente a classe con stato
interface CounterState {
  count: number
}

class Counter extends React.Component<{}, CounterState> {
  constructor(props: {}) {
    super(props)
    this.state = { count: 0 }
  }
  
  render() {
    return (
      <div>
        <p>Contatore: {this.state.count}</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Incrementa
        </button>
      </div>
    )
  }
}
```

**Caratteristiche:**
- **Sintassi tradizionale** - Usati in React legacy
- **Più complessi** - Richiedono più codice
- **Lifecycle methods** - componentDidMount, componentWillUnmount, etc.
- **Stato interno** - this.state e this.setState

## 🎨 Categorie di Componenti

### **1. Componenti Presentazionali (Presentational Components)**

```tsx
// Componente presentazionale - solo UI
interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'success' | 'danger'
}

function Button({ children, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

// Componente presentazionale - card
interface User {
  name: string
  email: string
  avatar: string
}

interface UserCardProps {
  user: User
}

function UserCard({ user }: UserCardProps) {
  return (
    <div className="user-card">
      <img src={user.avatar} alt={user.name} />
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  )
}
```

**Caratteristiche:**
- **Solo UI** - Non gestiscono stato complesso
- **Riutilizzabili** - Possono essere usati ovunque
- **Props-driven** - Ricevono dati tramite props
- **Testabili** - Facili da testare

### **2. Componenti Container (Container Components)**

```tsx
// Componente container - gestisce logica e dati
interface User {
  id: number
  name: string
  email: string
}

function UserList() {
  // In una vera app, questi dati arriverebbero da un'API
  // Per ora li definiamo qui come esempio
  const users: User[] = [
    { id: 1, name: 'Mario Rossi', email: 'mario@example.com' },
    { id: 2, name: 'Luigi Bianchi', email: 'luigi@example.com' },
    { id: 3, name: 'Anna Verdi', email: 'anna@example.com' }
  ]
  
  const loading: boolean = false
  
  if (loading) return <div>Caricamento...</div>
  
  return (
    <div>
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  )
}
```

**Caratteristiche:**
- **Gestiscono dati** - Preparano i dati per i componenti figlio
- **Orchestrano** - Coordinano altri componenti
- **Specifici** - Legati a funzionalità specifiche
- **Passano props** - Forniscono dati ai componenti presentazionali

**Nota**: Nelle prossime lezioni imparerai come rendere questi dati dinamici con lo stato!

## 🎯 Principi di Design dei Componenti

### **1. Single Responsibility Principle**

```tsx
// ❌ SBAGLIATO - Troppe responsabilità
// function UserDashboard() {
//   const [users, setUsers] = useState<User[]>([])
//   const [loading, setLoading] = useState<boolean>(true)
//   
//   // Gestisce utenti
//   const fetchUsers = async () => { /* ... */ }
//   
//   // Gestisce autenticazione
//   const login = async (credentials: Credentials) => { /* ... */ }
//   
//   // Gestisce notifiche
//   const showNotification = (message: string) => { /* ... */ }
//   
//   return (
//     <div>
//       {/* UI complessa */}
//     </div>
//   )
// }

// ✅ CORRETTO - Responsabilità separate
interface UserListProps {
  users: User[]
  loading: boolean
}

function UserList({ users, loading }: UserListProps) {
  if (loading) return <div>Caricamento...</div>
  
  return (
    <div>
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  )
}

function UserDashboard() {
  // const { users, loading } = useUsers()
  
  // return (
  //   <div>
  //     <UserList users={users} loading={loading} />
  //   </div>
  // )
  return null
}
```

### **2. Composizione vs Ereditarietà**

```tsx
// ✅ CORRETTO - Composizione
interface CardProps {
  children: React.ReactNode
  title?: string
}

function Card({ children, title }: CardProps) {
  return (
    <div className="card">
      {title && <h3 className="card-title">{title}</h3>}
      <div className="card-content">
        {children}
      </div>
    </div>
  )
}

interface User {
  name: string
  email: string
  avatar: string
}

interface UserProfileProps {
  user: User
}

function UserProfile({ user }: UserProfileProps) {
  return (
    <Card title="Profilo Utente">
      <img src={user.avatar} alt={user.name} />
      <h4>{user.name}</h4>
      <p>{user.email}</p>
    </Card>
  )
}

// ❌ SBAGLIATO - Ereditarietà complessa (esempio legacy)
// class BaseCard extends React.Component {
//   render() {
//     return <div className="card">{this.renderContent()}</div>
//   }
// }
//
// class UserCard extends BaseCard {
//   renderContent() {
//     return <div>User content</div>
//   }
// }
```

### **3. Props Interface Design**

```tsx
// ✅ CORRETTO - Props chiare e tipizzate
interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'success' | 'danger'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  type = 'button'
}: ButtonProps) {
  return (
    <button 
      className={`btn btn-${variant} btn-${size}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  )
}

// Utilizzo
// <Button 
//   variant="secondary" 
//   size="large" 
//   onClick={handleClick}
// >
//   Clicca qui
// </Button>
```

## 🏗️ Struttura e Organizzazione

### **1. Organizzazione per Funzionalità**

```
src/
├── components/
│   ├── common/           # Componenti riutilizzabili
│   │   ├── Button/
│   │   │   ├── Button.jsx
│   │   │   ├── Button.css
│   │   │   └── index.js
│   │   ├── Modal/
│   │   └── Input/
│   ├── user/            # Componenti specifici per utenti
│   │   ├── UserCard/
│   │   ├── UserList/
│   │   └── UserForm/
│   └── product/         # Componenti specifici per prodotti
│       ├── ProductCard/
│       ├── ProductList/
│       └── ProductForm/
```

### **2. Struttura di un Componente**

```tsx
// Button/Button.tsx
import React from 'react'
import './Button.css'

// 1. Definizione del componente
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'success' | 'danger'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
}

function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  ...props 
}: ButtonProps) {
  // 2. Logica del componente
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return
    onClick?.()
  }
  
  // 3. Render
  return (
    <button 
      className={`btn btn-${variant} btn-${size}`}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

// 4. Export
export default Button
```

```tsx
// Button/index.ts
export { default } from './Button'
```

```css
/* Button/Button.css */
.btn {
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-small {
  padding: 8px 16px;
  font-size: 14px;
}

.btn-medium {
  padding: 12px 24px;
  font-size: 16px;
}

.btn-large {
  padding: 16px 32px;
  font-size: 18px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
```

## 🔧 Esempi Pratici

### **Esempio 1: Componente Card Riutilizzabile**

```tsx
interface CardProps {
  title?: string
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

function Card({ 
  title, 
  children, 
  footer, 
  className = '',
  ...props 
}: CardProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`card ${className}`} {...props}>
      {title && (
        <div className="card-header">
          <h3 className="card-title">{title}</h3>
        </div>
      )}
      <div className="card-body">
        {children}
      </div>
      {footer && (
        <div className="card-footer">
          {footer}
        </div>
      )}
    </div>
  )
}

// Utilizzo
// <Card 
//   title="Profilo Utente"
//   footer={<button>Modifica</button>}
// >
//   <p>Nome: Mario Rossi</p>
//   <p>Email: mario@example.com</p>
// </Card>
```

### **Esempio 2: Componente Lista con Rendering Personalizzato**

```tsx
interface CustomListProps<T> {
  items: T[]
  renderItem: (item: T) => React.ReactNode
  emptyMessage?: string
}

function CustomList<T>({ 
  items, 
  renderItem,
  emptyMessage = "Nessun elemento trovato"
}: CustomListProps<T>) {
  return (
    <div>
      {items.length > 0 ? (
        <ul>
          {items.map((item, index) => (
            <li key={index}>
              {renderItem(item)}
            </li>
          ))}
        </ul>
      ) : (
        <p>{emptyMessage}</p>
      )}
    </div>
  )
}

// Utilizzo
interface User {
  id: number
  name: string
  email: string
}

function UserListExample() {
  const users: User[] = [
    { id: 1, name: 'Mario Rossi', email: 'mario@example.com' },
    { id: 2, name: 'Luigi Bianchi', email: 'luigi@example.com' }
  ]
  
  return (
    <CustomList
      items={users}
      renderItem={(user) => (
        <div>
          <strong>{user.name}</strong> - {user.email}
        </div>
      )}
      emptyMessage="Nessun utente trovato"
    />
  )
}
```

**Nota**: Questo componente è riutilizzabile! Puoi passargli qualsiasi array e una funzione per renderizzare gli elementi.

### **Esempio 3: Componente Form con Validazione**

```tsx
interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  name: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  required?: boolean
}

function FormField({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  error,
  required = false,
  ...props 
}: FormFieldProps) {
  return (
    <div className="form-field">
      <label htmlFor={name}>
        {label}
        {required && <span className="required">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className={error ? 'error' : ''}
        {...props}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  )
}

// Utilizzo
// <FormField
//   label="Nome"
//   name="name"
//   value={formData.name}
//   onChange={handleChange}
//   error={errors.name}
//   required
// />
```

## 🎯 Best Practices

### **1. Naming Conventions**

```tsx
// ✅ CORRETTO - PascalCase per componenti
function UserProfile() { }
const UserProfile = () => { }

// ✅ CORRETTO - camelCase per props
interface ButtonProps {
  onClick?: () => void
  isDisabled?: boolean
  variant?: 'primary' | 'secondary'
}

function Button({ onClick, isDisabled, variant }: ButtonProps) { }

// ✅ CORRETTO - Nomi descrittivi
function UserCard() { }
function ProductList() { }
function NavigationMenu() { }
```

### **2. Props Validation**

```tsx
import PropTypes from 'prop-types'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
}

function Button({ children, onClick, variant, size, disabled }: ButtonProps) {
  return (
    <button 
      className={`btn btn-${variant} btn-${size}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool
}

Button.defaultProps = {
  variant: 'primary',
  size: 'medium',
  disabled: false
}
```

### **3. Best Practices per Componenti**

```tsx
// ✅ Componenti piccoli e focalizzati
interface User {
  name: string
  email: string
}

interface UserCardProps {
  user: User
}

function UserCard({ user }: UserCardProps) {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  )
}

// ✅ Componenti riutilizzabili con props
interface BadgeProps {
  text: string
  color?: string
}

function Badge({ text, color = 'blue' }: BadgeProps) {
  return (
    <span style={{ 
      backgroundColor: color, 
      padding: '4px 8px', 
      borderRadius: '4px',
      color: 'white'
    } as React.CSSProperties}>
      {text}
    </span>
  )
}

// ✅ Composizione di componenti
interface UserProfileProps {
  user: User & { isPremium?: boolean; isAdmin?: boolean }
}

function UserProfile({ user }: UserProfileProps) {
  return (
    <div>
      <UserCard user={user} />
      {user.isPremium && <Badge text="Premium" color="gold" />}
      {user.isAdmin && <Badge text="Admin" color="red" />}
    </div>
  )
}
```

**Nota**: Nelle lezioni successive imparerai tecniche avanzate di ottimizzazione come `memo`, `useMemo` e `useCallback`.

## 🐛 Errori Comuni e Soluzioni

### **Errore: Props non utilizzate correttamente**

```tsx
// ❌ SBAGLIATO - Ignora le props
function UserCard() {
  const userName: string = "Mario" // Hardcodato!
  return <h3>{userName}</h3>
}

// Utilizzo
// <UserCard user={{ name: "Luigi" }} /> // Props ignorate!

// ✅ CORRETTO - Usa le props
interface UserCardProps {
  user: { name: string }
}

function UserCardCorrect({ user }: UserCardProps) {
  return <h3>{user.name}</h3>
}

// Utilizzo
// <UserCardCorrect user={{ name: "Luigi" }} /> // Props utilizzate correttamente!
```

### **Errore: Props mancanti**

```tsx
// ❌ SBAGLIATO - Nessun valore di default
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
// <UserCard /> // Errore: Cannot read property 'name' of undefined

// ✅ CORRETTO - Props di default
function UserCardWithDefault({ user = { name: 'Sconosciuto', email: 'N/A' } }: UserCardProps) {
  return (
    <div>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  )
}

// Oppure con controlli
function UserCardSafe({ user }: UserCardProps) {
  if (!user) {
    return <div>Nessun utente</div>
  }
  
  return (
    <div>
      <h3>{user.name || 'Nome non disponibile'}</h3>
      <p>{user.email || 'Email non disponibile'}</p>
    </div>
  )
}
```

### **Errore: Componente troppo complesso**

```tsx
// ❌ SBAGLIATO - Componente monolitico
// function UserDashboard() {
//   // 200+ righe di codice
//   // Troppe responsabilità
//   // Difficile da testare
// }

// ✅ CORRETTO - Componenti separati
function UserHeader() { return <div>User Header</div> }
function UserStats() { return <div>User Stats</div> }
function UserActions() { return <div>User Actions</div> }
function UserList() { return <div>User List</div> }

function UserDashboardCorrect() {
  return (
    <div>
      <UserHeader />
      <UserStats />
      <UserActions />
      <UserList />
    </div>
  )
}
```

## 📚 Risorse Aggiuntive

- **[Your First Component](https://react.dev/learn/your-first-component)**
- **[Component Composition](https://react.dev/learn/passing-props-to-a-component)**
- **[Thinking in React](https://react.dev/learn/thinking-in-react)**
- **[Component Best Practices](https://react.dev/learn/keeping-components-pure)**

---

## 🔜 Percorso di Apprendimento

In questa lezione hai imparato cos'è un componente e come utilizzare le **props** per passare dati. Questo è il primo passo fondamentale!

**Nelle prossime lezioni scoprirai:**

- **Lezione 7b** - Come **comporre** componenti per creare interfacce complesse usando props e pattern di composizione
- **Lezione 7c** - Come implementare il **conditional rendering** per mostrare/nascondere parti dell'UI in base alle props
- **Lezione 8** - Come rendere i tuoi componenti **interattivi e dinamici** introducendo gli **hooks** e lo **stato** (useState)

> 💡 **Nota**: Per ora i dati che passiamo tramite props sono statici. Una volta che avrai imparato gli hooks (Lezione 8), potrai creare componenti completamente interattivi dove i dati cambiano nel tempo in risposta alle azioni dell'utente!

---

**Prossima Lezione**: [Lezione 7b - Composizione UI e props](../07b-composizione-ui-props/README.md)
