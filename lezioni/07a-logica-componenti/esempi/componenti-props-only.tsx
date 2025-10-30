// Componenti Demo - Esempi con Props (Versione Statica)
// Questo file dimostra i concetti di componenti usando solo props e composizione
// Versione semplificata per la Lezione 07a - La versione interattiva sarà nella Lezione 08+

/**
 * CONCETTI DIMOSTRATI:
 * 1. Componenti Funzionali
 * 2. Props e loro utilizzo
 * 3. Composizione di componenti
 * 4. Single Responsibility Principle
 * 5. Componenti Presentazionali vs Container
 */

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'success' | 'danger'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
}

interface CardProps {
  title?: string
  children: React.ReactNode
  footer?: React.ReactNode
  variant?: 'default' | 'primary' | 'success' | 'warning'
}

interface User {
  id: number
  name: string
  email: string
  role: string
  active: boolean
}

interface UserCardProps {
  user: User
}

interface UserListProps {
  users: User[]
  title?: string
}

interface Stats {
  totalUsers: number
  activeUsers: number
  inactiveUsers: number
}

interface DashboardProps {
  users: User[]
  stats: Stats
  onAction: (action: string) => void
}

// ========================================
// 1. COMPONENTI PRESENTAZIONALI
// ========================================

// Componente Button - Solo presentazione
function Button({ children, onClick, variant = 'primary', size = 'medium', disabled = false }: ButtonProps) {
  // Stili basati sulle props
  const baseStyle: React.CSSProperties = {
    padding: size === 'small' ? '8px 16px' : size === 'large' ? '16px 32px' : '12px 24px',
    fontSize: size === 'small' ? '14px' : size === 'large' ? '18px' : '16px',
    border: 'none',
    borderRadius: '4px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    transition: 'all 0.2s ease'
  }
  
  const variantStyles: Record<string, React.CSSProperties> = {
    primary: { backgroundColor: '#007bff', color: 'white' },
    secondary: { backgroundColor: '#6c757d', color: 'white' },
    success: { backgroundColor: '#28a745', color: 'white' },
    danger: { backgroundColor: '#dc3545', color: 'white' }
  }
  
  return (
    <button 
      style={{ ...baseStyle, ...variantStyles[variant] }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

// Componente Card - Solo presentazione
function Card({ title, children, footer, variant = 'default' }: CardProps) {
  const variantStyles: Record<string, React.CSSProperties> = {
    default: { borderColor: '#dee2e6', backgroundColor: '#fff' },
    primary: { borderColor: '#007bff', backgroundColor: '#f8f9fa' },
    success: { borderColor: '#28a745', backgroundColor: '#f8f9fa' },
    warning: { borderColor: '#ffc107', backgroundColor: '#fff3cd' }
  }
  
  return (
    <div style={{ 
      border: '2px solid',
      borderRadius: '8px',
      padding: '20px',
      margin: '10px 0',
      ...variantStyles[variant]
    }}>
      {title && (
        <h3 style={{ marginTop: 0, paddingBottom: '10px', borderBottom: '1px solid #dee2e6' }}>
          {title}
        </h3>
      )}
      <div style={{ margin: '15px 0' }}>
        {children}
      </div>
      {footer && (
        <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #dee2e6' }}>
          {footer}
        </div>
      )}
    </div>
  )
}

// Componente UserCard - Presentazionale
function UserCard({ user }: UserCardProps) {
  return (
    <div style={{ 
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '15px',
      margin: '10px 0',
      display: 'flex',
      alignItems: 'center',
      gap: '15px'
    }}>
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
        fontWeight: 'bold'
      }}>
        {user.name.charAt(0)}
      </div>
      
      {/* Info */}
      <div style={{ flex: 1 }}>
        <h4 style={{ margin: '0 0 5px 0' }}>{user.name}</h4>
        <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>{user.email}</p>
        <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#999' }}>
          Ruolo: {user.role}
        </p>
      </div>
      
      {/* Status Badge */}
      <div style={{
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        backgroundColor: user.active ? '#d4edda' : '#f8d7da',
        color: user.active ? '#155724' : '#721c24'
      }}>
        {user.active ? 'Attivo' : 'Inattivo'}
      </div>
    </div>
  )
}

// ========================================
// 2. COMPONENTI CONTAINER
// ========================================

// Componente UserList - Container che gestisce i dati
function UserList({ users, title = "Lista Utenti" }: UserListProps) {
  // Dati passati come props - nessuno stato interno
  
  return (
    <Card title={title} variant="primary">
      {users.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666' }}>
          Nessun utente disponibile
        </p>
      ) : (
        <div>
          {users.map(user => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      )}
      <div style={{ marginTop: '15px', textAlign: 'center', color: '#666', fontSize: '14px' }}>
        Totale utenti: {users.length}
      </div>
    </Card>
  )
}

// ========================================
// 3. COMPOSIZIONE DI COMPONENTI
// ========================================

// Componente Dashboard - Compone altri componenti
function Dashboard({ users, stats, onAction }: DashboardProps) {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Dashboard Utenti</h1>
      
      {/* Sezione Statistiche */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '20px' }}>
        <Card variant="primary">
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#007bff' }}>
              {stats.totalUsers}
            </div>
            <div style={{ color: '#666', marginTop: '5px' }}>Totale Utenti</div>
          </div>
        </Card>
        
        <Card variant="success">
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#28a745' }}>
              {stats.activeUsers}
            </div>
            <div style={{ color: '#666', marginTop: '5px' }}>Utenti Attivi</div>
          </div>
        </Card>
        
        <Card variant="warning">
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffc107' }}>
              {stats.inactiveUsers}
            </div>
            <div style={{ color: '#666', marginTop: '5px' }}>Utenti Inattivi</div>
          </div>
        </Card>
      </div>
      
      {/* Lista Utenti */}
      <UserList users={users} />
      
      {/* Azioni */}
      <Card title="Azioni" footer={
        <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
          💡 Nella Lezione 08 imparerai a rendere questi pulsanti interattivi!
        </p>
      }>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Button variant="primary" onClick={() => onAction('add')}>
            Aggiungi Utente
          </Button>
          <Button variant="secondary" onClick={() => onAction('refresh')}>
            Aggiorna Lista
          </Button>
          <Button variant="danger" onClick={() => onAction('clear')} disabled>
            Elimina Tutti (Disabilitato)
          </Button>
        </div>
      </Card>
    </div>
  )
}

