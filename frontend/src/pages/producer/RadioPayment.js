import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Button from '../../components/Button';
import { toast } from 'sonner';

const RAZORPAY_KEY = process.env.REACT_APP_RAZORPAY_KEY_ID;
const useMockPayment = !RAZORPAY_KEY;
const RADIO_CAMPAIGNS_STORAGE_KEY = 'radio_media_campaigns';

const persistCampaign = (campaign) => {
  if (typeof window === 'undefined') {
    return;
  }

  const raw = window.localStorage.getItem(RADIO_CAMPAIGNS_STORAGE_KEY);
  const existing = raw ? JSON.parse(raw) : [];
  window.localStorage.setItem(RADIO_CAMPAIGNS_STORAGE_KEY, JSON.stringify([campaign, ...existing]));
};

const RadioPayment = () => {
  const locationState = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    stationName,
    band,
    location,
    listenerReach,
    campaignName,
    slotName,
    timing,
    placement,
    price,
  } = locationState.state || {};

  const createCampaignRecord = () => ({
    id: `radio-${Date.now()}`,
    campaignName: campaignName || `${stationName || 'Radio'} Campaign`,
    stationName,
    band,
    location,
    listenerReach,
    slotName,
    timing,
    placement,
    price,
    status: 'Live',
    deliveredSpots: 0,
    reportSummary: 'Campaign has been booked and is now live. Delivery reports will populate as the radio spots run.',
  });

  const handlePayment = async () => {
    setLoading(true);

    try {
      if (useMockPayment) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        persistCampaign(createCampaignRecord());
        toast.success('Mock Razorpay payment successful for radio booking.');
        navigate('/producer/vendors/media/radio');
        return;
      }

      const options = {
        key: RAZORPAY_KEY,
        amount: Math.round((price || 0) * 100),
        currency: 'INR',
        name: 'Big Social',
        description: 'Radio Booking Payment',
        handler: async function () {
          persistCampaign(createCampaignRecord());
          toast.success('Razorpay payment successful for radio booking.');
          navigate('/producer/vendors/media/radio');
        },
        theme: {
          color: '#0028aa',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error('Failed to initialize Razorpay payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <div className="flex-1">
        <div className="border-b border-outline-variant/20 bg-surface-container-lowest p-8">
          <h1 className="mb-2 text-4xl font-heading font-bold text-on-surface">Making Payment with Razorpay</h1>
          <p className="text-lg font-body text-muted-foreground">
            Complete payment for your radio booking
          </p>
        </div>

        <div className="mx-auto max-w-3xl p-8">
          <div className="rounded-DEFAULT bg-surface-container-lowest p-8 shadow-ambient-lg">
            <h2 className="mb-6 text-2xl font-heading font-bold">Payment Summary</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-surface-container-low p-4">
                <span className="font-body text-muted-foreground">Radio Station</span>
                <span className="font-semibold">{stationName || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-surface-container-low p-4">
                <span className="font-body text-muted-foreground">Band</span>
                <span className="font-semibold">{band || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-surface-container-low p-4">
                <span className="font-body text-muted-foreground">Location</span>
                <span className="font-semibold">{location || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-surface-container-low p-4">
                <span className="font-body text-muted-foreground">Listener Reach</span>
                <span className="font-semibold">{listenerReach?.toLocaleString('en-IN') || 0}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-surface-container-low p-4">
                <span className="font-body text-muted-foreground">Ad Slot</span>
                <span className="font-semibold">{slotName || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-surface-container-low p-4">
                <span className="font-body text-muted-foreground">Broadcast Timing</span>
                <span className="font-semibold">{timing || 'N/A'}</span>
              </div>
              <div className="rounded-lg bg-surface-container-low p-4">
                <p className="font-body text-muted-foreground">Program Placement</p>
                <p className="mt-2 font-medium text-on-surface">{placement || 'N/A'}</p>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-primary/10 p-4">
                <span className="font-body font-semibold text-on-surface">Total Cost</span>
                <span className="font-mono text-2xl font-bold text-on-surface">
                  ₹{Number(price || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {useMockPayment ? (
              <div className="mb-8 mt-8 rounded-lg border-2 border-warning bg-warning/10 p-4">
                <p className="text-sm font-body text-muted-foreground">
                  Mock payment mode is active. Razorpay keys are not configured in this project copy,
                  so the payment will be simulated.
                </p>
              </div>
            ) : null}

            <div className="mt-8 flex gap-4">
              <Button variant="secondary" size="lg" onClick={() => navigate(-1)} className="flex-1">
                Back
              </Button>
              <Button variant="primary" size="lg" onClick={handlePayment} disabled={loading} className="flex-1">
                {loading ? 'Processing...' : `Pay ₹${Number(price || 0).toLocaleString('en-IN')} via Razorpay`}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadioPayment;
