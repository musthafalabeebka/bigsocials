// Mock data for the application

export const mockCampaigns = [
  {
    id: '1',
    producer_id: 'producer-1',
    campaign_type: 'influencer_marketing',
    movie_title: 'Mission Impossible 8',
    poster_url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400',
    genre: ['Action', 'Thriller'],
    release_date: '2026-06-15',
    campaign_start_date: '2026-04-01',
    campaign_end_date: '2026-06-30',
    regions_state: ['Kerala', 'Tamil Nadu'],
    regions_district: ['Kochi', 'Chennai'],
    campaign_phases: ['announcement', 'teaser', 'trailer'],
    total_budget: 500000,
    budget_spent: 125000,
    follower_ranges: [
      { tier: 'micro', count: 10 },
      { tier: 'macro', count: 5 }
    ],
    influencer_categories: ['Lifestyle', 'Review', 'Film'],
    review_mode: 'automated',
    tone_language_preferences: 'Exciting, energetic, youthful',
    campaign_brief: 'Promote the latest Mission Impossible movie with high-energy content focusing on action sequences.',
    status: 'active',
    created_at: '2026-03-20T10:00:00Z'
  },
  {
    id: '2',
    producer_id: 'producer-1',
    campaign_type: 'moment_marketing',
    movie_title: 'The Romance Chronicles',
    poster_url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400',
    genre: ['Romance', 'Drama'],
    release_date: '2026-05-20',
    campaign_start_date: '2026-03-15',
    campaign_end_date: '2026-05-25',
    regions_state: ['Kerala'],
    regions_district: ['Thiruvananthapuram', 'Kochi'],
    campaign_phases: ['trailer', 'post_release'],
    total_budget: 300000,
    budget_spent: 180000,
    follower_ranges: [
      { tier: 'nano', count: 15 },
      { tier: 'micro', count: 8 }
    ],
    influencer_categories: ['Couples', 'Lifestyle', 'Family'],
    review_mode: 'manual',
    tone_language_preferences: 'Romantic, emotional, heartfelt',
    campaign_brief: 'Create heartwarming content about love and relationships to promote this romantic drama.',
    status: 'active',
    created_at: '2026-03-10T09:00:00Z'
  },
  {
    id: '3',
    producer_id: 'producer-1',
    campaign_type: 'influencer_marketing',
    movie_title: 'Comedy Nights',
    poster_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400',
    genre: ['Comedy'],
    release_date: '2026-04-30',
    campaign_start_date: '2026-02-01',
    campaign_end_date: '2026-05-05',
    regions_state: ['Tamil Nadu', 'Andhra Pradesh'],
    regions_district: ['Chennai', 'Hyderabad'],
    campaign_phases: ['announcement', 'teaser'],
    total_budget: 200000,
    budget_spent: 200000,
    follower_ranges: [
      { tier: 'micro', count: 12 }
    ],
    influencer_categories: ['Meme', 'Comedy', 'Youth'],
    review_mode: 'automated',
    tone_language_preferences: 'Funny, witty, entertaining',
    campaign_brief: 'Create hilarious memes and comedy sketches to promote this comedy film.',
    status: 'completed',
    created_at: '2026-01-25T11:00:00Z'
  }
];

