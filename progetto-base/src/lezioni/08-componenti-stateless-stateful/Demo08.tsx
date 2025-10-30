import { useState } from 'react'

interface CounterProps {
  count: number
  onIncrement: () => void
  onDecrement: () => void
}

// Componente stateless (presentazionale)
function Counter({ count, onIncrement, onDecrement }: CounterProps) {
  return (
    <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8, marginBottom: 12 }}>
      <h4>Componente Stateless</h4>
      <p>Valore: {count}</p>
      <button onClick={onDecrement}>-</button>
      <button onClick={onIncrement} style={{ marginLeft: 8 }}>+</button>
    </div>
  )
}

// Componente stateful (container)
function TodoList() {
  const [todos, setTodos] = useState<string[]>(['Studiare React', 'Fare esercizi'])
  const [newTodo, setNewTodo] = useState<string>('')

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, newTodo])
      setNewTodo('')
    }
  }

  return (
    <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8 }}>
      <h4>Componente Stateful</h4>
      <input
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Nuovo todo..."
      />
      <button onClick={addTodo} style={{ marginLeft: 8 }}>Aggiungi</button>
      <ul>
        {todos.map((todo, i) => (
          <li key={i}>{todo}</li>
        ))}
      </ul>
    </div>
  )
}

export default function Demo08() {
  const [count, setCount] = useState<number>(0)

  return (
    <div style={{ padding: 12 }}>
      <h3>Lezione 08: Componenti Stateless/Stateful e useState</h3>
      <Counter
        count={count}
        onIncrement={() => setCount(count + 1)}
        onDecrement={() => setCount(count - 1)}
      />
      <TodoList />
    </div>
  )
}

