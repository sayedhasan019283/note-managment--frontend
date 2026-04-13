import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  Search, Heart, ChevronLeft, ChevronRight,
  Globe, Plus, X, Edit2, Trash2
} from 'lucide-react'

const API_BASE = 'http://localhost:8080/api/v1'
const PAGE_SIZE = 10

function getInitials(str = '') {
  return str.trim().charAt(0).toUpperCase() || '?'
}

function PostModal({ post, onClose, onSave }) {
  const [title, setTitle] = useState(post?.title || '')
  const [body, setBody] = useState(post?.body || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const handleSave = async () => {
    if (!title.trim()) return
    setSaving(true)
    setError(null)
    try {
      await onSave({ ...post, title, body })
      onClose()
    } catch (e) {
      setError(e.message || 'Failed to save post')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-ink-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="card-elevated w-full max-w-lg animate-slide-up">
        <div className="flex items-center justify-between p-5 border-b border-ink-800">
          <h2 className="font-semibold text-ink-100 text-sm">
            {post?._id ? 'Edit post' : 'New post'}
          </h2>
          <button onClick={onClose} className="text-ink-500 hover:text-ink-300 p-1">
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {error && (
            <div className="text-rose-400 text-xs bg-rose-400/10 rounded-lg px-3 py-2">{error}</div>
          )}
          <div>
            <label className="text-xs font-medium text-ink-400 mb-1.5 block uppercase tracking-wide">
              Title
            </label>
            <input
              className="input"
              placeholder="Post title..."
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-400 mb-1.5 block uppercase tracking-wide">
              Body
            </label>
            <textarea
              className="input resize-none"
              rows={5}
              placeholder="Write something interesting..."
              value={body}
              onChange={e => setBody(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 p-5 border-t border-ink-800">
          <button onClick={onClose} className="btn-ghost" disabled={saving}>Cancel</button>
          <button onClick={handleSave} className="btn-primary" disabled={saving}>
            {saving ? 'Saving...' : post?._id ? 'Save changes' : 'Publish post'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Posts() {
  const { user, token, authFetch } = useAuth()

  const [posts, setPosts] = useState([])
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: PAGE_SIZE, totalPages: 1 })
  const [search, setSearch] = useState('')
  const [filterMine, setFilterMine] = useState(false)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [modal, setModal] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  const fetchPosts = useCallback(async (currentPage = 1, mine = false) => {
    setLoading(true)
    setError(null)
    try {
      let res

      if (mine && user?._id) {
        // GET /posts/user/:userId — token required, returns authorDetails via $lookup
        res = await authFetch(`/posts/user/${user._id}?page=${currentPage}&limit=${PAGE_SIZE}`)
      } else {
        // GET /posts — public feed, no token needed
        res = await fetch(`${API_BASE}/posts?page=${currentPage}&limit=${PAGE_SIZE}`)
      }

      if (!res.ok) throw new Error('Failed to fetch posts')
      const json = await res.json()
      const { data, meta: m } = json.data.attributes
      setPosts(data)
      setMeta(m)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [user, authFetch])

  useEffect(() => {
    fetchPosts(page, filterMine)
  }, [fetchPosts, page, filterMine])

  const handleSave = async (post) => {
    if (post._id) {
      // PATCH /posts/:id
      const res = await authFetch(`/posts/${post._id}`, {
        method: 'PATCH',
        body: JSON.stringify({ title: post.title, body: post.body }),
      })
      if (!res.ok) throw new Error('Failed to update post')
    } else {
      // POST /posts
      const res = await authFetch('/posts', {
        method: 'POST',
        body: JSON.stringify({ title: post.title, body: post.body }),
      })
      if (!res.ok) throw new Error('Failed to create post')
    }
    await fetchPosts(page, filterMine)
  }

  const handleDelete = async (id) => {
    try {
      const res = await authFetch(`/posts/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete post')
      setDeleteId(null)
      const newPage = posts.length === 1 && page > 1 ? page - 1 : page
      setPage(newPage)
      await fetchPosts(newPage, filterMine)
    } catch (e) {
      setError(e.message)
    }
  }

  // Resolve author display — two different shapes from two endpoints
  const getAuthor = (post) => {
    if (post.authorDetails) {
      // /posts/user/:id — has full authorDetails from $lookup
      const name = post.authorDetails.firstName?.trim() || post.authorDetails.email
      return { name, initials: getInitials(name) }
    }
    // /posts public feed — author is { _id, email }
    const email = post.author?.email || ''
    return { name: email, initials: getInitials(email) }
  }

  const isOwn = (post) => {
    const authorId = post.author?._id || post.author
    return !!user && authorId === user._id
  }

  // Client-side search on current page
  const filtered = posts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.body.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-8 max-w-4xl mx-auto animate-fade-in">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-ink-50">Public posts</h1>
          <p className="text-ink-500 text-xs mt-0.5">
            {meta.total} posts · visible to everyone · $lookup aggregation
          </p>
        </div>
        {token && (
          <button onClick={() => setModal('new')} className="btn-primary flex items-center gap-2">
            <Plus size={15} /> New post
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
          <input
            className="input pl-9"
            placeholder="Search posts..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {token && (
          <button
            onClick={() => { setFilterMine(prev => !prev); setPage(1) }}
            className={`btn-ghost px-4 text-xs transition-all ${
              filterMine ? 'border-amber-400/40 text-amber-400 bg-amber-400/5' : ''
            }`}
          >
            {filterMine ? 'My posts' : 'All posts'}
          </button>
        )}
      </div>

      {/* My posts banner */}
      {filterMine && user && (
        <div className="card p-4 mb-5 flex items-center gap-3 border-amber-400/15 bg-amber-400/5 animate-slide-up">
          <div className="w-9 h-9 rounded-full bg-amber-400/15 border border-amber-400/20 flex items-center justify-center text-amber-300 text-xs font-semibold flex-shrink-0">
            {getInitials(user.firstName || user.email)}
          </div>
          <div>
            <p className="text-ink-200 text-sm font-medium">
              {user.firstName?.trim() || user.email}
            </p>
            <p className="text-ink-500 text-xs">
              {meta.total} post{meta.total !== 1 ? 's' : ''} · via $lookup pipeline
            </p>
          </div>
          <button
            onClick={() => { setFilterMine(false); setPage(1) }}
            className="ml-auto text-ink-500 hover:text-ink-300 text-xs transition-colors"
          >
            Clear
          </button>
        </div>
      )}

      {error && (
        <div className="text-rose-400 text-xs bg-rose-400/10 rounded-lg px-3 py-2 mb-4">{error}</div>
      )}

      {/* Posts list */}
      <div className="space-y-4">
        {loading ? (
          <div className="card p-12 text-center">
            <p className="text-ink-500 text-sm">Loading posts...</p>
          </div>
        ) : filtered.map(post => {
          const author = getAuthor(post)
          const own = isOwn(post)

          return (
            <div
              key={post._id}
              className="card p-5 hover:border-ink-700 transition-colors animate-slide-up group"
            >
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-ink-800 border border-ink-700 flex items-center justify-center text-ink-300 text-xs font-semibold flex-shrink-0">
                  {author.initials}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-ink-100 font-medium text-sm">{post.title}</h3>
                    <span className="text-ink-600 text-xs flex-shrink-0">
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric',
                      })}
                    </span>
                  </div>

                  <p className="text-ink-500 text-xs mb-2 font-medium">{author.name}</p>
                  <p className="text-ink-500 text-xs leading-relaxed">{post.body}</p>

                  <div className="flex items-center gap-1.5 mt-3">
                    <Globe size={11} className="text-ink-600" />
                    <span className="text-ink-600 text-xs">Public</span>

                    {own && (
                      <div className="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setModal(post)}
                          className="p-1.5 rounded-lg text-ink-500 hover:text-amber-400 hover:bg-amber-400/10 transition-all"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => setDeleteId(post._id)}
                          className="p-1.5 rounded-lg text-ink-500 hover:text-rose-400 hover:bg-rose-400/10 transition-all"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {!loading && filtered.length === 0 && (
          <div className="card p-12 text-center">
            <Globe size={36} className="text-ink-700 mx-auto mb-3" />
            <p className="text-ink-500 text-sm">
              {search ? 'No posts match your search' : 'No posts yet'}
            </p>
            {!search && token && (
              <button onClick={() => setModal('new')} className="btn-primary mt-4">
                Write the first post
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-ink-800">
          <span className="text-ink-500 text-xs">
            Page {meta.page} of {meta.totalPages} · {meta.total} results
          </span>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="btn-ghost px-3 py-2 disabled:opacity-40"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              disabled={page === meta.totalPages}
              onClick={() => setPage(p => p + 1)}
              className="btn-ghost px-3 py-2 disabled:opacity-40"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Post modal */}
      {modal && (
        <PostModal
          post={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-ink-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="card-elevated w-full max-w-sm p-6 animate-slide-up text-center">
            <div className="w-12 h-12 bg-rose-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={20} className="text-rose-400" />
            </div>
            <h3 className="text-ink-100 font-semibold mb-1">Delete post?</h3>
            <p className="text-ink-500 text-sm mb-5">This action cannot be undone.</p>
            <div className="flex gap-2 justify-center">
              <button onClick={() => setDeleteId(null)} className="btn-ghost">Cancel</button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="bg-rose-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-rose-400 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
