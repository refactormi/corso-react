import { useState, useCallback, useMemo } from 'react'

/**
 * Esempio 2: Form con Validazione Avanzata
 * 
 * Questo esempio dimostra:
 * - Hook personalizzato per validazione
 * - Gestione stato complesso con oggetti annidati
 * - Validazione in tempo reale
 * - Stati derivati per UI
 * - Pattern di aggiornamento immutabile
 */

interface ValidationRule {
  required?: string | boolean
  minLength?: number | string
  maxLength?: number | string
  pattern?: RegExp | string
  custom?: (value: any) => string | boolean
}

interface ValidationRules {
  [key: string]: ValidationRule
}

interface FormValues {
  [key: string]: any
}

interface FormErrors {
  [key: string]: string | undefined
}

interface FormTouched {
  [key: string]: boolean | undefined
}

interface UseFormValidationReturn {
  values: FormValues
  errors: FormErrors
  touched: FormTouched
  setValue: (name: string, value: any) => void
  markFieldTouched: (name: string) => void
  validateAll: () => boolean
  reset: () => void
  isValid: boolean
  hasErrors: boolean
  isTouched: (name: string) => boolean
}

interface FormFieldProps {
  name: string
  label: string
  type?: string
  placeholder?: string
  values: FormValues
  errors: FormErrors
  touched: FormTouched
  setValue: (name: string, value: any) => void
  markFieldTouched: (name: string) => void
  options?: Array<{ value: string; label: string }>
}

interface SelectOption {
  value: string
  label: string
}

// Utility functions per gestire valori annidati
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

function setNestedValue(obj: any, path: string, value: any): any {
  const keys = path.split('.')
  const result = { ...obj }
  let current = result
  
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) {
      current[keys[i]] = {}
    }
    current[keys[i]] = { ...current[keys[i]] }
    current = current[keys[i]]
  }
  
  current[keys[keys.length - 1]] = value
  return result
}

// Hook personalizzato per validazione form
function useFormValidation(
  initialValues: FormValues,
  validationRules: ValidationRules
): UseFormValidationReturn {
  const [values, setValues] = useState<FormValues>(initialValues)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouchedState] = useState<FormTouched>({})
  
  const validateField = useCallback((name: string, value: any): string => {
    const rule = validationRules[name]
    if (!rule) return ''
    
    if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return typeof rule.required === 'string' ? rule.required : 'Campo richiesto'
    }
    
    if (typeof value === 'string' && rule.minLength) {
      const minLength = typeof rule.minLength === 'number' ? rule.minLength : parseInt(rule.minLength.toString())
      if (value.length < minLength) {
        return typeof rule.minLength === 'string' ? rule.minLength : `Minimo ${minLength} caratteri`
      }
    }
    
    if (typeof value === 'string' && rule.maxLength) {
      const maxLength = typeof rule.maxLength === 'number' ? rule.maxLength : parseInt(rule.maxLength.toString())
      if (value.length > maxLength) {
        return typeof rule.maxLength === 'string' ? rule.maxLength : `Massimo ${maxLength} caratteri`
      }
    }
    
    if (typeof value === 'string' && rule.pattern) {
      const pattern = rule.pattern instanceof RegExp ? rule.pattern : new RegExp(rule.pattern.toString())
      if (!pattern.test(value)) {
        return 'Formato non valido'
      }
    }
    
    if (rule.custom) {
      const result = rule.custom(value)
      if (result === false || (typeof result === 'string' && result !== '')) {
        return typeof result === 'string' ? result : 'Valore non valido'
      }
    }
    
    return ''
  }, [validationRules])
  
  const validateAll = useCallback((): boolean => {
    const newErrors: FormErrors = {}
    Object.keys(validationRules).forEach(name => {
      const error = validateField(name, getNestedValue(values, name))
      if (error) newErrors[name] = error
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [values, validationRules, validateField])
  
  const setValue = useCallback((name: string, value: any) => {
    setValues(prev => setNestedValue(prev, name, value))
    
    // Validazione in tempo reale
    if (touched[name]) {
      const error = validateField(name, value)
      setErrors(prev => ({ ...prev, [name]: error }))
    }
  }, [touched, validateField])
  
  const markFieldTouched = useCallback((name: string) => {
    setTouchedState(prev => ({ ...prev, [name]: true }))
    const value = getNestedValue(values, name)
    const error = validateField(name, value)
    setErrors(prev => ({ ...prev, [name]: error }))
  }, [values, validateField])
  
  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouchedState({})
  }, [initialValues])
  
  // Stati derivati
  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0 && 
           Object.keys(validationRules).every(name => {
             const value = getNestedValue(values, name)
             return value && value.toString().trim() !== ''
           })
  }, [errors, values, validationRules])
  
  const hasErrors = useMemo(() => {
    return Object.keys(errors).length > 0
  }, [errors])
  
  const isTouched = useCallback((name: string): boolean => {
    return touched[name] || false
  }, [touched])
  
  return {
    values,
    errors,
    touched,
    setValue,
    markFieldTouched,
    validateAll,
    reset,
    isValid,
    hasErrors,
    isTouched
  }
}

