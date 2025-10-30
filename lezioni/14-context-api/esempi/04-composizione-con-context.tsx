// Composizione con Context API - Demo Avanzata
// Questo esempio mostra come usare Context API per evitare props drilling
// Ora che hai completato la Lezione 13, puoi capire come Context semplifica la composizione!

import { useState, useContext, createContext } from 'react';

// 1. Context per evitare props drilling
const UserContext = createContext();

// 2. Componente base per layout
function Layout({ header, sidebar, main, footer }) {
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
  );
}

// 3. Componente base per card
function Card({ title, children, actions, className = '' }) {
  return (
    <div style={{
      border: '1px solid #dee2e6',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      backgroundColor: 'white',
      marginBottom: '20px'
    }}>
      {title && (
        <div style={{ 
          padding: '16px', 
          borderBottom: '1px solid #dee2e6',
          backgroundColor: '#f8f9fa',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ margin: 0, fontSize: '18px' }}>{title}</h3>
          {actions && <div>{actions}</div>}
        </div>
      )}
      <div style={{ padding: '16px' }}>
        {children}
      </div>
    </div>
  );
}

// 4. Componente per filtri
function FilterBar({ filters, onFilterChange }) {
  return (
    <div style={{ 
      display: 'flex', 
      gap: '16px', 
      marginBottom: '20px',
      flexWrap: 'wrap'
    }}>
      {filters.map(filter => (
        <div key={filter.key} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '14px', fontWeight: '500' }}>{filter.label}</label>
          <input
            type={filter.type}
            value={filter.value}
            onChange={(e) => onFilterChange(filter.key, e.target.value)}
            placeholder={filter.placeholder}
            style={{
              padding: '8px 12px',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        </div>
      ))}
    </div>
  );
}

// 5. Componente per lista
function ItemList({ items, renderItem, emptyMessage }) {
  if (items.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '40px',
        color: '#6c757d'
      }}>
        {emptyMessage}
      </div>
    );
  }
  
  return (
    <div style={{ display: 'grid', gap: '16px' }}>
      {items.map(item => (
        <div key={item.id} style={{
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          padding: '16px',
          backgroundColor: 'white'
        }}>
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
}

// 6. Componente per lista filtrata
function FilterableList({ 
  items, 
  filters, 
  onFilterChange, 
  renderItem,
  emptyMessage = "Nessun elemento trovato"
}) {
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
      <FilterBar filters={filters} onFilterChange={onFilterChange} />
      <ItemList 
        items={filteredItems} 
        renderItem={renderItem}
        emptyMessage={emptyMessage}
      />
    </div>
  );
}

// 7. Componente per statistiche
function StatsWidget({ stats }) {
  return (
    <Card title="Statistiche">
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '16px'
      }}>
        {stats.map(stat => (
          <div key={stat.label} style={{ 
            textAlign: 'center',
            padding: '16px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px'
          }}>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: 'bold',
              color: '#007bff'
            }}>
              {stat.value}
            </div>
            <div style={{ 
              fontSize: '14px', 
              color: '#6c757d',
              marginTop: '4px'
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// 8. Componente per form
function FormField({ label, error, children }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ 
        display: 'block', 
        marginBottom: '4px', 
        fontWeight: '500',
        fontSize: '14px'
      }}>
        {label}
      </label>
      {children}
      {error && (
        <span style={{ 
          color: '#dc3545', 
          fontSize: '12px',
          marginTop: '4px',
          display: 'block'
        }}>
          {error}
        </span>
      )}
    </div>
  );
}

function UserForm({ onSubmit, initialUser = null }) {
  const [formData, setFormData] = useState({
    name: initialUser?.name || '',
    email: initialUser?.email || '',
    role: initialUser?.role || 'user'
  });
  
  const [errors, setErrors] = useState({});
  
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Nome è richiesto';
    if (!formData.email.trim()) newErrors.email = 'Email è richiesta';
    if (!formData.email.includes('@')) newErrors.email = 'Email non valida';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
      setFormData({ name: '', email: '', role: 'user' });
    }
  };
  
  return (
    <Card title="Form Utente">
      <form onSubmit={handleSubmit}>
        <FormField label="Nome" error={errors.name}>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: `1px solid ${errors.name ? '#dc3545' : '#ced4da'}`,
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        </FormField>
        
        <FormField label="Email" error={errors.email}>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: `1px solid ${errors.email ? '#dc3545' : '#ced4da'}`,
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        </FormField>
        
        <FormField label="Ruolo">
          <select
            value={formData.role}
            onChange={(e) => handleChange('role', e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            <option value="user">Utente</option>
            <option value="admin">Amministratore</option>
            <option value="moderator">Moderatore</option>
          </select>
        </FormField>
        
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          {initialUser ? 'Aggiorna Utente' : 'Crea Utente'}
        </button>
      </form>
    </Card>
  );
}

// 9. Componente per header
function Header() {
  const { user } = useContext(UserContext);
  
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center' 
    }}>
      <h1 style={{ margin: 0, color: '#007bff' }}>Dashboard</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span>Ciao, {user?.name || 'Utente'}</span>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#007bff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold'
        }}>
          {user?.name?.charAt(0) || 'U'}
        </div>
      </div>
    </div>
  );
}

