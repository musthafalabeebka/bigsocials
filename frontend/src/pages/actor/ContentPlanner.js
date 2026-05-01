import React from 'react';
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Film,
  Instagram,
  MessageCircle,
  PenLine,
  Sparkles,
  Youtube,
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';

const weeklyPlan = [
  {
    day: 'Monday',
    title: 'Behind-the-scenes reel',
    platform: 'Instagram + Threads',
    time: '7:30 PM',
    status: 'Ready',
    goal: 'High saves and fan comments',
  },
  {
    day: 'Tuesday',
    title: 'Film memory carousel',
    platform: 'Facebook + Instagram',
    time: '6:00 PM',
    status: 'Copy review',
    goal: 'Family audience engagement',
  },
  {
    day: 'Wednesday',
    title: 'YouTube Shorts teaser',
    platform: 'YouTube',
    time: '8:00 PM',
    status: 'Edit pending',
    goal: 'Trailer recall and subscriber lift',
  },
  {
    day: 'Friday',
    title: 'Brand-safe lifestyle post',
    platform: 'LinkedIn + Instagram',
    time: '11:00 AM',
    status: 'Awaiting approval',
    goal: 'Brand partnership positioning',
  },
];

const platformMix = [
  ['Instagram', '34%', Instagram],
  ['YouTube', '18%', Youtube],
  ['Facebook', '20%', MessageCircle],
  ['Threads', '16%', MessageCircle],
  ['LinkedIn', '12%', PenLine],
];

const ContentPlanner = () => (
  <div className="flex min-h-screen bg-[#f8faff] text-[#101828]">
    <Sidebar />
    <main className="flex-1 overflow-x-hidden p-5 sm:p-8 lg:p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-[32px] bg-[linear-gradient(135deg,#0b1437_0%,#1d3fbf_60%,#8cb4ff_100%)] p-6 text-white shadow-xl sm:p-8 lg:p-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
              <CalendarDays className="h-4 w-4" />
              Content Planner
            </div>
            <h1 className="mt-4 text-3xl font-heading font-extrabold sm:text-4xl">
              Plan every post around audience momentum
            </h1>
            <p className="mt-3 text-base font-semibold leading-7 text-white/82">
              Schedule platform-specific content, review approvals, and turn film, brand, and PR moments into a clean publishing calendar.
            </p>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-4">
          <StatCard icon={CalendarDays} title="Planned posts" value="12" detail="Next 14 days" />
          <StatCard icon={CheckCircle2} title="Ready to publish" value="4" detail="Approved assets" />
          <StatCard icon={Clock3} title="Pending approvals" value="3" detail="Brand and PR review" />
          <StatCard icon={Sparkles} title="Best slot" value="7:30 PM" detail="Instagram + Threads" />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.15fr,0.85fr]">
          <article className="rounded-[28px] border border-[#dbe5ff] bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#8a94a6]">Publishing calendar</p>
                <h2 className="mt-2 text-2xl font-heading font-extrabold text-[#101828]">This week’s content plan</h2>
              </div>
              <span className="rounded-full bg-[#eef1ff] px-4 py-2 text-sm font-extrabold text-[#123bb7]">
                Optimized by engagement windows
              </span>
            </div>

            <div className="mt-6 space-y-4">
              {weeklyPlan.map((item) => (
                <article key={`${item.day}-${item.title}`} className="rounded-[24px] border border-[#e4e9f4] bg-[#f8faff] p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold uppercase text-[#123bb7]">
                          {item.day}
                        </span>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold uppercase text-[#6d983f]">
                          {item.status}
                        </span>
                      </div>
                      <h3 className="mt-3 text-xl font-heading font-extrabold text-[#101828]">{item.title}</h3>
                      <p className="mt-2 text-sm font-bold text-[#5f6f99]">{item.platform}</p>
                      <p className="mt-3 text-sm font-semibold leading-6 text-[#667085]">{item.goal}</p>
                    </div>
                    <div className="min-w-[130px] rounded-[16px] bg-white px-4 py-3">
                      <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#8a94a6]">Publish time</p>
                      <p className="mt-1 text-xl font-heading font-extrabold text-[#123bb7]">{item.time}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </article>

          <article className="rounded-[28px] border border-[#dbe5ff] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Film className="h-5 w-5 text-[#123bb7]" />
              <h2 className="text-2xl font-heading font-extrabold text-[#101828]">Platform mix</h2>
            </div>
            <div className="mt-6 space-y-4">
              {platformMix.map(([platform, share, Icon]) => (
                <div key={platform}>
                  <div className="mb-2 flex items-center justify-between text-sm font-bold text-[#35446a]">
                    <span className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-[#123bb7]" />
                      {platform}
                    </span>
                    <span>{share}</span>
                  </div>
                  <div className="h-3 rounded-full bg-[#edf2ff]">
                    <div className="h-3 rounded-full bg-[#123bb7]" style={{ width: share }} />
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

      </div>
    </main>
  </div>
);

const StatCard = ({ icon: Icon, title, value, detail }) => (
  <article className="rounded-[24px] border border-[#dbe5ff] bg-white p-5 shadow-sm">
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef1ff] text-[#123bb7]">
      <Icon className="h-5 w-5" />
    </div>
    <p className="mt-4 text-sm font-bold text-[#667085]">{title}</p>
    <p className="mt-1 text-3xl font-heading font-extrabold text-[#101828]">{value}</p>
    <p className="mt-1 text-sm font-semibold text-[#5f6f99]">{detail}</p>
  </article>
);

export default ContentPlanner;
