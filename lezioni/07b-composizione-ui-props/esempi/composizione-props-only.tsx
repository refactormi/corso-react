// Composizione UI con Props - Esempi pratici (Versione Statica)
// Questo file dimostra pattern di composizione usando solo props
// Versione semplificata per la Lezione 07b - La versione interattiva sarà nella Lezione 13 (Context API)

/**
 * CONCETTI DIMOSTRATI:
 * 1. Composizione di componenti
 * 2. Passaggio di props tra componenti
 * 3. Pattern children per contenuto dinamico
 * 4. Composizione con render props
 * 5. Layout components
 * 6. Slot pattern
 */

interface LayoutProps {
  header?: React.ReactNode
  sidebar?: React.ReactNode
  main?: React.ReactNode
  footer?: React.ReactNode
}

interface CardProps {
  title?: string
  children: React.ReactNode
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
}

interface ContainerProps {
  children: React.ReactNode
  maxWidth?: string
}

interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning'
  size?: 'small' | 'medium' | 'large'
  onClick?: () => void
}

interface ButtonGroupProps {
  children: React.ReactNode
  spacing?: string
}

interface User {
  id: number
  name: string
  email: string
  role: string
  department: string
}

interface UserCardProps {
  user: User
  showDetails?: boolean
}

interface UserListProps {
  users: User[]
  showDetails?: boolean
}

interface ModalProps {
  isOpen: boolean
  title?: string
  children: React.ReactNode
  footer?: React.ReactNode
}

interface FormProps {
  children: React.ReactNode
  title?: string
}

interface FormFieldProps {
  label: string
  type?: string
  value?: string
  placeholder?: string
  required?: boolean
}

interface Product {
  id: number
  name: string
  price: number
}

interface DataDisplayProps<T> {
  data: T[]
  renderItem: (item: T) => React.ReactNode
}

// ========================================
// 1. LAYOUT COMPONENTS - Struttura Base
// ========================================

