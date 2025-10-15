import React, { useState, useCallback, useMemo } from 'react';

/**
 * Esempio 3: Carrello con Comunicazione tra Componenti
 * 
 * Questo esempio dimostra:
 * - Comunicazione tra componenti fratelli
 * - Stato condiviso nel componente padre
 * - Pattern di callback per aggiornamenti
 * - Gestione stato complesso distribuito
 * - Evitare prop drilling con composizione
 */

// Componente per l'header con contatore carrello
function Header({ itemCount, totalPrice, onCartToggle, cartOpen }) {
  return (
    <header style={{
      backgroundColor: '#2c3e50',
      color: 'white',
      padding: '15px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div>
        <h1 style={{ margin: 0, fontSize: '24px' }}>🛍️ Shop Online</h1>
        <p style={{ margin: '5px 0 0 0', opacity: 0.8, fontSize: '14px' }}>
          I tuoi prodotti preferiti a portata di click
        </p>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '14px', opacity: 0.8 }}>Carrello</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
            {itemCount} articoli - €{totalPrice.toFixed(2)}
          </div>
        </div>
        
        <button
          onClick={onCartToggle}
          style={{
            padding: '12px 20px',
            backgroundColor: cartOpen ? '#e74c3c' : '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'background-color 0.3s ease'
          }}
        >
          {cartOpen ? '❌ Chiudi' : '🛒 Carrello'}
        </button>
      </div>
    </header>
  );
}

// Componente per la lista prodotti
function ProductList({ onAddToCart }) {
  const products = [
    {
      id: 1,
      name: 'MacBook Pro 16"',
      price: 2499.99,
      category: 'Electronics',
      image: '💻',
      description: 'Potente laptop per professionisti',
      inStock: true
    },
    {
      id: 2,
      name: 'iPhone 15 Pro',
      price: 1199.99,
      category: 'Electronics',
      image: '📱',
      description: 'Smartphone di ultima generazione',
      inStock: true
    },
    {
      id: 3,
      name: 'AirPods Pro',
      price: 279.99,
      category: 'Electronics',
      image: '🎧',
      description: 'Cuffie wireless con cancellazione rumore',
      inStock: true
    },
    {
      id: 4,
      name: 'iPad Air',
      price: 599.99,
      category: 'Electronics',
      image: '📱',
      description: 'Tablet versatile per lavoro e creatività',
      inStock: false
    },
    {
      id: 5,
      name: 'Apple Watch Series 9',
      price: 429.99,
      category: 'Electronics',
      image: '⌚',
      description: 'Smartwatch con monitoraggio salute',
      inStock: true
    },
    {
      id: 6,
      name: 'Magic Keyboard',
      price: 149.99,
      category: 'Accessories',
      image: '⌨️',
      description: 'Tastiera wireless per iPad',
      inStock: true
    }
  ];
  
  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ margin: '0 0 20px 0', color: '#2c3e50' }}>Prodotti Disponibili</h2>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '20px' 
      }}>
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
}

// Componente per singola card prodotto
function ProductCard({ product, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  
  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setQuantity(1); // Reset quantità
  };
  
  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '12px',
      padding: '20px',
      backgroundColor: 'white',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
    }}
    onMouseEnter={(e) => {
      e.target.style.transform = 'translateY(-2px)';
      e.target.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
    }}
    onMouseLeave={(e) => {
      e.target.style.transform = 'translateY(0)';
      e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    }}>
      <div style={{ textAlign: 'center', marginBottom: '15px' }}>
        <div style={{ fontSize: '48px', marginBottom: '10px' }}>
          {product.image}
        </div>
        <h3 style={{ margin: '0 0 8px 0', color: '#2c3e50' }}>
          {product.name}
        </h3>
        <p style={{ 
          margin: '0 0 10px 0', 
          color: '#7f8c8d', 
          fontSize: '14px' 
        }}>
          {product.description}
        </p>
        <div style={{ 
          display: 'inline-block',
          padding: '4px 12px',
          backgroundColor: '#ecf0f1',
          borderRadius: '12px',
          fontSize: '12px',
          color: '#2c3e50',
          marginBottom: '15px'
        }}>
          {product.category}
        </div>
      </div>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '15px'
      }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#27ae60' }}>
          €{product.price.toFixed(2)}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontSize: '14px', color: '#2c3e50' }}>Qtà:</label>
          <input
            type="number"
            min="1"
            max="10"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            style={{
              width: '60px',
              padding: '6px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              textAlign: 'center'
            }}
          />
        </div>
      </div>
      
      <button
        onClick={handleAddToCart}
        disabled={!product.inStock}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: product.inStock ? '#3498db' : '#95a5a6',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: product.inStock ? 'pointer' : 'not-allowed',
          fontSize: '16px',
          fontWeight: 'bold',
          transition: 'background-color 0.3s ease'
        }}
        onMouseEnter={(e) => {
          if (product.inStock) {
            e.target.style.backgroundColor = '#2980b9';
          }
        }}
        onMouseLeave={(e) => {
          if (product.inStock) {
            e.target.style.backgroundColor = '#3498db';
          }
        }}
      >
        {product.inStock ? '🛒 Aggiungi al Carrello' : '❌ Non Disponibile'}
      </button>
    </div>
  );
}

