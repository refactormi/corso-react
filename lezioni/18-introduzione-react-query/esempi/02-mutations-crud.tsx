// Esempio 2: Mutations e CRUD - useMutation per operazioni di scrittura
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

// Simulazione database in memoria
let usersDB = [
  { id: 1, name: 'Mario Rossi', email: 'mario@example.com', role: 'Admin' },
  { id: 2, name: 'Anna Verdi', email: 'anna@example.com', role: 'User' },
  { id: 3, name: 'Luca Bianchi', email: 'luca@example.com', role: 'Editor' }
];

let nextId = 4;

// Simulazione API CRUD
const api = {
  getUsers: async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return [...usersDB];
  },
  
  createUser: async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Simula validazione
    if (!userData.name || !userData.email) {
      throw new Error('Nome e email sono obbligatori');
    }
    
    // Simula errore occasionale
    if (Math.random() < 0.2) {
      throw new Error('Errore del server durante la creazione');
    }
    
    const newUser = {
      id: nextId++,
      ...userData,
      role: userData.role || 'User'
    };
    
    usersDB.push(newUser);
    return newUser;
  },
  
  updateUser: async (userId, userData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const userIndex = usersDB.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('Utente non trovato');
    }
    
    // Simula errore occasionale
    if (Math.random() < 0.15) {
      throw new Error('Errore del server durante l\'aggiornamento');
    }
    
    usersDB[userIndex] = { ...usersDB[userIndex], ...userData };
    return usersDB[userIndex];
  },
  
  deleteUser: async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const userIndex = usersDB.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('Utente non trovato');
    }
    
    // Simula errore occasionale
    if (Math.random() < 0.1) {
      throw new Error('Errore del server durante l\'eliminazione');
    }
    
    const deletedUser = usersDB[userIndex];
    usersDB.splice(userIndex, 1);
    return deletedUser;
  }
};

// Form per creare/modificare utenti
function UserForm({ user, onCancel, onSuccess }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'User'
  });
  
  const queryClient = useQueryClient();
  
  // Mutation per creare utente
  const createMutation = useMutation({
    mutationFn: (userData) => api.createUser(userData),
    onSuccess: (newUser) => {
      // Aggiorna la cache aggiungendo il nuovo utente
      queryClient.setQueryData(['users'], (oldUsers) => {
        return oldUsers ? [...oldUsers, newUser] : [newUser];
      });
      
      onSuccess?.();
      setFormData({ name: '', email: '', role: 'User' });
    },
    onError: (error) => {
      console.error('Errore creazione utente:', error);
    }
  });
  
  // Mutation per aggiornare utente
  const updateMutation = useMutation({
    mutationFn: (userData) => api.updateUser(user.id, userData),
    onMutate: async (newUserData) => {
      // Cancella query in corso per evitare conflitti
      await queryClient.cancelQueries(['users']);
      
      // Snapshot del valore precedente per rollback
      const previousUsers = queryClient.getQueryData(['users']);
      
      // Optimistic update
      queryClient.setQueryData(['users'], (oldUsers) => {
        return oldUsers?.map(u => 
          u.id === user.id ? { ...u, ...newUserData } : u
        );
      });
      
      return { previousUsers };
    },
    onError: (err, newUserData, context) => {
      // Rollback in caso di errore
      queryClient.setQueryData(['users'], context.previousUsers);
    },
    onSettled: () => {
      // Invalida e ricarica per essere sicuri
      queryClient.invalidateQueries(['users']);
    },
    onSuccess: () => {
      onSuccess?.();
    }
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (user) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };
  
  const mutation = user ? updateMutation : createMutation;
  
  return (
    <div style={{
      border: '1px solid #dee2e6',
      borderRadius: 8,
      padding: 20,
      backgroundColor: 'white',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ margin: '0 0 16px 0' }}>
        {user ? '✏️ Modifica Utente' : '➕ Nuovo Utente'}
      </h3>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>
            Nome:
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={{
              width: '100%',
              padding: 8,
              border: '1px solid #ccc',
              borderRadius: 4,
              fontSize: 14
            }}
            required
          />
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>
            Email:
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            style={{
              width: '100%',
              padding: 8,
              border: '1px solid #ccc',
              borderRadius: 4,
              fontSize: 14
            }}
            required
          />
        </div>
        
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>
            Ruolo:
          </label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            style={{
              width: '100%',
              padding: 8,
              border: '1px solid #ccc',
              borderRadius: 4,
              fontSize: 14
            }}
          >
            <option value="User">User</option>
            <option value="Editor">Editor</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        
        {mutation.isError && (
          <div style={{
            padding: 12,
            backgroundColor: '#f8d7da',
            color: '#721c24',
            borderRadius: 4,
            marginBottom: 16,
            fontSize: 14
          }}>
            ❌ {mutation.error.message}
          </div>
        )}
        
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            type="submit"
            disabled={mutation.isLoading}
            style={{
              padding: '10px 16px',
              backgroundColor: mutation.isLoading ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: mutation.isLoading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            {mutation.isLoading 
              ? (user ? '⏳ Aggiornamento...' : '⏳ Creazione...') 
              : (user ? '💾 Aggiorna' : '➕ Crea')
            }
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '10px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer'
            }}
          >
            ❌ Annulla
          </button>
        </div>
      </form>
    </div>
  );
}

