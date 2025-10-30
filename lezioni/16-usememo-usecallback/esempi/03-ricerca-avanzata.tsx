import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';

/**
 * Esempio 3: Sistema di Ricerca Avanzata con Memoizzazione
 * 
 * Questo esempio dimostra:
 * - useMemo per ottimizzare filtri e ricerche complesse
 * - useCallback per gestire eventi di input
 * - Debouncing con memoizzazione
 * - Cache dei risultati di ricerca
 * - Gestione stati di loading e errori
 * - Pattern di ottimizzazione per ricerche
 */

// Hook per debouncing
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

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

// Componente per il filtro (memoizzato)
const FilterComponent = React.memo(function FilterComponent({ 
  filters, 
  onFilterChange, 
  availableOptions 
}) {
  usePerformanceMonitor('FilterComponent');
  
  const handleFilterChange = useCallback((filterKey, value) => {
    onFilterChange(filterKey, value);
  }, [onFilterChange]);
  
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginBottom: '20px'
    }}>
      <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>
        🔍 Filtri di Ricerca
      </h3>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px'
      }}>
        {/* Filtro per categoria */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#555' }}>
            Categoria:
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            <option value="">Tutte le categorie</option>
            {availableOptions.categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        {/* Filtro per prezzo */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#555' }}>
            Prezzo:
          </label>
          <select
            value={filters.priceRange}
            onChange={(e) => handleFilterChange('priceRange', e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            <option value="">Tutti i prezzi</option>
            <option value="0-50">€0 - €50</option>
            <option value="50-100">€50 - €100</option>
            <option value="100-200">€100 - €200</option>
            <option value="200+">€200+</option>
          </select>
        </div>
        
        {/* Filtro per rating */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#555' }}>
            Rating minimo:
          </label>
          <select
            value={filters.minRating}
            onChange={(e) => handleFilterChange('minRating', e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            <option value="">Tutti i rating</option>
            <option value="4">4+ stelle</option>
            <option value="3">3+ stelle</option>
            <option value="2">2+ stelle</option>
            <option value="1">1+ stelle</option>
          </select>
        </div>
        
        {/* Filtro per disponibilità */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#555' }}>
            Disponibilità:
          </label>
          <select
            value={filters.availability}
            onChange={(e) => handleFilterChange('availability', e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            <option value="">Tutti</option>
            <option value="in-stock">Disponibile</option>
            <option value="out-of-stock">Esaurito</option>
            <option value="pre-order">Pre-ordine</option>
          </select>
        </div>
      </div>
    </div>
  );
});

// Componente per la barra di ricerca (memoizzato)
const SearchBar = React.memo(function SearchBar({ 
  searchTerm, 
  onSearchChange, 
  placeholder = "Cerca prodotti..." 
}) {
  usePerformanceMonitor('SearchBar');
  
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginBottom: '20px'
    }}>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: '12px 16px 12px 48px',
            border: '2px solid #ddd',
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
        <div style={{
          position: 'absolute',
          left: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '20px',
          color: '#666'
        }}>
          🔍
        </div>
      </div>
    </div>
  );
});

// Componente per il risultato della ricerca (memoizzato)
const SearchResult = React.memo(function SearchResult({ 
  product, 
  onProductClick, 
  onAddToCart 
}) {
  usePerformanceMonitor(`SearchResult-${product.id}`);
  
  const handleClick = useCallback(() => {
    onProductClick?.(product);
  }, [product, onProductClick]);
  
  const handleAddToCart = useCallback((e) => {
    e.stopPropagation();
    onAddToCart?.(product);
  }, [product, onAddToCart]);
  
  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        border: '1px solid #eee'
      }}
      onClick={handleClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      }}
    >
      <div style={{ display: 'flex', gap: '16px' }}>
        <div style={{
          width: '80px',
          height: '80px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px'
        }}>
          {product.emoji}
        </div>
        
        <div style={{ flex: 1 }}>
          <h3 style={{
            margin: '0 0 8px 0',
            fontSize: '18px',
            color: '#333',
            fontWeight: '600'
          }}>
            {product.name}
          </h3>
          
          <p style={{
            margin: '0 0 8px 0',
            fontSize: '14px',
            color: '#666',
            lineHeight: '1.4'
          }}>
            {product.description}
          </p>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '12px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <span style={{ fontSize: '14px', color: '#666' }}>⭐</span>
              <span style={{ fontSize: '14px', color: '#666' }}>
                {product.rating} ({product.reviewCount} recensioni)
              </span>
            </div>
            
            <div style={{
              fontSize: '14px',
              color: '#666'
            }}>
              {product.category}
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#007bff'
            }}>
              €{product.price.toFixed(2)}
            </div>
            
            <button
              onClick={handleAddToCart}
              style={{
                padding: '8px 16px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              🛒 Aggiungi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

// Componente principale del sistema di ricerca
function AdvancedSearchSystem() {
  const { renderCount } = usePerformanceMonitor('AdvancedSearchSystem');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    minRating: '',
    availability: ''
  });
  const [sortBy, setSortBy] = useState('relevance');
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Debounce della ricerca
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  // Dati di esempio (memoizzati)
  const products = useMemo(() => {
    console.log('Generazione prodotti...');
    
    const categories = ['Elettronica', 'Abbigliamento', 'Casa', 'Sport', 'Libri', 'Cucina'];
    const emojis = ['📱', '👕', '🏠', '⚽', '📚', '🍳', '💻', '🎧', '⌚', '📷'];
    
    return Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
      name: `Prodotto ${i + 1}`,
      description: `Descrizione dettagliata del prodotto ${i + 1} con caratteristiche uniche e funzionalità avanzate.`,
      category: categories[Math.floor(Math.random() * categories.length)],
      price: Math.floor(Math.random() * 500) + 10,
      rating: (Math.random() * 2 + 3).toFixed(1), // Rating tra 3.0 e 5.0
      reviewCount: Math.floor(Math.random() * 1000) + 10,
      availability: Math.random() > 0.1 ? 'in-stock' : 'out-of-stock',
      emoji: emojis[Math.floor(Math.random() * emojis.length)]
    }));
  }, []);
  
  // Opzioni disponibili per i filtri (memoizzate)
  const availableOptions = useMemo(() => {
    const categories = [...new Set(products.map(p => p.category))];
    return { categories };
  }, [products]);
  
  // Risultati della ricerca (memoizzati)
  const searchResults = useMemo(() => {
    console.log('Esecuzione ricerca...');
    
    let filtered = products;
    
    // Filtro per termine di ricerca
    if (debouncedSearchTerm) {
      const term = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)
      );
    }
    
    // Filtro per categoria
    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }
    
    // Filtro per prezzo
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      filtered = filtered.filter(product => {
        if (max) {
          return product.price >= min && product.price <= max;
        } else {
          return product.price >= min;
        }
      });
    }
    
    // Filtro per rating
    if (filters.minRating) {
      const minRating = parseFloat(filters.minRating);
      filtered = filtered.filter(product => parseFloat(product.rating) >= minRating);
    }
    
    // Filtro per disponibilità
    if (filters.availability) {
      filtered = filtered.filter(product => product.availability === filters.availability);
    }
    
    // Ordinamento
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Ordinamento per rilevanza (basato sul termine di ricerca)
        if (debouncedSearchTerm) {
          filtered.sort((a, b) => {
            const aRelevance = calculateRelevance(a, debouncedSearchTerm);
            const bRelevance = calculateRelevance(b, debouncedSearchTerm);
            return bRelevance - aRelevance;
          });
        }
    }
    
    return filtered;
  }, [products, debouncedSearchTerm, filters, sortBy]);
  
  // Funzione per calcolare la rilevanza (memoizzata)
  const calculateRelevance = useCallback((product, term) => {
    const termLower = term.toLowerCase();
    let score = 0;
    
    // Punteggio per nome
    if (product.name.toLowerCase().includes(termLower)) {
      score += 10;
    }
    
    // Punteggio per categoria
    if (product.category.toLowerCase().includes(termLower)) {
      score += 5;
    }
    
    // Punteggio per descrizione
    if (product.description.toLowerCase().includes(termLower)) {
      score += 2;
    }
    
    return score;
  }, []);
  
  // Callback per gestione filtri (memoizzati)
  const handleFilterChange = useCallback((filterKey, value) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  }, []);
  
  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
  }, []);
  
  const handleProductClick = useCallback((product) => {
    setSelectedProduct(product);
  }, []);
  
  const handleAddToCart = useCallback((product) => {
    console.log('Aggiunto al carrello:', product.name);
    // Qui implementeresti la logica per aggiungere al carrello
  }, []);
  
  const handleSortChange = useCallback((newSort) => {
    setSortBy(newSort);
  }, []);
  
  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
        🔍 Sistema di Ricerca Avanzata
      </h2>
      
      {/* Barra di ricerca */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        placeholder="Cerca prodotti, categorie o descrizioni..."
      />
      
      {/* Filtri */}
      <FilterComponent
        filters={filters}
        onFilterChange={handleFilterChange}
        availableOptions={availableOptions}
      />
      
      {/* Controlli di ordinamento e risultati */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '14px', color: '#666' }}>
            {searchResults.length.toLocaleString()} risultati trovati
          </span>
          {debouncedSearchTerm && (
            <span style={{ fontSize: '14px', color: '#007bff' }}>
              per "{debouncedSearchTerm}"
            </span>
          )}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontSize: '14px', color: '#666' }}>
            Ordina per:
          </label>
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            style={{
              padding: '6px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            <option value="relevance">Rilevanza</option>
            <option value="price-asc">Prezzo (crescente)</option>
            <option value="price-desc">Prezzo (decrescente)</option>
            <option value="rating">Rating</option>
            <option value="name">Nome</option>
          </select>
        </div>
      </div>
      
      {/* Risultati della ricerca */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '20px',
        marginBottom: '20px'
      }}>
        {searchResults.slice(0, 50).map(product => (
          <SearchResult
            key={product.id}
            product={product}
            onProductClick={handleProductClick}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
      
      {/* Pannello dettagli prodotto */}
      {selectedProduct && (
        <div style={{
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
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '30px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80%',
            overflow: 'auto',
            position: 'relative'
          }}>
            <button
              onClick={() => setSelectedProduct(null)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#666'
              }}
            >
              ✕
            </button>
            
            <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>
              {selectedProduct.emoji} {selectedProduct.name}
            </h3>
            
            <div style={{ marginBottom: '20px' }}>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                {selectedProduct.description}
              </p>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              marginBottom: '20px'
            }}>
              <div>
                <strong>Categoria:</strong> {selectedProduct.category}
              </div>
              <div>
                <strong>Prezzo:</strong> €{selectedProduct.price.toFixed(2)}
              </div>
              <div>
                <strong>Rating:</strong> ⭐ {selectedProduct.rating} ({selectedProduct.reviewCount} recensioni)
              </div>
              <div>
                <strong>Disponibilità:</strong> {
                  selectedProduct.availability === 'in-stock' ? '✅ Disponibile' : '❌ Esaurito'
                }
              </div>
            </div>
            
            <button
              onClick={() => handleAddToCart(selectedProduct)}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              🛒 Aggiungi al Carrello
            </button>
          </div>
        </div>
      )}
      
      {/* Info di debug */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '10px 15px',
        borderRadius: '6px',
        fontSize: '12px',
        fontFamily: 'monospace'
      }}>
        <div>Render: {renderCount}</div>
        <div>Risultati: {searchResults.length}</div>
        <div>Ricerca: "{debouncedSearchTerm}"</div>
      </div>
    </div>
  );
}

export default AdvancedSearchSystem;




