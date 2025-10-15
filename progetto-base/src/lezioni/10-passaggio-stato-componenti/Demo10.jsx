import { createContext, useContext, useState } from 'react';

// Context per tema globale
const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function ThemedButton() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  return (
    <button
      onClick={toggleTheme}
      style={{
        backgroundColor: theme === 'light' ? '#fff' : '#333',
        color: theme === 'light' ? '#333' : '#fff',
        border: `1px solid ${theme === 'light' ? '#333' : '#fff'}`,
        padding: '8px 16px',
        borderRadius: 4,
        cursor: 'pointer'
      }}
    >
      Tema: {theme} (clicca per cambiare)
    </button>
  );
}

// Componenti per lifting state up
function TemperatureInput({ scale, temperature, onTemperatureChange }) {
  const scaleNames = { c: 'Celsius', f: 'Fahrenheit' };
  
  return (
    <div style={{ marginBottom: 12 }}>
      <label>Temperatura in {scaleNames[scale]}:</label>
      <input
        value={temperature}
        onChange={(e) => onTemperatureChange(e.target.value)}
        style={{ marginLeft: 8, padding: 4 }}
      />
    </div>
  );
}

function BoilingVerdict({ celsius }) {
  if (celsius >= 100) {
    return <p style={{ color: 'red' }}>L'acqua bollirebbe! 🔥</p>;
  }
  return <p style={{ color: 'blue' }}>L'acqua non bollirebbe. ❄️</p>;
}

function toCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5 / 9;
}

function toFahrenheit(celsius) {
  return (celsius * 9 / 5) + 32;
}

function tryConvert(temperature, convert) {
  const input = parseFloat(temperature);
  if (Number.isNaN(input)) {
    return '';
  }
  const output = convert(input);
  const rounded = Math.round(output * 1000) / 1000;
  return rounded.toString();
}

function Calculator() {
  const [temperature, setTemperature] = useState('');
  const [scale, setScale] = useState('c');

  const handleCelsiusChange = (temperature) => {
    setScale('c');
    setTemperature(temperature);
  };

  const handleFahrenheitChange = (temperature) => {
    setScale('f');
    setTemperature(temperature);
  };

  const celsius = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature;
  const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature;

  return (
    <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8 }}>
      <h4>Calcolatore Temperatura (Lifting State Up)</h4>
      <TemperatureInput
        scale="c"
        temperature={celsius}
        onTemperatureChange={handleCelsiusChange}
      />
      <TemperatureInput
        scale="f"
        temperature={fahrenheit}
        onTemperatureChange={handleFahrenheitChange}
      />
      <BoilingVerdict celsius={parseFloat(celsius)} />
    </div>
  );
}

// Componente per comunicazione tra fratelli
function MessageSender({ onSendMessage }) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8, marginBottom: 12 }}>
      <h4>Invia Messaggio</h4>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Scrivi un messaggio..."
        style={{ marginRight: 8, padding: 4 }}
      />
      <button onClick={handleSend}>Invia</button>
    </div>
  );
}

function MessageReceiver({ messages }) {
  return (
    <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8 }}>
      <h4>Messaggi Ricevuti</h4>
      {messages.length === 0 ? (
        <p>Nessun messaggio</p>
      ) : (
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Demo10() {
  const [messages, setMessages] = useState([]);

  const handleSendMessage = (message) => {
    setMessages(prev => [...prev, message]);
  };

  return (
    <ThemeProvider>
      <div style={{ padding: 12 }}>
        <h3>Lezione 10: Passaggio Stato tra Componenti</h3>
        
        <div style={{ marginBottom: 20 }}>
          <h4>Context API</h4>
          <ThemedButton />
        </div>

        <div style={{ marginBottom: 20 }}>
          <Calculator />
        </div>

        <div>
          <h4>Comunicazione tra Componenti Fratelli</h4>
          <MessageSender onSendMessage={handleSendMessage} />
          <MessageReceiver messages={messages} />
        </div>
      </div>
    </ThemeProvider>
  );
}
