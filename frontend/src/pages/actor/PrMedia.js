import React from 'react';
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Megaphone,
  Newspaper,
  Radio,
  Tv,
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';

const mediaCalendar = [
  {
    title: 'Film companion interview',
    outlet: 'Film Companion South',
    date: 'Apr 24, 2026',
    time: '11:00 AM',
    format: 'Video interview',
    focus: 'Sarvam Maya release strategy and performance insights.',
    status: 'Confirmed',
  },
  {
    title: 'Morning show appearance',
    outlet: 'Asianet News',
    date: 'Apr 26, 2026',
    time: '9:30 AM',
    format: 'Television',
    focus: 'Brand collaborations, upcoming films, and fan response.',
    status: 'Prep notes due',
  },
  {
    title: 'Regional press roundtable',
    outlet: 'Kochi press circuit',
    date: 'Apr 29, 2026',
    time: '4:00 PM',
    format: 'Print + digital',
    focus: 'Career positioning, theatrical audience, and media Q&A.',
    status: 'Awaiting final list',
  },
];

const pressReleases = [
  {
    title: 'Kalyan Homes announces Nivin Pauly as brand ambassador',
    owner: 'Brand collabs desk',
    version: 'v2 approved',
    status: 'Published',
    channels: 'Business, lifestyle, regional entertainment',
  },
  {
    title: 'Sarvam Maya crosses Rs 150 Cr worldwide',
    owner: 'Film publicity team',
    version: 'Draft v3',
    status: 'Legal review',
    channels: 'Trade media, entertainment portals, social PR',
  },
  {
    title: 'Digital twin licensing guidelines for brand partners',
    owner: 'Commercial tools team',
    version: 'Draft v1',
    status: 'Internal review',
    channels: 'Brand partners and agency network',
  },
];

const coverageTracker = [
  {
    outlet: 'Manorama News',
    type: 'Digital article',
    story: 'Kalyan Homes brand ambassador announcement',
    reach: 'High regional reach',
    sentiment: 'Positive',
    status: 'Published',
    icon: Newspaper,
  },
  {
    outlet: 'Channeliam',
    type: 'Business feature',
    story: 'Nivin Pauly enters formal endorsement space',
    reach: 'Business audience',
    sentiment: 'Positive',
    status: 'Published',
    icon: Megaphone,
  },
  {
    outlet: 'Asianet News',
    type: 'TV segment',
    story: 'Upcoming actor interview and film performance discussion',
    reach: 'Mass Kerala audience',
    sentiment: 'Scheduled',
    status: 'Booked',
    icon: Tv,
  },
  {
    outlet: 'Radio Mango',
    type: 'Radio byte',
    story: 'Fan connect promo for the weekend media cycle',
    reach: 'Urban Kerala commute',
    sentiment: 'Neutral',
    status: 'Pending copy',
    icon: Radio,
  },
];

const PrMedia = () => (
  <div className="flex min-h-screen bg-[#f8faff] text-[#101828]">
    <Sidebar />
    <main className="flex-1 overflow-x-hidden p-5 sm:p-8 lg:p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-[32px] bg-[linear-gradient(135deg,#0b1437_0%,#1d3fbf_60%,#8cb4ff_100%)] p-6 text-white shadow-xl sm:p-8 lg:p-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
              <Newspaper className="h-4 w-4" />
              PR & Media
            </div>
            <h1 className="mt-4 text-3xl font-heading font-extrabold sm:text-4xl">
              Media command center for Nivin Pauly
            </h1>
            <p className="mt-3 text-base font-semibold leading-7 text-white/82">
              Manage interviews, press releases, published coverage, and media follow-ups from one workspace.
            </p>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          <StatCard icon={CalendarDays} title="Upcoming interviews" value="3" detail="Next 7 days" />
          <StatCard icon={FileText} title="Press releases" value="3" detail="Live and draft assets" />
          <StatCard icon={CheckCircle2} title="Published coverage" value="2" detail="Tracked outlets" />
        </section>

        <section className="rounded-[28px] border border-[#dbe5ff] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#8a94a6]">Media calendar</p>
              <h2 className="mt-2 text-2xl font-heading font-extrabold text-[#101828]">Upcoming interviews</h2>
            </div>
            <span className="rounded-full bg-[#eef1ff] px-4 py-2 text-sm font-extrabold text-[#123bb7]">
              Scheduling active
            </span>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {mediaCalendar.map((event) => (
              <article key={event.title} className="rounded-[24px] border border-[#e4e9f4] bg-[#f8faff] p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef1ff] text-[#123bb7]">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-xl font-heading font-extrabold text-[#101828]">{event.title}</h3>
                <p className="mt-1 text-sm font-bold text-[#5f6f99]">{event.outlet}</p>
                <div className="mt-4 grid gap-2">
                  <MiniDetail label="Date" value={event.date} />
                  <MiniDetail label="Time" value={event.time} />
                  <MiniDetail label="Format" value={event.format} />
                </div>
                <p className="mt-4 text-sm font-semibold leading-6 text-[#667085]">{event.focus}</p>
                <StatusPill label={event.status} />
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.9fr,1.1fr]">
          <article className="rounded-[28px] border border-[#dbe5ff] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#123bb7]" />
              <h2 className="text-2xl font-heading font-extrabold text-[#101828]">Press release management</h2>
            </div>
            <div className="mt-6 space-y-4">
              {pressReleases.map((release) => (
                <div key={release.title} className="rounded-[22px] border border-[#e4e9f4] bg-[#f8faff] p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-lg font-heading font-extrabold text-[#101828]">{release.title}</h3>
                      <p className="mt-2 text-sm font-semibold leading-6 text-[#667085]">{release.channels}</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold uppercase text-[#123bb7]">
                      {release.status}
                    </span>
                  </div>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <MiniDetail label="Owner" value={release.owner} />
                    <MiniDetail label="Version" value={release.version} />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[28px] border border-[#dbe5ff] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-[#123bb7]" />
              <h2 className="text-2xl font-heading font-extrabold text-[#101828]">Coverage tracker</h2>
            </div>
            <p className="mt-2 text-sm font-semibold leading-6 text-[#667085]">
              Track which media outlets published each story, the channel type, reach, sentiment, and current follow-up state.
            </p>
            <div className="mt-6 space-y-4">
              {coverageTracker.map(({ icon: Icon, ...coverage }) => (
                <div key={`${coverage.outlet}-${coverage.story}`} className="rounded-[22px] border border-[#e4e9f4] bg-[#f8faff] p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#eef1ff] text-[#123bb7]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-heading font-extrabold text-[#101828]">{coverage.outlet}</h3>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold uppercase text-[#123bb7]">
                          {coverage.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm font-bold text-[#5f6f99]">{coverage.type}</p>
                      <p className="mt-3 text-sm font-semibold leading-6 text-[#667085]">{coverage.story}</p>
                      <div className="mt-4 grid gap-2 sm:grid-cols-2">
                        <MiniDetail label="Reach" value={coverage.reach} />
                        <MiniDetail label="Sentiment" value={coverage.sentiment} />
                      </div>
                    </div>
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

const MiniDetail = ({ label, value }) => (
  <div className="rounded-[16px] bg-white px-3 py-3">
    <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#8a94a6]">{label}</p>
    <p className="mt-1 text-sm font-heading font-extrabold text-[#123bb7]">{value}</p>
  </div>
);

const StatusPill = ({ label }) => (
  <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-extrabold uppercase text-[#123bb7]">
    <Clock3 className="h-3.5 w-3.5" />
    {label}
  </div>
);

export default PrMedia;