export const mockInfluencers = [
  {
    id: 'inf-1',
    name: 'Priya Menon',
    email: 'priya@influencer.com',
    role: 'influencer',
    instagram_handle: '@priyamenon',
    follower_count: 85000,
    engagement_rate: 6.5,
    location_state: 'Kerala',
    location_district: 'Kochi',
    categories: ['Lifestyle', 'Fashion', 'Review'],
    gender: 'female',
    age: 26,
    cost_per_post: 8500,
    is_verified: true,
    account_type: 'creator'
  },
  {
    id: 'inf-2',
    name: 'Arjun Kumar',
    email: 'arjun@influencer.com',
    role: 'influencer',
    instagram_handle: '@arjunkumar',
    follower_count: 125000,
    engagement_rate: 7.2,
    location_state: 'Tamil Nadu',
    location_district: 'Chennai',
    categories: ['Film', 'Review', 'Youth'],
    gender: 'male',
    age: 29,
    cost_per_post: 12500,
    is_verified: true,
    account_type: 'creator'
  },
  {
    id: 'inf-3',
    name: 'Lakshmi & Rahul',
    email: 'couple@influencer.com',
    role: 'influencer',
    instagram_handle: '@lakshmirahul',
    follower_count: 65000,
    engagement_rate: 8.1,
    location_state: 'Kerala',
    location_district: 'Thiruvananthapuram',
    categories: ['Couples', 'Lifestyle', 'Family'],
    gender: 'couple',
    age: 28,
    cost_per_post: 6500,
    is_verified: true,
    account_type: 'creator'
  },
  {
    id: 'inf-4',
    name: 'Meme Master',
    email: 'memes@influencer.com',
    role: 'influencer',
    instagram_handle: '@mememaster',
    follower_count: 250000,
    engagement_rate: 9.5,
    location_state: 'Tamil Nadu',
    location_district: 'Chennai',
    categories: ['Meme', 'Comedy', 'Youth'],
    gender: 'male',
    age: 24,
    cost_per_post: 25000,
    is_verified: true,
    account_type: 'page'
  },
  {
    id: 'inf-5',
    name: 'Sneha Reddy',
    email: 'sneha@influencer.com',
    role: 'influencer',
    instagram_handle: '@snehareddy',
    follower_count: 45000,
    engagement_rate: 5.8,
    location_state: 'Andhra Pradesh',
    location_district: 'Hyderabad',
    categories: ['Lifestyle', 'Kids', 'Family'],
    gender: 'female',
    age: 31,
    cost_per_post: 4500,
    is_verified: true,
    account_type: 'creator'
  },
  {
    id: 'inf-6',
    name: 'Tech Reviewer',
    email: 'tech@influencer.com',
    role: 'influencer',
    instagram_handle: '@techreviewer',
    follower_count: 180000,
    engagement_rate: 6.9,
    location_state: 'Kerala',
    location_district: 'Kochi',
    categories: ['Review', 'Youth'],
    gender: 'male',
    age: 27,
    cost_per_post: 18000,
    is_verified: true,
    account_type: 'creator'
  }
];

export const mockCampaignRequests = [
  {
    id: 'req-1',
    campaign_id: '1',
    campaign: mockCampaigns[0],
    influencer_id: 'current-user',
    cost: 5000,
    request_status: 'pending',
    created_at: '2026-03-25T10:00:00Z'
  },
  {
    id: 'req-2',
    campaign_id: '2',
    campaign: mockCampaigns[1],
    influencer_id: 'current-user',
    cost: 5000,
    request_status: 'pending',
    created_at: '2026-03-22T14:30:00Z'
  }
];

export const mockActiveCampaigns = [
  {
    id: 'active-1',
    campaign_id: '1',
    campaign: mockCampaigns[0],
    influencer_id: 'current-user',
    cost: 5000,
    request_status: 'accepted',
    deliverables: [
      {
        id: 'del-1',
        phase: 'announcement',
        status: 'pending',
        script_content: null,
        video_link: null
      },
      {
        id: 'del-2',
        phase: 'teaser',
        status: 'submitted',
        script_content: 'Check out the amazing teaser of Mission Impossible 8! The action is insane...',
        video_link: null,
        submitted_at: '2026-03-28T10:00:00Z'
      }
    ]
  }
];

