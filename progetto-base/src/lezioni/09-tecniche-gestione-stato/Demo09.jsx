import { useReducer, useState } from 'react';

// Reducer per carrello shopping
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.find(item => item.id === action.payload.id);
      if (existing) {
        return state.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...state, { ...action.payload, quantity: 1 }];
    }
    
    case 'REMOVE_ITEM':
      return state.filter(item => item.id !== action.payload);
    
    case 'CLEAR_CART':
      return [];
    
    default:
      return state;
  }
}

// Hook personalizzato per validazione form
function useFormValidation(initialValues, validationRules) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const validate = (fieldName, value) => {
    const rule = validationRules[fieldName];
    if (rule && !rule.test(value)) {
      setErrors(prev => ({ ...prev, [fieldName]: rule.message }));
      return false;
    } else {
      setErrors(prev => ({ ...prev, [fieldName]: '' }));
      return true;
    }
  };

  const handleChange = (fieldName, value) => {
    setValues(prev => ({ ...prev, [fieldName]: value }));
    validate(fieldName, value);
  };

  return { values, errors, handleChange, validate };
}

export default function Demo09() {
  const [cart, dispatch] = useReducer(cartReducer, []);
  
  const { values, errors, handleChange } = useFormValidation(
    { email: '', password: '' },
    {
      email: { test: (v) => /\S+@\S+\.\S+/.test(v), message: 'Email non valida' },
      password: { test: (v) => v.length >= 6, message: 'Password troppo corta' }
    }
  );

  const products = [
    { id: 1, name: 'Laptop', price: 999 },
    { id: 2, name: 'Mouse', price: 25 },
    { id: 3, name: 'Tastiera', price: 75 }
  ];

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div style={{ padding: 12 }}>
      <h3>Lezione 09: Tecniche Gestione Stato</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* useReducer per carrello */}
        <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8 }}>
          <h4>Carrello (useReducer)</h4>
          <div style={{ marginBottom: 12 }}>
            {products.map(product => (
              <div key={product.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>{product.name} - €{product.price}</span>
                <button onClick={() => dispatch({ type: 'ADD_ITEM', payload: product })}>
                  Aggiungi
                </button>
              </div>
            ))}
          </div>
          
          <div style={{ borderTop: '1px solid #eee', paddingTop: 12 }}>
            <h5>Carrello ({cart.length} articoli)</h5>
            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span>{item.name} x{item.quantity}</span>
                <button onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}>
                  Rimuovi
                </button>
              </div>
            ))}
            <div style={{ fontWeight: 'bold', marginTop: 8 }}>
              Totale: €{total}
            </div>
            <button onClick={() => dispatch({ type: 'CLEAR_CART' })} style={{ marginTop: 8 }}>
              Svuota Carrello
            </button>
          </div>
        </div>

        {/* Hook personalizzato per validazione */}
        <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8 }}>
          <h4>Form con Hook Personalizzato</h4>
          <div style={{ marginBottom: 12 }}>
            <input
              type="email"
              placeholder="Email"
              value={values.email}
              onChange={(e) => handleChange('email', e.target.value)}
              style={{ width: '100%', marginBottom: 4 }}
            />
            {errors.email && <div style={{ color: 'red', fontSize: '12px' }}>{errors.email}</div>}
          </div>
          
          <div style={{ marginBottom: 12 }}>
            <input
              type="password"
              placeholder="Password"
              value={values.password}
              onChange={(e) => handleChange('password', e.target.value)}
              style={{ width: '100%', marginBottom: 4 }}
            />
            {errors.password && <div style={{ color: 'red', fontSize: '12px' }}>{errors.password}</div>}
          </div>
          
          <button 
            disabled={!values.email || !values.password || errors.email || errors.password}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: (!values.email || !values.password || errors.email || errors.password) ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: (!values.email || !values.password || errors.email || errors.password) ? 'not-allowed' : 'pointer'
            }}
          >
            Registrati
          </button>
        </div>
      </div>
    </div>
  );
}
