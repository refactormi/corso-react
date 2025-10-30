import { useState } from 'react'

/**
 * Esempio 3: Form con Validazione
 * 
 * Questo esempio dimostra:
 * - Gestione di stato complesso (oggetti)
 * - Validazione in tempo reale
 * - Gestione degli errori
 * - Stati di loading
 * - Pattern di aggiornamento immutabile
 */

interface FormData {
  name: string
  email: string
  phone: string
  message: string
  newsletter: boolean
}

interface FormErrors {
  name?: string
  email?: string
  phone?: string
  message?: string
}

function ContactForm() {
  // Stato per i dati del form
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
    newsletter: false
  })
  
  // Stato per gli errori di validazione
  const [errors, setErrors] = useState<FormErrors>({})
  
  // Stato per il caricamento
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  
  // Stato per il successo
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  
  // Funzione per aggiornare un campo del form
  const updateField = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Rimuovi l'errore quando l'utente inizia a digitare
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }
  
  // Funzione di validazione
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    // Validazione nome
    if (!formData.name.trim()) {
      newErrors.name = 'Il nome è richiesto'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Il nome deve essere di almeno 2 caratteri'
    }
    
    // Validazione email
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email è richiesta'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Inserisci un\'email valida'
    }
    
    // Validazione telefono (opzionale ma se inserito deve essere valido)
    if (formData.phone && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Inserisci un numero di telefono valido'
    }
    
    // Validazione messaggio
    if (!formData.message.trim()) {
      newErrors.message = 'Il messaggio è richiesto'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Il messaggio deve essere di almeno 10 caratteri'
    } else if (formData.message.trim().length > 500) {
      newErrors.message = 'Il messaggio non può superare i 500 caratteri'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  // Funzione per gestire l'invio del form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (validateForm()) {
      setIsSubmitting(true)
      
      try {
        // Simula l'invio del form (chiamata API)
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Reset del form
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
          newsletter: false
        })
        setErrors({})
        setIsSubmitted(true)
        
        // Nascondi il messaggio di successo dopo 3 secondi
        setTimeout(() => setIsSubmitted(false), 3000)
        
      } catch (error) {
        console.error('Errore nell\'invio del form:', error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }
  
  // Funzione per resettare il form
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: '',
      newsletter: false
    })
    setErrors({})
    setIsSubmitted(false)
  }
  
  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ccc', 
      borderRadius: '8px',
      maxWidth: '600px',
      margin: '20px auto',
      backgroundColor: '#f8f9fa'
    }}>
      <h2>Form di Contatto</h2>
      
      {isSubmitted && (
        <div style={{
          padding: '15px',
          backgroundColor: '#d4edda',
          border: '1px solid #c3e6cb',
          borderRadius: '4px',
          marginBottom: '20px',
          color: '#155724'
        }}>
          ✅ Form inviato con successo! Ti risponderemo presto.
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Campo Nome */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '5px', 
            fontWeight: 'bold' 
          }}>
            Nome *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="Il tuo nome"
            style={{
              width: '100%',
              padding: '10px',
              border: `1px solid ${errors.name ? '#dc3545' : '#ddd'}`,
              borderRadius: '4px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
          {errors.name && (
            <span style={{ color: '#dc3545', fontSize: '14px' }}>
              {errors.name}
            </span>
          )}
        </div>
        
        {/* Campo Email */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '5px', 
            fontWeight: 'bold' 
          }}>
            Email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder="la.tua@email.com"
            style={{
              width: '100%',
              padding: '10px',
              border: `1px solid ${errors.email ? '#dc3545' : '#ddd'}`,
              borderRadius: '4px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
          {errors.email && (
            <span style={{ color: '#dc3545', fontSize: '14px' }}>
              {errors.email}
            </span>
          )}
        </div>
        
        {/* Campo Telefono */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '5px', 
            fontWeight: 'bold' 
          }}>
            Telefono
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            placeholder="+39 123 456 7890"
            style={{
              width: '100%',
              padding: '10px',
              border: `1px solid ${errors.phone ? '#dc3545' : '#ddd'}`,
              borderRadius: '4px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
          {errors.phone && (
            <span style={{ color: '#dc3545', fontSize: '14px' }}>
              {errors.phone}
            </span>
          )}
        </div>
        
        {/* Campo Messaggio */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '5px', 
            fontWeight: 'bold' 
          }}>
            Messaggio *
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => updateField('message', e.target.value)}
            placeholder="Scrivi il tuo messaggio..."
            rows={4}
            style={{
              width: '100%',
              padding: '10px',
              border: `1px solid ${errors.message ? '#dc3545' : '#ddd'}`,
              borderRadius: '4px',
              fontSize: '16px',
              boxSizing: 'border-box',
              resize: 'vertical'
            }}
          />
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginTop: '5px' 
          }}>
            {errors.message && (
              <span style={{ color: '#dc3545', fontSize: '14px' }}>
                {errors.message}
              </span>
            )}
            <span style={{ 
              color: '#6c757d', 
              fontSize: '12px',
              marginLeft: 'auto'
            }}>
              {formData.message.length}/500 caratteri
            </span>
          </div>
        </div>
        
        {/* Checkbox Newsletter */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer' 
          }}>
            <input
              type="checkbox"
              checked={formData.newsletter}
              onChange={(e) => updateField('newsletter', e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            <span>Iscrivimi alla newsletter per ricevere aggiornamenti</span>
          </label>
        </div>
        
        {/* Pulsanti */}
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          justifyContent: 'flex-end' 
        }}>
          <button
            type="button"
            onClick={resetForm}
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
            disabled={isSubmitting}
            style={{
              padding: '12px 24px',
              backgroundColor: isSubmitting ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              opacity: isSubmitting ? 0.6 : 1
            }}
          >
            {isSubmitting ? 'Invio in corso...' : 'Invia Messaggio'}
          </button>
        </div>
      </form>
      
      {/* Debug info (solo in sviluppo) */}
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
            {JSON.stringify({ formData, errors, isSubmitting, isSubmitted }, null, 2)}
          </pre>
        </details>
      )}
    </div>
  )
}

export default ContactForm

