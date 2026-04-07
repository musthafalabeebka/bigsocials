import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, BadgeIndianRupee, BriefcaseBusiness, Package2, ShoppingBag, Sparkles, Ticket, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { Button } from '../../components/ui/button';

export const BRAND_BRIEFS_STORAGE_KEY = 'brand_bidding_briefs';

export const biddingOpportunities = [
  {
    slug: 'product-placement-in-movie',
    icon: BriefcaseBusiness,
    title: 'Product placement in movie',
    description: 'Invite brands to place products naturally inside scenes, sets, or scripted moments.',
  },
  {
    slug: 'brand-placement-in-promotions',
    icon: Sparkles,
    title: 'Brand placement in promotions-online and offline',
    description: 'Open bundled promotional slots across digital campaigns, events, trailers, and ground activations.',
  },
  {
    slug: 'movie-stars-on-product-packaging',
    icon: Package2,
    title: 'Movie stars on product packaging of brands',
    description: 'Offer packaging collaborations where brand SKUs feature movie stars and campaign visuals.',
  },
  {
    slug: 'merchandising-partner',
    icon: ShoppingBag,
    title: 'Merchandising partner',
    description: 'Source brands interested in licensed merchandise, retail drops, and themed collectibles.',
  },
  {
    slug: 'movie-stars-caravan-branding',
    icon: Ticket,
    title: 'Movie stars caravan branding',
    description: 'Allow brands to bid for caravan wraps and high-visibility on-ground star movement branding.',
  },
];

const fallbackBids = {
  'product-placement-in-movie': [
    {
      brand: 'Coca-Cola',
      amount: 4500000,
      note: 'Logo and bottle visibility across three hero scenes',
      pitch: 'Coca-Cola proposes integrated hero placement during two celebration scenes and one interval beat, supported by branded cooler props and on-ground multiplex sampling in launch week.',
      deliverables: '3 scene integrations, 1 launch event zone, 20 multiplex kiosks',
      status: 'pending',
    },
    {
      brand: 'Boat',
      amount: 3900000,
      note: 'Lead gadget placement plus social amplification',
      pitch: 'Boat wants the lead cast to feature branded audio wearables in performance and rehearsal sequences, followed by influencer-led digital snippets using the same creative language.',
      deliverables: '2 hero placements, 6 digital cutdowns, 1 social contest',
      status: 'pending',
    },
  ],
  'brand-placement-in-promotions': [
    {
      brand: 'Zomato',
      amount: 3000000,
      note: 'Offline launch event plus digital trailer integration',
      pitch: 'Zomato proposes city-wise food activation during trailer launch week, co-branded promo codes, and logo support across the offline press tour backdrop.',
      deliverables: '4-city promo code campaign, launch backdrop branding, digital trailer end-card',
      status: 'pending',
    },
  ],
  'movie-stars-on-product-packaging': [
    {
      brand: 'Aachi',
      amount: 5200000,
      note: 'Mass retail pack refresh across South India',
      pitch: 'Aachi is offering a wide retail packaging refresh featuring the lead pair, with in-store POS support and retailer contests timed to release week.',
      deliverables: 'Packaging redesign, 12,000 POS units, retailer contest program',
      status: 'pending',
    },
  ],
  'merchandising-partner': [
    {
      brand: 'Myntra',
      amount: 2500000,
      note: 'Apparel capsule with online-first drop',
      pitch: 'Myntra proposes a capsule merchandise line with cast-inspired looks, front-page app placement, and launch-day creator drops.',
      deliverables: '12-SKU capsule, app homepage feature, creator seeding kits',
      status: 'pending',
    },
  ],
  'movie-stars-caravan-branding': [
    {
      brand: 'Mahindra',
      amount: 1800000,
      note: 'Caravan wrap plus PR visibility during city tours',
      pitch: 'Mahindra proposes branded caravan wraps across the city tour leg, plus branded arrival moments and press photo wall integration.',
      deliverables: '2 caravan wraps, 5-city PR support, arrival branding',
      status: 'pending',
    },
  ],
};

