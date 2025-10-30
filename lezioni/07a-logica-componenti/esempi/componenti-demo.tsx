/**
 * ⚠️ ATTENZIONE: Questo esempio usa hooks
 * 
 * Questo esempio usa useState, useEffect, memo e useCallback che saranno spiegati
 * nelle lezioni successive (8, 12, 14).
 * 
 * Per la Lezione 07a, usa 'componenti-props-only.jsx' che mostra gli stessi concetti
 * usando solo props e composizione.
 * 
 * Questo file sarà spostato nella Lezione 14 come esempio avanzato.
 */

/*
// Demo Componenti React - Esempi pratici di logica dei componenti
// Questo file dimostra diversi tipi di componenti e le loro caratteristiche

import { useState, useEffect, memo, useCallback } from 'react';

// 1. Componente Presentazionale - Button
function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  ...props 
}) {
  const handleClick = (event) => {
    if (disabled) return;
    onClick?.(event);
  };
  
  return (
    <button 
      className={`btn btn-${variant} btn-${size}`}
      onClick={handleClick}
      disabled={disabled}
      style={{
        padding: size === 'small' ? '8px 16px' : size === 'large' ? '16px 32px' : '12px 24px',
        fontSize: size === 'small' ? '14px' : size === 'large' ? '18px' : '16px',
        backgroundColor: variant === 'primary' ? '#007bff' : variant === 'secondary' ? '#6c757d' : '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'all 0.2s ease'
      }}
      {...props}
    >
      {children}
    </button>
  );
}

// 2. Componente Presentazionale - Card
function Card({ 
  title, 
  children, 
  footer, 
  className = '',
  ...props 
}) {
  return (
    <div 
      className={`card ${className}`}
      style={{
        border: '1px solid #dee2e6',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        backgroundColor: 'white'
      }}
      {...props}
    >
      {title && (
        <div style={{ 
          padding: '16px', 
          borderBottom: '1px solid #dee2e6',
          backgroundColor: '#f8f9fa'
        }}>
          <h3 style={{ margin: 0, fontSize: '18px' }}>{title}</h3>
        </div>
      )}
      <div style={{ padding: '16px' }}>
        {children}
      </div>
      {footer && (
        <div style={{ 
          padding: '16px', 
          borderTop: '1px solid #dee2e6',
          backgroundColor: '#f8f9fa'
        }}>
          {footer}
        </div>
      )}
    </div>
  );
}

// 3. Componente Presentazionale - UserCard
function UserCard({ user, onEdit, onDelete }) {
  return (
    <Card 
      title={user.name}
      footer={
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button 
            variant="secondary" 
            size="small"
            onClick={() => onEdit(user)}
          >
            Modifica
          </Button>
          <Button 
            variant="danger" 
            size="small"
            onClick={() => onDelete(user.id)}
          >
            Elimina
          </Button>
        </div>
      }
    >
      <div>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Età:</strong> {user.age} anni</p>
        <p><strong>Città:</strong> {user.city}</p>
        <p><strong>Ruolo:</strong> {user.role}</p>
      </div>
    </Card>
  );
}

// 4. Componente Container - UserList
function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Simula caricamento dati
    setTimeout(() => {
      setUsers([
        { id: 1, name: 'Mario Rossi', email: 'mario@example.com', age: 25, city: 'Milano', role: 'Developer' },
        { id: 2, name: 'Luigi Bianchi', email: 'luigi@example.com', age: 30, city: 'Roma', role: 'Designer' },
        { id: 3, name: 'Giulia Verdi', email: 'giulia@example.com', age: 28, city: 'Napoli', role: 'Manager' }
      ]);
      setLoading(false);
    }, 1000);
  }, []);
  
  const handleEdit = useCallback((user) => {
    console.log('Modifica utente:', user);
    alert(`Modifica utente: ${user.name}`);
  }, []);
  
  const handleDelete = useCallback((userId) => {
    if (window.confirm('Sei sicuro di voler eliminare questo utente?')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
    }
  }, []);
  
  if (loading) {
    return (
      <Card title="Lista Utenti">
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ 
            display: 'inline-block',
            width: '20px',
            height: '20px',
            border: '2px solid #f3f3f3',
            borderTop: '2px solid #007bff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p>Caricamento utenti...</p>
        </div>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card title="Errore">
        <p style={{ color: '#dc3545' }}>Errore nel caricamento: {error}</p>
      </Card>
    );
  }
  
  return (
    <Card title={`Lista Utenti (${users.length})`}>
      <div style={{ display: 'grid', gap: '16px' }}>
        {users.map(user => (
          <UserCard 
            key={user.id} 
            user={user} 
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </Card>
  );
}

// 5. Componente con Stato - Counter
function Counter({ initialValue = 0, step = 1 }) {
  const [count, setCount] = useState(initialValue);
  
  const increment = () => setCount(prev => prev + step);
  const decrement = () => setCount(prev => prev - step);
  const reset = () => setCount(initialValue);
  
  return (
    <Card title="Contatore">
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          margin: '20px 0',
          color: '#007bff'
        }}>
          {count}
        </div>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <Button onClick={decrement} variant="secondary">
            -{step}
          </Button>
          <Button onClick={reset} variant="secondary">
            Reset
          </Button>
          <Button onClick={increment}>
            +{step}
          </Button>
        </div>
      </div>
    </Card>
  );
}

// 6. Componente con Form - UserForm
function UserForm({ onSubmit, initialUser = null }) {
  const [formData, setFormData] = useState({
    name: initialUser?.name || '',
    email: initialUser?.email || '',
    age: initialUser?.age || '',
    city: initialUser?.city || '',
    role: initialUser?.role || 'Developer'
  });
  
  const [errors, setErrors] = useState({});
  
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Rimuovi errore quando l'utente inizia a digitare
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Nome è richiesto';
    if (!formData.email.trim()) newErrors.email = 'Email è richiesta';
    if (!formData.age || formData.age < 18) newErrors.age = 'Età deve essere almeno 18';
    if (!formData.city.trim()) newErrors.city = 'Città è richiesta';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
      setFormData({
        name: '',
        email: '',
        age: '',
        city: '',
        role: 'Developer'
      });
    }
  };
  
  return (
    <Card title="Form Utente">
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
            Nome *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: `1px solid ${errors.name ? '#dc3545' : '#ced4da'}`,
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
          {errors.name && (
            <span style={{ color: '#dc3545', fontSize: '14px' }}>{errors.name}</span>
          )}
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
            Email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: `1px solid ${errors.email ? '#dc3545' : '#ced4da'}`,
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
          {errors.email && (
            <span style={{ color: '#dc3545', fontSize: '14px' }}>{errors.email}</span>
          )}
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
            Età *
          </label>
          <input
            type="number"
            value={formData.age}
            onChange={(e) => handleChange('age', parseInt(e.target.value))}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: `1px solid ${errors.age ? '#dc3545' : '#ced4da'}`,
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
          {errors.age && (
            <span style={{ color: '#dc3545', fontSize: '14px' }}>{errors.age}</span>
          )}
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
            Città *
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: `1px solid ${errors.city ? '#dc3545' : '#ced4da'}`,
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
          {errors.city && (
            <span style={{ color: '#dc3545', fontSize: '14px' }}>{errors.city}</span>
          )}
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
            Ruolo
          </label>
          <select
            value={formData.role}
            onChange={(e) => handleChange('role', e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          >
            <option value="Developer">Developer</option>
            <option value="Designer">Designer</option>
            <option value="Manager">Manager</option>
            <option value="Tester">Tester</option>
          </select>
        </div>
        
        <Button type="submit" style={{ width: '100%' }}>
          {initialUser ? 'Aggiorna Utente' : 'Crea Utente'}
        </Button>
      </form>
    </Card>
  );
}

// 7. Componente Memoizzato - ExpensiveComponent
const ExpensiveComponent = memo(function ExpensiveComponent({ data, onUpdate }) {
  const renderCount = useRef(0);
  renderCount.current += 1;
  
  // Simula un calcolo costoso
  const expensiveValue = useMemo(() => {
    console.log('Calcolo costoso eseguito');
    return data.reduce((sum, item) => sum + item.value, 0);
  }, [data]);
  
  return (
    <Card title="Componente Costoso (Memoizzato)">
      <div>
        <p><strong>Render count:</strong> {renderCount.current}</p>
        <p><strong>Valore calcolato:</strong> {expensiveValue}</p>
        <Button onClick={() => onUpdate(Math.random())}>
          Aggiorna Dati
        </Button>
      </div>
    </Card>
  );
});

// 8. Componente principale che combina tutti gli esempi
function ComponentiDemo() {
  const [activeDemo, setActiveDemo] = useState('all');
  const [expensiveData, setExpensiveData] = useState([
    { id: 1, value: 10 },
    { id: 2, value: 20 },
    { id: 3, value: 30 }
  ]);
  
  const demos = [
    { id: 'all', name: 'Tutte le Demo' },
    { id: 'userlist', name: 'Lista Utenti' },
    { id: 'counter', name: 'Contatore' },
    { id: 'form', name: 'Form Utente' },
    { id: 'expensive', name: 'Componente Costoso' }
  ];
  
  const handleUserSubmit = (userData) => {
    console.log('Utente creato:', userData);
    alert(`Utente creato: ${userData.name}`);
  };
  
  const handleExpensiveUpdate = (newValue) => {
    setExpensiveData(prev => [...prev, { id: Date.now(), value: newValue }]);
  };
  
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <h1>🧩 Demo Componenti React</h1>
      <p>Esempi pratici di diversi tipi di componenti e le loro caratteristiche</p>
      
      <div style={{ 
        backgroundColor: '#e9ecef', 
        padding: '15px', 
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        <h3>🎛️ Seleziona Demo</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {demos.map(demo => (
            <Button
              key={demo.id}
              onClick={() => setActiveDemo(demo.id)}
              variant={activeDemo === demo.id ? 'primary' : 'secondary'}
              size="small"
            >
              {demo.name}
            </Button>
          ))}
        </div>
      </div>
      
      <div style={{ display: 'grid', gap: '20px' }}>
        {(activeDemo === 'all' || activeDemo === 'userlist') && <UserList />}
        {(activeDemo === 'all' || activeDemo === 'counter') && <Counter />}
        {(activeDemo === 'all' || activeDemo === 'form') && <UserForm onSubmit={handleUserSubmit} />}
        {(activeDemo === 'all' || activeDemo === 'expensive') && (
          <ExpensiveComponent 
            data={expensiveData} 
            onUpdate={handleExpensiveUpdate} 
          />
        )}
      </div>
      
      <div style={{ 
        backgroundColor: '#d1ecf1', 
        padding: '20px', 
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        <h3>💡 Istruzioni</h3>
        <ol>
          <li>Interagisci con i diversi componenti per vedere le loro caratteristiche</li>
          <li>Osserva come i componenti presentazionali sono riutilizzabili</li>
          <li>Nota come i componenti container gestiscono stato e logica</li>
          <li>Testa la validazione del form</li>
          <li>Verifica come la memoization previene re-render inutili</li>
        </ol>
      </div>
    </div>
  );
}

export default ComponentiDemo;
*/
