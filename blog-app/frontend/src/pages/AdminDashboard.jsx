import { useEffect, useState } from 'react'
import api, { errorMessage } from '../api'
import { useAuth } from '../context/AuthContext'

export default function AdminDashboard() {
  const { user: me } = useAuth()
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/api/admin/users')
      .then((res) => setUsers(res.data))
      .catch((err) => setError(errorMessage(err)))
  }, [])

  async function changeRole(id, role) {
    try {
      const res = await api.put(`/api/admin/users/${id}/role`, null, { params: { role } })
      setUsers(users.map((u) => (u.id === id ? res.data : u)))
    } catch (err) {
      alert(errorMessage(err))
    }
  }

  return (
    <>
      <h1>Admin dashboard</h1>
      <p className="muted">Admins can delete any post from the home page, and promote users here.</p>
      {error && <p className="error">{error}</p>}
      <table>
        <thead>
          <tr><th>Name</th><th>Email</th><th>Sign-in</th><th>Role</th><th></th></tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.provider}</td>
              <td>{u.role}</td>
              <td>
                {u.id !== me.id && (
                  u.role === 'ADMIN'
                    ? <button onClick={() => changeRole(u.id, 'USER')}>Make user</button>
                    : <button onClick={() => changeRole(u.id, 'ADMIN')}>Make admin</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
