import React from 'react';
import {
  BadgeCheck,
  BarChart3,
  Clapperboard,
  Eye,
  Film,
  Hash,
  IndianRupee,
  Instagram,
  MessageCircle,
  TrendingUp,
  Users,
  Youtube,
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';

const actorImage =
  'https://upload.wikimedia.org/wikipedia/commons/8/83/Nivin_Pauly_latest.jpg';

const films = [
  { title: 'Sarvam Maya', year: '2025', role: 'Lead role', collection: 'Rs 150 Cr', result: 'Blockbuster' },
  { title: 'Premam', year: '2015', role: 'George David', collection: 'Rs 73 Cr', result: 'Blockbuster' },
  { title: 'Bangalore Days', year: '2014', role: 'Kuttan', collection: 'Rs 48-50 Cr', result: 'Blockbuster' },
  { title: 'Kayamkulam Kochunni', year: '2018', role: 'Kochunni', collection: 'Rs 70 Cr', result: 'Hit' },
  { title: 'Moothon', year: '2019', role: 'Akbar', collection: 'Festival circuit', result: 'Critical acclaim' },
];

const endorsements = [
  { brand: 'Myntra Style Drop', category: 'Fashion', value: 'Rs 8.5L', status: 'Negotiation' },
  { brand: 'Malabar Gold Festive', category: 'Jewellery', value: 'Rs 12L', status: 'Shortlisted' },
  { brand: 'Prime Video Premiere', category: 'Streaming', value: 'Rs 6L', status: 'Review' },
];

const socials = [
  { platform: 'Instagram', handle: '@nivinpaulyactor', followers: '5.8M', engagement: '7.2%', insight: '+18% reel saves', icon: Instagram },
  { platform: 'YouTube', handle: 'Nivin Pauly Official', followers: '840K', engagement: '5.4%', insight: 'Trailer spikes', icon: Youtube },
  { platform: 'Facebook', handle: 'Nivin Pauly', followers: '3.1M', engagement: '4.8%', insight: 'Family audience', icon: Users },
];

const sentiment = [
  { label: 'Positive', value: 68, color: '#6d983f' },
  { label: 'Neutral', value: 22, color: '#5f6f99' },
  { label: 'Negative', value: 10, color: '#d75b62' },
];

const trendingKeywords = ['Sarvam Maya', 'family audience', 'comeback', 'relatable actor', 'Malayalam cinema', 'youth icon'];

const ActorDashboard = () => (
  <div className="flex min-h-screen bg-[#f8faff] text-[#101828]">
    <Sidebar />
    <main className="flex-1 overflow-x-hidden p-5 sm:p-8 lg:p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="grid gap-6 rounded-[32px] bg-[linear-gradient(135deg,#0b1437_0%,#1d3fbf_60%,#8cb4ff_100%)] p-6 text-white shadow-xl lg:grid-cols-[280px,1fr] lg:p-8">
          <div className="overflow-hidden rounded-[24px] border border-white/20 bg-white/10">
            <img
              src={actorImage}
              alt="Nivin Pauly"
              className="h-full min-h-[300px] w-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
              <BadgeCheck className="h-4 w-4" />
              Verified Actor Profile
            </div>
            <h1 className="mt-4 text-4xl font-heading font-extrabold lg:text-5xl">Nivin Pauly</h1>
            <p className="mt-3 max-w-3xl text-base font-semibold leading-7 text-white/82">
              Malayalam actor profile dashboard for films, box office performance, brand endorsements, and social media insights.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <HeroStat label="Films tracked" value="42" />
              <HeroStat label="Lifetime gross" value="Rs 420 Cr+" />
              <HeroStat label="Audience reach" value="9.7M+" />
            </div>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-4">
          <StatCard icon={Film} title="Active film slate" value="4" detail="Upcoming and recent titles" />
          <StatCard icon={IndianRupee} title="Top gross" value="Rs 150 Cr" detail="Sarvam Maya" />
          <StatCard icon={Clapperboard} title="Brand deals" value="3" detail="Open endorsements" />
          <StatCard icon={TrendingUp} title="Avg engagement" value="6.1%" detail="Across owned channels" />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1fr,0.9fr]">
          <article className="rounded-[28px] border border-[#dbe5ff] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-[#123bb7]" />
              <h2 className="text-2xl font-heading font-extrabold">Public sentiment score</h2>
            </div>
            <div className="mt-5 space-y-4">
              {sentiment.map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between text-sm font-bold">
                    <span className="text-[#35446a]">{item.label}</span>
                    <span style={{ color: item.color }}>{item.value}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-[#edf2ff]">
                    <div
                      className="h-3 rounded-full"
                      style={{ width: `${item.value}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[28px] border border-[#dbe5ff] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <BadgeCheck className="h-5 w-5 text-[#123bb7]" />
              <h2 className="text-2xl font-heading font-extrabold">Brand positioning</h2>
            </div>
            <div className="mt-5 rounded-[24px] bg-[#f8faff] p-5">
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#8a94a6]">Current position</p>
              <p className="mt-2 text-3xl font-heading font-extrabold text-[#123bb7]">Relatable mass star</p>
              <p className="mt-3 text-sm font-semibold leading-6 text-[#667085]">
                Strong family appeal with youth nostalgia, comedy-romance recall, and high regional trust.
              </p>
            </div>
          </article>

          <article className="rounded-[28px] border border-[#dbe5ff] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Hash className="h-5 w-5 text-[#123bb7]" />
              <h2 className="text-2xl font-heading font-extrabold">Trending keywords</h2>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {trendingKeywords.map((keyword) => (
                <span key={keyword} className="rounded-full bg-[#eef1ff] px-4 py-2 text-sm font-extrabold text-[#123bb7]">
                  {keyword}
                </span>
              ))}
            </div>
          </article>

          <article className="rounded-[28px] border border-[#dbe5ff] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-[#123bb7]" />
              <h2 className="text-2xl font-heading font-extrabold">Media visibility score</h2>
            </div>
            <div className="mt-5 rounded-[24px] bg-[#f8faff] p-5">
              <p className="text-5xl font-heading font-extrabold text-[#123bb7]">86</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-[#667085]">
                High visibility across entertainment news, fan pages, trailer conversations, and brand-safe social mentions.
              </p>
            </div>
          </article>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.05fr,0.95fr]">
          <article className="rounded-[28px] border border-[#dbe5ff] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Film className="h-5 w-5 text-[#123bb7]" />
              <h2 className="text-2xl font-heading font-extrabold">Filmography and box office</h2>
            </div>
            <div className="mt-5 space-y-3">
              {films.map((film) => (
                <div key={film.title} className="rounded-[20px] border border-[#e4e9f4] bg-[#f8faff] p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-lg font-heading font-extrabold">{film.title}</h3>
                      <p className="mt-1 text-sm font-semibold text-[#667085]">{film.year} · {film.role}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-lg font-heading font-extrabold text-[#123bb7]">{film.collection}</p>
                      <p className="mt-1 text-xs font-extrabold uppercase text-[#6d983f]">{film.result}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[28px] border border-[#dbe5ff] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Clapperboard className="h-5 w-5 text-[#123bb7]" />
              <h2 className="text-2xl font-heading font-extrabold">Brand endorsements</h2>
            </div>
            <div className="mt-5 space-y-3">
              {endorsements.map((deal) => (
                <div key={deal.brand} className="rounded-[20px] border border-[#e4e9f4] bg-[#f8faff] p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-heading font-extrabold">{deal.brand}</h3>
                      <p className="mt-1 text-sm font-semibold text-[#667085]">{deal.category}</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold uppercase text-[#123bb7]">{deal.status}</span>
                  </div>
                  <p className="mt-3 text-xl font-heading font-extrabold text-[#123bb7]">{deal.value}</p>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="rounded-[28px] border border-[#dbe5ff] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[#123bb7]" />
            <h2 className="text-2xl font-heading font-extrabold">Social media profiles and insights</h2>
          </div>
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {socials.map(({ icon: Icon, ...profile }) => (
              <article key={profile.platform} className="rounded-[24px] border border-[#e4e9f4] bg-[#f8faff] p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef1ff] text-[#123bb7]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-xl font-heading font-extrabold">{profile.platform}</h3>
                <p className="mt-1 text-sm font-semibold text-[#667085]">{profile.handle}</p>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <MiniStat label="Followers" value={profile.followers} />
                  <MiniStat label="Engagement" value={profile.engagement} />
                </div>
                <div className="mt-4 flex items-center gap-2 rounded-[16px] bg-white px-3 py-3 text-sm font-bold text-[#35446a]">
                  <Eye className="h-4 w-4 text-[#123bb7]" />
                  {profile.insight}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  </div>
);

const HeroStat = ({ label, value }) => (
  <div className="rounded-[18px] bg-white/14 px-4 py-3">
    <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-white/68">{label}</p>
    <p className="mt-1 text-2xl font-heading font-extrabold">{value}</p>
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

const MiniStat = ({ label, value }) => (
  <div className="rounded-[16px] bg-white px-3 py-3">
    <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#8a94a6]">{label}</p>
    <p className="mt-1 text-lg font-heading font-extrabold text-[#123bb7]">{value}</p>
  </div>
);

export default ActorDashboard;
