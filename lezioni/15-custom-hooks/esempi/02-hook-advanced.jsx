import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';

/**
 * Esempio 2: Hook Avanzati e Composizione
 * 
 * Questo esempio dimostra:
 * - Hook per gestione stato complesso (useForm, useList, useUser)
 * - Hook per comunicazione (useEventBus, useLocalContext)
 * - Hook per testing (useMockData)
 * - Composizione di hook per logica complessa
 * - Pattern avanzati di custom hooks
 */

// Hook per gestione form avanzato
function useForm(initialValues = {}, validationSchema = null) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  
  const handleChange = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    setIsDirty(true);
    
    // Validazione in tempo reale
    if (validationSchema && touched[name]) {
      try {
        validationSchema.validateSyncAt(name, { [name]: value });
        setErrors(prev => ({ ...prev, [name]: '' }));
      } catch (error) {
        setErrors(prev => ({ ...prev, [name]: error.message }));
      }
    }
  }, [validationSchema, touched]);
  
  const handleBlur = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validazione al blur
    if (validationSchema) {
      try {
        validationSchema.validateSyncAt(name, values);
        setErrors(prev => ({ ...prev, [name]: '' }));
      } catch (error) {
        setErrors(prev => ({ ...prev, [name]: error.message }));
      }
    }
  }, [validationSchema, values]);
  
  const handleSubmit = useCallback(async (onSubmit) => {
    setIsSubmitting(true);
    
    try {
      if (validationSchema) {
        await validationSchema.validate(values);
      }
      
      await onSubmit(values);
      setIsDirty(false);
    } catch (error) {
      if (error.name === 'ValidationError') {
        const newErrors = {};
        error.inner.forEach(err => {
          newErrors[err.path] = err.message;
        });
        setErrors(newErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validationSchema]);
  
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    setIsDirty(false);
  }, [initialValues]);
  
  const setFieldValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    setIsDirty(true);
  }, []);
  
  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);
  
  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0 || Object.values(errors).every(error => !error);
  }, [errors]);
  
  return {
    values,
    errors,
    touched,
    isSubmitting,
    isDirty,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setFieldValue,
    setFieldError
  };
}

// Hook per gestione lista avanzata
function useList(initialItems = []) {
  const [items, setItems] = useState(initialItems);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const filteredAndSortedItems = useMemo(() => {
    let filtered = items;
    
    if (filter) {
      filtered = items.filter(item =>
        item.name.toLowerCase().includes(filter.toLowerCase()) ||
        item.description?.toLowerCase().includes(filter.toLowerCase())
      );
    }
    
    return filtered.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (sortOrder === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
  }, [items, filter, sortBy, sortOrder]);
  
  const paginatedItems = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredAndSortedItems.slice(startIndex, endIndex);
  }, [filteredAndSortedItems, page, pageSize]);
  
  const totalPages = useMemo(() => {
    return Math.ceil(filteredAndSortedItems.length / pageSize);
  }, [filteredAndSortedItems.length, pageSize]);
  
  const addItem = useCallback((item) => {
    const newItem = { ...item, id: Date.now(), createdAt: new Date().toISOString() };
    setItems(prev => [...prev, newItem]);
    return newItem;
  }, []);
  
  const removeItem = useCallback((id) => {
    setItems(prev => prev.filter(item => item.id !== id));
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  }, []);
  
  const updateItem = useCallback((id, updates) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
    ));
  }, []);
  
  const toggleSelection = useCallback((id) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);
  
  const selectAll = useCallback(() => {
    setSelectedItems(new Set(paginatedItems.map(item => item.id)));
  }, [paginatedItems]);
  
  const deselectAll = useCallback(() => {
    setSelectedItems(new Set());
  }, []);
  
  const removeSelected = useCallback(() => {
    setItems(prev => prev.filter(item => !selectedItems.has(item.id)));
    setSelectedItems(new Set());
  }, [selectedItems]);
  
  const clearFilter = useCallback(() => {
    setFilter('');
    setPage(1);
  }, []);
  
  const goToPage = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  }, [totalPages]);
  
  const nextPage = useCallback(() => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  }, [page, totalPages]);
  
  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);
  
  return {
    items: paginatedItems,
    allItems: filteredAndSortedItems,
    selectedItems,
    filter,
    sortBy,
    sortOrder,
    page,
    pageSize,
    totalPages,
    addItem,
    removeItem,
    updateItem,
    toggleSelection,
    selectAll,
    deselectAll,
    removeSelected,
    setFilter,
    setSortBy,
    setSortOrder,
    setPageSize,
    clearFilter,
    goToPage,
    nextPage,
    prevPage
  };
}

