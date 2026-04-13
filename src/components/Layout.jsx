import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, FileText, Users, BarChart3,
  Globe, ShieldCheck, LogOut,
} from 'lucide-react'

const navMain = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/notes',     icon: FileText,         label: 'My Notes'  },
  { to: '/posts',     icon: Globe,            label: 'Public Posts' },
]

const navAdmin = [
  { to: '/admin/users',     icon: Users,    label: 'Manage Users' },
  { to: '/admin/notes',     icon: FileText, label: 'All Notes'    },
  { to: '/admin/interests', icon: BarChart3, label: 'Interests'   },
]

export default function Layout({ children }) {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  // Build initials from real API user shape
  const initials = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || user?.email?.[0]?.toUpperCase() || '?'

  const displayName = user?.firstName
    ? `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}`
    : user?.email || 'User'

  return (
    <div className="flex h-screen bg-ink-950 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 flex flex-col bg-ink-950 border-r border-ink-800">

        {/* Logo */}
        <div className="p-5 border-b border-ink-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-amber-400/10 border border-amber-400/20 rounded-lg flex items-center justify-center">
              <ShieldCheck size={16} className="text-amber-400" />
            </div>
            <span className="font-semibold text-ink-100 text-sm tracking-tight">SecureNotes</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] font-semibold text-ink-600 uppercase tracking-widest px-3 py-2">Main</p>
          {navMain.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-amber-400/10 text-amber-300 border border-amber-400/15'
                    : 'text-ink-400 hover:text-ink-200 hover:bg-ink-800'
                }`
              }>
              <Icon size={15} />
              {label}
            </NavLink>
          ))}

          {isAdmin && (
            <>
              <p className="text-[10px] font-semibold text-ink-600 uppercase tracking-widest px-3 py-2 mt-3">Admin</p>
              {navAdmin.map(({ to, icon: Icon, label }) => (
                <NavLink key={to} to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-amber-400/10 text-amber-300 border border-amber-400/15'
                        : 'text-ink-400 hover:text-ink-200 hover:bg-ink-800'
                    }`
                  }>
                  <Icon size={15} />
                  {label}
                </NavLink>
              ))}
            </>
          )}
        </nav>

        {/* User footer */}
        <div className="p-3 border-t border-ink-800">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-amber-400/15 border border-amber-400/20 flex items-center justify-center text-amber-300 text-xs font-semibold flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-ink-200 text-xs font-medium truncate">{displayName}</p>
              <p className="text-ink-500 text-[10px] capitalize">{user?.role}</p>
            </div>
            <button onClick={handleLogout} title="Sign out"
              className="text-ink-500 hover:text-rose-400 transition-colors p-1 rounded">
              <LogOut size={13} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-ink-950">
        {children}
      </main>
    </div>
  )
}
