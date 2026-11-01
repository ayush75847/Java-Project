import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api, { errorMessage } from '../api'

export default function CreatePost() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const res = await api.post('/api/posts', { title, content })
      navigate(`/posts/${res.data.id}`)
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h1>Write a post</h1>
      {error && <p className="error">{error}</p>}
      <label>Title
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </label>
      <label>Content
        <textarea rows={12} value={content} onChange={(e) => setContent(e.target.value)} required />
      </label>
      <button type="submit">Publish</button>
    </form>
  )
}
