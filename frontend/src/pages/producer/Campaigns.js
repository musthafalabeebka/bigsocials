import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Button from '../../components/Button';
import { Tag, Plus, Calendar, DollarSign, Users } from 'lucide-react';
import { mockCampaigns } from '../../data/mockData';

const ProducerCampaigns = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  const filteredCampaigns = filter === 'all' 
    ? mockCampaigns 
    : mockCampaigns.filter(c => c.status === filter);

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <div className="flex-1">
        {/* Header */}
        <div className="bg-surface-container-lowest border-b border-outline-variant/20 p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-heading font-bold text-on-surface mb-2">Influencer Campaigns</h1>
              <p className="text-lg font-body text-muted-foreground">Manage and track all of your influencer marketing campaigns</p>
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/producer/campaigns/create')}
              data-testid="create-campaign-button"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Campaign
            </Button>
          </div>
        </div>

        <div className="p-8">
          <section className="mb-6 rounded-[28px] border border-[#dbe5ff] bg-white p-6 shadow-sm">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">How It Works</p>
              <h2 className="mt-2 text-2xl font-heading font-bold text-[#101828]">Create your influencer campaign in 3 steps</h2>
              <p className="mt-2 text-sm text-[#667085]">
                Use this flow to launch a campaign, review live progress, and track completed work.
              </p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <article
                className="cursor-pointer rounded-[24px] border border-[#dbe5ff] bg-[#f8faff] p-5 transition hover:-translate-y-0.5 hover:border-[#9eb8ff] hover:shadow-sm"
                onClick={() => navigate('/producer/campaigns/create')}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#123bb7] text-sm font-bold text-white">
                  1
                </div>
                <h3 className="mt-3 text-lg font-heading font-bold text-[#101828]">Create Campaign</h3>
                <p className="mt-2 text-sm text-[#667085]">
                  Start a new influencer campaign by setting the brand brief, budget, and creator requirements.
                </p>
                <p className="mt-4 text-sm font-semibold text-[#123bb7]">Open create campaign</p>
              </article>

              <article className="rounded-[24px] border border-[#dbe5ff] bg-[#f8faff] p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#123bb7] text-sm font-bold text-white">
                  2
                </div>
                <h3 className="mt-3 text-lg font-heading font-bold text-[#101828]">Track Active Campaigns</h3>
                <p className="mt-2 text-sm text-[#667085]">
                  Use the active view to monitor running campaigns, creator progress, and delivery status.
                </p>
              </article>

              <article className="rounded-[24px] border border-[#dbe5ff] bg-[#f8faff] p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#123bb7] text-sm font-bold text-white">
                  3
                </div>
                <h3 className="mt-3 text-lg font-heading font-bold text-[#101828]">Review Completed</h3>
                <p className="mt-2 text-sm text-[#667085]">
                  Check completed campaigns to review outcomes, budgets spent, and campaign history.
                </p>
              </article>
            </div>
          </section>

          {/* Filters */}
          <div className="flex gap-3 mb-6">
            {['all', 'active', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-6 py-2 rounded-full font-body font-semibold text-sm uppercase transition-all ${
                  filter === status
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
                }`}
                data-testid={`filter-${status}`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Campaigns Grid */}
          {filteredCampaigns.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="bg-surface-container-lowest rounded-DEFAULT shadow-ambient p-6 hover:shadow-ambient-lg transition-all cursor-pointer"
                  onClick={() => navigate(`/producer/campaigns/${campaign.id}`)}
                  data-testid={`campaign-card-${campaign.id}`}
                >
                  <div className="flex gap-4">
                    {campaign.poster_url && (
                      <img
                        src={campaign.poster_url}
                        alt={campaign.movie_title}
                        className="w-24 h-36 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-heading font-bold text-on-surface">{campaign.movie_title}</h3>
                          <p className="text-sm font-body text-muted-foreground">
                            {campaign.campaign_type.replace('_', ' ').toUpperCase()}
                          </p>
                        </div>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-mono uppercase ${
                          campaign.status === 'active' 
                            ? 'bg-success/10 text-success' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {campaign.status}
                        </span>
                      </div>

                      <div className="space-y-2 mt-4">
                        <div className="flex items-center gap-2 text-sm font-body text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(campaign.release_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-body text-muted-foreground">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-mono">₹{campaign.budget_spent.toLocaleString()} / ₹{campaign.total_budget.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-body text-muted-foreground">
                          <Users className="w-4 h-4" />
                          <span>{campaign.follower_ranges.reduce((sum, r) => sum + r.count, 0)} influencers</span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex gap-2 flex-wrap">
                          {campaign.genre.map((g) => (
                            <span key={g} className="px-2 py-1 bg-surface-container-high rounded text-xs font-body">
                              {g}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-surface-container-lowest rounded-DEFAULT shadow-ambient p-12 text-center">
              <Tag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-body text-muted-foreground mb-4">
                No {filter !== 'all' ? filter : ''} campaigns found
              </p>
              <Button variant="primary" onClick={() => navigate('/producer/campaigns/create')}>
                Create Your First Campaign
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProducerCampaigns;
