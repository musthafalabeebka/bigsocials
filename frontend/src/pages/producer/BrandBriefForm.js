import React, { useMemo, useState } from 'react';
import { ArrowLeft, BadgeIndianRupee } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { Button } from '../../components/ui/button';
import { BRAND_BRIEFS_STORAGE_KEY, biddingOpportunities } from './Brands';

const getStoredBriefs = () => {
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

const BrandBriefForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const opportunitySlug = searchParams.get('opportunity') || '';

  const selectedOpportunity = useMemo(
    () => biddingOpportunities.find((item) => item.slug === opportunitySlug) || biddingOpportunities[0],
    [opportunitySlug]
  );

  const [form, setForm] = useState({
    movieName: '',
    starCast: '',
    expectedReach: '',
    deliverables: '',
    basePrice: '',
    deadline: '',
  });

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const publishBrief = () => {
    const nextBrief = {
      id: `brand-brief-${Date.now()}`,
      opportunitySlug: selectedOpportunity.slug,
      opportunityTitle: selectedOpportunity.title,
      ...form,
    };

    const existing = getStoredBriefs();
    window.localStorage.setItem(
      BRAND_BRIEFS_STORAGE_KEY,
      JSON.stringify([nextBrief, ...existing])
    );

    navigate('/producer/vendors/brands');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex">
      <Sidebar />
      <main className="flex-1 p-8 lg:p-10">
        <div className="max-w-4xl mx-auto space-y-8">
          <section className="rounded-[32px] bg-[linear-gradient(135deg,#0b1437_0%,#1d3fbf_60%,#8cb4ff_100%)] p-8 lg:p-10 text-white shadow-xl">
            <button
              type="button"
              onClick={() => navigate('/producer/vendors/brands')}
              className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Brands
            </button>

            <div className="mt-5 max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
                <BadgeIndianRupee className="h-4 w-4" />
                Enter Brief
              </div>
              <h1 className="mt-4 text-4xl font-heading font-bold">{selectedOpportunity.title}</h1>
              <p className="mt-3 text-base font-body text-white/80">
                Fill in the commercial details below. Once submitted, the bidding goes live and campaign teams can track incoming brand bids.
              </p>
            </div>
          </section>

          <section className="rounded-[32px] border border-[#ece7f6] bg-white p-8 shadow-sm">
            <div className="grid gap-6 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-[#101828]">Brand name</span>
                <input
                  value={form.movieName}
                  onChange={(event) => updateField('movieName', event.target.value)}
                  className="w-full rounded-2xl border border-[#e7eaf2] bg-[#f8fbff] px-4 py-3 outline-none focus:border-[#0028aa]"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-[#101828]">Partners / creators</span>
                <input
                  value={form.starCast}
                  onChange={(event) => updateField('starCast', event.target.value)}
                  className="w-full rounded-2xl border border-[#e7eaf2] bg-[#f8fbff] px-4 py-3 outline-none focus:border-[#0028aa]"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-[#101828]">Expected reach</span>
                <input
                  value={form.expectedReach}
                  onChange={(event) => updateField('expectedReach', event.target.value)}
                  placeholder="Example: 25M audience impressions"
                  className="w-full rounded-2xl border border-[#e7eaf2] bg-[#f8fbff] px-4 py-3 outline-none focus:border-[#0028aa]"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-[#101828]">Base price / minimum bid</span>
                <input
                  value={form.basePrice}
                  onChange={(event) => updateField('basePrice', event.target.value)}
                  placeholder="Example: 3500000"
                  className="w-full rounded-2xl border border-[#e7eaf2] bg-[#f8fbff] px-4 py-3 outline-none focus:border-[#0028aa]"
                />
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-semibold text-[#101828]">Deliverables</span>
                <textarea
                  value={form.deliverables}
                  onChange={(event) => updateField('deliverables', event.target.value)}
                  placeholder='Example: logo in 3 creator videos, 2 launch integrations, co-branded event mention'
                  className="min-h-[140px] w-full rounded-2xl border border-[#e7eaf2] bg-[#f8fbff] px-4 py-3 outline-none focus:border-[#0028aa]"
                />
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-semibold text-[#101828]">Deadline</span>
                <input
                  type="date"
                  value={form.deadline}
                  onChange={(event) => updateField('deadline', event.target.value)}
                  className="w-full rounded-2xl border border-[#e7eaf2] bg-[#f8fbff] px-4 py-3 outline-none focus:border-[#0028aa]"
                />
              </label>
            </div>

            <div className="mt-8 flex justify-end">
              <Button className="bg-[#0028aa] text-white hover:bg-[#001f85]" onClick={publishBrief}>
                Publish Bidding Live
              </Button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default BrandBriefForm;
