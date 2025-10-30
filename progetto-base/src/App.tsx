import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import GlobalSwitcher from './lezioni/GlobalSwitcher'

function App() {
  const [count, setCount] = useState<number>(0)

  const handleClick = () => {
    setCount((count) => count + 1)
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={handleClick}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <div style={{ display: 'grid', gap: 16, marginTop: 24 }}>
        <GlobalSwitcher />
      </div>
    </>
  )
}

export default App

