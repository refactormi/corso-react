import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import AdvancedShoppingCart from './esempi/01-shopping-cart-avanzato'
import AdvancedForm from './esempi/02-form-validazione-avanzata'
// import SearchWithCache from './esempi/03-ricerca-con-cache' // File non ancora disponibile

/**
 * Test per la Lezione 9: Tecniche Avanzate di Gestione Stato
 * 
 * Questi test verificano che gli esempi avanzati funzionino correttamente
 * e che le tecniche di gestione stato siano implementate correttamente.
 */

describe('Lezione 9: Tecniche Avanzate di Gestione Stato', () => {
  
  describe('AdvancedShoppingCart', () => {
    test('renderizza il carrello vuoto inizialmente', () => {
      render(<AdvancedShoppingCart />)
      expect(screen.getByText('Il carrello è vuoto')).toBeInTheDocument()
    })
    
    test('aggiunge prodotti al carrello', () => {
      render(<AdvancedShoppingCart />)
      const addButton = screen.getByText('Laptop Gaming - €1299.99')
      
      fireEvent.click(addButton)
      
      expect(screen.getByText('Laptop Gaming')).toBeInTheDocument()
      expect(screen.getByText(/Carrello \(1 articoli\)/)).toBeInTheDocument()
    })
    
    test('aggiorna le quantità dei prodotti', () => {
      render(<AdvancedShoppingCart />)
      const addButton = screen.getByText('Laptop Gaming - €1299.99')
      
      // Aggiungi prodotto
      fireEvent.click(addButton)
      
      // Incrementa quantità
      const incrementButtons = screen.getAllByText('+')
      fireEvent.click(incrementButtons[0])
      
      expect(screen.getByText('2')).toBeInTheDocument() // Quantità
    })
    
    test('rimuove prodotti dal carrello', () => {
      render(<AdvancedShoppingCart />)
      const addButton = screen.getByText('Laptop Gaming - €1299.99')
      
      // Aggiungi prodotto
      fireEvent.click(addButton)
      expect(screen.getByText('Laptop Gaming')).toBeInTheDocument()
      
      // Rimuovi prodotto
      const removeButtons = screen.getAllByText('Rimuovi')
      fireEvent.click(removeButtons[0])
      
      expect(screen.queryByText('Laptop Gaming')).not.toBeInTheDocument()
    })
    
    test('applica sconti al carrello', () => {
      render(<AdvancedShoppingCart />)
      const addButton = screen.getByText('Laptop Gaming - €1299.99')
      
      // Aggiungi prodotto
      fireEvent.click(addButton)
      
      // Applica sconto
      const discountButton = screen.getByText('Sconto 10%')
      fireEvent.click(discountButton)
      
      expect(screen.getByText(/Sconto \(10%\):/)).toBeInTheDocument()
    })
    
    test('svuota il carrello', () => {
      render(<AdvancedShoppingCart />)
      const addButton = screen.getByText('Laptop Gaming - €1299.99')
      
      // Aggiungi prodotto
      fireEvent.click(addButton)
      expect(screen.getByText('Laptop Gaming')).toBeInTheDocument()
      
      // Svuota carrello
      const clearButton = screen.getByText('Svuota Carrello')
      fireEvent.click(clearButton)
      
      expect(screen.getByText('Il carrello è vuoto')).toBeInTheDocument()
    })
  })
  
  describe('AdvancedForm', () => {
    test('renderizza tutti i campi del form', () => {
      render(<AdvancedForm />)
      
      expect(screen.getByPlaceholderText('Il tuo nome')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Il tuo cognome')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('la.tua@email.com')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('+39 123 456 7890')).toBeInTheDocument()
    })
    
    test('aggiorna i campi del form', () => {
      render(<AdvancedForm />)
      
      const nameInput = screen.getByPlaceholderText('Il tuo nome') as HTMLInputElement
      const emailInput = screen.getByPlaceholderText('la.tua@email.com') as HTMLInputElement
      
      fireEvent.change(nameInput, { target: { value: 'Mario Rossi' } })
      fireEvent.change(emailInput, { target: { value: 'mario@example.com' } })
      
      expect(nameInput.value).toBe('Mario Rossi')
      expect(emailInput.value).toBe('mario@example.com')
    })
    
    test('mostra errori di validazione per campi obbligatori', async () => {
      render(<AdvancedForm />)
      
      const submitButton = screen.getByText('Salva Dati')
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Il nome è richiesto')).toBeInTheDocument()
        expect(screen.getByText('Il cognome è richiesto')).toBeInTheDocument()
        expect(screen.getByText('L\'email è richiesta')).toBeInTheDocument()
      })
    })
    
    test('valida il formato dell\'email', async () => {
      render(<AdvancedForm />)
      
      const emailInput = screen.getByPlaceholderText('la.tua@email.com') as HTMLInputElement
      const submitButton = screen.getByText('Salva Dati')
      
      fireEvent.change(emailInput, { target: { value: 'email-non-valida' } })
      fireEvent.blur(emailInput)
      
      // La validazione dovrebbe essere triggerata quando il campo viene toccato
      await waitFor(() => {
        // Verifica che ci sia un errore di validazione
        expect(emailInput).toHaveStyle('border-color: rgb(220, 53, 69)')
      })
    })
    
    test('rimuove errori quando l\'utente inizia a digitare', async () => {
      render(<AdvancedForm />)
      
      const nameInput = screen.getByPlaceholderText('Il tuo nome') as HTMLInputElement
      const submitButton = screen.getByText('Salva Dati')
      
      // Prima mostra l'errore
      fireEvent.click(submitButton)
      await waitFor(() => {
        expect(screen.getByText('Il nome è richiesto')).toBeInTheDocument()
      })
      
      // Poi rimuove l'errore quando l'utente digita
      fireEvent.change(nameInput, { target: { value: 'M' } })
      await waitFor(() => {
        expect(screen.queryByText('Il nome è richiesto')).not.toBeInTheDocument()
      })
    })
    
    test('resetta il form', () => {
      render(<AdvancedForm />)
      
      const nameInput = screen.getByPlaceholderText('Il tuo nome') as HTMLInputElement
      const emailInput = screen.getByPlaceholderText('la.tua@email.com') as HTMLInputElement
      const resetButton = screen.getByText('Reset')
      
      // Compila alcuni campi
      fireEvent.change(nameInput, { target: { value: 'Mario Rossi' } })
      fireEvent.change(emailInput, { target: { value: 'mario@example.com' } })
      
      // Verifica che i campi siano compilati
      expect(nameInput.value).toBe('Mario Rossi')
      expect(emailInput.value).toBe('mario@example.com')
      
      // Resetta il form
      fireEvent.click(resetButton)
      
      // Verifica che i campi siano vuoti
      expect(nameInput.value).toBe('')
      expect(emailInput.value).toBe('')
    })
    
    test('invia il form con dati validi', async () => {
      render(<AdvancedForm />)
      
      const nameInput = screen.getByPlaceholderText('Il tuo nome') as HTMLInputElement
      const lastNameInput = screen.getByPlaceholderText('Il tuo cognome') as HTMLInputElement
      const emailInput = screen.getByPlaceholderText('la.tua@email.com') as HTMLInputElement
      const dateInput = screen.getByLabelText('Data di Nascita *') as HTMLInputElement
      const submitButton = screen.getByText('Salva Dati')
      
      // Compila il form con dati validi
      fireEvent.change(nameInput, { target: { value: 'Mario' } })
      fireEvent.change(lastNameInput, { target: { value: 'Rossi' } })
      fireEvent.change(emailInput, { target: { value: 'mario@example.com' } })
      fireEvent.change(dateInput, { target: { value: '1990-01-01' } })
      
      // Invia il form
      fireEvent.click(submitButton)
      
      // Verifica che il pulsante mostri "Invio in corso..."
      expect(screen.getByText('Invio in corso...')).toBeInTheDocument()
      
      // Aspetta che il form sia inviato
      await waitFor(() => {
        expect(screen.getByText('✅ Form inviato con successo! I dati sono stati salvati.')).toBeInTheDocument()
      }, { timeout: 3000 })
    })
  })
})

// Test di integrazione per verificare che tutti i componenti funzionino insieme
describe('Integrazione Lezione 9', () => {
  test('tutti i componenti si renderizzano senza errori', () => {
    expect(() => {
      render(<AdvancedShoppingCart />)
      render(<AdvancedForm />)
    }).not.toThrow()
  })
  
  test('i componenti mantengono il loro stato indipendentemente', () => {
    const { rerender } = render(<AdvancedShoppingCart />)
    
    // Aggiungi un prodotto
    fireEvent.click(screen.getByText('Laptop Gaming - €1299.99'))
    expect(screen.getByText('Laptop Gaming')).toBeInTheDocument()
    
    // Rerenderizza il componente
    rerender(<AdvancedShoppingCart />)
    
    // Il prodotto dovrebbe essere ancora presente
    expect(screen.getByText('Laptop Gaming')).toBeInTheDocument()
  })
})

