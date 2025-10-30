// JSX Playground - Esempi pratici di JSX (Versione Statica)
// Questo file contiene esempi di tutti i concetti JSX usando solo props e valori statici
// Versione semplificata per la Lezione 04 - Gli esempi interattivi saranno nella Lezione 8+

interface JSXAttributesProps {
  isHighlighted?: boolean
}

interface UserCardProps {
  name: string
  email: string
  role: string
}

interface ConditionalRenderingProps {
  isLoggedIn: boolean
  username: string
}

interface CardProps {
  title?: string
  children: React.ReactNode
  footer?: React.ReactNode
}

interface User {
  id: number
  name: string
  age: number
}

// 1. JSX Base - Elementi semplici
function JSXBase() {
  return (
    <div>
      <h1>JSX Base</h1>
      <p>Questo è un paragrafo semplice</p>
      <img src="/logo.png" alt="Logo" width={100} height={50} />
      <br />
      <hr />
    </div>
  )
}

// 2. Espressioni JavaScript in JSX
function JSXExpressions() {
  // Variabili locali - valori statici
  const name: string = "Mario"
  const age: number = 25
  const isActive: boolean = true
  
  return (
    <div>
      <h2>Espressioni JavaScript</h2>
      {/* Interpolazione di variabili */}
      <p>Nome: {name}</p>
      <p>Età: {age}</p>
      <p>Prossimo anno: {age + 1}</p>
      {/* Operatore ternario */}
      <p>Stato: {isActive ? "Attivo" : "Inattivo"}</p>
      {/* Espressioni matematiche */}
      <p>Calcolo: {10 + 5 * 2}</p>
    </div>
  )
}

// 3. Attributi e Stili con Props
function JSXAttributes({ isHighlighted = false }: JSXAttributesProps) {
  // Stili dinamici basati su props
  const dynamicStyles: React.CSSProperties = {
    backgroundColor: isHighlighted ? '#ffff00' : '#f0f0f0',
    padding: '10px',
    borderRadius: '5px',
    transition: 'all 0.3s ease'
  }
  
  return (
    <div>
      <h2>Attributi e Stili</h2>
      {/* Stili inline con oggetto */}
      <div style={dynamicStyles}>
        Questo box cambia colore in base alla prop isHighlighted
      </div>
      
      {/* Attributi HTML standard */}
      <input 
        type="text" 
        placeholder="Inserisci testo"
        className="input-field"
        disabled={false}
      />
      
      {/* Attributi booleani */}
      <button disabled>Pulsante Disabilitato</button>
      <button>Pulsante Attivo</button>
    </div>
  )
}

// 4. Composizione di Componenti con Props
function UserCard({ name, email, role }: UserCardProps) {
  return (
    <div style={{ 
      border: '1px solid #ddd', 
      padding: '15px', 
      borderRadius: '8px',
      margin: '10px 0'
    }}>
      <h3>{name}</h3>
      <p>Email: {email}</p>
      <p>Ruolo: {role}</p>
    </div>
  )
}

// 5. Rendering Condizionale con Props
function ConditionalRendering({ isLoggedIn, username }: ConditionalRenderingProps) {
  return (
    <div>
      <h2>Rendering Condizionale</h2>
      
      {/* Operatore ternario */}
      <p>
        {isLoggedIn 
          ? `Benvenuto, ${username}!` 
          : 'Per favore, effettua il login'}
      </p>
      
      {/* Operatore && per rendering condizionale */}
      {isLoggedIn && (
        <div style={{ backgroundColor: '#d4edda', padding: '10px' }}>
          Sei autenticato!
        </div>
      )}
      
      {!isLoggedIn && (
        <div style={{ backgroundColor: '#f8d7da', padding: '10px' }}>
          Accesso richiesto
        </div>
      )}
    </div>
  )
}

