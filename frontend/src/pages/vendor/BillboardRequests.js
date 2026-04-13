import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CalendarDays, CheckCircle2, Clock3, IndianRupee, MapPin, MessageSquareText, PanelsTopLeft, UserRound, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import { BILLBOARD_VENDOR_REQUESTS_STORAGE_KEY, defaultBillboardRequests } from './billboardRequestData';

const formatPrice = (value) => `Rs ${value.toLocaleString('en-IN')}`;
const formatDate = (value) =>
  new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

const BillboardRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState(() => {
    if (typeof window === 'undefined') {
      return defaultBillboardRequests;
    }

    const stored = window.localStorage.getItem(BILLBOARD_VENDOR_REQUESTS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultBillboardRequests;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(BILLBOARD_VENDOR_REQUESTS_STORAGE_KEY, JSON.stringify(requests));
    }
  }, [requests]);

  const pendingRequests = useMemo(() => requests.filter((request) => request.status === 'pending'), [requests]);

  const updateRequestStatus = (requestId, status) => {
    setRequests((current) =>
      current.map((request) =>
        request.id === requestId
          ? {
              ...request,
              status,
              reviewedAt: new Date().toISOString(),
            }
          : request
      )
    );

    toast.success(
      status === 'accepted'
        ? 'Billboard request accepted'
        : 'Billboard request rejected'
    );
  };

  return (
    <div className="flex min-h-screen bg-[#f8faff]">
      <Sidebar />
      <main className="flex-1 p-8 lg:p-10">
        <div className="mx-auto max-w-6xl space-y-8">
          <section className="rounded-[32px] bg-[linear-gradient(135deg,#0b1437_0%,#1d3fbf_60%,#8cb4ff_100%)] p-8 lg:p-10 text-white shadow-xl">
            <button
              type="button"
              onClick={() => navigate('/vendor/dashboard/billboards')}
              className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Billboard Dashboard
            </button>
            <div className="mt-5 max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
                <PanelsTopLeft className="h-4 w-4" />
                Billboard Requests
              </div>
              <h1 className="mt-4 text-4xl font-heading font-bold">Review pending billboard requests</h1>
              <p className="mt-3 text-base font-body text-white/80">
                Check campaign details, requested placements, and artwork notes before accepting or rejecting a brand request.
              </p>
            </div>
          </section>

          <section className="grid gap-6 md:grid-cols-3">
            <article className="rounded-[28px] border border-[#dbe3f3] bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">Pending</p>
              <p className="mt-2 text-4xl font-heading font-bold text-[#101828]">{pendingRequests.length}</p>
              <p className="mt-3 text-sm text-[#667085]">Requests waiting for billboard inventory confirmation.</p>
            </article>
            <article className="rounded-[28px] border border-[#dbe3f3] bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">Accepted</p>
              <p className="mt-2 text-4xl font-heading font-bold text-[#101828]">
                {requests.filter((request) => request.status === 'accepted').length}
              </p>
              <p className="mt-3 text-sm text-[#667085]">Accepted requests are ready to move to brand payment.</p>
            </article>
            <article className="rounded-[28px] border border-[#dbe3f3] bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">Rejected</p>
              <p className="mt-2 text-4xl font-heading font-bold text-[#101828]">
                {requests.filter((request) => request.status === 'rejected').length}
              </p>
              <p className="mt-3 text-sm text-[#667085]">Rejected requests stay available for vendor-side tracking.</p>
            </article>
          </section>

          <section className="space-y-5">
            {requests.map((request) => {
              const isPending = request.status === 'pending';
              const isAccepted = request.status === 'accepted';
              const isRejected = request.status === 'rejected';

              return (
                <article
                  key={request.id}
                  className="rounded-[28px] border border-[#dbe3f3] bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                    <div className="space-y-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a94a6]">
                            {request.campaignName}
                          </p>
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] ${
                              isAccepted
                                ? 'bg-[#e8f7ef] text-[#13804f]'
                                : isRejected
                                  ? 'bg-[#fff0f0] text-[#c23d3d]'
                                  : 'bg-[#eef1ff] text-[#123bb7]'
                            }`}
                          >
                            {request.status}
                          </span>
                        </div>
                        <h2 className="mt-2 text-2xl font-heading font-bold text-[#101828]">
                          {request.billboardTitle}
                        </h2>
                        <p className="mt-2 text-sm text-[#667085]">
                          Requested by {request.producerName}
                        </p>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        <div className="rounded-2xl bg-[#f8faff] p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">Location</p>
                          <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-[#101828]">
                            <MapPin className="h-4 w-4 text-[#123bb7]" />
                            {request.location}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-[#f8faff] p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">Placement</p>
                          <p className="mt-2 text-sm font-semibold text-[#101828]">
                            {request.mediaType} · {request.size}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-[#f8faff] p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">Budget</p>
                          <p className="mt-2 flex items-center gap-1 text-sm font-semibold text-[#101828]">
                            <IndianRupee className="h-4 w-4 text-[#123bb7]" />
                            {formatPrice(request.budget)}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-[#f8faff] p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">Duration</p>
                          <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-[#101828]">
                            <Clock3 className="h-4 w-4 text-[#123bb7]" />
                            {request.requestedDuration}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-[#f8faff] p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">Start Date</p>
                          <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-[#101828]">
                            <CalendarDays className="h-4 w-4 text-[#123bb7]" />
                            {formatDate(request.startDate)}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-[#f8faff] p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">Artwork</p>
                          <p className="mt-2 flex items-center gap-2 break-all text-sm font-semibold text-[#101828]">
                            <UserRound className="h-4 w-4 text-[#123bb7]" />
                            {request.artwork}
                          </p>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-[#dbe3f3] bg-[#f8faff] p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">Brand Notes</p>
                        <p className="mt-2 flex items-start gap-2 text-sm text-[#475467]">
                          <MessageSquareText className="mt-0.5 h-4 w-4 shrink-0 text-[#123bb7]" />
                          <span>{request.notes}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex w-full flex-col gap-3 xl:max-w-[220px]">
                      {isPending ? (
                        <>
                          <Button
                            type="button"
                            onClick={() => updateRequestStatus(request.id, 'accepted')}
                            className="h-12 rounded-2xl bg-[#123bb7] text-base font-semibold text-white hover:bg-[#0f33a4]"
                          >
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Accept Request
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => updateRequestStatus(request.id, 'rejected')}
                            className="h-12 rounded-2xl border-[#d0d8ea] text-base font-semibold text-[#101828] hover:bg-[#f8faff]"
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Reject Request
                          </Button>
                        </>
                      ) : (
                        <div
                          className={`rounded-2xl px-4 py-5 text-sm font-semibold ${
                            isAccepted ? 'bg-[#e8f7ef] text-[#13804f]' : 'bg-[#fff0f0] text-[#c23d3d]'
                          }`}
                        >
                          {isAccepted
                            ? 'Request accepted. Brand team can now proceed to payment.'
                            : 'Request rejected. This placement remains unavailable for this campaign.'}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        </div>
      </main>
    </div>
  );
};

export default BillboardRequests;
