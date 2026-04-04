import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Film, Users, TrendingUp, Shield, ChevronDown, BarChart3,
  Zap, Play, CheckCircle2, ArrowRight, Instagram
} from 'lucide-react';

const LandingPage = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const navigate = useNavigate();

  const closeAll = () => { setLoginOpen(false); setRegisterOpen(false); };

  return (
    <div className="min-h-screen bg-white font-body text-[#1b1c19]">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-white"
        style={{ borderBottom: '1px solid #eee' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#0028aa]">
            <Film className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-heading font-bold">
            Big<span className="text-[#0028aa]">Social</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#666]">
          <a href="#features" className="hover:text-[#0028aa] transition-colors">Features</a>
          <a href="#how" className="hover:text-[#0028aa] transition-colors">How It Works</a>
          <a href="#stats" className="hover:text-[#0028aa] transition-colors">Results</a>
        </div>

        <div className="flex items-center gap-3">
          {/* Login dropdown */}
          <div className="relative">
            <button
              onClick={() => { setLoginOpen(!loginOpen); setRegisterOpen(false); }}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold border-[1.5px] border-[#0028aa] text-[#0028aa] hover:bg-[#eef1ff] transition-colors"
            >
              Login <ChevronDown className={`w-4 h-4 transition-transform ${loginOpen ? 'rotate-180' : ''}`} />
            </button>
            {loginOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={closeAll} />
                <div className="absolute right-0 mt-2 w-56 rounded-2xl overflow-hidden shadow-xl z-50 bg-white border border-[#eee]">
                  <Link to="/login?role=producer" className="flex items-center gap-3 px-4 py-3.5 hover:bg-[#f5f4ff] transition-colors text-sm" onClick={closeAll}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#eef1ff]">
                      <Film className="w-4 h-4 text-[#0028aa]" />
                    </div>
                    <div>
                      <div className="font-semibold text-[#0028aa]">Producer</div>
                      <div className="text-xs text-[#999]">Google / Email OTP</div>
                    </div>
                  </Link>
                  <div className="h-px bg-[#f0f0f0] mx-4" />
                  <Link to="/login?role=influencer" className="flex items-center gap-3 px-4 py-3.5 hover:bg-[#fdf5ff] transition-colors text-sm" onClick={closeAll}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#fce8ff]">
                      <Instagram className="w-4 h-4 text-[#9333ea]" />
                    </div>
                    <div>
                      <div className="font-semibold text-[#9333ea]">Influencer</div>
                      <div className="text-xs text-[#999]">Instagram Login</div>
                    </div>
                  </Link>
                  <div className="h-px bg-[#f0f0f0] mx-4" />
                  <Link to="/login?role=vendor" className="flex items-center gap-3 px-4 py-3.5 hover:bg-[#f5f4ff] transition-colors text-sm" onClick={closeAll}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#eef1ff]">
                      <Shield className="w-4 h-4 text-[#0028aa]" />
                    </div>
                    <div>
                      <div className="font-semibold text-[#0028aa]">Vendor</div>
                      <div className="text-xs text-[#999]">Email Login</div>
                    </div>
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Register dropdown */}
          <div className="relative">
            <button
              onClick={() => { setRegisterOpen(!registerOpen); setLoginOpen(false); }}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold bg-[#0028aa] text-white hover:bg-[#1a3fd4] transition-colors"
            >
              Get Started <ChevronDown className={`w-4 h-4 transition-transform ${registerOpen ? 'rotate-180' : ''}`} />
            </button>
            {registerOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={closeAll} />
                <div className="absolute right-0 mt-2 w-56 rounded-2xl overflow-hidden shadow-xl z-50 bg-white border border-[#eee]">
                  <Link to="/register?role=producer" className="flex items-center gap-3 px-4 py-3.5 hover:bg-[#f5f4ff] transition-colors text-sm" onClick={closeAll}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#eef1ff]">
                      <Film className="w-4 h-4 text-[#0028aa]" />
                    </div>
                    <div>
                      <div className="font-semibold text-[#0028aa]">Producer</div>
                      <div className="text-xs text-[#999]">Register your film</div>
                    </div>
                  </Link>
                  <div className="h-px bg-[#f0f0f0] mx-4" />
                  <Link to="/register?role=influencer" className="flex items-center gap-3 px-4 py-3.5 hover:bg-[#fdf5ff] transition-colors text-sm" onClick={closeAll}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#fce8ff]">
                      <Instagram className="w-4 h-4 text-[#9333ea]" />
                    </div>
                    <div>
                      <div className="font-semibold text-[#9333ea]">Influencer</div>
                      <div className="text-xs text-[#999]">Join & earn</div>
                    </div>
                  </Link>
                  <div className="h-px bg-[#f0f0f0] mx-4" />
                  <Link to="/register?role=vendor" className="flex items-center gap-3 px-4 py-3.5 hover:bg-[#f5f4ff] transition-colors text-sm" onClick={closeAll}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#eef1ff]">
                      <Shield className="w-4 h-4 text-[#0028aa]" />
                    </div>
                    <div>
                      <div className="font-semibold text-[#0028aa]">Vendor</div>
                      <div className="text-xs text-[#999]">Join as service partner</div>
                    </div>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-28 pb-20 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 bg-[#eef1ff] text-[#0028aa] border border-[#c7d2fe]">
              🎬 South India's Movie Marketing Platform
            </div>
            <h1 className="text-5xl md:text-6xl font-heading font-extrabold mb-6 leading-[1.1]">
              Market Your Movie<br />
              <span className="text-[#0028aa]">the Smart Way</span>
            </h1>
            <p className="text-lg text-[#666] mb-8 leading-relaxed">
              Connect with 12,000+ verified influencers across Kerala, Tamil Nadu, Andhra Pradesh
              and Telangana. AI-powered campaigns, transparent escrow, real results.
            </p>

            <div className="flex flex-wrap gap-x-6 gap-y-2 mb-10">
              {['AI Script Review', 'Escrow Payments', 'Live Analytics', 'Multi-Phase Campaigns'].map(f => (
                <div key={f} className="flex items-center gap-1.5 text-sm font-semibold text-[#0028aa]">
                  <CheckCircle2 className="w-4 h-4" /> {f}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <Link to="/register?role=producer"
                className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-base bg-[#0028aa] text-white hover:bg-[#1a3fd4] transition-all hover:-translate-y-0.5 hover:shadow-lg">
                Start as Producer <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/register?role=influencer"
                className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-base border-[1.5px] border-[#9333ea] text-[#9333ea] hover:bg-[#fdf5ff] transition-all hover:-translate-y-0.5">
                <Instagram className="w-4 h-4" /> Join as Influencer
              </Link>
            </div>
          </div>

          {/* Dashboard mockup */}
          <div className="hidden lg:block">
            <div className="rounded-3xl p-6 shadow-2xl bg-[#0028aa]">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="text-white/40 text-xs ml-2 font-mono">bigsocial.in — Campaign Dashboard</span>
              </div>
              <div className="space-y-3 mb-4">
                {[
                  { title: 'Baahubali 3', status: 'Active', reach: '2.4M', color: '#34d399' },
                  { title: 'Pushpa Returns', status: 'Review', reach: '1.8M', color: '#fbbf24' },
                  { title: 'KGF 4', status: 'Live', reach: '5.1M', color: '#60a5fa' },
                ].map(({ title, status, reach, color }) => (
                  <div key={title} className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${color}25` }}>
                        <Film className="w-4 h-4" style={{ color }} />
                      </div>
                      <span className="text-white font-semibold text-sm">{title}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: `${color}22`, color }}>{status}</span>
                      <span className="text-xs text-white/50 font-mono">{reach}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="text-white/40 text-xs mb-1">Total Reach This Month</div>
                <div className="text-3xl font-heading font-extrabold text-white">9.3M</div>
                <div className="text-xs mt-1 text-[#34d399] font-semibold">↑ 24% vs last month</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div id="stats" className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-12 border-t border-[#eee]">
          {[['500+', 'Movies Marketed'], ['12,000+', 'Active Influencers'], ['₹80Cr+', 'Budget Managed'], ['4 States', 'Coverage']].map(([num, label]) => (
            <div key={label}>
              <div className="text-3xl font-heading font-extrabold text-[#0028aa]">{num}</div>
              <div className="text-sm text-[#888] mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 px-6 bg-[#fbf9f3]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-heading font-bold mb-4">Built for Movie Marketing</h2>
            <p className="text-[#888]">Every feature designed for South Indian film campaigns.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Zap,         bg: '#eef1ff', ic: '#0028aa', title: 'AI Script Review',      desc: 'Auto-review content against your campaign brief, brand safety guidelines, and tone preferences.' },
              { icon: Users,       bg: '#fce8ff', ic: '#9333ea', title: 'Smart Influencer Match', desc: 'Recommendations by follower tier (Nano→Mega), location, category, and engagement rate.' },
              { icon: Shield,      bg: '#ecfdf5', ic: '#059669', title: 'Escrow Protection',      desc: 'Funds locked safely. Released to influencers only after the verified post goes live.' },
              { icon: BarChart3,   bg: '#fff7ed', ic: '#ea580c', title: 'Live Analytics',         desc: 'Real-time reach, engagement, and ROI tracking across all campaign phases.' },
              { icon: Play,        bg: '#eff6ff', ic: '#2563eb', title: 'Phase Management',       desc: 'Manage Announcement, Teaser, Trailer and Post-Release from one place.' },
              { icon: TrendingUp,  bg: '#fef2f2', ic: '#dc2626', title: 'Booking Analytics',      desc: 'Exclusive box office data to align your influencer campaign with real-time collections.' },
            ].map(({ icon: Icon, bg, ic, title, desc }) => (
              <div key={title} className="p-6 bg-white rounded-2xl shadow-sm hover:-translate-y-1 transition-all border border-[#f0f0f0]">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: bg }}>
                  <Icon className="w-5 h-5" style={{ color: ic }} />
                </div>
                <h3 className="font-heading font-bold text-base mb-2">{title}</h3>
                <p className="text-sm text-[#888] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-20 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-heading font-bold mb-14">Launch in 3 Steps</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { n: '1', title: 'Create Campaign',   desc: 'Set your movie details, budget, target regions, and the influencer tiers you need.' },
            { n: '2', title: 'Pick Influencers',  desc: 'Browse AI recommendations, confirm your lineup, and lock funds into escrow.' },
            { n: '3', title: 'Go Live & Pay',     desc: 'Content submitted, reviewed, posted — payment automatically released.' },
          ].map(({ n, title, desc }) => (
            <div key={n} className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-heading font-extrabold mb-5 bg-[#0028aa] text-white shadow-lg">
                {n}
              </div>
              <h3 className="font-heading font-bold text-lg mb-3">{title}</h3>
              <p className="text-sm text-[#888] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center bg-[#0028aa]">
        <h2 className="text-4xl font-heading font-bold text-white mb-6">Ready to Market Your Film?</h2>
        <p className="text-white/70 mb-10 text-lg">Join 500+ producers and 12,000+ influencers on BigSocial.</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/register?role=producer"
            className="px-8 py-4 rounded-2xl font-bold text-base bg-white text-[#0028aa] hover:bg-[#f0f4ff] transition-colors">
            Start as Producer
          </Link>
          <Link to="/register?role=influencer"
            className="px-8 py-4 rounded-2xl font-bold text-base border-2 border-white/40 text-white hover:bg-white/10 transition-colors">
            Join as Influencer
          </Link>
        </div>
      </section>

      <footer className="py-8 text-center text-sm text-[#999] border-t border-[#f0f0f0] bg-white">
        © 2026 BigSocial · Movie Marketing Platform · India ·{' '}
        <Link to="/admin-login" className="text-[#ccc] hover:text-[#999] transition-colors text-xs">Admin</Link>
      </footer>
    </div>
  );
};

export default LandingPage;
