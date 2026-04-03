import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Button from '../../components/Button';
import { toast } from 'sonner';

const RAZORPAY_KEY = process.env.REACT_APP_RAZORPAY_KEY_ID;
const useMockPayment = !RAZORPAY_KEY;
const NEWSPAPER_CAMPAIGNS_STORAGE_KEY = 'newspaper_media_campaigns';

const persistCampaign = (campaign) => {
  if (typeof window === 'undefined') {
    return;
  }

  const raw = window.localStorage.getItem(NEWSPAPER_CAMPAIGNS_STORAGE_KEY);
  const existing = raw ? JSON.parse(raw) : [];
  window.localStorage.setItem(NEWSPAPER_CAMPAIGNS_STORAGE_KEY, JSON.stringify([campaign, ...existing]));
};

const NewspaperPayment = () => {
  const locationState = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    campaignName,
    newspaperName,
    language,
    location,
    estimatedViewership,
    placementName,
    size,
    placement,
    price,
  } = locationState.state || {};

  const createCampaignRecord = () => ({
    id: `newspaper-${Date.now()}`,
    campaignName: campaignName || `${newspaperName || 'Newspaper'} Campaign`,
    newspaperName,
    language,
    location,
    estimatedViewership,
    placementName,
    size,
    placement,
    price,
    status: 'Live',
    insertionCount: 1,
    reportSummary: 'Campaign has been booked and is now live. Placement reporting will update as insertions are delivered.',
  });

  const handlePayment = async () => {
    setLoading(true);

    try {
      if (useMockPayment) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        persistCampaign(createCampaignRecord());
        toast.success('Mock Razorpay payment successful for newspaper placement.');
        navigate('/producer/vendors/media/newspapers');
        return;
      }

      const options = {
        key: RAZORPAY_KEY,
        amount: Math.round((price || 0) * 100),
        currency: 'INR',
        name: 'Big Social',
        description: 'Newspaper Placement Payment',
        handler: async function () {
          persistCampaign(createCampaignRecord());
          toast.success('Razorpay payment successful for newspaper placement.');
          navigate('/producer/vendors/media/newspapers');
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
            Complete payment for your newspaper placement
          </p>
        </div>

        <div className="mx-auto max-w-3xl p-8">
          <div className="rounded-DEFAULT bg-surface-container-lowest p-8 shadow-ambient-lg">
            <h2 className="mb-6 text-2xl font-heading font-bold">Payment Summary</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-surface-container-low p-4">
                <span className="font-body text-muted-foreground">Newspaper</span>
                <span className="font-semibold">{newspaperName || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-surface-container-low p-4">
                <span className="font-body text-muted-foreground">Language</span>
                <span className="font-semibold">{language || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-surface-container-low p-4">
                <span className="font-body text-muted-foreground">Location</span>
                <span className="font-semibold">{location || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-surface-container-low p-4">
                <span className="font-body text-muted-foreground">Estimated Viewership</span>
                <span className="font-semibold">{estimatedViewership?.toLocaleString('en-IN') || 0}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-surface-container-low p-4">
                <span className="font-body text-muted-foreground">Placement</span>
                <span className="font-semibold">{placementName || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-surface-container-low p-4">
                <span className="font-body text-muted-foreground">Mock Size</span>
                <span className="font-semibold">{size || 'N/A'}</span>
              </div>
              <div className="rounded-lg bg-surface-container-low p-4">
                <p className="font-body text-muted-foreground">Placement on Newspaper</p>
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

export default NewspaperPayment;
