import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  BrainCircuit,
  Handshake,
  IndianRupee,
  MapPinned,
  Megaphone,
  Newspaper,
  PanelsTopLeft,
  Radio,
  Sparkles,
  Target,
  Users,
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';

const miaScenarioOptions = [
  {
    id: 'awareness',
    title: 'Brand Awareness',
    subtitle: 'Mass awareness',
    goal: 'Maximize recognition across a broad target audience',
    bestFor: 'New product launches and market entries',
    intelligence: 'Prioritize high-visibility inventory first, then reinforce recall through creator and radio bursts.',
    allocations: [
      { label: 'Billboards', value: '40%', icon: PanelsTopLeft },
      { label: 'Newspaper', value: '20%', icon: Newspaper },
      { label: 'Radio', value: '15%', icon: Radio },
      { label: 'Influencers', value: '15%', icon: Users },
      { label: 'Tea Branding', value: '5%', icon: Megaphone },
      { label: 'Notices', value: '5%', icon: MapPinned },
    ],
  },
  {
    id: 'retail-traffic',
    title: 'Retail Traffic',
    subtitle: 'Conversion focus',
    goal: 'Drive customers to stores, landing pages, and purchase points',
    bestFor: 'Store launches, offers, and seasonal sales pushes',
    intelligence: 'Keep the plan close to retail catchments with reminders across audio, influencers, and field teams.',
    allocations: [
      { label: 'Notices near retail locations', value: '25%', icon: MapPinned },
      { label: 'Radio reminders', value: '20%', icon: Radio },
      { label: 'Influencers', value: '20%', icon: Users },
      { label: 'Ambassadors', value: '15%', icon: Handshake },
      { label: 'Billboards near retail locations', value: '10%', icon: PanelsTopLeft },
      { label: 'Tea Spots', value: '10%', icon: Megaphone },
    ],
  },
  {
    id: 'hyperlocal',
    title: 'Local Buzz',
    subtitle: 'Community engagement',
    goal: 'Create conversations in priority districts and neighborhoods',
    bestFor: 'Regional brands, local launches, and community-led campaigns',
    intelligence: 'Use ground-level formats first, then add local creators and outdoor placements for social proof.',
    allocations: [
      { label: 'Tea Shops / Tea Cups', value: '30%', icon: Megaphone },
      { label: 'Ambassadors', value: '25%', icon: Handshake },
      { label: 'Notice Marketing', value: '20%', icon: MapPinned },
      { label: 'Local Influencers', value: '15%', icon: Users },
      { label: 'Billboards', value: '10%', icon: PanelsTopLeft },
    ],
  },
  {
    id: 'balanced',
    title: 'Full Funnel',
    subtitle: 'Balanced campaign',
    goal: 'Combine awareness, engagement, and conversion',
    bestFor: 'Always-on brand marketing and multi-channel launches',
    intelligence: 'Balance reach, credibility, and local action so every channel has a clear job in the funnel.',
    allocations: [
      { label: 'Billboards', value: '25%', icon: PanelsTopLeft },
      { label: 'Influencers', value: '20%', icon: Users },
      { label: 'Media', value: '15%', icon: Newspaper },
      { label: 'Tea Branding', value: '15%', icon: Megaphone },
      { label: 'Ambassadors', value: '15%', icon: Handshake },
      { label: 'Notices', value: '10%', icon: MapPinned },
    ],
  },
];

const formatPrice = (value) => `Rs ${Number(value || 0).toLocaleString('en-IN')}`;

