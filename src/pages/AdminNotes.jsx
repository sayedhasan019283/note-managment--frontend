import { useState } from 'react'
import { MOCK_NOTES, MOCK_USERS } from '../data/mockData'
import { Search, FileText, ChevronLeft, ChevronRight, Eye } from 'lucide-react'

const PAGE_SIZE = 5

export default function AdminNotes() {
  const [search, setSearch] = useState('')
  const [filterUser, setFilterUser] = useState('all')
  const [page, setPage] = useState(1)
  const [preview, setPreview] = useState(null)

  const filtered = MOCK_NOTES.filter(n => {
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
    const matchUser = filterUser === 'all' || n.userId === filterUser
    return matchSearch && matchUser
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="p-8 max-w-4xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-ink-50">All Notes</h1>
        <p className="text-ink-500 text-xs mt-0.5">View notes from all users · admin only</p>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
          <input className="input pl-9" placeholder="Search all notes..." value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }} />
        </div>
        <select className="input w-44" value={filterUser}
          onChange={e => { setFilterUser(e.target.value); setPage(1) }}>
          <option value="all">All users</option>
          {MOCK_USERS.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
        </select>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-ink-800">
              <th className="text-left text-xs font-medium text-ink-500 px-5 py-3">Note</th>
              <th className="text-left text-xs font-medium text-ink-500 px-5 py-3 hidden md:table-cell">Author</th>
              <th className="text-left text-xs font-medium text-ink-500 px-5 py-3 hidden lg:table-cell">Tags</th>
              <th className="text-left text-xs font-medium text-ink-500 px-5 py-3 hidden md:table-cell">Updated</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((note, i) => (
              <tr key={note._id} className={`border-b border-ink-800/50 hover:bg-ink-800/30 transition-colors ${i === paginated.length - 1 ? 'border-b-0' : ''}`}>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 bg-amber-400/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText size={12} className="text-amber-400" />
                    </div>
                    <p className="text-ink-200 text-sm font-medium line-clamp-1">{note.title}</p>
                  </div>
                </td>
                <td className="px-5 py-3.5 hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-ink-800 border border-ink-700 flex items-center justify-center text-[10px] font-semibold text-ink-300">
                      {MOCK_USERS.find(u => u._id === note.userId)?.avatar}
                    </div>
                    <span className="text-ink-400 text-xs">{note.userName}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 hidden lg:table-cell">
                  <div className="flex gap-1">
                    {note.tags?.slice(0, 2).map(t => (
                      <span key={t} className="badge bg-ink-800 text-ink-500 text-[10px]">{t}</span>
                    ))}
                  </div>
                </td>
                <td className="px-5 py-3.5 hidden md:table-cell">
                  <span className="text-ink-500 text-xs">
                    {new Date(note.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <button onClick={() => setPreview(note)}
                    className="p-1.5 rounded-lg text-ink-500 hover:text-sky-400 hover:bg-sky-400/10 transition-all">
                    <Eye size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {paginated.length === 0 && (
          <div className="p-12 text-center"><p className="text-ink-500 text-sm">No notes found</p></div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-ink-500 text-xs">Page {page} of {totalPages} · {filtered.length} notes</span>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-ghost px-3 py-2 disabled:opacity-40"><ChevronLeft size={14} /></button>
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="btn-ghost px-3 py-2 disabled:opacity-40"><ChevronRight size={14} /></button>
          </div>
        </div>
      )}

      {/* Preview modal */}
      {preview && (
        <div className="fixed inset-0 bg-ink-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="card-elevated w-full max-w-lg animate-slide-up">
            <div className="flex items-center justify-between p-5 border-b border-ink-800">
              <h2 className="font-semibold text-ink-100 text-sm truncate pr-4">{preview.title}</h2>
              <button onClick={() => setPreview(null)} className="text-ink-500 hover:text-ink-300 p-1 flex-shrink-0">✕</button>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-amber-400/10 flex items-center justify-center text-[10px] font-semibold text-amber-300">
                  {MOCK_USERS.find(u => u._id === preview.userId)?.avatar}
                </div>
                <span className="text-ink-400 text-xs">{preview.userName}</span>
                <span className="text-ink-600 text-xs">·</span>
                <span className="text-ink-600 text-xs">{new Date(preview.updatedAt).toLocaleDateString()}</span>
              </div>
              <p className="text-ink-300 text-sm leading-relaxed">{preview.content}</p>
              {preview.tags?.length > 0 && (
                <div className="flex gap-1.5 mt-4">
                  {preview.tags.map(t => <span key={t} className="badge bg-ink-800 text-ink-400 text-[10px]">#{t}</span>)}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
