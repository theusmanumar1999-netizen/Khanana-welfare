import { Link } from 'react-router-dom'
import usmanPhoto from '../assets/usman.jpg'

export default function About() {
  return (
    <div className="min-h-screen bg-dark-500 font-body">
      {/* Background effects */}
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
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold-500 to-gold-300 flex items-center justify-center font-black text-dark-500 text-lg shadow-lg shadow-gold-500/30">K</div>
            <div>
              <div className="font-display font-bold text-gold-300 text-sm leading-none">Khanana Welfare Society</div>
              <div className="text-white/30 text-[10px] tracking-widest uppercase">Est. 2024</div>
            </div>
          </Link>
          <Link to="/" className="text-white/30 hover:text-white/60 text-xs transition-colors">← Back to Home</Link>
        </div>
      </nav>

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-16">

        {/* Page header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 glass-gold px-4 py-2 rounded-full text-xs font-bold text-gold-400 tracking-widest uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
            About the Developer
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-black text-white mb-4">
            Meet the <span className="gold-text">Developer</span>
          </h1>
          <p className="text-white/40 text-base max-w-lg mx-auto leading-relaxed">
            The person behind Khanana Welfare Society's digital platform
          </p>
        </div>

        {/* DEVELOPER CARD */}
        <div className="card p-0 overflow-hidden mb-8 relative">
          {/* Top gold line */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold-500/60 to-transparent" />

          {/* Header section with photo */}
          <div className="p-8 md:p-10 border-b border-white/7">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">

              {/* Photo placeholder */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden border-2 border-gold-500/30 shadow-2xl shadow-gold-500/15">
                    {/* Photo — replace src with actual image URL */}
                    <img src={usmanPhoto} alt="Usman Umar" className="w-full h-full object-cover object-top" />
                  </div>
                  {/* Online dot */}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-dark-500 shadow-lg" />
                </div>
              </div>

              {/* Name + title */}
              <div className="text-center md:text-left flex-1">
                <h2 className="font-display text-3xl font-black text-white mb-2">Usman Umar</h2>
                <div className="text-gold-400 font-semibold text-base mb-3">
                  AI SEO Strategist & Web Developer
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-5">
                  {[
                    { icon: '📍', label: 'Copenhagen, Denmark' },
                    { icon: '🇵🇰', label: 'Pakistani' },
                    { icon: '🤖', label: 'AI SEO Expert' },
                    { icon: '🌍', label: 'European Markets' },
                  ].map((t, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold glass border-white/10 text-white/50">
                      <span>{t.icon}</span>{t.label}
                    </span>
                  ))}
                </div>

                {/* LinkedIn button */}
                <a href="https://linkedin.com/in/usmandigital00" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 hover:-translate-y-0.5"
                  style={{ background: '#0a66c2', color: '#fff', boxShadow: '0 4px 16px rgba(10,102,194,0.35)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  linkedin.com/in/usmandigital00
                </a>
              </div>
            </div>
          </div>

          {/* Bio section */}
          <div className="p-8 md:p-10 border-b border-white/7 space-y-5">
            <p className="text-white/70 text-base leading-relaxed">
              Hi, I'm <strong className="text-white">Usman Umar</strong> — an AI SEO Strategist currently working for a digital marketing company in Copenhagen, Denmark. I specialize in building SEO strategies powered by modern AI tools, helping businesses grow their organic presence in competitive European markets.
            </p>
            <p className="text-white/70 text-base leading-relaxed">
              Beyond my professional work, I've built financial tools for the <strong className="text-white">German and Dutch markets</strong> — including a salary & tax calculator for the DACH region and a VAT calculator platform for the Netherlands — serving thousands of users across Europe.
            </p>
            <p className="text-white/70 text-base leading-relaxed">
              I built the <strong className="text-gold-400">Khanana Welfare Society</strong> platform as a personal gift to my village community back home in Pakistan. No budget, no client brief — just a belief that the people of Khanana Village deserve the same modern, transparent systems that the rest of the world takes for granted.
            </p>

            {/* Quote */}
            <div className="glass-gold rounded-2xl p-6 mt-6 relative">
              <div className="text-gold-500/30 text-6xl font-display leading-none absolute top-4 left-5">"</div>
              <p className="text-gold-300/90 text-base font-medium leading-relaxed italic pl-6">
                Technology should serve people — especially the ones closest to your heart.
              </p>
            </div>
          </div>

          {/* Tribute section */}
          <div className="p-8 md:p-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl glass-gold flex items-center justify-center text-xl">🤲</div>
                <div className="font-display font-bold text-gold-300 text-lg">A Special Tribute</div>
              </div>
              <p className="text-white/60 text-base leading-relaxed mb-4">
                A special tribute to every <strong className="text-white">member, volunteer, and contributor</strong> of Khanana Welfare Society — the people who show up every month, quietly and consistently, for their community. What you are doing is bigger than you know.
              </p>
              <p className="text-white/60 text-base leading-relaxed mb-5">
                May Allah bless you all, accept your efforts, and reward you in ways beyond measure.
              </p>
              <div className="inline-flex items-center gap-3 glass-gold px-6 py-3 rounded-2xl">
                <span className="text-2xl">🌙</span>
                <span className="text-gold-400 font-bold text-lg tracking-wide">آمین</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: '🇩🇪🇳🇱', label: 'Finance Tools Built', value: '2 Platforms', sub: 'German & Dutch markets' },
            { icon: '🌍', label: 'Users Served', value: 'Thousands', sub: 'Across Europe' },
            { icon: '❤️', label: 'This Project', value: 'Free Gift', sub: 'To Khanana Village' },
          ].map((s, i) => (
            <div key={i} className="card p-5 text-center hover:border-gold-500/20 hover:-translate-y-1 transition-all duration-200">
              <div className="text-2xl mb-3">{s.icon}</div>
              <div className="font-display font-black text-gold-400 text-lg mb-1">{s.value}</div>
              <div className="text-white/60 text-xs font-semibold mb-1">{s.label}</div>
              <div className="text-white/25 text-xs">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Back button */}
        <div className="text-center">
          <Link to="/" className="btn-ghost px-8 py-3 text-sm font-semibold inline-block">
            ← Back to Khanana Welfare Society
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8 px-6 text-center">
        <div className="text-white/20 text-xs">
          Developed with ❤️ from <span className="text-gold-500/50">Copenhagen, Denmark</span> by <span className="text-gold-500/50">Usman Umar</span>
        </div>
      </footer>
    </div>
  )
}