const MiaAgent = () => {
  const navigate = useNavigate();
  const [campaignBudget, setCampaignBudget] = useState('');
  const [selectedScenarioId, setSelectedScenarioId] = useState('balanced');

  const selectedScenario = useMemo(
    () => miaScenarioOptions.find((scenario) => scenario.id === selectedScenarioId) || miaScenarioOptions[0],
    [selectedScenarioId]
  );
  const parsedBudget = Number(String(campaignBudget).replace(/,/g, '')) || 0;
  const canContinue = parsedBudget > 0;

  const allocations = selectedScenario.allocations.map((allocation) => ({
    ...allocation,
    amount: Math.round((parsedBudget * Number(allocation.value.replace('%', ''))) / 100),
  }));

  const handleContinue = () => {
    if (!canContinue) {
      return;
    }

    navigate('/producer/dashboard/ai-campaign-manager/payment', {
      state: {
        budget: parsedBudget,
        scenarioId: selectedScenario.id,
        scenarioTitle: selectedScenario.title,
        scenarioSubtitle: selectedScenario.subtitle,
        goal: selectedScenario.goal,
        bestFor: selectedScenario.bestFor,
        allocations: allocations.map((allocation) => ({
          label: allocation.label,
          value: allocation.value,
          amount: allocation.amount,
        })),
      },
    });
  };

  return (
    <div className="flex min-h-screen bg-[#f8faff]">
      <Sidebar />
      <main className="flex-1 p-5 sm:p-8 lg:p-10">
        <div className="mx-auto max-w-7xl space-y-8">
          <section className="rounded-[32px] bg-[linear-gradient(135deg,#0b1437_0%,#2141b7_58%,#7fb4ff_100%)] p-6 text-white shadow-xl sm:p-8 lg:p-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
                <BrainCircuit className="h-4 w-4" />
                MIA
              </div>
              <h1 className="mt-4 text-3xl font-heading font-bold sm:text-4xl">
                Marketing Intelligence Agent
              </h1>
              <p className="mt-3 text-base leading-7 text-white/82">
                MIA is a marketing intelligence agent that analyzes content performance, audience sentiment, and booking data to predict and optimize campaign outcomes in real time.
              </p>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[380px,1fr]">
            <div className="space-y-6">
              <article className="rounded-[28px] border border-[#dbe5ff] bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef1ff] text-[#123bb7]">
                    <IndianRupee className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">Budget</p>
                    <h2 className="text-xl font-heading font-bold text-[#101828]">Campaign spend</h2>
                  </div>
                </div>
                <input
                  type="text"
                  value={campaignBudget}
                  onChange={(event) => setCampaignBudget(event.target.value.replace(/[^\d,]/g, ''))}
                  placeholder="Enter budget"
                  className="mt-5 w-full rounded-2xl border border-[#d9e2f2] bg-[#f8faff] px-4 py-4 text-base font-semibold text-[#101828] outline-none transition focus:border-[#123bb7]"
                />
              </article>

              <article className="rounded-[28px] border border-[#dbe5ff] bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef1ff] text-[#123bb7]">
                    <Target className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">Objective</p>
                    <h2 className="text-xl font-heading font-bold text-[#101828]">Campaign goal</h2>
                  </div>
                </div>
                <div className="mt-5 grid gap-3">
                  {miaScenarioOptions.map((scenario) => (
                    <button
                      key={scenario.id}
                      type="button"
                      onClick={() => setSelectedScenarioId(scenario.id)}
                      className={`rounded-2xl border px-4 py-3 text-left transition ${
                        selectedScenarioId === scenario.id
                          ? 'border-[#123bb7] bg-[#123bb7] text-white shadow-lg'
                          : 'border-[#d9e2f2] bg-[#f8faff] text-[#24324b] hover:border-[#9fb4f2]'
                      }`}
                    >
                      <span className="block text-sm font-bold">{scenario.title}</span>
                      <span className={`mt-1 block text-xs ${selectedScenarioId === scenario.id ? 'text-white/80' : 'text-[#7a859c]'}`}>
                        {scenario.subtitle}
                      </span>
                    </button>
                  ))}
                </div>
              </article>
            </div>

            <div className="space-y-6">
              <article className="rounded-[28px] border border-[#dbe5ff] bg-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-[#eef1ff] px-3 py-1 text-sm font-semibold text-[#123bb7]">
                      <Sparkles className="h-4 w-4" />
                      Intelligence brief
                    </div>
                    <h2 className="mt-4 text-2xl font-heading font-bold text-[#101828]">{selectedScenario.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-[#667085]">{selectedScenario.goal}</p>
                    <p className="mt-3 text-sm font-semibold text-[#35446a]">{selectedScenario.intelligence}</p>
                  </div>
                  <div className="rounded-2xl bg-[#f8faff] px-5 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">Budget</p>
                    <p className="mt-1 text-2xl font-heading font-bold text-[#123bb7]">{formatPrice(parsedBudget)}</p>
                  </div>
                </div>
              </article>

              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {allocations.map((allocation) => {
                  const Icon = allocation.icon;

                  return (
                    <article
                      key={`${selectedScenario.id}-${allocation.label}`}
                      className="rounded-[24px] border border-[#e4e9f4] bg-white p-4 shadow-sm"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef1ff] text-[#123bb7]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#8a94a6]">Allocation</p>
                      <h3 className="mt-1 text-lg font-heading font-bold text-[#101828]">{allocation.label}</h3>
                      <p className="mt-3 text-2xl font-heading font-bold text-[#123bb7]">{allocation.value}</p>
                      <p className="mt-1 text-sm font-semibold text-[#5f6f99]">{formatPrice(allocation.amount)}</p>
                    </article>
                  );
                })}
              </section>

              <article className="rounded-[28px] border border-[#dbe5ff] bg-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef1ff] text-[#123bb7]">
                      <BarChart3 className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-heading font-bold text-[#101828]">Ready to activate</h2>
                      <p className="mt-1 text-sm text-[#667085]">
                        Continue to payment to generate {selectedScenario.allocations.length} vendor workflow requests.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleContinue}
                    disabled={!canContinue}
                    className="rounded-2xl bg-[#123bb7] px-5 py-4 text-sm font-bold text-white transition hover:bg-[#0f33a4] disabled:cursor-not-allowed disabled:bg-[#b8c3df]"
                  >
                    Continue to payment
                  </button>
                </div>
              </article>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default MiaAgent;
