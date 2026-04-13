import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Button from '../../components/Button';
import { toast } from 'sonner';
import {
  ArrowLeft,
  TrendingUp,
  DollarSign,
  Users,
  Eye,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  Send,
} from 'lucide-react';
import { campaignAPI, deliverableAPI } from '../../services/api';

const CampaignDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [campaign, setCampaign] = useState(null);
  const [tracker, setTracker] = useState({
    newly_added: [],
    pending: [],
    submitted: [],
    accepted: [],
    rejected: [],
    live: [],
  });
  const [selectedDeliverable, setSelectedDeliverable] = useState(null);
  const [reviewNotes, setReviewNotes] = useState({});
  const [reviewLoadingId, setReviewLoadingId] = useState(null);

  useEffect(() => {
    refreshData();
  }, [id]);

  const refreshData = async () => {
    const [campaignResponse, trackerResponse] = await Promise.all([
      campaignAPI.getCampaign(id),
      deliverableAPI.getTracker(id),
    ]);

    setCampaign(campaignResponse.data.campaign);
    setTracker(trackerResponse.data);
  };

  const handleReview = async (deliverableId, approved) => {
    setReviewLoadingId(deliverableId);
    try {
      await deliverableAPI.reviewScript(
        deliverableId,
        approved,
        reviewNotes[deliverableId] || ''
      );
      await refreshData();
      toast.success(approved ? 'Script approved successfully' : 'Script rejected successfully');
    } catch (error) {
      toast.error('Failed to review script');
    } finally {
      setReviewLoadingId(null);
    }
  };

  if (!campaign) {
    return (
      <div className="flex min-h-screen bg-surface">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-lg font-body text-muted-foreground">Loading campaign...</p>
        </div>
      </div>
    );
  }

  const deliverableGroups = [
    {
      key: 'newly_added',
      title: 'Newly Added',
      icon: Plus,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      key: 'pending',
      title: 'Pending Submission',
      icon: Clock,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      key: 'submitted',
      title: 'Submitted',
      icon: Send,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      key: 'accepted',
      title: 'Accepted',
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      key: 'rejected',
      title: 'Rejected',
      icon: XCircle,
      color: 'text-error',
      bgColor: 'bg-error/10',
    },
    {
      key: 'live',
      title: 'Live',
      icon: Eye,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
  ];
  const reviewQueue = [...(tracker.submitted || []), ...(tracker.rejected || []), ...(tracker.accepted || [])];

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <div className="flex-1">
        {/* Header */}
        <div className="bg-surface-container-lowest border-b border-outline-variant/20 p-8">
          <Button variant="ghost" size="sm" onClick={() => navigate('/producer/campaigns')} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Campaigns
          </Button>
          <div className="flex items-start gap-6">
            {campaign.poster_url && (
              <img src={campaign.poster_url} alt={campaign.movie_title} className="w-32 h-48 object-cover rounded-lg shadow-ambient" />
            )}
            <div className="flex-1">
              <h1 className="text-4xl font-heading font-bold text-on-surface mb-2">{campaign.movie_title}</h1>
              <p className="text-lg font-body text-muted-foreground mb-4">
                {campaign.campaign_type.replace('_', ' ').toUpperCase()}
              </p>
              <div className="flex gap-2">
                {campaign.genre.map((g) => (
                  <span key={g} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-body">{g}</span>
                ))}
              </div>
            </div>
            <div className="text-right">
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-mono uppercase ${campaign.status === 'active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                {campaign.status}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-outline-variant/20 px-8">
          <div className="flex gap-6">
            {['overview', 'deliverables', 'review'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 font-body font-semibold capitalize transition-all ${activeTab === tab ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-on-surface'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-4 gap-6">
                <div className="bg-surface-container-lowest rounded-DEFAULT p-6 shadow-ambient">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-body text-muted-foreground uppercase">Budget Spent</p>
                    <DollarSign className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-2xl font-heading font-bold font-mono">₹{campaign.budget_spent.toLocaleString()}</p>
                </div>
                <div className="bg-surface-container-lowest rounded-DEFAULT p-6 shadow-ambient">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-body text-muted-foreground uppercase">Remaining</p>
                    <DollarSign className="w-5 h-5 text-success" />
                  </div>
                  <p className="text-2xl font-heading font-bold font-mono">₹{(campaign.total_budget - campaign.budget_spent).toLocaleString()}</p>
                </div>
                <div className="bg-surface-container-lowest rounded-DEFAULT p-6 shadow-ambient">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-body text-muted-foreground uppercase">Influencers</p>
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-2xl font-heading font-bold font-mono">{campaign.follower_ranges.reduce((sum, r) => sum + r.count, 0)}</p>
                </div>
                <div className="bg-surface-container-lowest rounded-DEFAULT p-6 shadow-ambient">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-body text-muted-foreground uppercase">Total Reach</p>
                    <Eye className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-2xl font-heading font-bold font-mono">2.5M</p>
                </div>
              </div>

              {/* Campaign Info */}
              <div className="bg-surface-container-lowest rounded-DEFAULT p-6 shadow-ambient">
                <h2 className="text-xl font-heading font-bold mb-4">Campaign Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-body text-muted-foreground mb-1">Launch Date</p>
                    <p className="font-body font-semibold">{new Date(campaign.release_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-body text-muted-foreground mb-1">Campaign Duration</p>
                    <p className="font-body font-semibold">{new Date(campaign.campaign_start_date).toLocaleDateString()} - {new Date(campaign.campaign_end_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-body text-muted-foreground mb-1">Regions</p>
                    <p className="font-body font-semibold">{campaign.regions_state.join(', ')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-body text-muted-foreground mb-1">Phases</p>
                    <p className="font-body font-semibold">{campaign.campaign_phases.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ')}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-body text-muted-foreground mb-1">Campaign Brief</p>
                    <p className="font-body">{campaign.campaign_brief}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'deliverables' && (
            <div className="space-y-6">
              <div className="bg-surface-container-lowest rounded-DEFAULT p-6 shadow-ambient">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-heading font-bold text-on-surface">
                      Deliverable Tracking
                    </h2>
                    <p className="text-sm font-body text-muted-foreground">
                      Track influencer submissions by phase and approval status.
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    onClick={() => navigate(`/producer/campaigns/${id}/deliverables`)}
                  >
                    Open Full Tracker
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {deliverableGroups.map(({ key, title, icon: Icon, color, bgColor }) => {
                  const items = tracker[key] || [];

                  return (
                    <div
                      key={key}
                      className="bg-surface-container-lowest rounded-DEFAULT shadow-ambient p-6"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`p-3 rounded-full ${bgColor}`}>
                          <Icon className={`w-6 h-6 ${color}`} />
                        </div>
                        <div>
                          <h3 className="font-heading font-bold text-lg">{title}</h3>
                          <p className="text-sm font-mono text-muted-foreground">
                            {items.length} deliverables
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {items.length > 0 ? (
                          items.slice(0, 3).map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setSelectedDeliverable(item)}
                              className="w-full p-4 bg-surface-container-low rounded-lg text-left transition-all hover:shadow-ambient hover:ring-2 hover:ring-primary/30"
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div>
                                  <p className="font-body font-semibold">
                                    {item.influencer?.name || 'Influencer'}
                                  </p>
                                  <p className="text-sm text-muted-foreground capitalize">
                                    {item.phase}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    @{item.influencer?.instagram_handle?.replace('@', '') || 'creator'}
                                  </p>
                                </div>
                                <Eye className="w-4 h-4 text-muted-foreground" />
                              </div>
                            </button>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground text-center py-6">
                            No items yet
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedDeliverable && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                  <div className="w-full max-w-2xl rounded-DEFAULT bg-surface-container-lowest p-6 shadow-ambient-lg">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-heading font-bold text-on-surface">
                          Deliverable Details
                        </h2>
                        <p className="text-sm font-body text-muted-foreground mt-1">
                          {selectedDeliverable.influencer?.name} • {selectedDeliverable.phase}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedDeliverable(null)}
                      >
                        Close
                      </Button>
                    </div>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="rounded-lg bg-surface-container-low p-4">
                        <p className="text-xs font-mono uppercase text-muted-foreground">
                          Influencer
                        </p>
                        <p className="mt-2 font-body font-semibold">
                          {selectedDeliverable.influencer?.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          @{selectedDeliverable.influencer?.instagram_handle?.replace('@', '') || 'creator'}
                        </p>
                      </div>
                      <div className="rounded-lg bg-surface-container-low p-4">
                        <p className="text-xs font-mono uppercase text-muted-foreground">Status</p>
                        <p className="mt-2 font-body font-semibold capitalize">
                          {selectedDeliverable.status}
                        </p>
                        <p className="text-sm text-muted-foreground capitalize">
                          Phase: {selectedDeliverable.phase}
                        </p>
                      </div>
                      <div className="rounded-lg bg-surface-container-low p-4 md:col-span-2">
                        <p className="text-xs font-mono uppercase text-muted-foreground">
                          Script Content
                        </p>
                        <p className="mt-2 text-sm font-body text-on-surface">
                          {selectedDeliverable.script_content || 'No script submitted yet.'}
                        </p>
                      </div>
                      <div className="rounded-lg bg-surface-container-low p-4 md:col-span-2">
                        <p className="text-xs font-mono uppercase text-muted-foreground">
                          Video Link
                        </p>
                        <p className="mt-2 text-sm font-body text-on-surface break-all">
                          {selectedDeliverable.video_link || 'No live or submitted video link yet.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'review' && (
            <div className="space-y-6">
              <div className="bg-surface-container-lowest rounded-DEFAULT p-6 shadow-ambient">
                <h2 className="text-2xl font-heading font-bold text-on-surface">
                  Script Review
                </h2>
                <p className="text-sm font-body text-muted-foreground mt-2">
                  Review submitted scripts, add notes, and approve or reject them from
                  inside the campaign.
                </p>
              </div>

              {reviewQueue.length > 0 ? (
                <div className="space-y-4">
                  {reviewQueue.map((item) => (
                    <div
                      key={item.id}
                      className="bg-surface-container-lowest rounded-DEFAULT shadow-ambient p-6"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-heading font-bold text-on-surface">
                            {item.influencer?.name || 'Influencer'}
                          </h3>
                          <p className="text-sm font-body text-muted-foreground capitalize mt-1">
                            {item.phase} • {item.status}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            @{item.influencer?.instagram_handle?.replace('@', '') || 'creator'}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedDeliverable(item)}
                          className="inline-flex items-center gap-2 rounded-full border border-outline-variant/20 px-4 py-2 text-sm font-semibold text-on-surface hover:bg-surface-container-low"
                        >
                          <Eye className="w-4 h-4" />
                          Open
                        </button>
                      </div>

                      <div className="mt-4 rounded-lg bg-surface-container-low p-4">
                        <p className="text-xs font-mono uppercase text-muted-foreground">
                          Submitted Script
                        </p>
                        <p className="mt-2 text-sm font-body text-on-surface whitespace-pre-wrap">
                          {item.script_content || 'No script submitted yet.'}
                        </p>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-body font-semibold text-on-surface mb-2">
                          Review Feedback
                        </label>
                        <textarea
                          value={reviewNotes[item.id] ?? item.review_feedback ?? ''}
                          onChange={(e) =>
                            setReviewNotes((prev) => ({
                              ...prev,
                              [item.id]: e.target.value,
                            }))
                          }
                          className="w-full rounded-lg bg-surface-container-highest px-4 py-3 font-body"
                          rows="3"
                          placeholder="Add approval notes or revision feedback..."
                        />
                      </div>

                      <div className="mt-4 flex flex-wrap gap-3">
                        <Button
                          variant="primary"
                          onClick={() => handleReview(item.id, true)}
                          disabled={reviewLoadingId === item.id}
                        >
                          {reviewLoadingId === item.id ? 'Saving...' : 'Approve Script'}
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleReview(item.id, false)}
                          disabled={reviewLoadingId === item.id}
                        >
                          {reviewLoadingId === item.id ? 'Saving...' : 'Reject Script'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-surface-container-lowest rounded-DEFAULT p-8 text-center">
                  <Eye className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-body text-muted-foreground">
                    No scripts are waiting for review yet.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;
