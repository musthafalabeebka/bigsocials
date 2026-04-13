import React, { useState, useMemo } from 'react';
import Sidebar from '../../components/Sidebar';
import {
  Search, MapPin, Users as UsersIcon, TrendingUp, DollarSign,
  BadgeCheck, SlidersHorizontal, X, Instagram, ArrowUpDown,
  ChevronDown,
} from 'lucide-react';
import { mockInfluencers } from '../../data/mockData';
import { districtsByState, getDistricts } from '../../data/regions';
import { toast } from 'sonner';

/* ── Static data ── */
const contentLanguageByInfluencer = {
  'inf-1': 'Malayalam', 'inf-2': 'Tamil', 'inf-3': 'Malayalam',
  'inf-4': 'Tamil',     'inf-5': 'Telugu', 'inf-6': 'Malayalam',
};

const enriched = mockInfluencers.map(inf => ({
  ...inf,
  content_language: contentLanguageByInfluencer[inf.id] || 'English',
}));

const categories  = ['Lifestyle', 'Couples', 'Family', 'Youth', 'Kids', 'Music', 'Meme', 'Review', 'Brand'];
const followerOpts = ['1K–10K', '10K–50K', '50K–100K', '100K–250K', '250K+'];
const costOpts     = ['Up to ₹5K', '₹5K–₹10K', '₹10K–₹20K', '₹20K+'];
const engOpts      = ['Under 3%', '3%–5%', '5%–8%', '8%+'];
const ageOpts      = ['Under 25', '25–30', '30–35', '35+'];
const genders      = ['Male', 'Female', 'Couple'];
const languages    = ['Malayalam', 'Tamil', 'Telugu', 'English'];
const sortOpts     = [
  { val: 'default',        label: 'Default'          },
  { val: 'followers_desc', label: 'Most Followers'   },
  { val: 'followers_asc',  label: 'Least Followers'  },
  { val: 'engagement_desc',label: 'Top Engagement'   },
  { val: 'cost_asc',       label: 'Lowest Cost'      },
  { val: 'cost_desc',      label: 'Highest Cost'     },
];

/* ── Matchers ── */
const matchFollower = (count, label) => {
  if (!label) return true;
  if (label === '1K–10K')    return count >= 1000   && count < 10000;
  if (label === '10K–50K')   return count >= 10000  && count < 50000;
  if (label === '50K–100K')  return count >= 50000  && count < 100000;
  if (label === '100K–250K') return count >= 100000 && count < 250000;
  if (label === '250K+')     return count >= 250000;
  return true;
};
const matchCost = (cost, label) => {
  if (!label) return true;
  if (label === 'Up to ₹5K') return cost <= 5000;
  if (label === '₹5K–₹10K')  return cost > 5000  && cost <= 10000;
  if (label === '₹10K–₹20K') return cost > 10000 && cost <= 20000;
  if (label === '₹20K+')     return cost > 20000;
  return true;
};
const matchEngagement = (rate, label) => {
  if (!label) return true;
  if (label === 'Under 3%') return rate < 3;
  if (label === '3%–5%')    return rate >= 3  && rate < 5;
  if (label === '5%–8%')    return rate >= 5  && rate < 8;
  if (label === '8%+')      return rate >= 8;
  return true;
};
const matchAge = (age, label) => {
  if (!label || age == null) return true;
  if (label === 'Under 25') return age < 25;
  if (label === '25–30')    return age >= 25 && age < 30;
  if (label === '30–35')    return age >= 30 && age < 35;
  if (label === '35+')      return age >= 35;
  return true;
};

