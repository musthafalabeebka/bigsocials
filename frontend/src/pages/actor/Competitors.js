import React from 'react';
import {
  Activity,
  BarChart3,
  Clapperboard,
  Eye,
  Megaphone,
  Radar,
  Swords,
  TrendingUp,
  Users,
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';

const featureCards = [
  {
    id: 'competitor-insights',
    icon: Eye,
    title: 'Competitor Insights',
    detail:
      'See how other actors and films are performing across media, social buzz, and public visibility.',
  },
  {
    id: 'market-pulse',
    icon: Radar,
    title: 'Market Pulse',
    detail:
      'Track what is trending, who is gaining attention, and where the buzz is shifting.',
  },
  {
    id: 'buzz-comparison',
    icon: BarChart3,
    title: 'Buzz Comparison',
    detail:
      'Compare your visibility with others and understand what is driving their momentum.',
  },
  {
    id: 'industry-activity',
    icon: Activity,
    title: 'Industry Activity',
    detail:
      'Stay updated on competitor campaigns, PR moves, and audience engagement trends.',
  },
  {
    id: 'performance-benchmarking',
    icon: TrendingUp,
    title: 'Performance Benchmarking',
    detail:
      'Measure your presence against others and identify opportunities to stand out.',
  },
  {
    id: 'trend-intelligence',
    icon: Megaphone,
    title: 'Trend Intelligence',
    detail:
      'Discover what content, PR, and campaigns are working right now.',
  },
  {
    id: 'audience-buzz-insights',
    icon: Users,
    title: 'Audience & Buzz Insights',
    detail:
      'Understand where competitors are winning attention and where you can take over.',
  },
  {
    id: 'campaign-landscape',
    icon: Clapperboard,
    title: 'Campaign Landscape',
    detail:
      'Get a clear view of how competing movies and actors are marketing themselves.',
  },
];

const featureAnalytics = {
  'competitor-insights': {
    stats: [
      ['Actors tracked', '12'],
      ['Films tracked', '26'],
      ['Visibility index', '84/100'],
    ],
    analytics: [
      ['Top actor by visibility', 'Dulquer Salmaan'],
      ['Fastest-rising actor', 'Tovino Thomas'],
      ['Top film chatter', 'Weekend release campaign'],
      ['PR intensity', 'High across premium outlets'],
    ],
    insights: [
      'Premium visibility is clustering around actors with multilingual recall.',
      'Media lift is strongest when interviews and trailer content land in the same 48-hour window.',
    ],
  },
  'market-pulse': {
    stats: [
      ['Trend refresh', 'Every 6 hrs'],
      ['Buzz shift', '+18%'],
      ['Attention leader', 'Action dramas'],
    ],
    analytics: [
      ['Current rising theme', 'Festival-season comeback narratives'],
      ['Strongest region', 'Kochi and Gulf audience'],
      ['Most active platform', 'Instagram'],
      ['Momentum trigger', 'Trailer and interview overlap'],
    ],
    insights: [
      'Market attention is moving toward nostalgia-backed campaigns with family appeal.',
      'Buzz shifts faster when meme pages and trade portals align on the same story.',
    ],
  },
  'buzz-comparison': {
    stats: [
      ['Your buzz score', '71'],
      ['Competitor avg', '79'],
      ['Gap to leader', '8 pts'],
    ],
    analytics: [
      ['Share of voice', 'Nivin 22% / Dulquer 31% / Tovino 26%'],
      ['Conversation lift', '+14% post release week'],
      ['Negative buzz share', '11%'],
      ['Momentum driver', 'Family-safe fan content'],
    ],
    insights: [
      'Visibility gap is driven more by frequency and premium press pickup than by sentiment.',
      'Closing the gap depends on repeating high-performing reel and interview formats.',
    ],
  },
  'industry-activity': {
    stats: [
      ['Active campaigns', '9'],
      ['PR moves today', '4'],
      ['High-engagement drops', '3'],
    ],
    analytics: [
      ['Latest competitor move', 'Trailer launch with influencer amplification'],
      ['Most used lever', 'Premium interview circuit'],
      ['Audience response', 'High comment-to-share ratio'],
      ['Campaign category', 'Fashion, OTT, cinema'],
    ],
    insights: [
      'Competitors are stacking PR, reels, and outlet coverage into compressed launch windows.',
      'Lifestyle and entertainment partnerships are being used to sustain post-release chatter.',
    ],
  },
  'performance-benchmarking': {
    stats: [
      ['Benchmark sets', '5'],
      ['Top strength', 'Family trust'],
      ['Standout opportunity', 'Real estate + mass brands'],
    ],
    analytics: [
      ['Theatrical recall rank', '#2'],
      ['Family audience affinity', 'Highest among peer set'],
      ['Premium lifestyle fit', 'Behind Dulquer'],
      ['Youth chatter score', 'Behind Tovino'],
    ],
    insights: [
      'Your benchmark edge remains trust and nostalgia rather than premium aspiration.',
      'Performance can stand out further with cleaner urban campaign packaging.',
    ],
  },
  'trend-intelligence': {
    stats: [
      ['Winning formats', '4'],
      ['PR trend', 'Interview-first'],
      ['Content trend', 'Short video'],
    ],
    analytics: [
      ['Best-performing content', 'Behind-the-scenes reels'],
      ['Best-performing PR move', 'Regional + premium outlet mix'],
      ['Campaign trend', 'Trailer cutdowns with creator seeding'],
      ['Retention signal', 'Carousel nostalgia posts'],
    ],
    insights: [
      'Short-form film content is outperforming static posters across every peer set.',
      'Press works best when tied to a clear story angle, not just release reminders.',
    ],
  },
  'audience-buzz-insights': {
    stats: [
      ['Audience clusters', '6'],
      ['Buzz hotspot', 'Urban Kerala'],
      ['Takeover chance', 'Family audience'],
    ],
    analytics: [
      ['Competitor strength zone', 'Metros and premium youth audience'],
      ['Your hold zone', 'Family-safe and nostalgia segments'],
      ['Weakly defended segment', 'Regional trust-driven brands'],
      ['Buzz acceleration point', 'Festival interview windows'],
    ],
    insights: [
      'Competitors win fast attention in premium urban segments but leave room in trust-led categories.',
      'Takeover potential is highest where family-safe storytelling meets local theatre enthusiasm.',
    ],
  },
  'campaign-landscape': {
    stats: [
      ['Campaigns tracked', '15'],
      ['Launch windows', '6 active'],
      ['Most used mix', 'PR + social + creator'],
    ],
    analytics: [
      ['Common campaign structure', 'Trailer drop, interviews, fan edits, paid boost'],
      ['Top actor campaign type', 'Premium fashion and cinema crossover'],
      ['Film campaign intensity', 'High before opening weekend'],
      ['Underserved lane', 'District-led on-ground audience amplification'],
    ],
    insights: [
      'Most competing campaigns are concentrated around opening weekend and premium social storytelling.',
      'District-level fan amplification remains an underused lever compared with digital-first campaigns.',
    ],
  },
};

const Competitors = () => (
  <div className="flex min-h-screen bg-[#f8faff] text-[#101828]">
    <Sidebar />
    <main className="flex-1 overflow-x-hidden p-5 sm:p-8 lg:p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-[32px] bg-[linear-gradient(135deg,#0b1437_0%,#1d3fbf_60%,#8cb4ff_100%)] p-6 text-white shadow-xl sm:p-8 lg:p-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
              <Swords className="h-4 w-4" />
              Competitors
            </div>
            <h1 className="mt-4 text-3xl font-heading font-extrabold sm:text-4xl">
              Competitive intelligence for Nivin Pauly
            </h1>
            <p className="mt-3 text-base font-semibold leading-7 text-white/82">
              Track competitor visibility, market movement, audience attention, and campaign patterns from one intelligence workspace.
            </p>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-4">
          <StatCard icon={Eye} title="Visibility watch" value="Live" detail="Cross-media tracking" />
          <StatCard icon={Radar} title="Market shifts" value="Daily" detail="Trend movement signals" />
          <StatCard icon={BarChart3} title="Benchmarks" value="8" detail="Capability modules" />
          <StatCard icon={Megaphone} title="Campaign scan" value="Active" detail="PR and promo monitoring" />
        </section>

        <section className="grid gap-5 xl:grid-cols-2">
          {featureCards.map(({ id, icon: Icon, title, detail }) => {
            const analytics = featureAnalytics[id];

            return (
            <article
              key={title}
              className="rounded-[28px] border border-[#dbe5ff] bg-white p-6 text-left shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef1ff] text-[#123bb7]">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-2xl font-heading font-extrabold text-[#101828]">{title}</h2>
              <p className="mt-3 text-sm font-semibold leading-7 text-[#667085]">{detail}</p>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {analytics.stats.map(([label, value]) => (
                  <MiniStat key={label} label={label} value={value} />
                ))}
              </div>

              <div className="mt-5 rounded-[22px] border border-[#e4e9f4] bg-[#f8faff] p-5">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[#123bb7]" />
                  <h3 className="text-xl font-heading font-extrabold text-[#101828]">Analytics</h3>
                </div>
                <div className="mt-4 space-y-3">
                  {analytics.analytics.map(([label, value]) => (
                    <div key={label} className="rounded-[18px] border border-[#e4e9f4] bg-white p-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <h4 className="text-sm font-heading font-extrabold text-[#101828]">{label}</h4>
                        <span className="rounded-full bg-[#eef1ff] px-3 py-1 text-xs font-extrabold uppercase text-[#123bb7]">
                          {value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 rounded-[22px] border border-[#e4e9f4] bg-[#f8faff] p-5">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[#123bb7]" />
                  <h3 className="text-xl font-heading font-extrabold text-[#101828]">Insights</h3>
                </div>
                <div className="mt-4 space-y-3">
                  {analytics.insights.map((insight) => (
                    <div key={insight} className="rounded-[18px] border border-[#e4e9f4] bg-white p-4 text-sm font-semibold leading-6 text-[#35446a]">
                      {insight}
                    </div>
                  ))}
                </div>
              </div>
            </article>
          );
          })}
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

const MiniStat = ({ label, value }) => (
  <div className="rounded-[18px] bg-[#f8faff] p-4">
    <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#8a94a6]">{label}</p>
    <p className="mt-2 text-lg font-heading font-extrabold text-[#123bb7]">{value}</p>
  </div>
);

export default Competitors;
