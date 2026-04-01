import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { analyticsAPI } from '../../services/api';
import Sidebar from '../../components/Sidebar';
import StatCard from '../../components/StatCard';
import { DollarSign, Film, TrendingUp, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const InfluencerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await analyticsAPI.getInfluencerDashboard(user.id);
      setDashboard(response.data);
    } catch (error) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-on-surface font-body">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-surface" data-testid="influencer-dashboard">
      <Sidebar />
      
      <div className="flex-1">
        {/* Header */}
        <div className="bg-surface-container-lowest border-b border-outline-variant/20 p-8">
          <h1 className="text-4xl font-heading font-bold text-on-surface mb-2">
            Welcome back, {user?.name}
          </h1>
          <p className="text-lg font-body text-muted-foreground">
            @{user?.instagram_handle} • {user?.follower_count?.toLocaleString()} followers
          </p>
        </div>

        {/* Stats Grid */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Earnings"
              value={`₹${(dashboard?.total_earnings || 0).toLocaleString()}`}
              subtitle="All-time earnings"
              icon={DollarSign}
            />
            <StatCard
              title="Active Campaigns"
              value={dashboard?.active_campaigns || 0}
              subtitle="Currently participating"
              icon={Film}
              clickable
              onClick={() => navigate('/influencer/campaigns?tab=active')}
            />
            <StatCard
              title="Pending Requests"
              value={dashboard?.pending_requests || 0}
              subtitle="Awaiting response"
              icon={AlertCircle}
              clickable
              onClick={() => navigate('/influencer/campaigns?tab=requests')}
            />
            <StatCard
              title="Total Campaigns"
              value={dashboard?.total_campaigns || 0}
              subtitle="Lifetime campaigns"
              icon={TrendingUp}
              clickable
              onClick={() => navigate('/influencer/campaigns?tab=active')}
            />
          </div>

          {/* Pending Requests */}
          {dashboard?.pending_requests > 0 && (
            <button
              type="button"
              onClick={() => navigate('/influencer/campaigns?tab=requests')}
              className="w-full bg-primary/10 border-2 border-primary rounded-DEFAULT p-6 mb-8 text-left hover:shadow-ambient transition-all"
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-primary" />
                <div>
                  <h3 className="font-heading font-bold text-on-surface">You have {dashboard.pending_requests} pending campaign request(s)</h3>
                  <p className="text-sm font-body text-muted-foreground">Review and respond to campaign invitations</p>
                </div>
              </div>
            </button>
          )}

          {/* Recent Campaigns */}
          <div className="bg-surface-container-lowest rounded-DEFAULT shadow-ambient p-6">
            <h2 className="text-2xl font-heading font-bold text-on-surface mb-6">Recent Activity</h2>
            
            {dashboard?.payment_history && dashboard.payment_history.length > 0 ? (
              <div className="space-y-4">
                {dashboard.payment_history.slice(0, 5).map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg"
                    data-testid={`payment-item-${payment.id}`}
                  >
                    <div>
                      <p className="font-body font-semibold text-on-surface">Payment Received</p>
                      <p className="text-sm font-body text-muted-foreground">
                        {new Date(payment.released_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-success text-lg">
                        +₹{payment.final_amount.toLocaleString()}
                      </p>
                      <p className="text-xs font-mono text-muted-foreground">
                        Commission: {payment.platform_commission}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Film className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-body text-muted-foreground">
                  No activity yet. Start accepting campaign requests!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfluencerDashboard;
