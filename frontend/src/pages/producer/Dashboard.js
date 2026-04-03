import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { analyticsAPI } from '../../services/api';
import Sidebar from '../../components/Sidebar';
import StatCard from '../../components/StatCard';
import Button from '../../components/Button';
import { Film, DollarSign, Users, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const storageKeys = {
  billboards: 'billboard_live_campaigns',
  newspapers: 'newspaper_media_campaigns',
  radio: 'radio_media_campaigns',
  teaCups: 'tea_cup_marketing_campaigns',
  teaShopBoards: 'tea_shop_boards_campaigns',
  noticeMarketing: 'notice_marketing_campaigns',
  kudumbasree: 'kudumbasree_campaigns',
  students: 'students_campaigns',
  brandBriefs: 'brand_bidding_briefs',
};

const readStoredCampaigns = (key) => {
  if (typeof window === 'undefined') {
    return [];
  }

  const raw = window.localStorage.getItem(key);
  return raw ? JSON.parse(raw) : [];
};

const normalizeStoredCampaigns = () => {
  const billboardCampaigns = readStoredCampaigns(storageKeys.billboards).map((campaign) => ({
    id: campaign.id,
    title: campaign.campaignName || campaign.title,
    category: 'Billboards',
    subtitle: campaign.location,
    status: (campaign.status || 'live').toLowerCase(),
    budget: campaign.price || 0,
    spent: campaign.price || 0,
    reach: campaign.estimatedReach || 0,
    route: '/producer/vendors/billboards',
    routeState: { activeTab: 'live', reportCampaignId: campaign.id },
  }));

  const newspaperCampaigns = readStoredCampaigns(storageKeys.newspapers).map((campaign) => ({
    id: campaign.id,
    title: campaign.campaignName || campaign.newspaperName,
    category: 'Media',
    subtitle: `${campaign.newspaperName} • ${campaign.location}`,
    status: (campaign.status || 'live').toLowerCase(),
    budget: campaign.price || 0,
    spent: campaign.price || 0,
    reach: campaign.estimatedViewership || 0,
    route: '/producer/vendors/media/newspapers',
    routeState: { activeTab: 'live', reportCampaignId: campaign.id },
  }));

  const radioCampaigns = readStoredCampaigns(storageKeys.radio).map((campaign) => ({
    id: campaign.id,
    title: campaign.campaignName || campaign.stationName,
    category: 'Media',
    subtitle: `${campaign.stationName} • ${campaign.location}`,
    status: (campaign.status || 'live').toLowerCase(),
    budget: campaign.price || 0,
    spent: campaign.price || 0,
    reach: campaign.listenerReach || 0,
    route: '/producer/vendors/media/radio',
    routeState: { activeTab: 'live', reportCampaignId: campaign.id },
  }));

  const teaCupCampaigns = readStoredCampaigns(storageKeys.teaCups).map((campaign) => ({
    id: campaign.id,
    title: campaign.movieName,
    category: 'Field Agents',
    subtitle: `Tea Cup Marketing • ${campaign.district}`,
    status: (campaign.status || 'live').toLowerCase(),
    budget: campaign.totalCost || 0,
    spent: campaign.totalCost || 0,
    reach: campaign.distributed || 0,
    route: '/producer/vendors/field-agents/tea-cup-marketing',
    routeState: { activeTab: 'report', reportCampaignId: campaign.id },
  }));

  const teaShopBoardCampaigns = readStoredCampaigns(storageKeys.teaShopBoards).map((campaign) => ({
    id: campaign.id,
    title: campaign.movieName,
    category: 'Field Agents',
    subtitle: `Tea Shop Boards • ${campaign.district}`,
    status: (campaign.status || 'live').toLowerCase(),
    budget: campaign.totalCost || 0,
    spent: campaign.totalCost || 0,
    reach: campaign.outlets || 0,
    route: '/producer/vendors/field-agents/tea-shop-boards',
    routeState: { activeTab: 'report', reportCampaignId: campaign.id },
  }));

  const noticeCampaigns = readStoredCampaigns(storageKeys.noticeMarketing).map((campaign) => ({
    id: campaign.id,
    title: campaign.movieName,
    category: 'Field Agents',
    subtitle: `Notice Marketing • ${campaign.district}`,
    status: (campaign.status || 'live').toLowerCase(),
    budget: campaign.totalCost || 0,
    spent: campaign.totalCost || 0,
    reach: (campaign.outlets || 0) * 1000,
    route: '/producer/vendors/field-agents/notice-marketing',
    routeState: { activeTab: 'report', reportCampaignId: campaign.id },
  }));

  const kudumbasreeCampaigns = readStoredCampaigns(storageKeys.kudumbasree).map((campaign) => ({
    id: campaign.id,
    title: campaign.campaignName,
    category: 'Ambassadors',
    subtitle: `Kudumbasree • ${campaign.district || campaign.state || ''}`.trim(),
    status: (campaign.status || 'live').toLowerCase(),
    budget: campaign.budget || 0,
    spent: campaign.budget || 0,
    reach: campaign.targetViews || 0,
    route: '/producer/vendors/ambassadors/kudumbasree',
  }));

  const studentCampaigns = readStoredCampaigns(storageKeys.students).map((campaign) => ({
    id: campaign.id,
    title: campaign.campaignName,
    category: 'Ambassadors',
    subtitle: `Students • ${campaign.district || campaign.state || ''}`.trim(),
    status: (campaign.status || 'live').toLowerCase(),
    budget: campaign.budget || 0,
    spent: campaign.budget || 0,
    reach: campaign.targetViews || 0,
    route: '/producer/vendors/ambassadors/students',
  }));

  const brandCampaigns = readStoredCampaigns(storageKeys.brandBriefs).map((campaign) => ({
    id: campaign.id,
    title: campaign.movieName,
    category: 'Brands',
    subtitle: campaign.opportunityTitle || 'Brand collaboration',
    status: 'live',
    budget: Number(campaign.minimumBid || 0),
    spent: 0,
    reach: Number(String(campaign.expectedReach || 0).replace(/,/g, '')) || 0,
    route: '/producer/vendors/brands',
  }));

  return [
    ...billboardCampaigns,
    ...newspaperCampaigns,
    ...radioCampaigns,
    ...teaCupCampaigns,
    ...teaShopBoardCampaigns,
    ...noticeCampaigns,
    ...kudumbasreeCampaigns,
    ...studentCampaigns,
    ...brandCampaigns,
  ];
};

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
      setDashboard(null);
    } finally {
      setLoading(false);
    }
  };

  const storedCampaigns = normalizeStoredCampaigns();
  const backendCampaigns = (dashboard?.campaigns || []).map((campaign) => ({
    id: campaign.id,
    title: campaign.movie_title,
    category: 'Influencers',
    subtitle: campaign.campaign_type.replace('_', ' '),
    status: campaign.status,
    budget: campaign.total_budget || 0,
    spent: campaign.budget_spent || 0,
    reach: campaign.total_reach || campaign.reach || 0,
    posterUrl: campaign.poster_url,
    route: `/producer/campaigns/${campaign.id}`,
  }));

  const allCampaigns = [...storedCampaigns, ...backendCampaigns];
  const totalCampaignCount = allCampaigns.length;
  const activeCampaignCount = allCampaigns.filter((campaign) => campaign.status === 'active' || campaign.status === 'live').length;
  const totalBudget = allCampaigns.reduce((sum, campaign) => sum + Number(campaign.budget || 0), 0);
  const totalSpent = allCampaigns.reduce((sum, campaign) => sum + Number(campaign.spent || 0), 0);
  const totalReach = allCampaigns.reduce((sum, campaign) => sum + Number(campaign.reach || 0), 0);

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
          <div>
            <h1 className="text-3xl font-heading font-bold text-[#1b1c19] mb-1">
              Welcome back, {user?.name}
            </h1>
            <p className="text-sm text-[#888]">{user?.production_house}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Campaigns"
              value={totalCampaignCount}
              subtitle={`${activeCampaignCount} active`}
              icon={Film}
            />
            <StatCard
              title="Total Budget"
              value={`₹${totalBudget.toLocaleString('en-IN')}`}
              subtitle={`₹${totalSpent.toLocaleString('en-IN')} spent`}
              icon={DollarSign}
            />
            <StatCard
              title="Total Partners"
              value={dashboard?.total_influencers || 0}
              subtitle="Engaged partners"
              icon={Users}
            />
            <StatCard
              title="Total Reach"
              value={totalReach.toLocaleString('en-IN')}
              subtitle="Sum across all campaigns"
              icon={TrendingUp}
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

            {allCampaigns.length > 0 ? (
              <div className="space-y-4">
                {allCampaigns.slice(0, 5).map((campaign) => (
                  <div
                    key={campaign.id}
                    className="flex items-center justify-between rounded-2xl border border-[#dbe5ff] bg-[linear-gradient(135deg,#eef4ff_0%,#dce8ff_100%)] p-4 transition-all cursor-pointer hover:border-[#9eb8ff] hover:shadow-sm"
                    onClick={() => navigate(campaign.route, campaign.routeState ? { state: campaign.routeState } : undefined)}
                    data-testid={`campaign-item-${campaign.id}`}
                  >
                    <div className="flex items-center gap-4">
                      {campaign.posterUrl && (
                        <img
                          src={campaign.posterUrl}
                          alt={campaign.title}
                          className="w-14 h-14 object-cover rounded-xl"
                        />
                      )}
                      <div>
                        <h3 className="font-heading font-semibold text-[#1b1c19]">{campaign.title}</h3>
                        <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-[#0028aa]">
                          {campaign.category}
                        </p>
                        <p className="mt-1 text-xs text-[#5f6f99]">{campaign.subtitle}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        campaign.status === 'active' || campaign.status === 'live'
                          ? 'bg-[#ecfdf5] text-[#059669]'
                          : 'bg-[#f3f4f6] text-[#6b7280]'
                      }`}>
                        {String(campaign.status || 'draft').toUpperCase()}
                      </span>
                      <p className="mt-1 text-sm text-[#46557c]">
                        ₹{Number(campaign.spent || 0).toLocaleString('en-IN')} / ₹{Number(campaign.budget || 0).toLocaleString('en-IN')}
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
