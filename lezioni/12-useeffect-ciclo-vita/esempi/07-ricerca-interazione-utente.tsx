import React, { useState, useEffect, useCallback, useMemo } from 'react'

/**
 * Esempio 7: Ricerca Avanzata con Debouncing e Autocomplete (Interazione Utente)
 * 
 * Questo esempio dimostra:
 * - Input con debouncing per ottimizzare le chiamate API
 * - Autocomplete con suggerimenti dinamici
 * - Gestione stati di loading e errori
 * - Filtri avanzati e ricerca in tempo reale
 * - Feedback visivo per l'utente
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

// Componente per input con autocomplete
function AutocompleteInput({ 
  value, 
  onChange, 
  suggestions, 
  onSelect, 
  placeholder, 
  loading,
  error 
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  const filteredSuggestions = useMemo(() => {
    if (!value || !suggestions.length) return [];
    return suggestions.filter(suggestion =>
      suggestion.toLowerCase().includes(value.toLowerCase())
    ).slice(0, 10); // Limita a 10 suggerimenti
  }, [value, suggestions]);
  
  const handleKeyDown = (e) => {
    if (!showSuggestions || filteredSuggestions.length === 0) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleSelect(filteredSuggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        break;
    }
  };
  
  const handleSelect = (suggestion) => {
    onSelect(suggestion);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
  };
  
  const handleInputChange = (e) => {
    onChange(e.target.value);
    setShowSuggestions(true);
    setHighlightedIndex(-1);
  };
  
  return (
    <div style={{  position: 'relative', width: '100%' } as React.CSSProperties}>
      <div style={{  position: 'relative' } as React.CSSProperties}>
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => {
            // Delay per permettere il click sui suggerimenti
            setTimeout(() => setShowSuggestions(false), 200);
          }}
          placeholder={placeholder}
          style={{ 
            width: '100%',
            padding: '12px 40px 12px 12px',
            border: `1px solid ${error ? '#dc3545' : '#ddd'}`,
            borderRadius: '6px',
            fontSize: '16px',
            boxSizing: 'border-box'
          }}
        />
        
        {loading && (
          <div style={{ 
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '20px',
            height: '20px',
            border: '2px solid #f3f3f3',
            borderTop: '2px solid #007bff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        )}
      </div>
      
      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul style={{ 
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'white',
          border: '1px solid #ddd',
          borderTop: 'none',
          borderRadius: '0 0 6px 6px',
          maxHeight: '200px',
          overflowY: 'auto',
          zIndex: 1000,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          listStyle: 'none',
          padding: 0,
          margin: 0
        } as React.CSSProperties}>
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSelect(suggestion)}
              style={{ 
                padding: '12px',
                cursor: 'pointer',
                backgroundColor: index === highlightedIndex ? '#f8f9fa' : 'transparent',
                borderBottom: index < filteredSuggestions.length - 1 ? '1px solid #eee' : 'none'
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
      
      {error && (
        <div style={{  color: '#dc3545', fontSize: '14px', marginTop: '5px' } as React.CSSProperties}>
          {error}
        </div>
      )}
    </div>
  );
}

// Componente per i filtri
function SearchFilters({ filters, onFilterChange }) {
  return (
    <div style={{ 
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '15px',
      marginBottom: '20px'
    } as React.CSSProperties}>
      <div>
        <label style={{  display: 'block', marginBottom: '5px', fontWeight: 'bold' } as React.CSSProperties}>
          Categoria
        </label>
        <select
          value={filters.category}
          onChange={(e) => onFilterChange('category', e.target.value)}
          style={{ 
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        >
          <option value="">Tutte le categorie</option>
          <option value="electronics">Elettronica</option>
          <option value="books">Libri</option>
          <option value="clothing">Abbigliamento</option>
          <option value="home">Casa e Giardino</option>
          <option value="sports">Sport</option>
        </select>
      </div>
      
      <div>
        <label style={{  display: 'block', marginBottom: '5px', fontWeight: 'bold' } as React.CSSProperties}>
          Prezzo Minimo
        </label>
        <input
          type="number"
          value={filters.minPrice}
          onChange={(e) => onFilterChange('minPrice', e.target.value)}
          placeholder="€0"
          style={{ 
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        />
      </div>
      
      <div>
        <label style={{  display: 'block', marginBottom: '5px', fontWeight: 'bold' } as React.CSSProperties}>
          Prezzo Massimo
        </label>
        <input
          type="number"
          value={filters.maxPrice}
          onChange={(e) => onFilterChange('maxPrice', e.target.value)}
          placeholder="€1000"
          style={{ 
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        />
      </div>
      
      <div>
        <label style={{  display: 'block', marginBottom: '5px', fontWeight: 'bold' } as React.CSSProperties}>
          Ordinamento
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => onFilterChange('sortBy', e.target.value)}
          style={{ 
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        >
          <option value="relevance">Rilevanza</option>
          <option value="price-asc">Prezzo: crescente</option>
          <option value="price-desc">Prezzo: decrescente</option>
          <option value="name-asc">Nome: A-Z</option>
          <option value="name-desc">Nome: Z-A</option>
          <option value="rating">Valutazione</option>
        </select>
      </div>
    </div>
  );
}

// Componente per i risultati
function SearchResults({ results, loading, error, onProductSelect }) {
  if (loading) {
    return (
      <div style={{  
        textAlign: 'center', 
        padding: '40px',
        color: '#666'
      } as React.CSSProperties}>
        <div style={{ 
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #007bff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px'
        }} />
        <p>Ricerca in corso...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div style={{ 
        textAlign: 'center',
        padding: '40px',
        backgroundColor: '#f8d7da',
        border: '1px solid #f5c6cb',
        borderRadius: '6px',
        color: '#721c24'
      } as React.CSSProperties}>
        <div style={{  fontSize: '48px', marginBottom: '15px' } as React.CSSProperties}>❌</div>
        <h3>Errore nella ricerca</h3>
        <p>{error}</p>
      </div>
    );
  }
  
  if (results.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center',
        padding: '40px',
        color: '#666'
      } as React.CSSProperties}>
        <div style={{  fontSize: '48px', marginBottom: '15px' } as React.CSSProperties}>🔍</div>
        <h3>Nessun risultato trovato</h3>
        <p>Prova a modificare i criteri di ricerca</p>
      </div>
    );
  }
  
  return (
    <div style={{ 
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '20px'
    } as React.CSSProperties}>
      {results.map(product => (
        <div
          key={product.id}
          onClick={() => onProductSelect(product)}
          style={{ 
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '15px',
            backgroundColor: 'white',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
          }}
        >
          <div style={{  textAlign: 'center', marginBottom: '10px' } as React.CSSProperties}>
            <div style={{  fontSize: '32px', marginBottom: '8px' } as React.CSSProperties}>
              {product.emoji}
            </div>
            <h4 style={{  margin: '0 0 5px 0', fontSize: '16px' } as React.CSSProperties}>
              {product.name}
            </h4>
            <p style={{  
              margin: '0 0 10px 0', 
              fontSize: '14px', 
              color: '#666' 
            } as React.CSSProperties}>
              {product.category}
            </p>
          </div>
          
          <div style={{  
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '10px'
          } as React.CSSProperties}>
            <span style={{  
              fontSize: '18px', 
              fontWeight: 'bold', 
              color: '#28a745' 
            } as React.CSSProperties}>
              €{product.price.toFixed(2)}
            </span>
            <div style={{  display: 'flex', alignItems: 'center' } as React.CSSProperties}>
              <span style={{  marginRight: '5px' } as React.CSSProperties}>⭐</span>
              <span style={{  fontSize: '14px' } as React.CSSProperties}>{product.rating}</span>
            </div>
          </div>
          
          <p style={{  
            fontSize: '12px', 
            color: '#999', 
            margin: 0,
            lineHeight: '1.4'
          } as React.CSSProperties}>
            {product.description}
          </p>
        </div>
      ))}
    </div>
  );
}

// Componente principale
function AdvancedSearch() {
  const [query, setQuery] = useState(''
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'relevance'
  }
  
  const debouncedQuery = useDebounce(query, 300);
  
  // Dati mock
  const mockProducts = [
    { id: 1, name: 'iPhone 15 Pro', category: 'electronics', price: 1199.99, rating: 4.8, emoji: '📱', description: 'Smartphone di ultima generazione con fotocamera avanzata' },
    { id: 2, name: 'MacBook Air M2', category: 'electronics', price: 1299.99, rating: 4.9, emoji: '💻', description: 'Laptop leggero e potente per lavoro e creatività' },
    { id: 3, name: 'AirPods Pro', category: 'electronics', price: 279.99, rating: 4.7, emoji: '🎧', description: 'Cuffie wireless con cancellazione rumore attiva' },
    { id: 4, name: 'React Guide', category: 'books', price: 29.99, rating: 4.6, emoji: '📚', description: 'Guida completa per sviluppatori React' },
    { id: 5, name: 'JavaScript Mastery', category: 'books', price: 34.99, rating: 4.8, emoji: '📖', description: 'Impara JavaScript da zero a esperto' },
    { id: 6, name: 'T-Shirt Cotton', category: 'clothing', price: 19.99, rating: 4.5, emoji: '👕', description: 'Maglietta in cotone biologico, comoda e sostenibile' },
    { id: 7, name: 'Jeans Denim', category: 'clothing', price: 79.99, rating: 4.4, emoji: '👖', description: 'Jeans classici in denim di alta qualità' },
    { id: 8, name: 'Coffee Maker', category: 'home', price: 89.99, rating: 4.3, emoji: '☕', description: 'Macchina per caffè automatica con tecnologia avanzata' },
    { id: 9, name: 'Yoga Mat', category: 'sports', price: 39.99, rating: 4.6, emoji: '🧘', description: 'Tappetino yoga antiscivolo e ecologico' },
    { id: 10, name: 'Running Shoes', category: 'sports', price: 129.99, rating: 4.7, emoji: '👟', description: 'Scarpe da running con tecnologia di ammortizzazione' }
  ];
  
  const mockSuggestions = [
    'iPhone', 'MacBook', 'AirPods', 'React', 'JavaScript', 'T-Shirt', 'Jeans',
    'Coffee', 'Yoga', 'Running', 'Electronics', 'Books', 'Clothing', 'Home', 'Sports'
  ];
  
  // Simula chiamata API per suggerimenti
  useEffect(() => {
    if (debouncedQuery && debouncedQuery.length > 1) {
      setSuggestionsLoading(true);
      setTimeout(() => {
        const filtered = mockSuggestions.filter(suggestion =>
          suggestion.toLowerCase().includes(debouncedQuery.toLowerCase())
        );
        setSuggestions(filtered);
        setSuggestionsLoading(false);
      }, 200);
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery]);
  
  // Simula chiamata API per ricerca
  useEffect(() => {
    if (debouncedQuery && debouncedQuery.length > 2) {
      setLoading(true);
      setError(null);
      
      setTimeout(() => {
        try {
          let filtered = mockProducts.filter(product =>
            product.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(debouncedQuery.toLowerCase())
          );
          
          // Applica filtri
          if (filters.category) {
            filtered = filtered.filter(product => product.category === filters.category);
          }
          
          if (filters.minPrice) {
            filtered = filtered.filter(product => product.price >= parseFloat(filters.minPrice));
          }
          
          if (filters.maxPrice) {
            filtered = filtered.filter(product => product.price <= parseFloat(filters.maxPrice));
          }
          
          // Applica ordinamento
          switch (filters.sortBy) {
            case 'price-asc':
              filtered.sort((a, b) => a.price - b.price);
              break;
            case 'price-desc':
              filtered.sort((a, b) => b.price - a.price);
              break;
            case 'name-asc':
              filtered.sort((a, b) => a.name.localeCompare(b.name));
              break;
            case 'name-desc':
              filtered.sort((a, b) => b.name.localeCompare(a.name));
              break;
            case 'rating':
              filtered.sort((a, b) => b.rating - a.rating);
              break;
          }
          
          setResults(filtered);
        } catch (err) {
          setError('Errore durante la ricerca'
        } finally {
          setLoading(false);
        }
      }, 500);
    } else {
      setResults([]);
    }
  }, [debouncedQuery, filters]);
  
  const handleQueryChange = (newQuery) => {
    setQuery(newQuery);
  };
  
  const handleSuggestionSelect = (suggestion) => {
    setQuery(suggestion);
  };
  
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };
  
  const handleProductSelect = (product) => {
    setSelectedProduct(product);
  };
  
  const clearSearch = () => {
    setQuery(''
    setResults([]);
    setSelectedProduct(null);
  };
  
  return (
    <div style={{  
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    } as React.CSSProperties}>
      <div style={{  
        maxWidth: '1200px', 
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      } as React.CSSProperties}>
        
        {/* Header */}
        <div style={{  
          backgroundColor: '#007bff', 
          color: 'white', 
          padding: '20px',
          textAlign: 'center'
        } as React.CSSProperties}>
          <h1 style={{  margin: 0, fontSize: '2rem' } as React.CSSProperties}>
            🔍 Ricerca Avanzata
          </h1>
          <p style={{  margin: '10px 0 0 0', opacity: 0.9 } as React.CSSProperties}>
            Trova i prodotti che stai cercando con filtri avanzati
          </p>
        </div>
        
        {/* Contenuto */}
        <div style={{  padding: '30px' } as React.CSSProperties}>
          
          {/* Barra di ricerca */}
          <div style={{  marginBottom: '20px' } as React.CSSProperties}>
            <div style={{  display: 'flex', gap: '10px', alignItems: 'center' } as React.CSSProperties}>
              <div style={{  flex: 1 } as React.CSSProperties}>
                <AutocompleteInput
                  value={query}
                  onChange={handleQueryChange}
                  suggestions={suggestions}
                  onSelect={handleSuggestionSelect}
                  placeholder="Cerca prodotti, categorie, descrizioni..."
                  loading={suggestionsLoading}
                />
              </div>
              {query && (
                <button
                  onClick={clearSearch}
                  style={{ 
                    padding: '12px 16px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Pulisci
                </button>
              )}
            </div>
          </div>
          
          {/* Filtri */}
          <SearchFilters filters={filters} onFilterChange={handleFilterChange} />
          
          {/* Statistiche ricerca */}
          {results.length > 0 && (
            <div style={{ 
              marginBottom: '20px',
              padding: '15px',
              backgroundColor: '#e9ecef',
              borderRadius: '6px',
              fontSize: '14px',
              color: '#495057'
            } as React.CSSProperties}>
              <strong>Trovati {results.length} risultati</strong>
              {query && <span> per "{query}"</span>}
              {filters.category && <span> in {filters.category}</span>}
            </div>
          )}
          
          {/* Risultati */}
          <SearchResults
            results={results}
            loading={loading}
            error={error}
            onProductSelect={handleProductSelect}
          />
          
          {/* Dettaglio prodotto selezionato */}
          {selectedProduct && (
            <div style={{ 
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 2000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            } as React.CSSProperties}>
              <div style={{ 
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '30px',
                maxWidth: '500px',
                width: '100%',
                maxHeight: '80vh',
                overflowY: 'auto'
              } as React.CSSProperties}>
                <div style={{  display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' } as React.CSSProperties}>
                  <h3 style={{  margin: 0 } as React.CSSProperties}>Dettaglio Prodotto</h3>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    style={{ 
                      background: 'none',
                      border: 'none',
                      fontSize: '24px',
                      cursor: 'pointer',
                      color: '#666'
                    }}
                  >
                    ✕
                  </button>
                </div>
                
                <div style={{  textAlign: 'center', marginBottom: '20px' } as React.CSSProperties}>
                  <div style={{  fontSize: '64px', marginBottom: '15px' } as React.CSSProperties}>
                    {selectedProduct.emoji}
                  </div>
                  <h2 style={{  margin: '0 0 10px 0' } as React.CSSProperties}>{selectedProduct.name}</h2>
                  <p style={{  margin: '0 0 15px 0', color: '#666' } as React.CSSProperties}>{selectedProduct.category}</p>
                  <div style={{  fontSize: '24px', fontWeight: 'bold', color: '#28a745' } as React.CSSProperties}>
                    €{selectedProduct.price.toFixed(2)}
                  </div>
                </div>
                
                <div style={{  marginBottom: '20px' } as React.CSSProperties}>
                  <h4>Descrizione</h4>
                  <p style={{  lineHeight: '1.6' } as React.CSSProperties}>{selectedProduct.description}</p>
                </div>
                
                <div style={{  marginBottom: '20px' } as React.CSSProperties}>
                  <h4>Valutazione</h4>
                  <div style={{  display: 'flex', alignItems: 'center', gap: '10px' } as React.CSSProperties}>
                    <span style={{  fontSize: '20px' } as React.CSSProperties}>⭐</span>
                    <span style={{  fontSize: '18px', fontWeight: 'bold' } as React.CSSProperties}>{selectedProduct.rating}</span>
                    <span style={{  color: '#666' } as React.CSSProperties}>/ 5.0</span>
                  </div>
                </div>
                
                <button
                  style={{ 
                    width: '100%',
                    padding: '15px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  🛒 Aggiungi al Carrello
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
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

export default AdvancedSearch;
