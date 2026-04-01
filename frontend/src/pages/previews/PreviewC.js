// PREVIEW C — "Vibrant Gradient"
// Deep indigo-to-purple gradient, glassmorphism cards, modern startup feel
import React, { useState } from 'react';
import { Film, Users, TrendingUp, Shield, ChevronDown, BarChart3, Zap, Play, Star, ArrowRight, Instagram } from 'lucide-react';

const glass = {
  background: 'rgba(255,255,255,0.07)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,255,255,0.12)',
};

const PreviewC = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  return (
    <div className="min-h-screen font-body" style={{
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      color: '#f0f0f0',
    }}>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4"
        style={{ ...glass, borderLeft: 'none', borderRight: 'none', borderTop: 'none' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#818cf8,#c084fc)' }}>
            <Film className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-heading font-bold">Big<span style={{ background: 'linear-gradient(90deg,#818cf8,#c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Social</span></span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.6)' }}>
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how" className="hover:text-white transition-colors">How It Works</a>
          <a href="#stats" className="hover:text-white transition-colors">Results</a>
        </div>

        <div className="flex items-center gap-3">
          {/* Login */}
          <div className="relative">
            <button onClick={() => { setLoginOpen(!loginOpen); setRegisterOpen(false); }}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
              style={{ ...glass, color: 'rgba(255,255,255,0.85)' }}>
              Login <ChevronDown className={`w-4 h-4 transition-transform ${loginOpen ? 'rotate-180' : ''}`} />
            </button>
            {loginOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl overflow-hidden shadow-2xl z-50"
                style={{ background: 'rgba(15,12,41,0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <a href="/login?role=producer" className="flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-colors text-sm">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(129,140,248,0.2)' }}>
                    <Film className="w-4 h-4" style={{ color: '#818cf8' }} />
                  </div>
                  <div>
                    <div className="font-semibold" style={{ color: '#818cf8' }}>Producer</div>
                    <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Google / Email OTP</div>
                  </div>
                </a>
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)', margin: '0 16px' }} />
                <a href="/login?role=influencer" className="flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-colors text-sm">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(192,132,252,0.2)' }}>
                    <Instagram className="w-4 h-4" style={{ color: '#c084fc' }} />
                  </div>
                  <div>
                    <div className="font-semibold" style={{ color: '#c084fc' }}>Influencer</div>
                    <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Login with Instagram</div>
                  </div>
                </a>
              </div>
            )}
          </div>

          {/* Register */}
          <div className="relative">
            <button onClick={() => { setRegisterOpen(!registerOpen); setLoginOpen(false); }}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
              style={{ background: 'linear-gradient(135deg,#818cf8,#c084fc)', color: 'white' }}>
              Get Started <ChevronDown className={`w-4 h-4 transition-transform ${registerOpen ? 'rotate-180' : ''}`} />
            </button>
            {registerOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl overflow-hidden shadow-2xl z-50"
                style={{ background: 'rgba(15,12,41,0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <a href="/register?role=producer" className="flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-colors text-sm">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(129,140,248,0.2)' }}>
                    <Film className="w-4 h-4" style={{ color: '#818cf8' }} />
                  </div>
                  <div>
                    <div className="font-semibold" style={{ color: '#818cf8' }}>Producer</div>
                    <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Register your film</div>
                  </div>
                </a>
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)', margin: '0 16px' }} />
                <a href="/register?role=influencer" className="flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-colors text-sm">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(192,132,252,0.2)' }}>
                    <Instagram className="w-4 h-4" style={{ color: '#c084fc' }} />
                  </div>
                  <div>
                    <div className="font-semibold" style={{ color: '#c084fc' }}>Influencer</div>
                    <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Join via Instagram</div>
                  </div>
                </a>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center text-center px-6 pt-20 overflow-hidden">
        {/* Orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-30"
            style={{ background: 'radial-gradient(circle,#6366f1,transparent 70%)' }} />
          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full opacity-25"
            style={{ background: 'radial-gradient(circle,#a855f7,transparent 70%)' }} />
        </div>

        <div className="relative max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
            <span className="text-sm ml-2" style={{ color: 'rgba(255,255,255,0.6)' }}>Trusted by 500+ Productions</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-heading font-extrabold mb-6 leading-[1.05]">
            India's Smartest<br />
            <span style={{ background: 'linear-gradient(90deg,#818cf8,#c084fc,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Movie × Influencer
            </span><br />
            Platform
          </h1>

          <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.8 }}>
            AI-powered campaigns. 12,000+ verified influencers. Escrow-protected payments.
            South India's most trusted film marketing ecosystem.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-14">
            <button className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg,#818cf8,#6366f1)', color: 'white' }}>
              <Film className="w-5 h-5" /> I'm a Producer <ArrowRight className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base transition-all hover:scale-105"
              style={{ background: 'rgba(192,132,252,0.15)', border: '1px solid rgba(192,132,252,0.4)', color: '#c084fc' }}>
              <Instagram className="w-5 h-5" /> I'm an Influencer
            </button>
          </div>

          {/* Floating cards */}
          <div className="flex flex-wrap gap-4 justify-center">
            {[
              { n: '500+', l: 'Movies' },
              { n: '12K+', l: 'Influencers' },
              { n: '₹80Cr', l: 'Campaigns' },
              { n: '4', l: 'States' },
            ].map(({ n, l }) => (
              <div key={l} className="px-5 py-3 rounded-2xl text-center"
                style={glass}>
                <div className="text-xl font-heading font-extrabold text-white">{n}</div>
                <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-heading font-bold mb-4">Powerful Features</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)' }}>Everything built for Indian film marketing.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: Zap, g: ['#818cf8','#6366f1'], title: 'AI Script Review', desc: 'Automated content review for brief alignment, brand safety, and tone.' },
            { icon: Users, g: ['#c084fc','#a855f7'], title: 'Smart Matching', desc: 'Influencer recommendations by tier, region, category & engagement.' },
            { icon: Shield, g: ['#34d399','#059669'], title: 'Escrow Payments', desc: 'Funds locked until deliverables go live. Zero payment risk.' },
            { icon: BarChart3, g: ['#fb923c','#f97316'], title: 'Campaign Analytics', desc: 'Real-time reach, engagement, and ROI across all phases.' },
            { icon: Play, g: ['#60a5fa','#3b82f6'], title: 'Phase Management', desc: 'Announcement, Teaser, Trailer, Post-Release — all managed.' },
            { icon: TrendingUp, g: ['#f472b6','#ec4899'], title: 'Booking Analytics', desc: "Box office data integrated with campaign performance." },
          ].map(({ icon: Icon, g, title, desc }) => (
            <div key={title} className="p-6 rounded-2xl transition-all hover:-translate-y-1" style={glass}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `linear-gradient(135deg,${g[0]},${g[1]})` }}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-heading font-bold text-base mb-2">{title}</h3>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW */}
      <section id="how" className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-heading font-bold mb-14">Three Steps to Launch</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: '01', g: ['#818cf8','#6366f1'], title: 'Create Campaign', desc: 'Set movie details, budget, regions, influencer tiers and phases.' },
              { n: '02', g: ['#c084fc','#a855f7'], title: 'Pick Influencers', desc: 'AI matches the best creators. Lock them in with escrow.' },
              { n: '03', g: ['#34d399','#059669'], title: 'Go Live & Pay', desc: 'Content reviewed, posted, and payment auto-released.' },
            ].map(({ n, g, title, desc }) => (
              <div key={n} className="p-6 rounded-2xl" style={glass}>
                <div className="text-4xl font-heading font-extrabold mb-4"
                  style={{ background: `linear-gradient(135deg,${g[0]},${g[1]})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {n}
                </div>
                <h3 className="font-heading font-bold text-lg mb-3">{title}</h3>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-xl mx-auto p-12 rounded-3xl" style={glass}>
          <h2 className="text-4xl font-heading font-bold mb-5">Start Your Campaign</h2>
          <p className="mb-8" style={{ color: 'rgba(255,255,255,0.55)' }}>Join India's fastest growing movie marketing platform.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="px-8 py-4 rounded-2xl font-bold"
              style={{ background: 'linear-gradient(135deg,#818cf8,#6366f1)', color: 'white' }}>
              Register as Producer
            </button>
            <button className="px-8 py-4 rounded-2xl font-bold"
              style={{ background: 'rgba(192,132,252,0.15)', border: '1px solid rgba(192,132,252,0.4)', color: '#c084fc' }}>
              Join as Influencer
            </button>
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-xs" style={{ color: 'rgba(255,255,255,0.3)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        © 2026 BigSocial · Movie Marketing Platform · India
      </footer>
    </div>
  );
};

export default PreviewC;
