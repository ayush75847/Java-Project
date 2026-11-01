import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import api, { API_URL, errorMessage } from '../api'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { loginWithToken } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(params.get('error') ? 'Google login failed. Try again.' : '')

  // Method 1: email + password
  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const res = await api.post('/api/auth/login', { email, password })
      await loginWithToken(res.data.token)
      navigate('/')
    } catch (err) {
      // 403 = registered but not verified yet -> send them to the OTP page
      if (err.response?.status === 403) {
        await api.post('/api/auth/resend-otp', { email }).catch(() => {})
        navigate(`/verify-otp?email=${encodeURIComponent(email)}`)
        return
      }
      setError(errorMessage(err))
    }
  }

  // Method 2: Google. This is a full page redirect, not an axios call.
  // Spring Security sends the user to Google, then back to /oauth2/callback in this app.
  function loginWithGoogle() {
    window.location.href = `${API_URL}/oauth2/authorization/google`
  }

  return (
    <div className="form">
      <h1>Login</h1>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button type="submit">Login</button>
      </form>

      <div className="divider">or</div>
      <button className="google" onClick={loginWithGoogle}>Continue with Google</button>

      <p>No account? <Link to="/register">Register</Link></p>
    </div>
  )
}
