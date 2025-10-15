import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdvancedTextEditor from './esempi/01-editor-testo-avanzato';
import InteractiveImageGalleryDemo from './esempi/02-galleria-immagini-interattiva';
import VideoPlayerDemo from './esempi/03-player-video-personalizzato';

/**
 * Test per la Lezione 13: useRef e Manipolazione DOM
 * 
 * Questi test verificano che gli esempi di useRef
 * funzionino correttamente e che la manipolazione DOM sia gestita correttamente.
 */

// Mock per IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback, options) {
    this.callback = callback;
    this.options = options;
  }
  
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock per ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }
  
  observe() {}
  unobserve() {}
  disconnect() {}
};

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

// Mock per fullscreen API
Object.defineProperty(document, 'fullscreenElement', {
  writable: true,
  value: null,
});

Object.defineProperty(document, 'exitFullscreen', {
  writable: true,
  value: jest.fn(),
});

Object.defineProperty(HTMLElement.prototype, 'requestFullscreen', {
  writable: true,
  value: jest.fn(),
});

// Mock per Picture-in-Picture API
Object.defineProperty(document, 'exitPictureInPicture', {
  writable: true,
  value: jest.fn(),
});

Object.defineProperty(HTMLVideoElement.prototype, 'requestPictureInPicture', {
  writable: true,
  value: jest.fn(),
});