// Lista utenti con operazioni CRUD
function UserCRUDList() {
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  const queryClient = useQueryClient();
  
  // Query per caricare utenti
  const { data: users, isLoading, isError, error } = useQuery({
    queryKey: ['users'],
    queryFn: api.getUsers,
  });
  
  // Mutation per eliminare utente
  const deleteMutation = useMutation({
    mutationFn: (userId) => api.deleteUser(userId),
    onMutate: async (userId) => {
      // Optimistic update: rimuovi immediatamente dalla UI
      await queryClient.cancelQueries(['users']);
      
      const previousUsers = queryClient.getQueryData(['users']);
      
      queryClient.setQueryData(['users'], (oldUsers) => {
        return oldUsers?.filter(u => u.id !== userId);
      });
      
      return { previousUsers };
    },
    onError: (err, userId, context) => {
      // Rollback in caso di errore
      queryClient.setQueryData(['users'], context.previousUsers);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['users']);
    }
  });
  
  const handleDelete = (user) => {
    if (window.confirm(`Sei sicuro di voler eliminare ${user.name}?`)) {
      deleteMutation.mutate(user.id);
    }
  };
  
  const handleEdit = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };
  
  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingUser(null);
  };
  
  const handleFormCancel = () => {
    setShowForm(false);
    setEditingUser(null);
  };
  
  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: 40 }}>
        <div>Caricamento utenti...</div>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div style={{ 
        padding: 20, 
        backgroundColor: '#f8d7da', 
        color: '#721c24',
        borderRadius: 8 
      }}>
        Errore: {error.message}
      </div>
    );
  }
  
  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 24
      }}>
        <h3 style={{ margin: 0 }}>👥 Gestione Utenti ({users.length})</h3>
        <button
          onClick={() => setShowForm(true)}
          style={{
            padding: '10px 16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          ➕ Nuovo Utente
        </button>
      </div>
      
      {showForm && (
        <div style={{ marginBottom: 24 }}>
          <UserForm
            user={editingUser}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </div>
      )}
      
      <div style={{ 
        display: 'grid', 
        gap: 16,
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))'
      }}>
        {users.map(user => (
          <div key={user.id} style={{
            border: '1px solid #dee2e6',
            borderRadius: 8,
            padding: 16,
            backgroundColor: 'white',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: '#007bff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                marginRight: 12
              }}>
                {user.name.charAt(0)}
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: 16 }}>{user.name}</h4>
                <div style={{ fontSize: 12, color: '#6c757d' }}>{user.email}</div>
              </div>
            </div>
            
            <div style={{
              display: 'inline-block',
              padding: '4px 8px',
              borderRadius: 12,
              fontSize: 12,
              fontWeight: 'bold',
              backgroundColor: user.role === 'Admin' ? '#dc3545' : 
                              user.role === 'Editor' ? '#ffc107' : '#28a745',
              color: user.role === 'Admin' ? 'white' : 
                     user.role === 'Editor' ? '#212529' : 'white',
              marginBottom: 12
            }}>
              {user.role}
            </div>
            
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => handleEdit(user)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontSize: 12
                }}
              >
                ✏️ Modifica
              </button>
              
              <button
                onClick={() => handleDelete(user)}
                disabled={deleteMutation.isLoading}
                style={{
                  padding: '6px 12px',
                  backgroundColor: deleteMutation.isLoading ? '#6c757d' : '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  cursor: deleteMutation.isLoading ? 'not-allowed' : 'pointer',
                  fontSize: 12
                }}
              >
                {deleteMutation.isLoading ? '⏳' : '🗑️'} Elimina
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Query Client setup
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // 30 secondi
      cacheTime: 5 * 60 * 1000, // 5 minuti
      retry: 2,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Componente principale
export default function MutationsCRUDExample() {
  return (
    <div style={{ padding: 20 }}>
      <h2>✏️ React Query - Mutations e CRUD</h2>
      <p style={{ color: '#666', marginBottom: 24 }}>
        Esempio completo di operazioni CRUD con useMutation, optimistic updates e gestione errori.
      </p>
      
      <QueryClientProvider client={queryClient}>
        <UserCRUDList />
      </QueryClientProvider>
      
      <div style={{
        marginTop: 32,
        padding: 16,
        backgroundColor: '#e7f3ff',
        borderRadius: 8,
        border: '1px solid #b3d9ff'
      }}>
        <h4 style={{ margin: '0 0 12px 0', color: '#0056b3' }}>
          💡 Funzionalità Dimostrate:
        </h4>
        <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14 }}>
          <li><strong>useMutation:</strong> Create, Update, Delete con loading states</li>
          <li><strong>Optimistic Updates:</strong> UI aggiornata immediatamente</li>
          <li><strong>Rollback:</strong> Ripristino automatico in caso di errore</li>
          <li><strong>Cache Invalidation:</strong> Aggiornamento automatico della lista</li>
          <li><strong>Error Handling:</strong> Gestione errori con retry logic</li>
        </ul>
      </div>
    </div>
  );
}
