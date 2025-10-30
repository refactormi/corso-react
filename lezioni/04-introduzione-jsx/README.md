# Lezione 4: Introduzione JSX

## 🎯 Obiettivi della Lezione

Al termine di questa lezione sarai in grado di:
- Comprendere cos'è JSX e perché è utilizzato in React
- Scrivere sintassi JSX corretta
- Utilizzare espressioni JavaScript all'interno di JSX
- Gestire attributi e classi CSS in JSX
- Comprendere le differenze tra JSX e HTML

## 📚 Cos'è JSX?

**JSX** (JavaScript XML) è una sintassi che permette di scrivere HTML all'interno di JavaScript. È un'estensione della sintassi JavaScript che rende il codice React più leggibile e intuitivo.

### Definizione Ufficiale
> "JSX è una sintassi che combina JavaScript e XML/HTML, permettendo di descrivere l'interfaccia utente in modo dichiarativo." - [React.dev](https://react.dev/learn/writing-markup-with-jsx)

## 🔍 JSX vs HTML

### **Somiglianze**
- Sintassi simile all'HTML
- Tag di apertura e chiusura
- Attributi e contenuto

### **Differenze Principali**

| Caratteristica | HTML | JSX |
|----------------|------|-----|
| **Classi CSS** | `class="my-class"` | `className="my-class"` |
| **Stili inline** | `style="color: red"` | `style={{color: 'red'}}` |
| **Eventi** | `onclick="handleClick()"` | `onClick={handleClick}` |
| **Valori booleani** | `disabled="true"` | `disabled={true}` |
| **Self-closing tags** | `<img>` | `<img />` |

## ✍️ Sintassi JSX Base

### **Elemento Semplice**

```tsx
// TSX
const element = <h1>Ciao, mondo!</h1>;

// Equivale a (senza JSX)
const element = React.createElement('h1', null, 'Ciao, mondo!');
```

### **Elemento con Attributi**

```tsx
// TSX
const element = <div className="container" id="main">Contenuto</div>;

// Equivale a
const element = React.createElement(
  'div', 
  { className: 'container', id: 'main' }, 
  'Contenuto'
);
```

### **Elemento Annidato**

```tsx
// TSX
const element = (
  <div>
    <h1>Titolo</h1>
    <p>Paragrafo</p>
  </div>
);

// Equivale a
const element = React.createElement(
  'div',
  null,
  React.createElement('h1', null, 'Titolo'),
  React.createElement('p', null, 'Paragrafo')
);
```

## 🔧 Espressioni JavaScript in JSX

### **Variabili e Valori**

```tsx
function Welcome() {
  const name: string = "Mario";
  const age: number = 25;
  
  return (
    <div>
      <h1>Ciao, {name}!</h1>
      <p>Hai {age} anni</p>
      <p>Il prossimo anno avrai {age + 1} anni</p>
    </div>
  );
}
```

### **Espressioni Complesse**

```tsx
function Calculator() {
  const a: number = 10;
  const b: number = 5;
  
  return (
    <div>
      <p>Somma: {a + b}</p>
      <p>Sottrazione: {a - b}</p>
      <p>Moltiplicazione: {a * b}</p>
      <p>Divisione: {a / b}</p>
      <p>Resto: {a % b}</p>
    </div>
  );
}
```

### **Chiamate di Funzioni**

```tsx
function Greeting() {
  const formatName = (firstName: string, lastName: string): string => {
    return `${firstName} ${lastName}`;
  };
  
  const user = {
    firstName: "Mario",
    lastName: "Rossi"
  };
  
  return (
    <h1>Ciao, {formatName(user.firstName, user.lastName)}!</h1>
  );
}
```

### **Operatori Condizionali**

```tsx
function ConditionalRendering() {
  const isLoggedIn: boolean = true;
  const userName: string = "Mario";
  
  return (
    <div>
      {isLoggedIn ? (
        <h1>Benvenuto, {userName}!</h1>
      ) : (
        <h1>Effettua il login</h1>
      )}
    </div>
  );
}
```

## 🎨 Attributi e Stili

### **Attributi Standard**

```tsx
function Attributes() {
  return (
    <div>
      <input 
        type="text" 
        placeholder="Inserisci il tuo nome"
        maxLength={50}
        required={true}
      />
      <img 
        src="/logo.png" 
        alt="Logo dell'azienda"
        width={200}
        height={100}
      />
    </div>
  );
}
```

### **Classi CSS**

```tsx
function CSSClasses() {
  const isActive: boolean = true;
  const theme: string = "dark";
  
  return (
    <div>
      {/* Classe statica */}
      <div className="container">Contenuto</div>
      
      {/* Classe condizionale */}
      <button className={isActive ? "active" : "inactive"}>
        Pulsante
      </button>
      
      {/* Classi multiple */}
      <div className={`base-class ${theme}-theme ${isActive ? 'active' : ''}`}>
        Elemento
      </div>
    </div>
  );
}
```

### **Stili Inline**

```tsx
function InlineStyles() {
  const styles = {
    container: {
      backgroundColor: '#f0f0f0',
      padding: '20px',
      borderRadius: '8px',
      margin: '10px 0'
    } as React.CSSProperties,
    title: {
      color: '#333',
      fontSize: '24px',
      fontWeight: 'bold'
    } as React.CSSProperties
  };
  
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Titolo Stilizzato</h1>
      <p style={{ color: '#666', fontSize: '16px' }}>
        Paragrafo con stile inline
      </p>
    </div>
  );
}
```

## 📝 Gestione Eventi

### **Eventi Base**

```tsx
function EventHandling() {
  const handleClick = () => {
    alert('Pulsante cliccato!');
  };
  
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Valore inserito:', event.target.value);
  };
  
  return (
    <div>
      <button onClick={handleClick}>
        Clicca qui
      </button>
      
      <input 
        type="text" 
        onChange={handleInputChange}
        placeholder="Digita qualcosa..."
      />
    </div>
  );
}
```

### **Eventi con Parametri**

```tsx
function EventWithParams() {
  const handleButtonClick = (buttonName: string) => {
    console.log(`Pulsante ${buttonName} cliccato`);
  };
  
  return (
    <div>
      <button onClick={() => handleButtonClick('Primo')}>
        Primo Pulsante
      </button>
      <button onClick={() => handleButtonClick('Secondo')}>
        Secondo Pulsante
      </button>
    </div>
  );
}
```

## 🔄 Rendering Condizionale

### **Operatore Ternario**

```tsx
function ConditionalRendering() {
  const isVisible: boolean = true;
  const count: number = 5;
  
  return (
    <div>
      {/* Rendering condizionale semplice */}
      {isVisible ? <p>Elemento visibile</p> : <p>Elemento nascosto</p>}
      
      {/* Rendering condizionale con null */}
      {count > 0 && <p>Il contatore è maggiore di 0</p>}
      
      {/* Rendering condizionale multiplo */}
      {count === 0 && <p>Contatore a zero</p>}
      {count > 0 && count < 10 && <p>Contatore tra 1 e 9</p>}
      {count >= 10 && <p>Contatore maggiore o uguale a 10</p>}
    </div>
  );
}
```

### **Rendering di Liste**

```tsx
function ListRendering() {
  const items: string[] = ['Mela', 'Banana', 'Arancia'];
  const users = [
    { id: 1, name: 'Mario', age: 25 },
    { id: 2, name: 'Luigi', age: 30 },
    { id: 3, name: 'Peach', age: 28 }
  ];
  
  return (
    <div>
      {/* Lista semplice */}
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      
      {/* Lista con oggetti */}
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} - {user.age} anni
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## 🏗️ Componenti e JSX

### **Componente Funzionale**

```tsx
function UserCard() {
  const name: string = "Mario Rossi";
  const email: string = "mario@example.com";
  const age: number = 25;
  
  return (
    <div className="user-card">
      <h2>{name}</h2>
      <p>Email: {email}</p>
      <p>Età: {age} anni</p>
    </div>
  );
}

// Utilizzo del componente
function App() {
  return (
    <div>
      <UserCard />
    </div>
  );
}
```

### **Componente con Logica**

```tsx
function ProductCard() {
  const productName: string = "Laptop";
  const price: number = 999;
  const inStock: boolean = true;
  const discount: number = 0.1;
  const finalPrice: number = price - (price * discount);
  
  return (
    <div className="product-card">
      <h2>{productName}</h2>
      <p className="price">
        Prezzo: €{finalPrice.toFixed(2)}
        {discount > 0 && <span> (-{discount * 100}%)</span>}
      </p>
      <p className="stock">
        {inStock ? "Disponibile" : "Non disponibile"}
      </p>
    </div>
  );
}
```

## ⚠️ Regole Importanti di JSX

### **1. Un Solo Elemento Radice**

```tsx
// ❌ SBAGLIATO - Più elementi radice
function WrongComponent() {
  return (
    <h1>Titolo</h1>
    <p>Paragrafo</p>
  );
}

// ✅ CORRETTO - Un solo elemento radice
function CorrectComponent() {
  return (
    <div>
      <h1>Titolo</h1>
      <p>Paragrafo</p>
    </div>
  );
}

// ✅ CORRETTO - Fragment
function FragmentComponent() {
  return (
    <>
      <h1>Titolo</h1>
      <p>Paragrafo</p>
    </>
  );
}
```

### **2. Tag Self-Closing**

```tsx
// ❌ SBAGLIATO
<img src="logo.png" alt="Logo"></img>
<br></br>

// ✅ CORRETTO
<img src="logo.png" alt="Logo" />
<br />
```

### **3. Attributi JavaScript**

```tsx
// ❌ SBAGLIATO
<div class="container" onclick="handleClick()">

// ✅ CORRETTO
<div className="container" onClick={handleClick}>
```

### **4. Chiavi per Liste**

```tsx
// ❌ SBAGLIATO - Manca la key
{items.map(item => <li>{item}</li>)}

// ✅ CORRETTO - Con key unica
{items.map((item, index) => <li key={index}>{item}</li>)}
```

## 🔧 JSX Avanzato

### **Fragment**

```tsx
function FragmentExample() {
  return (
    <>
      <h1>Titolo</h1>
      <p>Paragrafo</p>
    </>
  );
}

// Con Fragment esplicito
function ExplicitFragment() {
  return (
    <React.Fragment>
      <h1>Titolo</h1>
      <p>Paragrafo</p>
    </React.Fragment>
  );
}
```

### **JSX come Variabile**

```tsx
function JSXVariable() {
  const title = <h1>Il Mio Titolo</h1>;
  const content = (
    <div>
      <p>Contenuto 1</p>
      <p>Contenuto 2</p>
    </div>
  );
  
  return (
    <div>
      {title}
      {content}
    </div>
  );
}
```

### **JSX Condizionale Complesso**

```tsx
function ComplexConditional() {
  const loading: boolean = false;
  const user = {
    name: "Mario Rossi",
    isAdmin: true,
    permissions: ["read", "write", "delete"]
  };
  
  if (loading) {
    return <div>Caricamento...</div>;
  }
  
  if (!user) {
    return <div>Utente non trovato</div>;
  }
  
  return (
    <div>
      <h1>Benvenuto, {user.name}!</h1>
      {user.isAdmin && <p>Sei un amministratore</p>}
      {user.permissions?.length > 0 && (
        <ul>
          {user.permissions.map(permission => (
            <li key={permission}>{permission}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

## 🎯 Best Practices

### **1. Naming Conventions**

```tsx
// ✅ Componenti in PascalCase
function UserProfile() { }

// ✅ Variabili in camelCase
const userName: string = "Mario";

// ✅ Costanti in UPPER_SNAKE_CASE
const MAX_USERS: number = 100;
```

### **2. Organizzazione del Codice**

```tsx
function WellOrganizedComponent() {
  // 1. Costanti e variabili
  const title: string = "Titolo del componente";
  const items: string[] = ["Item 1", "Item 2", "Item 3"];
  
  // 2. Funzioni helper
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString();
  };
  
  // 3. Event handlers
  const handleClick = () => {
    console.log('Pulsante cliccato');
  };
  
  // 4. Render
  return (
    <div>
      <h1>{title}</h1>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <button onClick={handleClick}>Clicca</button>
    </div>
  );
}
```

### **3. Performance**

```tsx
// ✅ Usa key uniche per liste
const items = [
  { id: 1, name: "Item 1" },
  { id: 2, name: "Item 2" }
];

function ItemList() {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}

// ✅ Evita creazione di oggetti inline
const styles: React.CSSProperties = { color: 'red', fontSize: '16px' };

function StyledComponent() {
  return <div style={styles}>Testo stilizzato</div>;
}
```

## 🐛 Errori Comuni e Soluzioni

### **Errore: Adjacent JSX elements**

```tsx
// ❌ Errore
function ErrorComponent() {
  return (
    <h1>Titolo</h1>
    <p>Paragrafo</p>
  );
}

// ✅ Soluzione
function FixedComponent() {
  return (
    <>
      <h1>Titolo</h1>
      <p>Paragrafo</p>
    </>
  );
}
```

### **Errore: className invece di class**

```tsx
// ❌ Errore
<div class="container">

// ✅ Corretto
<div className="container">
```

### **Errore: Stili inline come stringa**

```tsx
// ❌ Errore
<div style="color: red; font-size: 16px;">

// ✅ Corretto
<div style={{ color: 'red', fontSize: '16px' }}>
```

## 📚 Risorse Aggiuntive

- **[JSX in Depth](https://react.dev/learn/writing-markup-with-jsx)**
- **[JSX Transform](https://react.dev/blog/2020/09/22/introducing-the-new-jsx-transform)**
- **[Babel JSX](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx)**

---

**Prossima Lezione**: [Lezione 5 - Analisi avvio app](../05-analisi-avvio-app/README.md)