// Hook per gestione utente
function useUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [permissions, setPermissions] = useState(new Set());
  
  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simula chiamata API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (credentials.email === 'admin@example.com' && credentials.password === 'admin') {
        const userData = {
          id: 1,
          email: credentials.email,
          name: 'Admin User',
          role: 'admin',
          permissions: ['read', 'write', 'delete', 'admin']
        };
        
        setUser(userData);
        setPermissions(new Set(userData.permissions));
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        throw new Error('Credenziali non valide');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);
  
  const logout = useCallback(() => {
    setUser(null);
    setPermissions(new Set());
    localStorage.removeItem('user');
  }, []);
  
  const updateProfile = useCallback(async (updates) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Simula chiamata API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);
  
  const hasPermission = useCallback((permission) => {
    return permissions.has(permission);
  }, [permissions]);
  
  const hasAnyPermission = useCallback((permissionList) => {
    return permissionList.some(permission => permissions.has(permission));
  }, [permissions]);
  
  const hasAllPermissions = useCallback((permissionList) => {
    return permissionList.every(permission => permissions.has(permission));
  }, [permissions]);
  
  // Carica utente da localStorage al mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setPermissions(new Set(userData.permissions || []));
      } catch (err) {
        localStorage.removeItem('user');
      }
    }
  }, []);
  
  return {
    user,
    loading,
    error,
    permissions,
    login,
    logout,
    updateProfile,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };
}

// Hook per event bus
function useEventBus() {
  const listeners = useRef(new Map());
  
  const subscribe = useCallback((event, callback) => {
    if (!listeners.current.has(event)) {
      listeners.current.set(event, new Set());
    }
    listeners.current.get(event).add(callback);
    
    // Return unsubscribe function
    return () => {
      const eventListeners = listeners.current.get(event);
      if (eventListeners) {
        eventListeners.delete(callback);
        if (eventListeners.size === 0) {
          listeners.current.delete(event);
        }
      }
    };
  }, []);
  
  const publish = useCallback((event, data) => {
    const eventListeners = listeners.current.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Errore nell\'event listener:', error);
        }
      });
    }
  }, []);
  
  const unsubscribe = useCallback((event, callback) => {
    const eventListeners = listeners.current.get(event);
    if (eventListeners) {
      eventListeners.delete(callback);
    }
  }, []);
  
  const clearEvent = useCallback((event) => {
    listeners.current.delete(event);
  }, []);
  
  const clearAllEvents = useCallback(() => {
    listeners.current.clear();
  }, []);
  
  return {
    subscribe,
    publish,
    unsubscribe,
    clearEvent,
    clearAllEvents
  };
}

// Hook per context locale
function useLocalContext(context, defaultValue = null) {
  const contextValue = React.useContext(context);
  
  if (contextValue === undefined) {
    return defaultValue;
  }
  
  return contextValue;
}