/* ── Helpers ── */
const tierLabel = (count) => {
  if (count >= 1000000) return { label: 'Mega',  color: '#7c3aed', bg: '#f5f3ff' };
  if (count >= 100000)  return { label: 'Macro', color: '#0028aa', bg: '#eef1ff' };
  if (count >= 10000)   return { label: 'Micro', color: '#0891b2', bg: '#ecfeff' };
  return                       { label: 'Nano',  color: '#059669', bg: '#ecfdf5' };
};
const avatarColor = (name) => {
  const colors = ['#0028aa','#9333ea','#0891b2','#059669','#ea580c','#dc2626'];
  return colors[name.charCodeAt(0) % colors.length];
};
const formatFollowers = (n) => {
  if (n >= 1000000) return `${(n/1000000).toFixed(1)}M`;
  if (n >= 1000)    return `${(n/1000).toFixed(0)}K`;
  return n.toString();
};

/* ── FilterPill (select) ── */
const FilterPill = ({ label, value, onChange, options }) => (
  <div className="relative flex-shrink-0">
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className={`appearance-none pl-3 pr-7 py-2.5 rounded-xl text-sm font-semibold border outline-none cursor-pointer transition-colors ${
        value
          ? 'bg-[#eef1ff] border-[#0028aa] text-[#0028aa]'
          : 'bg-white border-[#eee] text-[#666] hover:border-[#c7d2fe]'
      }`}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Cpolyline points='6,9 12,15 18,9'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 8px center',
      }}
    >
      <option value="">{label}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

/* ── StatPill (card stat) ── */
const StatPill = ({ icon: Icon, value, label }) => (
  <div className="flex flex-col items-center p-2.5 rounded-xl bg-[#f8f9fa]">
    <span className="font-heading font-bold text-sm text-[#1b1c19]">{value}</span>
    <span className="text-[10px] text-[#aaa] mt-0.5">{label}</span>
  </div>
);

/* ════════════════════════════════════════════ */

