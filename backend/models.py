from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict
from datetime import datetime
from enum import Enum
import uuid


# Enums
class UserRole(str, Enum):
    ADMIN = "admin"
    PRODUCER = "producer"
    INFLUENCER = "influencer"


class CampaignType(str, Enum):
    INFLUENCER_MARKETING = "influencer_marketing"
    MOMENT_MARKETING = "moment_marketing"


class CampaignPhase(str, Enum):
    ANNOUNCEMENT = "announcement"
    TEASER = "teaser"
    TRAILER = "trailer"
    POST_RELEASE = "post_release"


class ReviewMode(str, Enum):
    MANUAL = "manual"
    AUTOMATED = "automated"


class DeliverableStatus(str, Enum):
    NEWLY_ADDED = "newly_added"
    PENDING = "pending"
    SUBMITTED = "submitted"
    UNDER_REVIEW = "under_review"
    APPROVED = "approved"
    REJECTED = "rejected"
    LIVE = "live"


class InfluencerTier(str, Enum):
    NANO = "nano"  # 1K-10K
    MICRO = "micro"  # 10K-100K
    MACRO = "macro"  # 100K-1M
    MEGA = "mega"  # 1M+


class AccountType(str, Enum):
    CREATOR = "creator"
    PAGE = "page"


class CampaignRequestStatus(str, Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    TIMEOUT = "timeout"


# User Models
class UserBase(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    name: str
    role: UserRole
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True


class Producer(UserBase):
    gst_number: str
    website: Optional[str] = None
    mobile: str


class Influencer(UserBase):
    age: int
    account_type: AccountType
    instagram_handle: str
    follower_count: int = 0
    engagement_rate: float = 0.0
    location_state: str
    location_district: str
    categories: List[str] = []
    mobile: str
    gender: str
    is_verified: bool = False
    audience_demographics: Optional[Dict] = None
    recent_posts: Optional[List[Dict]] = None
    cost_per_post: float = 0.0


class Admin(UserBase):
    password_hash: str


# Campaign Models
class FollowerRangeTier(BaseModel):
    tier: InfluencerTier
    count: int


class Campaign(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    producer_id: str
    campaign_type: CampaignType
    movie_title: str
    poster_url: Optional[str] = None
    genre: List[str] = []
    release_date: datetime
    campaign_start_date: datetime
    campaign_end_date: datetime
    regions_state: List[str] = []
    regions_district: List[str] = []
    campaign_phases: List[CampaignPhase] = []
    total_budget: float
    follower_ranges: List[FollowerRangeTier] = []
    influencer_categories: List[str] = []
    review_mode: ReviewMode
    tone_language_preferences: Optional[str] = None
    campaign_brief: str
    status: str = "active"  # active, completed, cancelled
    created_at: datetime = Field(default_factory=datetime.utcnow)
    budget_spent: float = 0.0


# Campaign-Influencer Relationship
class CampaignInfluencer(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    campaign_id: str
    influencer_id: str
    request_status: CampaignRequestStatus = CampaignRequestStatus.PENDING
    cost: float
    created_at: datetime = Field(default_factory=datetime.utcnow)
    responded_at: Optional[datetime] = None
    payment_released: bool = False
    payment_released_at: Optional[datetime] = None


# Deliverable Models
class Deliverable(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    campaign_id: str
    influencer_id: str
    campaign_influencer_id: str
    phase: CampaignPhase
    script_content: Optional[str] = None
    video_link: Optional[str] = None
    status: DeliverableStatus = DeliverableStatus.PENDING
    submitted_at: Optional[datetime] = None
    reviewed_at: Optional[datetime] = None
    review_feedback: Optional[str] = None
    ai_review_result: Optional[Dict] = None
    post_detected_live: bool = False
    engagement_data: Optional[Dict] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


# Payment Models
class Payment(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    campaign_id: str
    producer_id: str
    amount: float
    payment_gateway_id: Optional[str] = None
    status: str = "pending"  # pending, completed, failed
    created_at: datetime = Field(default_factory=datetime.utcnow)


class PaymentRelease(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    payment_id: str
    influencer_id: str
    campaign_influencer_id: str
    amount: float
    platform_commission: float = 15.0
    final_amount: float
    status: str = "pending"  # pending, released, disputed
    released_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


# Notification Models
class Notification(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    title: str
    message: str
    type: str  # campaign_request, script_submitted, payment_released, etc.
    read: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)


# Platform Settings
class PlatformSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    platform_commission: float = 15.0
    auto_release_timer: int = 72  # hours
    influencer_verification_threshold: int = 2000
    booking_analytics_pricing: Dict = {
        "30_days": 50000,
        "45_days": 70000
    }
    updated_at: datetime = Field(default_factory=datetime.utcnow)


# Booking Analytics Access
class BookingAnalyticsAccess(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    producer_id: str
    duration_days: int
    amount_paid: float
    activated_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: datetime
    is_active: bool = True


# Request/Response Models
class LoginRequest(BaseModel):
    email: str
    password: Optional[str] = None
    role: UserRole


class RegisterProducerRequest(BaseModel):
    email: str
    name: str
    gst_number: str
    website: Optional[str] = None
    mobile: str


class RegisterInfluencerRequest(BaseModel):
    email: str
    name: str
    age: int
    account_type: AccountType
    instagram_handle: str
    location_state: str
    location_district: str
    categories: List[str]
    mobile: str
    gender: str
    # Mock data that would come from Instagram OAuth
    follower_count: int = 0
    engagement_rate: float = 0.0
    cost_per_post: float = 0.0


class CreateCampaignRequest(BaseModel):
    campaign_type: CampaignType
    movie_title: str
    poster_url: Optional[str] = None
    genre: List[str]
    release_date: str
    campaign_start_date: str
    campaign_end_date: str
    regions_state: List[str]
    regions_district: List[str]
    campaign_phases: List[CampaignPhase]
    total_budget: float
    follower_ranges: List[FollowerRangeTier]
    influencer_categories: List[str]
    review_mode: ReviewMode
    tone_language_preferences: Optional[str] = None
    campaign_brief: str


class InfluencerRecommendation(BaseModel):
    influencer: Influencer
    match_score: float
    cost: float


class SubmitScriptRequest(BaseModel):
    deliverable_id: str
    script_content: str


class SubmitVideoRequest(BaseModel):
    deliverable_id: str
    video_link: str


class ReviewScriptRequest(BaseModel):
    deliverable_id: str
    approved: bool
    feedback: Optional[str] = None



# Razorpay Payment Models
class RazorpayOrder(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    campaign_id: str
    producer_id: str
    razorpay_order_id: Optional[str] = None
    amount: float  # Total amount in rupees
    currency: str = "INR"
    status: str = "created"  # created, paid, failed
    created_at: datetime = Field(default_factory=datetime.utcnow)
    paid_at: Optional[datetime] = None


class RazorpayPayment(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    order_id: str
    razorpay_payment_id: str
    razorpay_order_id: str
    razorpay_signature: str
    amount: float
    status: str = "captured"
    created_at: datetime = Field(default_factory=datetime.utcnow)


class EscrowRelease(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    payment_id: str
    campaign_influencer_id: str
    influencer_id: str
    amount: float
    platform_commission: float
    final_amount: float
    status: str = "held"  # held, released, disputed
    released_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


# Request Models for Razorpay
class CreateOrderRequest(BaseModel):
    campaign_id: str
    producer_id: str
    influencer_ids: List[str]


class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    order_id: str


class ConfirmInfluencersRequest(BaseModel):
    campaign_id: str
    influencer_ids: List[str]
