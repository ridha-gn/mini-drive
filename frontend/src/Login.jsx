import { useState } from 'react'

const API_URL = 'http://72.146.196.148'
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
    <div className="container">
      <h1 className="title">Mini Drive</h1>
      <p className="subtitle">Welcome back! Please login to your account</p>
      
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
          required
        />
        <button type="submit" className="button">
          Login
        </button>
      </form>
      
      {error && <p className="error">{error}</p>}
      
      <p className="link-text">
        Don't have an account?{' '}
        <span onClick={() => setView('signup')} className="link">
          Sign up
        </span>
      </p>
    </div>
  )
}

export default Login
