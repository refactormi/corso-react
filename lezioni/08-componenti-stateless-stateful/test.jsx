import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SimpleCounter from './esempi/01-contatore-semplice';
import TodoList from './esempi/02-lista-todo';
import ContactForm from './esempi/03-form-validazione';

/**
 * Test per la Lezione 8: Componenti Stateless/Stateful e useState
 * 
 * Questi test verificano che gli esempi funzionino correttamente
 * e che la gestione dello stato sia implementata correttamente.
 */

describe('Lezione 8: useState e Gestione Stato', () => {
  
  describe('SimpleCounter', () => {
    test('renderizza il contatore con valore iniziale 0', () => {
      render(<SimpleCounter />);
      expect(screen.getByText('Contatore: 0')).toBeInTheDocument();
    });
    
    test('incrementa il contatore quando si clicca +1', () => {
      render(<SimpleCounter />);
      const incrementButton = screen.getByText('+1');
      
      fireEvent.click(incrementButton);
      expect(screen.getByText('Contatore: 1')).toBeInTheDocument();
      
      fireEvent.click(incrementButton);
      expect(screen.getByText('Contatore: 2')).toBeInTheDocument();
    });
    
    test('decrementa il contatore quando si clicca -1', () => {
      render(<SimpleCounter />);
      const decrementButton = screen.getByText('-1');
      
      fireEvent.click(decrementButton);
      expect(screen.getByText('Contatore: -1')).toBeInTheDocument();
      
      fireEvent.click(decrementButton);
      expect(screen.getByText('Contatore: -2')).toBeInTheDocument();
    });
    
    test('resetta il contatore quando si clicca Reset', () => {
      render(<SimpleCounter />);
      const incrementButton = screen.getByText('+1');
      const resetButton = screen.getByText('Reset');
      
      // Incrementa prima
      fireEvent.click(incrementButton);
      fireEvent.click(incrementButton);
      expect(screen.getByText('Contatore: 2')).toBeInTheDocument();
      
      // Poi resetta
      fireEvent.click(resetButton);
      expect(screen.getByText('Contatore: 0')).toBeInTheDocument();
    });
  });
  
  describe('TodoList', () => {
    test('renderizza la lista vuota inizialmente', () => {
      render(<TodoList />);
      expect(screen.getByText('Nessun todo. Aggiungi il primo!')).toBeInTheDocument();
    });
    
    test('aggiunge un nuovo todo', () => {
      render(<TodoList />);
      const input = screen.getByPlaceholderText('Scrivi un nuovo todo...');
      const addButton = screen.getByText('Aggiungi');
      
      fireEvent.change(input, { target: { value: 'Nuovo todo' } });
      fireEvent.click(addButton);
      
      expect(screen.getByText('Nuovo todo')).toBeInTheDocument();
      expect(input.value).toBe(''); // Input dovrebbe essere pulito
    });
    
    test('non aggiunge todo vuoti', () => {
      render(<TodoList />);
      const input = screen.getByPlaceholderText('Scrivi un nuovo todo...');
      const addButton = screen.getByText('Aggiungi');
      
      fireEvent.change(input, { target: { value: '   ' } }); // Solo spazi
      fireEvent.click(addButton);
      
      expect(screen.getByText('Nessun todo. Aggiungi il primo!')).toBeInTheDocument();
    });
    
    test('completa e decompleta un todo', () => {
      render(<TodoList />);
      const input = screen.getByPlaceholderText('Scrivi un nuovo todo...');
      const addButton = screen.getByText('Aggiungi');
      
      // Aggiungi un todo
      fireEvent.change(input, { target: { value: 'Test todo' } });
      fireEvent.click(addButton);
      
      const todoText = screen.getByText('Test todo');
      expect(todoText).not.toHaveStyle('text-decoration: line-through');
      
      // Clicca per completare
      fireEvent.click(todoText);
      expect(todoText).toHaveStyle('text-decoration: line-through');
      
      // Clicca per decompletare
      fireEvent.click(todoText);
      expect(todoText).not.toHaveStyle('text-decoration: line-through');
    });
    
    test('elimina un todo', () => {
      render(<TodoList />);
      const input = screen.getByPlaceholderText('Scrivi un nuovo todo...');
      const addButton = screen.getByText('Aggiungi');
      
      // Aggiungi un todo
      fireEvent.change(input, { target: { value: 'Todo da eliminare' } });
      fireEvent.click(addButton);
      
      expect(screen.getByText('Todo da eliminare')).toBeInTheDocument();
      
      // Elimina il todo
      const deleteButton = screen.getByText('Elimina');
      fireEvent.click(deleteButton);
      
      expect(screen.queryByText('Todo da eliminare')).not.toBeInTheDocument();
    });
    
    test('aggiorna le statistiche correttamente', () => {
      render(<TodoList />);
      const input = screen.getByPlaceholderText('Scrivi un nuovo todo...');
      const addButton = screen.getByText('Aggiungi');
      
      // Aggiungi due todo
      fireEvent.change(input, { target: { value: 'Todo 1' } });
      fireEvent.click(addButton);
      
      fireEvent.change(input, { target: { value: 'Todo 2' } });
      fireEvent.click(addButton);
      
      // Verifica statistiche iniziali
      expect(screen.getByText('0 di 2 completati')).toBeInTheDocument();
      
      // Completa un todo
      const todo1 = screen.getByText('Todo 1');
      fireEvent.click(todo1);
      
      // Verifica statistiche aggiornate
      expect(screen.getByText('1 di 2 completati')).toBeInTheDocument();
      expect(screen.getByText('(50% completato)')).toBeInTheDocument();
    });
  });
  
  describe('ContactForm', () => {
    test('renderizza tutti i campi del form', () => {
      render(<ContactForm />);
      
      expect(screen.getByPlaceholderText('Il tuo nome')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('la.tua@email.com')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('+39 123 456 7890')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Scrivi il tuo messaggio...')).toBeInTheDocument();
      expect(screen.getByText('Iscrivimi alla newsletter per ricevere aggiornamenti')).toBeInTheDocument();
    });
    
    test('aggiorna i campi del form', () => {
      render(<ContactForm />);
      
      const nameInput = screen.getByPlaceholderText('Il tuo nome');
      const emailInput = screen.getByPlaceholderText('la.tua@email.com');
      
      fireEvent.change(nameInput, { target: { value: 'Mario Rossi' } });
      fireEvent.change(emailInput, { target: { value: 'mario@example.com' } });
      
      expect(nameInput.value).toBe('Mario Rossi');
      expect(emailInput.value).toBe('mario@example.com');
    });
    
    test('mostra errori di validazione per campi obbligatori', async () => {
      render(<ContactForm />);
      
      const submitButton = screen.getByText('Invia Messaggio');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Il nome è richiesto')).toBeInTheDocument();
        expect(screen.getByText('L\'email è richiesta')).toBeInTheDocument();
        expect(screen.getByText('Il messaggio è richiesto')).toBeInTheDocument();
      });
    });
    
    test('valida il formato dell\'email', async () => {
      render(<ContactForm />);
      
      const emailInput = screen.getByPlaceholderText('la.tua@email.com');
      const submitButton = screen.getByText('Invia Messaggio');
      
      fireEvent.change(emailInput, { target: { value: 'email-non-valida' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Inserisci un\'email valida')).toBeInTheDocument();
      });
    });
    
    test('valida la lunghezza del messaggio', async () => {
      render(<ContactForm />);
      
      const messageInput = screen.getByPlaceholderText('Scrivi il tuo messaggio...');
      const submitButton = screen.getByText('Invia Messaggio');
      
      fireEvent.change(messageInput, { target: { value: 'Corto' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Il messaggio deve essere di almeno 10 caratteri')).toBeInTheDocument();
      });
    });
    
    test('rimuove errori quando l\'utente inizia a digitare', async () => {
      render(<ContactForm />);
      
      const nameInput = screen.getByPlaceholderText('Il tuo nome');
      const submitButton = screen.getByText('Invia Messaggio');
      
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
    
    test('invia il form con dati validi', async () => {
      render(<ContactForm />);
      
      const nameInput = screen.getByPlaceholderText('Il tuo nome');
      const emailInput = screen.getByPlaceholderText('la.tua@email.com');
      const messageInput = screen.getByPlaceholderText('Scrivi il tuo messaggio...');
      const submitButton = screen.getByText('Invia Messaggio');
      
      // Compila il form
      fireEvent.change(nameInput, { target: { value: 'Mario Rossi' } });
      fireEvent.change(emailInput, { target: { value: 'mario@example.com' } });
      fireEvent.change(messageInput, { target: { value: 'Questo è un messaggio di test abbastanza lungo' } });
      
      // Invia il form
      fireEvent.click(submitButton);
      
      // Verifica che il pulsante mostri "Invio in corso..."
      expect(screen.getByText('Invio in corso...')).toBeInTheDocument();
      
      // Aspetta che il form sia inviato
      await waitFor(() => {
        expect(screen.getByText('✅ Form inviato con successo! Ti risponderemo presto.')).toBeInTheDocument();
      }, { timeout: 3000 });
    });
    
    test('resetta il form', () => {
      render(<ContactForm />);
      
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
  });
});

// Test di integrazione per verificare che tutti i componenti funzionino insieme
describe('Integrazione Lezione 8', () => {
  test('tutti i componenti si renderizzano senza errori', () => {
    expect(() => {
      render(<SimpleCounter />);
      render(<TodoList />);
      render(<ContactForm />);
    }).not.toThrow();
  });
});