const CreatorsMarketplace = () => {
  const [search,      setSearch]      = useState('');
  const [state,       setState]       = useState('');
  const [district,    setDistrict]    = useState('');
  const [category,    setCategory]    = useState('');
  const [follower,    setFollower]    = useState('');
  const [cost,        setCost]        = useState('');
  const [engagement,  setEngagement]  = useState('');
  const [age,         setAge]         = useState('');
  const [gender,      setGender]      = useState('');
  const [language,    setLanguage]    = useState('');
  const [verifiedOnly,setVerified]    = useState(false);
  const [sortBy,      setSortBy]      = useState('default');
  const [showFilters, setShowFilters] = useState(false);

  /* Districts available for selected state */
  const districtOpts = getDistricts(state);

  /* Count of non-sort active filters */
  const filterValues = [state, district, category, follower, cost, engagement, age, gender, language, verifiedOnly ? 'V' : ''];
  const activeCount  = filterValues.filter(Boolean).length;

  /* Active chip labels (for display) */
  const activeChips = [
    state && { key: 'state', label: state,      clear: () => { setState(''); setDistrict(''); } },
    district && { key: 'district', label: district, clear: () => setDistrict('') },
    category && { key: 'cat',  label: category,  clear: () => setCategory('') },
    follower && { key: 'flw',  label: follower,  clear: () => setFollower('') },
    cost     && { key: 'cost', label: cost,      clear: () => setCost('') },
    engagement && { key: 'eng', label: `Eng ${engagement}`, clear: () => setEngagement('') },
    age      && { key: 'age',  label: `Age ${age}`, clear: () => setAge('') },
    gender   && { key: 'gen',  label: gender,    clear: () => setGender('') },
    language && { key: 'lang', label: language,  clear: () => setLanguage('') },
    verifiedOnly && { key: 'ver', label: 'Verified', clear: () => setVerified(false) },
  ].filter(Boolean);

  const clearAll = () => {
    setState(''); setDistrict(''); setCategory(''); setFollower('');
    setCost(''); setEngagement(''); setAge(''); setGender('');
    setLanguage(''); setVerified(false);
  };

  /* Filter + sort */
  const filtered = useMemo(() => {
    let list = enriched.filter(inf => {
      if (search && !`${inf.name} ${inf.instagram_handle}`.toLowerCase().includes(search.toLowerCase())) return false;
      if (state    && inf.location_state    !== state)    return false;
      if (district && inf.location_district !== district) return false;
      if (category && !inf.categories.includes(category)) return false;
      if (!matchFollower(inf.follower_count, follower))    return false;
      if (!matchCost(inf.cost_per_post, cost))             return false;
      if (!matchEngagement(inf.engagement_rate, engagement)) return false;
      if (!matchAge(inf.age, age))                         return false;
      if (gender   && inf.gender.toLowerCase() !== gender.toLowerCase()) return false;
      if (language && inf.content_language !== language)   return false;
      if (verifiedOnly && !inf.is_verified)                return false;
      return true;
    });

    switch (sortBy) {
      case 'followers_desc':  list = [...list].sort((a,b) => b.follower_count - a.follower_count); break;
      case 'followers_asc':   list = [...list].sort((a,b) => a.follower_count - b.follower_count); break;
      case 'engagement_desc': list = [...list].sort((a,b) => b.engagement_rate - a.engagement_rate); break;
      case 'cost_asc':        list = [...list].sort((a,b) => a.cost_per_post - b.cost_per_post); break;
      case 'cost_desc':       list = [...list].sort((a,b) => b.cost_per_post - a.cost_per_post); break;
      default: break;
    }
    return list;
  }, [search, state, district, category, follower, cost, engagement, age, gender, language, verifiedOnly, sortBy]);

  return (
    <div className="flex min-h-screen bg-[#f8faff]">
      <Sidebar />
      <div className="flex-1">

        {/* ── Header ── */}
        <div className="bg-white border-b border-[#eee] px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-heading font-bold text-[#1b1c19]">Creators Marketplace</h1>
              <p className="text-sm text-[#888] mt-0.5">Discover and book influencers for your campaigns</p>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-[#888]">
              <span className="text-2xl font-heading font-bold text-[#0028aa]">{filtered.length}</span> creators found
            </div>
          </div>
        </div>

        <div className="p-8">

          <section className="bg-white rounded-2xl border border-[#dbe5ff] p-6 mb-6 shadow-sm">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">How It Works</p>
              <h2 className="mt-2 text-2xl font-heading font-bold text-[#101828]">Book influencers in 3 steps</h2>
              <p className="mt-2 text-sm text-[#667085]">
                Use the marketplace to discover creators, shortlist the right profiles, and move them into your campaign workflow.
              </p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <article className="rounded-[24px] border border-[#dbe5ff] bg-[#f8faff] p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#123bb7] text-sm font-bold text-white">
                  1
                </div>
                <h3 className="mt-3 text-lg font-heading font-bold text-[#101828]">Discover Creators</h3>
                <p className="mt-2 text-sm text-[#667085]">
                  Search by location, niche, follower size, language, and engagement to find matching influencers.
                </p>
              </article>

              <article className="rounded-[24px] border border-[#dbe5ff] bg-[#f8faff] p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#123bb7] text-sm font-bold text-white">
                  2
                </div>
                <h3 className="mt-3 text-lg font-heading font-bold text-[#101828]">Shortlist Profiles</h3>
                <p className="mt-2 text-sm text-[#667085]">
                  Compare reach, audience fit, pricing, and verification status before narrowing your creator list.
                </p>
              </article>

              <article className="rounded-[24px] border border-[#dbe5ff] bg-[#f8faff] p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#123bb7] text-sm font-bold text-white">
                  3
                </div>
                <h3 className="mt-3 text-lg font-heading font-bold text-[#101828]">Move to Campaign</h3>
                <p className="mt-2 text-sm text-[#667085]">
                  Take the shortlisted influencers into your campaign workflow to confirm bookings and track delivery.
                </p>
              </article>
            </div>
          </section>

          {/* ── Filter panel ── */}
          <div className="bg-white rounded-2xl border border-[#eee] p-4 mb-6">

            {/* Row 1: Search + Sort + Filters toggle */}
            <div className="flex gap-3 items-center flex-wrap">
              <div className="relative flex-1 min-w-48">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aaa]" />
                <input
                  type="text"
                  placeholder="Search by name or @handle…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#f8f9fa] border border-transparent text-sm outline-none focus:border-[#0028aa] focus:bg-white transition-colors"
                />
              </div>

              {/* Sort */}
              <div className="relative flex-shrink-0">
                <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#aaa] pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className={`appearance-none pl-8 pr-7 py-2.5 rounded-xl text-sm font-semibold border outline-none cursor-pointer transition-colors ${
                    sortBy !== 'default'
                      ? 'bg-[#eef1ff] border-[#0028aa] text-[#0028aa]'
                      : 'bg-white border-[#eee] text-[#666] hover:border-[#c7d2fe]'
                  }`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Cpolyline points='6,9 12,15 18,9'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 8px center',
                  }}
                >
                  {sortOpts.map(o => <option key={o.val} value={o.val}>{o.label}</option>)}
                </select>
              </div>

              {/* Filters toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all flex-shrink-0 ${
                  showFilters
                    ? 'bg-[#eef1ff] border-[#0028aa] text-[#0028aa]'
                    : 'border-[#eee] text-[#666] hover:border-[#c7d2fe]'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#0028aa] text-white text-[10px] font-bold flex items-center justify-center">
                    {activeCount}
                  </span>
                )}
              </button>

              {activeCount > 0 && (
                <button
                  onClick={clearAll}
                  className="flex items-center gap-1 px-3 py-2.5 rounded-xl text-sm font-semibold text-[#dc2626] hover:bg-[#fef2f2] transition-colors border border-transparent flex-shrink-0"
                >
                  <X className="w-3.5 h-3.5" /> Clear all
                </button>
              )}
            </div>

            {/* ── Expanded filter grid ── */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-[#f0f0f0]">
                <div className="grid grid-cols-1 gap-5">

                  {/* Location row */}
                  <div>
                    <p className="text-[10px] font-bold text-[#aaa] uppercase tracking-widest mb-2.5">Location</p>
                    <div className="flex flex-wrap gap-2">
                      <FilterPill label="State" value={state} onChange={v => { setState(v); setDistrict(''); }} options={Object.keys(districtsByState)} />
                      <FilterPill label="District" value={district} onChange={setDistrict} options={districtOpts} />
                    </div>
                  </div>

                  {/* Content row */}
                  <div>
                    <p className="text-[10px] font-bold text-[#aaa] uppercase tracking-widest mb-2.5">Content & Creator</p>
                    <div className="flex flex-wrap gap-2 items-center">
                      <FilterPill label="Category"  value={category}  onChange={setCategory}  options={categories} />
                      <FilterPill label="Gender"    value={gender}    onChange={setGender}    options={genders} />
                      <FilterPill label="Age Range" value={age}       onChange={setAge}       options={ageOpts} />
                      <FilterPill label="Language"  value={language}  onChange={setLanguage}  options={languages} />
                      <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer transition-colors text-sm font-semibold flex-shrink-0 select-none
                        border-[#eee] text-[#666] hover:border-[#c7d2fe]"
                        style={verifiedOnly ? { background: '#eef1ff', borderColor: '#0028aa', color: '#0028aa' } : {}}
                      >
                        <input
                          type="checkbox"
                          checked={verifiedOnly}
                          onChange={e => setVerified(e.target.checked)}
                          className="w-4 h-4 accent-[#0028aa]"
                        />
                        Verified badge
                        {verifiedOnly && <BadgeCheck className="w-4 h-4 text-[#059669]" />}
                      </label>
                    </div>
                  </div>

                  {/* Metrics row */}
                  <div>
                    <p className="text-[10px] font-bold text-[#aaa] uppercase tracking-widest mb-2.5">Metrics</p>
                    <div className="flex flex-wrap gap-2">
                      <FilterPill label="Followers"       value={follower}   onChange={setFollower}   options={followerOpts} />
                      <FilterPill label="Cost per post"   value={cost}       onChange={setCost}       options={costOpts} />
                      <FilterPill label="Engagement rate" value={engagement} onChange={setEngagement} options={engOpts} />
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* Active filter chips */}
            {activeChips.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {activeChips.map(f => (
                  <span
                    key={f.key}
                    className="flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full text-xs font-semibold bg-[#eef1ff] text-[#0028aa] cursor-pointer hover:bg-[#dde6ff] transition-colors"
                    onClick={f.clear}
                  >
                    {f.label}
                    <X className="w-3 h-3" />
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* ── Results ── */}
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#eee] p-16 text-center">
              <UsersIcon className="w-12 h-12 text-[#ccc] mx-auto mb-4" />
              <p className="font-heading font-bold text-lg text-[#1b1c19] mb-1">No creators found</p>
              <p className="text-sm text-[#888]">Try adjusting your filters</p>
              <button onClick={clearAll} className="mt-4 text-[#0028aa] text-sm font-semibold hover:underline">
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map(inf => {
                const tier = tierLabel(inf.follower_count);
                const bg   = avatarColor(inf.name);
                return (
                  <div
                    key={inf.id}
                    className="bg-white rounded-2xl border border-[#eee] p-5 hover:border-[#c7d2fe] hover:shadow-ambient-lg transition-all group"
                    data-testid={`influencer-card-${inf.id}`}
                  >
                    {/* Top: avatar + name + tier */}
                    <div className="flex items-start gap-3 mb-4">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-heading font-bold text-lg flex-shrink-0"
                        style={{ background: bg }}
                      >
                        {inf.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-heading font-bold text-[#1b1c19] truncate">{inf.name}</h3>
                          {inf.is_verified && <BadgeCheck className="w-4 h-4 text-[#059669] flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-[#888] flex items-center gap-1 mt-0.5">
                          <Instagram className="w-3 h-3" /> {inf.instagram_handle}
                        </p>
                      </div>
                      <span
                        className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0"
                        style={{ background: tier.bg, color: tier.color }}
                      >
                        {tier.label}
                      </span>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <StatPill icon={UsersIcon}  value={formatFollowers(inf.follower_count)} label="followers" />
                      <StatPill icon={TrendingUp} value={`${inf.engagement_rate}%`}           label="engagement" />
                      <StatPill icon={DollarSign} value={`₹${(inf.cost_per_post/1000).toFixed(1)}K`} label="per post" />
                    </div>

                    {/* Location + Language + Age */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#888] mb-4">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {inf.location_district}, {inf.location_state}
                      </span>
                      <span className="text-[#ddd]">·</span>
                      <span>{inf.content_language}</span>
                      <span className="text-[#ddd]">·</span>
                      <span className="capitalize">{inf.gender}</span>
                      {inf.age && (
                        <>
                          <span className="text-[#ddd]">·</span>
                          <span>{inf.age} yrs</span>
                        </>
                      )}
                    </div>

                    {/* Categories */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {inf.categories.slice(0, 3).map(cat => (
                        <span key={cat} className="px-2.5 py-1 bg-[#f8f9fa] rounded-full text-xs font-semibold text-[#666]">
                          {cat}
                        </span>
                      ))}
                      {inf.categories.length > 3 && (
                        <span className="px-2.5 py-1 bg-[#f8f9fa] rounded-full text-xs font-semibold text-[#aaa]">
                          +{inf.categories.length - 3}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => toast.success(`Booking ${inf.name} — coming soon!`)}
                      className="w-full py-2.5 rounded-xl bg-[#0028aa] text-white text-sm font-bold hover:bg-[#1a3fd4] transition-colors"
                      data-testid={`book-button-${inf.id}`}
                    >
                      Book Now
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatorsMarketplace;
