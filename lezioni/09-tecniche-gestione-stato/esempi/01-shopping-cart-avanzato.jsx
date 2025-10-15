import React, { useReducer, useMemo, useCallback } from 'react';

/**
 * Esempio 1: Shopping Cart Avanzato con useReducer
 * 
 * Questo esempio dimostra:
 * - Gestione stato complesso con useReducer
 * - Pattern di azioni e reducer
 * - Stati derivati calcolati
 * - Ottimizzazioni con useMemo e useCallback
 */

// Definizione delle azioni
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  APPLY_DISCOUNT: 'APPLY_DISCOUNT',
  REMOVE_DISCOUNT: 'REMOVE_DISCOUNT'
};

// Reducer function
function cartReducer(state, action) {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM:
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }]
      };
      
    case CART_ACTIONS.REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
      
    case CART_ACTIONS.UPDATE_QUANTITY:
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }
            : item
        ).filter(item => item.quantity > 0)
      };
      
    case CART_ACTIONS.CLEAR_CART:
      return {
        ...state,
        items: [],
        discount: 0
      };
      
    case CART_ACTIONS.APPLY_DISCOUNT:
      return {
        ...state,
        discount: action.payload
      };
      
    case CART_ACTIONS.REMOVE_DISCOUNT:
      return {
        ...state,
        discount: 0
      };
      
    default:
      return state;
  }
}

