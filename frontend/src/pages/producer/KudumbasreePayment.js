import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Button from '../../components/Button';
import { toast } from 'sonner';

const RAZORPAY_KEY = process.env.REACT_APP_RAZORPAY_KEY_ID;
const useMockPayment = !RAZORPAY_KEY;

const campaignConfig = {
  kudumbasree: {
    name: 'Kudumbasree',
    returnRoute: '/producer/vendors/ambassadors/kudumbasree',
    paymentDescription: 'Kudumbasree Campaign Payment',
    successLabel: 'Kudumbasree campaign',
  },
  students: {
    name: 'Students',
    returnRoute: '/producer/vendors/ambassadors/students',
    paymentDescription: 'Students Campaign Payment',
    successLabel: 'Students campaign',
  },
};

const KudumbasreePayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    campaignType = 'kudumbasree',
    campaignName,
    assetType,
    state,
    district,
    targetViews,
    budget,
    duration,
    files,
  } = location.state || {};

  const config = campaignConfig[campaignType] || campaignConfig.kudumbasree;

  const handlePayment = async () => {
    setLoading(true);

    try {
      if (useMockPayment) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        toast.success(`Mock Razorpay payment successful for ${config.successLabel}.`);
        navigate(config.returnRoute);
        return;
      }

      const options = {
        key: RAZORPAY_KEY,
        amount: Math.round((budget || 0) * 100),
        currency: 'INR',
        name: 'Big Social',
        description: config.paymentDescription,
        handler: async function () {
          toast.success(`Razorpay payment successful for ${config.successLabel}.`);
          navigate(config.returnRoute);
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
        <div className="bg-surface-container-lowest border-b border-outline-variant/20 p-8">
          <h1 className="mb-2 text-4xl font-heading font-bold text-on-surface">
            Making Payment with Razorpay
          </h1>
          <p className="text-lg font-body text-muted-foreground">
            Complete payment for your {config.name} campaign
          </p>
        </div>

        <div className="mx-auto max-w-3xl p-8">
          <div className="rounded-DEFAULT bg-surface-container-lowest p-8 shadow-ambient-lg">
            <h2 className="mb-6 text-2xl font-heading font-bold">Payment Summary</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-surface-container-low p-4">
                <span className="font-body text-muted-foreground">Campaign Name</span>
                <span className="font-semibold">{campaignName || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-surface-container-low p-4">
                <span className="font-body text-muted-foreground">Asset Type</span>
                <span className="font-semibold">{assetType || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-surface-container-low p-4">
                <span className="font-body text-muted-foreground">Location</span>
                <span className="font-semibold">{district || 'N/A'}, {state || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-surface-container-low p-4">
                <span className="font-body text-muted-foreground">Target Views</span>
                <span className="font-semibold">{targetViews?.toLocaleString() || 0}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-surface-container-low p-4">
                <span className="font-body text-muted-foreground">Duration</span>
                <span className="font-semibold">{duration || 'N/A'}</span>
              </div>
              <div className="rounded-lg bg-surface-container-low p-4">
                <p className="font-body text-muted-foreground">Uploaded Assets</p>
                <p className="mt-2 font-medium text-on-surface">
                  {files?.length ? files.join(', ') : 'No files uploaded'}
                </p>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-primary/10 p-4">
                <span className="font-body font-semibold text-on-surface">Total Cost</span>
                <span className="font-mono text-2xl font-bold text-on-surface">
                  ₹{Number(budget || 0).toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>

            {useMockPayment && (
              <div className="mb-8 mt-8 rounded-lg border-2 border-warning bg-warning/10 p-4">
                <p className="text-sm font-body text-muted-foreground">
                  Mock payment mode is active. Razorpay keys are not configured in this project copy,
                  so the payment will be simulated.
                </p>
              </div>
            )}

            <div className="mt-8 flex gap-4">
              <Button variant="secondary" size="lg" onClick={() => navigate(-1)} className="flex-1">
                Back
              </Button>
              <Button variant="primary" size="lg" onClick={handlePayment} disabled={loading} className="flex-1">
                {loading
                  ? 'Processing...'
                  : `Pay ₹${Number(budget || 0).toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })} via Razorpay`}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KudumbasreePayment;
