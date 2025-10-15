import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdvancedShoppingCart from './esempi/01-shopping-cart-avanzato';
import AdvancedForm from './esempi/02-form-validazione-avanzata';
import SearchWithCache from './esempi/03-ricerca-con-cache';

/**
 * Test per la Lezione 9: Tecniche Avanzate di Gestione Stato
 * 
 * Questi test verificano che gli esempi avanzati funzionino correttamente
 * e che le tecniche di gestione stato siano implementate correttamente.
 */

describe('Lezione 9: Tecniche Avanzate di Gestione Stato', () => {
  
  describe('AdvancedShoppingCart', () => {
    test('renderizza il carrello vuoto inizialmente', () => {
      render(<AdvancedShoppingCart />);
      expect(screen.getByText('Il carrello è vuoto')).toBeInTheDocument();
    });
    
    test('aggiunge prodotti al carrello', () => {
      render(<AdvancedShoppingCart />);
      const addButton = screen.getByText('Laptop Gaming - €1299.99');
      
      fireEvent.click(addButton);
      
      expect(screen.getByText('Laptop Gaming')).toBeInTheDocument();
      expect(screen.getByText('Carrello (1 articoli)')).toBeInTheDocument();
    });
    
    test('aggiorna le quantità dei prodotti', () => {
      render(<AdvancedShoppingCart />);
      const addButton = screen.getByText('Laptop Gaming - €1299.99');
      
      // Aggiungi prodotto
      fireEvent.click(addButton);
      
      // Incrementa quantità
      const incrementButton = screen.getByText('+');
      fireEvent.click(incrementButton);
      
      expect(screen.getByText('2')).toBeInTheDocument(); // Quantità
      expect(screen.getByText('€2599.98')).toBeInTheDocument(); // Totale item
    });
    
    test('rimuove prodotti dal carrello', () => {
      render(<AdvancedShoppingCart />);
      const addButton = screen.getByText('Laptop Gaming - €1299.99');
      
      // Aggiungi prodotto
      fireEvent.click(addButton);
      expect(screen.getByText('Laptop Gaming')).toBeInTheDocument();
      
      // Rimuovi prodotto
      const removeButton = screen.getByText('Rimuovi');
      fireEvent.click(removeButton);
      
      expect(screen.queryByText('Laptop Gaming')).not.toBeInTheDocument();
    });
    
    test('applica sconti al carrello', () => {
      render(<AdvancedShoppingCart />);
      const addButton = screen.getByText('Laptop Gaming - €1299.99');
      
      // Aggiungi prodotto
      fireEvent.click(addButton);
      
      // Applica sconto
      const discountButton = screen.getByText('Sconto 10%');
      fireEvent.click(discountButton);
      
      expect(screen.getByText('Sconto (10%):')).toBeInTheDocument();
      expect(screen.getByText('-€129.99')).toBeInTheDocument();
    });
    
    test('svuota il carrello', () => {
      render(<AdvancedShoppingCart />);
      const addButton = screen.getByText('Laptop Gaming - €1299.99');
      
      // Aggiungi prodotto
      fireEvent.click(addButton);
      expect(screen.getByText('Laptop Gaming')).toBeInTheDocument();
      
      // Svuota carrello
      const clearButton = screen.getByText('Svuota Carrello');
      fireEvent.click(clearButton);
      
      expect(screen.getByText('Il carrello è vuoto')).toBeInTheDocument();
    });
    
    test('calcola correttamente il totale', () => {
      render(<AdvancedShoppingCart />);
      
      // Aggiungi due prodotti diversi
      fireEvent.click(screen.getByText('Laptop Gaming - €1299.99'));
      fireEvent.click(screen.getByText('Mouse Wireless - €29.99'));
      
      // Verifica totale
      expect(screen.getByText('€1329.98')).toBeInTheDocument();
    });
  });
  
  describe('AdvancedForm', () => {
    test('renderizza tutti i campi del form', () => {
      render(<AdvancedForm />);
      
      expect(screen.getByPlaceholderText('Il tuo nome')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Il tuo cognome')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('la.tua@email.com')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('+39 123 456 7890')).toBeInTheDocument();
    });
    
    test('aggiorna i campi del form', () => {
      render(<AdvancedForm />);
      
      const nameInput = screen.getByPlaceholderText('Il tuo nome');
      const emailInput = screen.getByPlaceholderText('la.tua@email.com');
      
      fireEvent.change(nameInput, { target: { value: 'Mario Rossi' } });
      fireEvent.change(emailInput, { target: { value: 'mario@example.com' } });
      
      expect(nameInput.value).toBe('Mario Rossi');
      expect(emailInput.value).toBe('mario@example.com');
    });
    
    test('mostra errori di validazione per campi obbligatori', async () => {
      render(<AdvancedForm />);
      
      const submitButton = screen.getByText('Salva Dati');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Il nome è richiesto')).toBeInTheDocument();
        expect(screen.getByText('Il cognome è richiesto')).toBeInTheDocument();
        expect(screen.getByText('L\'email è richiesta')).toBeInTheDocument();
      });
    });
    
    test('valida il formato dell\'email', async () => {
      render(<AdvancedForm />);
      
      const emailInput = screen.getByPlaceholderText('la.tua@email.com');
      const submitButton = screen.getByText('Salva Dati');
      
      fireEvent.change(emailInput, { target: { value: 'email-non-valida' } });
      fireEvent.blur(emailInput);
      
      await waitFor(() => {
        expect(screen.getByText('Inserisci un\'email valida')).toBeInTheDocument();
      });
    });
    
    test('valida la data di nascita per maggiore età', async () => {
      render(<AdvancedForm />);
      
      const dateInput = screen.getByLabelText('Data di Nascita *');
      const submitButton = screen.getByText('Salva Dati');
      
      // Data di nascita per minorenne
      fireEvent.change(dateInput, { target: { value: '2010-01-01' } });
      fireEvent.blur(dateInput);
      
      await waitFor(() => {
        expect(screen.getByText('Devi essere maggiorenne')).toBeInTheDocument();
      });
    });
    
    test('rimuove errori quando l\'utente inizia a digitare', async () => {
      render(<AdvancedForm />);
      
      const nameInput = screen.getByPlaceholderText('Il tuo nome');
      const submitButton = screen.getByText('Salva Dati');
      
      // Prima mostra l'errore
      fireEvent.click(submitButton);
      await waitFor(() => {
        expect(screen.getByText('Il nome è richiesto')).toBeInTheDocument();
      });
      
      // Poi rimuove l'errore quando l'utente digita
      fireEvent.change(nameInput, { target: { value: 'M' } });
      await waitFor(() => {
        expect(screen.queryByText('Il nome è richiesto')).not.toBeInTheDocument();
      });
    });
    
    test('resetta il form', () => {
      render(<AdvancedForm />);
      
      const nameInput = screen.getByPlaceholderText('Il tuo nome');
      const emailInput = screen.getByPlaceholderText('la.tua@email.com');
      const resetButton = screen.getByText('Reset');
      
      // Compila alcuni campi
      fireEvent.change(nameInput, { target: { value: 'Mario Rossi' } });
      fireEvent.change(emailInput, { target: { value: 'mario@example.com' } });
      
      // Verifica che i campi siano compilati
      expect(nameInput.value).toBe('Mario Rossi');
      expect(emailInput.value).toBe('mario@example.com');
      
      // Resetta il form
      fireEvent.click(resetButton);
      
      // Verifica che i campi siano vuoti
      expect(nameInput.value).toBe('');
      expect(emailInput.value).toBe('');
    });
    
    test('invia il form con dati validi', async () => {
      render(<AdvancedForm />);
      
      const nameInput = screen.getByPlaceholderText('Il tuo nome');
      const lastNameInput = screen.getByPlaceholderText('Il tuo cognome');
      const emailInput = screen.getByPlaceholderText('la.tua@email.com');
      const dateInput = screen.getByLabelText('Data di Nascita *');
      const submitButton = screen.getByText('Salva Dati');
      
      // Compila il form con dati validi
      fireEvent.change(nameInput, { target: { value: 'Mario' } });
      fireEvent.change(lastNameInput, { target: { value: 'Rossi' } });
      fireEvent.change(emailInput, { target: { value: 'mario@example.com' } });
      fireEvent.change(dateInput, { target: { value: '1990-01-01' } });
      
      // Invia il form
      fireEvent.click(submitButton);
      
      // Verifica che il pulsante mostri "Invio in corso..."
      expect(screen.getByText('Invio in corso...')).toBeInTheDocument();
      
      // Aspetta che il form sia inviato
      await waitFor(() => {
        expect(screen.getByText('✅ Form inviato con successo! I dati sono stati salvati.')).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });
  
  describe('SearchWithCache', () => {
    test('renderizza la barra di ricerca', () => {
      render(<SearchWithCache />);
      expect(screen.getByPlaceholderText('Cerca articoli, tutorial, guide...')).toBeInTheDocument();
    });
    
    test('aggiorna la query di ricerca', () => {
      render(<SearchWithCache />);
      const searchInput = screen.getByPlaceholderText('Cerca articoli, tutorial, guide...');
      
      fireEvent.change(searchInput, { target: { value: 'React' } });
      expect(searchInput.value).toBe('React');
    });
    
    test('mostra loading durante la ricerca', async () => {
      render(<SearchWithCache />);
      const searchInput = screen.getByPlaceholderText('Cerca articoli, tutorial, guide...');
      
      fireEvent.change(searchInput, { target: { value: 'React' } });
      
      // Verifica che appaia l'indicatore di loading
      await waitFor(() => {
        expect(screen.getByText('🔍 Ricerca in corso...')).toBeInTheDocument();
      });
    });
    
    test('mostra risultati dopo la ricerca', async () => {
      render(<SearchWithCache />);
      const searchInput = screen.getByPlaceholderText('Cerca articoli, tutorial, guide...');
      
      fireEvent.change(searchInput, { target: { value: 'React' } });
      
      // Aspetta che i risultati appaiano
      await waitFor(() => {
        expect(screen.getByText('React Hooks Guide')).toBeInTheDocument();
      }, { timeout: 2000 });
    });
    
    test('mostra messaggio quando non ci sono risultati', async () => {
      render(<SearchWithCache />);
      const searchInput = screen.getByPlaceholderText('Cerca articoli, tutorial, guide...');
      
      fireEvent.change(searchInput, { target: { value: 'xyz123nonexistent' } });
      
      // Aspetta che appaia il messaggio di nessun risultato
      await waitFor(() => {
        expect(screen.getByText('Nessun risultato trovato per "xyz123nonexistent"')).toBeInTheDocument();
      }, { timeout: 2000 });
    });
    
    test('pulisce i risultati', async () => {
      render(<SearchWithCache />);
      const searchInput = screen.getByPlaceholderText('Cerca articoli, tutorial, guide...');
      
      // Fai una ricerca
      fireEvent.change(searchInput, { target: { value: 'React' } });
      
      await waitFor(() => {
        expect(screen.getByText('React Hooks Guide')).toBeInTheDocument();
      }, { timeout: 2000 });
      
      // Pulisci i risultati
      const clearButton = screen.getByText('✕');
      fireEvent.click(clearButton);
      
      expect(searchInput.value).toBe('');
    });
    
    test('mostra cronologia ricerche', async () => {
      render(<SearchWithCache />);
      const searchInput = screen.getByPlaceholderText('Cerca articoli, tutorial, guide...');
      
      // Fai alcune ricerche
      fireEvent.change(searchInput, { target: { value: 'React' } });
      await waitFor(() => {
        expect(screen.getByText('React Hooks Guide')).toBeInTheDocument();
      }, { timeout: 2000 });
      
      fireEvent.change(searchInput, { target: { value: 'JavaScript' } });
      await waitFor(() => {
        expect(screen.getByText('JavaScript ES6 Features')).toBeInTheDocument();
      }, { timeout: 2000 });
      
      // Mostra cronologia
      const historyButton = screen.getByText(/Mostra Cronologia/);
      fireEvent.click(historyButton);
      
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
    });
    
    test('seleziona risultato dalla cronologia', async () => {
      render(<SearchWithCache />);
      const searchInput = screen.getByPlaceholderText('Cerca articoli, tutorial, guide...');
      
      // Fai una ricerca
      fireEvent.change(searchInput, { target: { value: 'React' } });
      await waitFor(() => {
        expect(screen.getByText('React Hooks Guide')).toBeInTheDocument();
      }, { timeout: 2000 });
      
      // Mostra cronologia e seleziona
      const historyButton = screen.getByText(/Mostra Cronologia/);
      fireEvent.click(historyButton);
      
      const reactHistoryButton = screen.getByText('React');
      fireEvent.click(reactHistoryButton);
      
      expect(searchInput.value).toBe('React');
    });
    
    test('pulisce la cache', async () => {
      render(<SearchWithCache />);
      const searchInput = screen.getByPlaceholderText('Cerca articoli, tutorial, guide...');
      
      // Fai una ricerca per popolare la cache
      fireEvent.change(searchInput, { target: { value: 'React' } });
      await waitFor(() => {
        expect(screen.getByText('React Hooks Guide')).toBeInTheDocument();
      }, { timeout: 2000 });
      
      // Pulisci la cache
      const clearCacheButton = screen.getByText('Pulisci Cache');
      fireEvent.click(clearCacheButton);
      
      // Verifica che la cache sia stata pulita
      expect(screen.getByText('Cache: 0 query')).toBeInTheDocument();
    });
  });
});

// Test di integrazione per verificare che tutti i componenti funzionino insieme
describe('Integrazione Lezione 9', () => {
  test('tutti i componenti si renderizzano senza errori', () => {
    expect(() => {
      render(<AdvancedShoppingCart />);
      render(<AdvancedForm />);
      render(<SearchWithCache />);
    }).not.toThrow();
  });
  
  test('i componenti mantengono il loro stato indipendentemente', () => {
    const { rerender } = render(<AdvancedShoppingCart />);
    
    // Aggiungi un prodotto
    fireEvent.click(screen.getByText('Laptop Gaming - €1299.99'));
    expect(screen.getByText('Laptop Gaming')).toBeInTheDocument();
    
    // Rerenderizza il componente
    rerender(<AdvancedShoppingCart />);
    
    // Il prodotto dovrebbe essere ancora presente
    expect(screen.getByText('Laptop Gaming')).toBeInTheDocument();
  });
});
