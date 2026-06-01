import { Link } from 'react-router-dom'

const CABINET = [
  { role: 'President', name: 'Waqas Gondal', icon: '👑', color: '#c9a84c', colorBg: 'rgba(201,168,76,0.12)', border: 'rgba(201,168,76,0.35)', featured: true },
  { role: 'Vice President', name: 'Muhammad Idris', icon: '⭐', color: '#4a9eff', colorBg: 'rgba(74,158,255,0.1)', border: 'rgba(74,158,255,0.25)', featured: true },
  { role: 'General Secretary', name: 'Nadeem Baloch', icon: '📋', color: '#00c864', colorBg: 'rgba(0,200,100,0.1)', border: 'rgba(0,200,100,0.25)', featured: false },
  { role: 'Finance Secretary', name: 'Shoukat Ali Zaidi', icon: '💰', color: '#c9a84c', colorBg: 'rgba(201,168,76,0.08)', border: 'rgba(201,168,76,0.2)', featured: false },
  { role: 'Joint Secretary', name: 'Tahir Abbas', icon: '🤝', color: '#a78bfa', colorBg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.25)', featured: false },
  { role: 'Information Secretary', name: 'Sikandar Hayat', icon: '📢', color: '#34d399', colorBg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.25)', featured: false },
  { role: 'Press Secretary', name: 'Sohail Abbas', icon: '📰', color: '#f472b6', colorBg: 'rgba(244,114,182,0.1)', border: 'rgba(244,114,182,0.25)', featured: false },
]

const LEADING_MEMBERS = [
  'Liaqat Ali Baloch',
  'Mazhar Gondal',
]

export default function Leadership() {
  return (
    <div className="min-h-screen bg-dark-500 font-body">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gold-500/4 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-navy-700/15 rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-[0.025]" style={{
          backgroundImage: 'linear-gradient(rgba(201,168,76,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* NAV */}
      <nav className="relative z-10 border-b border-white/5 bg-dark-500/90 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold-500 to-gold-300 flex items-center justify-center font-black text-dark-500 text-lg shadow-lg shadow-gold-500/30">K</div>
            <div>
              <div className="font-display font-bold text-gold-300 text-sm leading-none">Khanana Welfare Society</div>
              <div className="text-white/30 text-[10px] tracking-widest uppercase">Est. 2024</div>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/about" className="text-white/30 hover:text-gold-400 text-xs font-semibold transition-colors">About Developer</Link>
            <Link to="/" className="text-white/30 hover:text-white/60 text-xs transition-colors">← Back to Home</Link>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass-gold px-4 py-2 rounded-full text-xs font-bold text-gold-400 tracking-widest uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
            Khanana Welfare Society
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-black text-white mb-4">
            Society <span className="gold-text">Leadership</span>
          </h1>
          <p className="text-white/40 text-base max-w-xl mx-auto leading-relaxed">
            Meet the dedicated team serving Khanana Village with honesty, transparency, and commitment.
          </p>
        </div>

        {/* President + VP — featured */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {CABINET.filter(m => m.featured).map((member, i) => (
            <div key={i} className="relative card p-8 text-center overflow-hidden"
              style={{ borderColor: member.border, background: member.colorBg }}>
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-60"
                style={{ color: member.color }} />
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-5"
                style={{ background: member.colorBg, border: `1px solid ${member.border}` }}>
                {member.icon}
              </div>
              <div className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: member.color }}>
                {member.role}
              </div>
              <div className="font-display text-2xl font-black text-white">{member.name}</div>
            </div>
          ))}
        </div>

        {/* Rest of cabinet */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {CABINET.filter(m => !m.featured).map((member, i) => (
            <div key={i} className="card p-6 flex items-center gap-4 hover:-translate-y-1 hover:border-white/15 transition-all duration-200">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: member.colorBg, border: `1px solid ${member.border}` }}>
                {member.icon}
              </div>
              <div>
                <div className="text-xs font-bold tracking-wide uppercase mb-1" style={{ color: member.color }}>
                  {member.role}
                </div>
                <div className="font-bold text-white text-base">{member.name}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Leading Members */}
        <div className="card p-8 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl glass-gold flex items-center justify-center text-xl">🌟</div>
            <div>
              <div className="font-display font-bold text-gold-300 text-xl">Leading Members</div>
              <div className="text-white/30 text-xs">Senior contributors of our society</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {LEADING_MEMBERS.map((name, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/3 border border-white/7 hover:border-gold-500/20 transition-colors">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-navy-700 to-gold-700 flex items-center justify-center text-sm font-black text-white flex-shrink-0">
                  {name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <div className="font-bold text-white text-sm">{name}</div>
                  <div className="text-white/30 text-xs">Leading Member</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Society mission */}
        <div className="card p-8 relative overflow-hidden text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <div className="text-3xl mb-4">🕌</div>
            <h2 className="font-display text-2xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-white/50 text-sm leading-relaxed max-w-2xl mx-auto mb-6">
              Khanana Welfare Society is dedicated to serving the people of Khanana Village through collective effort, financial support, and community development. We believe in transparency, unity, and the power of community.
            </p>
            <div className="inline-flex items-center gap-3 glass-gold px-6 py-3 rounded-2xl">
              <span className="text-xl">🤲</span>
              <span className="text-gold-400 font-bold">May Allah bless our efforts — آمین</span>
            </div>
          </div>
        </div>

        <div className="text-center mt-10">
          <Link to="/" className="btn-ghost px-8 py-3 text-sm font-semibold inline-block">
            ← Back to Home
          </Link>
        </div>
      </div>

      <footer className="relative z-10 border-t border-white/5 py-8 px-6 text-center">
        <div className="text-white/20 text-xs">
          Khanana Welfare Society · Est. 2024 · Developed with ❤️ from{' '}
          <span className="text-gold-500/50">Copenhagen, Denmark</span> by{' '}
          <Link to="/about" className="text-gold-500/50 hover:text-gold-400 transition-colors">Usman Umar</Link>
        </div>
      </footer>
    </div>
  )
}