// ========================================
// 4. ESEMPIO PRINCIPALE
// ========================================

function ComponentiDemo() {
  // Dati di esempio - statici per questa lezione
  const users: User[] = [
    { id: 1, name: 'Mario Rossi', email: 'mario@example.com', role: 'Admin', active: true },
    { id: 2, name: 'Luigi Bianchi', email: 'luigi@example.com', role: 'User', active: true },
    { id: 3, name: 'Anna Verdi', email: 'anna@example.com', role: 'User', active: false },
    { id: 4, name: 'Sofia Neri', email: 'sofia@example.com', role: 'Editor', active: true }
  ]
  
  // Statistiche calcolate dai dati
  const stats: Stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.active).length,
    inactiveUsers: users.filter(u => !u.active).length
  }
  
  // Handler per le azioni - per ora solo log
  const handleAction = (action: string) => {
    console.log(`Azione richiesta: ${action}`)
    // Nella Lezione 08 imparerai a gestire queste azioni con useState!
  }
  
  return (
    <div>
      {/* Info Header */}
      <Card variant="primary">
        <h2 style={{ marginTop: 0 }}>🎨 Demo Componenti - Versione con Props</h2>
        <p>
          Questo esempio dimostra i concetti fondamentali dei componenti React:
        </p>
        <ul style={{ textAlign: 'left' }}>
          <li><strong>Componenti Presentazionali</strong>: Button, Card, UserCard</li>
          <li><strong>Componenti Container</strong>: UserList, Dashboard</li>
          <li><strong>Composizione</strong>: Come i componenti si combinano</li>
          <li><strong>Props</strong>: Come i dati fluiscono dall'alto verso il basso</li>
        </ul>
        <div style={{ 
          marginTop: '15px', 
          padding: '10px', 
          backgroundColor: '#fff3cd', 
          borderRadius: '4px',
          fontSize: '14px'
        }}>
          💡 <strong>Nota</strong>: Questi componenti usano solo <strong>props</strong> e valori statici.
          Nella <strong>Lezione 08</strong> imparerai a renderli interattivi con <strong>useState</strong>!
        </div>
      </Card>
      
      {/* Dashboard Principale */}
      <Dashboard 
        users={users} 
        stats={stats} 
        onAction={handleAction}
      />
      
      {/* Esempi di Varianti */}
      <Card title="Esempi di Varianti dei Componenti">
        <h4>Varianti Button:</h4>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="success">Success</Button>
          <Button variant="danger">Danger</Button>
        </div>
        
        <h4>Dimensioni Button:</h4>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button size="small">Small</Button>
          <Button size="medium">Medium</Button>
          <Button size="large">Large</Button>
        </div>
      </Card>
    </div>
  )
}

export default ComponentiDemo

