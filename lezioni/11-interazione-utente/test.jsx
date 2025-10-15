import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RegistrationForm from './esempi/01-form-registrazione';
import AdvancedSearch from './esempi/02-ricerca-avanzata';
import FeedbackSystem from './esempi/03-sistema-feedback';

/**
 * Test per la Lezione 11: Interazione Utente e Validazione
 * 
 * Questi test verificano che gli esempi di interazione utente
 * funzionino correttamente e che la validazione sia implementata correttamente.
 */

describe('Lezione 11: Interazione Utente e Validazione', () => {
  
  describe('RegistrationForm - Form Handling', () => {
    test('renderizza il form di registrazione', () => {
      render(<RegistrationForm />);
      expect(screen.getByText('📝 Registrazione Utente')).toBeInTheDocument();
    });
    
    test('mostra il primo step del form', () => {
      render(<RegistrationForm />);
      expect(screen.getByText('👤 Informazioni Personali')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Nome *')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Cognome *')).toBeInTheDocument();
    });
    
    test('aggiorna i campi del form', () => {
      render(<RegistrationForm />);
      
      const nameInput = screen.getByPlaceholderText('Nome *');
      const emailInput = screen.getByPlaceholderText('Email *');
      
      fireEvent.change(nameInput, { target: { value: 'Mario' } });
      fireEvent.change(emailInput, { target: { value: 'mario@example.com' } });
      
      expect(nameInput.value).toBe('Mario');
      expect(emailInput.value).toBe('mario@example.com');
    });
    
    test('mostra errori di validazione per campi obbligatori', async () => {
      render(<RegistrationForm />);
      
      const nextButton = screen.getByText('Avanti →');
      fireEvent.click(nextButton);
      
      await waitFor(() => {
        expect(screen.getByText('Nome deve essere di almeno 2 caratteri')).toBeInTheDocument();
        expect(screen.getByText('Cognome deve essere di almeno 2 caratteri')).toBeInTheDocument();
        expect(screen.getByText('Email non valida')).toBeInTheDocument();
      });
    });
    
    test('valida il formato dell\'email', async () => {
      render(<RegistrationForm />);
      
      const emailInput = screen.getByPlaceholderText('Email *');
      fireEvent.change(emailInput, { target: { value: 'email-non-valida' } });
      fireEvent.blur(emailInput);
      
      await waitFor(() => {
        expect(screen.getByText('Email non valida')).toBeInTheDocument();
      });
    });
    
    test('valida la password', async () => {
      render(<RegistrationForm />);
      
      const passwordInput = screen.getByPlaceholderText('Password *');
      fireEvent.change(passwordInput, { target: { value: '123' } });
      fireEvent.blur(passwordInput);
      
      await waitFor(() => {
        expect(screen.getByText('Password deve essere di almeno 8 caratteri')).toBeInTheDocument();
      });
    });
    
    test('valida la conferma password', async () => {
      render(<RegistrationForm />);
      
      const passwordInput = screen.getByPlaceholderText('Password *');
      const confirmPasswordInput = screen.getByPlaceholderText('Conferma Password *');
      
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'different123' } });
      fireEvent.blur(confirmPasswordInput);
      
      await waitFor(() => {
        expect(screen.getByText('Le password non coincidono')).toBeInTheDocument();
      });
    });
    
    test('naviga tra gli step del form', async () => {
      render(<RegistrationForm />);
      
      // Compila il primo step
      fireEvent.change(screen.getByPlaceholderText('Nome *'), { target: { value: 'Mario' } });
      fireEvent.change(screen.getByPlaceholderText('Cognome *'), { target: { value: 'Rossi' } });
      fireEvent.change(screen.getByPlaceholderText('Email *'), { target: { value: 'mario@example.com' } });
      fireEvent.change(screen.getByPlaceholderText('Password *'), { target: { value: 'Password123' } });
      fireEvent.change(screen.getByPlaceholderText('Conferma Password *'), { target: { value: 'Password123' } });
      
      // Vai al secondo step
      fireEvent.click(screen.getByText('Avanti →'));
      
      await waitFor(() => {
        expect(screen.getByText('📋 Informazioni Aggiuntive')).toBeInTheDocument();
      });
      
      // Torna indietro
      fireEvent.click(screen.getByText('← Indietro'));
      
      await waitFor(() => {
        expect(screen.getByText('👤 Informazioni Personali')).toBeInTheDocument();
      });
    });
    
    test('completa la registrazione con successo', async () => {
      render(<RegistrationForm />);
      
      // Compila tutti i campi obbligatori
      fireEvent.change(screen.getByPlaceholderText('Nome *'), { target: { value: 'Mario' } });
      fireEvent.change(screen.getByPlaceholderText('Cognome *'), { target: { value: 'Rossi' } });
      fireEvent.change(screen.getByPlaceholderText('Email *'), { target: { value: 'mario@example.com' } });
      fireEvent.change(screen.getByPlaceholderText('Password *'), { target: { value: 'Password123' } });
      fireEvent.change(screen.getByPlaceholderText('Conferma Password *'), { target: { value: 'Password123' } });
      
      // Vai al secondo step
      fireEvent.click(screen.getByText('Avanti →'));
      
      await waitFor(() => {
        expect(screen.getByText('📋 Informazioni Aggiuntive')).toBeInTheDocument();
      });
      
      // Compila il secondo step
      fireEvent.change(screen.getByDisplayValue(''), { target: { value: '1990-01-01' } });
      fireEvent.change(screen.getByDisplayValue(''), { target: { value: 'male' } });
      fireEvent.change(screen.getByPlaceholderText('Indirizzo *'), { target: { value: 'Via Roma 123' } });
      fireEvent.change(screen.getByPlaceholderText('Città *'), { target: { value: 'Milano' } });
      fireEvent.change(screen.getByPlaceholderText('CAP *'), { target: { value: '20100' } });
      
      // Vai al terzo step
      fireEvent.click(screen.getByText('Avanti →'));
      
      await waitFor(() => {
        expect(screen.getByText('⚙️ Preferenze e Termini')).toBeInTheDocument();
      });
      
      // Accetta i termini
      fireEvent.click(screen.getByLabelText(/Accetto i termini/));
      
      // Completa la registrazione
      fireEvent.click(screen.getByText('✅ Completa Registrazione'));
      
      // Verifica il successo
      await waitFor(() => {
        expect(screen.getByText('✅')).toBeInTheDocument();
        expect(screen.getByText('Registrazione Completata!')).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });
  
  describe('AdvancedSearch - Ricerca e Input', () => {
    test('renderizza la ricerca avanzata', () => {
      render(<AdvancedSearch />);
      expect(screen.getByText('🔍 Ricerca Avanzata')).toBeInTheDocument();
    });
    
    test('aggiorna la query di ricerca', () => {
      render(<AdvancedSearch />);
      const searchInput = screen.getByPlaceholderText('Cerca prodotti, categorie, descrizioni...');
      
      fireEvent.change(searchInput, { target: { value: 'iPhone' } });
      expect(searchInput.value).toBe('iPhone');
    });
    
    test('mostra loading durante la ricerca', async () => {
      render(<AdvancedSearch />);
      const searchInput = screen.getByPlaceholderText('Cerca prodotti, categorie, descrizioni...');
      
      fireEvent.change(searchInput, { target: { value: 'iPhone' } });
      
      // Verifica che appaia l'indicatore di loading
      await waitFor(() => {
        expect(screen.getByText('Ricerca in corso...')).toBeInTheDocument();
      });
    });
    
    test('mostra risultati dopo la ricerca', async () => {
      render(<AdvancedSearch />);
      const searchInput = screen.getByPlaceholderText('Cerca prodotti, categorie, descrizioni...');
      
      fireEvent.change(searchInput, { target: { value: 'iPhone' } });
      
      // Aspetta che i risultati appaiano
      await waitFor(() => {
        expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
      }, { timeout: 2000 });
    });
    
    test('filtra i risultati per categoria', async () => {
      render(<AdvancedSearch />);
      
      // Fai una ricerca
      fireEvent.change(screen.getByPlaceholderText('Cerca prodotti, categorie, descrizioni...'), { 
        target: { value: 'electronics' } 
      });
      
      await waitFor(() => {
        expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
      }, { timeout: 2000 });
      
      // Applica filtro categoria
      const categorySelect = screen.getByDisplayValue('Tutte le categorie');
      fireEvent.change(categorySelect, { target: { value: 'electronics' } });
      
      // Verifica che i risultati siano filtrati
      await waitFor(() => {
        expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
        expect(screen.queryByText('React Guide')).not.toBeInTheDocument();
      });
    });
    
    test('ordina i risultati per prezzo', async () => {
      render(<AdvancedSearch />);
      
      // Fai una ricerca
      fireEvent.change(screen.getByPlaceholderText('Cerca prodotti, categorie, descrizioni...'), { 
        target: { value: 'electronics' } 
      });
      
      await waitFor(() => {
        expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
      }, { timeout: 2000 });
      
      // Ordina per prezzo crescente
      const sortSelect = screen.getByDisplayValue('Rilevanza');
      fireEvent.change(sortSelect, { target: { value: 'price-asc' } });
      
      // Verifica che i risultati siano ordinati
      await waitFor(() => {
        expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
      });
    });
    
    test('pulisce la ricerca', async () => {
      render(<AdvancedSearch />);
      
      // Fai una ricerca
      fireEvent.change(screen.getByPlaceholderText('Cerca prodotti, categorie, descrizioni...'), { 
        target: { value: 'iPhone' } 
      });
      
      await waitFor(() => {
        expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
      }, { timeout: 2000 });
      
      // Pulisci la ricerca
      fireEvent.click(screen.getByText('Pulisci'));
      
      // Verifica che la ricerca sia stata pulita
      expect(screen.getByPlaceholderText('Cerca prodotti, categorie, descrizioni...').value).toBe('');
    });
    
    test('seleziona un prodotto per vedere i dettagli', async () => {
      render(<AdvancedSearch />);
      
      // Fai una ricerca
      fireEvent.change(screen.getByPlaceholderText('Cerca prodotti, categorie, descrizioni...'), { 
        target: { value: 'iPhone' } 
      });
      
      await waitFor(() => {
        expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
      }, { timeout: 2000 });
      
      // Clicca su un prodotto
      fireEvent.click(screen.getByText('iPhone 15 Pro'));
      
      // Verifica che appaia il modal con i dettagli
      await waitFor(() => {
        expect(screen.getByText('Dettaglio Prodotto')).toBeInTheDocument();
        expect(screen.getByText('€1199.99')).toBeInTheDocument();
      });
    });
  });
  
  describe('FeedbackSystem - Notifiche e Feedback', () => {
    test('renderizza il sistema di feedback', () => {
      render(<FeedbackSystem />);
      expect(screen.getByText('🔔 Sistema di Feedback')).toBeInTheDocument();
    });
    
    test('mostra notifica di successo', async () => {
      render(<FeedbackSystem />);
      
      const successButton = screen.getByText('✅ Successo');
      fireEvent.click(successButton);
      
      await waitFor(() => {
        expect(screen.getByText('Operazione Completata')).toBeInTheDocument();
        expect(screen.getByText('I dati sono stati salvati con successo!')).toBeInTheDocument();
      });
    });
    
    test('mostra notifica di errore con azione', async () => {
      render(<FeedbackSystem />);
      
      const errorButton = screen.getByText('❌ Errore');
      fireEvent.click(errorButton);
      
      await waitFor(() => {
        expect(screen.getByText('Errore')).toBeInTheDocument();
        expect(screen.getByText('Si è verificato un errore durante l\'operazione.')).toBeInTheDocument();
        expect(screen.getByText('Riprova')).toBeInTheDocument();
      });
    });
    
    test('mostra notifica di avviso', async () => {
      render(<FeedbackSystem />);
      
      const warningButton = screen.getByText('⚠️ Avviso');
      fireEvent.click(warningButton);
      
      await waitFor(() => {
        expect(screen.getByText('Attenzione')).toBeInTheDocument();
        expect(screen.getByText('Questa operazione non può essere annullata. Sei sicuro?')).toBeInTheDocument();
      });
    });
    
    test('rimuove una notifica manualmente', async () => {
      render(<FeedbackSystem />);
      
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
      render(<FeedbackSystem />);
      
      // Aggiungi più notifiche
      fireEvent.click(screen.getByText('✅ Successo'));
      fireEvent.click(screen.getByText('❌ Errore'));
      fireEvent.click(screen.getByText('⚠️ Avviso'));
      
      await waitFor(() => {
        expect(screen.getByText(/Notifiche Attive: 3/)).toBeInTheDocument();
      });
      
      // Pulisci tutte le notifiche
      fireEvent.click(screen.getByText('Pulisci Tutto'));
      
      // Verifica che tutte le notifiche siano state rimosse
      await waitFor(() => {
        expect(screen.queryByText(/Notifiche Attive:/)).not.toBeInTheDocument();
      });
    });
    
    test('simula loading con progresso', async () => {
      render(<FeedbackSystem />);
      
      const loadingButton = screen.getByText('📊 Simula Loading');
      fireEvent.click(loadingButton);
      
      // Verifica che appaia il loading
      await waitFor(() => {
        expect(screen.getByText('Caricamento dati...')).toBeInTheDocument();
      });
      
      // Aspetta che il loading si completi
      await waitFor(() => {
        expect(screen.getByText('Caricamento Completato')).toBeInTheDocument();
      }, { timeout: 3000 });
    });
    
    test('mostra modal di conferma', async () => {
      render(<FeedbackSystem />);
      
      const confirmButton = screen.getByText('🗑️ Conferma Eliminazione');
      fireEvent.click(confirmButton);
      
      // Verifica che appaia il modal di conferma
      await waitFor(() => {
        expect(screen.getByText('Conferma Eliminazione')).toBeInTheDocument();
        expect(screen.getByText('Sei sicuro di voler eliminare questo elemento?')).toBeInTheDocument();
      });
      
      // Conferma l'eliminazione
      fireEvent.click(screen.getByText('Conferma'));
      
      // Verifica che appaia la notifica di successo
      await waitFor(() => {
        expect(screen.getByText('Elemento Eliminato')).toBeInTheDocument();
      });
    });
    
    test('annulla la conferma', async () => {
      render(<FeedbackSystem />);
      
      const confirmButton = screen.getByText('🗑️ Conferma Eliminazione');
      fireEvent.click(confirmButton);
      
      // Verifica che appaia il modal di conferma
      await waitFor(() => {
        expect(screen.getByText('Conferma Eliminazione')).toBeInTheDocument();
      });
      
      // Annulla l'eliminazione
      fireEvent.click(screen.getByText('Annulla'));
      
      // Verifica che appaia la notifica di annullamento
      await waitFor(() => {
        expect(screen.getByText('Operazione Annullata')).toBeInTheDocument();
      });
    });
    
    test('feedback in tempo reale per digitazione', async () => {
      render(<FeedbackSystem />);
      
      const input = screen.getByPlaceholderText('Digita qualcosa per vedere il feedback...');
      fireEvent.input(input, { target: { value: 'test' } });
      
      // Verifica che appaia il feedback di digitazione
      await waitFor(() => {
        expect(screen.getByText('Digitando...')).toBeInTheDocument();
      });
    });
    
    test('feedback per azioni in tempo reale', async () => {
      render(<FeedbackSystem />);
      
      const likeButton = screen.getByText('👍 Mi Piace');
      fireEvent.click(likeButton);
      
      // Verifica che appaia il feedback
      await waitFor(() => {
        expect(screen.getByText('Azione "like" completata!')).toBeInTheDocument();
      });
    });
  });
});

