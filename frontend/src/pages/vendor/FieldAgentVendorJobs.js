import React, { useMemo, useState } from 'react';
import { ArrowLeft, CalendarDays, CheckCircle2, Clock3, FileCheck2, IndianRupee, MapPin, UploadCloud, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { Button } from '../../components/ui/button';

const executionJobs = [
  {
    id: 'field-job-1',
    campaignName: 'Tea Cup Branding Drive',
    brandName: 'FreshSip Beverages',
    jobType: 'Tea cup marketing',
    location: 'Kochi, Ernakulam',
    deliverables: 'Place branded cups across 45 tea shops and collect shop photos.',
    quantity: '18,000 cups',
    budget: 78000,
    dueDate: '2026-04-21',
    status: 'pending',
  },
  {
    id: 'field-job-2',
    campaignName: 'Retail Notice Push',
    brandName: 'Nexa Home Care',
    jobType: 'Notice distribution',
    location: 'Kozhikode, Kannur',
    deliverables: 'Door-to-door notice distribution with route proof and completion photos.',
    quantity: '32,000 notices',
    budget: 96000,
    dueDate: '2026-04-24',
    status: 'pending',
  },
  {
    id: 'field-job-3',
    campaignName: 'Tea Shop Board Install',
    brandName: 'MobiPay',
    jobType: 'Tea shop boards',
    location: 'Thrissur, Palakkad',
    deliverables: 'Install branded boards at selected tea shops and upload shop-owner confirmation.',
    quantity: '120 boards',
    budget: 132000,
    dueDate: '2026-04-27',
    status: 'pending',
  },
];

const reportingTasks = [
  {
    id: 'field-report-1',
    campaignName: 'Summer Cup Recall',
    brandName: 'AquaFizz',
    jobType: 'Tea cup marketing',
    location: 'Kottayam, Alappuzha',
    deliverables: 'Upload shop photos, cup placement count, and supervisor notes.',
    quantity: '24,000 cups placed',
    budget: 88000,
    dueDate: '2026-04-15',
    status: 'report pending',
  },
  {
    id: 'field-report-2',
    campaignName: 'Neighborhood Offer Drop',
    brandName: 'Daily Basket',
    jobType: 'Notice distribution',
    location: 'Trivandrum',
    deliverables: 'Submit route sheet, locality photos, and completion summary.',
    quantity: '41,000 notices distributed',
    budget: 118000,
    dueDate: '2026-04-16',
    status: 'report pending',
  },
  {
    id: 'field-report-3',
    campaignName: 'Local Retail Visibility',
    brandName: 'PayPort',
    jobType: 'Tea shop boards',
    location: 'Malappuram, Palakkad',
    deliverables: 'Upload installation proof, board count, and shop list.',
    quantity: '95 boards installed',
    budget: 104000,
    dueDate: '2026-04-18',
    status: 'report pending',
  },
];

const formatPrice = (value) => `Rs ${Number(value || 0).toLocaleString('en-IN')}`;
const formatDate = (value) =>
  new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

const FieldAgentVendorJobs = ({ mode = 'execution' }) => {
  const navigate = useNavigate();
  const isReportingMode = mode === 'reports';
  const [jobs, setJobs] = useState(isReportingMode ? reportingTasks : executionJobs);

  const stats = useMemo(() => {
    const totalBudget = jobs.reduce((sum, job) => sum + Number(job.budget || 0), 0);
    return {
      count: jobs.length,
      totalBudget,
      completed: jobs.filter((job) => job.status === 'accepted' || job.status === 'submitted').length,
    };
  }, [jobs]);

  const updateJobStatus = (jobId, status) => {
    setJobs((current) =>
      current.map((job) =>
        job.id === jobId
          ? { ...job, status, reviewedAt: new Date().toISOString() }
          : job
      )
    );
  };

  return (
    <div className="flex min-h-screen bg-[#f8faff]">
      <Sidebar />
      <main className="flex-1 p-8 lg:p-10">
        <div className="mx-auto max-w-6xl space-y-8">
          <section className="rounded-[32px] bg-[linear-gradient(135deg,#0b1437_0%,#1d3fbf_60%,#8cb4ff_100%)] p-8 text-white shadow-xl lg:p-10">
            <button
              type="button"
              onClick={() => navigate('/vendor/dashboard/field-agents')}
              className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Field Agents Dashboard
            </button>
            <div className="mt-5 max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
                {isReportingMode ? <FileCheck2 className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                {isReportingMode ? 'Reporting Tasks' : 'Execution Jobs'}
              </div>
              <h1 className="mt-4 text-4xl font-heading font-bold">
                {isReportingMode ? 'Submit campaign proof and live reports' : 'Review field execution jobs'}
              </h1>
              <p className="mt-3 text-base font-body text-white/80">
                {isReportingMode
                  ? 'Complete pending reporting tasks for tea cup, notice, and tea shop board campaigns.'
                  : 'Accept available tea cup, notice, and tea shop board field execution jobs.'}
              </p>
            </div>
          </section>

          <section className="grid gap-6 md:grid-cols-3">
            <article className="rounded-[28px] border border-[#dbe3f3] bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">
                {isReportingMode ? 'Pending reports' : 'Available jobs'}
              </p>
              <p className="mt-2 text-4xl font-heading font-bold text-[#101828]">{stats.count}</p>
              <p className="mt-3 text-sm text-[#667085]">
                {isReportingMode ? 'Reports waiting for proof upload.' : 'Jobs waiting for vendor confirmation.'}
              </p>
            </article>
            <article className="rounded-[28px] border border-[#dbe3f3] bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">Total value</p>
              <p className="mt-2 text-4xl font-heading font-bold text-[#101828]">{formatPrice(stats.totalBudget)}</p>
              <p className="mt-3 text-sm text-[#667085]">Combined value across listed field jobs.</p>
            </article>
            <article className="rounded-[28px] border border-[#dbe3f3] bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">
                {isReportingMode ? 'Submitted' : 'Accepted'}
              </p>
              <p className="mt-2 text-4xl font-heading font-bold text-[#101828]">{stats.completed}</p>
              <p className="mt-3 text-sm text-[#667085]">
                {isReportingMode ? 'Reports submitted for brand review.' : 'Jobs confirmed for execution.'}
              </p>
            </article>
          </section>

          <section className="space-y-5">
            {jobs.map((job) => {
              const isPending = job.status === 'pending' || job.status === 'report pending';
              const isAccepted = job.status === 'accepted' || job.status === 'submitted';
              const isRejected = job.status === 'rejected';

              return (
                <article key={job.id} className="rounded-[28px] border border-[#dbe3f3] bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                    <div className="space-y-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a94a6]">
                            {job.jobType}
                          </p>
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] ${
                              isRejected
                                ? 'bg-[#fff0f0] text-[#c23d3d]'
                                : isAccepted
                                  ? 'bg-[#e8f7ef] text-[#13804f]'
                                  : 'bg-[#eef1ff] text-[#123bb7]'
                            }`}
                          >
                            {job.status}
                          </span>
                        </div>
                        <h2 className="mt-2 text-2xl font-heading font-bold text-[#101828]">{job.campaignName}</h2>
                        <p className="mt-2 text-sm text-[#667085]">Requested by {job.brandName}</p>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-2xl bg-[#f8faff] p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">Location</p>
                          <p className="mt-2 flex items-start gap-2 text-sm font-semibold text-[#101828]">
                            <MapPin className="mt-0.5 h-4 w-4 text-[#123bb7]" />
                            {job.location}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-[#f8faff] p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">Scope</p>
                          <p className="mt-2 text-sm font-semibold text-[#101828]">{job.quantity}</p>
                        </div>
                        <div className="rounded-2xl bg-[#f8faff] p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">Value</p>
                          <p className="mt-2 flex items-center gap-1 text-sm font-semibold text-[#101828]">
                            <IndianRupee className="h-4 w-4 text-[#123bb7]" />
                            {formatPrice(job.budget)}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-[#f8faff] p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">Due Date</p>
                          <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-[#101828]">
                            <CalendarDays className="h-4 w-4 text-[#123bb7]" />
                            {formatDate(job.dueDate)}
                          </p>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-[#dbe3f3] bg-[#f8faff] p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">
                          {isReportingMode ? 'Report Requirement' : 'Execution Brief'}
                        </p>
                        <p className="mt-2 flex items-start gap-2 text-sm text-[#475467]">
                          <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-[#123bb7]" />
                          <span>{job.deliverables}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex w-full flex-col gap-3 xl:max-w-[220px]">
                      {isPending ? (
                        isReportingMode ? (
                          <Button
                            type="button"
                            onClick={() => updateJobStatus(job.id, 'submitted')}
                            className="h-12 rounded-2xl bg-[#123bb7] text-base font-semibold text-white hover:bg-[#0f33a4]"
                          >
                            <UploadCloud className="mr-2 h-4 w-4" />
                            Submit Report
                          </Button>
                        ) : (
                          <>
                            <Button
                              type="button"
                              onClick={() => updateJobStatus(job.id, 'accepted')}
                              className="h-12 rounded-2xl bg-[#123bb7] text-base font-semibold text-white hover:bg-[#0f33a4]"
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Accept Job
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => updateJobStatus(job.id, 'rejected')}
                              className="h-12 rounded-2xl border-[#d0d8ea] text-base font-semibold text-[#101828] hover:bg-[#f8faff]"
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject Job
                            </Button>
                          </>
                        )
                      ) : (
                        <div
                          className={`rounded-2xl px-4 py-5 text-sm font-semibold ${
                            isRejected ? 'bg-[#fff0f0] text-[#c23d3d]' : 'bg-[#e8f7ef] text-[#13804f]'
                          }`}
                        >
                          {isReportingMode
                            ? 'Report submitted. Brand team can review campaign proof.'
                            : isRejected
                              ? 'Job rejected. It remains unassigned.'
                              : 'Job accepted. Prepare field execution and reporting.'}
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

export default FieldAgentVendorJobs;
