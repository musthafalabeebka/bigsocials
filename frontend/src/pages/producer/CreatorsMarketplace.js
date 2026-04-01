import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Button from '../../components/Button';
import {
  Search,
  MapPin,
  Users as UsersIcon,
  TrendingUp,
  DollarSign,
  BadgeCheck,
  Languages,
} from 'lucide-react';
import { mockInfluencers } from '../../data/mockData';
import { toast } from 'sonner';

const contentLanguageByInfluencer = {
  'inf-1': 'Malayalam',
  'inf-2': 'Tamil',
  'inf-3': 'Malayalam',
  'inf-4': 'Tamil',
  'inf-5': 'Telugu',
  'inf-6': 'Malayalam',
};

const enrichedInfluencers = mockInfluencers.map((influencer) => ({
  ...influencer,
  content_language: contentLanguageByInfluencer[influencer.id] || 'English',
}));

const states = ['Kerala', 'Tamil Nadu', 'Andhra Pradesh', 'Telangana'];
const districts = ['Kochi', 'Chennai', 'Thiruvananthapuram', 'Hyderabad'];
const categories = ['Lifestyle', 'Couples', 'Family', 'Youth', 'Kids', 'Music', 'Meme', 'Review', 'Film'];
const followerRanges = [
  { label: '1K - 10K', min: 1000, max: 10000 },
  { label: '10K - 50K', min: 10000, max: 50000 },
  { label: '50K - 100K', min: 50000, max: 100000 },
  { label: '100K - 250K', min: 100000, max: 250000 },
  { label: '250K+', min: 250000, max: Number.POSITIVE_INFINITY },
];
const costRanges = [
  { label: 'Up to ₹5K', min: 0, max: 5000 },
  { label: '₹5K - ₹10K', min: 5000, max: 10000 },
  { label: '₹10K - ₹20K', min: 10000, max: 20000 },
  { label: '₹20K+', min: 20000, max: Number.POSITIVE_INFINITY },
];
const engagementRanges = [
  { label: 'Up to 5%', min: 0, max: 5 },
  { label: '5% - 7%', min: 5, max: 7 },
  { label: '7% - 9%', min: 7, max: 9 },
  { label: '9%+', min: 9, max: Number.POSITIVE_INFINITY },
];
const ageRanges = [
  { label: '18 - 24', min: 18, max: 24 },
  { label: '25 - 30', min: 25, max: 30 },
  { label: '31 - 40', min: 31, max: 40 },
];
const genders = ['male', 'female', 'couple'];
const contentLanguages = ['Malayalam', 'Tamil', 'Telugu', 'English'];

const matchesRange = (value, range) => {
  if (!range) {
    return true;
  }

  return value >= range.min && value <= range.max;
};

