import { useState } from 'react'

const API_URL = 'http://localhost:8000'

function Signup({ setView }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    try {
      const response = await fetch(`${API_URL}/signup?username=${username}&password=${password}`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Username already exists')
      }

      setMessage('Account created successfully')
      setTimeout(() => setView('login'), 2000)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: '10px', fontSize: '14px' }}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: '10px', fontSize: '14px' }}
          required
        />
        <button type="submit" style={{ padding: '10px', fontSize: '14px', cursor: 'pointer' }}>
          Sign Up
        </button>
      </form>
      {message && <p style={{ color: 'green', marginTop: '10px' }}>{message}</p>}
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        Already have an account?{' '}
        <span onClick={() => setView('login')} style={{ color: 'blue', cursor: 'pointer' }}>
          Login
        </span>
      </p>
    </div>
  )
}

export default Signup
