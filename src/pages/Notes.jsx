import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { Plus, Search, Edit2, Trash2, X, FileText, Tag, ChevronLeft, ChevronRight } from 'lucide-react'

const API_BASE = 'http://localhost:8080/api/v1'

function getAuthHeaders(token) {
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

function NoteModal({ note, onClose, onSave, token }) {
  const [title, setTitle] = useState(note?.title || '')
  const [content, setContent] = useState(note?.content || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const handleSave = async () => {
    if (!title.trim()) return
    setSaving(true)
    setError(null)
    try {
      await onSave({ ...note, title, content })
      onClose()
    } catch (e) {
      setError(e.message || 'Failed to save note')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-ink-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="card-elevated w-full max-w-lg animate-slide-up">
        <div className="flex items-center justify-between p-5 border-b border-ink-800">
          <h2 className="font-semibold text-ink-100 text-sm">{note?._id ? 'Edit Note' : 'New Note'}</h2>
          <button onClick={onClose} className="text-ink-500 hover:text-ink-300 p-1"><X size={16} /></button>
        </div>
        <div className="p-5 space-y-4">
          {error && (
            <div className="text-rose-400 text-xs bg-rose-400/10 rounded-lg px-3 py-2">{error}</div>
          )}
          <div>
            <label className="text-xs font-medium text-ink-400 mb-1.5 block">Title</label>
            <input className="input" placeholder="Note title..." value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-400 mb-1.5 block">Content</label>
            <textarea className="input resize-none" rows={5} placeholder="Write your note..."
              value={content} onChange={e => setContent(e.target.value)} />
          </div>
        </div>
        <div className="flex justify-end gap-2 p-5 border-t border-ink-800">
          <button onClick={onClose} className="btn-ghost" disabled={saving}>Cancel</button>
          <button onClick={handleSave} className="btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Note'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Notes() {
  const { user, token } = useAuth()
  const [notes, setNotes] = useState([])
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 })
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchNotes = useCallback(async (currentPage = 1) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `${API_BASE}/notes/my?page=${currentPage}&limit=10`,
        { headers: getAuthHeaders(token) }
      )
      if (!res.ok) throw new Error('Failed to fetch notes')
      const json = await res.json()
      const { data, meta: m } = json.data.attributes
      setNotes(data)
      setMeta(m)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchNotes(page)
  }, [fetchNotes, page])

  const handleSave = async (note) => {
    if (note._id) {
      const res = await fetch(
        `${API_BASE}/notes/my/${note._id}`,
        {
          method: 'PATCH',
          headers: getAuthHeaders(token),
          body: JSON.stringify({ title: note.title, content: note.content }),
        }
      )
      if (!res.ok) throw new Error('Failed to update note')
    } else {
      const res = await fetch(
        `${API_BASE}/notes/`,
        {
          method: 'POST',
          headers: getAuthHeaders(token),
          body: JSON.stringify({ title: note.title, content: note.content }),
        }
      )
      if (!res.ok) throw new Error('Failed to create note')
    }
    await fetchNotes(page)
  }

  const handleDelete = async (id) => {
    try {
      const res = await fetch(
        `${API_BASE}/notes/my/${id}`,
        { method: 'DELETE', headers: getAuthHeaders(token) }
      )
      if (!res.ok) throw new Error('Failed to delete note')
      setDeleteId(null)
      const newPage = notes.length === 1 && page > 1 ? page - 1 : page
      setPage(newPage)
      await fetchNotes(newPage)
    } catch (e) {
      setError(e.message)
    }
  }

  const filtered = notes.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.content.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-8 max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-ink-50">My Notes</h1>
          <p className="text-ink-500 text-xs mt-0.5">{meta.total} notes · private to you</p>
        </div>
        <button onClick={() => setModal('new')} className="btn-primary flex items-center gap-2">
          <Plus size={15} /> New Note
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
        <input className="input pl-9" placeholder="Search notes..." value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }} />
      </div>

      {error && (
        <div className="text-rose-400 text-xs bg-rose-400/10 rounded-lg px-3 py-2 mb-4">{error}</div>
      )}

      {/* Notes list */}
      <div className="space-y-3">
        {loading ? (
          <div className="card p-12 text-center">
            <p className="text-ink-500 text-sm">Loading notes...</p>
          </div>
        ) : filtered.map(note => (
          <div key={note._id} className="card p-5 hover:border-ink-700 transition-all group animate-slide-up">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-amber-400/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <FileText size={14} className="text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-ink-100 font-medium text-sm">{note.title}</h3>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button onClick={() => setModal(note)}
                      className="p-1.5 rounded-lg text-ink-500 hover:text-amber-400 hover:bg-amber-400/10 transition-all">
                      <Edit2 size={13} />
                    </button>
                    <button onClick={() => setDeleteId(note._id)}
                      className="p-1.5 rounded-lg text-ink-500 hover:text-rose-400 hover:bg-rose-400/10 transition-all">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                <p className="text-ink-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">{note.content}</p>
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-ink-600 text-[10px] ml-auto">
                    {new Date(note.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {!loading && filtered.length === 0 && (
          <div className="card p-12 text-center">
            <FileText size={36} className="text-ink-700 mx-auto mb-3" />
            <p className="text-ink-500 text-sm">{search ? 'No notes match your search' : 'No notes yet'}</p>
            {!search && <button onClick={() => setModal('new')} className="btn-primary mt-4">Create your first note</button>}
          </div>
        )}
      </div>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-ink-800">
          <span className="text-ink-500 text-xs">Page {meta.page} of {meta.totalPages}</span>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-ghost px-3 py-2 disabled:opacity-40">
              <ChevronLeft size={14} />
            </button>
            <button disabled={page === meta.totalPages} onClick={() => setPage(p => p + 1)} className="btn-ghost px-3 py-2 disabled:opacity-40">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Note modal */}
      {modal && (
        <NoteModal
          note={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
          token={token}
        />
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-ink-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="card-elevated w-full max-w-sm p-6 animate-slide-up text-center">
            <div className="w-12 h-12 bg-rose-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={20} className="text-rose-400" />
            </div>
            <h3 className="text-ink-100 font-semibold mb-1">Delete note?</h3>
            <p className="text-ink-500 text-sm mb-5">This action cannot be undone.</p>
            <div className="flex gap-2 justify-center">
              <button onClick={() => setDeleteId(null)} className="btn-ghost">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="bg-rose-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-rose-400 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}