// Componente per un singolo item del carrello
function CartItem({ item, onUpdateQuantity, onRemove }) {
  const handleQuantityChange = useCallback((newQuantity) => {
    onUpdateQuantity(item.id, newQuantity);
  }, [item.id, onUpdateQuantity]);
  
  const handleRemove = useCallback(() => {
    onRemove(item.id);
  }, [item.id, onRemove]);
  
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '15px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      marginBottom: '10px',
      backgroundColor: '#f9f9f9'
    }}>
      <div style={{ flex: 1 }}>
        <h4 style={{ margin: '0 0 5px 0' }}>{item.name}</h4>
        <p style={{ margin: 0, color: '#666' }}>€{item.price.toFixed(2)}</p>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          style={{
            width: '30px',
            height: '30px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            backgroundColor: '#fff',
            cursor: 'pointer'
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
            backgroundColor: '#fff',
            cursor: 'pointer'
          }}
        >
          +
        </button>
        
        <span style={{ 
          minWidth: '80px', 
          textAlign: 'right',
          fontWeight: 'bold'
        }}>
          €{(item.price * item.quantity).toFixed(2)}
        </span>
        
        <button
          onClick={handleRemove}
          style={{
            padding: '5px 10px',
            backgroundColor: '#dc3545',
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

// Componente principale del carrello
function AdvancedShoppingCart() {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    discount: 0
  });
  
  // Azioni del carrello
  const addItem = useCallback((item) => {
    dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: item });
  }, []);
  
  const removeItem = useCallback((id) => {
    dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: id });
  }, []);
  
  const updateQuantity = useCallback((id, quantity) => {
    dispatch({ type: CART_ACTIONS.UPDATE_QUANTITY, payload: { id, quantity } });
  }, []);
  
  const clearCart = useCallback(() => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  }, []);
  
  const applyDiscount = useCallback((discount) => {
    dispatch({ type: CART_ACTIONS.APPLY_DISCOUNT, payload: discount });
  }, []);
  
  const removeDiscount = useCallback(() => {
    dispatch({ type: CART_ACTIONS.REMOVE_DISCOUNT });
  }, []);
  
  // Stati derivati calcolati con useMemo
  const subtotal = useMemo(() => {
    return state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [state.items]);
  
  const discountAmount = useMemo(() => {
    return subtotal * (state.discount / 100);
  }, [subtotal, state.discount]);
  
  const total = useMemo(() => {
    return subtotal - discountAmount;
  }, [subtotal, discountAmount]);
  
  const itemCount = useMemo(() => {
    return state.items.reduce((sum, item) => sum + item.quantity, 0);
  }, [state.items]);
  
  const isEmpty = useMemo(() => {
    return state.items.length === 0;
  }, [state.items]);
  
  const hasDiscount = useMemo(() => {
    return state.discount > 0;
  }, [state.discount]);
  
  // Prodotti di esempio
  const sampleProducts = [
    { id: 1, name: 'Laptop Gaming', price: 1299.99, category: 'Electronics' },
    { id: 2, name: 'Mouse Wireless', price: 29.99, category: 'Electronics' },
    { id: 3, name: 'Tastiera Meccanica', price: 89.99, category: 'Electronics' },
    { id: 4, name: 'Monitor 4K', price: 399.99, category: 'Electronics' },
    { id: 5, name: 'Cuffie Bluetooth', price: 79.99, category: 'Electronics' }
  ];
  
  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ccc', 
      borderRadius: '8px',
      maxWidth: '800px',
      margin: '20px auto',
      backgroundColor: '#fff'
    }}>
      <h2>🛒 Shopping Cart Avanzato</h2>
      
      {/* Sezione prodotti */}
      <div style={{ marginBottom: '30px' }}>
        <h3>Aggiungi Prodotti</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {sampleProducts.map(product => (
            <button
              key={product.id}
              onClick={() => addItem(product)}
              style={{
                padding: '10px 15px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              {product.name} - €{product.price}
            </button>
          ))}
        </div>
      </div>
      
      {/* Sezione carrello */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '15px'
        }}>
          <h3>Carrello ({itemCount} articoli)</h3>
          {!isEmpty && (
            <button
              onClick={clearCart}
              style={{
                padding: '8px 16px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Svuota Carrello
            </button>
          )}
        </div>
        
        {isEmpty ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            color: '#666',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px'
          }}>
            <p>Il carrello è vuoto</p>
            <p>Aggiungi alcuni prodotti per iniziare!</p>
          </div>
        ) : (
          <div>
            {state.items.map(item => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Sezione sconti */}
      {!isEmpty && (
        <div style={{ 
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px'
        }}>
          <h4>Sconti</h4>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              onClick={() => applyDiscount(10)}
              disabled={hasDiscount}
              style={{
                padding: '8px 16px',
                backgroundColor: hasDiscount ? '#6c757d' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: hasDiscount ? 'not-allowed' : 'pointer'
              }}
            >
              Sconto 10%
            </button>
            <button
              onClick={() => applyDiscount(20)}
              disabled={hasDiscount}
              style={{
                padding: '8px 16px',
                backgroundColor: hasDiscount ? '#6c757d' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: hasDiscount ? 'not-allowed' : 'pointer'
              }}
            >
              Sconto 20%
            </button>
            {hasDiscount && (
              <button
                onClick={removeDiscount}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#ffc107',
                  color: 'black',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Rimuovi Sconto
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Riepilogo ordine */}
      {!isEmpty && (
        <div style={{ 
          padding: '20px',
          backgroundColor: '#e9ecef',
          borderRadius: '8px',
          border: '2px solid #007bff'
        }}>
          <h3>Riepilogo Ordine</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span>Subtotale:</span>
            <span>€{subtotal.toFixed(2)}</span>
          </div>
          
          {hasDiscount && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span>Sconto ({state.discount}%):</span>
              <span style={{ color: '#28a745' }}>-€{discountAmount.toFixed(2)}</span>
            </div>
          )}
          
          <hr style={{ margin: '10px 0' }} />
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            fontSize: '1.2rem',
            fontWeight: 'bold'
          }}>
            <span>Totale:</span>
            <span>€{total.toFixed(2)}</span>
          </div>
          
          <button
            style={{
              width: '100%',
              padding: '15px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              marginTop: '15px'
            }}
          >
            Procedi al Checkout
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
            {JSON.stringify({ state, subtotal, discountAmount, total, itemCount }, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}

export default AdvancedShoppingCart;