// Componente per campo form con validazione
function FormField({ 
  name, 
  label, 
  type = 'text', 
  placeholder, 
  values, 
  errors, 
  touched, 
  setValue, 
  markFieldTouched,
  options = null 
}: FormFieldProps) {
  const value = getNestedValue(values, name)
  const error = errors[name]
  const isFieldTouched = touched[name]
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setValue(name, e.target.value)
  }
  
  const handleBlur = () => {
    markFieldTouched(name)
  }
  
  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ 
        display: 'block', 
        marginBottom: '5px', 
        fontWeight: 'bold',
        color: '#333'
      }}>
        {label}
      </label>
      
      {type === 'select' ? (
        <select
          value={value || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          style={{
            width: '100%',
            padding: '10px',
            border: `1px solid ${error && isFieldTouched ? '#dc3545' : '#ddd'}`,
            borderRadius: '4px',
            fontSize: '16px',
            boxSizing: 'border-box'
          }}
        >
          <option value="">Seleziona...</option>
          {options?.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          value={value || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          rows={4}
          style={{
            width: '100%',
            padding: '10px',
            border: `1px solid ${error && isFieldTouched ? '#dc3545' : '#ddd'}`,
            borderRadius: '4px',
            fontSize: '16px',
            boxSizing: 'border-box',
            resize: 'vertical'
          }}
        />
      ) : (
        <input
          type={type}
          value={value || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: '10px',
            border: `1px solid ${error && isFieldTouched ? '#dc3545' : '#ddd'}`,
            borderRadius: '4px',
            fontSize: '16px',
            boxSizing: 'border-box'
          }}
        />
      )}
      
      {error && isFieldTouched && (
        <span style={{ 
          color: '#dc3545', 
          fontSize: '14px',
          marginTop: '5px',
          display: 'block'
        }}>
          {error}
        </span>
      )}
    </div>
  )
}

