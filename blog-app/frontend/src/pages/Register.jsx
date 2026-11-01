import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api, { API_URL, errorMessage } from '../api'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)

  // One change handler for all inputs, using the input's "name" attribute.
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSending(true)
    try {
      await api.post('/api/auth/register', form)
      navigate(`/verify-otp?email=${encodeURIComponent(form.email)}`)
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="form">
      <h1>Create account</h1>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>Name
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>Email
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>Password (min 6 characters)
          <input name="password" type="password" minLength={6} value={form.password} onChange={handleChange} required />
        </label>
        <button type="submit" disabled={sending}>{sending ? 'Sending OTP...' : 'Register'}</button>
      </form>

      <div className="divider">or</div>
      <button className="google" onClick={() => (window.location.href = `${API_URL}/oauth2/authorization/google`)}>
        Sign up with Google
      </button>

      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  )
}
