import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from './esempi/01-dashboard-condiviso';
import NotificationApp from './esempi/02-sistema-notifiche-context';
import ShoppingCartApp from './esempi/03-carrello-comunicazione';

/**
 * Test per la Lezione 10: Passaggio di Stato tra Componenti
 * 
 * Questi test verificano che gli esempi di comunicazione tra componenti
 * funzionino correttamente e che il passaggio di stato sia implementato correttamente.
 */

describe('Lezione 10: Passaggio di Stato tra Componenti', () => {
  
  describe('Dashboard - Stato Condiviso', () => {
    test('renderizza il dashboard con lista utenti', async () => {
      render(<Dashboard />);
      
      // Verifica che appaia il loading iniziale
      expect(screen.getByText('Caricamento utenti...')).toBeInTheDocument();
      
      // Aspetta che gli utenti vengano caricati
      await waitFor(() => {
        expect(screen.getByText('Mario Rossi')).toBeInTheDocument();
      }, { timeout: 2000 });
    });
    
    test('seleziona un utente dalla sidebar', async () => {
      render(<Dashboard />);
      
      // Aspetta che gli utenti vengano caricati
      await waitFor(() => {
        expect(screen.getByText('Mario Rossi')).toBeInTheDocument();
      }, { timeout: 2000 });
      
      // Clicca su un utente
      fireEvent.click(screen.getByText('Mario Rossi'));
      
      // Verifica che i dettagli dell'utente vengano mostrati
      expect(screen.getByText('Dettagli Utente')).toBeInTheDocument();
      expect(screen.getByText('mario.rossi@example.com')).toBeInTheDocument();
    });
    
    test('modifica i dettagli di un utente', async () => {
      render(<Dashboard />);
      
      // Aspetta che gli utenti vengano caricati
      await waitFor(() => {
        expect(screen.getByText('Mario Rossi')).toBeInTheDocument();
      }, { timeout: 2000 });
      
      // Seleziona un utente
      fireEvent.click(screen.getByText('Mario Rossi'));
      
      // Clicca su modifica
      fireEvent.click(screen.getByText('✏️ Modifica'));
      
      // Modifica il nome
      const nameInput = screen.getByDisplayValue('Mario Rossi');
      fireEvent.change(nameInput, { target: { value: 'Mario Rossi Modificato' } });
      
      // Salva le modifiche
      fireEvent.click(screen.getByText('💾 Salva Modifiche'));
      
      // Verifica che le modifiche siano state salvate
      await waitFor(() => {
        expect(screen.getByText('Mario Rossi Modificato')).toBeInTheDocument();
      });
    });
    
    test('ricarica la lista utenti', async () => {
      render(<Dashboard />);
      
      // Aspetta che gli utenti vengano caricati
      await waitFor(() => {
        expect(screen.getByText('Mario Rossi')).toBeInTheDocument();
      }, { timeout: 2000 });
      
      // Clicca su ricarica
      const refreshButton = screen.getByText('🔄');
      fireEvent.click(refreshButton);
      
      // Verifica che appaia il loading
      expect(screen.getByText('Caricamento utenti...')).toBeInTheDocument();
    });
  });
  
  describe('NotificationApp - Context API', () => {
    test('renderizza l\'app delle notifiche', () => {
      render(<NotificationApp />);
      expect(screen.getByText('🔔 Sistema di Notifiche')).toBeInTheDocument();
    });
    
    test('mostra notifica di successo', async () => {
      render(<NotificationApp />);
      
      const successButton = screen.getByText('✅ Successo');
      fireEvent.click(successButton);
      
      await waitFor(() => {
        expect(screen.getByText('Operazione Completata')).toBeInTheDocument();
        expect(screen.getByText('I dati sono stati salvati con successo!')).toBeInTheDocument();
      });
    });
    
    test('mostra notifica di errore', async () => {
      render(<NotificationApp />);
      
      const errorButton = screen.getByText('❌ Errore');
      fireEvent.click(errorButton);
      
      await waitFor(() => {
        expect(screen.getByText('Errore')).toBeInTheDocument();
        expect(screen.getByText('Si è verificato un errore durante l\'operazione. Riprova.')).toBeInTheDocument();
      });
    });
    
    test('mostra notifica di avviso', async () => {
      render(<NotificationApp />);
      
      const warningButton = screen.getByText('⚠️ Avviso');
      fireEvent.click(warningButton);
      
      await waitFor(() => {
        expect(screen.getByText('Attenzione')).toBeInTheDocument();
        expect(screen.getByText('Questa operazione non può essere annullata. Sei sicuro?')).toBeInTheDocument();
      });
    });
    
    test('rimuove una notifica manualmente', async () => {
      render(<NotificationApp />);
      
      // Aggiungi una notifica
      fireEvent.click(screen.getByText('✅ Successo'));
      
      await waitFor(() => {
        expect(screen.getByText('Operazione Completata')).toBeInTheDocument();
      });
      
      // Rimuovi la notifica
      const closeButton = screen.getByText('✕');
      fireEvent.click(closeButton);
      
      // Verifica che la notifica sia stata rimossa
      await waitFor(() => {
        expect(screen.queryByText('Operazione Completata')).not.toBeInTheDocument();
      });
    });
    
    test('pulisce tutte le notifiche', async () => {
      render(<NotificationApp />);
      
      // Aggiungi più notifiche
      fireEvent.click(screen.getByText('✅ Successo'));
      fireEvent.click(screen.getByText('❌ Errore'));
      fireEvent.click(screen.getByText('⚠️ Avviso'));
      
      await waitFor(() => {
        expect(screen.getByText(/Notifiche \(3\)/)).toBeInTheDocument();
      });
      
      // Pulisci tutte le notifiche
      fireEvent.click(screen.getByText('Pulisci Tutto'));
      
      // Verifica che tutte le notifiche siano state rimosse
      await waitFor(() => {
        expect(screen.queryByText(/Notifiche \(/)).not.toBeInTheDocument();
      });
    });
    
    test('simula operazione con notifiche', async () => {
      render(<NotificationApp />);
      
      const simulateButton = screen.getByText('💾 Simula Salvataggio');
      fireEvent.click(simulateButton);
      
      // Verifica che appaia la notifica di caricamento
      await waitFor(() => {
        expect(screen.getByText('Salvataggio')).toBeInTheDocument();
        expect(screen.getByText('Salvataggio in corso...')).toBeInTheDocument();
      });
      
      // Aspetta che l'operazione si completi
      await waitFor(() => {
        expect(screen.getByText('Salvataggio Completato')).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });
  
  describe('ShoppingCartApp - Comunicazione tra Componenti', () => {
    test('renderizza l\'app del carrello', () => {
      render(<ShoppingCartApp />);
      expect(screen.getByText('🛍️ Shop Online')).toBeInTheDocument();
    });
    
    test('aggiunge prodotto al carrello', () => {
      render(<ShoppingCartApp />);
      
      // Verifica che il carrello sia inizialmente vuoto
      expect(screen.getByText('0 articoli - €0.00')).toBeInTheDocument();
      
      // Aggiungi un prodotto
      const addButton = screen.getByText('🛒 Aggiungi al Carrello');
      fireEvent.click(addButton);
      
      // Verifica che il carrello sia stato aggiornato
      expect(screen.getByText('1 articoli - €2499.99')).toBeInTheDocument();
    });
    
    test('apre e chiude il carrello', () => {
      render(<ShoppingCartApp />);
      
      // Aggiungi un prodotto
      fireEvent.click(screen.getByText('🛒 Aggiungi al Carrello'));
      
      // Apri il carrello
      fireEvent.click(screen.getByText('🛒 Carrello'));
      
      // Verifica che il carrello sia aperto
      expect(screen.getByText('🛒 Carrello')).toBeInTheDocument();
      expect(screen.getByText('MacBook Pro 16"')).toBeInTheDocument();
      
      // Chiudi il carrello
      fireEvent.click(screen.getByText('❌ Chiudi'));
      
      // Verifica che il carrello sia chiuso
      expect(screen.queryByText('MacBook Pro 16"')).not.toBeInTheDocument();
    });
    
    test('aggiorna quantità nel carrello', () => {
      render(<ShoppingCartApp />);
      
      // Aggiungi un prodotto
      fireEvent.click(screen.getByText('🛒 Aggiungi al Carrello'));
      
      // Apri il carrello
      fireEvent.click(screen.getByText('🛒 Carrello'));
      
      // Incrementa la quantità
      const incrementButton = screen.getByText('+');
      fireEvent.click(incrementButton);
      
      // Verifica che la quantità sia stata aggiornata
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('€4999.98')).toBeInTheDocument();
    });
    
    test('rimuove prodotto dal carrello', () => {
      render(<ShoppingCartApp />);
      
      // Aggiungi un prodotto
      fireEvent.click(screen.getByText('🛒 Aggiungi al Carrello'));
      
      // Apri il carrello
      fireEvent.click(screen.getByText('🛒 Carrello'));
      
      // Rimuovi il prodotto
      fireEvent.click(screen.getByText('Rimuovi'));
      
      // Verifica che il prodotto sia stato rimosso
      expect(screen.getByText('Il carrello è vuoto')).toBeInTheDocument();
      expect(screen.getByText('0 articoli - €0.00')).toBeInTheDocument();
    });
    
    test('svuota il carrello', () => {
      render(<ShoppingCartApp />);
      
      // Aggiungi più prodotti
      fireEvent.click(screen.getByText('🛒 Aggiungi al Carrello'));
      fireEvent.click(screen.getByText('🛒 Aggiungi al Carrello'));
      
      // Apri il carrello
      fireEvent.click(screen.getByText('🛒 Carrello'));
      
      // Svuota il carrello
      fireEvent.click(screen.getByText('🗑️ Svuota'));
      
      // Verifica che il carrello sia vuoto
      expect(screen.getByText('Il carrello è vuoto')).toBeInTheDocument();
    });
    
    test('aggiunge prodotto con quantità personalizzata', () => {
      render(<ShoppingCartApp />);
      
      // Cambia la quantità
      const quantityInput = screen.getByDisplayValue('1');
      fireEvent.change(quantityInput, { target: { value: '3' } });
      
      // Aggiungi al carrello
      fireEvent.click(screen.getByText('🛒 Aggiungi al Carrello'));
      
      // Verifica che la quantità corretta sia stata aggiunta
      expect(screen.getByText('3 articoli - €7499.97')).toBeInTheDocument();
    });
    
    test('mostra prodotti non disponibili', () => {
      render(<ShoppingCartApp />);
      
      // Verifica che ci sia un prodotto non disponibile
      expect(screen.getByText('❌ Non Disponibile')).toBeInTheDocument();
    });
  });
});

// Test di integrazione per verificare che tutti i componenti funzionino insieme
describe('Integrazione Lezione 10', () => {
  test('tutti i componenti si renderizzano senza errori', () => {
    expect(() => {
      render(<Dashboard />);
      render(<NotificationApp />);
      render(<ShoppingCartApp />);
    }).not.toThrow();
  });
  
  test('i componenti mantengono il loro stato indipendentemente', () => {
    const { rerender } = render(<ShoppingCartApp />);
    
    // Aggiungi un prodotto
    fireEvent.click(screen.getByText('🛒 Aggiungi al Carrello'));
    expect(screen.getByText('1 articoli - €2499.99')).toBeInTheDocument();
    
    // Rerenderizza il componente
    rerender(<ShoppingCartApp />);
    
    // Il prodotto dovrebbe essere ancora presente
    expect(screen.getByText('1 articoli - €2499.99')).toBeInTheDocument();
  });
  
  test('la comunicazione tra componenti funziona correttamente', async () => {
    render(<NotificationApp />);
    
    // Aggiungi una notifica
    fireEvent.click(screen.getByText('✅ Successo'));
    
    // Verifica che la notifica appaia
    await waitFor(() => {
      expect(screen.getByText('Operazione Completata')).toBeInTheDocument();
    });
    
    // Verifica che il contatore delle notifiche sia aggiornato
    expect(screen.getByText(/Notifiche \(1\)/)).toBeInTheDocument();
  });
});
