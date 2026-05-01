import React from 'react';
import { ArrowLeft, CupSoda, Megaphone, ScrollText, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

const options = [
  {
    title: 'Tea cup marketing',
    description: 'Activate branded tea cup distribution through tea shops, kiosks, and on-ground sampling partners.',
    icon: CupSoda,
    path: '/producer/vendors/field-agents/tea-cup-marketing',
    cta: 'Book your tea cups',
  },
  {
    title: 'Tea shop boards',
    description: 'Plan branded tea shop board placements with the same booking and campaign tracking workflow.',
    icon: ScrollText,
    path: '/producer/vendors/field-agents/tea-shop-boards',
    cta: 'Book tea shop boards',
  },
  {
    title: 'Notice Marketing',
    description: 'Coordinate field agents for flyer, notice, and street-distribution campaigns in target locations.',
    icon: ScrollText,
    path: '/producer/vendors/field-agents/notice-marketing',
    cta: 'Book notice marketing',
  },
  {
    title: 'Supermarkets',
    description: 'Place campaign materials across supermarket counters, billing areas, and shopper-facing store zones.',
    icon: Store,
    cta: 'Coming soon',
  },
];

const FieldAgents = () => {
  const navigate = useNavigate();

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

            <div className="mt-5 max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
                <Megaphone className="h-4 w-4" />
                Field Agents
              </div>
              <h1 className="mt-4 text-4xl font-heading font-bold">Choose the field activation format you want to launch.</h1>
              <p className="mt-3 text-base font-body text-white/80">
                Pick the street-level format first, then build the campaign execution workflow around it.
              </p>
            </div>
          </section>

          <section className="rounded-[24px] border border-[#dbe5ff] bg-white p-5 shadow-sm">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">How It Works</p>
              <h2 className="mt-2 text-2xl font-heading font-bold text-[#101828]">Launch your field campaign in 3 steps</h2>
              <p className="mt-2 text-sm text-[#667085]">
                Use this workflow to select the field format, make the booking, and track live execution reports.
              </p>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <article className="rounded-[24px] border border-[#dbe5ff] bg-[#f8faff] p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#123bb7] text-sm font-bold text-white">
                  1
                </div>
                <h3 className="mt-3 text-lg font-heading font-bold text-[#101828]">Choose Format</h3>
                <p className="mt-2 text-sm text-[#667085]">
                  Pick the field activation format such as tea cup marketing, tea shop boards, notice marketing, or supermarkets.
                </p>
              </article>

              <article className="rounded-[24px] border border-[#dbe5ff] bg-[#f8faff] p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#123bb7] text-sm font-bold text-white">
                  2
                </div>
                <h3 className="mt-3 text-lg font-heading font-bold text-[#101828]">Book the Campaign</h3>
                <p className="mt-2 text-sm text-[#667085]">
                  Enter campaign details, upload the required artwork, and complete payment to start execution.
                </p>
              </article>

              <article className="rounded-[24px] border border-[#dbe5ff] bg-[#f8faff] p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#123bb7] text-sm font-bold text-white">
                  3
                </div>
                <h3 className="mt-3 text-lg font-heading font-bold text-[#101828]">Track Live Reports</h3>
                <p className="mt-2 text-sm text-[#667085]">
                  Monitor execution updates, campaign reports, and field proof once the campaign goes live.
                </p>
              </article>
            </div>
          </section>

          <section className="grid gap-6 md:grid-cols-2">
            {options.map((option) => {
              const Icon = option.icon;

              return (
                <article
                  key={option.title}
                  className={`rounded-[28px] border border-[#e3e8f3] bg-white p-8 shadow-sm transition-all ${
                    option.path ? 'cursor-pointer hover:-translate-y-1 hover:shadow-lg' : ''
                  }`}
                  onClick={option.path ? () => navigate(option.path) : undefined}
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef1ff] text-[#0028aa]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h2 className="text-3xl font-heading font-bold text-[#101828]">{option.title}</h2>
                  <p className="mt-3 text-sm font-body text-[#667085]">{option.description}</p>
                  {option.path ? (
                    <p className="mt-5 text-sm font-semibold text-[#0028aa]">{option.cta || 'Open workflow'}</p>
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

export default FieldAgents;
