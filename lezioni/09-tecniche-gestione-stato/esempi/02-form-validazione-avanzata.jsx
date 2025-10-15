import React, { useState, useCallback, useMemo } from 'react';

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

// Hook personalizzato per validazione form
function useFormValidation(initialValues, validationRules) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  const validateField = useCallback((name, value) => {
    const rule = validationRules[name];
    if (!rule) return '';
    
    if (rule.required && (!value || value.trim() === '')) {
      return rule.required;
    }
    
    if (rule.minLength && value.length < rule.minLength) {
      return rule.minLength;
    }
    
    if (rule.maxLength && value.length > rule.maxLength) {
      return rule.maxLength;
    }
    
    if (rule.pattern && !rule.pattern.test(value)) {
      return rule.pattern;
    }
    
    if (rule.custom && !rule.custom(value)) {
      return rule.custom;
    }
    
    return '';
  }, [validationRules]);
  
  const validateAll = useCallback(() => {
    const newErrors = {};
    Object.keys(validationRules).forEach(name => {
      const error = validateField(name, getNestedValue(values, name));
      if (error) newErrors[name] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, validationRules, validateField]);
  
  const setValue = useCallback((name, value) => {
    setValues(prev => setNestedValue(prev, name, value));
    
    // Validazione in tempo reale
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [touched, validateField]);
  
  const setTouched = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const value = getNestedValue(values, name);
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [values, validateField]);
  
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);
  
  // Stati derivati
  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0 && 
           Object.keys(validationRules).every(name => {
             const value = getNestedValue(values, name);
             return value && value.toString().trim() !== '';
           });
  }, [errors, values, validationRules]);
  
  const hasErrors = useMemo(() => {
    return Object.keys(errors).length > 0;
  }, [errors]);
  
  const isTouched = useCallback((name) => {
    return touched[name] || false;
  }, [touched]);
  
  return {
    values,
    errors,
    touched,
    setValue,
    setTouched,
    validateAll,
    reset,
    isValid,
    hasErrors,
    isTouched
  };
}

// Utility functions per gestire valori annidati
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

function setNestedValue(obj, path, value) {
  const keys = path.split('.');
  const result = { ...obj };
  let current = result;
  
  for (let i = 0; i < keys.length - 1; i++) {
    current[keys[i]] = { ...current[keys[i]] };
    current = current[keys[i]];
  }
  
  current[keys[keys.length - 1]] = value;
  return result;
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
  setTouched,
  options = null 
}) {
  const value = getNestedValue(values, name);
  const error = errors[name];
  const isTouched = touched[name];
  
  const handleChange = (e) => {
    setValue(name, e.target.value);
  };
  
  const handleBlur = () => {
    setTouched(name);
  };
  
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
            border: `1px solid ${error && isTouched ? '#dc3545' : '#ddd'}`,
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
            border: `1px solid ${error && isTouched ? '#dc3545' : '#ddd'}`,
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
            border: `1px solid ${error && isTouched ? '#dc3545' : '#ddd'}`,
            borderRadius: '4px',
            fontSize: '16px',
            boxSizing: 'border-box'
          }}
        />
      )}
      
      {error && isTouched && (
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
  );
}

// Componente principale del form
function AdvancedForm() {
  const initialValues = {
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
  };
  
  const validationRules = {
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
      custom: (value) => {
        const date = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - date.getFullYear();
        return age >= 18 ? '' : 'Devi essere maggiorenne';
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
  };
  
  const {
    values,
    errors,
    touched,
    setValue,
    setTouched,
    validateAll,
    reset,
    isValid,
    hasErrors,
    isTouched
  } = useFormValidation(initialValues, validationRules);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateAll()) {
      setIsSubmitting(true);
      try {
        // Simula invio del form
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 3000);
      } catch (error) {
        console.error('Errore nell\'invio:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  const handleReset = () => {
    reset();
    setIsSubmitted(false);
  };
  
  // Opzioni per i select
  const countryOptions = [
    { value: 'IT', label: 'Italia' },
    { value: 'FR', label: 'Francia' },
    { value: 'DE', label: 'Germania' },
    { value: 'ES', label: 'Spagna' },
    { value: 'UK', label: 'Regno Unito' }
  ];
  
  const regionOptions = [
    { value: 'LOM', label: 'Lombardia' },
    { value: 'LAZ', label: 'Lazio' },
    { value: 'CAM', label: 'Campania' },
    { value: 'SIC', label: 'Sicilia' },
    { value: 'VEN', label: 'Veneto' }
  ];
  
  const themeOptions = [
    { value: 'light', label: 'Chiaro' },
    { value: 'dark', label: 'Scuro' },
    { value: 'auto', label: 'Automatico' }
  ];
  
  const languageOptions = [
    { value: 'it', label: 'Italiano' },
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' }
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
              setTouched={setTouched}
            />
            
            <FormField
              name="personalInfo.lastName"
              label="Cognome *"
              placeholder="Il tuo cognome"
              values={values}
              errors={errors}
              touched={touched}
              setValue={setValue}
              setTouched={setTouched}
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
              setTouched={setTouched}
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
              setTouched={setTouched}
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
            setTouched={setTouched}
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
            setTouched={setTouched}
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
              setTouched={setTouched}
            />
            
            <FormField
              name="address.zipCode"
              label="CAP *"
              placeholder="20100"
              values={values}
              errors={errors}
              touched={touched}
              setValue={setValue}
              setTouched={setTouched}
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
              setTouched={setTouched}
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
              setTouched={setTouched}
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
              setTouched={setTouched}
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
              setTouched={setTouched}
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
            setTouched={setTouched}
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
            setTouched={setTouched}
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
              setTouched={setTouched}
            />
            
            <FormField
              name="additionalInfo.socialMedia.linkedin"
              label="LinkedIn"
              placeholder="linkedin.com/in/tuousername"
              values={values}
              errors={errors}
              touched={touched}
              setValue={setValue}
              setTouched={setTouched}
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
  );
}

export default AdvancedForm;