// Componente Layout che accetta sezioni come props
function Layout({ header, sidebar, main, footer }: LayoutProps) {
  return (
    <div style={{ 
      display: 'grid',
      gridTemplateAreas: `
        "header header"
        "sidebar main"
        "footer footer"
      `,
      gridTemplateColumns: '200px 1fr',
      gridTemplateRows: 'auto 1fr auto',
      minHeight: '100vh',
      gap: '20px',
      padding: '20px',
      backgroundColor: '#f5f5f5'
    }}>
      <header style={{ 
        gridArea: 'header',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        {header}
      </header>
      
      <aside style={{ 
        gridArea: 'sidebar',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        {sidebar}
      </aside>
      
      <main style={{ 
        gridArea: 'main',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        {main}
      </main>
      
      <footer style={{ 
        gridArea: 'footer',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        {footer}
      </footer>
    </div>
  )
}

// ========================================
// 2. CHILDREN PATTERN - Contenitori Flessibili
// ========================================

// Card che accetta children
function Card({ title, children, variant = 'default' }: CardProps) {
  const variants: Record<string, { borderColor: string; backgroundColor: string }> = {
    default: { borderColor: '#dee2e6', backgroundColor: '#fff' },
    primary: { borderColor: '#007bff', backgroundColor: '#e7f3ff' },
    success: { borderColor: '#28a745', backgroundColor: '#d4edda' },
    warning: { borderColor: '#ffc107', backgroundColor: '#fff3cd' },
    danger: { borderColor: '#dc3545', backgroundColor: '#f8d7da' }
  }
  
  const style = variants[variant] || variants.default
  
  return (
    <div style={{ 
      border: `2px solid ${style.borderColor}`,
      borderRadius: '8px',
      padding: '20px',
      backgroundColor: style.backgroundColor,
      marginBottom: '15px'
    }}>
      {title && (
        <h3 style={{ 
          margin: '0 0 15px 0',
          paddingBottom: '10px',
          borderBottom: `1px solid ${style.borderColor}`
        }}>
          {title}
        </h3>
      )}
      {children}
    </div>
  )
}

// Container generico
function Container({ children, maxWidth = '1200px' }: ContainerProps) {
  return (
    <div style={{ 
      maxWidth,
      margin: '0 auto',
      padding: '20px'
    }}>
      {children}
    </div>
  )
}

// ========================================
// 3. COMPOSIZIONE DI COMPONENTI ATOMICI
// ========================================

// Componenti Button atomici
function Button({ children, variant = 'primary', size = 'medium', onClick }: ButtonProps) {
  const variants: Record<string, React.CSSProperties> = {
    primary: { backgroundColor: '#007bff', color: 'white' },
    secondary: { backgroundColor: '#6c757d', color: 'white' },
    success: { backgroundColor: '#28a745', color: 'white' },
    danger: { backgroundColor: '#dc3545', color: 'white' },
    warning: { backgroundColor: '#ffc107', color: '#212529' }
  }
  
  const sizes: Record<string, React.CSSProperties> = {
    small: { padding: '6px 12px', fontSize: '14px' },
    medium: { padding: '10px 20px', fontSize: '16px' },
    large: { padding: '14px 28px', fontSize: '18px' }
  }
  
  return (
    <button
      onClick={onClick}
      style={{
        ...variants[variant],
        ...sizes[size],
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: '500',
        transition: 'all 0.2s'
      }}
    >
      {children}
    </button>
  )
}

// Gruppo di bottoni
function ButtonGroup({ children, spacing = '10px' }: ButtonGroupProps) {
  return (
    <div style={{ 
      display: 'flex',
      gap: spacing,
      flexWrap: 'wrap'
    }}>
      {children}
    </div>
  )
}

// ========================================
// 4. COMPOSIZIONE CON PROPS SPECIFICHE
// ========================================

// Componente User Card composto
function UserCard({ user, showDetails = false }: UserCardProps) {
  return (
    <Card variant="primary">
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {/* Avatar */}
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#007bff',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          fontWeight: 'bold',
          flexShrink: 0
        }}>
          {user.name.charAt(0)}
        </div>
        
        {/* Info */}
        <div style={{ flex: 1 }}>
          <h4 style={{ margin: '0 0 5px 0' }}>{user.name}</h4>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
            {user.email}
          </p>
          {showDetails && (
            <div style={{ marginTop: '10px', fontSize: '14px' }}>
              <p style={{ margin: '3px 0' }}>
                <strong>Ruolo:</strong> {user.role}
              </p>
              <p style={{ margin: '3px 0' }}>
                <strong>Dipartimento:</strong> {user.department}
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

// Lista di utenti composta
function UserList({ users, showDetails = false }: UserListProps) {
  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>👥 Lista Utenti ({users.length})</h2>
      {users.map(user => (
        <UserCard 
          key={user.id} 
          user={user} 
          showDetails={showDetails}
        />
      ))}
    </div>
  )
}

// ========================================
// 5. SLOT PATTERN - Posizioni Predefinite
// ========================================

// Modal con slot predefiniti
function Modal({ isOpen, title, children, footer }: ModalProps) {
  if (!isOpen) return null
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '0',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '80vh',
        overflow: 'auto',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
      }}>
        {/* Header Slot */}
        {title && (
          <div style={{
            padding: '20px',
            borderBottom: '1px solid #dee2e6',
            backgroundColor: '#f8f9fa'
          }}>
            <h3 style={{ margin: 0 }}>{title}</h3>
          </div>
        )}
        
        {/* Content Slot */}
        <div style={{ padding: '20px' }}>
          {children}
        </div>
        
        {/* Footer Slot */}
        {footer && (
          <div style={{
            padding: '20px',
            borderTop: '1px solid #dee2e6',
            backgroundColor: '#f8f9fa',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px'
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

// ========================================
// 6. COMPOSIZIONE GERARCHICA
// ========================================

// Componente Form composto
function Form({ children, title }: FormProps) {
  return (
    <Card title={title} variant="default">
      <form onSubmit={(e) => e.preventDefault()}>
        {children}
      </form>
    </Card>
  )
}

// Input Field composto
function FormField({ label, type = 'text', value, placeholder, required = false }: FormFieldProps) {
  return (
    <div style={{ marginBottom: '15px' }}>
      <label style={{ 
        display: 'block',
        marginBottom: '5px',
        fontWeight: '500',
        color: '#333'
      }}>
        {label}
        {required && <span style={{ color: '#dc3545' }}> *</span>}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '10px',
          border: '1px solid #ced4da',
          borderRadius: '4px',
          fontSize: '14px'
        }}
      />
    </div>
  )
}

// ========================================
// 7. RENDER PROPS PATTERN (Semplificato)
// ========================================

// Componente che usa render props per personalizzare il rendering
function DataDisplay<T>({ data, renderItem }: DataDisplayProps<T>) {
  return (
    <div style={{ 
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '15px'
    }}>
      {data.map((item, index) => (
        <div key={index}>
          {renderItem(item)}
        </div>
      ))}
    </div>
  )
}

// ========================================
// COMPONENTE PRINCIPALE - DEMO
// ========================================

function ComposizioneDemo() {
  // Dati di esempio - statici per questa lezione
  const sampleUsers: User[] = [
    { 
      id: 1, 
      name: 'Mario Rossi', 
      email: 'mario@example.com',
      role: 'Admin',
      department: 'IT'
    },
    { 
      id: 2, 
      name: 'Laura Bianchi', 
      email: 'laura@example.com',
      role: 'Editor',
      department: 'Marketing'
    },
    { 
      id: 3, 
      name: 'Giuseppe Verdi', 
      email: 'giuseppe@example.com',
      role: 'Viewer',
      department: 'Sales'
    }
  ]
  
  const sampleProducts: Product[] = [
    { id: 1, name: 'Laptop', price: 999 },
    { id: 2, name: 'Mouse', price: 29 },
    { id: 3, name: 'Tastiera', price: 79 }
  ]
  
  return (
    <Container maxWidth="1400px">
      {/* Header della demo */}
      <Card variant="primary">
        <h1 style={{ margin: '0 0 10px 0' }}>🧩 Composizione UI con Props</h1>
        <p style={{ margin: 0 }}>
          Esempi di composizione di componenti usando solo props (versione statica)
        </p>
      </Card>
      
      {/* Sezione 1: Layout Components */}
      <Card title="1️⃣ Layout Components">
        <p>Esempio di layout con sezioni composte:</p>
        <div style={{ 
          border: '2px dashed #ccc',
          borderRadius: '8px',
          padding: '10px',
          backgroundColor: '#f8f9fa'
        }}>
          <Layout
            header={
              <div>
                <h2 style={{ margin: 0 }}>🏠 Header</h2>
                <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>
                  Passato come prop "header"
                </p>
              </div>
            }
            sidebar={
              <div>
                <h3>📋 Sidebar</h3>
                <ul style={{ paddingLeft: '20px' }}>
                  <li>Menu 1</li>
                  <li>Menu 2</li>
                  <li>Menu 3</li>
                </ul>
              </div>
            }
            main={
              <div>
                <h3>📄 Main Content</h3>
                <p>Questo è il contenuto principale passato come prop "main"</p>
              </div>
            }
            footer={
              <p style={{ margin: 0 }}>
                © 2024 - Footer passato come prop "footer"
              </p>
            }
          />
        </div>
      </Card>
      
      {/* Sezione 2: Children Pattern */}
      <Card title="2️⃣ Children Pattern">
        <p>Componenti che accettano children per contenuto flessibile:</p>
        <Card variant="success">
          <p>Questo contenuto è passato come <strong>children</strong></p>
          <p>Puoi inserire qualsiasi elemento JSX!</p>
        </Card>
        <Card variant="warning" title="Card con Titolo">
          <p>Questa card ha sia un titolo che dei children</p>
        </Card>
      </Card>
      
      {/* Sezione 3: Composizione Atomica */}
      <Card title="3️⃣ Composizione di Componenti Atomici">
        <p>Bottoni composti in un ButtonGroup:</p>
        <ButtonGroup>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="success">Success</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="warning">Warning</Button>
        </ButtonGroup>
        
        <div style={{ marginTop: '15px' }}>
          <p>Bottoni di dimensioni diverse:</p>
          <ButtonGroup>
            <Button size="small" variant="primary">Small</Button>
            <Button size="medium" variant="primary">Medium</Button>
            <Button size="large" variant="primary">Large</Button>
          </ButtonGroup>
        </div>
      </Card>
      
      {/* Sezione 4: Composizione con Props Specifiche */}
      <Card title="4️⃣ Composizione con Props Specifiche">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <h4>Senza Dettagli:</h4>
            <UserList users={sampleUsers} showDetails={false} />
          </div>
          <div>
            <h4>Con Dettagli:</h4>
            <UserList users={sampleUsers} showDetails={true} />
          </div>
        </div>
      </Card>
      
      {/* Sezione 5: Slot Pattern */}
      <Card title="5️⃣ Slot Pattern (Modal)">
        <p>Esempio di Modal con slot predefiniti (sempre aperto per demo):</p>
        <div style={{ position: 'relative', height: '400px' }}>
          <Modal
            isOpen={true}
            title="🎯 Titolo Modal"
            footer={
              <>
                <Button variant="secondary" size="small">Annulla</Button>
                <Button variant="primary" size="small">Conferma</Button>
              </>
            }
          >
            <p>Questo è il contenuto del modal passato come <strong>children</strong></p>
            <p>Il titolo e il footer sono passati come <strong>props separate</strong> (slot)</p>
          </Modal>
        </div>
      </Card>
      
      {/* Sezione 6: Form Composto */}
      <Card title="6️⃣ Form Composto">
        <Form title="📝 Registrazione Utente">
          <FormField 
            label="Nome Completo" 
            value="Mario Rossi"
            placeholder="Inserisci il tuo nome"
            required
          />
          <FormField 
            label="Email" 
            type="email"
            value="mario@example.com"
            placeholder="Inserisci la tua email"
            required
          />
          <FormField 
            label="Password" 
            type="password"
            value="********"
            placeholder="Inserisci la password"
            required
          />
          <ButtonGroup>
            <Button variant="primary">Registrati</Button>
            <Button variant="secondary">Annulla</Button>
          </ButtonGroup>
        </Form>
      </Card>
      
      {/* Sezione 7: Render Props Pattern */}
      <Card title="7️⃣ Render Props Pattern">
        <p>Componente DataDisplay con render personalizzato:</p>
        <DataDisplay
          data={sampleProducts}
          renderItem={(product) => (
            <Card variant="success">
              <h4 style={{ margin: '0 0 10px 0' }}>{product.name}</h4>
              <p style={{ 
                margin: 0,
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#28a745'
              }}>
                €{product.price}
              </p>
            </Card>
          )}
        />
      </Card>
      
      {/* Note Finali */}
      <Card variant="warning">
        <h3 style={{ marginTop: 0 }}>💡 Nota per gli Studenti</h3>
        <p>
          Questi esempi mostrano la <strong>composizione di componenti</strong> usando solo <strong>props</strong>.
        </p>
        <p>
          Nella <strong>Lezione 08</strong> imparerai a usare <strong>useState</strong> per rendere
          questi componenti interattivi!
        </p>
        <p>
          Nella <strong>Lezione 13</strong> imparerai il <strong>Context API</strong> per evitare
          il "props drilling" in componenti profondamente annidati.
        </p>
        <p style={{ marginBottom: 0, fontSize: '14px' }}>
          Per ora, concentrati sui <strong>pattern di composizione</strong>: children, slot, render props! 🚀
        </p>
      </Card>
    </Container>
  )
}

export default ComposizioneDemo

