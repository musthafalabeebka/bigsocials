import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Handshake, PanelsTopLeft, BadgeIndianRupee, Megaphone, UserRound, Tv, Users, BrainCircuit } from 'lucide-react';
import Sidebar from '../../components/Sidebar';

const vendorCategories = [
  {
    icon: Users,
    title: 'Influencers',
    description: 'Launch and manage influencer campaign workflows for creators, briefs, deliverables, and live campaign tracking.',
    path: '/producer/campaigns',
    cta: 'Open influencer campaigns',
  },
  {
    icon: PanelsTopLeft,
    title: 'Billboards',
    description: 'Outdoor inventory partners for highway, city-center, and theatre-zone visibility.',
    path: '/producer/vendors/billboards',
    cta: 'Browse inventory',
  },
  {
    icon: BadgeIndianRupee,
    title: 'Brands',
    description: 'Cross-promotion partners for co-branded offers, retail tie-ins, and promotional activations.',
    path: '/producer/vendors/brands',
    cta: 'Find Brand Collaborations',
  },
  {
    icon: Tv,
    title: 'Media',
    description: 'Press, digital, radio, and channel partners for campaign coverage and amplification.',
    path: '/producer/vendors/media',
    cta: 'Explore media',
  },
  {
    icon: Megaphone,
    title: 'Field Agents',
    description: 'Ground teams for cup branding, notice marketing, and street-level campaign execution.',
    path: '/producer/vendors/field-agents',
    cta: 'Explore field options',
  },
  {
    icon: UserRound,
    title: 'Ambassadors',
    description: 'On-ground promoters and face-of-campaign representatives to extend local reach.',
    path: '/producer/vendors/ambassadors',
    cta: 'Explore ambassadors',
  },
];

const Vendors = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex">
      <Sidebar />
      <main className="flex-1 p-8 lg:p-10">
        <div className="max-w-6xl mx-auto space-y-8">
          {location.state?.aiRequestsCreated ? (
            <section className="rounded-[28px] border border-[#dbe5ff] bg-[#eef4ff] p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#123bb7]">
                  <BrainCircuit className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#8a94a6]">AI Campaign Manager</p>
                  <h2 className="mt-1 text-xl font-heading font-bold text-[#101828]">
                    Requests sent automatically
                  </h2>
                  <p className="mt-2 text-sm text-[#667085]">
                    Payment for the {location.state.objective} plan is complete. {location.state.requestCount} channel requests were generated automatically and are now ready for execution.
                  </p>
                </div>
              </div>
            </section>
          ) : null}

          <section className="rounded-[32px] bg-[linear-gradient(135deg,#0b1437_0%,#1d3fbf_60%,#8cb4ff_100%)] p-8 lg:p-10 text-white shadow-xl">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold text-white">
                <Handshake className="h-4 w-4" />
                Vendors
              </div>
              <h1 className="mt-4 text-4xl font-heading font-bold">Find execution partners for every release beat.</h1>
              <p className="mt-3 font-body text-base text-white/80">
                Organize preferred vendor categories here so producers can move from planning to activation faster.
              </p>
            </div>
          </section>

          <section className="grid gap-6 md:grid-cols-3">
            {vendorCategories.map((category) => {
              const Icon = category.icon;
              const isInteractive = Boolean(category.path);

              return (
                <article
                  key={category.title}
                  className={`rounded-3xl border border-[#e7ebf4] bg-white p-6 shadow-sm transition-all ${
                    isInteractive ? 'cursor-pointer hover:-translate-y-1 hover:shadow-lg' : ''
                  }`}
                  onClick={isInteractive ? () => navigate(category.path) : undefined}
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f4f7ff] text-[#0028aa]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-heading font-bold text-[#101828]">{category.title}</h2>
                  <p className="mt-2 text-sm font-body text-[#667085]">{category.description}</p>
                  {isInteractive ? (
                    <p className="mt-4 text-sm font-semibold text-[#0028aa]">{category.cta}</p>
                  ) : null}
                </article>
              );
            })}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Vendors;
