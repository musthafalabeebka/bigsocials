import React from 'react';
import {
  CalendarDays,
  CheckCircle2,
  HeartHandshake,
  MapPin,
  Megaphone,
  Users,
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';

const fanUnits = [
  {
    name: 'Nivin Pauly Fans Ernakulam',
    region: 'Ernakulam',
    members: '14K',
    lead: 'District coordinator',
    status: 'Verified',
    focus: 'Kochi theatre support, release-day audience reactions, and city-level social amplification.',
  },
  {
    name: 'Nivin Pauly Fans Thrissur',
    region: 'Thrissur',
    members: '9.5K',
    lead: 'District coordinator',
    status: 'Active',
    focus: 'Theatre celebrations, poster activity, and family audience engagement across the district.',
  },
  {
    name: 'Nivin Pauly Fans Kozhikode',
    region: 'Kozhikode',
    members: '8.8K',
    lead: 'District coordinator',
    status: 'Active',
    focus: 'North Kerala fan coordination, screening updates, and approved fan content collection.',
  },
  {
    name: 'Nivin Pauly Fans Thiruvananthapuram',
    region: 'Thiruvananthapuram',
    members: '7.6K',
    lead: 'District coordinator',
    status: 'Active',
    focus: 'Capital city media support, theatre visits, and press-friendly fan activity.',
  },
  {
    name: 'Nivin Pauly Fans Kottayam',
    region: 'Kottayam',
    members: '6.4K',
    lead: 'District coordinator',
    status: 'Active',
    focus: 'Central Kerala event support, charity coordination, and campaign sharing.',
  },
  {
    name: 'Nivin Pauly Fans Malappuram',
    region: 'Malappuram',
    members: '7.1K',
    lead: 'District coordinator',
    status: 'Active',
    focus: 'District-wide theatre response tracking and positive audience amplification.',
  },
];

const upcomingActions = [
  {
    title: 'Sarvam Maya weekend push',
    date: 'Apr 24, 2026',
    owner: 'Ernakulam and Thrissur units',
    task: 'Coordinate theatre photos, audience reactions, and approved hashtag use.',
  },
  {
    title: 'North Kerala theatre response',
    date: 'Apr 26, 2026',
    owner: 'Kozhikode and Malappuram units',
    task: 'Collect screening feedback and approved fan content for social reposting.',
  },
  {
    title: 'Birthday charity drive planning',
    date: 'May 02, 2026',
    owner: 'All Kerala district units',
    task: 'Confirm locations, volunteer count, and approved communication copy.',
  },
];

const activityReach = [
  ['Theatre response videos', '1.8M reach', 'Ernakulam and Thrissur units'],
  ['Approved hashtag push', '920K reach', 'All district units'],
  ['Fan art reposts', '640K reach', 'Kozhikode and Malappuram units'],
  ['Charity drive coverage', '410K reach', 'Kottayam and Thiruvananthapuram units'],
];

const FansUnits = () => (
  <div className="flex min-h-screen bg-[#f8faff] text-[#101828]">
    <Sidebar />
    <main className="flex-1 overflow-x-hidden p-5 sm:p-8 lg:p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-[32px] bg-[linear-gradient(135deg,#0b1437_0%,#1d3fbf_60%,#8cb4ff_100%)] p-6 text-white shadow-xl sm:p-8 lg:p-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
              <HeartHandshake className="h-4 w-4" />
              Fans Units
            </div>
            <h1 className="mt-4 text-3xl font-heading font-extrabold sm:text-4xl">
              Fan unit coordination for Nivin Pauly
            </h1>
            <p className="mt-3 text-base font-semibold leading-7 text-white/82">
              Coordinate verified fan clubs, release-day support, regional activity, and safe community amplification.
            </p>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          <StatCard icon={Users} title="District units" value="6" detail="Kerala fan groups" />
          <StatCard icon={MapPin} title="Districts covered" value="6" detail="Ernakulam, Thrissur and more" />
          <StatCard icon={Megaphone} title="Active campaigns" value="4" detail="Release and PR support" />
        </section>

        <section className="rounded-[28px] border border-[#dbe5ff] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#8a94a6]">Fan network</p>
              <h2 className="mt-2 text-2xl font-heading font-extrabold text-[#101828]">Verified fan units</h2>
            </div>
            <span className="rounded-full bg-[#eef1ff] px-4 py-2 text-sm font-extrabold text-[#123bb7]">
              Community-safe coordination
            </span>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {fanUnits.map((unit) => (
              <article key={unit.name} className="rounded-[24px] border border-[#e4e9f4] bg-[#f8faff] p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef1ff] text-[#123bb7]">
                  <HeartHandshake className="h-5 w-5" />
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-heading font-extrabold text-[#101828]">{unit.name}</h3>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold uppercase text-[#123bb7]">
                    {unit.status}
                  </span>
                </div>
                <p className="mt-2 text-sm font-bold text-[#5f6f99]">{unit.region} · {unit.lead}</p>
                <div className="mt-4 rounded-[16px] bg-white px-4 py-3">
                  <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#8a94a6]">Members</p>
                  <p className="mt-1 text-xl font-heading font-extrabold text-[#123bb7]">{unit.members}</p>
                </div>
                <p className="mt-4 text-sm font-semibold leading-6 text-[#667085]">{unit.focus}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.05fr,0.95fr]">
          <article className="rounded-[28px] border border-[#dbe5ff] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-[#123bb7]" />
              <h2 className="text-2xl font-heading font-extrabold text-[#101828]">Upcoming fan actions</h2>
            </div>
            <div className="mt-6 space-y-4">
              {upcomingActions.map((action) => (
                <div key={action.title} className="rounded-[22px] border border-[#e4e9f4] bg-[#f8faff] p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-lg font-heading font-extrabold text-[#101828]">{action.title}</h3>
                      <p className="mt-1 text-sm font-bold text-[#5f6f99]">{action.owner}</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold uppercase text-[#123bb7]">
                      {action.date}
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-semibold leading-6 text-[#667085]">{action.task}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[28px] border border-[#dbe5ff] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-[#123bb7]" />
              <h2 className="text-2xl font-heading font-extrabold text-[#101828]">Reach of activities</h2>
            </div>
            <p className="mt-2 text-sm font-semibold leading-6 text-[#667085]">
              Estimated reach from coordinated district fan activity, theatre content, hashtags, and approved community posts.
            </p>
            <div className="mt-6 space-y-4">
              {activityReach.map(([activity, reach, detail]) => (
                <div key={activity} className="rounded-[20px] border border-[#e4e9f4] bg-[#f8faff] p-4">
                  <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#6d983f]" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <h3 className="text-base font-heading font-extrabold text-[#101828]">{activity}</h3>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold uppercase text-[#123bb7]">
                          {reach}
                        </span>
                      </div>
                      <p className="mt-2 text-sm font-semibold leading-6 text-[#667085]">{detail}</p>
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

export default FansUnits;
