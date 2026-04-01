import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Button from '../../components/Button';
import { toast } from 'sonner';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { mockCampaignFlowAPI } from '../../services/api';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const RAZORPAY_KEY = process.env.REACT_APP_RAZORPAY_KEY_ID;
const useMockPayment = !BACKEND_URL || !RAZORPAY_KEY;

const CampaignPayment = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const { influencerIds, totalCost } = location.state || {};

  const handlePayment = async () => {
    setLoading(true);
    try {
      if (useMockPayment) {
        await mockCampaignFlowAPI.confirmInfluencers(id, influencerIds || []);
        await new Promise((resolve) => setTimeout(resolve, 600));
        toast.success('Mock payment successful! Influencers added to campaign.');
        navigate(`/producer/campaigns/${id}/deliverables`);
        return;
      }

      // Create Razorpay order
      const orderRes = await axios.post(`${BACKEND_URL}/api/payments/razorpay/create-order`, {
        campaign_id: id,
        producer_id: user.id,
        influencer_ids: influencerIds
      });

      const options = {
        key: RAZORPAY_KEY,
        amount: orderRes.data.amount * 100,
        currency: 'INR',
        name: 'Big Social',
        description: 'Campaign Influencer Payment (Escrow)',
        order_id: orderRes.data.razorpay_order_id,
        handler: async function (response) {
          try {
            // Verify payment
            await axios.post(`${BACKEND_URL}/api/payments/razorpay/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              order_id: orderRes.data.order_id
            });

            // Confirm influencer selection
            await axios.post(`${BACKEND_URL}/api/campaigns/${id}/confirm-influencers`, {
              campaign_id: id,
              influencer_ids: influencerIds
            });

            toast.success('Payment successful! Influencers added to campaign.');
            navigate(`/producer/campaigns/${id}/deliverables`);
          } catch (error) {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: user.name,
          email: user.email
        },
        theme: {
          color: '#0028aa'
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error('Failed to initialize payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <div className="flex-1">
        <div className="bg-surface-container-lowest border-b border-outline-variant/20 p-8">
          <h1 className="text-4xl font-heading font-bold text-on-surface mb-2">
            Campaign Payment
          </h1>
          <p className="text-lg font-body text-muted-foreground">
            Secure escrow payment for influencer selection
          </p>
        </div>

        <div className="p-8 max-w-2xl mx-auto">
          <div className="bg-surface-container-lowest rounded-DEFAULT shadow-ambient-lg p-8">
            <h2 className="text-2xl font-heading font-bold mb-6">Payment Summary</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center p-4 bg-surface-container-low rounded-lg">
                <span className="font-body text-muted-foreground">Selected Influencers</span>
                <span className="font-mono font-bold text-xl">{influencerIds?.length || 0}</span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-surface-container-low rounded-lg">
                <span className="font-body text-muted-foreground">Total Cost</span>
                <span className="font-mono font-bold text-2xl text-on-surface">₹{totalCost?.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-primary/10 border-2 border-primary rounded-lg p-6 mb-8">
              <h3 className="font-heading font-bold mb-2">🔒 Escrow Model</h3>
              <ul className="space-y-2 text-sm font-body text-muted-foreground">
                <li>✓ Full payment held securely in escrow</li>
                <li>✓ Released to influencers upon deliverable completion</li>
                <li>✓ Platform commission: 15%</li>
                <li>✓ Auto-release after 72 hours or post verification</li>
              </ul>
            </div>

            {useMockPayment && (
              <div className="bg-warning/10 border-2 border-warning rounded-lg p-4 mb-8">
                <p className="text-sm font-body text-muted-foreground">
                  Mock payment mode is active. This project copy has no backend or Razorpay
                  config, so clicking pay will simulate a successful escrow payment.
                </p>
              </div>
            )}

            <Button
              variant="primary"
              size="lg"
              onClick={handlePayment}
              disabled={loading}
              className="w-full"
              data-testid="pay-now-button"
            >
              {loading ? 'Processing...' : `Pay ₹${totalCost?.toLocaleString()} via Razorpay`}
            </Button>

            <p className="text-xs text-center text-muted-foreground mt-4">
              Secured by Razorpay • Your payment is protected
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignPayment;