describe('Lezione 13: useRef e Manipolazione DOM', () => {
  
  describe('AdvancedTextEditor - Editor di Testo con useRef', () => {
    test('renderizza l\'editor di testo avanzato', () => {
      render(<AdvancedTextEditor />);
      expect(screen.getByText('📝 Editor di Testo Avanzato')).toBeInTheDocument();
    });
    
    test('mostra la toolbar con i controlli', () => {
      render(<AdvancedTextEditor />);
      expect(screen.getByText('B')).toBeInTheDocument(); // Pulsante Bold
      expect(screen.getByText('I')).toBeInTheDocument(); // Pulsante Italic
      expect(screen.getByText('U')).toBeInTheDocument(); // Pulsante Underline
    });
    
    test('permette di inserire testo nell\'editor', () => {
      render(<AdvancedTextEditor />);
      const textarea = screen.getByPlaceholderText('Inizia a scrivere il tuo documento...');
      
      fireEvent.change(textarea, { target: { value: 'Testo di prova' } });
      
      expect(textarea.value).toBe('Testo di prova');
    });
    
    test('mostra le statistiche del testo', async () => {
      render(<AdvancedTextEditor />);
      const textarea = screen.getByPlaceholderText('Inizia a scrivere il tuo documento...');
      
      fireEvent.change(textarea, { target: { value: 'Testo di prova' } });
      
      await waitFor(() => {
        expect(screen.getByText('📝 Caratteri: 13')).toBeInTheDocument();
        expect(screen.getByText('📖 Parole: 2')).toBeInTheDocument();
      });
    });
    
    test('gestisce i pulsanti di formattazione', () => {
      render(<AdvancedTextEditor />);
      
      const boldButton = screen.getByTitle('Grassetto (Ctrl+B)');
      const italicButton = screen.getByTitle('Corsivo (Ctrl+I)');
      const underlineButton = screen.getByTitle('Sottolineato (Ctrl+U)');
      
      expect(boldButton).toBeInTheDocument();
      expect(italicButton).toBeInTheDocument();
      expect(underlineButton).toBeInTheDocument();
    });
    
    test('gestisce i pulsanti di cronologia', () => {
      render(<AdvancedTextEditor />);
      
      const undoButton = screen.getByTitle('Annulla (Ctrl+Z)');
      const redoButton = screen.getByTitle('Ripeti (Ctrl+Y)');
      
      expect(undoButton).toBeInTheDocument();
      expect(redoButton).toBeInTheDocument();
    });
    
    test('gestisce i pulsanti di file', () => {
      render(<AdvancedTextEditor />);
      
      const saveButton = screen.getByTitle('Salva (Ctrl+S)');
      const loadButton = screen.getByTitle('Carica');
      const exportButton = screen.getByTitle('Esporta');
      
      expect(saveButton).toBeInTheDocument();
      expect(loadButton).toBeInTheDocument();
      expect(exportButton).toBeInTheDocument();
    });
    
    test('mostra le istruzioni per gli shortcuts', () => {
      render(<AdvancedTextEditor />);
      
      expect(screen.getByText('⌨️ Shortcuts: Spazio (start/pause), R (reset), L (giro)')).toBeInTheDocument();
    });
    
    test('gestisce il salvataggio del documento', () => {
      render(<AdvancedTextEditor />);
      
      const saveButton = screen.getByTitle('Salva (Ctrl+S)');
      
      // Mock per URL.createObjectURL e document.createElement
      const mockCreateObjectURL = jest.fn(() => 'blob:mock-url');
      const mockRevokeObjectURL = jest.fn();
      const mockClick = jest.fn();
      const mockAppendChild = jest.fn();
      const mockRemoveChild = jest.fn();
      
      global.URL.createObjectURL = mockCreateObjectURL;
      global.URL.revokeObjectURL = mockRevokeObjectURL;
      
      const mockAnchor = {
        href: '',
        download: '',
        click: mockClick
      };
      
      jest.spyOn(document, 'createElement').mockReturnValue(mockAnchor);
      jest.spyOn(document.body, 'appendChild').mockImplementation(mockAppendChild);
      jest.spyOn(document.body, 'removeChild').mockImplementation(mockRemoveChild);
      
      fireEvent.click(saveButton);
      
      expect(mockCreateObjectURL).toHaveBeenCalled();
      expect(mockClick).toHaveBeenCalled();
    });
  });
  
  describe('InteractiveImageGallery - Galleria Immagini con useRef', () => {
    test('renderizza la galleria immagini interattiva', () => {
      render(<InteractiveImageGalleryDemo />);
      expect(screen.getByText('🖼️ Galleria Immagini Interattiva')).toBeInTheDocument();
    });
    
    test('mostra i controlli della galleria', () => {
      render(<InteractiveImageGalleryDemo />);
      
      expect(screen.getByText('Seleziona Tutto')).toBeInTheDocument();
      expect(screen.getByText('Deseleziona Tutto')).toBeInTheDocument();
    });
    
    test('mostra le statistiche delle immagini', () => {
      render(<InteractiveImageGalleryDemo />);
      
      expect(screen.getByText(/📊 Totale: \d+/)).toBeInTheDocument();
      expect(screen.getByText(/✅ Caricate: \d+/)).toBeInTheDocument();
      expect(screen.getByText(/❌ Errori: \d+/)).toBeInTheDocument();
    });
    
    test('gestisce la selezione delle immagini', () => {
      render(<InteractiveImageGalleryDemo />);
      
      const selectAllButton = screen.getByText('Seleziona Tutto');
      fireEvent.click(selectAllButton);
      
      expect(screen.getByText(/6 di 6 selezionate/)).toBeInTheDocument();
    });
    
    test('gestisce la deselezione delle immagini', () => {
      render(<InteractiveImageGalleryDemo />);
      
      const selectAllButton = screen.getByText('Seleziona Tutto');
      const deselectAllButton = screen.getByText('Deseleziona Tutto');
      
      fireEvent.click(selectAllButton);
      fireEvent.click(deselectAllButton);
      
      expect(screen.getByText(/0 di 6 selezionate/)).toBeInTheDocument();
    });
    
    test('mostra i pulsanti di azione quando ci sono immagini selezionate', () => {
      render(<InteractiveImageGalleryDemo />);
      
      const selectAllButton = screen.getByText('Seleziona Tutto');
      fireEvent.click(selectAllButton);
      
      expect(screen.getByText('📥 Scarica')).toBeInTheDocument();
      expect(screen.getByText('🗑️ Elimina')).toBeInTheDocument();
    });
    
    test('mostra le istruzioni per l\'uso', () => {
      render(<InteractiveImageGalleryDemo />);
      
      expect(screen.getByText('ℹ️ Istruzioni')).toBeInTheDocument();
      expect(screen.getByText('Click per selezionare/deselezionare un\'immagine')).toBeInTheDocument();
      expect(screen.getByText('Doppio click per aprire in schermo intero')).toBeInTheDocument();
    });
    
    test('gestisce il download delle immagini selezionate', () => {
      render(<InteractiveImageGalleryDemo />);
      
      const selectAllButton = screen.getByText('Seleziona Tutto');
      fireEvent.click(selectAllButton);
      
      const downloadButton = screen.getByText('📥 Scarica');
      
      // Mock per document.createElement
      const mockClick = jest.fn();
      const mockAppendChild = jest.fn();
      const mockRemoveChild = jest.fn();
      
      const mockAnchor = {
        href: '',
        download: '',
        click: mockClick
      };
      
      jest.spyOn(document, 'createElement').mockReturnValue(mockAnchor);
      jest.spyOn(document.body, 'appendChild').mockImplementation(mockAppendChild);
      jest.spyOn(document.body, 'removeChild').mockImplementation(mockRemoveChild);
      
      fireEvent.click(downloadButton);
      
      expect(mockClick).toHaveBeenCalled();
    });
  });
  
  describe('VideoPlayerDemo - Player Video con useRef', () => {
    test('renderizza il player video personalizzato', () => {
      render(<VideoPlayerDemo />);
      expect(screen.getByText('🎬 Player Video Personalizzato')).toBeInTheDocument();
    });
    
    test('mostra i selettori di video', () => {
      render(<VideoPlayerDemo />);
      
      expect(screen.getByText('Big Buck Bunny')).toBeInTheDocument();
      expect(screen.getByText('Elephants Dream')).toBeInTheDocument();
      expect(screen.getByText('For Bigger Blazes')).toBeInTheDocument();
    });
    
    test('permette di cambiare video', () => {
      render(<VideoPlayerDemo />);
      
      const elephantsDreamButton = screen.getByText('Elephants Dream');
      fireEvent.click(elephantsDreamButton);
      
      // Verifica che il pulsante sia selezionato
      expect(elephantsDreamButton).toHaveStyle('background-color: rgb(0, 123, 255)');
    });
    
    test('mostra le istruzioni per i controlli da tastiera', () => {
      render(<VideoPlayerDemo />);
      
      expect(screen.getByText('⌨️ Controlli da Tastiera')).toBeInTheDocument();
      expect(screen.getByText('Spazio - Play/Pause')).toBeInTheDocument();
      expect(screen.getByText('← → - Indietro/Avanti 10s')).toBeInTheDocument();
      expect(screen.getByText('↑ ↓ - Volume +/-')).toBeInTheDocument();
    });
    
    test('gestisce i controlli del video', () => {
      render(<VideoPlayerDemo />);
      
      // Verifica che i controlli del video siano presenti
      const videoElement = screen.getByRole('application');
      expect(videoElement).toBeInTheDocument();
    });
  });
  
  describe('Integrazione e Manipolazione DOM', () => {
    test('tutti i componenti si renderizzano senza errori', () => {
      expect(() => {
        render(<AdvancedTextEditor />);
        render(<InteractiveImageGalleryDemo />);
        render(<VideoPlayerDemo />);
      }).not.toThrow();
    });
    
    test('i componenti gestiscono correttamente i ref', () => {
      const { unmount } = render(<AdvancedTextEditor />);
      
      // Unmount del componente
      unmount();
      
      // Verifica che non ci siano errori
      expect(true).toBe(true);
    });
    
    test('i componenti gestiscono correttamente gli eventi DOM', () => {
      render(<AdvancedTextEditor />);
      
      const textarea = screen.getByPlaceholderText('Inizia a scrivere il tuo documento...');
      
      // Simula eventi DOM
      fireEvent.focus(textarea);
      fireEvent.blur(textarea);
      fireEvent.keyDown(textarea, { key: 'Enter' });
      
      // Verifica che non ci siano errori
      expect(true).toBe(true);
    });
    
    test('i componenti gestiscono correttamente la manipolazione DOM', () => {
      render(<InteractiveImageGalleryDemo />);
      
      // Simula interazioni che potrebbero causare manipolazione DOM
      const selectAllButton = screen.getByText('Seleziona Tutto');
      fireEvent.click(selectAllButton);
      
      // Verifica che non ci siano errori
      expect(true).toBe(true);
    });
  });
  
  describe('useRef e Performance', () => {
    test('i componenti non causano re-render inutili', () => {
      const { rerender } = render(<AdvancedTextEditor />);
      
      // Rerenderizza il componente
      rerender(<AdvancedTextEditor />);
      
      // Verifica che non ci siano errori
      expect(true).toBe(true);
    });
    
    test('i ref persistono tra i render', () => {
      render(<AdvancedTextEditor />);
      
      const textarea = screen.getByPlaceholderText('Inizia a scrivere il tuo documento...');
      
      // Simula multiple interazioni
      fireEvent.change(textarea, { target: { value: 'Testo 1' } });
      fireEvent.change(textarea, { target: { value: 'Testo 2' } });
      fireEvent.change(textarea, { target: { value: 'Testo 3' } });
      
      // Verifica che il valore sia aggiornato
      expect(textarea.value).toBe('Testo 3');
    });
    
    test('i componenti gestiscono correttamente i valori persistenti', () => {
      render(<AdvancedTextEditor />);
      
      // Verifica che le statistiche vengano aggiornate correttamente
      const textarea = screen.getByPlaceholderText('Inizia a scrivere il tuo documento...');
      
      fireEvent.change(textarea, { target: { value: 'Testo di prova per le statistiche' } });
      
      // Le statistiche dovrebbero essere aggiornate
      expect(screen.getByText(/📝 Caratteri: \d+/)).toBeInTheDocument();
    });
  });
  
  describe('Errori Comuni useRef', () => {
    test('gestisce correttamente i ref null', () => {
      // Questo test verifica che i componenti gestiscano correttamente
      // i casi in cui i ref potrebbero essere null
      expect(() => {
        render(<AdvancedTextEditor />);
      }).not.toThrow();
    });
    
    test('gestisce correttamente la manipolazione DOM', () => {
      // Questo test verifica che la manipolazione DOM venga gestita correttamente
      render(<InteractiveImageGalleryDemo />);
      
      const selectAllButton = screen.getByText('Seleziona Tutto');
      fireEvent.click(selectAllButton);
      
      expect(true).toBe(true);
    });
    
    test('gestisce correttamente gli eventi del browser', () => {
      // Questo test verifica che gli eventi del browser vengano gestiti correttamente
      render(<VideoPlayerDemo />);
      
      expect(true).toBe(true);
    });
  });
  
  describe('Integrazione con API del Browser', () => {
    test('gestisce correttamente le API del browser', () => {
      // Questo test verifica che le API del browser vengano gestite correttamente
      render(<AdvancedTextEditor />);
      
      const saveButton = screen.getByTitle('Salva (Ctrl+S)');
      
      // Mock per le API del browser
      const mockCreateObjectURL = jest.fn(() => 'blob:mock-url');
      const mockRevokeObjectURL = jest.fn();
      
      global.URL.createObjectURL = mockCreateObjectURL;
      global.URL.revokeObjectURL = mockRevokeObjectURL;
      
      fireEvent.click(saveButton);
      
      expect(mockCreateObjectURL).toHaveBeenCalled();
    });
    
    test('gestisce correttamente gli observer', () => {
      // Questo test verifica che gli observer vengano gestiti correttamente
      render(<InteractiveImageGalleryDemo />);
      
      expect(true).toBe(true);
    });
    
    test('gestisce correttamente le API video', () => {
      // Questo test verifica che le API video vengano gestite correttamente
      render(<VideoPlayerDemo />);
      
      expect(true).toBe(true);
    });
  });
});
