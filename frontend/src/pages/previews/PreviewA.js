// PREVIEW A — "Cinematic Dark"
// Dark navy with gold accents, bold brand aesthetic
import React, { useState } from 'react';
import { Tag, Users, TrendingUp, Shield, ChevronDown, Star, Play, BarChart3, Zap } from 'lucide-react';

const PreviewA = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  return (
    <div className="min-h-screen font-body" style={{ background: '#07081a', color: '#f0f0f0' }}>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4"
        style={{ background: 'rgba(7,8,26,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,200,50,0.1)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#f59e0b,#f97316)' }}>
            <Tag className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-heading font-bold text-white">Big<span style={{ color: '#f59e0b' }}>Social</span></span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-semibold" style={{ color: '#aaa' }}>
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how" className="hover:text-white transition-colors">How It Works</a>
          <a href="#stats" className="hover:text-white transition-colors">Results</a>
        </div>

        <div className="flex items-center gap-3 relative">
          {/* Login dropdown */}
          <div className="relative">
            <button onClick={() => { setLoginOpen(!loginOpen); setRegisterOpen(false); }}
              className="flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-semibold transition-all"
              style={{ border: '1px solid rgba(245,158,11,0.4)', color: '#f59e0b' }}>
              Login <ChevronDown className={`w-4 h-4 transition-transform ${loginOpen ? 'rotate-180' : ''}`} />
            </button>
            {loginOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl overflow-hidden shadow-2xl z-50"
                style={{ background: '#12132e', border: '1px solid rgba(245,158,11,0.2)' }}>
                <a href="/login?role=producer" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-sm">
                  <Tag className="w-4 h-4" style={{ color: '#f59e0b' }} />
                  <span>Brand Login</span>
                </a>
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '0 12px' }} />
                <a href="/login?role=influencer" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-sm">
                  <Users className="w-4 h-4" style={{ color: '#a78bfa' }} />
                  <span>Influencer Login</span>
                </a>
              </div>
            )}
          </div>

          {/* Register dropdown */}
          <div className="relative">
            <button onClick={() => { setRegisterOpen(!registerOpen); setLoginOpen(false); }}
              className="flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-semibold transition-all"
              style={{ background: 'linear-gradient(135deg,#f59e0b,#f97316)', color: '#07081a' }}>
              Get Started <ChevronDown className={`w-4 h-4 transition-transform ${registerOpen ? 'rotate-180' : ''}`} />
            </button>
            {registerOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl overflow-hidden shadow-2xl z-50"
                style={{ background: '#12132e', border: '1px solid rgba(245,158,11,0.2)' }}>
                <a href="/register?role=producer" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-sm">
                  <Tag className="w-4 h-4" style={{ color: '#f59e0b' }} />
                  <span>Join as Brand</span>
                </a>
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '0 12px' }} />
                <a href="/register?role=influencer" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-sm">
                  <Users className="w-4 h-4" style={{ color: '#a78bfa' }} />
                  <span>Join as Influencer</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center text-center px-6 pt-20 overflow-hidden">
        {/* Glow blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20" style={{ background: '#f59e0b', filter: 'blur(120px)' }} />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-15" style={{ background: '#7c3aed', filter: 'blur(100px)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5" style={{ background: '#0028aa', filter: 'blur(80px)' }} />
        </div>

        {/* Brand strip decoration */}
        <div className="absolute left-0 top-0 h-full w-8 opacity-10" style={{
          backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 30px, #f59e0b 30px, #f59e0b 32px)',
        }} />
        <div className="absolute right-0 top-0 h-full w-8 opacity-10" style={{
          backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 30px, #f59e0b 30px, #f59e0b 32px)',
        }} />

        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-8"
            style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', color: '#f59e0b' }}>
            <Star className="w-3 h-3 fill-current" /> India's #1 Brand Marketing Platform
          </div>

          <h1 className="text-6xl md:text-8xl font-heading font-extrabold mb-6 leading-[1.05]">
            Where <span style={{ background: 'linear-gradient(90deg,#f59e0b,#f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Brands</span> Find<br />
            Their <span style={{ color: '#a78bfa' }}>Audience</span>
          </h1>

          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto" style={{ color: '#888', lineHeight: 1.7 }}>
            Connect brands with verified social media influencers across South India.
            AI-powered matching, escrow payments, script review — all in one platform.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <button className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg,#f59e0b,#f97316)', color: '#07081a' }}>
              <Tag className="w-5 h-5" /> I'm a Brand
            </button>
            <button className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base transition-all hover:scale-105"
              style={{ background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.4)', color: '#a78bfa' }}>
              <Users className="w-5 h-5" /> I'm an Influencer
            </button>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-8 justify-center mt-16">
            {[['500+', 'Brands Marketed'], ['12,000+', 'Active Influencers'], ['₹80Cr+', 'Campaigns Run'], ['4 States', 'Coverage']].map(([num, label]) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-heading font-extrabold" style={{ color: '#f59e0b' }}>{num}</div>
                <div className="text-xs mt-1" style={{ color: '#666' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-heading font-bold mb-4">Everything You Need</h2>
          <p style={{ color: '#888' }}>From campaign creation to payment release — one platform.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Zap, color: '#f59e0b', title: 'AI Script Review', desc: 'Auto-review submitted content against campaign brief, brand safety, and tone guidelines.' },
            { icon: Users, color: '#a78bfa', title: 'Influencer Matching', desc: 'Smart recommendations based on follower tier, location, category, and engagement rate.' },
            { icon: Shield, color: '#34d399', title: 'Escrow Payments', desc: 'Funds held safely. Released only after deliverables go live — zero risk for campaign teams.' },
            { icon: BarChart3, color: '#f97316', title: 'Live Analytics', desc: 'Track reach, engagement, and ROI across all campaign phases in real time.' },
            { icon: Play, color: '#60a5fa', title: 'Multi-Phase Campaigns', desc: 'Manage Announcement, Preview, Trailer and Post-Release phases seamlessly.' },
            { icon: TrendingUp, color: '#fb7185', title: 'Booking Analytics', desc: "Exclusive market data to align your campaign with your brand's collection curve." },
          ].map(({ icon: Icon, color, title, desc }) => (
            <div key={title} className="p-6 rounded-2xl transition-all hover:-translate-y-1"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${color}20` }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <h3 className="font-heading font-bold text-lg mb-2">{title}</h3>
              <p className="text-sm" style={{ color: '#777', lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-24 px-6" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-heading font-bold mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { step: '01', title: 'Create Campaign', desc: 'Brand teams define brand details, budget, regions, and influencer tiers needed.' },
              { step: '02', title: 'Match & Confirm', desc: 'AI recommends influencers. Lock them in and release escrowed funds.' },
              { step: '03', title: 'Go Live', desc: 'Influencers submit scripts, get reviewed, post content, receive payment.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex flex-col items-center">
                <div className="text-5xl font-heading font-extrabold mb-4" style={{ color: 'rgba(245,158,11,0.2)' }}>{step}</div>
                <h3 className="font-heading font-bold text-xl mb-3">{title}</h3>
                <p className="text-sm" style={{ color: '#888', lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-heading font-bold mb-6">Ready to Launch Your Campaign?</h2>
          <p className="mb-10" style={{ color: '#888' }}>Join hundreds of campaign teams and thousands of influencers on BigSocial.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="px-8 py-4 rounded-2xl font-bold text-base"
              style={{ background: 'linear-gradient(135deg,#f59e0b,#f97316)', color: '#07081a' }}>
              Start as Brand
            </button>
            <button className="px-8 py-4 rounded-2xl font-bold text-base"
              style={{ background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.4)', color: '#a78bfa' }}>
              Join as Influencer
            </button>
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-xs" style={{ color: '#444', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        © 2026 BigSocial · Brand Marketing Platform · India
      </footer>
    </div>
  );
};

export default PreviewA;
