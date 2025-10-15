import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';

/**
 * Esempio 2: Lista Virtualizzata con Memoizzazione
 * 
 * Questo esempio dimostra:
 * - useMemo per ottimizzare calcoli di virtualizzazione
 * - useCallback per gestire eventi di scroll
 * - React.memo per ottimizzare elementi della lista
 * - Gestione performance con liste grandi
 * - Pattern di ottimizzazione per rendering
 */

// Hook per misurare le performance
function usePerformanceMonitor(componentName) {
  const renderCount = useRef(0);
  const startTime = useRef(performance.now());
  
  useEffect(() => {
    renderCount.current += 1;
    const endTime = performance.now();
    const renderTime = endTime - startTime.current;
    
    console.log(`${componentName} - Render ${renderCount.current}: ${renderTime.toFixed(2)}ms`);
    
    startTime.current = performance.now();
  });
  
  return renderCount.current;
}

// Componente per l'elemento della lista (memoizzato)
const ListItem = React.memo(function ListItem({ 
  item, 
  index, 
  style, 
  onItemClick, 
  onItemSelect,
  isSelected 
}) {
  usePerformanceMonitor(`ListItem-${item.id}`);
  
  const handleClick = useCallback(() => {
    onItemClick?.(item);
  }, [item, onItemClick]);
  
  const handleSelect = useCallback((e) => {
    e.stopPropagation();
    onItemSelect?.(item.id);
  }, [item.id, onItemSelect]);
  
  return (
    <div
      style={{
        ...style,
        padding: '12px 16px',
        borderBottom: '1px solid #eee',
        backgroundColor: isSelected ? '#e3f2fd' : 'white',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}
      onClick={handleClick}
    >
      <input
        type="checkbox"
        checked={isSelected}
        onChange={handleSelect}
        style={{ margin: 0 }}
      />
      
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: item.color || '#007bff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '16px'
      }}>
        {item.name.charAt(0).toUpperCase()}
      </div>
      
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#333',
          marginBottom: '4px'
        }}>
          {item.name}
        </div>
        <div style={{
          fontSize: '14px',
          color: '#666'
        }}>
          {item.email}
        </div>
        <div style={{
          fontSize: '12px',
          color: '#999',
          marginTop: '2px'
        }}>
          {item.department} • {item.role}
        </div>
      </div>
      
      <div style={{
        textAlign: 'right',
        fontSize: '12px',
        color: '#666'
      }}>
        <div>ID: {item.id}</div>
        <div>Index: {index}</div>
      </div>
    </div>
  );
});

// Componente per la barra di ricerca
const SearchBar = React.memo(function SearchBar({ 
  searchTerm, 
  onSearchChange, 
  placeholder = "Cerca..." 
}) {
  usePerformanceMonitor('SearchBar');
  
  return (
    <div style={{
      padding: '16px',
      backgroundColor: 'white',
      borderBottom: '1px solid #eee',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '12px 16px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          fontSize: '16px',
          outline: 'none',
          transition: 'border-color 0.2s ease'
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#007bff';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = '#ddd';
        }}
      />
    </div>
  );
});

