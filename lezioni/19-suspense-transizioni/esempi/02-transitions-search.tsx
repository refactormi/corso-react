// Esempio 2: Transitions per Ricerca - Aggiornamenti urgenti vs non urgenti
import { useState, useTransition, useDeferredValue, useMemo } from 'react';

// Simulazione database di prodotti
const generateProducts = (count = 5000) => {
  const categories = ['Elettronica', 'Abbigliamento', 'Casa', 'Sport', 'Libri'];
  const brands = ['Apple', 'Samsung', 'Nike', 'Adidas', 'Sony', 'LG'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Prodotto ${i + 1}`,
    category: categories[Math.floor(Math.random() * categories.length)],
    brand: brands[Math.floor(Math.random() * brands.length)],
    price: Math.floor(Math.random() * 1000) + 10,
    rating: (Math.random() * 4 + 1).toFixed(1),
    description: `Descrizione dettagliata del prodotto ${i + 1} con caratteristiche uniche.`
  }));
};

const PRODUCTS = generateProducts();

// Componente per i risultati di ricerca
function SearchResults({ results, isPending }) {
  return (
    <div style={{ 
      marginTop: 16,
      opacity: isPending ? 0.7 : 1,
      transition: 'opacity 0.2s ease'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 12,
        padding: '8px 12px',
        backgroundColor: isPending ? '#fff3cd' : '#d4edda',
        borderRadius: 4,
        border: `1px solid ${isPending ? '#ffeaa7' : '#c3e6cb'}`
      }}>
        <span style={{ fontWeight: 'bold' }}>
          {results.length} prodotti trovati
        </span>
        {isPending && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="spinner" />
            <span style={{ fontSize: 14, color: '#856404' }}>
              Aggiornamento in corso...
            </span>
          </div>
        )}
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 12,
        maxHeight: 400,
        overflowY: 'auto',
        border: '1px solid #ddd',
        borderRadius: 8,
        padding: 12
      }}>
        {results.slice(0, 50).map(product => (
          <div key={product.id} style={{
            border: '1px solid #eee',
            borderRadius: 6,
            padding: 12,
            backgroundColor: 'white',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: 14, color: '#333' }}>
              {product.name}
            </h4>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
              <div><strong>Categoria:</strong> {product.category}</div>
              <div><strong>Brand:</strong> {product.brand}</div>
              <div><strong>Prezzo:</strong> €{product.price}</div>
              <div><strong>Rating:</strong> ⭐ {product.rating}</div>
            </div>
            <p style={{ fontSize: 11, color: '#888', margin: 0 }}>
              {product.description}
            </p>
          </div>
        ))}
      </div>
      
      {results.length > 50 && (
        <div style={{ 
          textAlign: 'center', 
          marginTop: 12, 
          padding: 8,
          backgroundColor: '#f8f9fa',
          borderRadius: 4,
          fontSize: 14,
          color: '#666'
        }}>
          Mostrati primi 50 risultati di {results.length}
        </div>
      )}
    </div>
  );
}

// Componente principale con Transitions
export default function TransitionsSearchExample() {
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();
  const [results, setResults] = useState(PRODUCTS.slice(0, 20));
  
  // useDeferredValue per ottimizzare ulteriormente
  const deferredQuery = useDeferredValue(query);
  
  // Funzione di ricerca pesante (simula operazione costosa)
  const searchProducts = useMemo(() => {
    if (!deferredQuery.trim()) {
      return PRODUCTS.slice(0, 20); // Mostra primi 20 se nessuna query
    }
    
    const searchTerm = deferredQuery.toLowerCase();
    return PRODUCTS.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      product.brand.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm)
    );
  }, [deferredQuery]);
  
  // Handler per l'input di ricerca
  const handleSearch = (value) => {
    // Aggiornamento URGENTE: input dell'utente
    setQuery(value);
    
    // Aggiornamento NON URGENTE: risultati di ricerca
    startTransition(() => {
      setResults(searchProducts);
    });
  };
  
  // Simulazione di filtri aggiuntivi
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  
  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    
    startTransition(() => {
      let filtered = searchProducts;
      
      if (category) {
        filtered = filtered.filter(p => p.category === category);
      }
      
      filtered = filtered.filter(p => 
        p.price >= priceRange[0] && p.price <= priceRange[1]
      );
      
      setResults(filtered);
    });
  };
  
  const categories = [...new Set(PRODUCTS.map(p => p.category))];
  
  return (
    <div style={{ padding: 20 }}>
      <h2>⚡ Transitions per Ricerca - UI Reattiva</h2>
      
      {/* Input di ricerca */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ 
            display: 'block', 
            marginBottom: 8, 
            fontWeight: 'bold',
            color: '#333'
          }}>
            🔍 Ricerca Prodotti:
          </label>
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Cerca per nome, categoria, brand..."
            style={{
              width: '100%',
              padding: 12,
              fontSize: 16,
              border: '2px solid #ddd',
              borderRadius: 8,
              outline: 'none',
              transition: 'border-color 0.2s ease',
              backgroundColor: isPending ? '#f8f9fa' : 'white'
            }}
            onFocus={(e) => e.target.style.borderColor = '#007bff'}
            onBlur={(e) => e.target.style.borderColor = '#ddd'}
          />
        </div>
        
        {/* Filtri */}
        <div style={{ 
          display: 'flex', 
          gap: 16, 
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <div>
            <label style={{ marginRight: 8, fontSize: 14 }}>Categoria:</label>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryFilter(e.target.value)}
              style={{ 
                padding: 6, 
                borderRadius: 4, 
                border: '1px solid #ccc',
                fontSize: 14
              }}
            >
              <option value="">Tutte</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div style={{ fontSize: 14, color: '#666' }}>
            Prezzo: €{priceRange[0]} - €{priceRange[1]}
          </div>
        </div>
      </div>
      
      {/* Indicatori di stato */}
      <div style={{ 
        display: 'flex', 
        gap: 16, 
        marginBottom: 16,
        padding: 12,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        border: '1px solid #e9ecef'
      }}>
        <div style={{ 
          padding: '4px 8px', 
          borderRadius: 4,
          backgroundColor: query !== deferredQuery ? '#ffeaa7' : '#d4edda',
          fontSize: 12,
          fontWeight: 'bold'
        }}>
          Query: "{query}" {query !== deferredQuery && '(deferred)'}
        </div>
        
        <div style={{ 
          padding: '4px 8px', 
          borderRadius: 4,
          backgroundColor: isPending ? '#ffcccc' : '#ccffcc',
          fontSize: 12,
          fontWeight: 'bold'
        }}>
          Transition: {isPending ? 'PENDING' : 'IDLE'}
        </div>
      </div>
      
      {/* Risultati */}
      <SearchResults results={results} isPending={isPending} />
      
      {/* Spiegazione */}
      <div style={{ 
        marginTop: 24, 
        padding: 16, 
        backgroundColor: '#e7f3ff', 
        borderRadius: 8,
        border: '1px solid #b3d9ff'
      }}>
        <h4 style={{ margin: '0 0 12px 0', color: '#0056b3' }}>
          💡 Come Funzionano le Transitions:
        </h4>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li><strong>Input urgente:</strong> L'aggiornamento del campo di ricerca è immediato</li>
          <li><strong>Risultati non urgenti:</strong> La ricerca nei prodotti avviene in background</li>
          <li><strong>UI reattiva:</strong> L'interfaccia rimane responsiva durante la ricerca</li>
          <li><strong>Feedback visivo:</strong> Indicatori mostrano lo stato delle operazioni</li>
          <li><strong>useDeferredValue:</strong> Ottimizza ulteriormente le performance</li>
        </ul>
      </div>
      
      <style jsx>{`
        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid #f3f3f3;
          border-top: 2px solid #856404;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}