import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { toast } from 'sonner';
import { campaignAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { districtsByState } from '../../data/regions';
import {
  Film, MapPin, Users, Settings, ArrowRight, ChevronLeft,
  Check, Sparkles, Calendar, DollarSign,
} from 'lucide-react';

/* ── Static options ── */
const GENRES = ['Action', 'Comedy', 'Drama', 'Romance', 'Thriller', 'Horror', 'Family', 'Biopic'];
const PHASES = ['Announcement', 'Teaser', 'Trailer', 'Post-Release'];
const STATES = ['Kerala', 'Tamil Nadu', 'Andhra Pradesh', 'Telangana'];
const CATS   = ['Lifestyle', 'Review', 'Meme', 'Film', 'Youth', 'Couples', 'Family', 'Music'];
const TIERS  = [
  { tier: 'nano',  label: 'Nano',  range: '1K – 10K',  color: '#059669', bg: '#ecfdf5' },
  { tier: 'micro', label: 'Micro', range: '10K – 100K', color: '#0891b2', bg: '#ecfeff' },
  { tier: 'macro', label: 'Macro', range: '100K – 1M',  color: '#0028aa', bg: '#eef1ff' },
  { tier: 'mega',  label: 'Mega',  range: '1M+',        color: '#7c3aed', bg: '#f5f3ff' },
];

const STEPS = [
  { num: 1, label: 'Movie Details',       icon: Film     },
  { num: 2, label: 'Reach & Regions',     icon: MapPin   },
  { num: 3, label: 'Influencer Criteria', icon: Users    },
  { num: 4, label: 'Review & Brief',      icon: Settings },
];

/* ── Helpers ── */
const inputCls = "w-full px-4 py-3 rounded-xl bg-[#f8f9fa] border border-[#e8eaed] text-sm text-[#1b1c19] outline-none focus:border-[#0028aa] focus:bg-white transition-colors placeholder-[#bbb]";

const Field = ({ label, required, children, hint, htmlFor }) => (
  <div>
    <label
      htmlFor={htmlFor}
      className="block text-xs font-semibold text-[#666] uppercase tracking-wider mb-1.5 cursor-default"
    >
      {label}{required && <span className="text-[#dc2626] ml-0.5">*</span>}
    </label>
    {children}
    {hint && <p className="text-xs text-[#aaa] mt-1">{hint}</p>}
  </div>
);

const ChipGroup = ({ options, value, onChange, activeColor = '#0028aa', activeBg = '#eef1ff' }) => (
  <div className="flex flex-wrap gap-2">
    {options.map(opt => {
      const active = value.includes(opt);
      return (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(active ? value.filter(x => x !== opt) : [...value, opt])}
          className="px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all border"
          style={active
            ? { background: activeBg, color: activeColor, borderColor: activeColor }
            : { background: '#f8f9fa', color: '#555', borderColor: '#e8eaed' }
          }
        >
          {opt}
        </button>
      );
    })}
  </div>
);

/* ════════════════════════════════════════════ */

