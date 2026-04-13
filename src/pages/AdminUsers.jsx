import { useState } from 'react'
import { MOCK_USERS as INITIAL_USERS } from '../data/mockData'
import { Plus, Search, Edit2, Trash2, X, Shield, User, ChevronLeft, ChevronRight } from 'lucide-react'

const PAGE_SIZE = 4

function UserModal({ user, onClose, onSave }) {
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [role, setRole] = useState(user?.role || 'user')
  const [interests, setInterests] = useState(user?.interests?.join(', ') || '')

  const handleSave = () => {
    if (!name || !email) return
    const avatar = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    onSave({ ...user, name, email, role, interests: interests.split(',').map(t => t.trim()).filter(Boolean), avatar })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-ink-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="card-elevated w-full max-w-md animate-slide-up">
        <div className="flex items-center justify-between p-5 border-b border-ink-800">
          <h2 className="font-semibold text-ink-100 text-sm">{user?._id ? 'Edit User' : 'Add User'}</h2>
          <button onClick={onClose} className="text-ink-500 hover:text-ink-300 p-1"><X size={16} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-ink-400 mb-1.5 block">Full Name</label>
            <input className="input" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-400 mb-1.5 block">Email</label>
            <input className="input" type="email" placeholder="john@example.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-400 mb-1.5 block">Role</label>
            <select className="input" value={role} onChange={e => setRole(e.target.value)}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-ink-400 mb-1.5 block">Interests (comma separated)</label>
            <input className="input" placeholder="chess, reading, coding" value={interests} onChange={e => setInterests(e.target.value)} />
          </div>
        </div>
        <div className="flex justify-end gap-2 p-5 border-t border-ink-800">
          <button onClick={onClose} className="btn-ghost">Cancel</button>
          <button onClick={handleSave} className="btn-primary">Save User</button>
        </div>
      </div>
    </div>
  )
}

export default function AdminUsers() {
  const [users, setUsers] = useState(INITIAL_USERS)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [page, setPage] = useState(1)

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleSave = (user) => {
    if (user._id) {
      setUsers(prev => prev.map(u => u._id === user._id ? user : u))
    } else {
      setUsers(prev => [...prev, { ...user, _id: Date.now().toString(), createdAt: new Date().toISOString(), status: 'active' }])
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-ink-50">Manage Users</h1>
          <p className="text-ink-500 text-xs mt-0.5">{users.length} registered users · admin only</p>
        </div>
        <button onClick={() => setModal('new')} className="btn-primary flex items-center gap-2">
          <Plus size={15} /> Add User
        </button>
      </div>

      <div className="relative mb-6">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
        <input className="input pl-9" placeholder="Search by name or email..." value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }} />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-ink-800">
              <th className="text-left text-xs font-medium text-ink-500 px-5 py-3">User</th>
              <th className="text-left text-xs font-medium text-ink-500 px-5 py-3 hidden md:table-cell">Role</th>
              <th className="text-left text-xs font-medium text-ink-500 px-5 py-3 hidden lg:table-cell">Interests</th>
              <th className="text-left text-xs font-medium text-ink-500 px-5 py-3 hidden md:table-cell">Status</th>
              <th className="text-right text-xs font-medium text-ink-500 px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((u, i) => (
              <tr key={u._id} className={`border-b border-ink-800/50 hover:bg-ink-800/30 transition-colors ${i === paginated.length - 1 ? 'border-b-0' : ''}`}>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-400/10 border border-amber-400/15 flex items-center justify-center text-amber-300 text-xs font-semibold flex-shrink-0">
                      {u.avatar}
                    </div>
                    <div>
                      <p className="text-ink-200 text-sm font-medium">{u.name}</p>
                      <p className="text-ink-500 text-xs">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 hidden md:table-cell">
                  <span className={`badge text-[10px] ${u.role === 'admin' ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20' : 'bg-ink-800 text-ink-400'}`}>
                    {u.role === 'admin' ? <Shield size={10} /> : <User size={10} />}
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-4 hidden lg:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {u.interests?.slice(0, 2).map(i => (
                      <span key={i} className="badge bg-ink-800 text-ink-500 text-[10px]">{i}</span>
                    ))}
                    {u.interests?.length > 2 && <span className="text-ink-600 text-[10px]">+{u.interests.length - 2}</span>}
                  </div>
                </td>
                <td className="px-5 py-4 hidden md:table-cell">
                  <span className={`badge text-[10px] ${u.status === 'active' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-ink-800 text-ink-500'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' ? 'bg-emerald-400' : 'bg-ink-500'}`} />
                    {u.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => setModal(u)} className="p-1.5 rounded-lg text-ink-500 hover:text-amber-400 hover:bg-amber-400/10 transition-all">
                      <Edit2 size={13} />
                    </button>
                    <button onClick={() => setDeleteId(u._id)} className="p-1.5 rounded-lg text-ink-500 hover:text-rose-400 hover:bg-rose-400/10 transition-all">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {paginated.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-ink-500 text-sm">No users found</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-ink-500 text-xs">Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-ghost px-3 py-2 disabled:opacity-40">
              <ChevronLeft size={14} />
            </button>
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="btn-ghost px-3 py-2 disabled:opacity-40">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {modal && <UserModal user={modal === 'new' ? null : modal} onClose={() => setModal(null)} onSave={handleSave} />}

      {deleteId && (
        <div className="fixed inset-0 bg-ink-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="card-elevated w-full max-w-sm p-6 animate-slide-up text-center">
            <div className="w-12 h-12 bg-rose-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={20} className="text-rose-400" />
            </div>
            <h3 className="text-ink-100 font-semibold mb-1">Remove user?</h3>
            <p className="text-ink-500 text-sm mb-5">This will permanently delete the user account.</p>
            <div className="flex gap-2 justify-center">
              <button onClick={() => setDeleteId(null)} className="btn-ghost">Cancel</button>
              <button onClick={() => { setUsers(prev => prev.filter(u => u._id !== deleteId)); setDeleteId(null) }}
                className="bg-rose-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-rose-400 transition-colors">
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
