import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Button from '../../components/Button';
import { toast } from 'sonner';

const RAZORPAY_KEY = process.env.REACT_APP_RAZORPAY_KEY_ID;
const useMockPayment = !RAZORPAY_KEY;
const TEA_CUP_CAMPAIGNS_STORAGE_KEY = 'tea_cup_marketing_campaigns';
const NOTICE_MARKETING_CAMPAIGNS_STORAGE_KEY = 'notice_marketing_campaigns';

const persistCampaign = (campaign, storageKey = TEA_CUP_CAMPAIGNS_STORAGE_KEY) => {
  if (typeof window === 'undefined') {
    return;
  }

  const raw = window.localStorage.getItem(storageKey);
  const existing = raw ? JSON.parse(raw) : [];
  window.localStorage.setItem(
    storageKey,
    JSON.stringify([campaign, ...existing])
  );
};

const TeaCupMarketingPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    mode,
    bookingArea,
    outlets,
    movieName,
    quantity,
    numberOfDays,
    totalCost,
    startDate,
    endDate,
    printDetails,
    posterFiles,
  } = location.state || {};
  const isTeaShopBoards = mode === 'tea-shop-boards';
  const isNoticeMarketing = mode === 'notice-marketing';
  const pageTitle = isTeaShopBoards ? 'Making Payment with Razorpay' : 'Making Payment with Razorpay';
  const pageDescription = isTeaShopBoards
    ? 'Complete payment for your tea shop boards booking'
    : isNoticeMarketing
      ? 'Complete payment for your notice marketing booking'
    : 'Complete payment for your tea cup marketing booking';
  const paymentDescription = isTeaShopBoards ? 'Tea Shop Boards Payment' : isNoticeMarketing ? 'Notice Marketing Payment' : 'Tea Cup Marketing Payment';
  const returnRoute = isTeaShopBoards
    ? '/producer/vendors/field-agents/tea-shop-boards'
    : isNoticeMarketing
      ? '/producer/vendors/field-agents/notice-marketing'
    : '/producer/vendors/field-agents/tea-cup-marketing';
  const storageKey = isTeaShopBoards ? 'tea_shop_boards_campaigns' : isNoticeMarketing ? NOTICE_MARKETING_CAMPAIGNS_STORAGE_KEY : TEA_CUP_CAMPAIGNS_STORAGE_KEY;
  const quantityLabel = isTeaShopBoards ? 'Board Quantity' : isNoticeMarketing ? 'Notice Quantity' : 'Cup Quantity';
  const locationUnitLabel = isNoticeMarketing ? 'Homes' : 'Outlets';

  const createCampaignRecord = () => ({
    id: `${isTeaShopBoards ? 'tea-shop-boards' : isNoticeMarketing ? 'notice-marketing' : 'tea-cup'}-${Date.now()}`,
    mode,
    movieName: movieName || 'Sarvam Maya',
    district: bookingArea || 'Kerala',
    distributed: quantity || 0,
    status: 'Live',
    outlets: outlets || 0,
    startDate,
    endDate,
    printDetails: printDetails || '',
    posterFiles: posterFiles || [],
    totalCupsProducedProof: [],
    outletPlacementProof: Array.from(
      { length: outlets || 0 },
      (_, index) => isNoticeMarketing ? `Notice ${index + 1}.jpg` : `Outlet-${index + 1}.jpg`
    ),
  });

  const handlePayment = async () => {
    setLoading(true);

    try {
      if (useMockPayment) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        persistCampaign(createCampaignRecord(), storageKey);
        toast.success(`Mock Razorpay payment successful for ${isTeaShopBoards ? 'tea shop boards' : isNoticeMarketing ? 'notice marketing' : 'tea cup marketing'}.`);
        navigate(returnRoute);
        return;
      }

      const options = {
        key: RAZORPAY_KEY,
        amount: (totalCost || 0) * 100,
        currency: 'INR',
        name: 'Big Social',
        description: paymentDescription,
        handler: async function () {
          persistCampaign(createCampaignRecord(), storageKey);
          toast.success(`Razorpay payment successful for ${isTeaShopBoards ? 'tea shop boards' : isNoticeMarketing ? 'notice marketing' : 'tea cup marketing'}.`);
          navigate(returnRoute);
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
            {pageTitle}
          </h1>
          <p className="text-lg font-body text-muted-foreground">
            {pageDescription}
          </p>
        </div>

        <div className="mx-auto max-w-3xl p-8">
          <div className="rounded-DEFAULT bg-surface-container-lowest p-8 shadow-ambient-lg">
            <h2 className="mb-6 text-2xl font-heading font-bold">Payment Summary</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-surface-container-low p-4">
                <span className="font-body text-muted-foreground">Brand Name</span>
                <span className="font-semibold">{movieName || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-surface-container-low p-4">
                <span className="font-body text-muted-foreground">Booking Area</span>
                <span className="font-semibold">{bookingArea || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-surface-container-low p-4">
                <span className="font-body text-muted-foreground">{locationUnitLabel}</span>
                <span className="font-semibold">{isNoticeMarketing ? `${outlets || 0}K` : outlets || 0}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-surface-container-low p-4">
                <span className="font-body text-muted-foreground">{quantityLabel}</span>
                <span className="font-semibold">{quantity?.toLocaleString() || 0}</span>
              </div>
              {isTeaShopBoards ? (
                <div className="flex items-center justify-between rounded-lg bg-surface-container-low p-4">
                  <span className="font-body text-muted-foreground">Number of Days</span>
                  <span className="font-semibold">{numberOfDays || 0}</span>
                </div>
              ) : null}
              <div className="flex items-center justify-between rounded-lg bg-surface-container-low p-4">
                <span className="font-body text-muted-foreground">Campaign Window</span>
                <span className="font-semibold">{startDate || 'N/A'} to {endDate || 'N/A'}</span>
              </div>
              <div className="rounded-lg bg-surface-container-low p-4">
                <p className="font-body text-muted-foreground">Print Details</p>
                <p className="mt-2 font-medium text-on-surface">{printDetails || 'N/A'}</p>
              </div>
              <div className="rounded-lg bg-surface-container-low p-4">
                <p className="font-body text-muted-foreground">Uploaded Artwork</p>
                <p className="mt-2 font-medium text-on-surface">
                  {posterFiles?.length ? posterFiles.join(', ') : 'No files uploaded'}
                </p>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-primary/10 p-4">
                <span className="font-body font-semibold text-on-surface">Total Cost</span>
                <span className="font-mono text-2xl font-bold text-on-surface">₹{totalCost?.toLocaleString() || 0}</span>
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
                {loading ? 'Processing...' : `Pay ₹${totalCost?.toLocaleString() || 0} via Razorpay`}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeaCupMarketingPayment;
