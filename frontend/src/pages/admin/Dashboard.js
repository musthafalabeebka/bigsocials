import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import Sidebar from '../../components/Sidebar';
import StatCard from '../../components/StatCard';
import Button from '../../components/Button';
import { Users, Tag, DollarSign, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { mockCampaigns } from '../../data/mockData';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePanel, setActivePanel] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await adminAPI.getDashboard();
      setDashboard(response.data);
    } catch (error) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const revenueBreakdown = mockCampaigns.map((campaign) => ({
    id: campaign.id,
    movie_title: campaign.movie_title,
    gross_value: campaign.budget_spent,
    commission: Math.round(campaign.budget_spent * 0.15),
    status: campaign.status,
  }));

  const totalCampaignBudget = mockCampaigns.reduce(
    (sum, campaign) => sum + campaign.total_budget,
    0
  );

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
    <div className="flex min-h-screen bg-surface" data-testid="admin-dashboard">
      <Sidebar />
      
      <div className="flex-1">
        {/* Header */}
        <div className="bg-surface-container-lowest border-b border-outline-variant/20 p-8">
          <h1 className="text-4xl font-heading font-bold text-on-surface mb-2">
            Admin Dashboard
          </h1>
          <p className="text-lg font-body text-muted-foreground">
            Platform Overview & Management
          </p>
        </div>

        {/* Stats Grid */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Users"
              value={dashboard?.total_users || 0}
              subtitle={`${dashboard?.total_producers || 0} campaign teams, ${dashboard?.total_influencers || 0} influencers`}
              icon={Users}
              clickable
              onClick={() => navigate('/admin/users')}
            />
            <StatCard
              title="Total Campaigns"
              value={dashboard?.total_campaigns || 0}
              subtitle="Platform-wide"
              icon={Tag}
              clickable
              onClick={() =>
                setActivePanel((current) => (current === 'campaigns' ? null : 'campaigns'))
              }
            />
            <StatCard
              title="Platform Revenue"
              value={`₹${(dashboard?.total_revenue || 0).toLocaleString()}`}
              subtitle="From commissions"
              icon={DollarSign}
              clickable
              onClick={() =>
                setActivePanel((current) => (current === 'revenue' ? null : 'revenue'))
              }
            />
            <StatCard
              title="Pending Verifications"
              value={dashboard?.pending_verifications || 0}
              subtitle="Influencer approvals"
              icon={AlertCircle}
              clickable
              onClick={() => navigate('/admin/users?filter=influencer')}
            />
          </div>

          {/* Pending Verifications Alert */}
          {dashboard?.pending_verifications > 0 && (
            <button
              type="button"
              onClick={() => navigate('/admin/users?filter=influencer')}
              className="w-full bg-warning/10 border-2 border-warning rounded-DEFAULT p-6 mb-8 text-left hover:shadow-ambient transition-all"
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-warning" />
                <div>
                  <h3 className="font-heading font-bold text-on-surface">
                    {dashboard.pending_verifications} influencer(s) awaiting verification
                  </h3>
                  <p className="text-sm font-body text-muted-foreground">Review and approve new influencer registrations</p>
                </div>
              </div>
            </button>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface-container-lowest rounded-DEFAULT shadow-ambient p-6">
              <h2 className="text-xl font-heading font-bold text-on-surface mb-4">User Distribution</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-body text-muted-foreground">Brand Teams</span>
                  <span className="font-mono font-bold text-on-surface">{dashboard?.total_producers || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-body text-muted-foreground">Influencers</span>
                  <span className="font-mono font-bold text-on-surface">{dashboard?.total_influencers || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-body text-muted-foreground">Admins</span>
                  <span className="font-mono font-bold text-on-surface">1</span>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-DEFAULT shadow-ambient p-6">
              <h2 className="text-xl font-heading font-bold text-on-surface mb-4">Platform Health</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-body text-muted-foreground">Active Campaigns</span>
                  <span className="font-mono font-bold text-success">{dashboard?.total_campaigns || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-body text-muted-foreground">Pending Verifications</span>
                  <span className="font-mono font-bold text-warning">{dashboard?.pending_verifications || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-body text-muted-foreground">System Status</span>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-mono uppercase bg-success/10 text-success">
                    OPERATIONAL
                  </span>
                </div>
              </div>
            </div>
          </div>
          {activePanel === 'campaigns' && (
            <div className="mt-8 bg-surface-container-lowest rounded-DEFAULT p-6 shadow-ambient">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-heading font-bold text-on-surface">
                    Campaign Breakdown
                  </h2>
                  <p className="text-sm font-body text-muted-foreground">
                    Platform-wide campaign status and budgets
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setActivePanel(null)}>
                  Close
                </Button>
              </div>

              <div className="space-y-3">
                {mockCampaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="flex items-center justify-between rounded-lg bg-surface-container-low p-4"
                  >
                    <div>
                      <p className="font-body font-semibold">{campaign.movie_title}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {campaign.campaign_type.replace('_', ' ')} • {campaign.status}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold">
                        ₹{campaign.total_budget.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        spent ₹{campaign.budget_spent.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activePanel === 'revenue' && (
            <div className="mt-8 bg-surface-container-lowest rounded-DEFAULT p-6 shadow-ambient">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-heading font-bold text-on-surface">
                    Platform Revenue Breakdown
                  </h2>
                  <p className="text-sm font-body text-muted-foreground">
                    Commission view across active and completed campaigns
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setActivePanel(null)}>
                  Close
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="rounded-lg bg-surface-container-low p-4">
                  <p className="text-xs uppercase font-mono text-muted-foreground">
                    Total Campaign Budget
                  </p>
                  <p className="mt-2 text-2xl font-heading font-bold font-mono">
                    ₹{totalCampaignBudget.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-lg bg-surface-container-low p-4">
                  <p className="text-xs uppercase font-mono text-muted-foreground">
                    Total Revenue
                  </p>
                  <p className="mt-2 text-2xl font-heading font-bold font-mono">
                    ₹{(dashboard?.total_revenue || 0).toLocaleString()}
                  </p>
                </div>
                <div className="rounded-lg bg-surface-container-low p-4">
                  <p className="text-xs uppercase font-mono text-muted-foreground">
                    Commission Rate
                  </p>
                  <p className="mt-2 text-2xl font-heading font-bold font-mono">15%</p>
                </div>
              </div>

              <div className="space-y-3">
                {revenueBreakdown.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg bg-surface-container-low p-4"
                  >
                    <div>
                      <p className="font-body font-semibold">{item.movie_title}</p>
                      <p className="text-sm text-muted-foreground capitalize">{item.status}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-primary">
                        ₹{item.commission.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        on ₹{item.gross_value.toLocaleString()} spent
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
