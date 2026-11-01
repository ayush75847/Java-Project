import { useEffect, useState } from 'react'
import api, { errorMessage } from '../api'
import PostCard from '../components/PostCard'

export default function Home() {
  const [posts, setPosts] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/api/posts')
      .then((res) => setPosts(res.data))
      .catch((err) => setError(errorMessage(err)))
  }, [])

  async function handleDelete(id) {
    if (!confirm('Delete this post?')) return
    try {
      await api.delete(`/api/posts/${id}`)
      setPosts(posts.filter((p) => p.id !== id))
    } catch (err) {
      alert(errorMessage(err))
    }
  }

  return (
    <>
      <h1>Latest posts</h1>
      {error && <p className="error">{error}</p>}
      {posts.length === 0 && !error && <p className="muted">No posts yet.</p>}
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onDelete={handleDelete} />
      ))}
    </>
  )
}
