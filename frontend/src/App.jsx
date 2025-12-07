import { useState, useEffect } from 'react'
import Login from './Login'
import Signup from './Signup'
import FileManager from './FileManager'

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
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>Mini Drive</h1>
      {view === 'login' ? (
        <Login setToken={setToken} setView={setView} />
      ) : (
        <Signup setView={setView} />
      )}
    </div>
  )
}

export default App
