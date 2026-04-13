import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BadgeIndianRupee,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Package2,
  Send,
  ShoppingBag,
  Sparkles,
  Ticket,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { BRAND_BRIEFS_STORAGE_KEY, biddingOpportunities } from '../producer/Brands';
import { PRODUCER_PR_BRIEFS_STORAGE_KEY } from '../producer/AiPrAgent';

const BRAND_BIDS_STORAGE_KEY = 'brand_dashboard_bids';

const sampleOpportunities = [
  {
    id: 'brand-opportunity-1',
    movieName: 'Metro Fresh Launch',
    opportunityTitle: 'Product placement in lifestyle content',
    opportunitySlug: 'product-placement-in-movie',
    starCast: 'Creator and retail partner network',
    expectedReach: '1,200,000',
    deliverables: 'Logo in 3 scenes, branded prop visibility, launch event integration',
    deadline: '2026-04-18',
    basePrice: 3500000,
  },
  {
    id: 'brand-opportunity-2',
    movieName: 'City Nights Retail Push',
    opportunityTitle: 'Brand placement in promotions-online and offline',
    opportunitySlug: 'brand-placement-in-promotions',
    starCast: 'Urban creator group and media partners',
    expectedReach: '850,000',
    deliverables: 'Launch video end-card, press meet backdrop, city promo contest',
    deadline: '2026-04-22',
    basePrice: 2200000,
  },
  {
    id: 'brand-opportunity-3',
    movieName: 'Street Kings Capsule Drop',
    opportunityTitle: 'Creators on product packaging of brands',
    opportunitySlug: 'movie-stars-on-product-packaging',
    starCast: 'Youth creators and campus ambassadors',
    expectedReach: '2,000,000',
    deliverables: 'Packaging rights, retail POS assets, launch-week creator posts',
    deadline: '2026-04-28',
    basePrice: 5000000,
  },
];

const sampleProducerBriefs = [
  {
    id: 'sample-producer-brief-1',
    title: 'Launch week creator and media push',
    brief:
      'Need a brand partner for a city-wide launch campaign covering creator reels, publication features, event mentions, and retail sampling.',
    publicationName: 'Brandibeat',
    location: 'Kerala',
    expectedReach: 420000,
    basePrice: 45000,
    placements: ['Homepage hero feature', 'Editorial carousel placement'],
    producerName: 'Demo Campaign Team',
    createdAt: '2026-04-11T09:00:00.000Z',
    status: 'open',
  },
  {
    id: 'sample-producer-brief-2',
    title: 'Retail activation partner for youth campaign',
    brief:
      'Looking for a brand that can support campus activations, product sampling, local creator posts, and outdoor visibility in priority districts.',
    publicationName: 'IndiaGlitz',
    location: 'Tamil Nadu',
    expectedReach: 372000,
    basePrice: 43000,
    placements: ['Lead story card', 'Video news module'],
    producerName: 'Regional Growth Team',
    createdAt: '2026-04-10T10:30:00.000Z',
    status: 'open',
  },
];

const opportunityIconMap = {
  'product-placement-in-movie': BriefcaseBusiness,
  'brand-placement-in-promotions': Sparkles,
  'movie-stars-on-product-packaging': Package2,
  'merchandising-partner': ShoppingBag,
  'movie-stars-caravan-branding': Ticket,
};

