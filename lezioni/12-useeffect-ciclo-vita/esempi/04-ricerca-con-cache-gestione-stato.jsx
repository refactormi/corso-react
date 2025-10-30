import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

/**
 * Esempio 4: Ricerca con Cache e Debouncing (Gestione Stato Avanzata)
 * 
 * Questo esempio dimostra:
 * - Gestione stati asincroni
 * - Pattern di cache per ottimizzazione
 * - Debouncing per ridurre chiamate API
 * - Gestione stati di loading ed errori
 * - Memoizzazione per performance
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

// Hook per ricerca con cache
function useSearchWithCache() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cache, setCache] = useState(new Map());
  const [searchHistory, setSearchHistory] = useState([]);
  
  const debouncedQuery = useDebounce(query, 300);
  
  // Funzione per simulare chiamata API
  const searchAPI = useCallback(async (searchQuery) => {
    // Simula delay di rete
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    // Simula dati di ricerca
    const mockData = [
      { id: 1, title: 'React Hooks Guide', category: 'Tutorial', author: 'John Doe', date: '2024-01-15' },
      { id: 2, title: 'JavaScript ES6 Features', category: 'Article', author: 'Jane Smith', date: '2024-01-14' },
      { id: 3, title: 'CSS Grid Layout', category: 'Tutorial', author: 'Mike Johnson', date: '2024-01-13' },
      { id: 4, title: 'Node.js Best Practices', category: 'Guide', author: 'Sarah Wilson', date: '2024-01-12' },
      { id: 5, title: 'TypeScript Advanced', category: 'Tutorial', author: 'David Brown', date: '2024-01-11' },
      { id: 6, title: 'Vue.js vs React', category: 'Comparison', author: 'Lisa Davis', date: '2024-01-10' },
      { id: 7, title: 'Webpack Configuration', category: 'Guide', author: 'Tom Miller', date: '2024-01-09' },
      { id: 8, title: 'Docker for Developers', category: 'Tutorial', author: 'Anna Garcia', date: '2024-01-08' },
      { id: 9, title: 'GraphQL Introduction', category: 'Article', author: 'Chris Lee', date: '2024-01-07' },
      { id: 10, title: 'MongoDB Queries', category: 'Guide', author: 'Emma Taylor', date: '2024-01-06' }
    ];
    
    // Filtra i dati in base alla query
    return mockData.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, []);
  
  const search = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setError(null);
      return;
    }
    
    // Controlla la cache
    if (cache.has(searchQuery)) {
      console.log('Risultati dalla cache:', searchQuery);
      setResults(cache.get(searchQuery));
      setError(null);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Chiamata API per:', searchQuery);
      const data = await searchAPI(searchQuery);
      
      // Salva nella cache
      setCache(prev => new Map(prev).set(searchQuery, data));
      
      // Aggiorna cronologia
      setSearchHistory(prev => {
        const newHistory = prev.filter(item => item !== searchQuery);
        return [searchQuery, ...newHistory].slice(0, 10); // Mantieni solo 10 elementi
      });
      
      setResults(data);
    } catch (error) {
      console.error('Errore nella ricerca:', error);
      setError('Errore durante la ricerca. Riprova.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [cache, searchAPI]);
  
  useEffect(() => {
    search(debouncedQuery);
  }, [debouncedQuery, search]);
  
  const clearCache = useCallback(() => {
    setCache(new Map());
    setSearchHistory([]);
  }, []);
  
  const clearResults = useCallback(() => {
    setResults([]);
    setQuery('');
    setError(null);
  }, []);
  
  return {
    query,
    setQuery,
    results,
    loading,
    error,
    searchHistory,
    clearCache,
    clearResults,
    cacheSize: cache.size
  };
}

// Componente per risultato di ricerca
function SearchResult({ result, onSelect }) {
  const handleClick = useCallback(() => {
    onSelect(result);
  }, [result, onSelect]);
  
  return (
    <div 
      onClick={handleClick}
      style={{
        padding: '15px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        marginBottom: '10px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        backgroundColor: '#fff'
      }}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = '#f8f9fa';
        e.target.style.borderColor = '#007bff';
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = '#fff';
        e.target.style.borderColor = '#ddd';
      }}
    >
      <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>
        {result.title}
      </h4>
      <div style={{ display: 'flex', gap: '15px', fontSize: '14px', color: '#666' }}>
        <span>📁 {result.category}</span>
        <span>👤 {result.author}</span>
        <span>📅 {new Date(result.date).toLocaleDateString('it-IT')}</span>
      </div>
    </div>
  );
}

// Componente principale
function SearchWithCache() {
  const {
    query,
    setQuery,
    results,
    loading,
    error,
    searchHistory,
    clearCache,
    clearResults,
    cacheSize
  } = useSearchWithCache();
  
  const [selectedResult, setSelectedResult] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  
  const handleResultSelect = useCallback((result) => {
    setSelectedResult(result);
  }, []);
  
  const handleHistorySelect = useCallback((historyQuery) => {
    setQuery(historyQuery);
    setShowHistory(false);
  }, [setQuery]);
  
  // Statistiche memoizzate
  const stats = useMemo(() => {
    return {
      totalResults: results.length,
      categories: [...new Set(results.map(r => r.category))],
      authors: [...new Set(results.map(r => r.author))],
      averageResultsPerQuery: cacheSize > 0 ? results.length : 0
    };
  }, [results, cacheSize]);
  
  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ccc', 
      borderRadius: '8px',
      maxWidth: '900px',
      margin: '20px auto',
      backgroundColor: '#fff'
    }}>
      <h2>🔍 Ricerca con Cache e Debouncing</h2>
      
      {/* Barra di ricerca */}
      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cerca articoli, tutorial, guide..."
          style={{
            width: '100%',
            padding: '12px 50px 12px 15px',
            border: '2px solid #ddd',
            borderRadius: '25px',
            fontSize: '16px',
            boxSizing: 'border-box'
          }}
        />
        
        <div style={{ 
          position: 'absolute', 
          right: '15px', 
          top: '50%', 
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          {loading && (
            <div style={{ 
              width: '20px', 
              height: '20px', 
              border: '2px solid #f3f3f3',
              borderTop: '2px solid #007bff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
          )}
          
          {query && (
            <button
              onClick={clearResults}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: '#666'
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>
      
      {/* Cronologia ricerche */}
      {searchHistory.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={() => setShowHistory(!showHistory)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f8f9fa',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {showHistory ? 'Nascondi' : 'Mostra'} Cronologia ({searchHistory.length})
          </button>
          
          {showHistory && (
            <div style={{ 
              marginTop: '10px',
              padding: '10px',
              backgroundColor: '#f8f9fa',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {searchHistory.map((historyQuery, index) => (
                  <button
                    key={index}
                    onClick={() => handleHistorySelect(historyQuery)}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: '#e9ecef',
                      border: '1px solid #ced4da',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    {historyQuery}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Statistiche */}
      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        marginBottom: '20px',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        fontSize: '14px'
      }}>
        <div>
          <strong>Risultati:</strong> {stats.totalResults}
        </div>
        <div>
          <strong>Cache:</strong> {cacheSize} query
        </div>
        <div>
          <strong>Categorie:</strong> {stats.categories.length}
        </div>
        <div>
          <strong>Autori:</strong> {stats.authors.length}
        </div>
      </div>
      
      {/* Messaggi di stato */}
      {error && (
        <div style={{
          padding: '15px',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          marginBottom: '20px',
          color: '#721c24'
        }}>
          ❌ {error}
        </div>
      )}
      
      {loading && (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          color: '#666'
        }}>
          🔍 Ricerca in corso...
        </div>
      )}
      
      {!loading && !error && query && results.length === 0 && (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          color: '#666',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px'
        }}>
          <p>Nessun risultato trovato per "{query}"</p>
          <p>Prova con termini diversi o più generici</p>
        </div>
      )}
      
      {/* Risultati */}
      {!loading && results.length > 0 && (
        <div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '15px'
          }}>
            <h3>Risultati per "{query}" ({results.length})</h3>
            <button
              onClick={clearCache}
              style={{
                padding: '6px 12px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Pulisci Cache
            </button>
          </div>
          
          <div>
            {results.map(result => (
              <SearchResult
                key={result.id}
                result={result}
                onSelect={handleResultSelect}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Dettaglio risultato selezionato */}
      {selectedResult && (
        <div style={{
          marginTop: '20px',
          padding: '20px',
          backgroundColor: '#e3f2fd',
          borderRadius: '8px',
          border: '1px solid #2196f3'
        }}>
          <h4>📄 Dettaglio Risultato</h4>
          <div style={{ marginBottom: '10px' }}>
            <strong>Titolo:</strong> {selectedResult.title}
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>Categoria:</strong> {selectedResult.category}
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>Autore:</strong> {selectedResult.author}
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>Data:</strong> {new Date(selectedResult.date).toLocaleDateString('it-IT')}
          </div>
          <button
            onClick={() => setSelectedResult(null)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Chiudi
          </button>
        </div>
      )}
      
      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <details style={{ marginTop: '20px' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
            Debug Info
          </summary>
          <pre style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '10px', 
            borderRadius: '4px',
            fontSize: '12px',
            overflow: 'auto'
          }}>
            {JSON.stringify({ 
              query, 
              resultsCount: results.length, 
              loading, 
              error, 
              cacheSize, 
              searchHistory: searchHistory.slice(0, 5) 
            }, null, 2)}
          </pre>
        </details>
      )}
      
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

export default SearchWithCache;
