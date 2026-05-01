import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  BadgeCheck,
  BarChart3,
  Bot,
  Camera,
  FileWarning,
  Gavel,
  Radio,
  ShieldCheck,
  Siren,
  TrendingUp,
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../contexts/AuthContext';

const scenarios = [
  {
    id: 'normal',
    label: 'Normal day',
    sentiment: 78,
    threat: 'LOW',
    reach: '1.4M',
    negative: {
      instagram: 12,
      twitter: 19,
      youtube: 8,
      facebook: 11,
    },
    alert:
      'No coordinated threat detected. Continue regular brandwatch monitoring and daily community response.',
  },
  {
    id: 'hate',
    label: 'Hate campaign active',
    sentiment: 64,
    threat: 'HIGH',
    reach: '3.2M',
    negative: {
      instagram: 38,
      twitter: 71,
      youtube: 22,
      facebook: 18,
    },
    alert:
      'Spike detected: Coordinated hate campaign detected across X and Instagram targeting #NivinPauly. 38 accounts flagged as potentially inauthentic. Origin cluster identified: 7 seed accounts. Recommendation: Activate Crisis Protocol Level 2.',
  },
  {
    id: 'release',
    label: 'Film release day',
    sentiment: 82,
    threat: 'MED',
    reach: '5.8M',
    negative: {
      instagram: 21,
      twitter: 34,
      youtube: 14,
      facebook: 16,
    },
    alert:
      'Release-day chatter is elevated. Fan engagement is strong, with moderate review bombing risk on X and YouTube.',
  },
];

const threatFeed = [
  {
    platform: 'X / Twitter',
    content:
      '"Nivin Pauly should be cancelled, his film is garbage and he is [defamatory claim]..." - @anon_account_2847',
    time: '2m ago',
    actions: ['Report - Cyber cell', 'Platform report', 'Screenshot'],
  },
  {
    platform: 'Instagram',
    content:
      'AI-generated deepfake image posted falsely showing Nivin in compromising situation. Account created 3 days ago.',
    time: '7m ago',
    actions: ['2-hour emergency', 'Meta report'],
  },
  {
    platform: 'YouTube',
    content:
      'Coordinated 1-star ratings on Sarvam Maya trailer - 180 ratings from accounts created this week.',
    time: '15m ago',
    actions: ['Report bombing', 'Activate fans'],
  },
];

const legalQueue = [
  { title: 'Defamation notice draft', status: 'Ready', icon: FileWarning },
  { title: 'Cyber cell report pack', status: 'Queued', icon: ShieldCheck },
  { title: 'Platform takedown bundle', status: 'Filed', icon: Gavel },
];

const dashboardTabs = [
  { id: 'live', label: 'Live Monitor' },
  { id: 'legal', label: '2026 Legal Takedown' },
];

const legalPaths = [
  {
    title: 'Deepfake & synthetic content - fastest path',
    time: '2 hrs',
    tone: 'red',
    copy:
      'Covers AI-generated images, voice clones, video deepfakes, and synthetic misinformation. Trigger: victim or authorized person notifies platform directly. No government intermediary required. Platform MUST remove within 2 hours or lose Safe Harbor status. This is the most powerful tool - use it first for any AI-generated attack content.',
  },
  {
    title: 'Government/court emergency notice path',
    time: '3 hrs',
    tone: 'blue',
    copy:
      'Covers content threatening public order, impersonation, and organized misinformation campaigns. Trigger: file at cybercrime.gov.in, Cyber Cell verifies, then issues emergency notice to platform. Platform removal within 3 hours. You cannot trigger this as a private individual alone - you need a government officer or court order to issue the formal notice.',
  },
  {
    title: 'Grievance Appellate Committee - if platform refuses',
    time: 'GAC',
    tone: 'purple',
    copy:
      'If Instagram, X, or YouTube refuses your internal report: file at the GAC portal. In 2026, the GAC has streamlined processing significantly. A GAC ruling in your favor forces the platform to comply or lose Safe Harbor. This is the escalation path when direct platform reporting fails.',
  },
  {
    title: 'Standard platform internal report',
    time: '24 hrs',
    tone: 'amber',
    copy:
      'Covers hate speech, defamation, harassment, and false information. Trigger: use the platform native Report function. Platform must acknowledge within 24 hours under IT Rules 2023. This is the baseline - always file this first as it starts the clock and creates your paper trail for escalation.',
  },
];

