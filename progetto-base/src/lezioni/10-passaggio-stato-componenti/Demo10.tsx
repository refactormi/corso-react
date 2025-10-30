import { createContext, useContext, useState, ReactNode } from 'react';

interface ThemeContextType {
  theme: string
  toggleTheme: () => void
}

// Context per tema globale
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode
}

function ThemeProvider({ children }: ThemeProviderProps): JSX.Element {
  const [theme, setTheme] = useState<string>('light');
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function ThemedButton(): JSX.Element {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('ThemedButton must be used within ThemeProvider');
  const { theme, toggleTheme } = context;
  
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
interface TemperatureInputProps {
  scale: 'c' | 'f'
  temperature: string
  onTemperatureChange: (temp: string) => void
}

function TemperatureInput({ scale, temperature, onTemperatureChange }: TemperatureInputProps): JSX.Element {
  const scaleNames: Record<'c' | 'f', string> = { c: 'Celsius', f: 'Fahrenheit' };
  
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

interface BoilingVerdictProps {
  celsius: string
}

function BoilingVerdict({ celsius }: BoilingVerdictProps): JSX.Element {
  if (celsius >= 100) {
    return <p style={{ color: 'red' }}>L'acqua bollirebbe! 🔥</p>;
  }
  return <p style={{ color: 'blue' }}>L'acqua non bollirebbe. ❄️</p>;
}

function toCelsius(fahrenheit: number): number {
  return (fahrenheit - 32) * 5 / 9;
}

function toFahrenheit(celsius: number): number {
  return (celsius * 9 / 5) + 32;
}

function tryConvert(temperature: string, convert: (temp: number) => number): string {
  const input = parseFloat(temperature);
  if (Number.isNaN(input)) {
    return '';
  }
  const output = convert(input);
  const rounded = Math.round(output * 1000) / 1000;
  return rounded.toString();
}

function Calculator(): JSX.Element {
  const [temperature, setTemperature] = useState<string>('');
  const [scale, setScale] = useState<'c' | 'f'>('c');

  const handleCelsiusChange = (temperature: string) => {
    setScale('c');
    setTemperature(temperature);
  };

  const handleFahrenheitChange = (temperature: string) => {
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
interface MessageSenderProps {
  onSendMessage: (message: string) => void
}

function MessageSender({ onSendMessage }: MessageSenderProps): JSX.Element {
  const [message, setMessage] = useState<string>('');

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

interface MessageReceiverProps {
  messages: string[]
}

function MessageReceiver({ messages }: MessageReceiverProps): JSX.Element {
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

export default function Demo10(): JSX.Element {
  const [messages, setMessages] = useState<string[]>([]);

  const handleSendMessage = (message: string) => {
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
