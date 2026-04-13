import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FileText } from 'lucide-react'

const DEMO_ACCOUNTS = [
  {
    role: 'User account',
    email: 'rahimuser@gmail.com',
    password: '12345678',
    color: 'amber',
  },
  {
    role: 'Admin account',
    email: 'admin@gmail.com',
    password: '12345678',
    color: 'teal',
  },
]

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, loading, error } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) return
    const ok = await login(email, password)
    if (ok) navigate('/dashboard')
  }

  const handleDemo = async (account) => {
    const ok = await login(account.email, account.password)
    if (ok) navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Card */}
        <div className="bg-ink-900 border border-ink-800 rounded-2xl overflow-hidden">

          {/* Header */}
          <div className="px-7 pt-7 pb-6 border-b border-ink-800">
            <div className="w-9 h-9 bg-amber-400/10 rounded-lg flex items-center justify-center mb-5">
              <FileText size={16} className="text-amber-400" />
            </div>
            <h1 className="text-ink-50 font-medium text-base">Welcome back</h1>
            <p className="text-ink-500 text-xs mt-1">Sign in to your account to continue</p>
          </div>

          {/* Form */}
          <div className="px-7 py-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-medium text-ink-500 uppercase tracking-wide mb-1.5 block">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input w-full"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-ink-500 uppercase tracking-wide mb-1.5 block">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input w-full"
                />
              </div>

              {error && (
                <p className="text-rose-400 text-xs bg-rose-400/10 rounded-lg px-3 py-2">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-400 hover:bg-amber-300 text-amber-950 font-medium text-sm py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-1"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-ink-800" />
              <span className="text-ink-600 text-[11px]">or continue as demo</span>
              <div className="flex-1 h-px bg-ink-800" />
            </div>

            {/* Demo buttons */}
            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map(account => (
                <button
                  key={account.email}
                  onClick={() => handleDemo(account)}
                  disabled={loading}
                  className={`
                    bg-ink-950 border rounded-lg px-3 py-2.5 text-left transition-all disabled:opacity-40
                    ${account.color === 'amber'
                      ? 'border-amber-400/20 hover:border-amber-400/40 hover:bg-amber-400/5'
                      : 'border-teal-400/20 hover:border-teal-400/40 hover:bg-teal-400/5'
                    }
                  `}
                >
                  <p className={`text-[11px] font-medium mb-0.5 ${
                    account.color === 'amber' ? 'text-amber-400' : 'text-teal-400'
                  }`}>
                    {account.role}
                  </p>
                  <p className="text-[11px] text-ink-600 truncate">{account.email}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="px-7 py-4 border-t border-ink-800 flex items-center justify-center gap-1.5">
            <span className="text-ink-600 text-xs">Don't have an account?</span>
            <a href="/register" className="text-amber-400 text-xs hover:text-amber-300 transition-colors">
              Sign up
            </a>
          </div>

        </div>
      </div>
    </div>
  )
}