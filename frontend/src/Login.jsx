import { useState } from 'react'

const API_URL = 'http://localhost:8000'

function Login({ setToken, setView }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch(`${API_URL}/login?username=${username}&password=${password}`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Invalid credentials')
      }

      const data = await response.json()
      setToken(data.access_token)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h2>Login</h2>
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
          Login
        </button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        Don't have an account?{' '}
        <span onClick={() => setView('signup')} style={{ color: 'blue', cursor: 'pointer' }}>
          Sign up
        </span>
      </p>
    </div>
  )
}

export default Login
