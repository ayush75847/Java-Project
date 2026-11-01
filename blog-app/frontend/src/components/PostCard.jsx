import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Shows one post in a list. The Delete button appears for the author and for admins.
export default function PostCard({ post, onDelete }) {
  const { user, isAdmin } = useAuth()
  const canDelete = user && (user.id === post.authorId || isAdmin)

  return (
    <article className="card">
      <h2><Link to={`/posts/${post.id}`}>{post.title}</Link></h2>
      <p className="muted">
        by {post.authorName} · {new Date(post.createdAt).toLocaleDateString()}
      </p>
      <p>{post.content.length > 200 ? post.content.slice(0, 200) + '...' : post.content}</p>
      {canDelete && (
        <button className="danger" onClick={() => onDelete(post.id)}>Delete</button>
      )}
    </article>
  )
}
