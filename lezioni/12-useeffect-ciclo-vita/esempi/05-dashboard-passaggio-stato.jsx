import React, { useState, useEffect, useCallback } from 'react';

/**
 * Esempio 5: Dashboard con Stato Condiviso (Passaggio Stato tra Componenti)
 * 
 * Questo esempio dimostra:
 * - Lifting state up per condividere stato tra componenti
 * - Comunicazione padre-figlio con props e callback
 * - Gestione stato complesso condiviso
 * - Pattern di aggiornamento immutabile
 */

// Componente per la sidebar con lista utenti
function Sidebar({ users, selectedUser, onUserSelect, loading, onRefresh }) {
  return (
    <div style={{ 
      width: '300px', 
      borderRight: '1px solid #ccc', 
      padding: '20px',
      backgroundColor: '#f8f9fa',
      height: '100vh',
      overflowY: 'auto'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2 style={{ margin: 0, color: '#333' }}>👥 Utenti</h2>
        <button 
          onClick={onRefresh} 
          disabled={loading}
          style={{
            padding: '8px 12px',
            backgroundColor: loading ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px'
          }}
        >
          {loading ? '⏳' : '🔄'}
        </button>
      </div>
      
      {loading ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '20px',
          color: '#666'
        }}>
          <div style={{ 
            width: '20px', 
            height: '20px', 
            border: '2px solid #f3f3f3',
            borderTop: '2px solid #007bff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 10px'
          }} />
          Caricamento utenti...
        </div>
      ) : users.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '20px',
          color: '#666'
        }}>
          <p>Nessun utente trovato</p>
          <button 
            onClick={onRefresh}
            style={{
              padding: '8px 16px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Ricarica
          </button>
        </div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {users.map(user => (
            <li
              key={user.id}
              onClick={() => onUserSelect(user)}
              style={{
                padding: '15px',
                cursor: 'pointer',
                backgroundColor: selectedUser?.id === user.id ? '#e3f2fd' : 'transparent',
                border: '1px solid #ddd',
                marginBottom: '8px',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                borderLeft: selectedUser?.id === user.id ? '4px solid #2196f3' : '4px solid transparent'
              }}
              onMouseEnter={(e) => {
                if (selectedUser?.id !== user.id) {
                  e.target.style.backgroundColor = '#f8f9fa';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedUser?.id !== user.id) {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#007bff',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  marginRight: '12px'
                }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <strong style={{ display: 'block', color: '#333' }}>{user.name}</strong>
                  <small style={{ color: '#666' }}>{user.role}</small>
                </div>
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>
                📧 {user.email}
              </div>
              <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                Ultimo accesso: {new Date(user.lastLogin).toLocaleDateString('it-IT')}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Componente per il contenuto principale
function MainContent({ selectedUser, onUserUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    if (selectedUser) {
      setEditForm(selectedUser);
      setIsEditing(false);
    }
  }, [selectedUser]);
  
  const handleSave = async () => {
    setSaving(true);
    try {
      // Simula salvataggio
      await new Promise(resolve => setTimeout(resolve, 1000));
      onUserUpdate(editForm);
      setIsEditing(false);
    } catch (error) {
      console.error('Errore nel salvataggio:', error);
    } finally {
      setSaving(false);
    }
  };
  
  const handleCancel = () => {
    setEditForm(selectedUser);
    setIsEditing(false);
  };
  
  const handleFieldChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };
  
  if (!selectedUser) {
    return (
      <div style={{ 
        flex: 1, 
        padding: '40px', 
        textAlign: 'center',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>👤</div>
        <h2 style={{ color: '#666', marginBottom: '10px' }}>Seleziona un utente</h2>
        <p style={{ color: '#999', maxWidth: '400px' }}>
          Seleziona un utente dalla sidebar per visualizzare e modificare i dettagli
        </p>
      </div>
    );
  }
  
  return (
    <div style={{ 
      flex: 1, 
      padding: '30px',
      backgroundColor: '#fff',
      overflowY: 'auto'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: '1px solid #eee'
      }}>
        <div>
          <h2 style={{ margin: 0, color: '#333' }}>Dettagli Utente</h2>
          <p style={{ margin: '5px 0 0 0', color: '#666' }}>
            ID: {selectedUser.id} • Creato: {new Date(selectedUser.createdAt).toLocaleDateString('it-IT')}
          </p>
        </div>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          disabled={saving}
          style={{
            padding: '10px 20px',
            backgroundColor: isEditing ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: saving ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          {isEditing ? 'Annulla' : '✏️ Modifica'}
        </button>
      </div>
      
      {isEditing ? (
        <div style={{ maxWidth: '500px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 'bold',
              color: '#333'
            }}>
              Nome Completo
            </label>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 'bold',
              color: '#333'
            }}>
              Email
            </label>
            <input
              type="email"
              value={editForm.email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 'bold',
              color: '#333'
            }}>
              Ruolo
            </label>
            <select
              value={editForm.role}
              onChange={(e) => handleFieldChange('role', e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            >
              <option value="user">Utente</option>
              <option value="admin">Amministratore</option>
              <option value="moderator">Moderatore</option>
            </select>
          </div>
          
          <div style={{ marginBottom: '30px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 'bold',
              color: '#333'
            }}>
              Bio
            </label>
            <textarea
              value={editForm.bio || ''}
              onChange={(e) => handleFieldChange('bio', e.target.value)}
              rows={4}
              placeholder="Raccontaci qualcosa di te..."
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '16px',
                boxSizing: 'border-box',
                resize: 'vertical'
              }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '15px' }}>
            <button 
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: '12px 24px',
                backgroundColor: saving ? '#6c757d' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: saving ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              {saving ? '💾 Salvando...' : '💾 Salva Modifiche'}
            </button>
            
            <button 
              onClick={handleCancel}
              disabled={saving}
              style={{
                padding: '12px 24px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: saving ? 'not-allowed' : 'pointer',
                fontSize: '16px'
              }}
            >
              ❌ Annulla
            </button>
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: '600px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: '30px',
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: '#007bff',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              fontWeight: 'bold',
              marginRight: '20px'
            }}>
              {selectedUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 style={{ margin: '0 0 5px 0', fontSize: '24px' }}>{selectedUser.name}</h3>
              <p style={{ margin: '0 0 5px 0', color: '#666' }}>{selectedUser.email}</p>
              <span style={{
                padding: '4px 12px',
                backgroundColor: selectedUser.role === 'admin' ? '#dc3545' : 
                                selectedUser.role === 'moderator' ? '#ffc107' : '#28a745',
                color: selectedUser.role === 'moderator' ? '#000' : '#fff',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold',
                textTransform: 'uppercase'
              }}>
                {selectedUser.role}
              </span>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ 
              padding: '20px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px'
            }}>
              <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>📊 Informazioni</h4>
              <div style={{ marginBottom: '10px' }}>
                <strong>ID Utente:</strong> {selectedUser.id}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Data Creazione:</strong> {new Date(selectedUser.createdAt).toLocaleDateString('it-IT')}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Ultimo Accesso:</strong> {new Date(selectedUser.lastLogin).toLocaleDateString('it-IT')}
              </div>
              <div>
                <strong>Stato:</strong> 
                <span style={{ 
                  color: selectedUser.active ? '#28a745' : '#dc3545',
                  marginLeft: '5px'
                }}>
                  {selectedUser.active ? '✅ Attivo' : '❌ Inattivo'}
                </span>
              </div>
            </div>
            
            <div style={{ 
              padding: '20px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px'
            }}>
              <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>📝 Bio</h4>
              {selectedUser.bio ? (
                <p style={{ margin: 0, lineHeight: '1.5' }}>{selectedUser.bio}</p>
              ) : (
                <p style={{ margin: 0, color: '#666', fontStyle: 'italic' }}>
                  Nessuna biografia disponibile
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente principale del dashboard
function Dashboard() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Simula dati utenti
  const mockUsers = [
    {
      id: 1,
      name: 'Mario Rossi',
      email: 'mario.rossi@example.com',
      role: 'admin',
      bio: 'Amministratore del sistema con 10 anni di esperienza in gestione IT.',
      active: true,
      createdAt: '2023-01-15',
      lastLogin: '2024-01-20'
    },
    {
      id: 2,
      name: 'Giulia Bianchi',
      email: 'giulia.bianchi@example.com',
      role: 'moderator',
      bio: 'Moderatrice della community, esperta in gestione contenuti e supporto utenti.',
      active: true,
      createdAt: '2023-03-22',
      lastLogin: '2024-01-19'
    },
    {
      id: 3,
      name: 'Luca Verdi',
      email: 'luca.verdi@example.com',
      role: 'user',
      bio: 'Sviluppatore frontend appassionato di React e JavaScript moderno.',
      active: true,
      createdAt: '2023-06-10',
      lastLogin: '2024-01-18'
    },
    {
      id: 4,
      name: 'Anna Neri',
      email: 'anna.neri@example.com',
      role: 'user',
      bio: 'Designer UX/UI con focus su accessibilità e user experience.',
      active: false,
      createdAt: '2023-08-05',
      lastLogin: '2023-12-15'
    },
    {
      id: 5,
      name: 'Marco Blu',
      email: 'marco.blu@example.com',
      role: 'user',
      bio: 'Project manager con esperienza in metodologie Agile e gestione team.',
      active: true,
      createdAt: '2023-09-12',
      lastLogin: '2024-01-17'
    }
  ];
  
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      // Simula chiamata API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUsers(mockUsers);
    } catch (error) {
      console.error('Errore nel caricamento utenti:', error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  
  const handleUserSelect = useCallback((user) => {
    setSelectedUser(user);
  }, []);
  
  const handleUserUpdate = useCallback((updatedUser) => {
    setUsers(prev => prev.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    ));
    if (selectedUser?.id === updatedUser.id) {
      setSelectedUser(updatedUser);
    }
  }, [selectedUser]);
  
  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <Sidebar
        users={users}
        selectedUser={selectedUser}
        onUserSelect={handleUserSelect}
        loading={loading}
        onRefresh={fetchUsers}
      />
      <MainContent
        selectedUser={selectedUser}
        onUserUpdate={handleUserUpdate}
      />
      
      {/* CSS per animazione */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default Dashboard;