// Componente principale del form
function AdvancedForm() {
  const initialValues: FormValues = {
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: ''
    },
    address: {
      street: '',
      city: '',
      zipCode: '',
      country: '',
      region: ''
    },
    preferences: {
      newsletter: false,
      notifications: true,
      theme: 'light',
      language: 'it'
    },
    additionalInfo: {
      bio: '',
      website: '',
      socialMedia: {
        twitter: '',
        linkedin: ''
      }
    }
  }
  
  const validationRules: ValidationRules = {
    'personalInfo.firstName': {
      required: 'Il nome è richiesto',
      minLength: 'Il nome deve essere di almeno 2 caratteri'
    },
    'personalInfo.lastName': {
      required: 'Il cognome è richiesto',
      minLength: 'Il cognome deve essere di almeno 2 caratteri'
    },
    'personalInfo.email': {
      required: 'L\'email è richiesta',
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    'personalInfo.phone': {
      pattern: /^[\+]?[0-9\s\-\(\)]{10,}$/
    },
    'personalInfo.dateOfBirth': {
      required: 'La data di nascita è richiesta',
      custom: (value: string) => {
        const date = new Date(value)
        const today = new Date()
        const age = today.getFullYear() - date.getFullYear()
        return age >= 18 ? '' : 'Devi essere maggiorenne'
      }
    },
    'address.street': {
      required: 'L\'indirizzo è richiesto'
    },
    'address.city': {
      required: 'La città è richiesta'
    },
    'address.zipCode': {
      required: 'Il CAP è richiesto',
      pattern: /^\d{5}$/
    },
    'address.country': {
      required: 'Il paese è richiesto'
    },
    'additionalInfo.bio': {
      maxLength: 'La biografia non può superare i 500 caratteri'
    },
    'additionalInfo.website': {
      pattern: /^https?:\/\/.+\..+/
    }
  }
  
  const {
    values,
    errors,
    touched,
    setValue,
    markFieldTouched,
    validateAll,
    reset,
    isValid,
    hasErrors,
    isTouched
  } = useFormValidation(initialValues, validationRules)
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (validateAll()) {
      setIsSubmitting(true)
      try {
        // Simula invio del form
        await new Promise(resolve => setTimeout(resolve, 2000))
        setIsSubmitted(true)
        setTimeout(() => setIsSubmitted(false), 3000)
      } catch (error) {
        console.error('Errore nell\'invio:', error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }
  
  const handleReset = () => {
    reset()
    setIsSubmitted(false)
  }
  
  // Opzioni per i select
  const countryOptions: SelectOption[] = [
    { value: 'IT', label: 'Italia' },
    { value: 'FR', label: 'Francia' },
    { value: 'DE', label: 'Germania' },
    { value: 'ES', label: 'Spagna' },
    { value: 'UK', label: 'Regno Unito' }
  ]
  
  const regionOptions: SelectOption[] = [
    { value: 'LOM', label: 'Lombardia' },
    { value: 'LAZ', label: 'Lazio' },
    { value: 'CAM', label: 'Campania' },
    { value: 'SIC', label: 'Sicilia' },
    { value: 'VEN', label: 'Veneto' }
  ]
  
  const themeOptions: SelectOption[] = [
    { value: 'light', label: 'Chiaro' },
    { value: 'dark', label: 'Scuro' },
    { value: 'auto', label: 'Automatico' }
  ]
  
  const languageOptions: SelectOption[] = [
    { value: 'it', label: 'Italiano' },
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' }
  ]
  
  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ccc', 
      borderRadius: '8px',
      maxWidth: '800px',
      margin: '20px auto',
      backgroundColor: '#fff'
    }}>
      <h2>📝 Form Avanzato con Validazione</h2>
      
      {isSubmitted && (
        <div style={{
          padding: '15px',
          backgroundColor: '#d4edda',
          border: '1px solid #c3e6cb',
          borderRadius: '4px',
          marginBottom: '20px',
          color: '#155724'
        }}>
          ✅ Form inviato con successo! I dati sono stati salvati.
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Informazioni Personali */}
        <fieldset style={{ 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          padding: '20px',
          marginBottom: '20px'
        }}>
          <legend style={{ 
            fontWeight: 'bold', 
            padding: '0 10px',
            color: '#007bff'
          }}>
            👤 Informazioni Personali
          </legend>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <FormField
              name="personalInfo.firstName"
              label="Nome *"
              placeholder="Il tuo nome"
              values={values}
              errors={errors}
              touched={touched}
              setValue={setValue}
              markFieldTouched={markFieldTouched}
            />
            
            <FormField
              name="personalInfo.lastName"
              label="Cognome *"
              placeholder="Il tuo cognome"
              values={values}
              errors={errors}
              touched={touched}
              setValue={setValue}
              markFieldTouched={markFieldTouched}
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <FormField
              name="personalInfo.email"
              label="Email *"
              type="email"
              placeholder="la.tua@email.com"
              values={values}
              errors={errors}
              touched={touched}
              setValue={setValue}
              markFieldTouched={markFieldTouched}
            />
            
            <FormField
              name="personalInfo.phone"
              label="Telefono"
              type="tel"
              placeholder="+39 123 456 7890"
              values={values}
              errors={errors}
              touched={touched}
              setValue={setValue}
              markFieldTouched={markFieldTouched}
            />
          </div>
          
          <FormField
            name="personalInfo.dateOfBirth"
            label="Data di Nascita *"
            type="date"
            values={values}
            errors={errors}
            touched={touched}
            setValue={setValue}
            markFieldTouched={markFieldTouched}
          />
        </fieldset>
        
        {/* Indirizzo */}
        <fieldset style={{ 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          padding: '20px',
          marginBottom: '20px'
        }}>
          <legend style={{ 
            fontWeight: 'bold', 
            padding: '0 10px',
            color: '#007bff'
          }}>
            🏠 Indirizzo
          </legend>
          
          <FormField
            name="address.street"
            label="Via/Indirizzo *"
            placeholder="Via Roma, 123"
            values={values}
            errors={errors}
            touched={touched}
            setValue={setValue}
            markFieldTouched={markFieldTouched}
          />
          
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
            <FormField
              name="address.city"
              label="Città *"
              placeholder="Milano"
              values={values}
              errors={errors}
              touched={touched}
              setValue={setValue}
              markFieldTouched={markFieldTouched}
            />
            
            <FormField
              name="address.zipCode"
              label="CAP *"
              placeholder="20100"
              values={values}
              errors={errors}
              touched={touched}
              setValue={setValue}
              markFieldTouched={markFieldTouched}
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <FormField
              name="address.country"
              label="Paese *"
              type="select"
              options={countryOptions}
              values={values}
              errors={errors}
              touched={touched}
              setValue={setValue}
              markFieldTouched={markFieldTouched}
            />
            
            <FormField
              name="address.region"
              label="Regione"
              type="select"
              options={regionOptions}
              values={values}
              errors={errors}
              touched={touched}
              setValue={setValue}
              markFieldTouched={markFieldTouched}
            />
          </div>
        </fieldset>
        
        {/* Preferenze */}
        <fieldset style={{ 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          padding: '20px',
          marginBottom: '20px'
        }}>
          <legend style={{ 
            fontWeight: 'bold', 
            padding: '0 10px',
            color: '#007bff'
          }}>
            ⚙️ Preferenze
          </legend>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <FormField
              name="preferences.theme"
              label="Tema"
              type="select"
              options={themeOptions}
              values={values}
              errors={errors}
              touched={touched}
              setValue={setValue}
              markFieldTouched={markFieldTouched}
            />
            
            <FormField
              name="preferences.language"
              label="Lingua"
              type="select"
              options={languageOptions}
              values={values}
              errors={errors}
              touched={touched}
              setValue={setValue}
              markFieldTouched={markFieldTouched}
            />
          </div>
          
          <div style={{ marginTop: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={values.preferences?.newsletter || false}
                onChange={(e) => setValue('preferences.newsletter', e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              Iscrivimi alla newsletter
            </label>
            
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginTop: '10px' }}>
              <input
                type="checkbox"
                checked={values.preferences?.notifications || false}
                onChange={(e) => setValue('preferences.notifications', e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              Abilita notifiche
            </label>
          </div>
        </fieldset>
        
        {/* Informazioni Aggiuntive */}
        <fieldset style={{ 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          padding: '20px',
          marginBottom: '20px'
        }}>
          <legend style={{ 
            fontWeight: 'bold', 
            padding: '0 10px',
            color: '#007bff'
          }}>
            ℹ️ Informazioni Aggiuntive
          </legend>
          
          <FormField
            name="additionalInfo.bio"
            label="Biografia"
            type="textarea"
            placeholder="Raccontaci qualcosa di te..."
            values={values}
            errors={errors}
            touched={touched}
            setValue={setValue}
            markFieldTouched={markFieldTouched}
          />
          
          <FormField
            name="additionalInfo.website"
            label="Sito Web"
            type="url"
            placeholder="https://www.tuosito.com"
            values={values}
            errors={errors}
            touched={touched}
            setValue={setValue}
            markFieldTouched={markFieldTouched}
          />
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <FormField
              name="additionalInfo.socialMedia.twitter"
              label="Twitter"
              placeholder="@tuousername"
              values={values}
              errors={errors}
              touched={touched}
              setValue={setValue}
              markFieldTouched={markFieldTouched}
            />
            
            <FormField
              name="additionalInfo.socialMedia.linkedin"
              label="LinkedIn"
              placeholder="linkedin.com/in/tuousername"
              values={values}
              errors={errors}
              touched={touched}
              setValue={setValue}
              markFieldTouched={markFieldTouched}
            />
          </div>
        </fieldset>
        
        {/* Pulsanti */}
        <div style={{ 
          display: 'flex', 
          gap: '15px', 
          justifyContent: 'flex-end',
          marginTop: '30px'
        }}>
          <button
            type="button"
            onClick={handleReset}
            disabled={isSubmitting}
            style={{
              padding: '12px 24px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              opacity: isSubmitting ? 0.6 : 1
            }}
          >
            Reset
          </button>
          
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            style={{
              padding: '12px 24px',
              backgroundColor: isValid && !isSubmitting ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isValid && !isSubmitting ? 'pointer' : 'not-allowed',
              fontSize: '16px',
              opacity: isValid && !isSubmitting ? 1 : 0.6
            }}
          >
            {isSubmitting ? 'Invio in corso...' : 'Salva Dati'}
          </button>
        </div>
        
        {/* Statistiche form */}
        <div style={{ 
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px',
          fontSize: '14px'
        }}>
          <strong>Stato del Form:</strong>
          <ul style={{ margin: '5px 0 0 20px' }}>
            <li>Validità: {isValid ? '✅ Valido' : '❌ Non valido'}</li>
            <li>Errori: {hasErrors ? `❌ ${Object.keys(errors).length} errori` : '✅ Nessun errore'}</li>
            <li>Campi toccati: {Object.keys(touched).length}</li>
          </ul>
        </div>
      </form>
      
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
            {JSON.stringify({ values, errors, touched, isValid, hasErrors }, null, 2)}
          </pre>
        </details>
      )}
    </div>
  )
}

export default AdvancedForm

