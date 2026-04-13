import { useAuth } from '../context/AuthContext'
import { MOCK_NOTES, MOCK_USERS, MOCK_POSTS } from '../data/mockData'
import { FileText, Users, Globe, TrendingUp, Clock, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function StatCard({ icon: Icon, label, value, sub, color = 'amber' }) {
  const colors = {
    amber:   'text-amber-400 bg-amber-400/10',
    emerald: 'text-emerald-400 bg-emerald-400/10',
    sky:     'text-sky-400 bg-sky-400/10',
    rose:    'text-rose-400 bg-rose-400/10',
  }
  return (
    <div className="card p-5 flex items-start gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colors[color]}`}>
        <Icon size={18} />
      </div>
      <div>
        <p className="text-ink-500 text-xs font-medium mb-0.5">{label}</p>
        <p className="text-ink-50 text-2xl font-semibold">{value}</p>
        {sub && <p className="text-ink-500 text-xs mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

function NoteCard({ note }) {
  return (
    <div className="card p-4 hover:border-ink-700 transition-colors">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-ink-100 text-sm font-medium line-clamp-1">{note.title}</h3>
        <span className="text-ink-600 text-xs flex-shrink-0">
          {new Date(note.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </div>
      <p className="text-ink-500 text-xs line-clamp-2 leading-relaxed">{note.content}</p>
      {note.tags?.length > 0 && (
        <div className="flex gap-1.5 mt-3">
          {note.tags.slice(0, 2).map(t => (
            <span key={t} className="badge bg-ink-800 text-ink-400 text-[10px]">{t}</span>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Dashboard() {
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()

  // Real user fields from API: firstName, role, email, etc.
  const displayName = user?.fullName || user?.firstName || user?.email || 'there'
  const avatarLetters = (user?.firstName?.[0] || user?.email?.[0] || '?').toUpperCase()

  const myNotes    = MOCK_NOTES.filter(n => n.userId === user?._id || n.userId === '1')
  const recentNotes = isAdmin ? MOCK_NOTES.slice(0, 4) : myNotes.slice(0, 4)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="p-8 max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <p className="text-ink-500 text-sm mb-1">{greeting},</p>
          <h1 className="text-2xl font-semibold text-ink-50 tracking-tight">{displayName}</h1>
          <div className="flex items-center gap-2 mt-2">
            <span className={`badge text-[10px] border ${
              isAdmin
                ? 'bg-amber-400/10 text-amber-400 border-amber-400/20'
                : 'bg-ink-800 text-ink-400 border-ink-700'
            }`}>
              {isAdmin ? '⚙ Admin' : '👤 User'}
            </span>
            <span className="text-ink-600 text-xs">{user?.email}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={FileText}   label="My Notes"     value={myNotes.length}    sub="total notes"      color="amber"   />
        {isAdmin && <StatCard icon={Users}  label="Total Users"  value={MOCK_USERS.length} sub="registered"      color="sky"     />}
        {isAdmin && <StatCard icon={FileText} label="All Notes"  value={MOCK_NOTES.length} sub="across users"    color="emerald" />}
        <StatCard icon={Globe}      label="Public Posts"  value={MOCK_POSTS.length} sub="published"        color="rose"    />
        {!isAdmin && <StatCard icon={TrendingUp} label="This Week" value={2}            sub="notes created"    color="emerald" />}
        {!isAdmin && <StatCard icon={Clock}  label="Last Updated" value="Today"         sub="recent activity"  color="sky"     />}
      </div>

      {/* Recent notes */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-ink-200 font-medium text-sm">
          {isAdmin ? 'Recent Notes (All Users)' : 'Recent Notes'}
        </h2>
        <button
          onClick={() => navigate(isAdmin ? '/admin/notes' : '/notes')}
          className="text-amber-400 text-xs flex items-center gap-1 hover:text-amber-300 transition-colors"
        >
          View all <ArrowRight size={12} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {recentNotes.map(note => <NoteCard key={note._id} note={note} />)}
        {recentNotes.length === 0 && (
          <div className="col-span-2 card p-10 text-center">
            <FileText size={32} className="text-ink-700 mx-auto mb-3" />
            <p className="text-ink-500 text-sm">No notes yet. Create your first note!</p>
            <button onClick={() => navigate('/notes')} className="btn-primary mt-4">Create Note</button>
          </div>
        )}
      </div>
    </div>
  )
}
