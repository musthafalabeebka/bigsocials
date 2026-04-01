import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { analyticsAPI } from '../../services/api';
import Sidebar from '../../components/Sidebar';
import StatCard from '../../components/StatCard';
import Button from '../../components/Button';
import { Film, DollarSign, Users, TrendingUp, Plus } from 'lucide-react';
import { toast } from 'sonner';

const ProducerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await analyticsAPI.getProducerDashboard(user.id);
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
    <div className="flex min-h-screen bg-[#f8faff]" data-testid="producer-dashboard">
      <Sidebar />

      <div className="flex-1">
        {/* Header */}
        <div className="bg-white border-b border-[#eee] px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-heading font-bold text-[#1b1c19] mb-1">
                Welcome back, {user?.name}
              </h1>
              <p className="text-sm text-[#888]">{user?.production_house}</p>
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/producer/campaigns/create')}
              data-testid="create-campaign-button"
            >
              Create Campaign
              <Plus className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Campaigns"
              value={dashboard?.total_campaigns || 0}
              subtitle={`${dashboard?.active_campaigns || 0} active`}
              icon={Film}
            />
            <StatCard
              title="Total Budget"
              value={`₹${(dashboard?.total_budget || 0).toLocaleString()}`}
              subtitle={`₹${(dashboard?.total_spent || 0).toLocaleString()} spent`}
              icon={DollarSign}
            />
            <StatCard
              title="Total Influencers"
              value={dashboard?.total_influencers || 0}
              subtitle="Engaged creators"
              icon={Users}
            />
            <StatCard
              title="Engagement Rate"
              value="8.5%"
              subtitle="Avg across campaigns"
              icon={TrendingUp}
              trend={12}
            />
          </div>

          {/* Recent Campaigns */}
          <div className="bg-white rounded-2xl border border-[#eee] p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-heading font-bold text-[#1b1c19]">Recent Campaigns</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/producer/campaigns')}
                data-testid="view-all-campaigns-button"
              >
                View All
              </Button>
            </div>

            {dashboard?.campaigns && dashboard.campaigns.length > 0 ? (
              <div className="space-y-4">
                {dashboard.campaigns.slice(0, 5).map((campaign) => (
                  <div
                    key={campaign.id}
                    className="flex items-center justify-between p-4 bg-[#f8faff] rounded-2xl border border-[#eee] hover:border-[#c7d2fe] hover:bg-white transition-all cursor-pointer"
                    onClick={() => navigate(`/producer/campaigns/${campaign.id}`)}
                    data-testid={`campaign-item-${campaign.id}`}
                  >
                    <div className="flex items-center gap-4">
                      {campaign.poster_url && (
                        <img
                          src={campaign.poster_url}
                          alt={campaign.movie_title}
                          className="w-14 h-14 object-cover rounded-xl"
                        />
                      )}
                      <div>
                        <h3 className="font-heading font-semibold text-[#1b1c19]">{campaign.movie_title}</h3>
                        <p className="text-xs text-[#aaa] font-semibold uppercase tracking-wide mt-0.5">
                          {campaign.campaign_type.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        campaign.status === 'active'
                          ? 'bg-[#ecfdf5] text-[#059669]'
                          : 'bg-[#f3f4f6] text-[#6b7280]'
                      }`}>
                        {campaign.status.toUpperCase()}
                      </span>
                      <p className="text-sm text-[#888] mt-1">
                        ₹{campaign.budget_spent.toLocaleString()} / ₹{campaign.total_budget.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Film className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-body text-muted-foreground mb-4">
                  No campaigns yet. Create your first campaign to get started!
                </p>
                <Button
                  variant="primary"
                  onClick={() => navigate('/producer/campaigns/create')}
                  data-testid="create-first-campaign-button"
                >
                  Create Your First Campaign
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProducerDashboard;
