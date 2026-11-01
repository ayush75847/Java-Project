import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api, { errorMessage } from '../api'
import { useAuth } from '../context/AuthContext'

export default function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAdmin } = useAuth()
  const [post, setPost] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get(`/api/posts/${id}`)
      .then((res) => setPost(res.data))
      .catch((err) => setError(errorMessage(err)))
  }, [id])

  async function handleDelete() {
    if (!confirm('Delete this post?')) return
    try {
      await api.delete(`/api/posts/${id}`)
      navigate('/')
    } catch (err) {
      alert(errorMessage(err))
    }
  }

  if (error) return <p className="error">{error}</p>
  if (!post) return <p>Loading...</p>

  const canDelete = user && (user.id === post.authorId || isAdmin)

  return (
    <article>
      <h1>{post.title}</h1>
      <p className="muted">by {post.authorName} · {new Date(post.createdAt).toLocaleString()}</p>
      <div className="post-body">{post.content}</div>
      {canDelete && <button className="danger" onClick={handleDelete}>Delete post</button>}
    </article>
  )
}
