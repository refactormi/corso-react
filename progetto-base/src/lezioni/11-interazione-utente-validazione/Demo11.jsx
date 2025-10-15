import { useState } from 'react';

// Hook personalizzato per gestione form
function useForm(initialValues, validationRules) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = (name, value) => {
    const rule = validationRules[name];
    if (!rule) return '';
    
    if (rule.required && (!value || value.toString().trim() === '')) {
      return rule.required;
    }
    
    if (value && rule.pattern && !rule.pattern.test(value)) {
      return rule.patternMessage || 'Formato non valido';
    }
    
    if (value && rule.minLength && value.length < rule.minLength) {
      return `Minimo ${rule.minLength} caratteri`;
    }
    
    if (value && rule.custom && !rule.custom(value)) {
      return rule.customMessage || 'Valore non valido';
    }
    
    return '';
  };

  const handleChange = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const error = validate(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validate(name, values[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateAll = () => {
    const newErrors = {};
    let isValid = true;
    
    Object.keys(validationRules).forEach(name => {
      const error = validate(name, values[name]);
      newErrors[name] = error;
      if (error) isValid = false;
    });
    
    setErrors(newErrors);
    setTouched(Object.keys(validationRules).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    return isValid;
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    reset: () => {
      setValues(initialValues);
      setErrors({});
      setTouched({});
    }
  };
}

// Componente Input riutilizzabile
function FormInput({ 
  label, 
  name, 
  type = 'text', 
  value, 
  error, 
  touched, 
  onChange, 
  onBlur, 
  placeholder,
  required 
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', marginBottom: 4, fontWeight: '600' }}>
        {label} {required && <span style={{ color: 'red' }}>*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        onBlur={() => onBlur(name)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '8px 12px',
          border: `1px solid ${error && touched ? '#dc3545' : '#ddd'}`,
          borderRadius: 4,
          fontSize: 14
        }}
      />
      {error && touched && (
        <div style={{ color: '#dc3545', fontSize: 12, marginTop: 4 }}>
          {error}
        </div>
      )}
    </div>
  );
}

// Form di registrazione
function RegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const { values, errors, touched, handleChange, handleBlur, validateAll, reset } = useForm(
    {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      age: '',
      terms: false
    },
    {
      firstName: {
        required: 'Nome è obbligatorio',
        minLength: 2
      },
      lastName: {
        required: 'Cognome è obbligatorio',
        minLength: 2
      },
      email: {
        required: 'Email è obbligatoria',
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        patternMessage: 'Email non valida'
      },
      password: {
        required: 'Password è obbligatoria',
        minLength: 6,
        custom: (value) => /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value),
        customMessage: 'Password deve contenere maiuscola, minuscola e numero'
      },
      confirmPassword: {
        required: 'Conferma password è obbligatoria',
        custom: (value) => value === values.password,
        customMessage: 'Le password non coincidono'
      },
      age: {
        required: 'Età è obbligatoria',
        custom: (value) => parseInt(value) >= 18,
        customMessage: 'Devi essere maggiorenne'
      },
      terms: {
        required: 'Devi accettare i termini',
        custom: (value) => value === true,
        customMessage: 'Accetta i termini per continuare'
      }
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateAll()) {
      setSubmitMessage('Correggi gli errori nel form');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    // Simula chiamata API
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitMessage('Registrazione completata con successo! 🎉');
      reset();
    }, 2000);
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: 20, borderRadius: 8, maxWidth: 500 }}>
      <h4>Form di Registrazione</h4>
      
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <FormInput
            label="Nome"
            name="firstName"
            value={values.firstName}
            error={errors.firstName}
            touched={touched.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Inserisci il nome"
            required
          />
          
          <FormInput
            label="Cognome"
            name="lastName"
            value={values.lastName}
            error={errors.lastName}
            touched={touched.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Inserisci il cognome"
            required
          />
        </div>

        <FormInput
          label="Email"
          name="email"
          type="email"
          value={values.email}
          error={errors.email}
          touched={touched.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="esempio@email.com"
          required
        />

        <FormInput
          label="Password"
          name="password"
          type="password"
          value={values.password}
          error={errors.password}
          touched={touched.password}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Minimo 6 caratteri"
          required
        />

        <FormInput
          label="Conferma Password"
          name="confirmPassword"
          type="password"
          value={values.confirmPassword}
          error={errors.confirmPassword}
          touched={touched.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Ripeti la password"
          required
        />

        <FormInput
          label="Età"
          name="age"
          type="number"
          value={values.age}
          error={errors.age}
          touched={touched.age}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Inserisci la tua età"
          required
        />

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              checked={values.terms}
              onChange={(e) => handleChange('terms', e.target.checked)}
              onBlur={() => handleBlur('terms')}
            />
            <span>Accetto i termini e condizioni *</span>
          </label>
          {errors.terms && touched.terms && (
            <div style={{ color: '#dc3545', fontSize: 12, marginTop: 4 }}>
              {errors.terms}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: isSubmitting ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            fontSize: 16,
            cursor: isSubmitting ? 'not-allowed' : 'pointer'
          }}
        >
          {isSubmitting ? 'Registrazione in corso...' : 'Registrati'}
        </button>

        {submitMessage && (
          <div style={{
            marginTop: 16,
            padding: 12,
            backgroundColor: submitMessage.includes('successo') ? '#d4edda' : '#f8d7da',
            color: submitMessage.includes('successo') ? '#155724' : '#721c24',
            borderRadius: 4,
            textAlign: 'center'
          }}>
            {submitMessage}
          </div>
        )}
      </form>
    </div>
  );
}

// Componente per gestione eventi
function EventHandlingDemo() {
  const [events, setEvents] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const addEvent = (eventType, details = '') => {
    const timestamp = new Date().toLocaleTimeString();
    setEvents(prev => [...prev.slice(-9), { type: eventType, details, timestamp }]);
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: 16, borderRadius: 8 }}>
      <h4>Gestione Eventi</h4>
      
      <div
        style={{
          height: 100,
          backgroundColor: '#f8f9fa',
          border: '1px dashed #ccc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 12,
          cursor: 'pointer'
        }}
        onClick={() => addEvent('click', 'Area cliccata')}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          setMousePos({ x, y });
        }}
        onMouseEnter={() => addEvent('mouseenter', 'Mouse entrato')}
        onMouseLeave={() => addEvent('mouseleave', 'Mouse uscito')}
      >
        <div>
          Clicca o muovi il mouse qui
          <br />
          <small>Posizione: ({mousePos.x}, {mousePos.y})</small>
        </div>
      </div>

      <div style={{ height: 150, overflow: 'auto', backgroundColor: '#f8f9fa', padding: 8, borderRadius: 4 }}>
        <h5>Log Eventi:</h5>
        {events.length === 0 ? (
          <p>Nessun evento registrato</p>
        ) : (
          events.map((event, index) => (
            <div key={index} style={{ fontSize: 12, marginBottom: 4 }}>
              <strong>{event.timestamp}</strong> - {event.type}: {event.details}
            </div>
          ))
        )}
      </div>
      
      <button 
        onClick={() => setEvents([])} 
        style={{ marginTop: 8, padding: '4px 8px', fontSize: 12 }}
      >
        Pulisci Log
      </button>
    </div>
  );
}

export default function Demo11() {
  return (
    <div style={{ padding: 12 }}>
      <h3>Lezione 11: Interazione Utente e Validazione</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <RegistrationForm />
        <EventHandlingDemo />
      </div>
    </div>
  );
}
