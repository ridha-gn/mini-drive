import { useState, useEffect } from 'react'
import Login from './Login'
import Signup from './Signup'
import FileManager from './FileManager'
import './styles.css'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [view, setView] = useState('login')

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  }, [token])

  const handleLogout = () => {
    setToken(null)
    setView('login')
  }

  if (token) {
    return <FileManager token={token} onLogout={handleLogout} />
  }

  return (
    <div>
      {view === 'login' ? (
        <Login setToken={setToken} setView={setView} />
      ) : (
        <Signup setView={setView} />
      )}
    </div>
  )
}

export default App
