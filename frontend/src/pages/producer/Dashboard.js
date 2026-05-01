import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { analyticsAPI } from '../../services/api';
import Sidebar from '../../components/Sidebar';
import StatCard from '../../components/StatCard';
import Button from '../../components/Button';
import { BadgeIndianRupee, BrainCircuit, Tag, DollarSign, Users, TrendingUp, PanelsTopLeft, Newspaper, Radio, Megaphone, MapPinned, Handshake } from 'lucide-react';

const BRAND_BIDS_STORAGE_KEY = 'brand_dashboard_bids';

const storageKeys = {
  billboards: 'billboard_live_campaigns',
  newspapers: 'newspaper_media_campaigns',
  radio: 'radio_media_campaigns',
  teaCups: 'tea_cup_marketing_campaigns',
  teaShopBoards: 'tea_shop_boards_campaigns',
  noticeMarketing: 'notice_marketing_campaigns',
  kudumbasree: 'kudumbasree_campaigns',
  students: 'students_campaigns',
  brandBriefs: 'brand_bidding_briefs',
};

const readStoredCampaigns = (key) => {
  if (typeof window === 'undefined') {
    return [];
  }

  const raw = window.localStorage.getItem(key);
  return raw ? JSON.parse(raw) : [];
};

const readStoredBids = () => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(BRAND_BIDS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const formatCurrency = (value) => `Rs ${Number(value || 0).toLocaleString('en-IN')}`;

const normalizeStoredCampaigns = () => {
  const billboardCampaigns = readStoredCampaigns(storageKeys.billboards).map((campaign) => ({
    id: campaign.id,
    title: campaign.campaignName || campaign.title,
    category: 'Billboards',
    subtitle: campaign.location,
    status: (campaign.status || 'live').toLowerCase(),
    budget: campaign.price || 0,
    spent: campaign.price || 0,
    reach: campaign.estimatedReach || 0,
    route: '/producer/vendors/billboards',
    routeState: { activeTab: 'live', reportCampaignId: campaign.id },
  }));

  const newspaperCampaigns = readStoredCampaigns(storageKeys.newspapers).map((campaign) => ({
    id: campaign.id,
    title: campaign.campaignName || campaign.newspaperName,
    category: 'Media',
    subtitle: `${campaign.newspaperName} • ${campaign.location}`,
    status: (campaign.status || 'live').toLowerCase(),
    budget: campaign.price || 0,
    spent: campaign.price || 0,
    reach: campaign.estimatedViewership || 0,
    route: '/producer/vendors/media/newspapers',
    routeState: { activeTab: 'live', reportCampaignId: campaign.id },
  }));

  const radioCampaigns = readStoredCampaigns(storageKeys.radio).map((campaign) => ({
    id: campaign.id,
    title: campaign.campaignName || campaign.stationName,
    category: 'Media',
    subtitle: `${campaign.stationName} • ${campaign.location}`,
    status: (campaign.status || 'live').toLowerCase(),
    budget: campaign.price || 0,
    spent: campaign.price || 0,
    reach: campaign.listenerReach || 0,
    route: '/producer/vendors/media/radio',
    routeState: { activeTab: 'live', reportCampaignId: campaign.id },
  }));

  const teaCupCampaigns = readStoredCampaigns(storageKeys.teaCups).map((campaign) => ({
    id: campaign.id,
    title: campaign.movieName,
    category: 'Field Agents',
    subtitle: `Tea Cup Marketing • ${campaign.district}`,
    status: (campaign.status || 'live').toLowerCase(),
    budget: campaign.totalCost || 0,
    spent: campaign.totalCost || 0,
    reach: campaign.distributed || 0,
    route: '/producer/vendors/field-agents/tea-cup-marketing',
    routeState: { activeTab: 'report', reportCampaignId: campaign.id },
  }));

  const teaShopBoardCampaigns = readStoredCampaigns(storageKeys.teaShopBoards).map((campaign) => ({
    id: campaign.id,
    title: campaign.movieName,
    category: 'Field Agents',
    subtitle: `Tea Shop Boards • ${campaign.district}`,
    status: (campaign.status || 'live').toLowerCase(),
    budget: campaign.totalCost || 0,
    spent: campaign.totalCost || 0,
    reach: campaign.outlets || 0,
    route: '/producer/vendors/field-agents/tea-shop-boards',
    routeState: { activeTab: 'report', reportCampaignId: campaign.id },
  }));

  const noticeCampaigns = readStoredCampaigns(storageKeys.noticeMarketing).map((campaign) => ({
    id: campaign.id,
    title: campaign.movieName,
    category: 'Field Agents',
    subtitle: `Notice Marketing • ${campaign.district}`,
    status: (campaign.status || 'live').toLowerCase(),
    budget: campaign.totalCost || 0,
    spent: campaign.totalCost || 0,
    reach: (campaign.outlets || 0) * 1000,
    route: '/producer/vendors/field-agents/notice-marketing',
    routeState: { activeTab: 'report', reportCampaignId: campaign.id },
  }));

  const kudumbasreeCampaigns = readStoredCampaigns(storageKeys.kudumbasree).map((campaign) => ({
    id: campaign.id,
    title: campaign.campaignName,
    category: 'Ambassadors',
    subtitle: `Kudumbasree • ${campaign.district || campaign.state || ''}`.trim(),
    status: (campaign.status || 'live').toLowerCase(),
    budget: campaign.budget || 0,
    spent: campaign.budget || 0,
    reach: campaign.targetViews || 0,
    route: '/producer/vendors/ambassadors/kudumbasree',
  }));

  const studentCampaigns = readStoredCampaigns(storageKeys.students).map((campaign) => ({
    id: campaign.id,
    title: campaign.campaignName,
    category: 'Ambassadors',
    subtitle: `Students • ${campaign.district || campaign.state || ''}`.trim(),
    status: (campaign.status || 'live').toLowerCase(),
    budget: campaign.budget || 0,
    spent: campaign.budget || 0,
    reach: campaign.targetViews || 0,
    route: '/producer/vendors/ambassadors/students',
  }));

  const brandCampaigns = readStoredCampaigns(storageKeys.brandBriefs).map((campaign) => ({
    id: campaign.id,
    title: campaign.movieName,
    category: 'Brands',
    subtitle: campaign.opportunityTitle || 'Brand collaboration',
    status: 'live',
    budget: Number(campaign.minimumBid || 0),
    spent: 0,
    reach: Number(String(campaign.expectedReach || 0).replace(/,/g, '')) || 0,
    route: '/producer/vendors/brands',
  }));

  return [
    ...billboardCampaigns,
    ...newspaperCampaigns,
    ...radioCampaigns,
    ...teaCupCampaigns,
    ...teaShopBoardCampaigns,
    ...noticeCampaigns,
    ...kudumbasreeCampaigns,
    ...studentCampaigns,
    ...brandCampaigns,
  ];
};

const aiScenarioOptions = [
  {
    id: 'brand-awareness',
    title: 'Brand Awareness',
    subtitle: 'Mass awareness',
    goal: 'Maximize recognition across a broad target audience',
    bestFor: 'New product launches and market entries',
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

const ProducerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isDemoProducer = user?.email === 'producer@test.com' && user?.account_type !== 'brand';
  const displayName = isDemoProducer ? 'Demo Producer' : user?.name;
  const displayProductionHouse = isDemoProducer ? 'Demo Producer Co' : user?.production_house;
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedScenarioId, setSelectedScenarioId] = useState('');
  const [campaignBudget, setCampaignBudget] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await analyticsAPI.getProducerDashboard(user.id);
      setDashboard(response.data);
    } catch (error) {
      setDashboard(null);
    } finally {
      setLoading(false);
    }
  };

  const storedCampaigns = normalizeStoredCampaigns();
  const backendCampaigns = (dashboard?.campaigns || []).map((campaign) => ({
    id: campaign.id,
    title: campaign.movie_title,
    category: 'Influencers',
    subtitle: campaign.campaign_type.replace('_', ' '),
    status: campaign.status,
    budget: campaign.total_budget || 0,
    spent: campaign.budget_spent || 0,
    reach: campaign.total_reach || campaign.reach || 0,
    posterUrl: campaign.poster_url,
    route: `/producer/campaigns/${campaign.id}`,
  }));

  const allCampaigns = [...storedCampaigns, ...backendCampaigns];
  const totalCampaignCount = allCampaigns.length;
  const activeCampaignCount = allCampaigns.filter((campaign) => campaign.status === 'active' || campaign.status === 'live').length;
  const totalBudget = allCampaigns.reduce((sum, campaign) => sum + Number(campaign.budget || 0), 0);
  const totalSpent = allCampaigns.reduce((sum, campaign) => sum + Number(campaign.spent || 0), 0);
  const totalReach = allCampaigns.reduce((sum, campaign) => sum + Number(campaign.reach || 0), 0);
  const brandBids = readStoredBids();
  const selectedScenario =
    aiScenarioOptions.find((scenario) => scenario.id === selectedScenarioId) || null;
  const parsedBudget = Number(String(campaignBudget).replace(/,/g, '')) || 0;
  const canShowAllocation = Boolean(selectedScenario && parsedBudget > 0);

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-on-surface font-body">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f8faff]" data-testid="producer-dashboard">
      <Sidebar />

      <div className="flex-1">
        {/* Header */}
        <div className="bg-white border-b border-[#eee] px-8 py-6">
          <div>
            <h1 className="text-3xl font-heading font-bold text-[#1b1c19] mb-1">
              Welcome back, {displayName}
            </h1>
            <p className="text-sm text-[#888]">{displayProductionHouse}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Campaigns"
              value={totalCampaignCount}
              subtitle={`${activeCampaignCount} active`}
              icon={Tag}
            />
            <StatCard
              title="Total Budget"
              value={`₹${totalBudget.toLocaleString('en-IN')}`}
              subtitle={`₹${totalSpent.toLocaleString('en-IN')} spent`}
              icon={DollarSign}
            />
            <StatCard
              title="Total Partners"
              value={dashboard?.total_influencers || 0}
              subtitle="Engaged partners"
              icon={Users}
            />
            <StatCard
              title="Total Reach"
              value={totalReach.toLocaleString('en-IN')}
              subtitle="Sum across all campaigns"
              icon={TrendingUp}
            />
          </div>

          <section id="movie-bids" className="mb-8 scroll-mt-6 rounded-[28px] border border-[#dbe5ff] bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#eef1ff] px-3 py-1 text-sm font-semibold text-[#0028aa]">
                  <BrainCircuit className="h-4 w-4" />
                  MIA
                </div>
                <h2 className="mt-4 text-2xl font-heading font-bold text-[#101828]">
                  Marketing Intelligence Agent
                </h2>
                <p className="mt-2 text-sm text-[#667085]">
                  Set your budget, choose your goal, and get the right channel mix.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/producer/mia-agent')}
                className="rounded-2xl bg-[#123bb7] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0f33a4]"
              >
                Open MIA
              </button>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <article className="rounded-[24px] border border-[#e4e9f4] bg-[#f8faff] p-5 lg:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">How It Works</p>
                <h3 className="mt-2 text-xl font-heading font-bold text-[#101828]">Create your campaign in 3 steps</h3>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl bg-white p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#123bb7] text-sm font-bold text-white">
                      1
                    </div>
                    <h4 className="mt-3 text-base font-heading font-bold text-[#101828]">Enter Budget</h4>
                    <p className="mt-2 text-sm text-[#667085]">
                      Add the total amount you want to spend for this brand campaign.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#123bb7] text-sm font-bold text-white">
                      2
                    </div>
                    <h4 className="mt-3 text-base font-heading font-bold text-[#101828]">Choose Objective</h4>
                    <p className="mt-2 text-sm text-[#667085]">
                      Select brand awareness, retail traffic, local buzz, or a full-funnel marketing plan.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#123bb7] text-sm font-bold text-white">
                      3
                    </div>
                    <h4 className="mt-3 text-base font-heading font-bold text-[#101828]">Review and Continue</h4>
                    <p className="mt-2 text-sm text-[#667085]">
                      Check the AI allocation, make payment, and send requests automatically into the vendor workflow.
                    </p>
                  </div>
                </div>
              </article>

              <article className="rounded-[24px] border border-[#e4e9f4] bg-[#f8faff] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">Budget</p>
                <h3 className="mt-2 text-xl font-heading font-bold text-[#101828]">Campaign Budget</h3>
                <div className="mt-4">
                  <input
                    type="text"
                    value={campaignBudget}
                    onChange={(event) => setCampaignBudget(event.target.value.replace(/[^\d,]/g, ''))}
                    placeholder="Enter budget"
                    className="w-full rounded-2xl border border-[#d9e2f2] bg-white px-4 py-3 text-base font-semibold text-[#101828] outline-none transition focus:border-[#123bb7]"
                  />
                </div>
              </article>

              <article className="rounded-[24px] border border-[#e4e9f4] bg-[#f8faff] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">Campaign Objective</p>
                <h3 className="mt-2 text-xl font-heading font-bold text-[#101828]">Choose Objective</h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {aiScenarioOptions.map((scenario) => (
                    <button
                      key={scenario.id}
                      type="button"
                      onClick={() => setSelectedScenarioId(scenario.id)}
                      className={`rounded-2xl border px-4 py-3 text-left text-sm font-bold transition ${
                        selectedScenarioId === scenario.id
                          ? 'border-[#123bb7] bg-[#123bb7] text-white shadow-lg'
                          : 'border-[#d9e2f2] bg-white text-[#24324b]'
                      }`}
                    >
                      <span className="block">{scenario.title}</span>
                      <span className={`mt-1 block text-xs ${selectedScenarioId === scenario.id ? 'text-white/80' : 'text-[#7a859c]'}`}>
                        {scenario.subtitle}
                      </span>
                    </button>
                  ))}
                </div>
              </article>
            </div>

            {canShowAllocation ? (
              <div className="mt-6 grid gap-6 xl:grid-cols-[320px,1fr]">
                <div className="rounded-[24px] bg-[linear-gradient(135deg,#0b1437_0%,#1d3fbf_60%,#8cb4ff_100%)] p-6 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">{selectedScenario.subtitle}</p>
                  <h3 className="mt-3 text-3xl font-heading font-bold">{selectedScenario.title}</h3>
                  <p className="mt-3 text-sm text-white/85">Goal: {selectedScenario.goal}</p>
                  <p className="mt-3 text-sm text-white/85">Budget: Rs {parsedBudget.toLocaleString('en-IN')}</p>
                  <p className="mt-4 text-sm font-semibold text-white">Best for: {selectedScenario.bestFor}</p>
                  <button
                    type="button"
                    onClick={() =>
                      navigate('/producer/dashboard/ai-campaign-manager/payment', {
                        state: {
                          budget: parsedBudget,
                          scenarioId: selectedScenario.id,
                          scenarioTitle: selectedScenario.title,
                          scenarioSubtitle: selectedScenario.subtitle,
                          goal: selectedScenario.goal,
                          bestFor: selectedScenario.bestFor,
                          allocations: selectedScenario.allocations.map((allocation) => ({
                            label: allocation.label,
                            value: allocation.value,
                            amount: Math.round((parsedBudget * Number(allocation.value.replace('%', ''))) / 100),
                          })),
                        },
                      })
                    }
                    className="mt-6 w-full rounded-2xl bg-white px-4 py-3 text-sm font-bold text-[#123bb7] transition hover:bg-[#eef4ff]"
                  >
                    Continue
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {selectedScenario.allocations.map((allocation) => {
                    const Icon = allocation.icon;
                    const allocationAmount = Math.round((parsedBudget * Number(allocation.value.replace('%', ''))) / 100);

                    return (
                      <article
                        key={`${selectedScenario.id}-${allocation.label}`}
                        className="rounded-[24px] border border-[#e4e9f4] bg-[#f8faff] p-4"
                      >
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef1ff] text-[#0028aa]">
                          <Icon className="h-5 w-5" />
                        </div>
                        <p className="mt-4 text-sm font-semibold uppercase tracking-[0.12em] text-[#8a94a6]">
                          Allocation
                        </p>
                        <h4 className="mt-1 text-lg font-heading font-bold text-[#101828]">{allocation.label}</h4>
                        <p className="mt-3 text-2xl font-heading font-bold text-[#123bb7]">{allocation.value}</p>
                        <p className="mt-1 text-sm font-semibold text-[#5f6f99]">Rs {allocationAmount.toLocaleString('en-IN')}</p>
                      </article>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-[24px] border border-dashed border-[#d9e2f2] bg-[#f8faff] px-5 py-6 text-sm font-semibold text-[#7a859c]">
                Add both budget and campaign objective to view the AI allocation and continue.
              </div>
            )}
          </section>

          <section className="mb-8 rounded-[28px] border border-[#dbe5ff] bg-white p-6 shadow-sm">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#eef1ff] px-3 py-1 text-sm font-semibold text-[#0028aa]">
                  <BadgeIndianRupee className="h-4 w-4" />
                  Movie Bids
                </div>
                <h2 className="mt-4 text-2xl font-heading font-bold text-[#101828]">
                  Applications from brands
                </h2>
                <p className="mt-2 text-sm text-[#667085]">
                  Review brand proposals submitted from the Brand Bid Box.
                </p>
              </div>
              <div className="rounded-2xl bg-[#f8faff] px-5 py-4 text-right">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">Total bids</p>
                <p className="mt-1 text-2xl font-heading font-bold text-[#0028aa]">{brandBids.length}</p>
              </div>
            </div>

            {brandBids.length > 0 ? (
              <div className="grid gap-4 lg:grid-cols-2">
                {brandBids.slice(0, 4).map((bid) => (
                  <article key={bid.id} className="rounded-[24px] border border-[#e4e9f4] bg-[#f8faff] p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">
                          {bid.opportunityTitle || 'Brand proposal'}
                        </p>
                        <h3 className="mt-2 text-xl font-heading font-bold text-[#101828]">
                          {bid.movieName || 'Campaign brief'}
                        </h3>
                      </div>
                      <span className="rounded-full bg-[#eef1ff] px-3 py-1 text-xs font-bold uppercase text-[#0028aa]">
                        {bid.status || 'submitted'}
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-white px-3 py-2 text-sm font-bold text-[#0028aa]">
                        {formatCurrency(bid.amount)}
                      </span>
                      {bid.submittedAt && (
                        <span className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-[#667085]">
                          {new Date(bid.submittedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#667085]">
                      {bid.proposal || 'No proposal details added.'}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-[24px] border border-dashed border-[#c7d2fe] bg-[#f8faff] px-5 py-8 text-center">
                <BadgeIndianRupee className="mx-auto h-10 w-10 text-[#0028aa]" />
                <h3 className="mt-4 text-xl font-heading font-bold text-[#101828]">No brand bids yet</h3>
                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#667085]">
                  Brand proposals will appear here after brands apply to briefs from their Bid Box.
                </p>
              </div>
            )}
          </section>

          {/* Recent Campaigns */}
          <div className="bg-white rounded-2xl border border-[#eee] p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-heading font-bold text-[#1b1c19]">Recent Campaigns</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/producer/campaigns')}
                data-testid="view-all-campaigns-button"
              >
                View All
              </Button>
            </div>

            {allCampaigns.length > 0 ? (
              <div className="space-y-4">
                {allCampaigns.slice(0, 5).map((campaign) => (
                  <div
                    key={campaign.id}
                    className="flex items-center justify-between rounded-2xl border border-[#dbe5ff] bg-[linear-gradient(135deg,#eef4ff_0%,#dce8ff_100%)] p-4 transition-all cursor-pointer hover:border-[#9eb8ff] hover:shadow-sm"
                    onClick={() => navigate(campaign.route, campaign.routeState ? { state: campaign.routeState } : undefined)}
                    data-testid={`campaign-item-${campaign.id}`}
                  >
                    <div className="flex items-center gap-4">
                      {campaign.posterUrl && (
                        <img
                          src={campaign.posterUrl}
                          alt={campaign.title}
                          className="w-14 h-14 object-cover rounded-xl"
                        />
                      )}
                      <div>
                        <h3 className="font-heading font-semibold text-[#1b1c19]">{campaign.title}</h3>
                        <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-[#0028aa]">
                          {campaign.category}
                        </p>
                        <p className="mt-1 text-xs text-[#5f6f99]">{campaign.subtitle}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        campaign.status === 'active' || campaign.status === 'live'
                          ? 'bg-[#ecfdf5] text-[#059669]'
                          : 'bg-[#f3f4f6] text-[#6b7280]'
                      }`}>
                        {String(campaign.status || 'draft').toUpperCase()}
                      </span>
                      <p className="mt-1 text-sm text-[#46557c]">
                        ₹{Number(campaign.spent || 0).toLocaleString('en-IN')} / ₹{Number(campaign.budget || 0).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Tag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-body text-muted-foreground mb-4">
                  No campaigns yet. Create your first campaign to get started!
                </p>
                <Button
                  variant="primary"
                  onClick={() => navigate('/producer/campaigns/create')}
                  data-testid="create-first-campaign-button"
                >
                  Create Your First Campaign
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProducerDashboard;