// 6. Liste e Keys con dati statici
function ListRendering() {
  // Array di dati statici
  const items: string[] = ['Mela', 'Banana', 'Arancia']
  const users: User[] = [
    { id: 1, name: 'Mario', age: 25 },
    { id: 2, name: 'Luigi', age: 30 },
    { id: 3, name: 'Anna', age: 28 }
  ]
  
  return (
    <div>
      <h2>Liste e Rendering</h2>
      
      {/* Lista semplice */}
      <h3>Frutti:</h3>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      
      {/* Lista di oggetti */}
      <h3>Utenti:</h3>
      {users.map(user => (
        <div key={user.id} style={{ 
          border: '1px solid #ccc', 
          padding: '10px', 
          margin: '5px 0' 
        }}>
          <strong>{user.name}</strong> - {user.age} anni
        </div>
      ))}
    </div>
  )
}

// 7. Composizione Avanzata con Props
function Card({ title, children, footer }: CardProps) {
  return (
    <div style={{ 
      border: '2px solid #007bff', 
      borderRadius: '8px',
      padding: '20px',
      margin: '10px 0'
    }}>
      {title && <h3 style={{ marginTop: 0 }}>{title}</h3>}
      <div>{children}</div>
      {footer && (
        <div style={{ 
          marginTop: '15px', 
          paddingTop: '15px', 
          borderTop: '1px solid #ddd' 
        }}>
          {footer}
        </div>
      )}
    </div>
  )
}

// 8. Componente Principale - Playground Demo
function JSXPlayground() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🎨 JSX Playground - Versione Statica</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Questi esempi mostrano i concetti fondamentali di JSX usando solo props e valori statici.
        Nella <strong>Lezione 8</strong> imparerai a renderli interattivi con useState!
      </p>
      
      {/* Sezione 1: Base */}
      <Card title="1. JSX Base">
        <JSXBase />
      </Card>
      
      {/* Sezione 2: Espressioni */}
      <Card title="2. Espressioni JavaScript">
        <JSXExpressions />
      </Card>
      
      {/* Sezione 3: Attributi - Esempio con props diverse */}
      <Card title="3. Attributi e Stili">
        <JSXAttributes isHighlighted={false} />
        <div style={{ marginTop: '20px' }}>
          <p>Con isHighlighted=true:</p>
          <JSXAttributes isHighlighted={true} />
        </div>
      </Card>
      
      {/* Sezione 4: Composizione */}
      <Card title="4. Composizione con Props">
        <UserCard 
          name="Mario Rossi" 
          email="mario@example.com" 
          role="Developer"
        />
        <UserCard 
          name="Anna Verdi" 
          email="anna@example.com" 
          role="Designer"
        />
      </Card>
      
      {/* Sezione 5: Rendering Condizionale */}
      <Card title="5. Rendering Condizionale">
        <ConditionalRendering isLoggedIn={true} username="Mario" />
        <div style={{ marginTop: '20px' }}>
          <p>Esempio con utente non loggato:</p>
          <ConditionalRendering isLoggedIn={false} username="" />
        </div>
      </Card>
      
      {/* Sezione 6: Liste */}
      <Card title="6. Liste e Keys">
        <ListRendering />
      </Card>
      
      {/* Note per gli studenti */}
      <Card 
        title="💡 Nota Importante"
        footer={
          <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
            Continua con la Lezione 8 per imparare a rendere questi componenti interattivi!
          </p>
        }
      >
        <p>
          Questi esempi usano solo <strong>props</strong> e <strong>valori statici</strong>.
          Nella <strong>Lezione 8</strong> imparerai a usare <strong>useState</strong> per:
        </p>
        <ul>
          <li>Gestire dati che cambiano nel tempo</li>
          <li>Rispondere alle azioni dell'utente (click, input, ecc.)</li>
          <li>Creare componenti veramente interattivi</li>
        </ul>
        <p>
          Per ora, concentrati su come JSX permette di combinare JavaScript e HTML,
          e come le props permettono di passare dati ai componenti! 🚀
        </p>
      </Card>
    </div>
  )
}

export default JSXPlayground

