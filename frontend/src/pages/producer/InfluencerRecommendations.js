import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Button from '../../components/Button';
import { campaignAPI } from '../../services/api';
import { mockInfluencers } from '../../data/mockData';
import { toast } from 'sonner';
import { Check, X, Users, TrendingUp, MapPin, DollarSign } from 'lucide-react';

const InfluencerRecommendations = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState(mockInfluencers.map((inf, idx) => ({
    ...inf,
    match_score: 92 - (idx * 3),
    selected: true
  })));
  const [loading, setLoading] = useState(false);

  const totalCost = recommendations
    .filter(r => r.selected)
    .reduce((sum, r) => sum + r.cost_per_post, 0);

  const handleConfirm = () => {
    const selectedIds = recommendations.filter(r => r.selected).map(r => r.id);
    if (selectedIds.length === 0) {
      toast.error('Please select at least one influencer');
      return;
    }
    // Navigate to payment
    navigate(`/producer/campaigns/${id}/payment`, {
      state: { influencerIds: selectedIds, totalCost }
    });
  };

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <div className="flex-1">
        <div className="bg-surface-container-lowest border-b border-outline-variant/20 p-8">
          <h1 className="text-4xl font-heading font-bold text-on-surface mb-2">
            Recommended Influencers
          </h1>
          <p className="text-lg font-body text-muted-foreground">
            AI-matched influencers for your campaign
          </p>
        </div>

        <div className="p-8">
          {/* Summary Card */}
          <div className="bg-primary/10 border-2 border-primary rounded-DEFAULT p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-body text-muted-foreground mb-1">Selected Influencers</p>
                <p className="text-3xl font-heading font-bold font-mono">
                  {recommendations.filter(r => r.selected).length}
                </p>
              </div>
              <div>
                <p className="text-sm font-body text-muted-foreground mb-1">Total Cost</p>
                <p className="text-3xl font-heading font-bold text-success font-mono">
                  ₹{totalCost.toLocaleString()}
                </p>
              </div>
              <Button
                variant="primary"
                size="lg"
                onClick={handleConfirm}
                disabled={loading}
                data-testid="confirm-selection-button"
              >
                Proceed to Payment
              </Button>
            </div>
          </div>

          {/* Influencer List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className={`bg-surface-container-lowest rounded-DEFAULT shadow-ambient p-6 transition-all ${
                  rec.selected ? 'ring-2 ring-primary' : ''
                }`}
                data-testid={`recommendation-${rec.id}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-heading font-bold">{rec.name}</h3>
                    <p className="text-sm font-mono text-muted-foreground">{rec.instagram_handle}</p>
                    <div className="mt-2">
                      <span className="inline-block px-3 py-1 bg-success/10 text-success rounded-full text-xs font-mono">
                        {rec.match_score}% Match
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setRecommendations(recs =>
                      recs.map(r => r.id === rec.id ? { ...r, selected: !r.selected } : r)
                    )}
                    className={`p-3 rounded-full transition-all ${
                      rec.selected
                        ? 'bg-primary text-white'
                        : 'bg-surface-container-high hover:bg-surface-container-highest'
                    }`}
                    data-testid={`toggle-${rec.id}`}
                  >
                    {rec.selected ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="font-mono font-semibold">{rec.follower_count.toLocaleString()}</span>
                    <span className="text-muted-foreground">followers</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    <span className="font-mono font-semibold">{rec.engagement_rate}%</span>
                    <span className="text-muted-foreground">engagement</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{rec.location_district}, {rec.location_state}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="font-mono font-semibold text-success">₹{rec.cost_per_post.toLocaleString()}</span>
                    <span className="text-muted-foreground">per post</span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2 flex-wrap">
                  {rec.categories.slice(0, 3).map(cat => (
                    <span key={cat} className="px-2 py-1 bg-surface-container-high rounded text-xs font-body">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfluencerRecommendations;
