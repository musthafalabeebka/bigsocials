import React, { useState } from 'react';
import {
  BarChart3,
  Facebook,
  Globe2,
  Instagram,
  Languages,
  Linkedin,
  MapPin,
  MessageCircle,
  TrendingUp,
  Users,
  Youtube,
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';

const platformBreakdown = [
  { id: 'instagram', platform: 'Instagram', followers: '5.8M', engagement: '7.2%', reach: '18.4M', icon: Instagram },
  { id: 'youtube', platform: 'YouTube', followers: '840K', engagement: '5.4%', reach: '4.1M', icon: Youtube },
  { id: 'twitter', platform: 'X (Twitter)', followers: '1.2M', engagement: '3.8%', reach: '7.6M', icon: Globe2 },
  { id: 'facebook', platform: 'Facebook', followers: '3.1M', engagement: '4.8%', reach: '9.2M', icon: Facebook },
  { id: 'threads', platform: 'Threads', followers: '620K', engagement: '5.9%', reach: '2.8M', icon: MessageCircle },
  { id: 'linkedin', platform: 'LinkedIn', followers: '210K', engagement: '3.1%', reach: '980K', icon: Linkedin },
];

const platformAnalytics = {
  instagram: {
    trends: [['Reels week', '8.9%'], ['Film poster', '7.6%'], ['Brand reel', '6.4%'], ['Casual photo', '5.7%']],
    demographics: [
      { icon: Users, label: 'Top age group', value: '18-34', detail: '68% of engaged fans' },
      { icon: MapPin, label: 'Top cities', value: 'Kochi, Chennai, Bengaluru', detail: 'Highest reel saves from Kochi' },
      { icon: Languages, label: 'Languages', value: 'Malayalam, Tamil, English', detail: 'Malayalam captions drive best comments' },
    ],
    content: [
      { type: 'Behind-the-scenes reels', score: '92', detail: 'Highest saves and shares' },
      { type: 'Film announcement posts', score: '88', detail: 'Fastest comment velocity' },
      { type: 'Family-safe brand content', score: '81', detail: 'Strong trust and conversion intent' },
    ],
    spikes: [
      { event: 'Sarvam Maya announcement', growth: '+145K', detail: 'Reels and fan edits drove the spike' },
      { event: 'Trailer week', growth: '+82K', detail: 'Poster shares lifted profile visits' },
      { event: 'Brand reel', growth: '+31K', detail: 'High saves from family audience' },
    ],
    insights: ['Post reels after 7 PM for strongest saves.', 'Carousel posts work best when tied to film nostalgia.', 'Brand content should use conversational captions.'],
  },
  youtube: {
    trends: [['Trailer week', '6.8%'], ['Shorts teaser', '5.9%'], ['Interview clip', '4.7%'], ['Song promo', '4.2%']],
    demographics: [
      { icon: Users, label: 'Top age group', value: '18-30', detail: 'Shorts audience skews younger' },
      { icon: MapPin, label: 'Top cities', value: 'Kochi, Dubai, Bengaluru', detail: 'Gulf viewership is strong for trailers' },
      { icon: Languages, label: 'Languages', value: 'Malayalam, English', detail: 'Subtitled clips improve retention' },
    ],
    content: [
      { type: 'Trailer cutdowns', score: '90', detail: 'Best subscriber conversion' },
      { type: 'Interview highlights', score: '84', detail: 'Strong watch time from 45-60 second clips' },
      { type: 'Song promos', score: '78', detail: 'Good repeat plays before release week' },
    ],
    spikes: [
      { event: 'Trailer release week', growth: '+118K', detail: 'Subscriber lift and search interest' },
      { event: 'Interview shorts', growth: '+36K', detail: 'Quote-led clips performed well' },
      { event: 'Music launch', growth: '+26K', detail: 'Repeat viewing from film fans' },
    ],
    insights: ['Keep Shorts under 45 seconds when the hook is dialogue-led.', 'Pin trailer and OTT links in top comments.', 'Use Malayalam-first titles with English subtitles.'],
  },
  twitter: {
    trends: [['Release day', '5.6%'], ['Hashtag push', '4.8%'], ['Fan Q&A', '4.1%'], ['Press quote', '3.2%']],
    demographics: [
      { icon: Users, label: 'Top group', value: 'Film fans + trade pages', detail: 'Fastest response during release windows' },
      { icon: MapPin, label: 'Top regions', value: 'Kerala, Tamil Nadu, Gulf', detail: 'Trade chatter peaks around reviews' },
      { icon: Languages, label: 'Languages', value: 'Malayalam, English', detail: 'English threads travel better with press' },
    ],
    content: [
      { type: 'Hashtag-led release posts', score: '83', detail: 'Best reach in first 3 hours' },
      { type: 'Quote replies', score: '77', detail: 'Good for fan sentiment control' },
      { type: 'PR clarifications', score: '72', detail: 'Useful during misinformation spikes' },
    ],
    spikes: [
      { event: 'Release-day hashtag', growth: '+54K', detail: 'Fan accounts amplified reach' },
      { event: 'Press quote thread', growth: '+22K', detail: 'Shared by entertainment reporters' },
      { event: 'Review response', growth: '+18K', detail: 'Positive sentiment recovery' },
    ],
    insights: ['Use X for fast narrative shaping during release week.', 'Pin official statements during crisis windows.', 'Avoid over-posting brand content here.'],
  },
  facebook: {
    trends: [['Family photo', '6.1%'], ['Film memory', '5.4%'], ['Trailer share', '4.9%'], ['Brand post', '4.2%']],
    demographics: [
      { icon: Users, label: 'Top age group', value: '25-44', detail: 'Family audience is strongest here' },
      { icon: MapPin, label: 'Top cities', value: 'Kochi, Thrissur, Kozhikode', detail: 'Kerala tier-2 engagement is high' },
      { icon: Languages, label: 'Languages', value: 'Malayalam', detail: 'Malayalam-first posts outperform bilingual copy' },
    ],
    content: [
      { type: 'Film nostalgia posts', score: '89', detail: 'Highest comments and shares' },
      { type: 'Family-safe brand content', score: '84', detail: 'Strong fit for real estate and jewellery' },
      { type: 'Long captions', score: '76', detail: 'Better for older engaged fans' },
    ],
    spikes: [
      { event: 'Premam anniversary post', growth: '+62K', detail: 'Nostalgia drove shares' },
      { event: 'Sarvam Maya poster', growth: '+48K', detail: 'Family audience pickup' },
      { event: 'Brand announcement', growth: '+21K', detail: 'Trust-led comments' },
    ],
    insights: ['Use Facebook for family-safe brand storytelling.', 'Nostalgia posts should be scheduled on weekends.', 'Malayalam captions should lead.'],
  },
  threads: {
    trends: [['Casual update', '7.1%'], ['Fan reply burst', '6.6%'], ['Film thought', '5.8%'], ['Quote post', '5.1%']],
    demographics: [
      { icon: Users, label: 'Top group', value: 'Youth fans', detail: 'Conversation-led audience' },
      { icon: MapPin, label: 'Top cities', value: 'Kochi, Chennai, Bengaluru', detail: 'Urban audience responds fastest' },
      { icon: Languages, label: 'Languages', value: 'English, Malayalam', detail: 'Short bilingual copy works well' },
    ],
    content: [
      { type: 'Casual text updates', score: '86', detail: 'Best reply rate' },
      { type: 'Fan question prompts', score: '82', detail: 'Strong conversation depth' },
      { type: 'Quick film thoughts', score: '79', detail: 'Good companion channel for Instagram' },
    ],
    spikes: [
      { event: 'Casual release note', growth: '+39K', detail: 'Reply velocity lifted discovery' },
      { event: 'Fan Q&A prompt', growth: '+28K', detail: 'Conversation chain performed well' },
      { event: 'Instagram reel companion', growth: '+18K', detail: 'Cross-platform spillover' },
    ],
    insights: ['Use Threads for lighter, more frequent fan touchpoints.', 'Pair each major Instagram reel with a Threads prompt.', 'Keep posts direct and conversational.'],
  },
  linkedin: {
    trends: [['Brand announcement', '4.4%'], ['Career note', '3.8%'], ['Press milestone', '3.4%'], ['Partnership post', '3.1%']],
    demographics: [
      { icon: Users, label: 'Top group', value: 'Brand managers + media', detail: 'Professional audience is smaller but high value' },
      { icon: MapPin, label: 'Top cities', value: 'Kochi, Bengaluru, Mumbai', detail: 'Brand and agency discovery clusters' },
      { icon: Languages, label: 'Languages', value: 'English', detail: 'Professional English copy performs best' },
    ],
    content: [
      { type: 'Brand partnership posts', score: '80', detail: 'Best for endorsement credibility' },
      { type: 'Career reflections', score: '76', detail: 'Good executive audience response' },
      { type: 'Media milestones', score: '72', detail: 'Useful for PR amplification' },
    ],
    spikes: [
      { event: 'Kalyan Homes announcement', growth: '+18K', detail: 'Brand-side audience discovery' },
      { event: 'Press milestone post', growth: '+9K', detail: 'Shared by media and agency contacts' },
      { event: 'Career reflection', growth: '+7K', detail: 'High comment quality' },
    ],
    insights: ['Use LinkedIn for premium endorsement positioning.', 'Keep posts professional and concise.', 'Publish brand news during weekday mornings.'],
  },
};

const SocialMedia = () => {
  const [selectedPlatformId, setSelectedPlatformId] = useState('instagram');
  const selectedPlatform = platformBreakdown.find((platform) => platform.id === selectedPlatformId) || platformBreakdown[0];
  const selectedAnalytics = platformAnalytics[selectedPlatform.id];
  const SelectedIcon = selectedPlatform.icon;

  return (
    <div className="flex min-h-screen bg-[#f8faff] text-[#101828]">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden p-5 sm:p-8 lg:p-10">
        <div className="mx-auto max-w-7xl space-y-8">
          <section className="rounded-[32px] bg-[linear-gradient(135deg,#0b1437_0%,#1d3fbf_60%,#8cb4ff_100%)] p-6 text-white shadow-xl sm:p-8 lg:p-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
                <BarChart3 className="h-4 w-4" />
                Social & Audience Analytics
              </div>
              <h1 className="mt-4 text-3xl font-heading font-extrabold sm:text-4xl">
                Deep insights into fans, not just follower count
              </h1>
              <p className="mt-3 text-base font-semibold leading-7 text-white/82">
                Click any platform to see its engagement trends, audience profile, content performance, growth spikes, and recommendations.
              </p>
            </div>
          </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {platformBreakdown.map(({ icon: Icon, ...platform }) => {
            const isSelected = platform.id === selectedPlatformId;

            return (
            <button
              key={platform.platform}
              type="button"
              onClick={() => setSelectedPlatformId(platform.id)}
              className={`rounded-[24px] border bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
                isSelected ? 'border-[#123bb7] ring-2 ring-[#dbe5ff]' : 'border-[#dbe5ff] hover:border-[#9fb4f2]'
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef1ff] text-[#123bb7]">
                <Icon className="h-5 w-5" />
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <h2 className="text-xl font-heading font-extrabold">{platform.platform}</h2>
                {isSelected && (
                  <span className="rounded-full bg-[#123bb7] px-3 py-1 text-xs font-extrabold uppercase text-white">
                    Active
                  </span>
                )}
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2">
                <MiniStat label="Followers" value={platform.followers} />
                <MiniStat label="Engagement" value={platform.engagement} />
                <MiniStat label="Reach" value={platform.reach} />
              </div>
            </button>
          );
          })}
        </section>

        <section className="rounded-[28px] border border-[#dbe5ff] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#eef1ff] text-[#123bb7]">
                <SelectedIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#8a94a6]">Selected platform</p>
                <h2 className="mt-1 text-3xl font-heading font-extrabold text-[#101828]">{selectedPlatform.platform}</h2>
                <p className="mt-2 text-sm font-semibold leading-6 text-[#667085]">
                  Platform-specific analytics for Nivin Pauly’s audience behavior, content performance, and next posting decisions.
                </p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[430px]">
              <MiniStat label="Followers" value={selectedPlatform.followers} />
              <MiniStat label="Engagement" value={selectedPlatform.engagement} />
              <MiniStat label="Reach" value={selectedPlatform.reach} />
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.9fr,1.1fr]">
          <article className="rounded-[28px] border border-[#dbe5ff] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#123bb7]" />
              <h2 className="text-2xl font-heading font-extrabold">Engagement rate trends</h2>
            </div>
            <div className="mt-5 space-y-4">
              {selectedAnalytics.trends.map(([label, value]) => (
                <div key={label}>
                  <div className="mb-2 flex items-center justify-between text-sm font-bold text-[#35446a]">
                    <span>{label}</span>
                    <span>{value}</span>
                  </div>
                  <div className="h-3 rounded-full bg-[#edf2ff]">
                    <div className="h-3 rounded-full bg-[#123bb7]" style={{ width: value }} />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[28px] border border-[#dbe5ff] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-[#123bb7]" />
              <h2 className="text-2xl font-heading font-extrabold">Audience demographics</h2>
            </div>
            <div className="mt-5 grid gap-3">
              {selectedAnalytics.demographics.map(({ icon: Icon, label, value, detail }) => (
                <div key={label} className="rounded-[20px] border border-[#e4e9f4] bg-[#f8faff] p-4">
                  <div className="flex items-start gap-3">
                    <Icon className="mt-1 h-5 w-5 text-[#123bb7]" />
                    <div>
                      <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-[#8a94a6]">{label}</p>
                      <p className="mt-1 text-lg font-heading font-extrabold text-[#101828]">{value}</p>
                      <p className="mt-1 text-sm font-semibold text-[#667085]">{detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <AnalyticsList
            title="Content performance"
            intro={`What works best on ${selectedPlatform.platform}`}
            items={selectedAnalytics.content.map((item) => ({
              title: item.type,
              value: item.score,
              detail: item.detail,
            }))}
          />
          <AnalyticsList
            title="Fan growth spikes"
            intro={`Growth linked to ${selectedPlatform.platform} events`}
            items={selectedAnalytics.spikes.map((item) => ({
              title: item.event,
              value: item.growth,
              detail: item.detail,
            }))}
          />
        </section>

        <section className="rounded-[28px] border border-[#dbe5ff] bg-white p-6 shadow-sm">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#8a94a6]">Insights</p>
          <h2 className="mt-2 text-2xl font-heading font-extrabold text-[#101828]">
            Recommended moves for {selectedPlatform.platform}
          </h2>
          <div className="mt-5 grid gap-3 lg:grid-cols-3">
            {selectedAnalytics.insights.map((insight) => (
              <div key={insight} className="rounded-[20px] border border-[#e4e9f4] bg-[#f8faff] p-4 text-sm font-semibold leading-6 text-[#35446a]">
                {insight}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  </div>
  );
};

const MiniStat = ({ label, value }) => (
  <div className="rounded-[16px] bg-[#f8faff] px-3 py-3">
    <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#8a94a6]">{label}</p>
    <p className="mt-1 text-sm font-heading font-extrabold text-[#123bb7]">{value}</p>
  </div>
);

const AnalyticsList = ({ title, intro, items }) => (
  <article className="rounded-[28px] border border-[#dbe5ff] bg-white p-6 shadow-sm">
    <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#8a94a6]">{intro}</p>
    <h2 className="mt-2 text-2xl font-heading font-extrabold">{title}</h2>
    <div className="mt-5 space-y-3">
      {items.map((item) => (
        <div key={item.title} className="rounded-[20px] border border-[#e4e9f4] bg-[#f8faff] p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-base font-heading font-extrabold">{item.title}</h3>
              <p className="mt-1 text-sm font-semibold leading-6 text-[#667085]">{item.detail}</p>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-sm font-extrabold text-[#123bb7]">
              {item.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  </article>
);

export default SocialMedia;
