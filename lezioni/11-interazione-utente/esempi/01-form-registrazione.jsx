import React, { useState, useCallback } from 'react';

/**
 * Esempio 1: Form di Registrazione Completo
 * 
 * Questo esempio dimostra:
 * - Form handling avanzato con validazione in tempo reale
 * - Gestione stati di loading e feedback visivo
 * - Validazione complessa con regole multiple
 * - Gestione errori e successo
 * - Input controllati con diversi tipi
 */

function RegistrationForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    address: {
      street: '',
      city: '',
      zipCode: '',
      country: 'IT'
    },
    preferences: {
      newsletter: false,
      notifications: true,
      theme: 'light'
    },
    terms: false
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const totalSteps = 3;
  
  const validateField = useCallback((name, value) => {
    const validations = {
      firstName: value.length < 2 ? 'Nome deve essere di almeno 2 caratteri' : '',
      lastName: value.length < 2 ? 'Cognome deve essere di almeno 2 caratteri' : '',
      email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Email non valida' : '',
      password: value.length < 8 ? 'Password deve essere di almeno 8 caratteri' : 
                !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value) ? 'Password deve contenere maiuscole, minuscole e numeri' : '',
      confirmPassword: value !== formData.password ? 'Le password non coincidono' : '',
      dateOfBirth: !value ? 'Data di nascita richiesta' : 
                   new Date(value) > new Date() ? 'Data di nascita non può essere futura' : '',
      gender: !value ? 'Genere richiesto' : '',
      phone: value && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(value) ? 'Numero di telefono non valido' : '',
      'address.street': !value ? 'Indirizzo richiesto' : '',
      'address.city': !value ? 'Città richiesta' : '',
      'address.zipCode': !value ? 'CAP richiesto' : 
                        !/^\d{5}$/.test(value) ? 'CAP deve essere di 5 cifre' : '',
      terms: !value ? 'Devi accettare i termini e condizioni' : ''
    };
    return validations[name] || '';
  }, [formData.password]);
  
  const handleChange = useCallback((event) => {
    const { name, value, type, checked } = event.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => {
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: fieldValue
          }
        };
      }
      return { ...prev, [name]: fieldValue };
    });
    
    if (touched[name]) {
      const error = validateField(name, fieldValue);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [touched, validateField]);
  
  const handleBlur = useCallback((event) => {
    const { name, value, type, checked } = event.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, fieldValue);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [validateField]);
  
  const validateStep = (step) => {
    const stepFields = {
      1: ['firstName', 'lastName', 'email', 'password', 'confirmPassword'],
      2: ['dateOfBirth', 'gender', 'phone', 'address.street', 'address.city', 'address.zipCode'],
      3: ['terms']
    };
    
    const newErrors = {};
    stepFields[step].forEach(name => {
      const value = name.includes('.') ? 
        formData[name.split('.')[0]][name.split('.')[1]] : 
        formData[name];
      const error = validateField(name, value);
      if (error) newErrors[name] = error;
    });
    
    setErrors(prev => ({ ...prev, ...newErrors }));
    setTouched(prev => {
      const newTouched = { ...prev };
      stepFields[step].forEach(name => {
        newTouched[name] = true;
      });
      return newTouched;
    });
    
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };
  
  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (validateStep(currentStep)) {
      setLoading(true);
      try {
        // Simula chiamata API
        await new Promise(resolve => setTimeout(resolve, 2000));
        setSuccess(true);
      } catch (error) {
        console.error('Errore registrazione:', error);
        setErrors({ submit: 'Errore durante la registrazione. Riprova.' });
      } finally {
        setLoading(false);
      }
    }
  };
  
  const getFieldValue = (name) => {
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      return formData[parent][child];
    }
    return formData[name];
  };
  
  if (success) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '40px',
        backgroundColor: '#d4edda',
        borderRadius: '8px',
        border: '1px solid #c3e6cb'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>
        <h2 style={{ color: '#155724', marginBottom: '15px' }}>Registrazione Completata!</h2>
        <p style={{ color: '#155724', fontSize: '18px' }}>
          Benvenuto {formData.firstName}! La tua registrazione è stata completata con successo.
        </p>
        <p style={{ color: '#155724', marginTop: '10px' }}>
          Ti abbiamo inviato una email di conferma all'indirizzo {formData.email}
        </p>
      </div>
    );
  }
  
  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: '0 auto', 
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '10px', color: '#333' }}>
          📝 Registrazione Utente
        </h2>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          {Array.from({ length: totalSteps }, (_, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: i + 1 <= currentStep ? '#007bff' : '#e9ecef',
                color: i + 1 <= currentStep ? 'white' : '#6c757d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                {i + 1}
              </div>
              {i < totalSteps - 1 && (
                <div style={{
                  width: '50px',
                  height: '2px',
                  backgroundColor: i + 1 < currentStep ? '#007bff' : '#e9ecef',
                  margin: '0 10px'
                }} />
              )}
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', color: '#666', margin: 0 }}>
          Step {currentStep} di {totalSteps}
        </p>
      </div>
      
      {errors.submit && (
        <div style={{
          padding: '15px',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          marginBottom: '20px',
          color: '#721c24'
        }}>
          ❌ {errors.submit}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Step 1: Informazioni Personali */}
        {currentStep === 1 && (
          <div>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>👤 Informazioni Personali</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Nome *"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `1px solid ${errors.firstName ? '#dc3545' : '#ddd'}`,
                    borderRadius: '6px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                />
                {errors.firstName && <span style={{color: '#dc3545', fontSize: '14px'}}>{errors.firstName}</span>}
              </div>
              
              <div>
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Cognome *"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `1px solid ${errors.lastName ? '#dc3545' : '#ddd'}`,
                    borderRadius: '6px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                />
                {errors.lastName && <span style={{color: '#dc3545', fontSize: '14px'}}>{errors.lastName}</span>}
              </div>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Email *"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `1px solid ${errors.email ? '#dc3545' : '#ddd'}`,
                  borderRadius: '6px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
              />
              {errors.email && <span style={{color: '#dc3545', fontSize: '14px'}}>{errors.email}</span>}
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Password *"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `1px solid ${errors.password ? '#dc3545' : '#ddd'}`,
                    borderRadius: '6px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                />
                {errors.password && <span style={{color: '#dc3545', fontSize: '14px'}}>{errors.password}</span>}
              </div>
              
              <div>
                <input
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Conferma Password *"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `1px solid ${errors.confirmPassword ? '#dc3545' : '#ddd'}`,
                    borderRadius: '6px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                />
                {errors.confirmPassword && <span style={{color: '#dc3545', fontSize: '14px'}}>{errors.confirmPassword}</span>}
              </div>
            </div>
          </div>
        )}
        
        {/* Step 2: Informazioni Aggiuntive */}
        {currentStep === 2 && (
          <div>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>📋 Informazioni Aggiuntive</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <input
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `1px solid ${errors.dateOfBirth ? '#dc3545' : '#ddd'}`,
                    borderRadius: '6px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                />
                {errors.dateOfBirth && <span style={{color: '#dc3545', fontSize: '14px'}}>{errors.dateOfBirth}</span>}
              </div>
              
              <div>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `1px solid ${errors.gender ? '#dc3545' : '#ddd'}`,
                    borderRadius: '6px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="">Seleziona genere *</option>
                  <option value="male">Maschio</option>
                  <option value="female">Femmina</option>
                  <option value="other">Altro</option>
                </select>
                {errors.gender && <span style={{color: '#dc3545', fontSize: '14px'}}>{errors.gender}</span>}
              </div>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Telefono (opzionale)"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `1px solid ${errors.phone ? '#dc3545' : '#ddd'}`,
                  borderRadius: '6px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
              />
              {errors.phone && <span style={{color: '#dc3545', fontSize: '14px'}}>{errors.phone}</span>}
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <input
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Indirizzo *"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `1px solid ${errors['address.street'] ? '#dc3545' : '#ddd'}`,
                  borderRadius: '6px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
              />
              {errors['address.street'] && <span style={{color: '#dc3545', fontSize: '14px'}}>{errors['address.street']}</span>}
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <input
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Città *"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `1px solid ${errors['address.city'] ? '#dc3545' : '#ddd'}`,
                    borderRadius: '6px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                />
                {errors['address.city'] && <span style={{color: '#dc3545', fontSize: '14px'}}>{errors['address.city']}</span>}
              </div>
              
              <div>
                <input
                  name="address.zipCode"
                  value={formData.address.zipCode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="CAP *"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `1px solid ${errors['address.zipCode'] ? '#dc3545' : '#ddd'}`,
                    borderRadius: '6px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                />
                {errors['address.zipCode'] && <span style={{color: '#dc3545', fontSize: '14px'}}>{errors['address.zipCode']}</span>}
              </div>
            </div>
          </div>
        )}
        
        {/* Step 3: Preferenze e Termini */}
        {currentStep === 3 && (
          <div>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>⚙️ Preferenze e Termini</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ marginBottom: '15px', color: '#555' }}>Preferenze</h4>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    name="preferences.newsletter"
                    type="checkbox"
                    checked={formData.preferences.newsletter}
                    onChange={handleChange}
                    style={{ marginRight: '10px' }}
                  />
                  <span>Iscrivimi alla newsletter per ricevere aggiornamenti</span>
                </label>
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    name="preferences.notifications"
                    type="checkbox"
                    checked={formData.preferences.notifications}
                    onChange={handleChange}
                    style={{ marginRight: '10px' }}
                  />
                  <span>Abilita notifiche push</span>
                </label>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  Tema preferito:
                </label>
                <select
                  name="preferences.theme"
                  value={formData.preferences.theme}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="light">Chiaro</option>
                  <option value="dark">Scuro</option>
                  <option value="auto">Automatico</option>
                </select>
              </div>
            </div>
            
            <div style={{ 
              marginBottom: '20px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              border: '1px solid #dee2e6'
            }}>
              <h4 style={{ marginBottom: '10px', color: '#555' }}>Termini e Condizioni</h4>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
                Accettando i termini e condizioni, confermi di aver letto e compreso la nostra 
                <a href="#" style={{ color: '#007bff' }}> Privacy Policy</a> e i 
                <a href="#" style={{ color: '#007bff' }}> Termini di Servizio</a>.
              </p>
              
              <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer' }}>
                <input
                  name="terms"
                  type="checkbox"
                  checked={formData.terms}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{ marginRight: '10px', marginTop: '2px' }}
                />
                <span>Accetto i termini e condizioni *</span>
              </label>
              {errors.terms && <span style={{color: '#dc3545', fontSize: '14px', display: 'block', marginTop: '5px'}}>{errors.terms}</span>}
            </div>
          </div>
        )}
        
        {/* Pulsanti di navigazione */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginTop: '30px',
          paddingTop: '20px',
          borderTop: '1px solid #eee'
        }}>
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            style={{
              padding: '12px 24px',
              backgroundColor: currentStep === 1 ? '#6c757d' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              opacity: currentStep === 1 ? 0.5 : 1
            }}
          >
            ← Indietro
          </button>
          
          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={handleNext}
              style={{
                padding: '12px 24px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Avanti →
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '12px 24px',
                backgroundColor: loading ? '#6c757d' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? (
                <>
                  <span style={{
                    display: 'inline-block',
                    width: '16px',
                    height: '16px',
                    border: '2px solid #f3f3f3',
                    borderTop: '2px solid #fff',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginRight: '8px'
                  }} />
                  Registrazione in corso...
                </>
              ) : (
                '✅ Completa Registrazione'
              )}
            </button>
          )}
        </div>
      </form>
      
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

export default RegistrationForm;