// 10. Componente per sidebar
function Sidebar() {
  const { user, setUser } = useContext(UserContext);
  
  const menuItems = [
    { label: 'Dashboard', active: true },
    { label: 'Utenti', active: false },
    { label: 'Impostazioni', active: false }
  ];
  
  return (
    <div>
      <h3 style={{ marginTop: 0 }}>Menu</h3>
      <nav>
        {menuItems.map((item, index) => (
          <div
            key={index}
            style={{
              padding: '12px 16px',
              marginBottom: '4px',
              borderRadius: '4px',
              backgroundColor: item.active ? '#007bff' : 'transparent',
              color: item.active ? 'white' : '#333',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {item.label}
          </div>
        ))}
      </nav>
      
      <div style={{ marginTop: '20px' }}>
        <button
          onClick={() => setUser({ 
            name: 'Mario Rossi', 
            email: 'mario@example.com',
            role: 'admin'
          })}
          style={{
            width: '100%',
            padding: '8px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Login come Mario
        </button>
      </div>
    </div>
  );
}

// 11. Componente principale per il contenuto
function MainContent() {
  const { user } = useContext(UserContext);
  const [users, setUsers] = useState([
    { id: 1, name: 'Mario Rossi', email: 'mario@example.com', role: 'admin' },
    { id: 2, name: 'Luigi Bianchi', email: 'luigi@example.com', role: 'user' },
    { id: 3, name: 'Giulia Verdi', email: 'giulia@example.com', role: 'moderator' }
  ]);
  
  const [filters, setFilters] = useState([
    { key: 'name', label: 'Nome', type: 'text', value: '', placeholder: 'Filtra per nome' },
    { key: 'role', label: 'Ruolo', type: 'text', value: '', placeholder: 'Filtra per ruolo' }
  ]);
  
  const handleFilterChange = (key, value) => {
    setFilters(prev => prev.map(filter => 
      filter.key === key ? { ...filter, value } : filter
    ));
  };
  
  const handleUserSubmit = (userData) => {
    const newUser = {
      id: Date.now(),
      ...userData
    };
    setUsers(prev => [...prev, newUser]);
  };
  
  const renderUser = (user) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <h4 style={{ margin: '0 0 4px 0' }}>{user.name}</h4>
        <p style={{ margin: '0 0 4px 0', color: '#6c757d' }}>{user.email}</p>
        <span style={{
          padding: '2px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          backgroundColor: user.role === 'admin' ? '#dc3545' : user.role === 'moderator' ? '#ffc107' : '#28a745',
          color: 'white'
        }}>
          {user.role}
        </span>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button style={{
          padding: '4px 8px',
          backgroundColor: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px'
        }}>
          Modifica
        </button>
        <button style={{
          padding: '4px 8px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px'
        }}>
          Elimina
        </button>
      </div>
    </div>
  );
  
  const stats = [
    { label: 'Totale Utenti', value: users.length },
    { label: 'Amministratori', value: users.filter(u => u.role === 'admin').length },
    { label: 'Moderatori', value: users.filter(u => u.role === 'moderator').length },
    { label: 'Utenti', value: users.filter(u => u.role === 'user').length }
  ];
  
  return (
    <div>
      <StatsWidget stats={stats} />
      
      <Card 
        title="Gestione Utenti"
        actions={
          <button style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Aggiungi Utente
          </button>
        }
      >
        <FilterableList
          items={users}
          filters={filters}
          onFilterChange={handleFilterChange}
          renderItem={renderUser}
          emptyMessage="Nessun utente trovato"
        />
      </Card>
      
      <UserForm onSubmit={handleUserSubmit} />
    </div>
  );
}

// 12. Componente principale che combina tutto
function ComposizioneDemo() {
  const [user, setUser] = useState(null);
  
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Layout
        header={<Header />}
        sidebar={<Sidebar />}
        main={<MainContent />}
        footer={<div>© 2024 Demo Composizione React</div>}
      />
    </UserContext.Provider>
  );
}

export default ComposizioneDemo;