export const mockUsers = [
  {
    id: 'user-1',
    name: 'Rahul Sharma',
    email: 'rahul@producer.com',
    role: 'producer',
    production_house: 'Sharma Productions',
    is_active: true,
    created_at: '2026-01-15T09:00:00Z'
  },
  {
    id: 'user-2',
    name: 'New Influencer',
    email: 'newinfluencer@test.com',
    role: 'influencer',
    instagram_handle: '@newinfluencer',
    follower_count: 1500,
    is_verified: false,
    is_active: false,
    created_at: '2026-03-30T11:00:00Z'
  },
  ...mockInfluencers
];

export const mockBookingData = {
  total_collections: 250000000,
  total_marketing_spend: 42000000,
  total_roi: 495.2,
  efficiency_score: 87,
  daily_collections: [
    { date: '2026-03-25', amount: 5000000, day: 'Day 1' },
    { date: '2026-03-26', amount: 7500000, day: 'Day 2' },
    { date: '2026-03-27', amount: 6800000, day: 'Day 3' },
    { date: '2026-03-28', amount: 8200000, day: 'Day 4' },
    { date: '2026-03-29', amount: 9100000, day: 'Day 5' },
    { date: '2026-03-30', amount: 8500000, day: 'Day 6' },
    { date: '2026-03-31', amount: 7800000, day: 'Day 7' }
  ],
  region_wise: [
    { region: 'Kerala', amount: 50000000, percentage: 20 },
    { region: 'Tamil Nadu', amount: 120000000, percentage: 48 },
    { region: 'Andhra Pradesh', amount: 45000000, percentage: 18 },
    { region: 'Telangana', amount: 35000000, percentage: 14 }
  ],
  occupancy_rate: 78.5,
  screen_count: 1250,
  shows_per_day: 4500,
  top_theatres: [
    { theatre: 'PVR Lulu Kochi', city: 'Kochi', bookings: 18250, occupancy: 92, revenue: 4200000 },
    { theatre: 'INOX Marina Chennai', city: 'Chennai', bookings: 17680, occupancy: 90, revenue: 3980000 },
    { theatre: 'AMB Cinemas Hyderabad', city: 'Hyderabad', bookings: 16420, occupancy: 88, revenue: 3720000 },
    { theatre: 'Aries Plex Trivandrum', city: 'Thiruvananthapuram', bookings: 14880, occupancy: 84, revenue: 3310000 },
    { theatre: 'SPI Sathyam Chennai', city: 'Chennai', bookings: 14210, occupancy: 82, revenue: 3180000 }
  ],
  district_wise: [
    { district: 'Chennai', state: 'Tamil Nadu', bookings: 48200, revenue: 11000000, intensity: 96 },
    { district: 'Kochi', state: 'Kerala', bookings: 26800, revenue: 6100000, intensity: 74 },
    { district: 'Hyderabad', state: 'Telangana', bookings: 22100, revenue: 5400000, intensity: 68 },
    { district: 'Thiruvananthapuram', state: 'Kerala', bookings: 18400, revenue: 4300000, intensity: 55 },
    { district: 'Vijayawada', state: 'Andhra Pradesh', bookings: 16100, revenue: 3900000, intensity: 48 },
    { district: 'Coimbatore', state: 'Tamil Nadu', bookings: 13800, revenue: 3200000, intensity: 41 }
  ],
  marketing_vs_booking: [
    { week: 'Week 1', marketing_spend: 3500000, bookings: 12000, revenue: 2800000 },
    { week: 'Week 2', marketing_spend: 5200000, bookings: 18600, revenue: 4300000 },
    { week: 'Week 3', marketing_spend: 6100000, bookings: 23500, revenue: 5600000 },
    { week: 'Week 4', marketing_spend: 7800000, bookings: 31800, revenue: 7600000 },
    { week: 'Week 5', marketing_spend: 6900000, bookings: 29500, revenue: 7100000 },
    { week: 'Week 6', marketing_spend: 5400000, bookings: 24800, revenue: 5900000 },
    { week: 'Week 7', marketing_spend: 3900000, bookings: 20100, revenue: 4700000 }
  ]
};
