// Demo16 - Introduzione React Query per il playground
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

// Simulazione API semplificata
let todosDB = [
  { id: 1, text: 'Imparare React Query', completed: false },
  { id: 2, text: 'Creare una demo', completed: true },
  { id: 3, text: 'Testare le funzionalità', completed: false }
];

let nextId = 4;

const api = {
  getTodos: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [...todosDB];
  },
  
  addTodo: async (text) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const newTodo = { id: nextId++, text, completed: false };
    todosDB.push(newTodo);
    return newTodo;
  },
  
  toggleTodo: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const todo = todosDB.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
    }
    return todo;
  },
  
  deleteTodo: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const index = todosDB.findIndex(t => t.id === id);
    if (index !== -1) {
      const deleted = todosDB[index];
      todosDB.splice(index, 1);
      return deleted;
    }
  }
};

// Demo useQuery
function TodoList() {
  const {
    data: todos,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['todos'],
    queryFn: api.getTodos,
    staleTime: 30 * 1000, // 30 secondi
  });
  
  if (isLoading) {
    return (
      <div style={{
        padding: 20,
        textAlign: 'center',
        border: '2px dashed #007bff',
        borderRadius: 8,
        backgroundColor: '#f8f9fa'
      }}>
        <div>🔄 Caricamento todos...</div>
        <div style={{
          width: 30,
          height: 30,
          border: '3px solid #f3f3f3',
          borderTop: '3px solid #007bff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '16px auto'
        }} />
      </div>
    );
  }
  
  if (isError) {
    return (
      <div style={{
        padding: 16,
        backgroundColor: '#f8d7da',
        color: '#721c24',
        borderRadius: 8,
        border: '1px solid #f5c6cb'
      }}>
        <div>❌ Errore: {error.message}</div>
        <button
          onClick={() => refetch()}
          style={{
            marginTop: 8,
            padding: '6px 12px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer'
          }}
        >
          🔄 Riprova
        </button>
      </div>
    );
  }
  
  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 16
      }}>
        <h3 style={{ margin: 0 }}>📝 Todo List ({todos.length})</h3>
        <button
          onClick={() => refetch()}
          style={{
            padding: '6px 12px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 12
          }}
        >
          🔄 Aggiorna
        </button>
      </div>
      
      <div style={{ marginBottom: 16 }}>
        <AddTodoForm />
      </div>
      
      <div style={{ space: 8 }}>
        {todos.map(todo => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </div>
    </div>
  );
}

// Form per aggiungere todo
function AddTodoForm() {
  const [text, setText] = useState('');
  const queryClient = useQueryClient();
  
  const addMutation = useMutation({
    mutationFn: api.addTodo,
    onSuccess: (newTodo) => {
      // Aggiorna la cache
      queryClient.setQueryData(['todos'], (oldTodos) => {
        return oldTodos ? [...oldTodos, newTodo] : [newTodo];
      });
      setText('');
    }
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      addMutation.mutate(text.trim());
    }
  };
  
  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8 }}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Nuovo todo..."
        style={{
          flex: 1,
          padding: 8,
          border: '1px solid #ccc',
          borderRadius: 4,
          fontSize: 14
        }}
      />
      <button
        type="submit"
        disabled={addMutation.isLoading || !text.trim()}
        style={{
          padding: '8px 16px',
          backgroundColor: addMutation.isLoading ? '#6c757d' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: addMutation.isLoading ? 'not-allowed' : 'pointer',
          fontSize: 14
        }}
      >
        {addMutation.isLoading ? '⏳' : '➕'} Aggiungi
      </button>
    </form>
  );
}

// Singolo todo item
function TodoItem({ todo }) {
  const queryClient = useQueryClient();
  
  const toggleMutation = useMutation({
    mutationFn: () => api.toggleTodo(todo.id),
    onMutate: async () => {
      // Optimistic update
      await queryClient.cancelQueries(['todos']);
      
      const previousTodos = queryClient.getQueryData(['todos']);
      
      queryClient.setQueryData(['todos'], (oldTodos) => {
        return oldTodos?.map(t => 
          t.id === todo.id ? { ...t, completed: !t.completed } : t
        );
      });
      
      return { previousTodos };
    },
    onError: (err, variables, context) => {
      // Rollback
      queryClient.setQueryData(['todos'], context.previousTodos);
    }
  });
  
  const deleteMutation = useMutation({
    mutationFn: () => api.deleteTodo(todo.id),
    onMutate: async () => {
      // Optimistic update
      await queryClient.cancelQueries(['todos']);
      
      const previousTodos = queryClient.getQueryData(['todos']);
      
      queryClient.setQueryData(['todos'], (oldTodos) => {
        return oldTodos?.filter(t => t.id !== todo.id);
      });
      
      return { previousTodos };
    },
    onError: (err, variables, context) => {
      // Rollback
      queryClient.setQueryData(['todos'], context.previousTodos);
    }
  });
  
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: 12,
      border: '1px solid #dee2e6',
      borderRadius: 6,
      marginBottom: 8,
      backgroundColor: todo.completed ? '#f8f9fa' : 'white'
    }}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleMutation.mutate()}
        disabled={toggleMutation.isLoading}
        style={{ transform: 'scale(1.2)' }}
      />
      
      <span style={{
        flex: 1,
        textDecoration: todo.completed ? 'line-through' : 'none',
        color: todo.completed ? '#6c757d' : '#333',
        fontSize: 14
      }}>
        {todo.text}
      </span>
      
      <button
        onClick={() => deleteMutation.mutate()}
        disabled={deleteMutation.isLoading}
        style={{
          padding: '4px 8px',
          backgroundColor: deleteMutation.isLoading ? '#6c757d' : '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: deleteMutation.isLoading ? 'not-allowed' : 'pointer',
          fontSize: 12
        }}
      >
        {deleteMutation.isLoading ? '⏳' : '🗑️'}
      </button>
    </div>
  );
}

// Query Client setup
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // 30 secondi
      cacheTime: 5 * 60 * 1000, // 5 minuti
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Componente principale
export default function Demo16() {
  return (
    <div style={{ padding: 20 }}>
      <h2>⚡ Lezione 16: Introduzione React Query</h2>
      <p style={{ color: '#666', marginBottom: 32 }}>
        Scopri la potenza di React Query per la gestione dello stato server con questa Todo App interattiva.
      </p>
      
      <QueryClientProvider client={queryClient}>
        <TodoList />
      </QueryClientProvider>
      
      <div style={{
        marginTop: 32,
        padding: 16,
        backgroundColor: '#e7f3ff',
        borderRadius: 8,
        border: '1px solid #b3d9ff'
      }}>
        <h4 style={{ margin: '0 0 12px 0', color: '#0056b3' }}>
          💡 Funzionalità React Query Dimostrate:
        </h4>
        <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14 }}>
          <li><strong>useQuery:</strong> Caricamento automatico con cache e stati</li>
          <li><strong>useMutation:</strong> Operazioni di scrittura (add, toggle, delete)</li>
          <li><strong>Optimistic Updates:</strong> UI aggiornata immediatamente</li>
          <li><strong>Cache Management:</strong> Dati condivisi e sincronizzati</li>
          <li><strong>Error Handling:</strong> Gestione errori con rollback automatico</li>
        </ul>
      </div>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
