// PREVIEW B — "Clean & Professional" (Light, brand blue)
// Cream white base, deep blue primary, minimal, B2B SaaS feel
import React, { useState } from 'react';
import { Tag, Users, TrendingUp, Shield, ChevronDown, BarChart3, Zap, Play, CheckCircle2, ArrowRight } from 'lucide-react';

const PreviewB = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  return (
    <div className="min-h-screen font-body bg-white" style={{ color: '#1b1c19' }}>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-white"
        style={{ borderBottom: '1px solid #eee' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#0028aa' }}>
            <Tag className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-heading font-bold" style={{ color: '#0028aa' }}>Big<span style={{ color: '#1b1c19' }}>Social</span></span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-semibold" style={{ color: '#666' }}>
          <a href="#features" className="hover:text-[#0028aa] transition-colors">Features</a>
          <a href="#how" className="hover:text-[#0028aa] transition-colors">How It Works</a>
          <a href="#stats" className="hover:text-[#0028aa] transition-colors">Results</a>
        </div>

        <div className="flex items-center gap-3 relative">
          {/* Login */}
          <div className="relative">
            <button onClick={() => { setLoginOpen(!loginOpen); setRegisterOpen(false); }}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
              style={{ border: '1.5px solid #0028aa', color: '#0028aa', background: 'transparent' }}>
              Login <ChevronDown className={`w-4 h-4 transition-transform ${loginOpen ? 'rotate-180' : ''}`} />
            </button>
            {loginOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-2xl overflow-hidden shadow-xl z-50 bg-white"
                style={{ border: '1px solid #eee' }}>
                <a href="/login?role=producer" className="flex items-center gap-3 px-4 py-3.5 hover:bg-[#f5f4ff] transition-colors text-sm">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#eef1ff' }}>
                    <Tag className="w-4 h-4" style={{ color: '#0028aa' }} />
                  </div>
                  <div>
                    <div className="font-semibold text-[#0028aa]">Brand Team</div>
                    <div className="text-xs" style={{ color: '#999' }}>Google / Email OTP</div>
                  </div>
                </a>
                <div style={{ height: '1px', background: '#f0f0f0', margin: '0 16px' }} />
                <a href="/login?role=influencer" className="flex items-center gap-3 px-4 py-3.5 hover:bg-[#f5f4ff] transition-colors text-sm">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#fce8ff' }}>
                    <Users className="w-4 h-4" style={{ color: '#9333ea' }} />
                  </div>
                  <div>
                    <div className="font-semibold" style={{ color: '#9333ea' }}>Influencer</div>
                    <div className="text-xs" style={{ color: '#999' }}>Instagram Login</div>
                  </div>
                </a>
              </div>
            )}
          </div>

          {/* Register */}
          <div className="relative">
            <button onClick={() => { setRegisterOpen(!registerOpen); setLoginOpen(false); }}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:opacity-90"
              style={{ background: '#0028aa', color: 'white' }}>
              Get Started <ChevronDown className={`w-4 h-4 transition-transform ${registerOpen ? 'rotate-180' : ''}`} />
            </button>
            {registerOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-2xl overflow-hidden shadow-xl z-50 bg-white"
                style={{ border: '1px solid #eee' }}>
                <a href="/register?role=producer" className="flex items-center gap-3 px-4 py-3.5 hover:bg-[#f5f4ff] transition-colors text-sm">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#eef1ff' }}>
                    <Tag className="w-4 h-4" style={{ color: '#0028aa' }} />
                  </div>
                  <div>
                    <div className="font-semibold text-[#0028aa]">Brand Team</div>
                    <div className="text-xs" style={{ color: '#999' }}>Register your brand</div>
                  </div>
                </a>
                <div style={{ height: '1px', background: '#f0f0f0', margin: '0 16px' }} />
                <a href="/register?role=influencer" className="flex items-center gap-3 px-4 py-3.5 hover:bg-[#f5f4ff] transition-colors text-sm">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#fce8ff' }}>
                    <Users className="w-4 h-4" style={{ color: '#9333ea' }} />
                  </div>
                  <div>
                    <div className="font-semibold" style={{ color: '#9333ea' }}>Influencer</div>
                    <div className="text-xs" style={{ color: '#999' }}>Join & earn</div>
                  </div>
                </a>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-28 pb-20 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6"
              style={{ background: '#eef1ff', color: '#0028aa', border: '1px solid #c7d2fe' }}>
              🎬 South India's Brand Marketing Platform
            </div>
            <h1 className="text-5xl md:text-6xl font-heading font-extrabold mb-6 leading-[1.1]">
              Market Your Brand<br />
              <span style={{ color: '#0028aa' }}>the Smart Way</span>
            </h1>
            <p className="text-lg mb-8" style={{ color: '#666', lineHeight: 1.8 }}>
              Connect with 12,000+ verified influencers across Kerala, Tamil Nadu, Andhra Pradesh and Telangana.
              AI-powered campaigns. Transparent escrow. Real results.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              {['AI Script Review', 'Escrow Payments', 'Live Analytics', 'Multi-Phase Campaigns'].map(f => (
                <div key={f} className="flex items-center gap-1.5 text-sm font-semibold"
                  style={{ color: '#0028aa' }}>
                  <CheckCircle2 className="w-4 h-4" /> {f}
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <button className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-base transition-all hover:-translate-y-0.5 hover:shadow-lg"
                style={{ background: '#0028aa', color: 'white' }}>
                Start as Brand <ArrowRight className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-base transition-all hover:-translate-y-0.5"
                style={{ border: '1.5px solid #9333ea', color: '#9333ea', background: 'transparent' }}>
                Join as Influencer
              </button>
            </div>
          </div>

          {/* Right panel: Dashboard mockup */}
          <div className="relative hidden lg:block">
            <div className="rounded-3xl p-6 shadow-2xl" style={{ background: '#0028aa' }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="text-white/40 text-xs ml-2">Campaign Dashboard</span>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Baahubali 3', status: 'Active', reach: '2.4M', color: '#34d399' },
                  { label: 'Pushpa Returns', status: 'Review', reach: '1.8M', color: '#fbbf24' },
                  { label: 'KGF 4', status: 'Live', reach: '5.1M', color: '#60a5fa' },
                ].map(({ label, status, reach, color }) => (
                  <div key={label} className="flex items-center justify-between px-4 py-3 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl" style={{ background: `${color}30` }}>
                        <Tag className="w-4 h-4 mt-2 ml-2" style={{ color }} />
                      </div>
                      <span className="text-white font-semibold text-sm">{label}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: `${color}20`, color }}>{status}</span>
                      <span className="text-xs text-white/60">{reach} reach</span>
                    </div>
                  </div>
                ))}
                <div className="mt-4 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <div className="text-white/50 text-xs mb-2">Total Reach This Month</div>
                  <div className="text-3xl font-heading font-extrabold text-white">9.3M</div>
                  <div className="text-xs mt-1" style={{ color: '#34d399' }}>↑ 24% vs last month</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-12" style={{ borderTop: '1px solid #eee' }}>
          {[['500+', 'Brands Marketed'], ['12,000+', 'Influencers'], ['₹80Cr+', 'Budget Managed'], ['4', 'States Covered']].map(([num, label]) => (
            <div key={label}>
              <div className="text-3xl font-heading font-extrabold" style={{ color: '#0028aa' }}>{num}</div>
              <div className="text-sm mt-1" style={{ color: '#888' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 px-6" style={{ background: '#fbf9f3' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-heading font-bold mb-4">Built for Brand Marketing</h2>
            <p style={{ color: '#888' }}>Every feature designed for South Indian brand campaigns.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Zap, bg: '#eef1ff', ic: '#0028aa', title: 'AI Script Review', desc: 'Auto-review content against your campaign brief, brand safety guidelines, and tone preferences.' },
              { icon: Users, bg: '#fce8ff', ic: '#9333ea', title: 'Smart Matching', desc: 'Recommendations by follower tier (Nano to Mega), location, category, and engagement rate.' },
              { icon: Shield, bg: '#ecfdf5', ic: '#059669', title: 'Escrow Protection', desc: 'Funds locked safely. Released to influencers only after verified post goes live.' },
              { icon: BarChart3, bg: '#fff7ed', ic: '#ea580c', title: 'Live Analytics', desc: 'Real-time reach, engagement, and ROI tracking across all campaign phases.' },
              { icon: Play, bg: '#eff6ff', ic: '#2563eb', title: 'Phase Management', desc: 'Manage Announcement, Preview, Trailer and Post-Release phases from one place.' },
              { icon: TrendingUp, bg: '#fef2f2', ic: '#dc2626', title: 'Booking Analytics', desc: "Exclusive market data to align your influencer campaign with real-time collections." },
            ].map(({ icon: Icon, bg, ic, title, desc }) => (
              <div key={title} className="p-6 bg-white rounded-2xl shadow-sm hover:-translate-y-1 transition-all"
                style={{ border: '1px solid #f0f0f0' }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: bg }}>
                  <Icon className="w-5 h-5" style={{ color: ic }} />
                </div>
                <h3 className="font-heading font-bold text-base mb-2">{title}</h3>
                <p className="text-sm" style={{ color: '#888', lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW */}
      <section id="how" className="py-20 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-heading font-bold mb-14">Launch in 3 Steps</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { n: '1', title: 'Create Campaign', desc: 'Set your brand details, budget, target regions, and the influencer tiers you need.' },
            { n: '2', title: 'Pick Influencers', desc: 'Browse AI recommendations, confirm your lineup, and lock funds into escrow.' },
            { n: '3', title: 'Go Live & Pay', desc: 'Influencers submit content, get reviewed, post it, and receive automatic payment.' },
          ].map(({ n, title, desc }) => (
            <div key={n} className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-heading font-extrabold mb-5 text-white"
                style={{ background: '#0028aa' }}>{n}</div>
              <h3 className="font-heading font-bold text-lg mb-3">{title}</h3>
              <p className="text-sm" style={{ color: '#888', lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center" style={{ background: '#0028aa' }}>
        <h2 className="text-4xl font-heading font-bold text-white mb-6">Ready to Market Your Brand?</h2>
        <p className="mb-10 text-white/70">Join 500+ campaign teams and 12,000+ influencers on BigSocial.</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <button className="px-8 py-4 rounded-2xl font-bold text-base bg-white" style={{ color: '#0028aa' }}>
            Start as Brand
          </button>
          <button className="px-8 py-4 rounded-2xl font-bold text-base"
            style={{ border: '2px solid rgba(255,255,255,0.4)', color: 'white', background: 'transparent' }}>
            Join as Influencer
          </button>
        </div>
      </section>

      <footer className="py-8 text-center text-sm" style={{ color: '#999', borderTop: '1px solid #f0f0f0' }}>
        © 2026 BigSocial · Brand Marketing Platform · India
      </footer>
    </div>
  );
};

export default PreviewB;
