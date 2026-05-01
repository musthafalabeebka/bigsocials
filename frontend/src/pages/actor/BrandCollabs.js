import React from 'react';
import {
  ArrowRight,
  BadgeCheck,
  BadgeIndianRupee,
  Building2,
  Handshake,
  IndianRupee,
  Shirt,
  Trophy,
  Users,
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../contexts/AuthContext';

const collabs = [
  {
    brand: 'Myntra Style Drop',
    type: 'Fashion launch',
    budget: 'Rs 8.5L',
    status: 'Negotiation',
    brief: 'Two reels, one launch-day story set, and usage rights for 30 days.',
  },
  {
    brand: 'Malabar Gold Festive',
    type: 'Regional campaign',
    budget: 'Rs 12L',
    status: 'Shortlisted',
    brief: 'Festive campaign shoot with family audience targeting across Kerala.',
  },
  {
    brand: 'Prime Video Premiere',
    type: 'Entertainment partnership',
    budget: 'Rs 6L',
    status: 'Review',
    brief: 'Premiere attendance, red-carpet amplification, and creator cutdowns.',
  },
];

const activeEndorsements = [
  {
    brand: 'Kalyan Homes',
    category: 'Real estate',
    status: 'Active brand ambassador',
    period: '2026',
    scope: 'Mainline campaigns across Kerala for residential projects and brand trust positioning.',
    proof: 'Publicly announced in March 2026 as Nivin Pauly’s first formal brand endorsement.',
    icon: Building2,
  },
];

const partneredBrands = [
  {
    brand: 'Kalyan Homes',
    category: 'Real estate',
    relationship: 'Formal brand ambassador',
    period: '2026',
    icon: Building2,
  },
  {
    brand: 'Kerala Blasters FC',
    category: 'Sports / football',
    relationship: 'Brand ambassador association',
    period: '2016',
    icon: Trophy,
  },
];

const equityRequests = [
  {
    brand: 'D2C Skincare Studio',
    offer: '2% equity + 8% royalty',
    status: 'Due diligence',
  },
  {
    brand: 'Fitness Beverage Co',
    offer: '1.5% advisory equity',
    status: 'Negotiation',
  },
  {
    brand: 'Regional Fashion Label',
    offer: 'Revenue share + capsule bonus',
    status: 'Review',
  },
];

const capsuleDrops = [
  {
    title: 'Signature streetwear drop',
    detail: 'Hoodies, tees, and caps with a 6,000-unit inventory cap.',
    status: 'Design review',
  },
  {
    title: 'Fragrance mini-release',
    detail: 'Limited 5,000-unit launch with actor-led campaign content.',
    status: 'Sampling',
  },
  {
    title: 'Collectible poster set',
    detail: 'Numbered fan merchandise for launch-week drops.',
    status: 'Ready',
  },
];

const BrandCollabs = () => {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-[#f8faff] text-[#101828]">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden p-5 sm:p-8 lg:p-10">
        <div className="mx-auto max-w-7xl space-y-8">
          <section className="rounded-[32px] bg-[linear-gradient(135deg,#0b1437_0%,#1d3fbf_60%,#8cb4ff_100%)] p-6 text-white shadow-xl sm:p-8 lg:p-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
                <Handshake className="h-4 w-4" />
                Brand Collabs
              </div>
              <h1 className="mt-4 text-3xl font-heading font-extrabold sm:text-4xl">
                Brand collaborations for {user?.name || 'the actor'}
              </h1>
              <p className="mt-3 text-base font-semibold leading-7 text-white/82">
                Review incoming brand partnerships, campaign briefs, budgets, and collaboration status from one place.
              </p>
            </div>
          </section>

          <section className="grid gap-5 md:grid-cols-3">
            <StatCard icon={Handshake} title="Open collabs" value="3" detail="Active opportunities" />
            <StatCard icon={IndianRupee} title="Potential value" value="Rs 26.5L" detail="Pipeline estimate" />
            <StatCard icon={Users} title="Known partners" value={partneredBrands.length} detail="Publicly reported" />
          </section>

          <section className="grid gap-6 xl:grid-cols-[0.95fr,1.05fr]">
            <article className="rounded-[28px] border border-[#dbe5ff] bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#8a94a6]">Active endorsements</p>
                  <h2 className="mt-2 text-2xl font-heading font-extrabold text-[#101828]">Current brand partnerships</h2>
                </div>
                <span className="rounded-full bg-[#eef1ff] px-4 py-2 text-sm font-extrabold text-[#123bb7]">
                  Verified public data
                </span>
              </div>

              <div className="mt-6 space-y-4">
                {activeEndorsements.map(({ icon: Icon, ...endorsement }) => (
                  <article key={endorsement.brand} className="rounded-[24px] border border-[#e4e9f4] bg-[#f8faff] p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#eef1ff] text-[#123bb7]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-xl font-heading font-extrabold text-[#101828]">{endorsement.brand}</h3>
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold uppercase text-[#123bb7]">
                            {endorsement.status}
                          </span>
                        </div>
                        <p className="mt-2 text-sm font-bold text-[#5f6f99]">
                          {endorsement.category} · {endorsement.period}
                        </p>
                        <p className="mt-3 text-sm font-semibold leading-6 text-[#667085]">{endorsement.scope}</p>
                        <div className="mt-4 rounded-[16px] bg-white px-4 py-3 text-sm font-bold leading-6 text-[#35446a]">
                          {endorsement.proof}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </article>

            <article className="rounded-[28px] border border-[#dbe5ff] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <BadgeCheck className="h-5 w-5 text-[#123bb7]" />
                <h2 className="text-2xl font-heading font-extrabold text-[#101828]">Brands already partnered with</h2>
              </div>
              <p className="mt-2 text-sm font-semibold leading-6 text-[#667085]">
                Publicly reported brand and sports associations for Nivin Pauly.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {partneredBrands.map(({ icon: Icon, ...partner }) => (
                  <article key={partner.brand} className="rounded-[22px] border border-[#e4e9f4] bg-[#f8faff] p-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef1ff] text-[#123bb7]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-xl font-heading font-extrabold text-[#101828]">{partner.brand}</h3>
                    <p className="mt-1 text-sm font-bold text-[#5f6f99]">{partner.category}</p>
                    <div className="mt-4 grid gap-2">
                      <MiniDetail label="Relationship" value={partner.relationship} />
                      <MiniDetail label="Period" value={partner.period} />
                    </div>
                  </article>
                ))}
              </div>
            </article>
          </section>

          <section className="rounded-[28px] border border-[#dbe5ff] bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#8a94a6]">Pipeline</p>
                <h2 className="mt-2 text-2xl font-heading font-extrabold text-[#101828]">Incoming collaboration briefs</h2>
              </div>
              <span className="rounded-full bg-[#eef1ff] px-4 py-2 text-sm font-extrabold text-[#123bb7]">
                Brand-safe matches
              </span>
            </div>

            <div className="mt-6 grid gap-4">
              {collabs.map((collab) => (
                <article key={collab.brand} className="rounded-[24px] border border-[#e4e9f4] bg-[#f8faff] p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-xl font-heading font-extrabold text-[#101828]">{collab.brand}</h3>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold uppercase text-[#123bb7]">
                          {collab.status}
                        </span>
                      </div>
                      <p className="mt-2 text-sm font-bold text-[#5f6f99]">{collab.type}</p>
                      <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-[#667085]">{collab.brief}</p>
                    </div>
                    <div className="min-w-[150px] rounded-[16px] bg-white px-4 py-3">
                      <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#8a94a6]">Budget</p>
                      <p className="mt-1 text-xl font-heading font-extrabold text-[#123bb7]">{collab.budget}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="mt-4 inline-flex items-center gap-2 rounded-[8px] bg-[#123bb7] px-4 py-2 text-sm font-extrabold text-white transition hover:bg-[#0f33a4]"
                  >
                    Review brief
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </article>
              ))}
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <CollabWorkspace
              icon={BadgeIndianRupee}
              eyebrow="Equity Tracker"
              title="Co-ownership requests"
              intro="Track equity, royalty, and revenue-share proposals from brands that want long-term actor ownership participation."
              items={equityRequests.map((request) => ({
                title: request.brand,
                detail: request.offer,
                status: request.status,
              }))}
            />
            <CollabWorkspace
              icon={Shirt}
              eyebrow="Capsule Collection"
              title="Limited edition product releases"
              intro="Plan product drops with actor-led packaging, limited inventory, launch content, and brand partner approvals."
              items={capsuleDrops}
            />
          </section>
        </div>
      </main>
    </div>
  );
};

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

const MiniDetail = ({ label, value }) => (
  <div className="rounded-[16px] bg-white px-3 py-3">
    <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#8a94a6]">{label}</p>
    <p className="mt-1 text-sm font-heading font-extrabold text-[#123bb7]">{value}</p>
  </div>
);

const CollabWorkspace = ({ icon: Icon, eyebrow, title, intro, items }) => (
  <article className="rounded-[28px] border border-[#dbe5ff] bg-white p-6 shadow-sm">
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef1ff] text-[#123bb7]">
      <Icon className="h-5 w-5" />
    </div>
    <p className="mt-5 text-sm font-extrabold uppercase tracking-[0.18em] text-[#8a94a6]">{eyebrow}</p>
    <h2 className="mt-2 text-2xl font-heading font-extrabold text-[#101828]">{title}</h2>
    <p className="mt-2 text-sm font-semibold leading-6 text-[#667085]">{intro}</p>
    <div className="mt-5 space-y-3">
      {items.map((item) => (
        <div key={item.title} className="rounded-[20px] border border-[#e4e9f4] bg-[#f8faff] p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-base font-heading font-extrabold text-[#101828]">{item.title}</h3>
              <p className="mt-1 text-sm font-semibold leading-6 text-[#667085]">{item.detail}</p>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold uppercase text-[#123bb7]">
              {item.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  </article>
);

export default BrandCollabs;
