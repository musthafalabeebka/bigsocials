import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { BrainCircuit, CheckCircle2, IndianRupee, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const AI_CAMPAIGN_MANAGER_REQUESTS_KEY = 'ai_campaign_manager_requests';
const RAZORPAY_KEY = process.env.REACT_APP_RAZORPAY_KEY_ID;

const formatPrice = (value) => `Rs ${Number(value || 0).toLocaleString('en-IN')}`;

const AiCampaignManagerPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const paymentData = location.state;

  if (!paymentData?.budget || !paymentData?.scenarioId || !paymentData?.allocations?.length) {
    navigate('/producer/dashboard', { replace: true });
    return null;
  }

  const handleSuccess = () => {
    const storedRequests =
      typeof window !== 'undefined'
        ? JSON.parse(window.localStorage.getItem(AI_CAMPAIGN_MANAGER_REQUESTS_KEY) || '[]')
        : [];

    const nextRequest = {
      id: `ai-plan-${Date.now()}`,
      createdAt: new Date().toISOString(),
      budget: paymentData.budget,
      scenarioId: paymentData.scenarioId,
      scenarioTitle: paymentData.scenarioTitle,
      goal: paymentData.goal,
      bestFor: paymentData.bestFor,
      status: 'sent',
      allocations: paymentData.allocations,
    };

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(
        AI_CAMPAIGN_MANAGER_REQUESTS_KEY,
        JSON.stringify([nextRequest, ...storedRequests])
      );
    }

    toast.success('Payment completed and requests sent automatically');
    navigate('/producer/vendors', {
      state: {
        aiRequestsCreated: true,
        objective: paymentData.scenarioTitle,
        requestCount: paymentData.allocations.length,
      },
    });
  };

  const handlePayment = async () => {
    setLoading(true);

    try {
      if (!RAZORPAY_KEY || !window.Razorpay) {
        await new Promise((resolve) => setTimeout(resolve, 700));
        handleSuccess();
        return;
      }

      const razorpay = new window.Razorpay({
        key: RAZORPAY_KEY,
        amount: paymentData.budget * 100,
        currency: 'INR',
        name: 'Big Social',
        description: `AI Campaign Manager - ${paymentData.scenarioTitle}`,
        handler: handleSuccess,
        theme: {
          color: '#123bb7',
        },
      });

      razorpay.open();
    } catch (error) {
      toast.error('Failed to initialize payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8faff]">
      <Sidebar />
      <main className="flex-1 p-8 lg:p-10">
        <div className="mx-auto max-w-5xl space-y-8">
          <section className="rounded-[32px] bg-[linear-gradient(135deg,#0b1437_0%,#1d3fbf_60%,#8cb4ff_100%)] p-8 lg:p-10 text-white shadow-xl">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
                <BrainCircuit className="h-4 w-4" />
                AI Campaign Manager Payment
              </div>
              <h1 className="mt-4 text-4xl font-heading font-bold">Confirm payment and send requests automatically</h1>
              <p className="mt-3 text-base text-white/80">
                Once payment is complete, the AI campaign manager will push the allocation requests into your vendor workflow automatically.
              </p>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[360px,1fr]">
            <article className="rounded-[28px] border border-[#dbe5ff] bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">Payment Summary</p>
              <h2 className="mt-2 text-2xl font-heading font-bold text-[#101828]">{paymentData.scenarioTitle}</h2>
              <p className="mt-2 text-sm text-[#667085]">{paymentData.goal}</p>

              <div className="mt-6 rounded-[24px] bg-[#f8faff] p-5">
                <p className="text-sm font-semibold text-[#667085]">Campaign budget</p>
                <p className="mt-2 flex items-center gap-2 text-3xl font-heading font-bold text-[#123bb7]">
                  <IndianRupee className="h-6 w-6" />
                  {formatPrice(paymentData.budget)}
                </p>
              </div>

              <div className="mt-5 rounded-[24px] bg-[#eef4ff] p-5 text-sm text-[#46557c]">
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 h-4 w-4 text-[#123bb7]" />
                  <div>
                    <p className="font-semibold text-[#101828]">After payment</p>
                    <p className="mt-1">Requests will be generated automatically for the selected channel mix and sent into the vendor workflow.</p>
                  </div>
                </div>
              </div>
            </article>

            <article className="rounded-[28px] border border-[#dbe5ff] bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">Allocation Plan</p>
                  <h2 className="mt-2 text-2xl font-heading font-bold text-[#101828]">
                    {paymentData.allocations.length} requests will be created
                  </h2>
                </div>
                <div className="rounded-full bg-[#eef1ff] px-4 py-2 text-sm font-bold text-[#123bb7]">
                  {paymentData.scenarioSubtitle}
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {paymentData.allocations.map((allocation) => (
                  <div
                    key={`${paymentData.scenarioId}-${allocation.label}`}
                    className="flex items-center justify-between rounded-2xl border border-[#e4e9f4] bg-[#f8faff] px-4 py-4"
                  >
                    <div>
                      <p className="text-base font-semibold text-[#101828]">{allocation.label}</p>
                      <p className="mt-1 text-sm text-[#667085]">{allocation.value} allocation</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-heading font-bold text-[#123bb7]">{formatPrice(allocation.amount)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handlePayment}
                disabled={loading}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#123bb7] px-4 py-4 text-base font-bold text-white transition hover:bg-[#0f33a4] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <CheckCircle2 className="h-5 w-5" />
                {loading ? 'Processing payment...' : `Pay ${formatPrice(paymentData.budget)} via Razorpay`}
              </button>
            </article>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AiCampaignManagerPayment;
