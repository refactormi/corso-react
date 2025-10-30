import { useState } from 'react'

/**
 * Esempio 2: Lista Todo
 * 
 * Questo esempio dimostra la gestione di stato complesso con:
 * - Array di oggetti
 * - Aggiunta di elementi
 * - Modifica di elementi esistenti
 * - Gestione di input utente
 */

interface Todo {
  id: number
  text: string
  completed: boolean
  createdAt: string
}

function TodoList() {
  // Stato per la lista dei todo
  const [todos, setTodos] = useState<Todo[]>([])
  
  // Stato per il valore dell'input
  const [inputValue, setInputValue] = useState<string>('')
  
  // Funzione per aggiungere un nuovo todo
  const addTodo = () => {
    if (inputValue.trim()) {
      const newTodo: Todo = {
        id: Date.now(), // ID univoco basato su timestamp
        text: inputValue.trim(),
        completed: false,
        createdAt: new Date().toLocaleTimeString()
      }
      
      // Aggiorna lo stato aggiungendo il nuovo todo
      setTodos(prev => [...prev, newTodo])
      
      // Pulisce l'input
      setInputValue('')
    }
  }
  
  // Funzione per completare/non completare un todo
  const toggleTodo = (id: number) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id 
        ? { ...todo, completed: !todo.completed }
        : todo
    ))
  }
  
  // Funzione per eliminare un todo
  const deleteTodo = (id: number) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }
  
  // Funzione per gestire l'invio del form
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    addTodo()
  }
  
  // Conta i todo completati
  const completedCount = todos.filter(todo => todo.completed).length
  const totalCount = todos.length
  
  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ccc', 
      borderRadius: '8px',
      maxWidth: '500px',
      margin: '20px auto'
    }}>
      <h2>Lista Todo</h2>
      
      {/* Form per aggiungere nuovi todo */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Scrivi un nuovo todo..."
            style={{
              flex: 1,
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
          <button 
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Aggiungi
          </button>
        </div>
      </form>
      
      {/* Statistiche */}
      <div style={{ 
        marginBottom: '20px', 
        padding: '10px', 
        backgroundColor: '#f8f9fa',
        borderRadius: '4px',
        fontSize: '14px'
      }}>
        <strong>Statistiche:</strong> {completedCount} di {totalCount} completati
        {totalCount > 0 && (
          <span style={{ marginLeft: '10px' }}>
            ({Math.round((completedCount / totalCount) * 100)}% completato)
          </span>
        )}
      </div>
      
      {/* Lista dei todo */}
      {todos.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          color: '#666', 
          fontStyle: 'italic',
          padding: '20px'
        }}>
          Nessun todo. Aggiungi il primo!
        </div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {todos.map(todo => (
            <li 
              key={todo.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px',
                marginBottom: '8px',
                backgroundColor: todo.completed ? '#d4edda' : '#fff',
                border: '1px solid #dee2e6',
                borderRadius: '4px',
                transition: 'all 0.2s ease'
              }}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                style={{ marginRight: '10px' }}
              />
              
              <span 
                style={{
                  flex: 1,
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  color: todo.completed ? '#6c757d' : '#212529',
                  cursor: 'pointer'
                }}
                onClick={() => toggleTodo(todo.id)}
              >
                {todo.text}
              </span>
              
              <span style={{ 
                fontSize: '12px', 
                color: '#6c757d',
                marginRight: '10px'
              }}>
                {todo.createdAt}
              </span>
              
              <button
                onClick={() => deleteTodo(todo.id)}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Elimina
              </button>
            </li>
          ))}
        </ul>
      )}
      
      {/* Pulsanti di azione globale */}
      {todos.length > 0 && (
        <div style={{ 
          marginTop: '20px', 
          display: 'flex', 
          gap: '10px',
          justifyContent: 'center'
        }}>
          <button
            onClick={() => setTodos(prev => prev.map(todo => ({ ...todo, completed: true })))}
            style={{
              padding: '8px 16px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Completa Tutti
          </button>
          
          <button
            onClick={() => setTodos(prev => prev.map(todo => ({ ...todo, completed: false })))}
            style={{
              padding: '8px 16px',
              backgroundColor: '#ffc107',
              color: 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Annulla Tutti
          </button>
          
          <button
            onClick={() => setTodos([])}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Svuota Lista
          </button>
        </div>
      )}
    </div>
  )
}

export default TodoList