// Hook per mock data
function useMockData(initialData = []) {
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const generateMockData = useCallback((count = 10) => {
    setIsLoading(true);
    setError(null);
    
    // Simula delay di rete
    setTimeout(() => {
      try {
        const mockData = Array.from({ length: count }, (_, index) => ({
          id: index + 1,
          name: `Item ${index + 1}`,
          description: `Descrizione per l'item ${index + 1}`,
          value: Math.floor(Math.random() * 100),
          category: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
          status: ['active', 'inactive', 'pending'][Math.floor(Math.random() * 3)],
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
        }));
        
        setData(mockData);
      } catch (err) {
        setError('Errore nella generazione dati mock');
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  }, []);
  
  const addMockItem = useCallback(() => {
    const newItem = {
      id: Date.now(),
      name: `Item ${data.length + 1}`,
      description: `Descrizione per l'item ${data.length + 1}`,
      value: Math.floor(Math.random() * 100),
      category: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
      status: ['active', 'inactive', 'pending'][Math.floor(Math.random() * 3)],
      createdAt: new Date().toISOString()
    };
    
    setData(prev => [...prev, newItem]);
  }, [data.length]);
  
  const removeMockItem = useCallback((id) => {
    setData(prev => prev.filter(item => item.id !== id));
  }, []);
  
  const updateMockItem = useCallback((id, updates) => {
    setData(prev => prev.map(item =>
      item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
    ));
  }, []);
  
  const clearMockData = useCallback(() => {
    setData([]);
  }, []);
  
  const duplicateItem = useCallback((id) => {
    const item = data.find(item => item.id === id);
    if (item) {
      const duplicatedItem = {
        ...item,
        id: Date.now(),
        name: `${item.name} (copia)`,
        createdAt: new Date().toISOString()
      };
      setData(prev => [...prev, duplicatedItem]);
    }
  }, [data]);
  
  return {
    data,
    isLoading,
    error,
    generateMockData,
    addMockItem,
    removeMockItem,
    updateMockItem,
    clearMockData,
    duplicateItem
  };
}

// Componente demo principale
function AdvancedHooksDemo() {
  // Hook per gestione stato complesso
  const form = useForm({
    name: '',
    email: '',
    role: 'user',
    permissions: []
  });
  
  const list = useList();
  const user = useUser();
  
  // Hook per comunicazione
  const eventBus = useEventBus();
  
  // Hook per testing
  const mockData = useMockData();
  
  // Stato locale
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  // Gestione notifiche tramite event bus
  useEffect(() => {
    const unsubscribe = eventBus.subscribe('notification', (data) => {
      setNotifications(prev => [...prev, { ...data, id: Date.now() }]);
    });
    
    return unsubscribe;
  }, [eventBus]);
  
  // Rimuovi notifiche dopo 5 secondi
  useEffect(() => {
    const timer = setInterval(() => {
      setNotifications(prev => prev.filter(notification => 
        Date.now() - notification.id < 5000
      ));
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Gestione submit form
  const handleFormSubmit = async (values) => {
    console.log('Form inviato:', values);
    
    // Pubblica evento di notifica
    eventBus.publish('notification', {
      type: 'success',
      message: 'Form inviato con successo!',
      data: values
    });
    
    form.reset();
  };
  
  // Gestione login
  const handleLogin = async (credentials) => {
    await user.login(credentials);
    
    if (user.isAuthenticated) {
      eventBus.publish('notification', {
        type: 'success',
        message: 'Login effettuato con successo!'
      });
      setShowLoginForm(false);
    }
  };
  
  // Gestione logout
  const handleLogout = () => {
    user.logout();
    eventBus.publish('notification', {
      type: 'info',
      message: 'Logout effettuato'
    });
  };
  
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{
          backgroundColor: '#2c3e50',
          color: 'white',
          padding: '30px',
          borderRadius: '12px',
          marginBottom: '30px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>
                🚀 Hook Avanzati e Composizione
              </h1>
              <p style={{ margin: '10px 0 0 0', opacity: 0.9, fontSize: '16px' }}>
                Gestione stato complesso, comunicazione e pattern avanzati
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              {user.isAuthenticated ? (
                <>
                  <span>Ciao, {user.user?.name}</span>
                  <button
                    onClick={handleLogout}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#e74c3c',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowLoginForm(true)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#3498db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Notifiche */}
        {notifications.length > 0 && (
          <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 1000,
            maxWidth: '400px'
          }}>
            {notifications.map(notification => (
              <div
                key={notification.id}
                style={{
                  backgroundColor: notification.type === 'success' ? '#d4edda' : '#d1ecf1',
                  color: notification.type === 'success' ? '#155724' : '#0c5460',
                  padding: '15px',
                  marginBottom: '10px',
                  borderRadius: '6px',
                  border: `1px solid ${notification.type === 'success' ? '#c3e6cb' : '#bee5eb'}`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ fontWeight: '600', marginBottom: '5px' }}>
                  {notification.type === 'success' ? '✅ Successo' : 'ℹ️ Informazione'}
                </div>
                <div>{notification.message}</div>
                {notification.data && (
                  <div style={{ fontSize: '12px', marginTop: '5px', opacity: 0.8 }}>
                    {JSON.stringify(notification.data, null, 2)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Sezione Form Avanzato */}
        <section style={{ marginBottom: '40px' }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            border: '1px solid #ddd'
          }}>
            <h2 style={{ margin: '0 0 25px 0', color: '#2c3e50' }}>
              📝 Form Avanzato con useForm
            </h2>
            
            <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(handleFormSubmit)(); }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px',
                marginBottom: '25px'
              }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                    Nome:
                  </label>
                  <input
                    type="text"
                    value={form.values.name}
                    onChange={(e) => form.handleChange('name', e.target.value)}
                    onBlur={() => form.handleBlur('name')}
                    placeholder="Inserisci nome"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: `1px solid ${form.errors.name ? '#dc3545' : '#ddd'}`,
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                  {form.errors.name && (
                    <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px' }}>
                      {form.errors.name}
                    </div>
                  )}
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                    Email:
                  </label>
                  <input
                    type="email"
                    value={form.values.email}
                    onChange={(e) => form.handleChange('email', e.target.value)}
                    onBlur={() => form.handleBlur('email')}
                    placeholder="Inserisci email"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: `1px solid ${form.errors.email ? '#dc3545' : '#ddd'}`,
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                  {form.errors.email && (
                    <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px' }}>
                      {form.errors.email}
                    </div>
                  )}
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                    Ruolo:
                  </label>
                  <select
                    value={form.values.role}
                    onChange={(e) => form.handleChange('role', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="user">Utente</option>
                    <option value="moderator">Moderatore</option>
                    <option value="admin">Amministratore</option>
                  </select>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <button
                  type="submit"
                  disabled={form.isSubmitting || !form.isValid}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: form.isSubmitting || !form.isValid ? '#6c757d' : '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: form.isSubmitting || !form.isValid ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  {form.isSubmitting ? 'Invio...' : 'Invia Form'}
                </button>
                
                <button
                  type="button"
                  onClick={form.reset}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Reset
                </button>
                
                <div style={{ fontSize: '14px', color: '#666' }}>
                  {form.isDirty && <span>⚠️ Form modificato</span>}
                  {form.isValid && <span style={{ color: '#28a745' }}>✅ Form valido</span>}
                </div>
              </div>
            </form>
          </div>
        </section>
        
        {/* Sezione Lista Avanzata */}
        <section style={{ marginBottom: '40px' }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            border: '1px solid #ddd'
          }}>
            <h2 style={{ margin: '0 0 25px 0', color: '#2c3e50' }}>
              📋 Lista Avanzata con useList
            </h2>
            
            {/* Controlli */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '15px'
            }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="text"
                  value={list.filter}
                  onChange={(e) => list.setFilter(e.target.value)}
                  placeholder="Filtra elementi..."
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    minWidth: '200px'
                  }}
                />
                
                <select
                  value={list.sortBy}
                  onChange={(e) => list.setSortBy(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                >
                  <option value="name">Nome</option>
                  <option value="category">Categoria</option>
                  <option value="status">Stato</option>
                  <option value="createdAt">Data creazione</option>
                </select>
                
                <select
                  value={list.sortOrder}
                  onChange={(e) => list.setSortOrder(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                >
                  <option value="asc">Crescente</option>
                  <option value="desc">Decrescente</option>
                </select>
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => list.addItem({
                    name: `Nuovo Item ${Date.now()}`,
                    description: 'Descrizione nuovo item',
                    category: 'A',
                    status: 'active'
                  })}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  + Aggiungi
                </button>
                
                <button
                  onClick={list.selectAll}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Seleziona Tutto
                </button>
                
                {list.selectedItems.size > 0 && (
                  <button
                    onClick={list.removeSelected}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Elimina ({list.selectedItems.size})
                  </button>
                )}
              </div>
            </div>
            
            {/* Tabella */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '14px'
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
                      <input
                        type="checkbox"
                        checked={list.selectedItems.size === list.items.length && list.items.length > 0}
                        onChange={(e) => e.target.checked ? list.selectAll() : list.deselectAll()}
                        style={{ margin: 0 }}
                      />
                    </th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Nome</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Categoria</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Stato</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {list.items.map(item => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                      <td style={{ padding: '12px' }}>
                        <input
                          type="checkbox"
                          checked={list.selectedItems.has(item.id)}
                          onChange={() => list.toggleSelection(item.id)}
                          style={{ margin: 0 }}
                        />
                      </td>
                      <td style={{ padding: '12px' }}>{item.name}</td>
                      <td style={{ padding: '12px' }}>{item.category}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          backgroundColor: item.status === 'active' ? '#d4edda' : '#f8d7da',
                          color: item.status === 'active' ? '#155724' : '#721c24'
                        }}>
                          {item.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <button
                            onClick={() => list.duplicateItem(item.id)}
                            style={{
                              padding: '4px 8px',
                              backgroundColor: '#17a2b8',
                              color: 'white',
                              border: 'none',
                              borderRadius: '3px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            Duplica
                          </button>
                          <button
                            onClick={() => list.removeItem(item.id)}
                            style={{
                              padding: '4px 8px',
                              backgroundColor: '#dc3545',
                              color: 'white',
                              border: 'none',
                              borderRadius: '3px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            Elimina
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Paginazione */}
            {list.totalPages > 1 && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                marginTop: '20px'
              }}>
                <button
                  onClick={list.prevPage}
                  disabled={list.page === 1}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: list.page === 1 ? '#6c757d' : '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: list.page === 1 ? 'not-allowed' : 'pointer'
                  }}
                >
                  ← Precedente
                </button>
                
                <span style={{ fontSize: '14px' }}>
                  Pagina {list.page} di {list.totalPages}
                </span>
                
                <button
                  onClick={list.nextPage}
                  disabled={list.page === list.totalPages}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: list.page === list.totalPages ? '#6c757d' : '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: list.page === list.totalPages ? 'not-allowed' : 'pointer'
                  }}
                >
                  Successiva →
                </button>
              </div>
            )}
          </div>
        </section>
        
        {/* Sezione Mock Data */}
        <section style={{ marginBottom: '40px' }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            border: '1px solid #ddd'
          }}>
            <h2 style={{ margin: '0 0 25px 0', color: '#2c3e50' }}>
              🧪 Mock Data con useMockData
            </h2>
            
            <div style={{
              display: 'flex',
              gap: '15px',
              marginBottom: '25px',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => mockData.generateMockData(20)}
                disabled={mockData.isLoading}
                style={{
                  padding: '10px 20px',
                  backgroundColor: mockData.isLoading ? '#6c757d' : '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: mockData.isLoading ? 'not-allowed' : 'pointer',
                  fontSize: '14px'
                }}
              >
                {mockData.isLoading ? 'Generazione...' : 'Genera 20 Items'}
              </button>
              
              <button
                onClick={mockData.addMockItem}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                + Aggiungi Item
              </button>
              
              <button
                onClick={mockData.clearMockData}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Pulisci Dati
              </button>
            </div>
            
            {mockData.error && (
              <div style={{
                backgroundColor: '#f8d7da',
                color: '#721c24',
                padding: '15px',
                borderRadius: '6px',
                border: '1px solid #f5c6cb',
                marginBottom: '20px'
              }}>
                Errore: {mockData.error}
              </div>
            )}
            
            {mockData.data.length > 0 && (
              <div style={{ maxHeight: '300px', overflow: 'auto' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '15px'
                }}>
                  {mockData.data.map(item => (
                    <div
                      key={item.id}
                      style={{
                        backgroundColor: '#f8f9fa',
                        padding: '15px',
                        borderRadius: '6px',
                        border: '1px solid #dee2e6'
                      }}
                    >
                      <h4 style={{ margin: '0 0 10px 0' }}>{item.name}</h4>
                      <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>
                        {item.description}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          Categoria: {item.category} | Valore: {item.value}
                        </div>
                        <button
                          onClick={() => mockData.removeMockItem(item.id)}
                          style={{
                            padding: '4px 8px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Elimina
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
        
        {/* Modal Login */}
        {showLoginForm && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}
          >
            <div
              style={{
                backgroundColor: 'white',
                padding: '30px',
                borderRadius: '12px',
                maxWidth: '400px',
                width: '90%',
                border: '1px solid #ddd'
              }}
            >
              <h2 style={{ margin: '0 0 20px 0', textAlign: 'center' }}>
                🔐 Login
              </h2>
              
              <form onSubmit={(e) => { e.preventDefault(); handleLogin({ email: 'admin@example.com', password: 'admin' }); }}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                    Email:
                  </label>
                  <input
                    type="email"
                    value="admin@example.com"
                    disabled
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px',
                      backgroundColor: '#f8f9fa'
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                    Password:
                  </label>
                  <input
                    type="password"
                    value="admin"
                    disabled
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px',
                      backgroundColor: '#f8f9fa'
                    }}
                  />
                </div>
                
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="submit"
                    disabled={user.loading}
                    style={{
                      flex: 1,
                      padding: '12px',
                      backgroundColor: user.loading ? '#6c757d' : '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: user.loading ? 'not-allowed' : 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    {user.loading ? 'Login...' : 'Login'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setShowLoginForm(false)}
                    style={{
                      padding: '12px 20px',
                      backgroundColor: '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Annulla
                  </button>
                </div>
                
                {user.error && (
                  <div style={{
                    backgroundColor: '#f8d7da',
                    color: '#721c24',
                    padding: '10px',
                    borderRadius: '4px',
                    marginTop: '15px',
                    fontSize: '14px'
                  }}>
                    {user.error}
                  </div>
                )}
              </form>
              
              <div style={{
                backgroundColor: '#d1ecf1',
                color: '#0c5460',
                padding: '15px',
                borderRadius: '6px',
                marginTop: '20px',
                fontSize: '14px'
              }}>
                <strong>Credenziali demo:</strong><br/>
                Email: admin@example.com<br/>
                Password: admin
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdvancedHooksDemo;





