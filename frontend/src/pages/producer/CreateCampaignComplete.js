import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Button from '../../components/Button';
import { toast } from 'sonner';
import { campaignAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const CreateCampaignComplete = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    campaign_type: 'influencer_marketing',
    movie_title: '',
    poster_url: '',
    genre: [],
    release_date: '',
    campaign_start_date: '',
    campaign_end_date: '',
    regions_state: [],
    regions_district: '',
    campaign_phases: [],
    total_budget: '',
    follower_ranges: [],
    influencer_categories: [],
    review_mode: 'automated',
    tone_language_preferences: '',
    campaign_brief: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        regions_district: formData.regions_district.split(',').map(d => d.trim()).filter(d => d),
        total_budget: parseFloat(formData.total_budget)
      };
      
      const response = await campaignAPI.createCampaign(data, user.id);
      toast.success('Campaign created! Recommending influencers...');
      // Navigate to recommendation page
      navigate(`/producer/campaigns/${response.data.campaign.id}/recommendations`);
    } catch (error) {
      toast.error('Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  const handleTierChange = (tier, count) => {
    setFormData(prev => {
      const existing = prev.follower_ranges.find(r => r.tier === tier);
      if (!count || count === '0') {
        return { ...prev, follower_ranges: prev.follower_ranges.filter(r => r.tier !== tier) };
      }
      if (existing) {
        return {
          ...prev,
          follower_ranges: prev.follower_ranges.map(r => r.tier === tier ? { tier, count: parseInt(count) } : r)
        };
      }
      return { ...prev, follower_ranges: [...prev.follower_ranges, { tier, count: parseInt(count) }] };
    });
  };

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="bg-surface-container-lowest border-b border-outline-variant/20 p-8">
          <h1 className="text-4xl font-heading font-bold text-on-surface mb-2">Create Campaign</h1>
          <p className="text-lg font-body text-muted-foreground">Launch a new movie marketing campaign</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-w-6xl mx-auto">
          {/* Basic Info */}
          <div className="bg-surface-container-lowest rounded-DEFAULT shadow-ambient p-6 space-y-4">
            <h2 className="text-xl font-heading font-bold">Basic Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Movie Title *"
                value={formData.movie_title}
                onChange={(e) => setFormData({ ...formData, movie_title: e.target.value })}
                className="px-4 py-3 rounded-lg bg-surface-container-highest font-body"
                required
              />
              <input
                type="url"
                placeholder="Poster URL"
                value={formData.poster_url}
                onChange={(e) => setFormData({ ...formData, poster_url: e.target.value })}
                className="px-4 py-3 rounded-lg bg-surface-container-highest font-body"
              />
              <input
                type="date"
                placeholder="Release Date *"
                value={formData.release_date}
                onChange={(e) => setFormData({ ...formData, release_date: e.target.value })}
                className="px-4 py-3 rounded-lg bg-surface-container-highest font-body"
                required
              />
              <input
                type="number"
                placeholder="Total Budget (₹) *"
                value={formData.total_budget}
                onChange={(e) => setFormData({ ...formData, total_budget: e.target.value })}
                className="px-4 py-3 rounded-lg bg-surface-container-highest font-body font-mono"
                required
              />
            </div>
            
            {/* Genre Selection */}
            <div>
              <label className="block text-sm font-body font-semibold mb-2">Genre *</label>
              <div className="flex flex-wrap gap-2">
                {['Action', 'Comedy', 'Drama', 'Romance', 'Thriller', 'Horror'].map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      genre: prev.genre.includes(g) ? prev.genre.filter(x => x !== g) : [...prev.genre, g]
                    }))}
                    className={`px-4 py-2 rounded-full text-sm font-body ${
                      formData.genre.includes(g)
                        ? 'bg-primary text-white'
                        : 'bg-surface-container-high'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Phases & Regions */}
          <div className="bg-surface-container-lowest rounded-DEFAULT shadow-ambient p-6 space-y-4">
            <h2 className="text-xl font-heading font-bold">Campaign Phases & Regions</h2>
            <div className="flex flex-wrap gap-2">
              {['announcement', 'teaser', 'trailer', 'post_release'].map(phase => (
                <button
                  key={phase}
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    campaign_phases: prev.campaign_phases.includes(phase)
                      ? prev.campaign_phases.filter(p => p !== phase)
                      : [...prev.campaign_phases, phase]
                  }))}
                  className={`px-4 py-2 rounded-full text-sm font-body capitalize ${
                    formData.campaign_phases.includes(phase)
                      ? 'bg-primary text-white'
                      : 'bg-surface-container-high'
                  }`}
                >
                  {phase.replace('_', ' ')}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {['Kerala', 'Tamil Nadu', 'Andhra Pradesh', 'Telangana'].map(state => (
                <button
                  key={state}
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    regions_state: prev.regions_state.includes(state)
                      ? prev.regions_state.filter(s => s !== state)
                      : [...prev.regions_state, state]
                  }))}
                  className={`px-4 py-2 rounded-full text-sm font-body ${
                    formData.regions_state.includes(state)
                      ? 'bg-primary text-white'
                      : 'bg-surface-container-high'
                  }`}
                >
                  {state}
                </button>
              ))}
            </div>
          </div>

          {/* Influencer Selection */}
          <div className="bg-surface-container-lowest rounded-DEFAULT shadow-ambient p-6 space-y-4">
            <h2 className="text-xl font-heading font-bold">Influencer Criteria</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { tier: 'nano', label: 'Nano (1K-10K)' },
                { tier: 'micro', label: 'Micro (10K-100K)' },
                { tier: 'macro', label: 'Macro (100K-1M)' },
                { tier: 'mega', label: 'Mega (1M+)' }
              ].map(({ tier, label }) => (
                <div key={tier} className="flex items-center gap-3 p-3 bg-surface-container-high rounded-lg">
                  <span className="flex-1 font-body text-sm">{label}</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.follower_ranges.find(r => r.tier === tier)?.count || ''}
                    onChange={(e) => handleTierChange(tier, e.target.value)}
                    className="w-20 px-3 py-2 rounded bg-surface-container-highest font-mono text-center"
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {['Lifestyle', 'Review', 'Meme', 'Film', 'Youth', 'Couples'].map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    influencer_categories: prev.influencer_categories.includes(cat)
                      ? prev.influencer_categories.filter(c => c !== cat)
                      : [...prev.influencer_categories, cat]
                  }))}
                  className={`px-4 py-2 rounded-full text-sm font-body ${
                    formData.influencer_categories.includes(cat)
                      ? 'bg-primary text-white'
                      : 'bg-surface-container-high'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Review & Brief */}
          <div className="bg-surface-container-lowest rounded-DEFAULT shadow-ambient p-6 space-y-4">
            <h2 className="text-xl font-heading font-bold">Review Settings</h2>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, review_mode: 'automated' })}
                className={`flex-1 py-3 rounded-lg font-body font-semibold ${
                  formData.review_mode === 'automated'
                    ? 'bg-primary text-white'
                    : 'bg-surface-container-high'
                }`}
              >
                Automated (AI)
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, review_mode: 'manual' })}
                className={`flex-1 py-3 rounded-lg font-body font-semibold ${
                  formData.review_mode === 'manual'
                    ? 'bg-primary text-white'
                    : 'bg-surface-container-high'
                }`}
              >
                Manual Review
              </button>
            </div>
            {formData.review_mode === 'automated' && (
              <input
                type="text"
                placeholder="Tone & Language Preferences"
                value={formData.tone_language_preferences}
                onChange={(e) => setFormData({ ...formData, tone_language_preferences: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-surface-container-highest font-body"
              />
            )}
            <textarea
              placeholder="Campaign Brief *"
              value={formData.campaign_brief}
              onChange={(e) => setFormData({ ...formData, campaign_brief: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-surface-container-highest font-body"
              rows="4"
              required
            />
          </div>

          <div className="flex gap-4">
            <Button type="button" variant="ghost" onClick={() => navigate('/producer/campaigns')}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading} className="flex-1">
              {loading ? 'Creating...' : 'Create & Get Recommendations'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCampaignComplete;
