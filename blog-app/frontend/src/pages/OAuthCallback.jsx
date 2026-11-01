import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// After Google login the backend redirects here with ?token=...
export default function OAuthCallback() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { loginWithToken } = useAuth()
  const done = useRef(false) // React StrictMode runs effects twice in dev; only handle once

  useEffect(() => {
    if (done.current) return
    done.current = true

    const token = params.get('token')
    if (!token) {
      navigate('/login?error=oauth')
      return
    }
    loginWithToken(token)
      .then(() => navigate('/', { replace: true }))
      .catch(() => navigate('/login?error=oauth'))
  }, [params, navigate, loginWithToken])

  return <p>Signing you in...</p>
}
