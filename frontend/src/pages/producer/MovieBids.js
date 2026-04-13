import React, { useMemo, useState } from 'react';
import {
  BadgeIndianRupee,
  BarChart3,
  CheckCircle2,
  FileText,
  LayoutDashboard,
  LogOut,
  MapPin,
  Megaphone,
  Send,
  Users,
  X,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from '../../components/Sidebar';
import { PRODUCER_PR_BRIEFS_STORAGE_KEY } from './AiPrAgent';

const BRAND_BIDS_STORAGE_KEY = 'brand_dashboard_bids';

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

const formatNumber = (value) => Number(value || 0).toLocaleString('en-IN');

const normalizeBrief = (brief) => ({
  id: brief.id,
  title: brief.title || brief.movieName || 'Brand collaboration brief',
  brief: brief.brief || brief.deliverables || 'Brief details pending.',
  publicationName: brief.publicationName || 'Media partner',
  location: brief.location || 'Priority market',
  expectedReach: Number(brief.expectedReach || 0),
  basePrice: Number(brief.basePrice || brief.minimumBid || 0),
  placements: Array.isArray(brief.placements) ? brief.placements : [],
  producerName: brief.producerName || 'Campaign team',
  createdAt: brief.createdAt,
  status: brief.status || 'open',
});

const MovieBids = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isBrandRoute = location.pathname.startsWith('/brand');
  const [selectedBrief, setSelectedBrief] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [proposal, setProposal] = useState('');
  const [brandBids, setBrandBids] = useState(() => readJson(BRAND_BIDS_STORAGE_KEY, []));

  const producerBriefs = useMemo(() => {
    const storedBriefs = readJson(PRODUCER_PR_BRIEFS_STORAGE_KEY, []);
    const sourceBriefs = storedBriefs.length > 0 ? storedBriefs : sampleProducerBriefs;
    return sourceBriefs.map(normalizeBrief);
  }, []);

  const producerBriefIds = useMemo(() => new Set(producerBriefs.map((brief) => brief.id)), [producerBriefs]);
  const submittedProducerBids = brandBids.filter((bid) => producerBriefIds.has(bid.opportunityId));
  const submittedBriefIds = new Set(submittedProducerBids.map((bid) => bid.opportunityId));
  const totalOpenBriefs = producerBriefs.filter((brief) => brief.status === 'open').length;
  const totalBriefValue = producerBriefs.reduce((sum, brief) => sum + brief.basePrice, 0);

  const openApplyForm = (brief) => {
    setSelectedBrief(brief);
    setBidAmount(brief.basePrice ? String(brief.basePrice) : '');
    setProposal('');
  };

  const closeApplyForm = () => {
    setSelectedBrief(null);
    setBidAmount('');
    setProposal('');
  };

  const submitBid = (event) => {
    event.preventDefault();
    if (!selectedBrief) {
      return;
    }

    const nextBid = {
      id: `brand-bid-${Date.now()}`,
      opportunityId: selectedBrief.id,
      movieName: selectedBrief.title,
      opportunityTitle: `Producer brief - ${selectedBrief.publicationName}`,
      amount: Number(bidAmount || 0),
      proposal,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
    };

    const nextBids = [nextBid, ...brandBids];
    setBrandBids(nextBids);
    writeJson(BRAND_BIDS_STORAGE_KEY, nextBids);
    closeApplyForm();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#f8faff] text-[#1b1c19] lg:flex">
      {isBrandRoute ? (
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

          <nav className="space-y-2 px-4 pb-5 lg:py-4">
            <Link
              to="/brand/dashboard"
              className="flex items-center gap-3 rounded-[8px] px-4 py-3 text-sm font-bold text-[#667085] hover:bg-[#f8faff]"
            >
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </Link>
            <Link
              to="/brand/movie-bids"
              className="flex items-center gap-3 rounded-[8px] bg-[#0028aa] px-4 py-3 text-sm font-bold text-white"
            >
              <BadgeIndianRupee className="h-5 w-5" />
              Movie Bids
            </Link>
          </nav>
        </aside>
      ) : (
        <Sidebar />
      )}

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          <section className="overflow-hidden rounded-[28px] bg-[#0028aa] p-7 text-white shadow-sm md:p-9">
            <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold">
                  <BadgeIndianRupee className="h-4 w-4" />
                  Movie Bids
                </div>
                <h1 className="mt-5 max-w-4xl font-heading text-4xl font-black leading-tight md:text-5xl">
                  Apply to producer briefs ready for brand partners.
                </h1>
                <p className="mt-4 max-w-3xl text-base font-medium leading-7 text-white/75">
                  Browse available bids shared by producers, review the campaign brief, and send your brand proposal.
                </p>
              </div>

              <div className="rounded-[24px] bg-white p-5 text-[#101828]">
                <p className="text-sm font-bold text-[#667085]">Signed in as</p>
                <p className="mt-1 truncate font-heading text-2xl font-black">{user?.name || 'Brand User'}</p>
                <p className="mt-1 truncate text-sm font-semibold text-[#667085]">{user?.email}</p>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#eef1ff] text-[#0028aa]">
                      <FileText className="h-5 w-5" />
                    </span>
                    <p className="text-sm font-bold">Review producer brief</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#eef1ff] text-[#0028aa]">
                      <Send className="h-5 w-5" />
                    </span>
                    <p className="text-sm font-bold">Send proposal and bid amount</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#eef1ff] text-[#0028aa]">
                      <CheckCircle2 className="h-5 w-5" />
                    </span>
                    <p className="text-sm font-bold">Track submitted bids</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-6 grid gap-4 md:grid-cols-3">
            <article className="rounded-[24px] border border-[#dbe5ff] bg-white p-5 shadow-sm">
              <p className="text-sm font-bold text-[#667085]">Open briefs</p>
              <p className="mt-3 font-heading text-3xl font-black text-[#0028aa]">{totalOpenBriefs}</p>
            </article>
            <article className="rounded-[24px] border border-[#dbe5ff] bg-white p-5 shadow-sm">
              <p className="text-sm font-bold text-[#667085]">My submitted bids</p>
              <p className="mt-3 font-heading text-3xl font-black text-[#0028aa]">{submittedProducerBids.length}</p>
            </article>
            <article className="rounded-[24px] border border-[#dbe5ff] bg-white p-5 shadow-sm">
              <p className="text-sm font-bold text-[#667085]">Open bid value</p>
              <p className="mt-3 font-heading text-3xl font-black text-[#0028aa]">
                {formatCurrency(totalBriefValue)}
              </p>
            </article>
          </section>

          <section className="mt-8 rounded-[28px] border border-[#dbe5ff] bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#eef1ff] px-3 py-1 text-sm font-semibold text-[#0028aa]">
                  <Megaphone className="h-4 w-4" />
                  Available bids
                </div>
                <h2 className="mt-4 text-2xl font-heading font-bold text-[#101828]">
                  Producer briefs your brand can apply to
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#667085]">
                  Select a producer brief, submit your amount, and explain how your brand can support the campaign.
                </p>
              </div>
            </div>

            {producerBriefs.length > 0 ? (
              <div className="mt-6 grid gap-5 xl:grid-cols-2">
                {producerBriefs.map((brief) => {
                  const hasApplied = submittedBriefIds.has(brief.id);

                  return (
                    <article key={brief.id} className="rounded-[24px] border border-[#e4e9f4] bg-[#f8faff] p-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8a94a6]">
                            {brief.publicationName}
                          </p>
                          <h3 className="mt-2 text-2xl font-heading font-black text-[#101828]">
                            {brief.title}
                          </h3>
                        </div>
                        <span className="inline-flex w-fit items-center rounded-full bg-white px-3 py-1 text-xs font-bold uppercase text-[#0028aa]">
                          {brief.status}
                        </span>
                      </div>

                      <p className="mt-4 text-sm leading-6 text-[#5f6f99]">{brief.brief}</p>

                      <div className="mt-5 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-[16px] bg-white p-4">
                          <MapPin className="h-5 w-5 text-[#0028aa]" />
                          <p className="mt-2 text-xs font-bold uppercase text-[#8a94a6]">Market</p>
                          <p className="mt-1 text-sm font-bold text-[#101828]">{brief.location}</p>
                        </div>
                        <div className="rounded-[16px] bg-white p-4">
                          <Users className="h-5 w-5 text-[#0028aa]" />
                          <p className="mt-2 text-xs font-bold uppercase text-[#8a94a6]">Reach</p>
                          <p className="mt-1 text-sm font-bold text-[#101828]">
                            {formatNumber(brief.expectedReach)}
                          </p>
                        </div>
                        <div className="rounded-[16px] bg-white p-4">
                          <BadgeIndianRupee className="h-5 w-5 text-[#0028aa]" />
                          <p className="mt-2 text-xs font-bold uppercase text-[#8a94a6]">Base bid</p>
                          <p className="mt-1 text-sm font-bold text-[#101828]">
                            {formatCurrency(brief.basePrice)}
                          </p>
                        </div>
                      </div>

                      {brief.placements.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {brief.placements.map((placement) => (
                            <span
                              key={placement}
                              className="rounded-full bg-white px-3 py-2 text-xs font-bold text-[#0028aa]"
                            >
                              {placement}
                            </span>
                          ))}
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => openApplyForm(brief)}
                        disabled={hasApplied}
                        className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[8px] px-5 py-3 text-sm font-extrabold transition-colors ${
                          hasApplied
                            ? 'bg-[#eef1ff] text-[#0028aa]'
                            : 'bg-[#0028aa] text-white hover:bg-[#001f85]'
                        }`}
                      >
                        {hasApplied ? (
                          <>
                            <CheckCircle2 className="h-4 w-4" />
                            Applied
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            Apply to this bid
                          </>
                        )}
                      </button>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="mt-6 rounded-[24px] border border-dashed border-[#c7d2fe] bg-[#f8faff] p-8 text-center">
                <FileText className="mx-auto h-10 w-10 text-[#0028aa]" />
                <h3 className="mt-4 text-xl font-heading font-bold text-[#101828]">No briefs yet</h3>
                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#667085]">
                  Producer briefs will appear here when producers save campaigns from the AI PR Agent.
                </p>
              </div>
            )}
          </section>

          <section className="mt-8 rounded-[28px] border border-[#dbe5ff] bg-white p-6 shadow-sm">
            <div className="mb-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#eef1ff] px-3 py-1 text-sm font-semibold text-[#0028aa]">
                <BarChart3 className="h-4 w-4" />
                Bid tracker
              </div>
              <h2 className="mt-4 text-2xl font-heading font-bold text-[#101828]">My submitted producer bids</h2>
            </div>

            {submittedProducerBids.length > 0 ? (
              <div className="grid gap-4 lg:grid-cols-2">
                {submittedProducerBids.map((bid) => (
                  <article key={bid.id} className="rounded-[24px] border border-[#e4e9f4] bg-[#f8faff] p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8a94a6]">
                          {bid.opportunityTitle}
                        </p>
                        <h3 className="mt-2 text-xl font-heading font-bold text-[#101828]">{bid.movieName}</h3>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase text-[#0028aa]">
                        {bid.status}
                      </span>
                    </div>
                    <p className="mt-4 text-lg font-heading font-bold text-[#0028aa]">{formatCurrency(bid.amount)}</p>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#667085]">{bid.proposal}</p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-[24px] border border-dashed border-[#c7d2fe] bg-[#f8faff] px-5 py-8 text-center">
                <BarChart3 className="mx-auto h-10 w-10 text-[#0028aa]" />
                <h3 className="mt-4 text-xl font-heading font-bold text-[#101828]">No producer bids submitted yet</h3>
                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#667085]">
                  Apply to an available producer brief and your proposal will appear here.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>

      {selectedBrief ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form onSubmit={submitBid} className="w-full max-w-xl rounded-[8px] bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-extrabold uppercase tracking-normal text-[#0028aa]">Apply to producer bid</p>
                <h2 className="mt-1 font-heading text-2xl font-black">{selectedBrief.title}</h2>
                <p className="mt-2 text-sm font-semibold text-[#667085]">
                  {selectedBrief.publicationName} • {selectedBrief.location}
                </p>
              </div>
              <button type="button" onClick={closeApplyForm} className="rounded-full bg-[#f4f7fb] p-2 text-[#667085]">
                <X className="h-5 w-5" />
              </button>
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
                placeholder="Describe your brand fit, offer, deliverables, timeline, and commercial terms."
                required
              />
            </label>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeApplyForm}
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
      ) : null}
    </div>
  );
};

export default MovieBids;
