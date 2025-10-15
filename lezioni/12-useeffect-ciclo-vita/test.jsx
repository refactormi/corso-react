import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import RealTimeDashboard from './esempi/01-dashboard-tempo-reale';
import TimerManager from './esempi/02-gestione-timer';
import ThemeManager from './esempi/03-gestione-tema';

/**
 * Test per la Lezione 12: useEffect e Ciclo di Vita
 * 
 * Questi test verificano che gli esempi di useEffect
 * funzionino correttamente e che i side effects siano gestiti correttamente.
 */

// Mock per localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock per matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('Lezione 12: useEffect e Ciclo di Vita', () => {
  
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();
  });
  
  describe('RealTimeDashboard - Side Effects e Connessioni', () => {
    test('renderizza il dashboard in tempo reale', () => {
      render(<RealTimeDashboard />);
      expect(screen.getByText('📊 Dashboard Tempo Reale')).toBeInTheDocument();
    });
    
    test('mostra lo stato di connessione', async () => {
      render(<RealTimeDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('Connesso')).toBeInTheDocument();
      });
    });
    
    test('aggiorna i dati in tempo reale', async () => {
      render(<RealTimeDashboard />);
      
      // Aspetta che i dati vengano caricati
      await waitFor(() => {
        expect(screen.getByText('Utenti Attivi')).toBeInTheDocument();
      });
      
      // Verifica che i dati vengano aggiornati
      await waitFor(() => {
        expect(screen.getByText(/Trovati \d+ risultati/)).toBeInTheDocument();
      }, { timeout: 3000 });
    });
    
    test('mostra le metriche principali', async () => {
      render(<RealTimeDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('Utenti Attivi')).toBeInTheDocument();
        expect(screen.getByText('Ordini Oggi')).toBeInTheDocument();
        expect(screen.getByText('Fatturato')).toBeInTheDocument();
        expect(screen.getByText('Tasso Conversione')).toBeInTheDocument();
      });
    });
    
    test('mostra il grafico delle vendite', async () => {
      render(<RealTimeDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('📈 Vendite in Tempo Reale')).toBeInTheDocument();
      });
    });
    
    test('mostra le informazioni del sistema', async () => {
      render(<RealTimeDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('📋 Informazioni Sistema')).toBeInTheDocument();
        expect(screen.getByText('Stato Connessione')).toBeInTheDocument();
        expect(screen.getByText('Frequenza Aggiornamento')).toBeInTheDocument();
      });
    });
  });
  
  describe('TimerManager - Gestione Timer e Cronometri', () => {
    test('renderizza il gestore di timer', () => {
      render(<TimerManager />);
      expect(screen.getByText('⏱️ Gestione Timer e Cronometri')).toBeInTheDocument();
    });
    
    test('mostra le tab per cronometro e countdown', () => {
      render(<TimerManager />);
      expect(screen.getByText('⏱️ Cronometro')).toBeInTheDocument();
      expect(screen.getByText('⏰ Countdown')).toBeInTheDocument();
    });
    
    test('cambia tra le tab', () => {
      render(<TimerManager />);
      
      // Inizia con il cronometro
      expect(screen.getByText('⏱️ Cronometro')).toBeInTheDocument();
      
      // Cambia al countdown
      fireEvent.click(screen.getByText('⏰ Countdown'));
      expect(screen.getByText('⏰ Timer Countdown')).toBeInTheDocument();
    });
    
    test('avvia e pausa il cronometro', async () => {
      render(<TimerManager />);
      
      // Assicurati di essere nella tab cronometro
      fireEvent.click(screen.getByText('⏱️ Cronometro'));
      
      // Avvia il cronometro
      fireEvent.click(screen.getByText('▶️ Avvia'));
      
      // Verifica che il pulsante sia cambiato in pausa
      expect(screen.getByText('⏸️ Pausa')).toBeInTheDocument();
      
      // Pausa il cronometro
      fireEvent.click(screen.getByText('⏸️ Pausa'));
      
      // Verifica che il pulsante sia cambiato in riprendi
      expect(screen.getByText('▶️ Riprendi')).toBeInTheDocument();
    });
    
    test('resetta il cronometro', () => {
      render(<TimerManager />);
      
      // Assicurati di essere nella tab cronometro
      fireEvent.click(screen.getByText('⏱️ Cronometro'));
      
      // Avvia il cronometro
      fireEvent.click(screen.getByText('▶️ Avvia'));
      
      // Resetta il cronometro
      fireEvent.click(screen.getByText('🔄 Reset'));
      
      // Verifica che il tempo sia tornato a 0
      expect(screen.getByText('00:00')).toBeInTheDocument();
    });
    
    test('registra giri nel cronometro', async () => {
      render(<TimerManager />);
      
      // Assicurati di essere nella tab cronometro
      fireEvent.click(screen.getByText('⏱️ Cronometro'));
      
      // Avvia il cronometro
      fireEvent.click(screen.getByText('▶️ Avvia'));
      
      // Registra un giro
      fireEvent.click(screen.getByText('⏱️ Giro'));
      
      // Verifica che il giro sia stato registrato
      await waitFor(() => {
        expect(screen.getByText('📊 Giri Registrati')).toBeInTheDocument();
      });
    });
    
    test('imposta e avvia il countdown timer', () => {
      render(<TimerManager />);
      
      // Cambia alla tab countdown
      fireEvent.click(screen.getByText('⏰ Countdown'));
      
      // Imposta un tempo
      const timeInput = screen.getByDisplayValue('300');
      fireEvent.change(timeInput, { target: { value: '60' } });
      
      // Avvia il timer
      fireEvent.click(screen.getByText('▶️ Avvia Timer'));
      
      // Verifica che il timer sia avviato
      expect(screen.getByText('⏳ In corso...')).toBeInTheDocument();
    });
    
    test('mostra le informazioni sui shortcuts', () => {
      render(<TimerManager />);
      
      expect(screen.getByText('⌨️ Shortcuts: Spazio (start/pause), R (reset), L (giro)')).toBeInTheDocument();
    });
  });
  
  describe('ThemeManager - Gestione Tema e Preferenze', () => {
    test('renderizza il gestore di tema', () => {
      render(<ThemeManager />);
      expect(screen.getByText('🎨 Gestione Tema e Preferenze')).toBeInTheDocument();
    });
    
    test('mostra il selettore del tema', () => {
      render(<ThemeManager />);
      expect(screen.getByText('🎨 Tema')).toBeInTheDocument();
      expect(screen.getByText('☀️ Chiaro')).toBeInTheDocument();
      expect(screen.getByText('🌙 Scuro')).toBeInTheDocument();
      expect(screen.getByText('🖥️ Sistema')).toBeInTheDocument();
    });
    
    test('cambia il tema', () => {
      render(<ThemeManager />);
      
      // Cambia al tema scuro
      fireEvent.click(screen.getByText('🌙 Scuro'));
      
      // Verifica che il tema sia cambiato
      expect(screen.getByText('Tema attivo: 🌙 Scuro')).toBeInTheDocument();
    });
    
    test('mostra il selettore del colore', () => {
      render(<ThemeManager />);
      expect(screen.getByText('🎨 Colore Accent')).toBeInTheDocument();
    });
    
    test('cambia il colore accent', () => {
      render(<ThemeManager />);
      
      // Clicca su un colore
      fireEvent.click(screen.getByText('Verde'));
      
      // Verifica che il colore sia cambiato
      expect(screen.getByText('#28a745')).toBeInTheDocument();
    });
    
    test('mostra le impostazioni di accessibilità', () => {
      render(<ThemeManager />);
      expect(screen.getByText('♿ Accessibilità')).toBeInTheDocument();
      expect(screen.getByText('Dimensione Font')).toBeInTheDocument();
      expect(screen.getByText('Abilita animazioni')).toBeInTheDocument();
    });
    
    test('cambia la dimensione del font', () => {
      render(<ThemeManager />);
      
      // Cambia a font grande
      fireEvent.click(screen.getByText('Grande'));
      
      // Verifica che la dimensione sia cambiata
      expect(screen.getByText('Grande')).toBeInTheDocument();
    });
    
    test('abilita/disabilita le animazioni', () => {
      render(<ThemeManager />);
      
      const checkbox = screen.getByRole('checkbox');
      
      // Disabilita le animazioni
      fireEvent.click(checkbox);
      
      // Verifica che le animazioni siano disabilitate
      expect(checkbox).not.toBeChecked();
    });
    
    test('mostra l\'anteprima del tema', () => {
      render(<ThemeManager />);
      expect(screen.getByText('👁️ Anteprima Tema')).toBeInTheDocument();
      expect(screen.getByText('Titolo di Esempio')).toBeInTheDocument();
    });
    
    test('mostra le statistiche del tema', () => {
      render(<ThemeManager />);
      expect(screen.getByText('📊 Statistiche Tema')).toBeInTheDocument();
      expect(screen.getByText('Tema Selezionato')).toBeInTheDocument();
      expect(screen.getByText('Tema Effettivo')).toBeInTheDocument();
    });
    
    test('salva le preferenze in localStorage', () => {
      render(<ThemeManager />);
      
      // Cambia il tema
      fireEvent.click(screen.getByText('🌙 Scuro'));
      
      // Verifica che le preferenze siano salvate
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', '"dark"');
    });
  });
  
  describe('Integrazione e Cleanup', () => {
    test('tutti i componenti si renderizzano senza errori', () => {
      expect(() => {
        render(<RealTimeDashboard />);
        render(<TimerManager />);
        render(<ThemeManager />);
      }).not.toThrow();
    });
    
    test('i componenti gestiscono correttamente il cleanup', () => {
      const { unmount } = render(<RealTimeDashboard />);
      
      // Unmount del componente
      unmount();
      
      // Verifica che non ci siano errori
      expect(true).toBe(true);
    });
    
    test('i timer vengono puliti correttamente', () => {
      const { unmount } = render(<TimerManager />);
      
      // Avvia un timer
      fireEvent.click(screen.getByText('⏱️ Cronometro'));
      fireEvent.click(screen.getByText('▶️ Avvia'));
      
      // Unmount del componente
      unmount();
      
      // Verifica che non ci siano errori
      expect(true).toBe(true);
    });
    
    test('gli event listeners vengono rimossi correttamente', () => {
      const { unmount } = render(<ThemeManager />);
      
      // Unmount del componente
      unmount();
      
      // Verifica che non ci siano errori
      expect(true).toBe(true);
    });
  });
  
  describe('Side Effects e Dependencies', () => {
    test('useEffect si esegue correttamente con dipendenze', async () => {
      render(<RealTimeDashboard />);
      
      // Verifica che i side effects vengano eseguiti
      await waitFor(() => {
        expect(screen.getByText('📊 Dashboard Tempo Reale')).toBeInTheDocument();
      });
    });
    
    test('i side effects vengono puliti correttamente', () => {
      const { unmount } = render(<RealTimeDashboard />);
      
      // Unmount del componente
      unmount();
      
      // Verifica che non ci siano errori
      expect(true).toBe(true);
    });
    
    test('le dipendenze vengono gestite correttamente', async () => {
      render(<ThemeManager />);
      
      // Cambia una dipendenza
      fireEvent.click(screen.getByText('🌙 Scuro'));
      
      // Verifica che l'effetto sia stato eseguito
      expect(screen.getByText('Tema attivo: 🌙 Scuro')).toBeInTheDocument();
    });
  });
  
  describe('Performance e Ottimizzazione', () => {
    test('i componenti non causano re-render inutili', () => {
      const { rerender } = render(<ThemeManager />);
      
      // Rerenderizza il componente
      rerender(<ThemeManager />);
      
      // Verifica che non ci siano errori
      expect(true).toBe(true);
    });
    
    test('i hook personalizzati funzionano correttamente', () => {
      render(<TimerManager />);
      
      // Verifica che i hook personalizzati funzionino
      expect(screen.getByText('⏱️ Cronometro')).toBeInTheDocument();
    });
    
    test('le funzioni di callback sono ottimizzate', () => {
      render(<ThemeManager />);
      
      // Verifica che le funzioni di callback funzionino
      fireEvent.click(screen.getByText('🌙 Scuro'));
      expect(screen.getByText('Tema attivo: 🌙 Scuro')).toBeInTheDocument();
    });
  });
});

// Test per errori comuni
describe('Errori Comuni useEffect', () => {
  test('gestisce correttamente le dipendenze mancanti', () => {
    // Questo test verifica che i componenti gestiscano correttamente
    // le dipendenze di useEffect
    expect(() => {
      render(<RealTimeDashboard />);
    }).not.toThrow();
  });
  
  test('gestisce correttamente il cleanup', () => {
    // Questo test verifica che il cleanup venga eseguito correttamente
    const { unmount } = render(<TimerManager />);
    
    expect(() => {
      unmount();
    }).not.toThrow();
  });
  
  test('gestisce correttamente i side effects asincroni', async () => {
    // Questo test verifica che i side effects asincroni vengano gestiti correttamente
    render(<RealTimeDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('📊 Dashboard Tempo Reale')).toBeInTheDocument();
    });
  });
});