const readJson = (key, fallback) => {
  if (typeof window === 'undefined') {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
};

const formatCurrency = (value) => `Rs ${Number(value || 0).toLocaleString('en-IN')}`;

const normalizeStoredBrief = (brief) => ({
  id: brief.id,
  movieName: brief.movieName,
  opportunityTitle: brief.opportunityTitle,
  opportunitySlug: brief.opportunitySlug,
  starCast: brief.starCast || 'Partner details pending',
  expectedReach: brief.expectedReach || '0',
  deliverables: brief.deliverables || 'Deliverables pending',
  deadline: brief.deadline || 'Open',
  basePrice: Number(brief.basePrice || brief.minimumBid || 0),
});

const normalizeProducerBrief = (brief) => ({
  id: brief.id,
  movieName: brief.title || 'Producer brief',
  opportunityTitle: `Producer brief - ${brief.publicationName || 'Media placement'}`,
  opportunitySlug: 'producer-pr-brief',
  starCast: brief.producerName || 'Campaign team',
  expectedReach: Number(brief.expectedReach || 0).toLocaleString('en-IN'),
  deliverables: brief.brief || 'Brief details pending',
  deadline: 'Open',
  basePrice: Number(brief.basePrice || 0),
  placements: brief.placements || [],
  sourceType: 'producer-brief',
});

const getOpportunityIcon = (slug) => {
  const localOpportunity = biddingOpportunities.find((opportunity) => opportunity.slug === slug);
  return opportunityIconMap[slug] || localOpportunity?.icon || Megaphone;
};

const BrandDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [proposal, setProposal] = useState('');
  const [bids, setBids] = useState(() => readJson(BRAND_BIDS_STORAGE_KEY, []));

  const opportunities = useMemo(() => {
    const storedBriefs = readJson(BRAND_BRIEFS_STORAGE_KEY, []).map(normalizeStoredBrief);
    return storedBriefs.length > 0 ? storedBriefs : sampleOpportunities;
  }, []);
  const producerBriefs = useMemo(() => {
    const storedProducerBriefs = readJson(PRODUCER_PR_BRIEFS_STORAGE_KEY, []);
    const sourceBriefs = storedProducerBriefs.length > 0 ? storedProducerBriefs : sampleProducerBriefs;
    return sourceBriefs.map(normalizeProducerBrief);
  }, []);

  const totalOpenValue = [...opportunities, ...producerBriefs].reduce(
    (sum, opportunity) => sum + Number(opportunity.basePrice || 0),
    0
  );
  const acceptedBids = bids.filter((bid) => bid.status === 'accepted').length;

  const submitBid = (event) => {
    event.preventDefault();
    if (!selectedOpportunity) {
      return;
    }

    const nextBid = {
      id: `brand-bid-${Date.now()}`,
      opportunityId: selectedOpportunity.id,
      movieName: selectedOpportunity.movieName,
      opportunityTitle: selectedOpportunity.opportunityTitle,
      amount: Number(bidAmount || 0),
      proposal,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
    };

    const nextBids = [nextBid, ...bids];
    setBids(nextBids);
    writeJson(BRAND_BIDS_STORAGE_KEY, nextBids);
    setSelectedOpportunity(null);
    setBidAmount('');
    setProposal('');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#f8faff] text-[#1b1c19] lg:flex">
      <aside className="border-b border-[#e5e7eb] bg-white lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-4 px-6 py-5 lg:block">
          <Link to="/brand/dashboard" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#0028aa]">
              <Megaphone className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="font-heading text-xl font-extrabold">
                Big<span className="text-[#0028aa]">Socials</span>
              </div>
              <div className="text-xs font-semibold text-[#8a94a6]">Brand workspace</div>
            </div>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-[8px] px-3 py-2 text-sm font-bold text-[#dc2626] hover:bg-[#fef2f2] lg:mt-8 lg:w-full"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>

        <nav className="px-4 pb-5 lg:py-4">
          <Link
            to="/brand/dashboard"
            className="flex items-center gap-3 rounded-[8px] bg-[#0028aa] px-4 py-3 text-sm font-bold text-white"
          >
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Link>
          <Link
            to="/brand/movie-bids"
            className="mt-2 flex items-center gap-3 rounded-[8px] px-4 py-3 text-sm font-bold text-[#667085] hover:bg-[#f8faff]"
          >
            <BadgeIndianRupee className="h-5 w-5" />
            Movie Bids
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-5 md:p-8 lg:p-10">
        <div className="mx-auto max-w-7xl space-y-8">
          <section className="overflow-hidden rounded-[8px] bg-[#0028aa] p-7 text-white shadow-sm md:p-9">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <div>
                <p className="inline-flex items-center gap-2 rounded-[8px] bg-white/12 px-3 py-2 text-sm font-extrabold">
                  <Megaphone className="h-4 w-4" />
                  Brand dashboard
                </p>
                <h1 className="mt-5 font-heading text-4xl font-black leading-tight md:text-5xl">
                  Find campaigns ready for brand collaboration.
                </h1>
                <p className="mt-4 max-w-3xl text-base font-medium leading-7 text-white/75">
                  Review product placement, promotion, packaging, merchandising, and field branding opportunities.
                  Submit proposals and track every brand bid from one workspace.
                </p>
              </div>
              <div className="rounded-[8px] bg-white p-5 text-[#1b1c19]">
                <p className="text-sm font-bold text-[#667085]">Signed in as</p>
                <p className="mt-1 truncate font-heading text-2xl font-black">{user?.name || 'Brand User'}</p>
                <p className="mt-1 truncate text-sm font-semibold text-[#667085]">{user?.email}</p>
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            <StatTile icon={BriefcaseBusiness} label="Open opportunities" value={opportunities.length + producerBriefs.length} />
            <StatTile icon={BadgeIndianRupee} label="Open bid value" value={formatCurrency(totalOpenValue)} />
            <StatTile icon={CheckCircle2} label="Accepted bids" value={acceptedBids} />
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[8px] border border-[#dbe4ff] bg-white p-5 shadow-sm md:p-6">
              <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-sm font-extrabold uppercase tracking-normal text-[#0028aa]">Opportunities</p>
                  <h2 className="mt-1 font-heading text-2xl font-black">Available brand placements</h2>
                </div>
                <p className="text-sm font-semibold text-[#667085]">Submit a proposal to start the conversation.</p>
              </div>

              <div className="space-y-4">
                {opportunities.map((opportunity) => {
                  const Icon = getOpportunityIcon(opportunity.opportunitySlug);
                  return (
                    <article key={opportunity.id} className="rounded-[8px] border border-[#e5e7eb] bg-[#f8faff] p-5">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex gap-4">
                          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[8px] bg-[#eef1ff]">
                            <Icon className="h-5 w-5 text-[#0028aa]" />
                          </div>
                          <div>
                            <p className="text-xs font-extrabold uppercase tracking-normal text-[#667085]">
                              {opportunity.opportunityTitle}
                            </p>
                            <h3 className="mt-1 font-heading text-xl font-black">{opportunity.movieName}</h3>
                            <p className="mt-2 text-sm font-medium leading-6 text-[#667085]">{opportunity.deliverables}</p>
                            <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-[#475467]">
                              <span className="rounded-[8px] bg-white px-3 py-2">Reach {opportunity.expectedReach}</span>
                              <span className="rounded-[8px] bg-white px-3 py-2">Deadline {opportunity.deadline}</span>
                              <span className="rounded-[8px] bg-white px-3 py-2">Base {formatCurrency(opportunity.basePrice)}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedOpportunity(opportunity);
                            setBidAmount(opportunity.basePrice ? String(opportunity.basePrice) : '');
                            setProposal('');
                          }}
                          className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#0028aa] px-5 py-3 text-sm font-extrabold text-white transition-colors hover:bg-[#1a3fd4]"
                        >
                          Submit bid
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[8px] border border-[#dbe4ff] bg-white p-5 shadow-sm md:p-6">
              <div className="mb-5">
                <p className="text-sm font-extrabold uppercase tracking-normal text-[#0028aa]">Bid tracker</p>
                <h2 className="mt-1 font-heading text-2xl font-black">Submitted proposals</h2>
              </div>

              {bids.length === 0 ? (
                <div className="rounded-[8px] border border-dashed border-[#c7d2fe] bg-[#f8faff] p-6 text-center">
                  <BarChart3 className="mx-auto h-9 w-9 text-[#0028aa]" />
                  <h3 className="mt-4 font-heading text-xl font-black">No bids submitted yet</h3>
                  <p className="mt-2 text-sm font-medium leading-6 text-[#667085]">
                    Choose an opportunity and send your first brand proposal.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {bids.map((bid) => (
                    <article key={bid.id} className="rounded-[8px] border border-[#e5e7eb] bg-[#f8faff] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-heading text-lg font-black">{bid.movieName}</h3>
                          <p className="mt-1 text-sm font-semibold text-[#667085]">{bid.opportunityTitle}</p>
                        </div>
                        <span className="rounded-[8px] bg-[#eef1ff] px-3 py-1 text-xs font-extrabold uppercase text-[#0028aa]">
                          {bid.status}
                        </span>
                      </div>
                      <p className="mt-3 text-sm font-bold text-[#1b1c19]">{formatCurrency(bid.amount)}</p>
                      <p className="mt-2 line-clamp-3 text-sm font-medium leading-6 text-[#667085]">{bid.proposal}</p>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section id="bid-box" className="rounded-[8px] border border-[#dbe4ff] bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-extrabold uppercase tracking-normal text-[#0028aa]">Bid Box</p>
                <h2 className="mt-1 font-heading text-2xl font-black">Producer briefs open for brand applications</h2>
              </div>
              <p className="text-sm font-semibold text-[#667085]">
                Briefs saved from the AI PR Agent appear here for brands to review and apply.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {producerBriefs.map((brief) => (
                <article key={brief.id} className="rounded-[8px] border border-[#e5e7eb] bg-[#f8faff] p-5">
                  <div className="flex gap-4">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[8px] bg-[#eef1ff]">
                      <FileText className="h-5 w-5 text-[#0028aa]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-extrabold uppercase tracking-normal text-[#667085]">{brief.opportunityTitle}</p>
                      <h3 className="mt-1 font-heading text-xl font-black">{brief.movieName}</h3>
                      <p className="mt-2 line-clamp-3 text-sm font-medium leading-6 text-[#667085]">{brief.deliverables}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-[#475467]">
                    <span className="rounded-[8px] bg-white px-3 py-2">Reach {brief.expectedReach}</span>
                    <span className="rounded-[8px] bg-white px-3 py-2">Base {formatCurrency(brief.basePrice)}</span>
                    {brief.placements?.slice(0, 2).map((placement) => (
                      <span key={placement} className="rounded-[8px] bg-white px-3 py-2">{placement}</span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedOpportunity(brief);
                      setBidAmount(brief.basePrice ? String(brief.basePrice) : '');
                      setProposal('');
                    }}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#0028aa] px-5 py-3 text-sm font-extrabold text-white transition-colors hover:bg-[#1a3fd4]"
                  >
                    Apply to brief
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>

      {selectedOpportunity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form onSubmit={submitBid} className="w-full max-w-xl rounded-[8px] bg-white p-6 shadow-2xl">
            <div className="mb-5">
              <p className="text-sm font-extrabold uppercase tracking-normal text-[#0028aa]">Submit bid</p>
              <h2 className="mt-1 font-heading text-2xl font-black">{selectedOpportunity.movieName}</h2>
              <p className="mt-2 text-sm font-semibold text-[#667085]">{selectedOpportunity.opportunityTitle}</p>
            </div>

            <label className="block text-sm font-bold text-[#1b1c19]">
              Bid amount
              <input
                type="number"
                value={bidAmount}
                onChange={(event) => setBidAmount(event.target.value)}
                className="mt-2 w-full rounded-[8px] border-2 border-[#dbe4ff] bg-[#f8faff] px-4 py-3 text-sm font-semibold outline-none focus:border-[#0028aa] focus:bg-white"
                min="1"
                required
              />
            </label>

            <label className="mt-4 block text-sm font-bold text-[#1b1c19]">
              Proposal
              <textarea
                value={proposal}
                onChange={(event) => setProposal(event.target.value)}
                className="mt-2 min-h-32 w-full rounded-[8px] border-2 border-[#dbe4ff] bg-[#f8faff] px-4 py-3 text-sm font-semibold outline-none focus:border-[#0028aa] focus:bg-white"
                placeholder="Describe your brand fit, deliverables, campaign idea, and commercial terms."
                required
              />
            </label>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setSelectedOpportunity(null)}
                className="rounded-[8px] border border-[#d0d5dd] px-5 py-3 text-sm font-extrabold text-[#475467] hover:bg-[#f8faff]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#0028aa] px-5 py-3 text-sm font-extrabold text-white hover:bg-[#1a3fd4]"
              >
                <Send className="h-4 w-4" />
                Send proposal
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

const StatTile = ({ icon: Icon, label, value }) => (
  <div className="rounded-[8px] border border-[#dbe4ff] bg-white p-5 shadow-sm">
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-bold text-[#667085]">{label}</p>
        <p className="mt-2 font-heading text-3xl font-black text-[#0028aa]">{value}</p>
      </div>
      <div className="flex h-12 w-12 items-center justify-center rounded-[8px] bg-[#eef1ff]">
        <Icon className="h-6 w-6 text-[#0028aa]" />
      </div>
    </div>
  </div>
);

export default BrandDashboard;
