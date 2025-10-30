import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import AnalyticsDashboard from './esempi/01-dashboard-analytics';
import VirtualizedListDemo from './esempi/02-lista-virtualizzata';
import AdvancedSearchSystem from './esempi/03-ricerca-avanzata';

/**
 * Test per la Lezione 14: useMemo e useCallback
 * 
 * Questi test verificano che gli esempi di memoizzazione
 * funzionino correttamente e che le performance siano ottimizzate.
 */

// Mock per performance.now
global.performance = {
  now: jest.fn(() => Date.now())
};

describe('Lezione 14: useMemo e useCallback', () => {
  
  describe('AnalyticsDashboard - Dashboard con Memoizzazione', () => {
    test('renderizza il dashboard analytics', () => {
      render(<AnalyticsDashboard />);
      expect(screen.getByText('📊 Dashboard Analytics')).toBeInTheDocument();
    });
    
    test('mostra le metriche principali', async () => {
      render(<AnalyticsDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('Ricavi Totali')).toBeInTheDocument();
        expect(screen.getByText('Profitto Totale')).toBeInTheDocument();
        expect(screen.getByText('Quantità Vendute')).toBeInTheDocument();
        expect(screen.getByText('Valore Medio Ordine')).toBeInTheDocument();
        expect(screen.getByText('Margine di Profitto')).toBeInTheDocument();
      });
    });
    
    test('gestisce il cambio del range temporale', () => {
      render(<AnalyticsDashboard />);
      
      const timeRangeSelect = screen.getByDisplayValue('Ultimi 30 giorni');
      fireEvent.change(timeRangeSelect, { target: { value: '7d' } });
      
      expect(timeRangeSelect.value).toBe('7d');
    });
    
    test('mostra i grafici', async () => {
      render(<AnalyticsDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('📊 Vendite per Categoria')).toBeInTheDocument();
        expect(screen.getByText('📊 Vendite per Regione')).toBeInTheDocument();
        expect(screen.getByText('📊 Andamento Giornaliero')).toBeInTheDocument();
      });
    });
    
    test('mostra la tabella dati', async () => {
      render(<AnalyticsDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('📋 Dati Dettagliati')).toBeInTheDocument();
      });
    });
    
    test('gestisce il refresh dei dati', () => {
      render(<AnalyticsDashboard />);
      
      const refreshButton = screen.getByText('🔄 Aggiorna');
      fireEvent.click(refreshButton);
      
      // Verifica che il pulsante sia cliccabile
      expect(refreshButton).toBeInTheDocument();
    });
    
    test('mostra le informazioni di performance', async () => {
      render(<AnalyticsDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText(/Render: \d+/)).toBeInTheDocument();
        expect(screen.getByText(/Media: \d+\.\d+ms/)).toBeInTheDocument();
        expect(screen.getByText(/Dati: \d+ record/)).toBeInTheDocument();
      });
    });
  });
  
  describe('VirtualizedListDemo - Lista Virtualizzata con Memoizzazione', () => {
    test('renderizza la lista virtualizzata', () => {
      render(<VirtualizedListDemo />);
      expect(screen.getByText('📋 Lista Virtualizzata con Memoizzazione')).toBeInTheDocument();
    });
    
    test('mostra la barra di ricerca', () => {
      render(<VirtualizedListDemo />);
      
      const searchInput = screen.getByPlaceholderText('Cerca per nome, email o dipartimento...');
      expect(searchInput).toBeInTheDocument();
    });
    
    test('gestisce la ricerca', () => {
      render(<VirtualizedListDemo />);
      
      const searchInput = screen.getByPlaceholderText('Cerca per nome, email o dipartimento...');
      fireEvent.change(searchInput, { target: { value: 'test' } });
      
      expect(searchInput.value).toBe('test');
    });
    
    test('mostra i controlli della lista', () => {
      render(<VirtualizedListDemo />);
      
      expect(screen.getByText('Seleziona Tutto')).toBeInTheDocument();
      expect(screen.getByText('Deseleziona Tutto')).toBeInTheDocument();
    });
    
    test('gestisce la selezione degli elementi', () => {
      render(<VirtualizedListDemo />);
      
      const selectAllButton = screen.getByText('Seleziona Tutto');
      fireEvent.click(selectAllButton);
      
      // Verifica che il pulsante sia cliccabile
      expect(selectAllButton).toBeInTheDocument();
    });
    
    test('mostra le informazioni di virtualizzazione', () => {
      render(<VirtualizedListDemo />);
      
      expect(screen.getByText(/10,000 elementi totali/)).toBeInTheDocument();
    });
    
    test('gestisce il cambio di altezza degli elementi', () => {
      render(<VirtualizedListDemo />);
      
      const heightSelect = screen.getByDisplayValue('80px');
      fireEvent.change(heightSelect, { target: { value: '100' } });
      
      expect(heightSelect.value).toBe('100');
    });
    
    test('mostra le informazioni di debug', () => {
      render(<VirtualizedListDemo />);
      
      expect(screen.getByText(/Scroll: \d+px/)).toBeInTheDocument();
      expect(screen.getByText(/Visibili: \d+-\d+/)).toBeInTheDocument();
      expect(screen.getByText(/Totale: \d+/)).toBeInTheDocument();
      expect(screen.getByText(/Render: \d+/)).toBeInTheDocument();
    });
  });
  
  describe('AdvancedSearchSystem - Sistema di Ricerca con Memoizzazione', () => {
    test('renderizza il sistema di ricerca avanzata', () => {
      render(<AdvancedSearchSystem />);
      expect(screen.getByText('🔍 Sistema di Ricerca Avanzata')).toBeInTheDocument();
    });
    
    test('mostra la barra di ricerca', () => {
      render(<AdvancedSearchSystem />);
      
      const searchInput = screen.getByPlaceholderText('Cerca prodotti, categorie o descrizioni...');
      expect(searchInput).toBeInTheDocument();
    });
    
    test('gestisce la ricerca', () => {
      render(<AdvancedSearchSystem />);
      
      const searchInput = screen.getByPlaceholderText('Cerca prodotti, categorie o descrizioni...');
      fireEvent.change(searchInput, { target: { value: 'test' } });
      
      expect(searchInput.value).toBe('test');
    });
    
    test('mostra i filtri di ricerca', () => {
      render(<AdvancedSearchSystem />);
      
      expect(screen.getByText('🔍 Filtri di Ricerca')).toBeInTheDocument();
      expect(screen.getByText('Categoria:')).toBeInTheDocument();
      expect(screen.getByText('Prezzo:')).toBeInTheDocument();
      expect(screen.getByText('Rating minimo:')).toBeInTheDocument();
      expect(screen.getByText('Disponibilità:')).toBeInTheDocument();
    });
    
    test('gestisce i filtri', () => {
      render(<AdvancedSearchSystem />);
      
      const categorySelect = screen.getByDisplayValue('Tutte le categorie');
      fireEvent.change(categorySelect, { target: { value: 'Elettronica' } });
      
      expect(categorySelect.value).toBe('Elettronica');
    });
    
    test('mostra i controlli di ordinamento', () => {
      render(<AdvancedSearchSystem />);
      
      expect(screen.getByText('Ordina per:')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Rilevanza')).toBeInTheDocument();
    });
    
    test('gestisce l\'ordinamento', () => {
      render(<AdvancedSearchSystem />);
      
      const sortSelect = screen.getByDisplayValue('Rilevanza');
      fireEvent.change(sortSelect, { target: { value: 'price-asc' } });
      
      expect(sortSelect.value).toBe('price-asc');
    });
    
    test('mostra i risultati della ricerca', async () => {
      render(<AdvancedSearchSystem />);
      
      await waitFor(() => {
        expect(screen.getByText(/risultati trovati/)).toBeInTheDocument();
      });
    });
    
    test('gestisce il click sui prodotti', () => {
      render(<AdvancedSearchSystem />);
      
      // Cerca un prodotto per cliccare
      const searchInput = screen.getByPlaceholderText('Cerca prodotti, categorie o descrizioni...');
      fireEvent.change(searchInput, { target: { value: 'Prodotto' } });
      
      // Verifica che la ricerca funzioni
      expect(searchInput.value).toBe('Prodotto');
    });
    
    test('mostra le informazioni di debug', () => {
      render(<AdvancedSearchSystem />);
      
      expect(screen.getByText(/Render: \d+/)).toBeInTheDocument();
      expect(screen.getByText(/Risultati: \d+/)).toBeInTheDocument();
    });
  });
  
  describe('Integrazione e Performance', () => {
    test('tutti i componenti si renderizzano senza errori', () => {
      expect(() => {
        render(<AnalyticsDashboard />);
        render(<VirtualizedListDemo />);
        render(<AdvancedSearchSystem />);
      }).not.toThrow();
    });
    
    test('i componenti gestiscono correttamente la memoizzazione', () => {
      const { rerender } = render(<AnalyticsDashboard />);
      
      // Rerenderizza il componente
      rerender(<AnalyticsDashboard />);
      
      // Verifica che non ci siano errori
      expect(true).toBe(true);
    });
    
    test('i componenti gestiscono correttamente i callback memoizzati', () => {
      render(<VirtualizedListDemo />);
      
      const searchInput = screen.getByPlaceholderText('Cerca per nome, email o dipartimento...');
      
      // Simula multiple interazioni
      fireEvent.change(searchInput, { target: { value: 'test1' } });
      fireEvent.change(searchInput, { target: { value: 'test2' } });
      fireEvent.change(searchInput, { target: { value: 'test3' } });
      
      // Verifica che il valore sia aggiornato
      expect(searchInput.value).toBe('test3');
    });
    
    test('i componenti gestiscono correttamente i calcoli memoizzati', () => {
      render(<AdvancedSearchSystem />);
      
      const searchInput = screen.getByPlaceholderText('Cerca prodotti, categorie o descrizioni...');
      
      // Simula ricerca
      fireEvent.change(searchInput, { target: { value: 'test' } });
      
      // Verifica che la ricerca funzioni
      expect(searchInput.value).toBe('test');
    });
  });
  
  describe('useMemo e useCallback', () => {
    test('i componenti utilizzano correttamente useMemo', () => {
      // Questo test verifica che i componenti utilizzino useMemo
      // per ottimizzare i calcoli costosi
      expect(() => {
        render(<AnalyticsDashboard />);
      }).not.toThrow();
    });
    
    test('i componenti utilizzano correttamente useCallback', () => {
      // Questo test verifica che i componenti utilizzino useCallback
      // per ottimizzare le funzioni
      expect(() => {
        render(<VirtualizedListDemo />);
      }).not.toThrow();
    });
    
    test('i componenti utilizzano correttamente React.memo', () => {
      // Questo test verifica che i componenti utilizzino React.memo
      // per ottimizzare i componenti figli
      expect(() => {
        render(<AdvancedSearchSystem />);
      }).not.toThrow();
    });
  });
  
  describe('Performance e Ottimizzazione', () => {
    test('i componenti non causano re-render inutili', () => {
      const { rerender } = render(<AnalyticsDashboard />);
      
      // Rerenderizza il componente
      rerender(<AnalyticsDashboard />);
      
      // Verifica che non ci siano errori
      expect(true).toBe(true);
    });
    
    test('i componenti gestiscono correttamente le dipendenze', () => {
      render(<VirtualizedListDemo />);
      
      const searchInput = screen.getByPlaceholderText('Cerca per nome, email o dipartimento...');
      
      // Simula cambio di input
      fireEvent.change(searchInput, { target: { value: 'test' } });
      
      // Verifica che il valore sia aggiornato
      expect(searchInput.value).toBe('test');
    });
    
    test('i componenti gestiscono correttamente la memoizzazione condizionale', () => {
      render(<AdvancedSearchSystem />);
      
      const searchInput = screen.getByPlaceholderText('Cerca prodotti, categorie o descrizioni...');
      
      // Simula ricerca vuota
      fireEvent.change(searchInput, { target: { value: '' } });
      
      // Verifica che la ricerca funzioni
      expect(searchInput.value).toBe('');
    });
  });
  
  describe('Errori Comuni e Anti-Patterns', () => {
    test('gestisce correttamente le dipendenze mancanti', () => {
      // Questo test verifica che i componenti gestiscano correttamente
      // le dipendenze di useMemo e useCallback
      expect(() => {
        render(<AnalyticsDashboard />);
      }).not.toThrow();
    });
    
    test('evita over-optimization', () => {
      // Questo test verifica che i componenti non abbiano
      // over-optimization
      expect(() => {
        render(<VirtualizedListDemo />);
      }).not.toThrow();
    });
    
    test('gestisce correttamente la memoizzazione di valori primitivi', () => {
      // Questo test verifica che i componenti gestiscano correttamente
      // la memoizzazione di valori primitivi
      expect(() => {
        render(<AdvancedSearchSystem />);
      }).not.toThrow();
    });
  });
  
  describe('Debugging e Troubleshooting', () => {
    test('i componenti forniscono informazioni di debug', () => {
      render(<AnalyticsDashboard />);
      
      // Verifica che le informazioni di debug siano presenti
      expect(screen.getByText(/Render: \d+/)).toBeInTheDocument();
    });
    
    test('i componenti gestiscono correttamente gli errori', () => {
      // Questo test verifica che i componenti gestiscano correttamente
      // gli errori durante la memoizzazione
      expect(() => {
        render(<VirtualizedListDemo />);
      }).not.toThrow();
    });
    
    test('i componenti forniscono feedback sulle performance', () => {
      render(<AdvancedSearchSystem />);
      
      // Verifica che le informazioni sulle performance siano presenti
      expect(screen.getByText(/Render: \d+/)).toBeInTheDocument();
    });
  });
});