const CreateCampaignComplete = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep]     = useState(1);
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
    campaign_brief: '',
    regions_district_list: [],   // chip-selected districts (replaces free text)
  });

  const set = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));

  const handleTierChange = (tier, count) => {
    setFormData(prev => {
      const existing = prev.follower_ranges.find(r => r.tier === tier);
      if (!count || count === '' || parseInt(count) === 0) return { ...prev, follower_ranges: prev.follower_ranges.filter(r => r.tier !== tier) };
      if (existing) return { ...prev, follower_ranges: prev.follower_ranges.map(r => r.tier === tier ? { tier, count: parseInt(count) } : r) };
      return { ...prev, follower_ranges: [...prev.follower_ranges, { tier, count: parseInt(count) }] };
    });
  };

  /* ── Step validation ── */
  const canNext = () => {
    if (step === 1) return formData.movie_title && formData.release_date && formData.total_budget && formData.genre.length > 0;
    if (step === 2) return formData.campaign_phases.length > 0 && formData.regions_state.length > 0;
    if (step === 3) return formData.follower_ranges.length > 0;
    return true;
  };

  const handleSubmit = async () => {
    if (!formData.campaign_brief.trim()) { toast.error('Please write a campaign brief'); return; }
    setLoading(true);
    try {
      const data = {
        ...formData,
        regions_district: formData.regions_district_list,
        total_budget: parseFloat(formData.total_budget),
      };
      const response = await campaignAPI.createCampaign(data, user.id);
      toast.success('Campaign created! Recommending influencers…');
      navigate(`/producer/campaigns/${response.data.campaign.id}/recommendations`);
    } catch {
      toast.error('Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  const totalInfluencers = formData.follower_ranges.reduce((s, r) => s + r.count, 0);

  return (
    <div className="flex min-h-screen bg-[#f8faff]">
      <Sidebar />
      <div className="flex-1">

        {/* ── Header ── */}
        <div className="bg-white border-b border-[#eee] px-8 py-5 sticky top-0 z-10">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => step > 1 ? setStep(s => s - 1) : navigate('/producer/campaigns')}
              className="w-9 h-9 rounded-xl border border-[#eee] flex items-center justify-center text-[#888] hover:border-[#c7d2fe] hover:text-[#0028aa] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-xl font-heading font-bold text-[#1b1c19]">Create Campaign</h1>
              <p className="text-xs text-[#888]">Step {step} of {STEPS.length} — {STEPS[step - 1].label}</p>
            </div>
          </div>

          {/* Step progress bar */}
          <div className="flex items-center gap-0">
            {STEPS.map((s, i) => {
              const done    = step > s.num;
              const current = step === s.num;
              const Icon    = s.icon;
              return (
                <React.Fragment key={s.num}>
                  {/* Step node */}
                  <div className="flex flex-col items-center gap-1 flex-shrink-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        done    ? 'bg-[#0028aa] text-white'
                        : current ? 'bg-[#eef1ff] border-2 border-[#0028aa] text-[#0028aa]'
                        : 'bg-[#f1f3f5] text-[#aaa]'
                      }`}
                    >
                      {done ? <Check className="w-4 h-4" /> : s.num}
                    </div>
                    <span className={`text-[10px] font-semibold hidden sm:block ${current ? 'text-[#0028aa]' : done ? 'text-[#0028aa]' : 'text-[#aaa]'}`}>
                      {s.label}
                    </span>
                  </div>
                  {/* Connector */}
                  {i < STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-1 mb-4 transition-all ${step > s.num ? 'bg-[#0028aa]' : 'bg-[#eee]'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* ── Step content ── */}
        <div className="p-8 max-w-2xl mx-auto">

          {/* STEP 1 — Movie Details */}
          {step === 1 && (
            <div className="bg-white rounded-2xl border border-[#eee] p-6 space-y-5 animate-fade-in">
              <div className="mb-2">
                <h2 className="text-xl font-heading font-bold text-[#1b1c19]">Tell us about your movie</h2>
                <p className="text-sm text-[#888] mt-0.5">Basic details about the film you're promoting</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Field label="Movie Title" required htmlFor="movie-title">
                    <input id="movie-title" type="text" value={formData.movie_title}
                      onChange={e => set('movie_title', e.target.value)}
                      placeholder="e.g. Pushpa 3" className={inputCls} />
                  </Field>
                </div>
                <Field label="Release Date" required htmlFor="release-date">
                  <input id="release-date" type="date" value={formData.release_date}
                    onChange={e => set('release_date', e.target.value)}
                    className={inputCls} />
                </Field>
                <Field label="Total Budget (₹)" required htmlFor="total-budget">
                  <input
                    id="total-budget"
                    type="text" inputMode="numeric" pattern="[0-9]*"
                    value={formData.total_budget}
                    onChange={e => set('total_budget', e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="e.g. 500000" className={inputCls} />
                </Field>
                <div className="col-span-2">
                  <Field label="Poster URL" htmlFor="poster-url">
                    <input id="poster-url" type="url" value={formData.poster_url}
                      onChange={e => set('poster_url', e.target.value)}
                      placeholder="https://..." className={inputCls} />
                  </Field>
                </div>
              </div>

              <Field label="Genre" required hint="Pick all that apply">
                <ChipGroup options={GENRES} value={formData.genre} onChange={v => set('genre', v)} />
              </Field>
            </div>
          )}

          {/* STEP 2 — Reach & Regions */}
          {step === 2 && (
            <div className="bg-white rounded-2xl border border-[#eee] p-6 space-y-5 animate-fade-in">
              <div className="mb-2">
                <h2 className="text-xl font-heading font-bold text-[#1b1c19]">Where and when?</h2>
                <p className="text-sm text-[#888] mt-0.5">Set your campaign timeline and target regions</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Campaign Start Date">
                  <input type="date" value={formData.campaign_start_date}
                    onChange={e => set('campaign_start_date', e.target.value)}
                    className={inputCls} />
                </Field>
                <Field label="Campaign End Date">
                  <input type="date" value={formData.campaign_end_date}
                    onChange={e => set('campaign_end_date', e.target.value)}
                    className={inputCls} />
                </Field>
              </div>

              <Field label="Campaign Phases" required hint="Which phases do you want influencer coverage for?">
                <ChipGroup options={PHASES} value={formData.campaign_phases} onChange={v => set('campaign_phases', v)} />
              </Field>

              <Field label="Target States" required>
                <ChipGroup
                  options={STATES}
                  value={formData.regions_state}
                  onChange={v => {
                    // Remove districts that belong to deselected states
                    const validDistricts = v.flatMap(s => districtsByState[s] || []);
                    set('regions_state', v);
                    set('regions_district_list', formData.regions_district_list.filter(d => validDistricts.includes(d)));
                  }}
                />
              </Field>

              {formData.regions_state.length > 0 && (() => {
                const availableDistricts = formData.regions_state.flatMap(s => districtsByState[s] || []);
                return (
                  <Field label="Districts" hint="Select specific districts (optional — leave blank for all)">
                    <ChipGroup
                      options={availableDistricts}
                      value={formData.regions_district_list}
                      onChange={v => set('regions_district_list', v)}
                    />
                  </Field>
                );
              })()}
            </div>
          )}

          {/* STEP 3 — Influencer Criteria */}
          {step === 3 && (
            <div className="bg-white rounded-2xl border border-[#eee] p-6 space-y-5 animate-fade-in">
              <div className="mb-2">
                <h2 className="text-xl font-heading font-bold text-[#1b1c19]">Who should promote it?</h2>
                <p className="text-sm text-[#888] mt-0.5">Choose influencer tiers and content categories</p>
              </div>

              <Field label="Influencer Tiers" required hint="Enter how many influencers you need per tier">
                <div className="grid grid-cols-2 gap-3 mt-1">
                  {TIERS.map(({ tier, label, range, color, bg }) => {
                    const count = formData.follower_ranges.find(r => r.tier === tier)?.count || '';
                    return (
                      <div key={tier} className="flex items-center gap-3 p-3.5 rounded-xl border border-[#e8eaed] bg-[#f8f9fa]">
                        <div className="flex-1">
                          <p className="text-sm font-bold" style={{ color }}>{label}</p>
                          <p className="text-xs text-[#aaa]">{range}</p>
                        </div>
                        {/* text input avoids browser spinner arrows */}
                        <input
                          type="text" inputMode="numeric" pattern="[0-9]*"
                          value={count}
                          onChange={e => handleTierChange(tier, e.target.value.replace(/[^0-9]/g, ''))}
                          placeholder="0"
                          className="w-16 px-2 py-2 rounded-lg bg-white border border-[#e8eaed] text-sm font-bold text-center outline-none focus:border-[#0028aa] transition-colors"
                        />
                      </div>
                    );
                  })}
                </div>
                {totalInfluencers > 0 && (
                  <p className="text-xs font-semibold text-[#0028aa] mt-2">
                    {totalInfluencers} influencer{totalInfluencers !== 1 ? 's' : ''} selected total
                  </p>
                )}
              </Field>

              <Field label="Content Categories">
                <ChipGroup options={CATS} value={formData.influencer_categories}
                  onChange={v => set('influencer_categories', v)} />
              </Field>
            </div>
          )}

          {/* STEP 4 — Review & Brief */}
          {step === 4 && (
            <div className="bg-white rounded-2xl border border-[#eee] p-6 space-y-5 animate-fade-in">
              <div className="mb-2">
                <h2 className="text-xl font-heading font-bold text-[#1b1c19]">Final details</h2>
                <p className="text-sm text-[#888] mt-0.5">Set content review preferences and write your brief</p>
              </div>

              {/* Summary card */}
              <div className="bg-[#eef1ff] rounded-2xl p-4 flex flex-wrap gap-4">
                <div>
                  <p className="text-xs text-[#0028aa] font-bold uppercase tracking-wider">Movie</p>
                  <p className="text-sm font-bold text-[#1b1c19] mt-0.5">{formData.movie_title}</p>
                </div>
                <div>
                  <p className="text-xs text-[#0028aa] font-bold uppercase tracking-wider">Budget</p>
                  <p className="text-sm font-bold text-[#1b1c19] mt-0.5">₹{Number(formData.total_budget).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-[#0028aa] font-bold uppercase tracking-wider">Regions</p>
                  <p className="text-sm font-bold text-[#1b1c19] mt-0.5">{formData.regions_state.join(', ') || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-[#0028aa] font-bold uppercase tracking-wider">Influencers</p>
                  <p className="text-sm font-bold text-[#1b1c19] mt-0.5">{totalInfluencers} selected</p>
                </div>
              </div>

              <Field label="Review Mode">
                <div className="grid grid-cols-2 gap-3 mt-1">
                  {[
                    { val: 'automated', label: 'AI Automated',  desc: 'Fast, AI-powered content review' },
                    { val: 'manual',    label: 'Manual Review', desc: 'Your team reviews all content'   },
                  ].map(({ val, label, desc }) => (
                    <button
                      key={val} type="button"
                      onClick={() => set('review_mode', val)}
                      className={`text-left p-4 rounded-xl border-2 transition-all ${
                        formData.review_mode === val
                          ? 'border-[#0028aa] bg-[#eef1ff]'
                          : 'border-[#eee] bg-[#fafafa] hover:border-[#c7d2fe]'
                      }`}
                    >
                      <p className={`text-sm font-bold ${formData.review_mode === val ? 'text-[#0028aa]' : 'text-[#1b1c19]'}`}>{label}</p>
                      <p className="text-xs text-[#888] mt-0.5">{desc}</p>
                    </button>
                  ))}
                </div>
              </Field>

              {formData.review_mode === 'automated' && (
                <Field label="Tone & Language Preferences" htmlFor="tone-lang">
                  <input
                    id="tone-lang"
                    type="text"
                    value={formData.tone_language_preferences}
                    onChange={e => set('tone_language_preferences', e.target.value)}
                    placeholder="e.g. Energetic, Malayalam + Hindi, avoid controversy"
                    className={inputCls}
                    autoComplete="off"
                  />
                </Field>
              )}

              <Field label="Campaign Brief" required htmlFor="campaign-brief">
                <textarea
                  id="campaign-brief"
                  value={formData.campaign_brief}
                  onChange={e => set('campaign_brief', e.target.value)}
                  placeholder="Describe your campaign goals, target audience, key messages, and any specific requirements for influencers…"
                  className={`${inputCls} resize-none`}
                  rows={6}
                />
              </Field>
            </div>
          )}

          {/* ── Navigation ── */}
          <div className="flex items-center gap-3 mt-8 pb-8">
            <button
              type="button"
              onClick={() => step > 1 ? setStep(s => s - 1) : navigate('/producer/campaigns')}
              className="px-6 py-3 rounded-xl border border-[#eee] text-sm font-semibold text-[#666] hover:border-[#c7d2fe] hover:text-[#0028aa] transition-colors"
            >
              {step === 1 ? 'Cancel' : 'Back'}
            </button>

            {step < STEPS.length ? (
              <button
                type="button"
                disabled={!canNext()}
                onClick={() => setStep(s => s + 1)}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0028aa] text-white text-sm font-bold hover:bg-[#1a3fd4] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={loading}
                onClick={handleSubmit}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0028aa] text-white text-sm font-bold hover:bg-[#1a3fd4] disabled:opacity-60 transition-colors"
              >
                {loading ? 'Creating…' : (
                  <><Sparkles className="w-4 h-4" /> Launch & Get Recommendations</>
                )}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default CreateCampaignComplete;