const mockLiveBidBriefs = [
  {
    id: 'mock-brand-brief-1',
    movieName: 'Sarwam Maya',
    opportunityTitle: 'Product placement in movie',
    opportunitySlug: 'product-placement-in-movie',
    starCast: 'Lead ensemble cast',
    expectedReach: '1,200,000',
    deliverables: 'Logo in 3 scenes, branded prop visibility, 1 launch event integration',
    deadline: '2026-04-18',
    basePrice: 3500000,
    bids: fallbackBids['product-placement-in-movie'].slice(0, 1).map((bid) => ({
      ...bid,
      id: `mock-brand-brief-1-${bid.brand}`,
    })),
  },
  {
    id: 'mock-brand-brief-2',
    movieName: 'City Nights',
    opportunityTitle: 'Brand placement in promotions-online and offline',
    opportunitySlug: 'brand-placement-in-promotions',
    starCast: 'Lead pair plus supporting cast',
    expectedReach: '850,000',
    deliverables: 'Digital trailer end-card, press meet backdrop, promo contest integration',
    deadline: '2026-04-22',
    basePrice: 2200000,
    bids: fallbackBids['brand-placement-in-promotions'].slice(0, 1).map((bid) => ({
      ...bid,
      id: `mock-brand-brief-2-${bid.brand}`,
    })),
  },
];

