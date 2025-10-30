import { useReducer, useState, useCallback } from 'react'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

interface CartAction {
  type: 'ADD_ITEM' | 'REMOVE_ITEM' | 'CLEAR_CART'
  payload?: CartItem | number
}

interface ValidationRule {
  test: (value: string) => boolean
  message: string
}

interface ValidationRules {
  [key: string]: ValidationRule
}

interface FormValues {
  [key: string]: string
}

interface FormErrors {
  [key: string]: string
}

interface UseFormValidationReturn {
  values: FormValues
  errors: FormErrors
  handleChange: (fieldName: string, value: string) => void
  validate: (fieldName: string, value: string) => boolean
}

// Reducer per carrello shopping
function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'ADD_ITEM': {
      const item = action.payload as CartItem
      const existing = state.find(i => i.id === item.id)
      if (existing) {
        return state.map(i =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...state, { ...item, quantity: 1 }]
    }
    
    case 'REMOVE_ITEM':
      return state.filter(i => i.id !== action.payload)
    
    case 'CLEAR_CART':
      return []
    
    default:
      return state
  }
}

// Hook personalizzato per validazione form
function useFormValidation(
  initialValues: FormValues,
  validationRules: ValidationRules
): UseFormValidationReturn {
  const [values, setValues] = useState<FormValues>(initialValues)
  const [errors, setErrors] = useState<FormErrors>({})

  const validate = useCallback((fieldName: string, value: string): boolean => {
    const rule = validationRules[fieldName]
    if (rule && !rule.test(value)) {
      setErrors(prev => ({ ...prev, [fieldName]: rule.message }))
      return false
    } else {
      setErrors(prev => ({ ...prev, [fieldName]: '' }))
      return true
    }
  }, [validationRules])

  const handleChange = useCallback((fieldName: string, value: string) => {
    setValues(prev => ({ ...prev, [fieldName]: value }))
    validate(fieldName, value)
  }, [validate])

  return { values, errors, handleChange, validate }
}

export default function Demo09() {
  const [cart, dispatch] = useReducer(cartReducer, [])
  
  const { values, errors, handleChange } = useFormValidation(
    { email: '', password: '' },
    {
      email: { test: (v) => /\S+@\S+\.\S+/.test(v), message: 'Email non valida' },
      password: { test: (v) => v.length >= 6, message: 'Password troppo corta' }
    }
  )

  const products: CartItem[] = [
    { id: 1, name: 'Laptop', price: 999, quantity: 0 },
    { id: 2, name: 'Mouse', price: 25, quantity: 0 },
    { id: 3, name: 'Tastiera', price: 75, quantity: 0 }
  ]

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

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
  )
}