// Componente per i controlli
const ListControls = React.memo(function ListControls({
  totalItems,
  visibleItems,
  selectedCount,
  onSelectAll,
  onDeselectAll,
  onDeleteSelected,
  itemHeight,
  onItemHeightChange
}) {
  usePerformanceMonitor('ListControls');
  
  return (
    <div style={{
      padding: '16px',
      backgroundColor: '#f8f9fa',
      borderBottom: '1px solid #eee',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '10px'
    }}>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <span style={{ fontSize: '14px', color: '#666' }}>
          {totalItems.toLocaleString()} elementi totali
        </span>
        <span style={{ fontSize: '14px', color: '#666' }}>
          • {visibleItems} visibili
        </span>
        {selectedCount > 0 && (
          <span style={{ fontSize: '14px', color: '#007bff', fontWeight: '600' }}>
            • {selectedCount} selezionati
          </span>
        )}
      </div>
      
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <label style={{ fontSize: '14px', color: '#666' }}>
          Altezza elemento:
          <select
            value={itemHeight}
            onChange={(e) => onItemHeightChange(parseInt(e.target.value))}
            style={{
              marginLeft: '8px',
              padding: '4px 8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            <option value={60}>60px</option>
            <option value={80}>80px</option>
            <option value={100}>100px</option>
          </select>
        </label>
        
        <button
          onClick={onSelectAll}
          style={{
            padding: '6px 12px',
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
        
        <button
          onClick={onDeselectAll}
          style={{
            padding: '6px 12px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Deseleziona
        </button>
        
        {selectedCount > 0 && (
          <button
            onClick={onDeleteSelected}
            style={{
              padding: '6px 12px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Elimina ({selectedCount})
          </button>
        )}
      </div>
    </div>
  );
});

// Componente principale della lista virtualizzata
function VirtualizedList({ 
  items, 
  height = 600, 
  itemHeight = 80,
  onItemClick,
  onItemSelect,
  selectedItems = new Set(),
  searchTerm = '',
  onSearchChange
}) {
  const { renderCount } = usePerformanceMonitor('VirtualizedList');
  
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);
  
  // Calcoli di virtualizzazione (memoizzati)
  const virtualizedData = useMemo(() => {
    console.log('Calcolo virtualizzazione...');
    
    // Filtra gli elementi in base alla ricerca
    const filteredItems = items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Calcola gli indici visibili
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(height / itemHeight) + 1,
      filteredItems.length
    );
    
    // Estrae gli elementi visibili
    const visibleItems = filteredItems.slice(startIndex, endIndex).map((item, index) => ({
      ...item,
      index: startIndex + index
    }));
    
    return {
      filteredItems,
      visibleItems,
      startIndex,
      endIndex,
      totalHeight: filteredItems.length * itemHeight,
      offsetY: startIndex * itemHeight
    };
  }, [items, scrollTop, height, itemHeight, searchTerm]);
  
  // Gestione scroll (memoizzata)
  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);
  
  // Callback per selezione (memoizzati)
  const handleItemSelect = useCallback((itemId) => {
    onItemSelect?.(itemId);
  }, [onItemSelect]);
  
  const handleItemClick = useCallback((item) => {
    onItemClick?.(item);
  }, [onItemClick]);
  
  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      overflow: 'hidden',
      backgroundColor: 'white'
    }}>
      {/* Barra di ricerca */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        placeholder="Cerca per nome, email o dipartimento..."
      />
      
      {/* Controlli */}
      <ListControls
        totalItems={items.length}
        visibleItems={virtualizedData.visibleItems.length}
        selectedCount={selectedItems.size}
        itemHeight={itemHeight}
        onItemHeightChange={(newHeight) => {
          // Questo dovrebbe essere gestito dal componente padre
          console.log('Cambio altezza elemento:', newHeight);
        }}
        onSelectAll={() => {
          // Questo dovrebbe essere gestito dal componente padre
          console.log('Seleziona tutto');
        }}
        onDeselectAll={() => {
          // Questo dovrebbe essere gestito dal componente padre
          console.log('Deseleziona tutto');
        }}
        onDeleteSelected={() => {
          // Questo dovrebbe essere gestito dal componente padre
          console.log('Elimina selezionati');
        }}
      />
      
      {/* Container della lista */}
      <div
        ref={containerRef}
        style={{
          height: height,
          overflow: 'auto',
          position: 'relative'
        }}
        onScroll={handleScroll}
      >
        {/* Spacer per l'altezza totale */}
        <div style={{ height: virtualizedData.totalHeight, position: 'relative' }}>
          {/* Elementi visibili */}
          <div
            style={{
              position: 'absolute',
              top: virtualizedData.offsetY,
              left: 0,
              right: 0
            }}
          >
            {virtualizedData.visibleItems.map((item) => (
              <ListItem
                key={item.id}
                item={item}
                index={item.index}
                style={{
                  height: itemHeight,
                  width: '100%'
                }}
                onItemClick={handleItemClick}
                onItemSelect={handleItemSelect}
                isSelected={selectedItems.has(item.id)}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Info di debug */}
      <div style={{
        padding: '8px 16px',
        backgroundColor: '#f8f9fa',
        borderTop: '1px solid #eee',
        fontSize: '12px',
        color: '#666',
        fontFamily: 'monospace'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>
            Scroll: {scrollTop.toFixed(0)}px | 
            Visibili: {virtualizedData.startIndex}-{virtualizedData.endIndex} | 
            Totale: {virtualizedData.filteredItems.length}
          </span>
          <span>Render: {renderCount}</span>
        </div>
      </div>
    </div>
  );
}

// Componente demo principale
function VirtualizedListDemo() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [itemHeight, setItemHeight] = useState(80);
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Genera dati di esempio (memoizzati)
  const items = useMemo(() => {
    console.log('Generazione dati...');
    
    const departments = ['IT', 'HR', 'Marketing', 'Sales', 'Finance', 'Operations'];
    const roles = ['Manager', 'Developer', 'Designer', 'Analyst', 'Coordinator', 'Specialist'];
    const colors = ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1', '#17a2b8', '#fd7e14'];
    
    return Array.from({ length: 10000 }, (_, i) => ({
      id: i + 1,
      name: `Utente ${i + 1}`,
      email: `utente${i + 1}@azienda.com`,
      department: departments[Math.floor(Math.random() * departments.length)],
      role: roles[Math.floor(Math.random() * roles.length)],
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
  }, []);
  
  // Callback per gestione selezione
  const handleItemSelect = useCallback((itemId) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  }, []);
  
  const handleSelectAll = useCallback(() => {
    setSelectedItems(new Set(items.map(item => item.id)));
  }, [items]);
  
  const handleDeselectAll = useCallback(() => {
    setSelectedItems(new Set());
  }, []);
  
  const handleDeleteSelected = useCallback(() => {
    if (selectedItems.size > 0) {
      const confirmDelete = window.confirm(
        `Sei sicuro di voler eliminare ${selectedItems.size} elementi?`
      );
      if (confirmDelete) {
        console.log('Eliminazione elementi:', Array.from(selectedItems));
        setSelectedItems(new Set());
      }
    }
  }, [selectedItems]);
  
  const handleItemClick = useCallback((item) => {
    setSelectedItem(item);
  }, []);
  
  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
        📋 Lista Virtualizzata con Memoizzazione
      </h2>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '20px',
        marginBottom: '20px'
      }}>
        {/* Lista virtualizzata */}
        <VirtualizedList
          items={items}
          height={600}
          itemHeight={itemHeight}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedItems={selectedItems}
          onItemSelect={handleItemSelect}
          onItemClick={handleItemClick}
        />
        
        {/* Pannello laterale */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          height: 'fit-content'
        }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>
            🎛️ Controlli
          </h3>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Altezza Elemento:
            </label>
            <select
              value={itemHeight}
              onChange={(e) => setItemHeight(parseInt(e.target.value))}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              <option value={60}>60px (Compatta)</option>
              <option value={80}>80px (Normale)</option>
              <option value={100}>100px (Estesa)</option>
            </select>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <button
              onClick={handleSelectAll}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                marginBottom: '8px'
              }}
            >
              Seleziona Tutto
            </button>
            
            <button
              onClick={handleDeselectAll}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                marginBottom: '8px'
              }}
            >
              Deseleziona Tutto
            </button>
            
            {selectedItems.size > 0 && (
              <button
                onClick={handleDeleteSelected}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Elimina Selezionati ({selectedItems.size})
              </button>
            )}
          </div>
          
          {selectedItem && (
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '15px',
              borderRadius: '6px',
              border: '1px solid #dee2e6'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>
                📄 Elemento Selezionato
              </h4>
              <div style={{ fontSize: '14px', color: '#666' }}>
                <div><strong>Nome:</strong> {selectedItem.name}</div>
                <div><strong>Email:</strong> {selectedItem.email}</div>
                <div><strong>Dipartimento:</strong> {selectedItem.department}</div>
                <div><strong>Ruolo:</strong> {selectedItem.role}</div>
                <div><strong>ID:</strong> {selectedItem.id}</div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Informazioni */}
      <div style={{
        backgroundColor: '#d1ecf1',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #bee5eb'
      }}>
        <h4 style={{ margin: '0 0 15px 0', color: '#0c5460' }}>
          ℹ️ Informazioni sulla Virtualizzazione
        </h4>
        <ul style={{ margin: 0, paddingLeft: '20px', color: '#0c5460' }}>
          <li>La lista contiene <strong>10,000 elementi</strong> ma ne renderizza solo quelli visibili</li>
          <li>Gli elementi sono <strong>memoizzati</strong> per evitare re-render inutili</li>
          <li>La ricerca filtra gli elementi in tempo reale</li>
          <li>Lo scroll è ottimizzato per performance fluide</li>
          <li>Le funzioni di callback sono memoizzate per stabilità</li>
        </ul>
      </div>
    </div>
  );
}

export default VirtualizedListDemo;




