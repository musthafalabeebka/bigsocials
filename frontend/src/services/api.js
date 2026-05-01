import axios from 'axios';
import { mockCampaigns, mockUsers, mockActiveCampaigns } from '../data/mockData';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_URL = BACKEND_URL ? `${BACKEND_URL}/api` : null;
const useMockApi = !API_URL;
const MOCK_CAMPAIGNS_KEY = 'mock_campaigns';
const MOCK_DELIVERABLES_KEY = 'mock_deliverables';

const mockDelay = (data) =>
  new Promise((resolve) => {
    setTimeout(() => resolve({ data }), 150);
  });

const createCampaignId = () =>
  `campaign-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const createDeliverableId = () =>
  `deliverable-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const canUseStorage = typeof window !== 'undefined';

const getStoredJson = (key, fallback) => {
  if (!canUseStorage) {
    return fallback;
  }

  const raw = window.localStorage.getItem(key);
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

const setStoredJson = (key, value) => {
  if (!canUseStorage) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
};

const getMockCampaignStore = () => {
  const campaigns = getStoredJson(MOCK_CAMPAIGNS_KEY, null);
  if (campaigns) {
    return campaigns;
  }

  setStoredJson(MOCK_CAMPAIGNS_KEY, mockCampaigns);
  return mockCampaigns;
};

const saveMockCampaignStore = (campaigns) => {
  setStoredJson(MOCK_CAMPAIGNS_KEY, campaigns);
};

const getMockDeliverableStore = () => {
  const deliverables = getStoredJson(MOCK_DELIVERABLES_KEY, null);
  if (deliverables) {
    return deliverables;
  }

  const seeded = mockActiveCampaigns.flatMap((campaign) =>
    campaign.deliverables.map((deliverable) => ({
      ...deliverable,
      campaign_id: campaign.campaign_id,
      influencer_id: campaign.influencer_id,
      campaign_influencer_id: campaign.id,
      influencer:
        mockUsers.find((user) => user.id === campaign.influencer_id) ||
        demoUsers.influencer,
    }))
  );

  setStoredJson(MOCK_DELIVERABLES_KEY, seeded);
  return seeded;
};

const saveMockDeliverableStore = (deliverables) => {
  setStoredJson(MOCK_DELIVERABLES_KEY, deliverables);
};

const updateMockDeliverable = (deliverableId, updates) => {
  const deliverables = getMockDeliverableStore();
  const nextDeliverables = deliverables.map((deliverable) =>
    deliverable.id === deliverableId ? { ...deliverable, ...updates } : deliverable
  );

  saveMockDeliverableStore(nextDeliverables);
  return nextDeliverables.find((deliverable) => deliverable.id === deliverableId);
};

const getMockCampaignById = (campaignId) =>
  getMockCampaignStore().find((campaign) => campaign.id === campaignId);

const buildTracker = (deliverables) => {
  const tracker = {
    newly_added: [],
    pending: [],
    submitted: [],
    accepted: [],
    rejected: [],
    live: [],
  };

  deliverables.forEach((deliverable) => {
    if (deliverable.status === 'newly_added') {
      tracker.newly_added.push(deliverable);
    } else if (deliverable.status === 'pending') {
      tracker.pending.push(deliverable);
    } else if (
      deliverable.status === 'submitted' ||
      deliverable.status === 'under_review'
    ) {
      tracker.submitted.push(deliverable);
    } else if (deliverable.status === 'approved') {
      tracker.accepted.push(deliverable);
    } else if (deliverable.status === 'rejected') {
      tracker.rejected.push(deliverable);
    } else if (deliverable.status === 'live') {
      tracker.live.push(deliverable);
    }
  });

  return tracker;
};

const createMockDeliverablesForCampaign = (campaignId, influencerIds) => {
  const campaign = getMockCampaignById(campaignId);
  if (!campaign) {
    return [];
  }

  const existing = getMockDeliverableStore().filter(
    (deliverable) => deliverable.campaign_id === campaignId
  );
  if (existing.length > 0) {
    return existing;
  }

  const deliverables = influencerIds.flatMap((influencerId) => {
    const influencer =
      mockUsers.find((user) => user.id === influencerId) ||
      (influencerId === demoUsers.influencer.id ? demoUsers.influencer : null);

    return (campaign.campaign_phases || []).map((phase, index) => ({
      id: createDeliverableId(),
      campaign_id: campaignId,
      influencer_id: influencerId,
      campaign_influencer_id: `ci-${campaignId}-${influencerId}`,
      influencer,
      phase,
      status: index === 0 ? 'newly_added' : 'pending',
      script_content: null,
      video_link: null,
      created_at: new Date().toISOString(),
    }));
  });

  const updated = [...getMockDeliverableStore(), ...deliverables];
  saveMockDeliverableStore(updated);
  return deliverables;
};

const demoUsers = {
  admin: {
    id: 'admin-1',
    email: 'admin@movie.com',
    name: 'Platform Admin',
    role: 'admin',
    is_active: true,
  },
  producer: {
    id: 'producer-1',
    email: 'producer@test.com',
    name: 'Demo Producer',
    role: 'producer',
    production_house: 'Demo Producer Co',
    gst_number: '22AAAAA0000A1Z5',
    website: 'https://bigsocialstudios.example',
    mobile: '+91 98765 43210',
    is_active: true,
  },
  brand: {
    id: 'brand-1',
    email: 'brand@test.com',
    name: 'Demo Brand',
    role: 'producer',
    account_type: 'brand',
    production_house: 'Demo Brand Co',
    gst_number: '22BBBBB0000B1Z5',
    website: 'https://demobrand.example',
    mobile: '+91 98765 43211',
    is_active: true,
  },
  influencer: {
    ...mockUsers.find((user) => user.role === 'influencer'),
    id: 'influencer-demo-1',
    email: 'influencer@test.com',
    name: 'Demo Influencer',
    role: 'influencer',
    instagram_handle: '@demoinfluencer',
    follower_count: 85000,
    engagement_rate: 6.5,
    location_state: 'Kerala',
    location_district: 'Kochi',
    categories: ['Lifestyle', 'Review', 'Film'],
    gender: 'female',
    age: 26,
    cost_per_post: 8500,
    is_verified: true,
    is_active: true,
    account_type: 'creator',
    mobile: '+91 98765 43210',
  },
  actor: {
    ...mockUsers.find((user) => user.role === 'influencer'),
    id: 'actor-demo-1',
    email: 'actor@test.com',
    name: 'Nivin Pauly',
    role: 'influencer',
    instagram_handle: '@demoactor',
    follower_count: 185000,
    engagement_rate: 7.2,
    location_state: 'Kerala',
    location_district: 'Kochi',
    categories: ['Actor', 'Film', 'Lifestyle'],
    gender: 'male',
    age: 31,
    cost_per_post: 25000,
    is_verified: true,
    is_active: true,
    account_type: 'actor',
    mobile: '+91 98765 43212',
  },
  vendors: {
    billboards: {
      id: 'vendor-billboards-demo',
      email: 'billboards.vendor@test.com',
      name: 'Billboards Vendor',
      role: 'vendor',
      company_name: 'Skyline Outdoor Media',
      vendor_type: 'billboards',
      vendor_type_label: 'Billboards',
      onboarding_completed: true,
      is_active: true,
    },
    media: {
      id: 'vendor-media-demo',
      email: 'media.vendor@test.com',
      name: 'Media Vendor',
      role: 'vendor',
      company_name: 'Amplify Media Network',
      vendor_type: 'media',
      vendor_type_label: 'Media',
      onboarding_completed: true,
      is_active: true,
    },
    brands: {
      id: 'vendor-brands-demo',
      email: 'brands.vendor@test.com',
      name: 'Brands Vendor',
      role: 'vendor',
      company_name: 'Brand Connect Partners',
      vendor_type: 'brands',
      vendor_type_label: 'Brands',
      onboarding_completed: true,
      is_active: true,
    },
    ambassadors: {
      id: 'vendor-ambassadors-demo',
      email: 'ambassadors.vendor@test.com',
      name: 'Ambassadors Vendor',
      role: 'vendor',
      company_name: 'Community Reach Collective',
      vendor_type: 'ambassadors',
      vendor_type_label: 'Ambassadors',
      onboarding_completed: true,
      is_active: true,
    },
    fieldAgents: {
      id: 'vendor-field-agents-demo',
      email: 'fieldagents.vendor@test.com',
      name: 'Field Agents Vendor',
      role: 'vendor',
      company_name: 'Ground Force Activations',
      vendor_type: 'field-agents',
      vendor_type_label: 'Field Agents',
      onboarding_completed: true,
      is_active: true,
    },
  },
};

const mockAdminDashboard = {
  total_users: mockUsers.length + 2,
  total_producers: 1,
  total_influencers: mockUsers.filter((user) => user.role === 'influencer').length + 1,
  total_campaigns: mockCampaigns.length,
  total_revenue: 245000,
  pending_verifications: mockUsers.filter(
    (user) => user.role === 'influencer' && !user.is_verified
  ).length,
};

const mockProducerDashboard = {
  total_campaigns: mockCampaigns.length,
  active_campaigns: mockCampaigns.filter((campaign) => campaign.status === 'active').length,
  total_budget: mockCampaigns.reduce((sum, campaign) => sum + campaign.total_budget, 0),
  total_spent: mockCampaigns.reduce((sum, campaign) => sum + campaign.budget_spent, 0),
  total_influencers: mockCampaigns.reduce(
    (sum, campaign) =>
      sum + campaign.follower_ranges.reduce((count, range) => count + range.count, 0),
    0
  ),
  campaigns: mockCampaigns,
};

const mockInfluencerDashboard = {
  total_earnings: 18500,
  active_campaigns: mockActiveCampaigns.filter(
    (campaign) => campaign.request_status === 'accepted'
  ).length,
  pending_requests: 2,
  total_campaigns: mockActiveCampaigns.length + 2,
  payment_history: [
    {
      id: 'payment-1',
      released_at: '2026-03-28T10:00:00Z',
      final_amount: 8500,
      platform_commission: 10,
    },
    {
      id: 'payment-2',
      released_at: '2026-03-16T10:00:00Z',
      final_amount: 10000,
      platform_commission: 10,
    },
  ],
};

const buildMockUser = (email, role) => {
  if (role === 'admin' && email === demoUsers.admin.email) {
    return demoUsers.admin;
  }

  if (role === 'producer' && email === demoUsers.producer.email) {
    return demoUsers.producer;
  }

  if (role === 'producer' && email === demoUsers.brand.email) {
    return demoUsers.brand;
  }

  if (role === 'influencer' && email === demoUsers.influencer.email) {
    return demoUsers.influencer;
  }

  if (role === 'influencer' && email === demoUsers.actor.email) {
    return demoUsers.actor;
  }

  if (role === 'vendor') {
    const vendorUser = Object.values(demoUsers.vendors).find(
      (vendor) => vendor.email === email
    );

    if (vendorUser) {
      return vendorUser;
    }
  }

  return null;
};

const createMockError = (message, status = 401) => {
  const error = new Error(message);
  error.response = {
    status,
    data: {
      detail: message,
    },
  };
  return error;
};

// Create axios instance
const api = axios.create({
  baseURL: API_URL ?? undefined,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API
export const authAPI = {
  login: async (email, password, role) => {
    if (useMockApi) {
      const user = buildMockUser(email, role);

      if (!user) {
        throw createMockError('Invalid credentials');
      }

      if (role === 'admin' && password !== 'admin123') {
        throw createMockError('Invalid credentials');
      }

      return mockDelay({ user, message: 'Login successful' });
    }

    return api.post('/auth/login', { email, password, role });
  },

  registerProducer: async (data) => {
    if (useMockApi) {
      return mockDelay({
        user: {
          ...demoUsers.producer,
          ...data,
          id: 'producer-registered-demo',
          role: 'producer',
          is_active: true,
        },
        message: 'Producer registered successfully',
      });
    }

    return api.post('/auth/register/producer', data);
  },

  registerInfluencer: async (data) => {
    if (useMockApi) {
      const requiresVerification = Number(data.follower_count || 0) < 2000;

      return mockDelay({
        user: {
          ...demoUsers.influencer,
          ...data,
          id: 'influencer-registered-demo',
          role: 'influencer',
          is_active: true,
          is_verified: !requiresVerification,
        },
        message: 'Influencer registered successfully',
        requires_verification: requiresVerification,
      });
    }

    return api.post('/auth/register/influencer', data);
  },

  registerVendor: async (data) => {
    if (useMockApi) {
      return mockDelay({
        user: {
          ...demoUsers.vendors.billboards,
          ...data,
          id: 'vendor-registered-demo',
          role: 'vendor',
          onboarding_completed: false,
          is_active: true,
        },
        message: 'Vendor registered successfully',
      });
    }

    return api.post('/auth/register/vendor', data);
  },
};

// User API
export const userAPI = {
  getUsers: (role) =>
    api.get('/users', { params: { role } }),

  getUser: (userId) =>
    api.get(`/users/${userId}`),

  updateUser: (userId, updates) =>
    api.put(`/users/${userId}`, updates),
};

// Campaign API
export const campaignAPI = {
  createCampaign: (data, producerId) => {
    if (useMockApi) {
      const campaign = {
        id: createCampaignId(),
        producer_id: producerId,
        campaign_type: data.campaign_type,
        movie_title: data.movie_title,
        poster_url: data.poster_url || '',
        genre: data.genre || [],
        release_date: data.release_date,
        campaign_start_date: data.campaign_start_date || data.release_date,
        campaign_end_date: data.campaign_end_date || data.release_date,
        regions_state: data.regions_state || [],
        regions_district: data.regions_district || [],
        campaign_phases: data.campaign_phases || [],
        total_budget: Number(data.total_budget || 0),
        budget_spent: 0,
        follower_ranges: data.follower_ranges || [],
        influencer_categories: data.influencer_categories || [],
        review_mode: data.review_mode,
        tone_language_preferences: data.tone_language_preferences || '',
        campaign_brief: data.campaign_brief || '',
        status: 'active',
        created_at: new Date().toISOString(),
      };

      saveMockCampaignStore([campaign, ...getMockCampaignStore()]);

      return mockDelay({
        campaign,
        message: 'Campaign created successfully',
      });
    }

    return api.post('/campaigns', data, { params: { producer_id: producerId } });
  },

  getCampaigns: (producerId, status) => {
    if (useMockApi) {
      let campaigns = getMockCampaignStore();
      if (producerId) {
        campaigns = campaigns.filter((campaign) => campaign.producer_id === producerId);
      }
      if (status) {
        campaigns = campaigns.filter((campaign) => campaign.status === status);
      }

      return mockDelay({ campaigns });
    }

    return api.get('/campaigns', { params: { producer_id: producerId, status } });
  },

  getCampaign: (campaignId) => {
    if (useMockApi) {
      const campaign = getMockCampaignById(campaignId);
      if (!campaign) {
        throw createMockError('Campaign not found', 404);
      }

      return mockDelay({ campaign });
    }

    return api.get(`/campaigns/${campaignId}`);
  },

  updateCampaign: (campaignId, updates) =>
    api.put(`/campaigns/${campaignId}`, updates),

  getRecommendations: (campaignId) =>
    api.post(`/campaigns/${campaignId}/recommendations`),

  sendRequests: (campaignId, influencerIds) =>
    api.post(`/campaigns/${campaignId}/send-requests`, { influencer_ids: influencerIds }),
};

// Influencer API
export const influencerAPI = {
  getInfluencers: (filters) =>
    api.get('/influencers', { params: filters }),

  respondToCampaign: (influencerId, campaignInfluencerId, accepted) =>
    api.post(`/influencers/${influencerId}/respond`, {
      campaign_influencer_id: campaignInfluencerId,
      accepted,
    }),
};

// Deliverable API
export const deliverableAPI = {
  getCampaignDeliverables: (campaignId) => {
    if (useMockApi) {
      const deliverables = getMockDeliverableStore().filter(
        (deliverable) => deliverable.campaign_id === campaignId
      );
      return mockDelay({ deliverables });
    }

    return api.get(`/deliverables/campaign/${campaignId}`);
  },

  getInfluencerDeliverables: (influencerId) =>
    api.get(`/deliverables/influencer/${influencerId}`),

  getTracker: (campaignId) => {
    if (useMockApi) {
      const deliverables = getMockDeliverableStore().filter(
        (deliverable) => deliverable.campaign_id === campaignId
      );
      return mockDelay(buildTracker(deliverables));
    }

    return api.get(`/deliverables/tracker/${campaignId}`);
  },

  submitScript: (deliverableId, scriptContent) =>
    useMockApi
      ? mockDelay({
          message: 'Script submitted successfully',
          deliverable: updateMockDeliverable(deliverableId, {
            script_content: scriptContent,
            status: 'submitted',
            submitted_at: new Date().toISOString(),
          }),
        })
      : api.post('/deliverables/submit-script', {
          deliverable_id: deliverableId,
          script_content: scriptContent,
        }),

  submitVideo: (deliverableId, videoLink) =>
    useMockApi
      ? mockDelay({
          message: 'Video link submitted successfully',
          deliverable: updateMockDeliverable(deliverableId, {
            video_link: videoLink,
            status: 'live',
            post_detected_live: true,
          }),
        })
      : api.post('/deliverables/submit-video', {
          deliverable_id: deliverableId,
          video_link: videoLink,
        }),

  reviewScript: (deliverableId, approved, feedback) =>
    useMockApi
      ? mockDelay({
          message: 'Script reviewed successfully',
          deliverable: updateMockDeliverable(deliverableId, {
            status: approved ? 'approved' : 'rejected',
            review_feedback: feedback,
            reviewed_at: new Date().toISOString(),
          }),
        })
      : api.post('/deliverables/review', {
          deliverable_id: deliverableId,
          approved,
          feedback,
        }),

  aiReviewScript: (deliverableId) =>
    api.post('/ai/review-script', null, { params: { deliverable_id: deliverableId } }),
};

// Payment API
export const paymentAPI = {
  initiatePayment: (campaignId, producerId, amount) =>
    api.post('/payments/initiate', {
      campaign_id: campaignId,
      producer_id: producerId,
      amount,
    }),

  getPaymentHistory: (userId, role) =>
    api.get(`/payments/history/${userId}`, { params: { role } }),
};

// Analytics API
export const analyticsAPI = {
  getProducerDashboard: (producerId) => {
    if (useMockApi) {
      return mockDelay({
        ...mockProducerDashboard,
        producer_id: producerId,
      });
    }

    return api.get(`/analytics/producer-dashboard/${producerId}`);
  },

  getInfluencerDashboard: (influencerId) => {
    if (useMockApi) {
      return mockDelay({
        ...mockInfluencerDashboard,
        influencer_id: influencerId,
      });
    }

    return api.get(`/analytics/influencer-dashboard/${influencerId}`);
  },

  getCampaignAnalytics: (campaignId) =>
    api.get(`/analytics/campaign/${campaignId}`),
};

// Notification API
export const notificationAPI = {
  getNotifications: (userId, unreadOnly = false) =>
    api.get(`/notifications/${userId}`, { params: { unread_only: unreadOnly } }),

  markAsRead: (notificationId) =>
    api.put(`/notifications/${notificationId}/read`),
};

// Admin API
export const adminAPI = {
  getDashboard: () => {
    if (useMockApi) {
      return mockDelay(mockAdminDashboard);
    }

    return api.get('/admin/dashboard');
  },

  verifyInfluencer: (influencerId, approved) =>
    api.post(`/admin/verify-influencer/${influencerId}`, { approved }),

  getSettings: () =>
    api.get('/admin/settings'),

  updateSettings: (updates) =>
    api.put('/admin/settings', updates),
};

// Booking Analytics API
export const bookingAnalyticsAPI = {
  purchase: (producerId, durationDays) =>
    api.post('/booking-analytics/purchase', {
      producer_id: producerId,
      duration_days: durationDays,
    }),

  getData: (producerId) =>
    api.get('/booking-analytics/data', { params: { producer_id: producerId } }),
};

export const mockCampaignFlowAPI = {
  confirmInfluencers: async (campaignId, influencerIds) => {
    if (!useMockApi) {
      return mockDelay({ status: 'noop' });
    }

    const deliverables = createMockDeliverablesForCampaign(campaignId, influencerIds);
    return mockDelay({
      status: 'success',
      message: 'Influencers confirmed and deliverables created',
      deliverables,
    });
  },
};

export default api;
