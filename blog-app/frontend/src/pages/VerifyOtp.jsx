import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import api, { errorMessage } from '../api'
import { useAuth } from '../context/AuthContext'

export default function VerifyOtp() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { loginWithToken } = useAuth()
  const email = params.get('email') || ''
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState(`We sent a 6-digit code to ${email}.`)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const res = await api.post('/api/auth/verify-otp', { email, otp })
      await loginWithToken(res.data.token)   // verified -> logged in straight away
      navigate('/')
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  async function handleResend() {
    setError('')
    try {
      const res = await api.post('/api/auth/resend-otp', { email })
      setInfo(res.data.message)
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h1>Verify your email</h1>
      <p className="muted">{info}</p>
      {error && <p className="error">{error}</p>}
      <label>OTP
        <input value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} inputMode="numeric" required />
      </label>
      <button type="submit">Verify</button>
      <button type="button" className="link" onClick={handleResend}>Resend code</button>
    </form>
  )
}