// Componente per il carrello laterale
function CartSidebar({ isOpen, items, onRemoveItem, onUpdateQuantity, onClearCart, onClose }) {
  const totalPrice = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [items]);
  
  const totalItems = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);
  
  if (!isOpen) return null;
  
  return (
    <div style={{
      position: 'fixed',
      right: 0,
      top: 0,
      width: '400px',
      height: '100vh',
      backgroundColor: 'white',
      borderLeft: '1px solid #ddd',
      boxShadow: '-2px 0 10px rgba(0,0,0,0.1)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header del carrello */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid #eee',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '10px'
        }}>
          <h2 style={{ margin: 0, color: '#2c3e50' }}>🛒 Carrello</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#7f8c8d'
            }}
          >
            ✕
          </button>
        </div>
        <div style={{ fontSize: '14px', color: '#7f8c8d' }}>
          {totalItems} articoli • €{totalPrice.toFixed(2)}
        </div>
      </div>
      
      {/* Lista articoli */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '20px' 
      }}>
        {items.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px 20px',
            color: '#7f8c8d'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>🛒</div>
            <h3 style={{ margin: '0 0 10px 0' }}>Il carrello è vuoto</h3>
            <p style={{ margin: 0 }}>Aggiungi alcuni prodotti per iniziare!</p>
          </div>
        ) : (
          <div>
            {items.map(item => (
              <CartItem
                key={item.id}
                item={item}
                onRemove={onRemoveItem}
                onUpdateQuantity={onUpdateQuantity}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Footer del carrello */}
      {items.length > 0 && (
        <div style={{
          padding: '20px',
          borderTop: '1px solid #eee',
          backgroundColor: '#f8f9fa'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '15px'
          }}>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#2c3e50' }}>
              Totale:
            </span>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#27ae60' }}>
              €{totalPrice.toFixed(2)}
            </span>
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={onClearCart}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              🗑️ Svuota
            </button>
            
            <button
              style={{
                flex: 2,
                padding: '12px',
                backgroundColor: '#27ae60',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              💳 Procedi al Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente per singolo item del carrello
function CartItem({ item, onRemove, onUpdateQuantity }) {
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity <= 0) {
      onRemove(item.id);
    } else {
      onUpdateQuantity(item.id, newQuantity);
    }
  };
  
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '15px',
      border: '1px solid #eee',
      borderRadius: '8px',
      marginBottom: '10px',
      backgroundColor: 'white'
    }}>
      <div style={{ fontSize: '32px', marginRight: '15px' }}>
        {item.image}
      </div>
      
      <div style={{ flex: 1 }}>
        <h4 style={{ margin: '0 0 5px 0', fontSize: '16px', color: '#2c3e50' }}>
          {item.name}
        </h4>
        <div style={{ fontSize: '14px', color: '#7f8c8d' }}>
          €{item.price.toFixed(2)} ciascuno
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          style={{
            width: '30px',
            height: '30px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            backgroundColor: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          -
        </button>
        
        <span style={{ 
          minWidth: '30px', 
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          {item.quantity}
        </span>
        
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          style={{
            width: '30px',
            height: '30px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            backgroundColor: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          +
        </button>
        
        <div style={{ 
          minWidth: '80px', 
          textAlign: 'right',
          fontWeight: 'bold',
          color: '#27ae60'
        }}>
          €{(item.price * item.quantity).toFixed(2)}
        </div>
        
        <button
          onClick={() => onRemove(item.id)}
          style={{
            padding: '6px 10px',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Rimuovi
        </button>
      </div>
    </div>
  );
}

// Componente principale dell'app
function ShoppingCartApp() {
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  
  const addToCart = useCallback((product, quantity) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prev, { ...product, quantity }];
      }
    });
  }, []);
  
  const removeFromCart = useCallback((productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  }, []);
  
  const updateQuantity = useCallback((productId, quantity) => {
    setCartItems(prev => prev.map(item =>
      item.id === productId ? { ...item, quantity } : item
    ));
  }, []);
  
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);
  
  const toggleCart = useCallback(() => {
    setCartOpen(prev => !prev);
  }, []);
  
  const closeCart = useCallback(() => {
    setCartOpen(false);
  }, []);
  
  // Calcoli memoizzati per performance
  const cartStats = useMemo(() => {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return { totalItems, totalPrice };
  }, [cartItems]);
  
  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      <Header
        itemCount={cartStats.totalItems}
        totalPrice={cartStats.totalPrice}
        onCartToggle={toggleCart}
        cartOpen={cartOpen}
      />
      
      <ProductList onAddToCart={addToCart} />
      
      <CartSidebar
        isOpen={cartOpen}
        items={cartItems}
        onRemoveItem={removeFromCart}
        onUpdateQuantity={updateQuantity}
        onClearCart={clearCart}
        onClose={closeCart}
      />
      
      {/* Overlay per chiudere il carrello */}
      {cartOpen && (
        <div
          onClick={closeCart}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999
          }}
        />
      )}
    </div>
  );
}

export default ShoppingCartApp;
