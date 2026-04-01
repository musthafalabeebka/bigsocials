-- BigSocials Supabase Schema
-- Run this in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    -- Admin
    password_hash TEXT,
    -- Producer
    gst_number TEXT,
    website TEXT,
    -- Shared contact
    mobile TEXT,
    -- Influencer
    age INTEGER,
    account_type TEXT,
    instagram_handle TEXT,
    follower_count INTEGER DEFAULT 0,
    engagement_rate FLOAT DEFAULT 0.0,
    location_state TEXT,
    location_district TEXT,
    categories JSONB DEFAULT '[]',
    gender TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    audience_demographics JSONB,
    recent_posts JSONB,
    cost_per_post FLOAT DEFAULT 0.0
);

CREATE TABLE IF NOT EXISTS campaigns (
    id TEXT PRIMARY KEY,
    producer_id TEXT NOT NULL,
    campaign_type TEXT NOT NULL,
    movie_title TEXT NOT NULL,
    poster_url TEXT,
    genre JSONB DEFAULT '[]',
    release_date TIMESTAMPTZ,
    campaign_start_date TIMESTAMPTZ,
    campaign_end_date TIMESTAMPTZ,
    regions_state JSONB DEFAULT '[]',
    regions_district JSONB DEFAULT '[]',
    campaign_phases JSONB DEFAULT '[]',
    total_budget FLOAT DEFAULT 0,
    follower_ranges JSONB DEFAULT '[]',
    influencer_categories JSONB DEFAULT '[]',
    review_mode TEXT,
    tone_language_preferences TEXT,
    campaign_brief TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    budget_spent FLOAT DEFAULT 0.0
);

CREATE TABLE IF NOT EXISTS campaign_influencers (
    id TEXT PRIMARY KEY,
    campaign_id TEXT NOT NULL,
    influencer_id TEXT NOT NULL,
    request_status TEXT DEFAULT 'pending',
    cost FLOAT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    responded_at TIMESTAMPTZ,
    payment_released BOOLEAN DEFAULT FALSE,
    payment_released_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS deliverables (
    id TEXT PRIMARY KEY,
    campaign_id TEXT NOT NULL,
    influencer_id TEXT NOT NULL,
    campaign_influencer_id TEXT NOT NULL,
    phase TEXT,
    script_content TEXT,
    video_link TEXT,
    status TEXT DEFAULT 'pending',
    submitted_at TIMESTAMPTZ,
    reviewed_at TIMESTAMPTZ,
    review_feedback TEXT,
    ai_review_result JSONB,
    post_detected_live BOOLEAN DEFAULT FALSE,
    engagement_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY,
    campaign_id TEXT NOT NULL,
    producer_id TEXT NOT NULL,
    amount FLOAT DEFAULT 0,
    payment_gateway_id TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payment_releases (
    id TEXT PRIMARY KEY,
    payment_id TEXT,
    influencer_id TEXT NOT NULL,
    campaign_influencer_id TEXT NOT NULL,
    amount FLOAT DEFAULT 0,
    platform_commission FLOAT DEFAULT 15.0,
    final_amount FLOAT DEFAULT 0,
    status TEXT DEFAULT 'pending',
    released_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT,
    message TEXT,
    type TEXT,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS platform_settings (
    id TEXT PRIMARY KEY,
    platform_commission FLOAT DEFAULT 15.0,
    auto_release_timer INTEGER DEFAULT 72,
    influencer_verification_threshold INTEGER DEFAULT 2000,
    booking_analytics_pricing JSONB DEFAULT '{"30_days": 50000, "45_days": 70000}',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS booking_analytics_access (
    id TEXT PRIMARY KEY,
    producer_id TEXT NOT NULL,
    duration_days INTEGER,
    amount_paid FLOAT DEFAULT 0,
    activated_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS razorpay_orders (
    id TEXT PRIMARY KEY,
    campaign_id TEXT NOT NULL,
    producer_id TEXT NOT NULL,
    razorpay_order_id TEXT,
    amount FLOAT DEFAULT 0,
    currency TEXT DEFAULT 'INR',
    status TEXT DEFAULT 'created',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    paid_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS razorpay_payments (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    razorpay_payment_id TEXT,
    razorpay_order_id TEXT,
    razorpay_signature TEXT,
    amount FLOAT DEFAULT 0,
    status TEXT DEFAULT 'captured',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS escrow_releases (
    id TEXT PRIMARY KEY,
    payment_id TEXT,
    campaign_influencer_id TEXT NOT NULL,
    influencer_id TEXT NOT NULL,
    amount FLOAT DEFAULT 0,
    platform_commission FLOAT DEFAULT 15.0,
    final_amount FLOAT DEFAULT 0,
    status TEXT DEFAULT 'held',
    released_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
