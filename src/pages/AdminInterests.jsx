import { useState } from 'react'
import { INTERESTS_DATA, MOCK_USERS } from '../data/mockData'
import { BarChart3, Users, ChevronDown, ChevronUp } from 'lucide-react'

const INTEREST_COLORS = {
  reading: 'bg-sky-400/10 text-sky-400 border-sky-400/20',
  chess: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
  hiking: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
  coding: 'bg-purple-400/10 text-purple-400 border-purple-400/20',
  music: 'bg-rose-400/10 text-rose-400 border-rose-400/20',
  cooking: 'bg-orange-400/10 text-orange-400 border-orange-400/20',
  travel: 'bg-teal-400/10 text-teal-400 border-teal-400/20',
  photography: 'bg-pink-400/10 text-pink-400 border-pink-400/20',
}
const DEFAULT_COLOR = 'bg-ink-700 text-ink-300 border-ink-600'

function InterestBar({ interest, count, max, users, isExpanded, onToggle }) {
  const pct = Math.round((count / max) * 100)
  const color = INTEREST_COLORS[interest] || DEFAULT_COLOR

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <span className={`badge border text-xs ${color}`}>{interest}</span>
          <span className="text-ink-500 text-xs">{count} user{count !== 1 ? 's' : ''}</span>
        </div>
        <button onClick={onToggle} className="text-ink-500 hover:text-ink-300 transition-colors p-0.5">
          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Bar */}
      <div className="h-1.5 bg-ink-800 rounded-full overflow-hidden mb-1">
        <div className="h-full bg-amber-400/60 rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }} />
      </div>

      {/* Users */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-ink-800 flex flex-wrap gap-2 animate-slide-up">
          {users.map(name => {
            const u = MOCK_USERS.find(u => u.name === name)
            return (
              <div key={name} className="flex items-center gap-1.5 bg-ink-800 rounded-lg px-2.5 py-1.5">
                <div className="w-5 h-5 rounded-full bg-amber-400/15 flex items-center justify-center text-[9px] font-semibold text-amber-300">
                  {u?.avatar}
                </div>
                <span className="text-ink-300 text-xs">{name}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function AdminInterests() {
  const [expanded, setExpanded] = useState(null)
  const sorted = [...INTERESTS_DATA].sort((a, b) => b.count - a.count)
  const max = sorted[0]?.count || 1
  const totalInterests = INTERESTS_DATA.length
  const totalMappings = INTERESTS_DATA.reduce((s, i) => s + i.count, 0)

  return (
    <div className="p-8 max-w-4xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-ink-50">Users by Interest</h1>
        <p className="text-ink-500 text-xs mt-0.5">Aggregation Scenario 1 · collection.aggregate() · group by interests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Unique interests', value: totalInterests },
          { label: 'Total users', value: MOCK_USERS.length },
          { label: 'Interest mappings', value: totalMappings },
        ].map(s => (
          <div key={s.label} className="card p-4 text-center">
            <p className="text-2xl font-semibold text-ink-50">{s.value}</p>
            <p className="text-ink-500 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Aggregation pipeline display */}
      <div className="card mb-6 overflow-hidden">
        <div className="px-5 py-3 border-b border-ink-800 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-400/60" />
          <span className="text-xs font-medium text-ink-400 font-mono">MongoDB Aggregation Pipeline</span>
        </div>
        <pre className="p-5 text-xs text-ink-400 font-mono leading-relaxed overflow-x-auto">
{`User.aggregate([
  { $unwind: "$interests" },
  { $group: {
      _id: "$interests",
      users: { $push: "$name" },
      count: { $sum: 1 }
  }},
  { $sort: { count: -1 } }
])`}
        </pre>
      </div>

      {/* Interest bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {sorted.map(item => (
          <InterestBar
            key={item.interest}
            interest={item.interest}
            count={item.count}
            max={max}
            users={item.users}
            isExpanded={expanded === item.interest}
            onToggle={() => setExpanded(e => e === item.interest ? null : item.interest)}
          />
        ))}
      </div>
    </div>
  )
}
