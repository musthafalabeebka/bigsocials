import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  ChevronDown,
  Tag,
  Instagram,
  MapPinned,
  Megaphone,
  Newspaper,
  Radio,
  ShieldCheck,
  Store,
  Users,
} from 'lucide-react';

const heroImage =
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=2400&q=80';

const channelImage =
  'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=1200&q=80';

const productionImage =
  'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80';

const planningImage =
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80';

const LandingPage = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  const closeAll = () => {
    setLoginOpen(false);
    setRegisterOpen(false);
  };

  const loginItems = [
    {
      to: '/login?role=producer',
      icon: Tag,
      title: 'Producer',
      detail: 'Producer dashboard',
      accent: '#0028aa',
      bg: '#eef1ff',
    },
    {
      to: '/login?role=brand',
      icon: Megaphone,
      title: 'Brand',
      detail: 'Brand campaign login',
      accent: '#1a3fd4',
      bg: '#eef6ff',
    },
    {
      to: '/login?role=influencer',
      icon: Instagram,
      title: 'Influencer',
      detail: 'Creator login',
      accent: '#1a3fd4',
      bg: '#eef6ff',
    },
    {
      to: '/login?role=vendor',
      icon: Store,
      title: 'Vendor',
      detail: 'Partner workspace',
      accent: '#2e51c9',
      bg: '#edf4ff',
    },
  ];

  const registerItems = [
    {
      to: '/register?role=producer',
      icon: Tag,
      title: 'Brand Team',
      detail: 'Launch a campaign',
      accent: '#0028aa',
      bg: '#eef1ff',
    },
    {
      to: '/register?role=brand',
      icon: Megaphone,
      title: 'Brand',
      detail: 'Plan a promotion',
      accent: '#1a3fd4',
      bg: '#eef6ff',
    },
  ];

  const channels = [
    {
      icon: Instagram,
      title: 'Creators',
      copy: 'Verified voices for reels, reviews, launches, store visits, and regional buzz.',
      color: '#0028aa',
    },
    {
      icon: Newspaper,
      title: 'Press and media',
      copy: 'Newspapers, radio, PR pushes, and local coverage planned around key dates.',
      color: '#1a3fd4',
    },
    {
      icon: MapPinned,
      title: 'Outdoor reach',
      copy: 'Billboards, tea shop boards, notice campaigns, field teams, and student networks.',
      color: '#2e51c9',
    },
    {
      icon: BarChart3,
      title: 'Performance',
      copy: 'Budget tracking, delivery status, proof of work, and campaign-level reporting.',
      color: '#4f73e6',
    },
  ];

  const audiences = [
    {
      image: productionImage,
      label: 'For campaign teams',
      title: 'Build launch momentum across every market.',
      copy: 'Coordinate creators, PR, media buys, outdoor inventory, and local ground activity across every campaign phase.',
    },
    {
      image: planningImage,
      label: 'For brands',
      title: 'Turn launches into regional demand.',
      copy: 'Book creators and offline partners for product drops, retail pushes, festivals, campus activations, and city-by-city promotions.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8faff] font-body text-[#1b1c19]">
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-black/10 bg-white/95 px-4 py-3 backdrop-blur md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3" onClick={closeAll}>
            <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#0028aa]">
              <Megaphone className="h-5 w-5 text-white" />
            </div>
            <span className="font-heading text-xl font-extrabold tracking-normal">
              Big<span className="text-[#0028aa]">Socials</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-bold text-[#525252] md:flex">
            <a href="#solutions" className="transition-colors hover:text-[#0028aa]">
              Solutions
            </a>
            <a href="#channels" className="transition-colors hover:text-[#0028aa]">
              Channels
            </a>
            <a href="#workflow" className="transition-colors hover:text-[#0028aa]">
              Workflow
            </a>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => {
                  setLoginOpen(!loginOpen);
                  setRegisterOpen(false);
                }}
                className="flex items-center gap-1.5 rounded-[8px] border border-[#0028aa] px-3 py-2 text-sm font-bold text-[#0028aa] transition-colors hover:bg-[#0028aa] hover:text-white md:px-5"
              >
                Login
                <ChevronDown className={`h-4 w-4 transition-transform ${loginOpen ? 'rotate-180' : ''}`} />
              </button>

              {loginOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={closeAll} />
                  <div className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-[8px] border border-black/10 bg-white shadow-xl">
                    {loginItems.map(({ to, icon: Icon, title, detail, accent, bg }) => (
                      <Link
                        key={title}
                        to={to}
                        className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[#f5f5f0]"
                        onClick={closeAll}
                      >
                        <span
                          className="flex h-9 w-9 items-center justify-center rounded-[8px]"
                          style={{ backgroundColor: bg }}
                        >
                          <Icon className="h-4 w-4" style={{ color: accent }} />
                        </span>
                        <span>
                          <span className="block text-sm font-extrabold text-[#1b1c19]">{title}</span>
                          <span className="block text-xs font-semibold text-[#737373]">{detail}</span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => {
                  setRegisterOpen(!registerOpen);
                  setLoginOpen(false);
                }}
                className="flex items-center gap-1.5 rounded-[8px] bg-[#0028aa] px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-[#1a3fd4] md:px-5"
              >
                Start
                <ChevronDown className={`h-4 w-4 transition-transform ${registerOpen ? 'rotate-180' : ''}`} />
              </button>

              {registerOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={closeAll} />
                  <div className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-[8px] border border-black/10 bg-white shadow-xl">
                    {registerItems.map(({ to, icon: Icon, title, detail, accent, bg }) => (
                      <Link
                        key={title}
                        to={to}
                        className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[#f5f5f0]"
                        onClick={closeAll}
                      >
                        <span
                          className="flex h-9 w-9 items-center justify-center rounded-[8px]"
                          style={{ backgroundColor: bg }}
                        >
                          <Icon className="h-4 w-4" style={{ color: accent }} />
                        </span>
                        <span>
                          <span className="block text-sm font-extrabold text-[#1b1c19]">{title}</span>
                          <span className="block text-xs font-semibold text-[#737373]">{detail}</span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <header
        className="relative flex min-h-[82svh] items-end overflow-hidden bg-[#0028aa] px-4 pb-12 pt-28 text-white md:px-8 md:pb-16"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(0,40,170,0.92) 0%, rgba(0,40,170,0.72) 45%, rgba(0,40,170,0.22) 100%), url(${heroImage})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        <div className="mx-auto w-full max-w-7xl">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-[8px] border border-white/25 bg-white/10 px-3 py-2 text-xs font-extrabold uppercase tracking-normal text-white">
              <BadgeCheck className="h-4 w-4 text-white" />
              Marketing for brands and campaign teams
            </div>
            <h1 className="font-heading text-5xl font-black leading-[1.02] tracking-normal md:text-7xl">
              Launch campaigns people actually notice.
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-white/[0.82] md:text-xl">
              Plan creator, media, outdoor, and ground campaigns from one place, built for brand launches,
              brand launches, retail pushes, and regional growth.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/register?role=producer"
                className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-white px-6 py-4 text-base font-extrabold text-[#0028aa] transition-colors hover:bg-[#eef1ff]"
              >
                Start a campaign
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="border-b border-black/10 bg-white px-4 py-5 md:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 md:grid-cols-4">
          {[
            ['12,000+', 'creators and local partners'],
            ['4', 'state-level campaign regions'],
            ['INR 80Cr+', 'campaign budget capacity'],
            ['500+', 'brand activations'],
          ].map(([value, label]) => (
            <div key={label} className="border-l-4 border-[#0028aa] pl-4">
              <div className="font-heading text-2xl font-black text-[#0028aa] md:text-3xl">{value}</div>
              <div className="mt-1 text-sm font-semibold leading-5 text-[#666]">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="solutions" className="px-4 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-sm font-extrabold uppercase tracking-normal text-[#0028aa]">
              Built for high-stakes launches
            </p>
            <h2 className="font-heading text-4xl font-black leading-tight md:text-5xl">
              One platform for cultural reach and commercial outcomes.
            </h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {audiences.map(({ image, label, title, copy }) => (
              <article key={label} className="overflow-hidden rounded-[8px] border border-black/10 bg-white">
                <img src={image} alt="" className="h-64 w-full object-cover" />
                <div className="p-6 md:p-8">
                  <p className="mb-3 text-sm font-extrabold uppercase tracking-normal text-[#0028aa]">{label}</p>
                  <h3 className="font-heading text-2xl font-black leading-tight">{title}</h3>
                  <p className="mt-4 text-base font-medium leading-7 text-[#5f5f5f]">{copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="channels" className="bg-[#0028aa] px-4 py-16 text-white md:px-8 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="mb-3 text-sm font-extrabold uppercase tracking-normal text-white/75">
              Campaign channels
            </p>
            <h2 className="font-heading text-4xl font-black leading-tight md:text-5xl">
              Pick the right mix for every launch window.
            </h2>
            <p className="mt-5 text-lg font-medium leading-8 text-white/70">
              Move from awareness to action with creators, media, outdoor placements, and on-ground
              partners working around the same brief, budget, and calendar.
            </p>
            <img src={channelImage} alt="" className="mt-8 h-72 w-full rounded-[8px] object-cover" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {channels.map(({ icon: Icon, title, copy, color }) => (
              <div key={title} className="rounded-[8px] border border-white/[0.12] bg-white/[0.08] p-6">
                <div
                  className="mb-5 flex h-11 w-11 items-center justify-center rounded-[8px]"
                  style={{ backgroundColor: color }}
                >
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-heading text-xl font-black">{title}</h3>
                <p className="mt-3 text-sm font-medium leading-6 text-white/[0.68]">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="workflow" className="bg-white px-4 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-end">
            <div>
              <p className="mb-3 text-sm font-extrabold uppercase tracking-normal text-[#0028aa]">
                Workflow
              </p>
              <h2 className="font-heading text-4xl font-black leading-tight md:text-5xl">
                From brief to proof without loose ends.
              </h2>
            </div>
            <p className="text-lg font-medium leading-8 text-[#5f5f5f]">
              Keep campaign planning, partner selection, approvals, payments, and performance in a single operating rhythm.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            {[
              ['01', 'Build the brief', 'Audience, region, budget, launch dates, content tone, and campaign goal.'],
              ['02', 'Select partners', 'Creators, vendors, media channels, and field teams matched to the brief.'],
              ['03', 'Approve delivery', 'Content, bookings, proofs, and go-live status reviewed before launch.'],
              ['04', 'Track results', 'Spend, reach, engagement, partner status, and proof of work stay visible.'],
            ].map(([number, title, copy]) => (
              <div key={title} className="rounded-[8px] border border-[#dbe4ff] bg-[#f8faff] p-6">
                <div className="mb-8 font-mono text-sm font-bold text-[#0028aa]">{number}</div>
                <h3 className="font-heading text-xl font-black">{title}</h3>
                <p className="mt-3 text-sm font-medium leading-6 text-[#666]">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              title: 'Controlled spend',
              copy: 'Campaign budgets stay attached to approved work and partner milestones.',
            },
            {
              icon: Users,
              title: 'Regional depth',
              copy: 'Plan by state, district, category, audience, and channel mix.',
            },
            {
              icon: Radio,
              title: 'Online and offline',
              copy: 'Creator content, media placements, retail reach, and local activations work together.',
            },
          ].map(({ icon: Icon, title, copy }) => (
            <div key={title} className="rounded-[8px] border border-black/10 bg-white p-7">
              <Icon className="h-8 w-8 text-[#0028aa]" />
              <h3 className="mt-5 font-heading text-2xl font-black">{title}</h3>
              <p className="mt-3 text-base font-medium leading-7 text-[#666]">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#0028aa] px-4 py-16 text-white md:px-8 md:py-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-extrabold uppercase tracking-normal text-white/75">
              Ready for the next launch
            </p>
            <h2 className="font-heading text-4xl font-black leading-tight md:text-5xl">
              Bring creators, media, and ground teams into one campaign.
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
            <Link
              to="/register?role=producer"
              className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-white px-6 py-4 text-base font-extrabold text-[#0028aa] transition-colors hover:bg-[#eef1ff]"
            >
              Start a campaign
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/login?role=producer"
              className="inline-flex items-center justify-center rounded-[8px] border border-white/50 px-6 py-4 text-base font-extrabold text-white transition-colors hover:bg-white hover:text-[#0028aa]"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-black/10 bg-white px-4 py-8 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm font-semibold text-[#737373] md:flex-row md:items-center md:justify-between">
          <p>© 2026 BigSocials. Marketing platform for brands and campaign teams.</p>
          <Link to="/admin-login" className="text-[#a3a3a3] transition-colors hover:text-[#0028aa]">
            Admin
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