const responseProtocol = [
  {
    step: 1,
    title: 'Document immediately (0-5 minutes)',
    detail:
      'Take full-page screenshots with browser timestamp visible. Copy the exact URL. Download the video/image if applicable. Save everything to cloud storage with timestamp. This is your legal evidence - the Actual Knowledge rule requires you to prove you knew about the content at a specific time.',
    note: 'Critical - do this before anything else',
    tone: 'red',
  },
  {
    step: 2,
    title: 'Platform internal report (5-10 minutes)',
    detail:
      'Use the platform native Report button. Select the most specific category - False information, Harassment, or Synthetic/AI-manipulated media where available. This starts the platform 24-hour acknowledgment clock and creates the first formal record. For deepfakes, explicitly select synthetic/AI-manipulated to trigger the 2-hour window.',
    note: 'Starts the legal clock',
    tone: 'amber',
  },
  {
    step: 3,
    title: 'Parallel - file at cybercrime.gov.in (10-20 minutes)',
    detail:
      'Go to cybercrime.gov.in, file under Cyber Bullying/Stalking/Sexting or Other Cyber Crimes. Upload screenshots and URL evidence. A cyber cell officer will review and, if harm is verified, can issue the emergency notice that triggers 3-hour mandatory removal. Kerala Cyber Cell (Thiruvananthapuram) has a dedicated helpline: 1930.',
    note: 'Triggers 3-hour window',
    tone: 'blue',
  },
  {
    step: 4,
    title: 'Lawyer - cease & desist notice (20-60 minutes)',
    detail:
      'Have a cyber lawyer draft a Cease & Desist letter to the account owner if identifiable, or to the platform. This often causes individuals to delete content immediately because they do not want legal trouble. For defamatory factual claims, this opens IPC 499/500 criminal defamation proceedings or civil defamation under tort law.',
    note: 'Psychological deterrent',
    tone: 'purple',
  },
  {
    step: 5,
    title: 'ORM suppression - push it off search (parallel, ongoing)',
    detail:
      'While the takedown processes, activate Online Reputation Management techniques: publish 5-8 positive articles or press releases using the exact search query the hate content ranks for. Google algorithm favors freshness - new authoritative content will push the negative post off page 1 within 24-48 hours even before it is removed.',
    note: 'Suppresses visibility while takedown processes',
    tone: 'green',
  },
];

const platformPaths = [
  {
    title: 'Instagram / Meta',
    steps: [
      'Three-dot menu -> Report',
      'Select "False information" or "AI-generated"',
      'Meta must acknowledge in 24h',
      'Escalate to meta.com/help if refused',
      'GAC appeal if still unresolved',
    ],
    footnote: 'Deepfake: Select "Fake or altered media" to trigger 2-hour rule',
  },
  {
    title: 'Twitter / X',
    steps: [
      'Three-dot menu -> Report Post',
      'Select "Synthetic & Manipulated Media" for deepfakes',
      'Also use X Safety Mode to block hostile accounts',
      'For coordinated campaigns report as "Coordinated inauthentic behavior"',
      'X Trust & Safety escalation: help.twitter.com',
    ],
  },
  {
    title: 'YouTube',
    steps: [
      'Flag icon -> Report',
      '"Harassment or bullying" or "Misleading content"',
      'For review bombing: Creator Studio -> Community -> Report abuse',
      'YouTube has anti-review-bomb detection - file formal request via Creator Support',
      'Verified channels get priority handling',
    ],
  },
  {
    title: 'WhatsApp / Telegram',
    steps: [
      'WhatsApp: long-press message -> Report',
      'Report forwarded misinformation to factcheck.whatsapp.com',
      'Telegram: use report button in group/channel',
      'These are harder - forward evidence to cybercrime.gov.in instead',
      'Court injunction may be needed for private group content',
    ],
  },
];

const ActorPrDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('live');
  const [activeScenarioId, setActiveScenarioId] = useState('hate');
  const activeScenario =
    scenarios.find((scenario) => scenario.id === activeScenarioId) || scenarios[1];

  const negativeBars = [
    { label: 'Instagram', value: activeScenario.negative.instagram },
    { label: 'Twitter / X', value: activeScenario.negative.twitter },
    { label: 'YouTube', value: activeScenario.negative.youtube },
    { label: 'Facebook', value: activeScenario.negative.facebook },
  ];

  return (
    <div className="flex min-h-screen bg-[#f8faff] text-[#101828]">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden p-5 sm:p-8 lg:p-10">
        <div className="mx-auto max-w-7xl space-y-8">
          <header className="rounded-[32px] bg-[linear-gradient(135deg,#0b1437_0%,#1d3fbf_60%,#8cb4ff_100%)] p-6 text-white shadow-xl sm:p-8 lg:p-10">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
                  <ShieldCheck className="h-4 w-4" />
                  CineShield PR Intelligence
                </div>
                <h1 className="mt-4 text-3xl font-heading font-extrabold sm:text-4xl">
                  Reputation command center
                </h1>
                <p className="mt-3 max-w-3xl text-base font-semibold leading-7 text-white/82">
                  Monitor threats, coordinate takedowns, and protect the public narrative for {user?.name || 'Actor'}.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-white/90">
                <span className="inline-flex items-center gap-1 rounded-[8px] bg-white/14 px-3 py-2">
                  <span className="h-2 w-2 rounded-full bg-[#e16363]" />
                  Live monitoring
                </span>
                <span className="inline-flex items-center gap-1 rounded-[8px] bg-white/14 px-3 py-2">
                  <span className="h-2 w-2 rounded-full bg-[#8dd56f]" />
                  Legal engine ready
                </span>
                <span className="rounded-[8px] bg-white/14 px-3 py-2">
                  {user?.name || 'Nivin Pauly'} · Active
                </span>
              </div>
            </div>
          </header>

          <nav className="flex gap-2 overflow-x-auto rounded-[24px] border border-[#dbe5ff] bg-white p-2 text-sm font-extrabold text-[#5f6f99] shadow-sm">
            {dashboardTabs.map(
              (item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`whitespace-nowrap rounded-[8px] px-4 py-3 transition ${
                    activeTab === item.id ? 'bg-[#123bb7] text-white shadow-sm' : 'hover:bg-[#f8faff] hover:text-[#123bb7]'
                  }`}
                  type="button"
                >
                  {item.label}
                </button>
              )
            )}
          </nav>

          {activeTab === 'legal' ? (
            <LegalTakedownSection />
          ) : (
            <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard title="Sentiment score" value={activeScenario.sentiment} detail="-8 pts in 2h" tone="amber" />
            <MetricCard title="Negative posts" value="247" detail="Last 4 hours" tone="red" />
            <MetricCard title="Hate flagged" value="38" detail="Auto-detected" tone="red" />
            <MetricCard title="Takedowns filed" value="12" detail="7 resolved" tone="green" />
          </section>

          <section>
            <div className="rounded-[24px] border border-[#ffd4d4] bg-[#fff1f1] px-5 py-4 shadow-sm">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#b83c40]" />
                <p className="text-sm font-bold leading-6 text-[#9a4a4f]">
                  ALERT - {activeScenario.alert}
                </p>
              </div>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1fr,1.12fr]">
            <div className="rounded-[28px] border border-[#dbe5ff] bg-white p-5 shadow-sm">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="text-sm font-extrabold text-[#667085]">Simulate scenario</span>
                {scenarios.map((scenario) => (
                  <button
                    key={scenario.id}
                    type="button"
                    onClick={() => setActiveScenarioId(scenario.id)}
                    className={`rounded-[8px] border px-4 py-2 text-sm font-extrabold transition ${
                      activeScenarioId === scenario.id
                        ? 'border-[#123bb7] bg-[#123bb7] text-white'
                        : 'border-[#d9e2f2] bg-[#f8faff] text-[#46557c] hover:border-[#9fb4f2]'
                    }`}
                  >
                    {scenario.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <CircleStat label="Sentiment" value={activeScenario.sentiment} tone="amber" />
                <CircleStat label="Threat level" value={activeScenario.threat} tone="red" />
                <CircleStat label="Positive reach" value={activeScenario.reach} tone="green" />
              </div>
            </div>

            <div className="rounded-[28px] border border-[#dbe5ff] bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-[#123bb7]" />
                <h2 className="text-base font-heading font-extrabold">Negative signal spread</h2>
              </div>
              <div className="space-y-3">
                {negativeBars.map((bar) => (
                  <div key={bar.label} className="grid grid-cols-[92px,1fr,54px] items-center gap-3 text-sm">
                    <span className="font-bold text-[#46557c]">{bar.label}</span>
                    <div className="h-2 rounded-full bg-[#edf2ff]">
                      <div
                        className={`h-2 rounded-full ${bar.value > 50 ? 'bg-[#d75b62]' : bar.value > 25 ? 'bg-[#bf8a3a]' : 'bg-[#6d983f]'}`}
                        style={{ width: `${Math.min(bar.value, 100)}%` }}
                      />
                    </div>
                    <span className="text-right font-extrabold text-[#46557c]">{bar.value}% neg</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="grid gap-5 xl:grid-cols-[1.35fr,0.65fr]">
            <article className="rounded-[28px] border border-[#dbe5ff] bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-[#e4e9f4] px-5 py-4">
                <div className="flex items-center gap-2">
                  <Siren className="h-5 w-5 text-[#c94f55]" />
                  <h2 className="font-heading text-lg font-extrabold">Live threat feed</h2>
                </div>
                <span className="rounded-[8px] bg-[#faeaea] px-3 py-1 text-sm font-extrabold text-[#c94f55]">
                  38 flagged
                </span>
              </div>

              <div className="divide-y divide-[#e4e9f4]">
                {threatFeed.map((item) => (
                  <div key={`${item.platform}-${item.time}`} className="px-5 py-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <p className="text-sm font-bold leading-6 text-[#35446a]">
                        <span className="mr-2 rounded-[6px] bg-[#eef1ff] px-2 py-1 text-xs font-extrabold text-[#123bb7]">
                          {item.platform}
                        </span>
                        {item.content}
                      </p>
                      <span className="whitespace-nowrap text-sm font-bold text-[#8a94a6]">{item.time}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.actions.map((action) => (
                        <button
                          type="button"
                          key={action}
                          className="rounded-[8px] border border-[#d9e2f2] bg-[#f8faff] px-4 py-2 text-sm font-extrabold text-[#123bb7] transition hover:border-[#9fb4f2]"
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <aside className="space-y-5">
              <section className="rounded-[28px] border border-[#dbe5ff] bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-[#123bb7]" />
                  <h2 className="font-heading text-lg font-extrabold">AI response desk</h2>
                </div>
                <div className="mt-4 space-y-3">
                  <ResponseAction
                    icon={Radio}
                    title="Activate counter-narrative"
                    detail="Push fan-safe talking points to owned channels."
                    onClick={() => navigate('/actor/ai-response-desk')}
                  />
                  <ResponseAction
                    icon={Camera}
                    title="Capture evidence"
                    detail="Archive links, screenshots, account age, and timestamps."
                    onClick={() => navigate('/actor/ai-response-desk')}
                  />
                  <ResponseAction
                    icon={BadgeCheck}
                    title="Boost verified voices"
                    detail="Prioritize verified fan clubs and partner creators."
                    onClick={() => navigate('/actor/ai-response-desk')}
                  />
                </div>
              </section>

              <section className="rounded-[28px] border border-[#dbe5ff] bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <Gavel className="h-5 w-5 text-[#6d983f]" />
                  <h2 className="font-heading text-lg font-extrabold">Legal queue</h2>
                </div>
                <div className="mt-4 space-y-3">
                  {legalQueue.map(({ title, status, icon: Icon }) => (
                    <div key={title} className="flex items-center justify-between rounded-[8px] bg-[#f8faff] px-3 py-3">
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4 text-[#123bb7]" />
                        <span className="text-sm font-bold text-[#35446a]">{title}</span>
                      </div>
                      <span className="text-xs font-extrabold uppercase text-[#6d983f]">{status}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[28px] border border-[#dbe5ff] bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[#bf8a3a]" />
                  <h2 className="font-heading text-lg font-extrabold">Campaign recovery</h2>
                </div>
                <p className="mt-3 text-sm font-semibold leading-6 text-[#667085]">
                  Sentiment recovery expected in 18-24 hours if legal takedowns, verified fan content, and platform reports are executed together.
                </p>
              </section>
            </aside>
          </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

const MetricCard = ({ title, value, detail, tone }) => {
  const toneColor = tone === 'red' ? '#d75b62' : tone === 'green' ? '#6d983f' : '#b98132';

  return (
    <article className="rounded-[24px] border border-[#dbe5ff] bg-white px-5 py-4 shadow-sm">
      <p className="text-sm font-bold text-[#667085]">{title}</p>
      <p className="mt-2 text-3xl font-heading font-extrabold" style={{ color: toneColor }}>
        {value}
      </p>
      <p className="mt-1 text-sm font-bold text-[#5f6f99]">{detail}</p>
    </article>
  );
};

const CircleStat = ({ label, value, tone }) => {
  const toneColor = tone === 'red' ? '#d75b62' : tone === 'green' ? '#6d983f' : '#b98132';

  return (
    <div className="text-center">
      <div
        className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 bg-[#f8faff] text-xl font-heading font-extrabold sm:h-24 sm:w-24"
        style={{ borderColor: toneColor, color: toneColor }}
      >
        {value}
      </div>
      <p className="mt-2 text-sm font-extrabold text-[#667085]">{label}</p>
    </div>
  );
};

const ResponseAction = ({ icon: Icon, title, detail, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full rounded-[16px] bg-[#f8faff] p-3 text-left transition hover:bg-[#eef1ff]"
  >
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-[#123bb7]" />
      <h3 className="text-sm font-extrabold text-[#101828]">{title}</h3>
    </div>
    <p className="mt-2 text-sm font-semibold leading-5 text-[#667085]">{detail}</p>
  </button>
);

const LegalTakedownSection = () => (
  <div className="space-y-6">
    <section className="rounded-[28px] border border-[#ffd4d4] bg-[#fff1f1] px-5 py-4 shadow-sm">
      <h2 className="text-lg font-heading font-extrabold text-[#9d4549]">
        India IT Rules 2026 - Express Takedown Framework
      </h2>
      <p className="mt-1 text-sm font-bold leading-6 text-[#9d4549]">
        These are legally mandated windows. Social media platforms face loss of Safe Harbor protection if they fail to comply.
      </p>
    </section>

    <section className="grid gap-3 md:grid-cols-2">
      <div className="rounded-[24px] border border-[#ef8d8d] bg-white p-5 text-center shadow-sm">
        <p className="text-3xl font-heading font-extrabold tracking-[0.12em] text-[#a24d4e]">03:00</p>
        <p className="mt-2 text-sm font-extrabold text-[#9d4549]">
          3-hour mandatory removal - government/court notice
        </p>
      </div>
      <div className="rounded-[24px] border border-[#ef8d8d] bg-white p-5 text-center shadow-sm">
        <p className="text-3xl font-heading font-extrabold tracking-[0.12em] text-[#a24d4e]">02:00</p>
        <p className="mt-2 text-sm font-extrabold text-[#9d4549]">
          2-hour removal - deepfake / non-consensual intimate imagery
        </p>
      </div>
    </section>

    <section className="space-y-3">
      {legalPaths.map((path) => (
        <TakedownPath key={path.title} {...path} />
      ))}
    </section>

    <section className="rounded-[28px] border border-[#dbe5ff] bg-white p-5 shadow-sm">
      <h2 className="text-xl font-heading font-extrabold text-[#101828]">
        Step-by-step fast-response protocol
      </h2>
      <div className="mt-4 space-y-4">
        {responseProtocol.map((step) => (
          <ProtocolStep key={step.step} {...step} />
        ))}
      </div>
    </section>

    <section className="rounded-[28px] border border-[#dbe5ff] bg-white p-5 shadow-sm">
      <h2 className="text-xl font-heading font-extrabold text-[#101828]">
        Platform-specific reporting paths
      </h2>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {platformPaths.map((platform) => (
          <PlatformPath key={platform.title} {...platform} />
        ))}
      </div>
    </section>
  </div>
);

const TakedownPath = ({ title, time, copy, tone }) => {
  const colors = {
    red: ['#ef6464', '#fff4f4', '#a24d4e'],
    blue: ['#69a7e6', '#eef7ff', '#345f94'],
    purple: ['#7b72d6', '#f1f0ff', '#6a4fa3'],
    amber: ['#c69243', '#fff7e5', '#9a6730'],
  };
  const [border, bg, text] = colors[tone] || colors.red;

  return (
    <article className="rounded-[24px] border p-5 shadow-sm" style={{ borderColor: border, backgroundColor: bg }}>
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-base font-heading font-extrabold text-[#101828]">{title}</h3>
        <span className="whitespace-nowrap text-sm font-extrabold" style={{ color: text }}>
          {time}
        </span>
      </div>
      <p className="mt-2 text-sm font-semibold leading-6 text-[#667085]">{copy}</p>
    </article>
  );
};

const ProtocolStep = ({ step, title, detail, note, tone }) => {
  const colors = {
    red: '#d45b5e',
    amber: '#b98132',
    blue: '#3777b8',
    purple: '#7466c7',
    green: '#6d983f',
  };
  const color = colors[tone] || colors.red;

  return (
    <article className="grid gap-3 sm:grid-cols-[28px,1fr]">
      <div
        className="flex h-7 w-7 items-center justify-center rounded-full text-sm font-heading font-extrabold text-white"
        style={{ backgroundColor: color }}
      >
        {step}
      </div>
      <div>
        <h3 className="text-base font-heading font-extrabold text-[#101828]">{title}</h3>
        <p className="mt-1 text-sm font-semibold leading-6 text-[#667085]">{detail}</p>
        <span
          className="mt-2 inline-flex rounded-[6px] px-2 py-1 text-sm font-extrabold"
          style={{ backgroundColor: `${color}18`, color }}
        >
          {note}
        </span>
      </div>
    </article>
  );
};

const PlatformPath = ({ title, steps, footnote }) => (
  <article className="rounded-[24px] border border-[#e4e9f4] bg-[#f8faff] p-5">
    <h3 className="text-xl font-heading font-extrabold text-[#101828]">{title}</h3>
    <ol className="mt-4 space-y-2 text-base font-semibold leading-7 text-[#667085]">
      {steps.map((step, index) => (
        <li key={step}>
          {index + 1}. {step}
        </li>
      ))}
    </ol>
    {footnote ? (
      <p className="mt-5 text-base font-extrabold leading-7 text-[#35446a]">{footnote}</p>
    ) : null}
  </article>
);

export default ActorPrDashboard;