const CreatorsMarketplace = () => {
  const [filters, setFilters] = useState({
    search: '',
    state: '',
    district: '',
    category: '',
    followerRange: '',
    costRange: '',
    engagementRange: '',
    gender: '',
    ageRange: '',
    verifiedOnly: false,
    contentLanguage: '',
  });

  const filteredInfluencers = enrichedInfluencers.filter((influencer) => {
    const followerRange = followerRanges.find((range) => range.label === filters.followerRange);
    const costRange = costRanges.find((range) => range.label === filters.costRange);
    const engagementRange = engagementRanges.find(
      (range) => range.label === filters.engagementRange
    );
    const ageRange = ageRanges.find((range) => range.label === filters.ageRange);

    if (
      filters.search &&
      !`${influencer.name} ${influencer.instagram_handle}`
        .toLowerCase()
        .includes(filters.search.toLowerCase())
    ) {
      return false;
    }

    if (filters.state && influencer.location_state !== filters.state) {
      return false;
    }

    if (filters.district && influencer.location_district !== filters.district) {
      return false;
    }

    if (filters.category && !influencer.categories.includes(filters.category)) {
      return false;
    }

    if (!matchesRange(influencer.follower_count, followerRange)) {
      return false;
    }

    if (!matchesRange(influencer.cost_per_post, costRange)) {
      return false;
    }

    if (!matchesRange(influencer.engagement_rate, engagementRange)) {
      return false;
    }

    if (filters.gender && influencer.gender !== filters.gender) {
      return false;
    }

    if (!matchesRange(influencer.age, ageRange)) {
      return false;
    }

    if (filters.verifiedOnly && !influencer.is_verified) {
      return false;
    }

    if (filters.contentLanguage && influencer.content_language !== filters.contentLanguage) {
      return false;
    }

    return true;
  });

  const handleBook = (influencer) => {
    toast.success(`Booking ${influencer.name} - Feature coming soon!`);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      state: '',
      district: '',
      category: '',
      followerRange: '',
      costRange: '',
      engagementRange: '',
      gender: '',
      ageRange: '',
      verifiedOnly: false,
      contentLanguage: '',
    });
  };

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <div className="flex-1">
        <div className="bg-surface-container-lowest border-b border-outline-variant/20 p-8">
          <h1 className="text-4xl font-heading font-bold text-on-surface mb-2">
            Creators Marketplace
          </h1>
          <p className="text-lg font-body text-muted-foreground">
            Discover and book influencers for your campaigns
          </p>
        </div>

        <div className="p-8">
          <div className="bg-surface-container-lowest rounded-DEFAULT shadow-ambient p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <div className="xl:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search influencers..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-surface-container-highest border-2 border-transparent focus:border-primary focus:outline-none font-body"
                  />
                </div>
              </div>

              <select
                value={filters.state}
                onChange={(e) => setFilters({ ...filters, state: e.target.value })}
                className="px-4 py-3 rounded-lg bg-surface-container-highest border-2 border-transparent focus:border-primary focus:outline-none font-body"
              >
                <option value="">Location — State</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>

              <select
                value={filters.district}
                onChange={(e) => setFilters({ ...filters, district: e.target.value })}
                className="px-4 py-3 rounded-lg bg-surface-container-highest border-2 border-transparent focus:border-primary focus:outline-none font-body"
              >
                <option value="">Location — District</option>
                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>

              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="px-4 py-3 rounded-lg bg-surface-container-highest border-2 border-transparent focus:border-primary focus:outline-none font-body"
              >
                <option value="">Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={filters.followerRange}
                onChange={(e) => setFilters({ ...filters, followerRange: e.target.value })}
                className="px-4 py-3 rounded-lg bg-surface-container-highest border-2 border-transparent focus:border-primary focus:outline-none font-body"
              >
                <option value="">Follower Range</option>
                {followerRanges.map((range) => (
                  <option key={range.label} value={range.label}>
                    {range.label}
                  </option>
                ))}
              </select>

              <select
                value={filters.costRange}
                onChange={(e) => setFilters({ ...filters, costRange: e.target.value })}
                className="px-4 py-3 rounded-lg bg-surface-container-highest border-2 border-transparent focus:border-primary focus:outline-none font-body"
              >
                <option value="">Cost Range</option>
                {costRanges.map((range) => (
                  <option key={range.label} value={range.label}>
                    {range.label}
                  </option>
                ))}
              </select>

              <select
                value={filters.engagementRange}
                onChange={(e) => setFilters({ ...filters, engagementRange: e.target.value })}
                className="px-4 py-3 rounded-lg bg-surface-container-highest border-2 border-transparent focus:border-primary focus:outline-none font-body"
              >
                <option value="">Engagement Rate</option>
                {engagementRanges.map((range) => (
                  <option key={range.label} value={range.label}>
                    {range.label}
                  </option>
                ))}
              </select>

              <select
                value={filters.gender}
                onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                className="px-4 py-3 rounded-lg bg-surface-container-highest border-2 border-transparent focus:border-primary focus:outline-none font-body capitalize"
              >
                <option value="">Gender</option>
                {genders.map((gender) => (
                  <option key={gender} value={gender}>
                    {gender}
                  </option>
                ))}
              </select>

              <select
                value={filters.ageRange}
                onChange={(e) => setFilters({ ...filters, ageRange: e.target.value })}
                className="px-4 py-3 rounded-lg bg-surface-container-highest border-2 border-transparent focus:border-primary focus:outline-none font-body"
              >
                <option value="">Age</option>
                {ageRanges.map((range) => (
                  <option key={range.label} value={range.label}>
                    {range.label}
                  </option>
                ))}
              </select>

              <select
                value={filters.contentLanguage}
                onChange={(e) => setFilters({ ...filters, contentLanguage: e.target.value })}
                className="px-4 py-3 rounded-lg bg-surface-container-highest border-2 border-transparent focus:border-primary focus:outline-none font-body"
              >
                <option value="">Content Language</option>
                {contentLanguages.map((language) => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>

              <label className="flex items-center gap-3 px-4 py-3 rounded-lg bg-surface-container-highest font-body">
                <input
                  type="checkbox"
                  checked={filters.verifiedOnly}
                  onChange={(e) => setFilters({ ...filters, verifiedOnly: e.target.checked })}
                  className="w-4 h-4"
                />
                Verified Badge
              </label>

              <Button variant="ghost" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInfluencers.map((influencer) => (
              <div
                key={influencer.id}
                className="bg-surface-container-lowest rounded-DEFAULT shadow-ambient p-6 hover:shadow-ambient-lg transition-all"
                data-testid={`influencer-card-${influencer.id}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-heading font-bold text-on-surface mb-1">
                      {influencer.name}
                    </h3>
                    <p className="text-sm font-mono text-muted-foreground mb-2">
                      {influencer.instagram_handle}
                    </p>
                  </div>
                  {influencer.is_verified && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-success/10 text-success text-xs font-mono uppercase rounded-full">
                      <BadgeCheck className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm font-body text-muted-foreground">
                    <UsersIcon className="w-4 h-4" />
                    <span className="font-mono font-semibold text-on-surface">
                      {influencer.follower_count.toLocaleString()}
                    </span>
                    <span>followers</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-body text-muted-foreground">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-mono font-semibold text-on-surface">
                      {influencer.engagement_rate}%
                    </span>
                    <span>engagement</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-body text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {influencer.location_district}, {influencer.location_state}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-body text-muted-foreground">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-mono font-semibold text-on-surface">
                      ₹{influencer.cost_per_post.toLocaleString()}
                    </span>
                    <span>per post</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-body text-muted-foreground">
                    <Languages className="w-4 h-4" />
                    <span>{influencer.content_language}</span>
                  </div>
                  <div className="text-sm font-body text-muted-foreground">
                    Gender: <span className="font-semibold text-on-surface capitalize">{influencer.gender}</span> • Age:{' '}
                    <span className="font-semibold text-on-surface">{influencer.age}</span>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap mb-4">
                  {influencer.categories.slice(0, 3).map((cat) => (
                    <span
                      key={cat}
                      className="px-2 py-1 bg-surface-container-high rounded text-xs font-body"
                    >
                      {cat}
                    </span>
                  ))}
                </div>

                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => handleBook(influencer)}
                  data-testid={`book-button-${influencer.id}`}
                >
                  Book Now
                </Button>
              </div>
            ))}
          </div>

          {filteredInfluencers.length === 0 && (
            <div className="bg-surface-container-lowest rounded-DEFAULT shadow-ambient p-12 text-center">
              <UsersIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-body text-muted-foreground">
                No influencers found matching your filters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatorsMarketplace;
