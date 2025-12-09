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

      setMessage('Account created successfully! Redirecting...')
      setTimeout(() => setView('login'), 2000)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="container">
      <h1 className="title">Mini Drive</h1>
      <p className="subtitle">Create your account and start storing files</p>
      
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Choose a username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input"
          required
        />
        <input
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
          required
        />
        <button type="submit" className="button">
          Sign Up
        </button>
      </form>
      
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
      
      <p className="link-text">
        Already have an account?{' '}
        <span onClick={() => setView('login')} className="link">
          Login
        </span>
      </p>
    </div>
  )
}

export default Signup
