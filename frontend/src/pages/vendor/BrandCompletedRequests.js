import React, { useMemo, useState } from 'react';
import { ArrowLeft, CalendarDays, CircleDollarSign, ClipboardCheck, IndianRupee, MapPin, Handshake } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { BRAND_VENDOR_REQUESTS_STORAGE_KEY, defaultBrandRequests } from './brandRequestData';

const formatPrice = (value) => `Rs ${value.toLocaleString('en-IN')}`;
const formatDate = (value) =>
  new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

const BrandCompletedRequests = () => {
  const navigate = useNavigate();
  const [requests] = useState(() => {
    if (typeof window === 'undefined') {
      return defaultBrandRequests;
    }

    const stored = window.localStorage.getItem(BRAND_VENDOR_REQUESTS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultBrandRequests;
  });

  const completedRequests = useMemo(() => requests.filter((request) => request.status === 'completed'), [requests]);
  const totalEarnings = useMemo(() => completedRequests.reduce((sum, request) => sum + request.budget, 0), [completedRequests]);

  return (
    <div className="flex min-h-screen bg-[#f8faff]">
      <Sidebar />
      <main className="flex-1 p-8 lg:p-10">
        <div className="mx-auto max-w-6xl space-y-8">
          <section className="rounded-[32px] bg-[linear-gradient(135deg,#0b1437_0%,#1d3fbf_60%,#8cb4ff_100%)] p-8 lg:p-10 text-white shadow-xl">
            <button
              type="button"
              onClick={() => navigate('/vendor/dashboard/brands')}
              className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Brands Dashboard
            </button>
            <div className="mt-5 max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
                <Handshake className="h-4 w-4" />
                Brand Earnings
              </div>
              <h1 className="mt-4 text-4xl font-heading font-bold">Completed brand requests and payments received</h1>
              <p className="mt-3 text-base font-body text-white/80">
                Track closed brand collaborations, total earnings, and payment dates for completed deals.
              </p>
            </div>
          </section>

          <section className="grid gap-6 md:grid-cols-3">
            <article className="rounded-[28px] border border-[#dbe3f3] bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">Total Earnings</p>
              <p className="mt-2 text-4xl font-heading font-bold text-[#101828]">{formatPrice(totalEarnings)}</p>
              <p className="mt-3 text-sm text-[#667085]">Total payments received across completed brand collaborations.</p>
            </article>
            <article className="rounded-[28px] border border-[#dbe3f3] bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">Completed Requests</p>
              <p className="mt-2 text-4xl font-heading font-bold text-[#101828]">{completedRequests.length}</p>
              <p className="mt-3 text-sm text-[#667085]">Brand requests fully accepted, paid, and closed out.</p>
            </article>
            <article className="rounded-[28px] border border-[#dbe3f3] bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">Latest Payment</p>
              <p className="mt-2 text-4xl font-heading font-bold text-[#101828]">
                {completedRequests[0]?.paymentReceivedAt ? formatDate(completedRequests[0].paymentReceivedAt) : 'N/A'}
              </p>
              <p className="mt-3 text-sm text-[#667085]">Most recent payment receipt date for completed brand campaigns.</p>
            </article>
          </section>

          <section className="space-y-5">
            {completedRequests.map((request) => (
              <article key={request.id} className="rounded-[28px] border border-[#dbe3f3] bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                  <div className="space-y-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a94a6]">{request.campaignName}</p>
                        <span className="inline-flex items-center rounded-full bg-[#e8f7ef] px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#13804f]">
                          completed
                        </span>
                      </div>
                      <h2 className="mt-2 text-2xl font-heading font-bold text-[#101828]">{request.placementTitle}</h2>
                      <p className="mt-2 text-sm text-[#667085]">{request.producerName}</p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      <div className="rounded-2xl bg-[#f8faff] p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">Region</p>
                        <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-[#101828]">
                          <MapPin className="h-4 w-4 text-[#123bb7]" />
                          {request.location}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-[#f8faff] p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">Deliverables</p>
                        <p className="mt-2 text-sm font-semibold text-[#101828]">{request.placement}</p>
                      </div>
                      <div className="rounded-2xl bg-[#f8faff] p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">Payment Received</p>
                        <p className="mt-2 flex items-center gap-1 text-sm font-semibold text-[#101828]">
                          <CircleDollarSign className="h-4 w-4 text-[#123bb7]" />
                          {formatPrice(request.budget)}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-[#f8faff] p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">Paid On</p>
                        <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-[#101828]">
                          <CalendarDays className="h-4 w-4 text-[#123bb7]" />
                          {request.paymentReceivedAt ? formatDate(request.paymentReceivedAt) : 'Awaiting'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full xl:max-w-[240px]">
                    <div className="rounded-[24px] bg-[#eef4ff] p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">Request Summary</p>
                      <div className="mt-4 space-y-3 text-sm text-[#475467]">
                        <div className="flex items-center gap-2">
                          <ClipboardCheck className="h-4 w-4 text-[#123bb7]" />
                          {request.requestedDuration}
                        </div>
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-[#123bb7]" />
                          Started {formatDate(request.startDate)}
                        </div>
                        <div className="flex items-center gap-2">
                          <IndianRupee className="h-4 w-4 text-[#123bb7]" />
                          Closed at {formatPrice(request.budget)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
};

export default BrandCompletedRequests;