// Test di integrazione per verificare che tutti i componenti funzionino insieme
describe('Integrazione Lezione 11', () => {
  test('tutti i componenti si renderizzano senza errori', () => {
    expect(() => {
      render(<RegistrationForm />);
      render(<AdvancedSearch />);
      render(<FeedbackSystem />);
    }).not.toThrow();
  });
  
  test('i componenti mantengono il loro stato indipendentemente', () => {
    const { rerender } = render(<RegistrationForm />);
    
    // Compila un campo
    fireEvent.change(screen.getByPlaceholderText('Nome *'), { target: { value: 'Mario' } });
    expect(screen.getByPlaceholderText('Nome *').value).toBe('Mario');
    
    // Rerenderizza il componente
    rerender(<RegistrationForm />);
    
    // Il campo dovrebbe essere ancora compilato
    expect(screen.getByPlaceholderText('Nome *').value).toBe('Mario');
  });
  
  test('la validazione funziona correttamente', async () => {
    render(<RegistrationForm />);
    
    // Prova a procedere senza compilare i campi
    fireEvent.click(screen.getByText('Avanti →'));
    
    // Verifica che appaiano gli errori
    await waitFor(() => {
      expect(screen.getByText('Nome deve essere di almeno 2 caratteri')).toBeInTheDocument();
    });
  });
});