const loadBriefs = () => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(BRAND_BRIEFS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const formatCurrency = (value) => `Rs ${Number(value || 0).toLocaleString('en-IN')}`;

const Brands = () => {
  const navigate = useNavigate();
  const [briefs, setBriefs] = useState([]);
  const [activeView, setActiveView] = useState('briefs');
  const [selectedBid, setSelectedBid] = useState(null);

  useEffect(() => {
    setBriefs(loadBriefs());
  }, []);

  const publishedBriefs = useMemo(
    () =>
      briefs.map((brief) => ({
        ...brief,
        bids: (fallbackBids[brief.opportunitySlug] || []).map((bid) => ({
          ...bid,
          id: `${brief.id}-${bid.brand}`,
        })),
      })),
    [briefs]
  );
  const liveBidBriefs = publishedBriefs.length > 0 ? publishedBriefs : mockLiveBidBriefs;

  const updateBidStatus = (briefId, bidId, status) => {
    setBriefs((current) => [...current]);
    setSelectedBid((current) => (current ? { ...current, status } : current));

    fallbackBids[selectedBid.opportunitySlug] = fallbackBids[selectedBid.opportunitySlug].map((bid) =>
      `${briefId}-${bid.brand}` === bidId ? { ...bid, status } : bid
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex">
      <Sidebar />
      <main className="flex-1 p-8 lg:p-10">
        <div className="max-w-6xl mx-auto space-y-8">
          <section className="rounded-[32px] bg-[linear-gradient(135deg,#0b1437_0%,#1d3fbf_60%,#8cb4ff_100%)] p-8 lg:p-10 text-white shadow-xl">
            <button
              type="button"
              onClick={() => navigate('/producer/vendors')}
              className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Vendors
            </button>

            <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
                  <BadgeIndianRupee className="h-4 w-4" />
                  Brands
                </div>
                <h1 className="mt-4 text-4xl font-heading font-bold">Monetize Your Movie with Brand Collaborations</h1>
                <p className="mt-3 text-base font-body text-white/80">
                  Start a bidding opportunity, publish the brief, and track what brands are offering.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] bg-[#f3f6fb] p-4">
            <div className="mb-4 rounded-[24px] border border-[#dbe5ff] bg-white p-5 shadow-sm">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">How It Works</p>
                <h2 className="mt-2 text-2xl font-heading font-bold text-[#101828]">Launch your brand collaboration in 3 steps</h2>
                <p className="mt-2 text-sm text-[#667085]">
                  Use this workflow to create a brief, collect brand bids, and lock the right collaboration for your movie.
                </p>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <article className="rounded-[24px] border border-[#dbe5ff] bg-[#f8faff] p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#123bb7] text-sm font-bold text-white">
                    1
                  </div>
                  <h3 className="mt-3 text-lg font-heading font-bold text-[#101828]">Enter Brief</h3>
                  <p className="mt-2 text-sm text-[#667085]">
                    Choose a brand opportunity and create the movie brief with deliverables, reach, pricing, and deadline.
                  </p>
                </article>

                <article className="rounded-[24px] border border-[#dbe5ff] bg-[#f8faff] p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#123bb7] text-sm font-bold text-white">
                    2
                  </div>
                  <h3 className="mt-3 text-lg font-heading font-bold text-[#101828]">Review Live Bids</h3>
                  <p className="mt-2 text-sm text-[#667085]">
                    Check the incoming brand pitches, pricing, and deliverables across your live opportunities.
                  </p>
                </article>

                <article className="rounded-[24px] border border-[#dbe5ff] bg-[#f8faff] p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#123bb7] text-sm font-bold text-white">
                    3
                  </div>
                  <h3 className="mt-3 text-lg font-heading font-bold text-[#101828]">Accept the Right Brand</h3>
                  <p className="mt-2 text-sm text-[#667085]">
                    Open the bid details, compare the pitch, and accept or reject based on the best movie fit.
                  </p>
                </article>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setActiveView('briefs')}
                className={`min-w-[140px] rounded-full px-6 py-3 text-base font-bold uppercase tracking-[0.04em] transition ${
                  activeView === 'briefs'
                    ? 'bg-[#123bb7] text-white shadow-lg'
                    : 'bg-[#e9edf5] text-[#20242c]'
                }`}
              >
                Briefs
              </button>
              <button
                type="button"
                onClick={() => setActiveView('bids')}
                className={`min-w-[140px] rounded-full px-6 py-3 text-base font-bold uppercase tracking-[0.04em] transition ${
                  activeView === 'bids'
                    ? 'bg-[#123bb7] text-white shadow-lg'
                    : 'bg-[#e9edf5] text-[#20242c]'
                }`}
              >
                Live Bids
              </button>
            </div>
          </section>

          {activeView === 'briefs' ? (
            <section className="space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8a94a6]">Bidding Opportunities</p>
                <h2 className="mt-2 text-3xl font-heading font-bold text-[#101828]">Choose a placement and launch a brief.</h2>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {biddingOpportunities.map((opportunity) => {
                  const Icon = opportunity.icon;

                  return (
                    <article key={opportunity.slug} className="rounded-[28px] border border-[#e3e8f3] bg-white p-6 shadow-sm">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef1ff] text-[#0028aa]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-2xl font-heading font-bold text-[#101828]">{opportunity.title}</h3>
                      <p className="mt-3 text-sm font-body text-[#667085]">{opportunity.description}</p>
                      <Button
                        className="mt-5 bg-[#0028aa] text-white hover:bg-[#001f85]"
                        onClick={() => navigate(`/producer/vendors/brands/new?opportunity=${opportunity.slug}`)}
                      >
                        Enter Brief
                      </Button>
                    </article>
                  );
                })}
              </div>
            </section>
          ) : (
            <section className="rounded-[32px] border border-[#e3e8f3] bg-white p-8 shadow-sm">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8a94a6]">Live Bids</p>
                  <h2 className="mt-2 text-3xl font-heading font-bold text-[#101828]">See what brands are bidding.</h2>
                </div>
                <div className="rounded-full bg-[#eef1ff] px-4 py-2 text-sm font-semibold text-[#0028aa]">
                  {liveBidBriefs.length} live opportunities
                </div>
              </div>

              {liveBidBriefs.length > 0 ? (
                <div className="mt-6 grid gap-5">
                  {liveBidBriefs.map((brief) => (
                    <article key={brief.id} className="rounded-[28px] border border-[#e3e8f3] bg-[#f8fbff] p-6">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="space-y-2">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a94a6]">{brief.opportunityTitle}</p>
                          <h3 className="text-2xl font-heading font-bold text-[#101828]">{brief.movieName}</h3>
                          <p className="text-sm font-body text-[#667085]">Star cast: {brief.starCast}</p>
                          <p className="text-sm font-body text-[#667085]">Expected reach: {brief.expectedReach}</p>
                          <p className="text-sm font-body text-[#667085]">Deliverables: {brief.deliverables}</p>
                          <p className="text-sm font-body text-[#667085]">Deadline: {brief.deadline}</p>
                        </div>
                        <div className="rounded-3xl bg-white px-5 py-4 shadow-sm">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a94a6]">Minimum bid</p>
                          <p className="mt-1 text-3xl font-heading font-bold text-[#101828]">{formatCurrency(brief.basePrice)}</p>
                        </div>
                      </div>

                      <div className="mt-6 grid gap-4 md:grid-cols-2">
                        {brief.bids.length > 0 ? (
                          brief.bids.map((bid) => (
                            <button
                              key={`${brief.id}-${bid.brand}`}
                              type="button"
                              onClick={() =>
                                setSelectedBid({
                                  ...bid,
                                  briefId: brief.id,
                                  bidId: bid.id,
                                  movieName: brief.movieName,
                                  opportunityTitle: brief.opportunityTitle,
                                  opportunitySlug: brief.opportunitySlug,
                                  basePrice: brief.basePrice,
                                })
                              }
                              className="rounded-3xl border border-[#e3e8f3] bg-white p-5 text-left transition hover:-translate-y-0.5 hover:shadow-sm"
                            >
                              <div className="flex items-center justify-between gap-3">
                                <p className="text-lg font-heading font-bold text-[#101828]">{bid.brand}</p>
                                <p className="text-xl font-heading font-bold text-[#0028aa]">{formatCurrency(bid.amount)}</p>
                              </div>
                              <p className="mt-2 text-sm font-body text-[#667085]">{bid.note}</p>
                              <div className="mt-4 flex items-center justify-between">
                                <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${
                                  bid.status === 'accepted'
                                    ? 'bg-[#ecfdf3] text-[#15803d]'
                                    : bid.status === 'rejected'
                                      ? 'bg-[#fef2f2] text-[#b91c1c]'
                                      : 'bg-[#eff6ff] text-[#1d4ed8]'
                                }`}>
                                  {bid.status}
                                </span>
                                <span className="text-sm font-semibold text-[#0028aa]">Open bid</span>
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="rounded-3xl border border-dashed border-[#cfd6e4] bg-white p-5 text-sm font-medium text-[#667085]">
                            No bids yet. This opportunity is live and awaiting brand responses.
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-[28px] border border-dashed border-[#cfd6e4] bg-[#f8fbff] p-10 text-center">
                  <h3 className="text-2xl font-heading font-bold text-[#101828]">No live brand bids yet.</h3>
                  <p className="mt-2 text-sm font-body text-[#667085]">
                    Click `Briefs`, complete any opportunity form, and the bidding will go live here.
                  </p>
                </div>
              )}
            </section>
          )}
        </div>
      </main>

      {selectedBid ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/45 p-4">
          <div className="w-full max-w-3xl rounded-[32px] bg-white p-8 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8a94a6]">{selectedBid.opportunityTitle}</p>
                <h3 className="mt-2 text-3xl font-heading font-bold text-[#101828]">{selectedBid.brand}</h3>
                <p className="mt-2 text-sm font-body text-[#667085]">{selectedBid.movieName}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBid(null)}
                className="rounded-full bg-[#f4f7fb] p-2 text-[#667085]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl bg-[#f8fbff] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a94a6]">Bid Amount</p>
                <p className="mt-2 text-3xl font-heading font-bold text-[#0028aa]">{formatCurrency(selectedBid.amount)}</p>
              </div>
              <div className="rounded-3xl bg-[#f8fbff] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a94a6]">Minimum Bid</p>
                <p className="mt-2 text-3xl font-heading font-bold text-[#101828]">{formatCurrency(selectedBid.basePrice)}</p>
              </div>
              <div className="rounded-3xl bg-[#f8fbff] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a94a6]">Status</p>
                <p className="mt-2 text-2xl font-heading font-bold capitalize text-[#101828]">{selectedBid.status}</p>
              </div>
            </div>

            <div className="mt-6 space-y-5">
              <div className="rounded-3xl border border-[#e3e8f3] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a94a6]">Brand Pitch</p>
                <p className="mt-3 text-sm leading-7 font-body text-[#475467]">{selectedBid.pitch}</p>
              </div>

              <div className="rounded-3xl border border-[#e3e8f3] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a94a6]">Deliverables</p>
                <p className="mt-3 text-sm leading-7 font-body text-[#475467]">{selectedBid.deliverables}</p>
              </div>
            </div>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                className="bg-white text-[#b91c1c] hover:bg-[#fef2f2] border border-[#fecaca]"
                onClick={() => updateBidStatus(selectedBid.briefId, selectedBid.bidId, 'rejected')}
              >
                Reject Bid
              </Button>
              <Button
                className="bg-[#16a34a] text-white hover:bg-[#15803d]"
                onClick={() => updateBidStatus(selectedBid.briefId, selectedBid.bidId, 'accepted')}
              >
                Accept Bid
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Brands;
