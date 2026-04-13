import React, { useMemo, useState } from 'react';
import { ArrowLeft, CalendarDays, CheckCircle2, IndianRupee, MapPin, Users, Wallet, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { Button } from '../../components/ui/button';

const pendingAmbassadorGigs = [
  {
    id: 'ambassador-gig-1',
    campaignName: 'Neighborhood Awareness Drive',
    network: 'Kudumbasree',
    location: 'Kannur, Kozhikode, Malappuram',
    audience: 'Family and community audience',
    deliverables: 'Poster circulation, WhatsApp group sharing, local market conversations',
    duration: '10 days',
    budget: 50000,
    startDate: '2026-04-18',
    status: 'pending',
  },
  {
    id: 'ambassador-gig-2',
    campaignName: 'Campus Reel Sprint',
    network: 'Students',
    location: 'Kochi, Kottayam, Thrissur',
    audience: 'Youth and college audience',
    deliverables: 'Reel shares, campus poster placements, student group amplification',
    duration: '14 days',
    budget: 125000,
    startDate: '2026-04-22',
    status: 'pending',
  },
  {
    id: 'ambassador-gig-3',
    campaignName: 'Local Market Recall Push',
    network: 'Kudumbasree',
    location: 'Palakkad, Alappuzha, Kollam',
    audience: 'Local retail and household audience',
    deliverables: 'Market visits, notice circulation, community member referrals',
    duration: '12 days',
    budget: 75000,
    startDate: '2026-04-25',
    status: 'pending',
  },
];

const ambassadorEarnings = [
  {
    id: 'earning-ambassador-1',
    campaignName: 'Village Poster Push',
    network: 'Kudumbasree',
    location: 'Kannur, Kozhikode, Malappuram',
    audience: 'Family and community audience',
    deliverables: 'Poster circulation and community sharing',
    duration: '12 days',
    budget: 60000,
    startDate: '2026-04-06',
    status: 'completed',
    achievedViews: '148,000',
    activeMembers: 86,
    paidOn: '2026-04-12',
  },
  {
    id: 'earning-ambassador-2',
    campaignName: 'College Reel Sprint',
    network: 'Students',
    location: 'Kozhikode, Kannur, Trivandrum',
    audience: 'Youth and college audience',
    deliverables: 'Student reel sharing and campus circulation',
    duration: '14 days',
    budget: 125000,
    startDate: '2026-04-08',
    status: 'completed',
    achievedViews: '356,000',
    activeMembers: 142,
    paidOn: '2026-04-11',
  },
];

const formatPrice = (value) => `Rs ${Number(value || 0).toLocaleString('en-IN')}`;
const formatDate = (value) =>
  new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

const AmbassadorVendorGigs = ({ mode = 'requests' }) => {
  const navigate = useNavigate();
  const isEarningsMode = mode === 'earnings';
  const [gigs, setGigs] = useState(isEarningsMode ? ambassadorEarnings : pendingAmbassadorGigs);
  const [withdrawRequested, setWithdrawRequested] = useState(false);

  const stats = useMemo(() => {
    const totalBudget = gigs.reduce((sum, gig) => sum + Number(gig.budget || 0), 0);
    return {
      count: gigs.length,
      totalBudget,
      liveCount: gigs.filter((gig) => gig.status === 'completed' || gig.status === 'accepted').length,
    };
  }, [gigs]);

  const updateGigStatus = (gigId, status) => {
    setGigs((current) =>
      current.map((gig) =>
        gig.id === gigId
          ? { ...gig, status, reviewedAt: new Date().toISOString() }
          : gig
      )
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
              onClick={() => navigate('/vendor/dashboard/ambassadors')}
              className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Ambassador Dashboard
            </button>
            <div className="mt-5 max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
                {isEarningsMode ? <Wallet className="h-4 w-4" /> : <Users className="h-4 w-4" />}
                {isEarningsMode ? 'Ambassador Earnings' : 'Ambassador Requests'}
              </div>
              <h1 className="mt-4 text-4xl font-heading font-bold">
                {isEarningsMode ? 'Review ambassador earnings and withdraw money' : 'Review available ambassador gigs'}
              </h1>
              <p className="mt-3 text-base font-body text-white/80">
                {isEarningsMode
                  ? 'Track completed Kudumbasree and student ambassador campaign earnings, payment dates, and withdrawal status.'
                  : 'Open available Kudumbasree and student ambassador gigs, then accept or reject assignments.'}
              </p>
              {isEarningsMode ? (
                <Button
                  type="button"
                  onClick={() => setWithdrawRequested(true)}
                  className="mt-6 bg-white text-[#0028aa] hover:bg-[#eef4ff]"
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  Withdraw Money
                </Button>
              ) : null}
            </div>
          </section>

          {withdrawRequested ? (
            <section className="rounded-[24px] border border-[#bbf7d0] bg-[#f0fdf4] p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#15803d]">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-heading font-bold text-[#101828]">Withdrawal request created</h2>
                  <p className="mt-1 text-sm text-[#667085]">
                    {formatPrice(stats.totalBudget)} has been marked for payout review.
                  </p>
                </div>
              </div>
            </section>
          ) : null}

          <section className="grid gap-6 md:grid-cols-3">
            <article className="rounded-[28px] border border-[#dbe3f3] bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">
                {isEarningsMode ? 'Completed campaigns' : 'Available gigs'}
              </p>
              <p className="mt-2 text-4xl font-heading font-bold text-[#101828]">{stats.count}</p>
              <p className="mt-3 text-sm text-[#667085]">
                {isEarningsMode ? 'Campaigns eligible for payout.' : 'Gigs waiting for assignment.'}
              </p>
            </article>
            <article className="rounded-[28px] border border-[#dbe3f3] bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">
                {isEarningsMode ? 'Total earnings' : 'Total value'}
              </p>
              <p className="mt-2 text-4xl font-heading font-bold text-[#101828]">{formatPrice(stats.totalBudget)}</p>
              <p className="mt-3 text-sm text-[#667085]">
                {isEarningsMode ? 'Amount available for withdrawal.' : 'Combined campaign budget value.'}
              </p>
            </article>
            <article className="rounded-[28px] border border-[#dbe3f3] bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">
                {isEarningsMode ? 'Withdrawal status' : 'Accepted'}
              </p>
              <p className="mt-2 text-4xl font-heading font-bold text-[#101828]">
                {isEarningsMode ? (withdrawRequested ? 'Requested' : 'Ready') : stats.liveCount}
              </p>
              <p className="mt-3 text-sm text-[#667085]">
                {isEarningsMode ? 'Use Withdraw Money to request payout.' : 'Accepted ambassador assignments.'}
              </p>
            </article>
          </section>

          <section className="space-y-5">
            {gigs.map((gig) => {
              const isPending = gig.status === 'pending';
              const isAccepted = gig.status === 'accepted';
              const isRejected = gig.status === 'rejected';

              return (
                <article key={gig.id} className="rounded-[28px] border border-[#dbe3f3] bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                    <div className="space-y-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a94a6]">
                            {gig.network}
                          </p>
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] ${
                              isRejected
                                ? 'bg-[#fff0f0] text-[#c23d3d]'
                                : isAccepted || gig.status === 'live'
                                  ? 'bg-[#e8f7ef] text-[#13804f]'
                                  : 'bg-[#eef1ff] text-[#123bb7]'
                            }`}
                          >
                            {gig.status}
                          </span>
                        </div>
                        <h2 className="mt-2 text-2xl font-heading font-bold text-[#101828]">{gig.campaignName}</h2>
                        <p className="mt-2 text-sm text-[#667085]">{gig.audience}</p>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-2xl bg-[#f8faff] p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">Locations</p>
                          <p className="mt-2 flex items-start gap-2 text-sm font-semibold text-[#101828]">
                            <MapPin className="mt-0.5 h-4 w-4 text-[#123bb7]" />
                            {gig.location}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-[#f8faff] p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">Deliverables</p>
                          <p className="mt-2 text-sm font-semibold text-[#101828]">{gig.deliverables}</p>
                        </div>
                        <div className="rounded-2xl bg-[#f8faff] p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">Budget</p>
                          <p className="mt-2 flex items-center gap-1 text-sm font-semibold text-[#101828]">
                            <IndianRupee className="h-4 w-4 text-[#123bb7]" />
                            {formatPrice(gig.budget)}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-[#f8faff] p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">Start Date</p>
                          <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-[#101828]">
                            <CalendarDays className="h-4 w-4 text-[#123bb7]" />
                            {formatDate(gig.startDate)}
                          </p>
                        </div>
                      </div>

                      {isEarningsMode ? (
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="rounded-2xl border border-[#dbe3f3] bg-[#f8faff] p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">Achieved Views</p>
                            <p className="mt-2 text-2xl font-heading font-bold text-[#0028aa]">{gig.achievedViews}</p>
                          </div>
                          <div className="rounded-2xl border border-[#dbe3f3] bg-[#f8faff] p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">Paid On</p>
                            <p className="mt-2 text-2xl font-heading font-bold text-[#0028aa]">{formatDate(gig.paidOn)}</p>
                          </div>
                        </div>
                      ) : null}
                    </div>

                    {!isEarningsMode ? (
                      <div className="flex w-full flex-col gap-3 xl:max-w-[220px]">
                        {isPending ? (
                          <>
                            <Button
                              type="button"
                              onClick={() => updateGigStatus(gig.id, 'accepted')}
                              className="h-12 rounded-2xl bg-[#123bb7] text-base font-semibold text-white hover:bg-[#0f33a4]"
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Accept Gig
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => updateGigStatus(gig.id, 'rejected')}
                              className="h-12 rounded-2xl border-[#d0d8ea] text-base font-semibold text-[#101828] hover:bg-[#f8faff]"
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject Gig
                            </Button>
                          </>
                        ) : (
                          <div
                            className={`rounded-2xl px-4 py-5 text-sm font-semibold ${
                              isAccepted ? 'bg-[#e8f7ef] text-[#13804f]' : 'bg-[#fff0f0] text-[#c23d3d]'
                            }`}
                          >
                            {isAccepted
                              ? 'Gig accepted. This assignment is ready for campaign coordination.'
                              : 'Gig rejected. This assignment is no longer active for your team.'}
                          </div>
                        )}
                      </div>
                    ) : null}
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

export default AmbassadorVendorGigs;
