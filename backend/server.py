from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List, Optional
from datetime import datetime, timedelta
import bcrypt
import razorpay
import hmac
import hashlib
from models import *

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Razorpay client
razorpay_client = razorpay.Client(auth=(os.environ.get('RAZORPAY_KEY_ID'), os.environ.get('RAZORPAY_KEY_SECRET')))

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# ==================== HELPER FUNCTIONS ====================

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))


async def get_platform_settings():
    settings = await db.platform_settings.find_one({}, {"_id": 0})
    if not settings:
        # Create default settings
        default_settings = PlatformSettings().model_dump()
        await db.platform_settings.insert_one(default_settings)
        return default_settings
    return settings


def calculate_influencer_tier(follower_count: int) -> InfluencerTier:
    if follower_count >= 1000000:
        return InfluencerTier.MEGA
    elif follower_count >= 100000:
        return InfluencerTier.MACRO
    elif follower_count >= 10000:
        return InfluencerTier.MICRO
    else:
        return InfluencerTier.NANO


# ==================== SEEDING ====================

async def seed_admin():
    admin_exists = await db.users.find_one({"email": "admin@movie.com"})
    if not admin_exists:
        admin = Admin(
            email="admin@movie.com",
            name="Platform Admin",
            role=UserRole.ADMIN,
            password_hash=hash_password("admin123")
        )
        await db.users.insert_one(admin.model_dump())
        logger.info("Admin user seeded successfully")


@app.on_event("startup")
async def startup_event():
    await seed_admin()
    await get_platform_settings()
    logger.info("Application started successfully")


# ==================== AUTH ROUTES ====================

@api_router.post("/auth/login")
async def login(request: LoginRequest):
    user = await db.users.find_one({"email": request.email, "role": request.role}, {"_id": 0})
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # For admin, verify password
    if request.role == UserRole.ADMIN:
        if not request.password or not verify_password(request.password, user["password_hash"]):
            raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # For producer/influencer, mock OAuth (password not required)
    if not user["is_active"]:
        raise HTTPException(status_code=403, detail="Account is not active")
    
    # Remove password_hash from response
    if "password_hash" in user:
        del user["password_hash"]
    
    return {"user": user, "message": "Login successful"}


@api_router.post("/auth/register/producer")
async def register_producer(request: RegisterProducerRequest):
    existing = await db.users.find_one({"email": request.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    producer = Producer(
        email=request.email,
        name=request.name,
        role=UserRole.PRODUCER,
        gst_number=request.gst_number,
        website=request.website,
        mobile=request.mobile
    )
    
    await db.users.insert_one(producer.model_dump())
    user_data = producer.model_dump()
    
    return {"user": user_data, "message": "Producer registered successfully"}


@api_router.post("/auth/register/influencer")
async def register_influencer(request: RegisterInfluencerRequest):
    existing = await db.users.find_one({"email": request.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    settings = await get_platform_settings()
    is_verified = request.follower_count >= settings["influencer_verification_threshold"]
    
    influencer = Influencer(
        email=request.email,
        name=request.name,
        role=UserRole.INFLUENCER,
        age=request.age,
        account_type=request.account_type,
        instagram_handle=request.instagram_handle,
        follower_count=request.follower_count,
        engagement_rate=request.engagement_rate,
        location_state=request.location_state,
        location_district=request.location_district,
        categories=request.categories,
        mobile=request.mobile,
        gender=request.gender,
        is_verified=is_verified,
        cost_per_post=request.cost_per_post
    )
    
    await db.users.insert_one(influencer.model_dump())
    user_data = influencer.model_dump()
    
    return {"user": user_data, "message": "Influencer registered successfully", "requires_verification": not is_verified}


# ==================== USER ROUTES ====================

@api_router.get("/users")
async def get_users(role: Optional[str] = None):
    query = {}
    if role:
        query["role"] = role
    
    users = await db.users.find(query, {"_id": 0, "password_hash": 0}).to_list(1000)
    return {"users": users}


@api_router.get("/users/{user_id}")
async def get_user(user_id: str):
    user = await db.users.find_one({"id": user_id}, {"_id": 0, "password_hash": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"user": user}


@api_router.put("/users/{user_id}")
async def update_user(user_id: str, updates: dict):
    # Remove protected fields
    protected_fields = ["id", "email", "role", "password_hash", "created_at"]
    for field in protected_fields:
        updates.pop(field, None)
    
    result = await db.users.update_one({"id": user_id}, {"$set": updates})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": "User updated successfully"}


# ==================== CAMPAIGN ROUTES ====================

@api_router.post("/campaigns")
async def create_campaign(request: CreateCampaignRequest, producer_id: str):
    campaign = Campaign(
        producer_id=producer_id,
        campaign_type=request.campaign_type,
        movie_title=request.movie_title,
        poster_url=request.poster_url,
        genre=request.genre,
        release_date=datetime.fromisoformat(request.release_date),
        campaign_start_date=datetime.fromisoformat(request.campaign_start_date),
        campaign_end_date=datetime.fromisoformat(request.campaign_end_date),
        regions_state=request.regions_state,
        regions_district=request.regions_district,
        campaign_phases=request.campaign_phases,
        total_budget=request.total_budget,
        follower_ranges=request.follower_ranges,
        influencer_categories=request.influencer_categories,
        review_mode=request.review_mode,
        tone_language_preferences=request.tone_language_preferences,
        campaign_brief=request.campaign_brief
    )
    
    await db.campaigns.insert_one(campaign.model_dump())
    return {"campaign": campaign.model_dump(), "message": "Campaign created successfully"}


@api_router.get("/campaigns")
async def get_campaigns(
    producer_id: Optional[str] = None,
    status: Optional[str] = None
):
    query = {}
    if producer_id:
        query["producer_id"] = producer_id
    if status:
        query["status"] = status
    
    campaigns = await db.campaigns.find(query, {"_id": 0}).to_list(1000)
    return {"campaigns": campaigns}


@api_router.get("/campaigns/{campaign_id}")
async def get_campaign(campaign_id: str):
    campaign = await db.campaigns.find_one({"id": campaign_id}, {"_id": 0})
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return {"campaign": campaign}


@api_router.put("/campaigns/{campaign_id}")
async def update_campaign(campaign_id: str, updates: dict):
    protected_fields = ["id", "producer_id", "created_at"]
    for field in protected_fields:
        updates.pop(field, None)
    
    result = await db.campaigns.update_one({"id": campaign_id}, {"$set": updates})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    return {"message": "Campaign updated successfully"}


# ==================== INFLUENCER RECOMMENDATION ====================

@api_router.post("/campaigns/{campaign_id}/recommendations")
async def get_influencer_recommendations(campaign_id: str):
    campaign = await db.campaigns.find_one({"id": campaign_id}, {"_id": 0})
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    # Build query for matching influencers
    query = {
        "role": "influencer",
        "is_verified": True,
        "is_active": True,
        "location_state": {"$in": campaign["regions_state"]},
        "categories": {"$in": campaign["influencer_categories"]}
    }
    
    influencers = await db.users.find(query, {"_id": 0, "password_hash": 0}).to_list(1000)
    
    recommendations = []
    for influencer in influencers:
        tier = calculate_influencer_tier(influencer["follower_count"])
        
        # Check if tier matches campaign requirements
        tier_match = any(fr["tier"] == tier for fr in campaign["follower_ranges"])
        if not tier_match:
            continue
        
        # Calculate match score (simplified)
        match_score = 85.0 + (influencer["engagement_rate"] * 10)
        
        recommendations.append({
            "influencer": influencer,
            "match_score": min(match_score, 100.0),
            "cost": influencer.get("cost_per_post", 0)
        })
    
    # Sort by match score
    recommendations.sort(key=lambda x: x["match_score"], reverse=True)
    
    return {"recommendations": recommendations}


@api_router.post("/campaigns/{campaign_id}/send-requests")
async def send_campaign_requests(campaign_id: str, influencer_ids: List[str]):
    campaign = await db.campaigns.find_one({"id": campaign_id})
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    # Create campaign-influencer relationships
    for influencer_id in influencer_ids:
        influencer = await db.users.find_one({"id": influencer_id, "role": "influencer"})
        if not influencer:
            continue
        
        # Check if already exists
        existing = await db.campaign_influencers.find_one({
            "campaign_id": campaign_id,
            "influencer_id": influencer_id
        })
        
        if existing:
            continue
        
        campaign_influencer = CampaignInfluencer(
            campaign_id=campaign_id,
            influencer_id=influencer_id,
            cost=influencer.get("cost_per_post", 0)
        )
        
        await db.campaign_influencers.insert_one(campaign_influencer.model_dump())
        
        # Create deliverables for each phase
        for phase in campaign["campaign_phases"]:
            deliverable = Deliverable(
                campaign_id=campaign_id,
                influencer_id=influencer_id,
                campaign_influencer_id=campaign_influencer.id,
                phase=phase
            )
            await db.deliverables.insert_one(deliverable.model_dump())
        
        # Create notification
        notification = Notification(
            user_id=influencer_id,
            title="New Campaign Request",
            message=f"You have received a new campaign request for {campaign['movie_title']}",
            type="campaign_request"
        )
        await db.notifications.insert_one(notification.model_dump())
    
    return {"message": "Campaign requests sent successfully"}


# ==================== INFLUENCER ROUTES ====================

@api_router.get("/influencers")
async def get_influencers(
    state: Optional[str] = None,
    category: Optional[str] = None,
    min_followers: Optional[int] = None,
    max_followers: Optional[int] = None,
    verified_only: bool = False
):
    query = {"role": "influencer", "is_active": True}
    
    if state:
        query["location_state"] = state
    if category:
        query["categories"] = category
    if min_followers:
        query["follower_count"] = {"$gte": min_followers}
    if max_followers:
        query.setdefault("follower_count", {})["$lte"] = max_followers
    if verified_only:
        query["is_verified"] = True
    
    influencers = await db.users.find(query, {"_id": 0, "password_hash": 0}).to_list(1000)
    return {"influencers": influencers}


@api_router.post("/influencers/{influencer_id}/respond")
async def respond_to_campaign(influencer_id: str, campaign_influencer_id: str, accepted: bool):
    status = CampaignRequestStatus.ACCEPTED if accepted else CampaignRequestStatus.REJECTED
    
    result = await db.campaign_influencers.update_one(
        {"id": campaign_influencer_id},
        {
            "$set": {
                "request_status": status,
                "responded_at": datetime.utcnow()
            }
        }
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Campaign request not found")
    
    # Get campaign info for notification
    campaign_influencer = await db.campaign_influencers.find_one({"id": campaign_influencer_id})
    campaign = await db.campaigns.find_one({"id": campaign_influencer["campaign_id"]})
    
    # Notify producer
    notification = Notification(
        user_id=campaign["producer_id"],
        title=f"Influencer {'Accepted' if accepted else 'Rejected'} Campaign",
        message=f"An influencer has {'accepted' if accepted else 'rejected'} your campaign request for {campaign['movie_title']}",
        type="influencer_response"
    )
    await db.notifications.insert_one(notification.model_dump())
    
    return {"message": f"Campaign request {'accepted' if accepted else 'rejected'}"}


# ==================== DELIVERABLE ROUTES ====================

@api_router.get("/deliverables/campaign/{campaign_id}")
async def get_campaign_deliverables(campaign_id: str):
    deliverables = await db.deliverables.find({"campaign_id": campaign_id}, {"_id": 0}).to_list(1000)
    
    # Enrich with influencer data
    for deliverable in deliverables:
        influencer = await db.users.find_one(
            {"id": deliverable["influencer_id"]},
            {"_id": 0, "name": 1, "instagram_handle": 1, "follower_count": 1}
        )
        deliverable["influencer"] = influencer
    
    return {"deliverables": deliverables}


@api_router.get("/deliverables/influencer/{influencer_id}")
async def get_influencer_deliverables(influencer_id: str):
    deliverables = await db.deliverables.find({"influencer_id": influencer_id}, {"_id": 0}).to_list(1000)
    
    # Enrich with campaign data
    for deliverable in deliverables:
        campaign = await db.campaigns.find_one(
            {"id": deliverable["campaign_id"]},
            {"_id": 0, "movie_title": 1, "poster_url": 1}
        )
        deliverable["campaign"] = campaign
    
    return {"deliverables": deliverables}


@api_router.post("/deliverables/submit-script")
async def submit_script(request: SubmitScriptRequest):
    result = await db.deliverables.update_one(
        {"id": request.deliverable_id},
        {
            "$set": {
                "script_content": request.script_content,
                "status": DeliverableStatus.SUBMITTED,
                "submitted_at": datetime.utcnow()
            }
        }
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Deliverable not found")
    
    deliverable = await db.deliverables.find_one({"id": request.deliverable_id})
    campaign = await db.campaigns.find_one({"id": deliverable["campaign_id"]})
    
    # If automated review, trigger AI review
    if campaign["review_mode"] == ReviewMode.AUTOMATED:
        # Will be implemented in ai_review route
        await db.deliverables.update_one(
            {"id": request.deliverable_id},
            {"$set": {"status": DeliverableStatus.UNDER_REVIEW}}
        )
    
    # Notify producer
    notification = Notification(
        user_id=campaign["producer_id"],
        title="Script Submitted",
        message=f"A script has been submitted for {campaign['movie_title']}",
        type="script_submitted"
    )
    await db.notifications.insert_one(notification.model_dump())
    
    return {"message": "Script submitted successfully"}


@api_router.post("/deliverables/submit-video")
async def submit_video(request: SubmitVideoRequest):
    result = await db.deliverables.update_one(
        {"id": request.deliverable_id},
        {
            "$set": {
                "video_link": request.video_link,
                "status": DeliverableStatus.LIVE,
                "post_detected_live": True
            }
        }
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Deliverable not found")
    
    deliverable = await db.deliverables.find_one({"id": request.deliverable_id})
    
    # Trigger payment release
    await release_payment_for_deliverable(deliverable["campaign_influencer_id"])
    
    return {"message": "Video link submitted successfully"}


@api_router.post("/deliverables/review")
async def review_script(request: ReviewScriptRequest):
    status = DeliverableStatus.APPROVED if request.approved else DeliverableStatus.REJECTED
    
    result = await db.deliverables.update_one(
        {"id": request.deliverable_id},
        {
            "$set": {
                "status": status,
                "review_feedback": request.feedback,
                "reviewed_at": datetime.utcnow()
            }
        }
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Deliverable not found")
    
    deliverable = await db.deliverables.find_one({"id": request.deliverable_id})
    
    # Notify influencer
    notification = Notification(
        user_id=deliverable["influencer_id"],
        title=f"Script {'Approved' if request.approved else 'Rejected'}",
        message=request.feedback or f"Your script has been {'approved' if request.approved else 'rejected'}",
        type="script_review"
    )
    await db.notifications.insert_one(notification.model_dump())
    
    return {"message": "Script reviewed successfully"}


# ==================== AI REVIEW ====================

@api_router.post("/ai/review-script")
async def ai_review_script(deliverable_id: str):
    from emergentintegrations.llm.chat import LlmChat, UserMessage
    
    deliverable = await db.deliverables.find_one({"id": deliverable_id})
    if not deliverable:
        raise HTTPException(status_code=404, detail="Deliverable not found")
    
    campaign = await db.campaigns.find_one({"id": deliverable["campaign_id"]})
    
    # Prepare AI prompt
    system_message = f"""You are an AI script reviewer for movie marketing campaigns.
Analyze the submitted script against the campaign brief and provide a detailed review.

Campaign Details:
- Movie: {campaign['movie_title']}
- Genre: {', '.join(campaign['genre'])}
- Phase: {deliverable['phase']}
- Brief: {campaign['campaign_brief']}
- Tone/Language: {campaign.get('tone_language_preferences', 'N/A')}

Review Criteria:
1. Campaign Brief Alignment: Does the script match the movie, genre, phase, and instructions?
2. Brand Safety: Check for offensive language, competitor mentions, sensitive content
3. Tone & Language: Validate against tone and language preferences

Provide your review in the following JSON format:
{{
  "approved": true/false,
  "overall_score": 0-100,
  "alignment_score": 0-100,
  "brand_safety_score": 0-100,
  "tone_score": 0-100,
  "feedback": "Detailed feedback",
  "issues": ["List of issues found"],
  "suggestions": ["List of improvement suggestions"]
}}"""
    
    user_message = f"Review this script:\n\n{deliverable['script_content']}"
    
    try:
        api_key = os.environ.get('EMERGENT_LLM_KEY')
        chat = LlmChat(
            api_key=api_key,
            session_id=f"script_review_{deliverable_id}",
            system_message=system_message
        ).with_model("openai", "gpt-5.2")
        
        response = await chat.send_message(UserMessage(text=user_message))
        
        # Parse response (assuming JSON format)
        import json
        try:
            review_result = json.loads(response)
        except:
            review_result = {
                "approved": True,
                "overall_score": 75,
                "feedback": response
            }
        
        # Update deliverable with AI review
        status = DeliverableStatus.APPROVED if review_result["approved"] else DeliverableStatus.REJECTED
        
        await db.deliverables.update_one(
            {"id": deliverable_id},
            {
                "$set": {
                    "ai_review_result": review_result,
                    "status": status,
                    "review_feedback": review_result.get("feedback"),
                    "reviewed_at": datetime.utcnow()
                }
            }
        )
        
        # Notify influencer
        notification = Notification(
            user_id=deliverable["influencer_id"],
            title=f"AI Script Review: {'Approved' if review_result['approved'] else 'Rejected'}",
            message=review_result.get("feedback", "Your script has been reviewed by AI"),
            type="script_review"
        )
        await db.notifications.insert_one(notification.model_dump())
        
        return {"review": review_result}
    
    except Exception as e:
        logger.error(f"AI review error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"AI review failed: {str(e)}")


# ==================== PAYMENT ROUTES ====================

async def release_payment_for_deliverable(campaign_influencer_id: str):
    campaign_influencer = await db.campaign_influencers.find_one({"id": campaign_influencer_id})
    
    if campaign_influencer["payment_released"]:
        return
    
    settings = await get_platform_settings()
    commission = settings["platform_commission"]
    
    amount = campaign_influencer["cost"]
    final_amount = amount * (1 - commission / 100)
    
    payment_release = PaymentRelease(
        payment_id="mock_payment_id",
        influencer_id=campaign_influencer["influencer_id"],
        campaign_influencer_id=campaign_influencer_id,
        amount=amount,
        platform_commission=commission,
        final_amount=final_amount,
        status="released",
        released_at=datetime.utcnow()
    )
    
    await db.payment_releases.insert_one(payment_release.model_dump())
    
    await db.campaign_influencers.update_one(
        {"id": campaign_influencer_id},
        {
            "$set": {
                "payment_released": True,
                "payment_released_at": datetime.utcnow()
            }
        }
    )
    
    # Notify influencer
    notification = Notification(
        user_id=campaign_influencer["influencer_id"],
        title="Payment Released",
        message=f"Payment of ₹{final_amount:.2f} has been released to your account",
        type="payment_released"
    )
    await db.notifications.insert_one(notification.model_dump())


@api_router.post("/payments/initiate")
async def initiate_payment(campaign_id: str, producer_id: str, amount: float):
    payment = Payment(
        campaign_id=campaign_id,
        producer_id=producer_id,
        amount=amount,
        payment_gateway_id=f"mock_razorpay_{uuid.uuid4().hex[:8]}",
        status="completed"
    )
    
    await db.payments.insert_one(payment.model_dump())
    
    return {"payment": payment.model_dump(), "message": "Payment initiated successfully (Mock)"}


@api_router.get("/payments/history/{user_id}")
async def get_payment_history(user_id: str, role: str):
    if role == "producer":
        payments = await db.payments.find({"producer_id": user_id}, {"_id": 0}).to_list(1000)
        return {"payments": payments}
    else:
        releases = await db.payment_releases.find({"influencer_id": user_id}, {"_id": 0}).to_list(1000)
        return {"payments": releases}


# ==================== ANALYTICS ROUTES ====================

@api_router.get("/analytics/producer-dashboard/{producer_id}")
async def get_producer_dashboard(producer_id: str):
    campaigns = await db.campaigns.find({"producer_id": producer_id}, {"_id": 0}).to_list(1000)
    
    total_campaigns = len(campaigns)
    active_campaigns = len([c for c in campaigns if c["status"] == "active"])
    total_budget = sum(c["total_budget"] for c in campaigns)
    total_spent = sum(c["budget_spent"] for c in campaigns)
    
    # Count total influencers
    campaign_ids = [c["id"] for c in campaigns]
    influencers = await db.campaign_influencers.find(
        {"campaign_id": {"$in": campaign_ids}},
        {"_id": 0}
    ).to_list(1000)
    
    return {
        "total_campaigns": total_campaigns,
        "active_campaigns": active_campaigns,
        "total_budget": total_budget,
        "total_spent": total_spent,
        "total_influencers": len(influencers),
        "campaigns": campaigns
    }


@api_router.get("/analytics/influencer-dashboard/{influencer_id}")
async def get_influencer_dashboard(influencer_id: str):
    # Get all campaign relationships
    campaign_influencers = await db.campaign_influencers.find(
        {"influencer_id": influencer_id},
        {"_id": 0}
    ).to_list(1000)
    
    # Get payment releases
    payments = await db.payment_releases.find(
        {"influencer_id": influencer_id, "status": "released"},
        {"_id": 0}
    ).to_list(1000)
    
    total_earnings = sum(p["final_amount"] for p in payments)
    total_campaigns = len(campaign_influencers)
    active_campaigns = len([ci for ci in campaign_influencers if ci["request_status"] == "accepted"])
    pending_requests = len([ci for ci in campaign_influencers if ci["request_status"] == "pending"])
    
    return {
        "total_earnings": total_earnings,
        "total_campaigns": total_campaigns,
        "active_campaigns": active_campaigns,
        "pending_requests": pending_requests,
        "payment_history": payments
    }


@api_router.get("/analytics/campaign/{campaign_id}")
async def get_campaign_analytics(campaign_id: str):
    campaign = await db.campaigns.find_one({"id": campaign_id}, {"_id": 0})
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    # Get deliverables
    deliverables = await db.deliverables.find({"campaign_id": campaign_id}, {"_id": 0}).to_list(1000)
    
    # Calculate stats
    live_posts = [d for d in deliverables if d["status"] == "live"]
    total_engagement = sum(d.get("engagement_data", {}).get("total", 0) for d in live_posts)
    total_reach = sum(d.get("engagement_data", {}).get("reach", 0) for d in live_posts)
    
    cost_per_reach = campaign["budget_spent"] / total_reach if total_reach > 0 else 0
    
    return {
        "campaign": campaign,
        "total_deliverables": len(deliverables),
        "live_posts": len(live_posts),
        "total_engagement": total_engagement,
        "total_reach": total_reach,
        "cost_per_reach": cost_per_reach,
        "budget_remaining": campaign["total_budget"] - campaign["budget_spent"]
    }


# ==================== NOTIFICATION ROUTES ====================

@api_router.get("/notifications/{user_id}")
async def get_notifications(user_id: str, unread_only: bool = False):
    query = {"user_id": user_id}
    if unread_only:
        query["read"] = False
    
    notifications = await db.notifications.find(query, {"_id": 0}).sort("created_at", -1).to_list(100)
    return {"notifications": notifications}


@api_router.put("/notifications/{notification_id}/read")
async def mark_notification_read(notification_id: str):
    await db.notifications.update_one({"id": notification_id}, {"$set": {"read": True}})
    return {"message": "Notification marked as read"}


# ==================== ADMIN ROUTES ====================

@api_router.get("/admin/dashboard")
async def get_admin_dashboard():
    total_users = await db.users.count_documents({})
    total_producers = await db.users.count_documents({"role": "producer"})
    total_influencers = await db.users.count_documents({"role": "influencer"})
    total_campaigns = await db.campaigns.count_documents({})
    
    # Pending verifications
    pending_verifications = await db.users.count_documents({
        "role": "influencer",
        "is_verified": False
    })
    
    # Total revenue (platform commission)
    payments = await db.payment_releases.find({"status": "released"}, {"_id": 0}).to_list(1000)
    total_revenue = sum(p["amount"] * p["platform_commission"] / 100 for p in payments)
    
    return {
        "total_users": total_users,
        "total_producers": total_producers,
        "total_influencers": total_influencers,
        "total_campaigns": total_campaigns,
        "pending_verifications": pending_verifications,
        "total_revenue": total_revenue
    }


@api_router.post("/admin/verify-influencer/{influencer_id}")
async def verify_influencer(influencer_id: str, approved: bool):
    result = await db.users.update_one(
        {"id": influencer_id, "role": "influencer"},
        {"$set": {"is_verified": approved, "is_active": approved}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Influencer not found")
    
    # Notify influencer
    notification = Notification(
        user_id=influencer_id,
        title=f"Verification {'Approved' if approved else 'Rejected'}",
        message=f"Your account has been {'approved' if approved else 'rejected'} by the admin",
        type="verification_status"
    )
    await db.notifications.insert_one(notification.model_dump())
    
    return {"message": f"Influencer {'verified' if approved else 'rejected'}"}


@api_router.get("/admin/settings")
async def get_admin_settings():
    settings = await get_platform_settings()
    return {"settings": settings}


@api_router.put("/admin/settings")
async def update_admin_settings(updates: dict):
    protected_fields = ["id"]
    for field in protected_fields:
        updates.pop(field, None)
    
    updates["updated_at"] = datetime.utcnow()
    
    await db.platform_settings.update_one({}, {"$set": updates}, upsert=True)
    return {"message": "Settings updated successfully"}


# ==================== BOOKING ANALYTICS ====================

@api_router.post("/booking-analytics/purchase")
async def purchase_booking_analytics(producer_id: str, duration_days: int):
    settings = await get_platform_settings()
    pricing = settings["booking_analytics_pricing"]
    
    price_key = f"{duration_days}_days"
    if price_key not in pricing:
        raise HTTPException(status_code=400, detail="Invalid duration")
    
    amount = pricing[price_key]
    
    access = BookingAnalyticsAccess(
        producer_id=producer_id,
        duration_days=duration_days,
        amount_paid=amount,
        expires_at=datetime.utcnow() + timedelta(days=duration_days)
    )
    
    await db.booking_analytics_access.insert_one(access.model_dump())
    
    return {"access": access.model_dump(), "message": "Access purchased successfully"}


@api_router.get("/booking-analytics/data")
async def get_booking_analytics(producer_id: str):
    # Check if producer has active access
    access = await db.booking_analytics_access.find_one({
        "producer_id": producer_id,
        "is_active": True,
        "expires_at": {"$gte": datetime.utcnow()}
    })
    
    if not access:
        raise HTTPException(status_code=403, detail="No active access to booking analytics")
    
    # Return mock data
    mock_data = {
        "total_collections": 250000000,
        "daily_collections": [
            {"date": "2026-04-01", "amount": 5000000},
            {"date": "2026-04-02", "amount": 7500000},
            {"date": "2026-04-03", "amount": 6800000}
        ],
        "region_wise": [
            {"region": "Kerala", "amount": 50000000},
            {"region": "Tamil Nadu", "amount": 120000000},
            {"region": "Andhra Pradesh", "amount": 45000000},
            {"region": "Telangana", "amount": 35000000}
        ],
        "occupancy_rate": 78.5
    }
    
    return {"data": mock_data, "access": access}



# ==================== RAZORPAY PAYMENT ROUTES ====================

@api_router.post("/payments/razorpay/create-order")
async def create_razorpay_order(request: CreateOrderRequest):
    """Create Razorpay order for escrow payment"""
    try:
        # Get campaign and calculate total amount
        campaign = await db.campaigns.find_one({"id": request.campaign_id})
        if not campaign:
            raise HTTPException(status_code=404, detail="Campaign not found")
        
        # Calculate total cost for selected influencers
        total_amount = 0
        for influencer_id in request.influencer_ids:
            influencer = await db.users.find_one({"id": influencer_id, "role": "influencer"})
            if influencer:
                total_amount += influencer.get("cost_per_post", 0)
        
        # Create Razorpay order (amount in paise)
        razorpay_order = razorpay_client.order.create({
            "amount": int(total_amount * 100),  # Convert to paise
            "currency": "INR",
            "payment_capture": 1,
            "notes": {
                "campaign_id": request.campaign_id,
                "producer_id": request.producer_id
            }
        })
        
        # Store order in database
        order = RazorpayOrder(
            campaign_id=request.campaign_id,
            producer_id=request.producer_id,
            razorpay_order_id=razorpay_order["id"],
            amount=total_amount,
            status="created"
        )
        await db.razorpay_orders.insert_one(order.model_dump())
        
        return {
            "order_id": order.id,
            "razorpay_order_id": razorpay_order["id"],
            "amount": total_amount,
            "currency": "INR",
            "key_id": os.environ.get('RAZORPAY_KEY_ID')
        }
    
    except Exception as e:
        logger.error(f"Razorpay order creation error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.post("/payments/razorpay/verify")
async def verify_razorpay_payment(request: VerifyPaymentRequest):
    """Verify Razorpay payment and move funds to escrow"""
    try:
        # Verify signature
        generated_signature = hmac.new(
            os.environ.get('RAZORPAY_KEY_SECRET').encode(),
            f"{request.razorpay_order_id}|{request.razorpay_payment_id}".encode(),
            hashlib.sha256
        ).hexdigest()
        
        if generated_signature != request.razorpay_signature:
            raise HTTPException(status_code=400, detail="Invalid payment signature")
        
        # Update order status
        await db.razorpay_orders.update_one(
            {"id": request.order_id},
            {
                "$set": {
                    "status": "paid",
                    "paid_at": datetime.utcnow()
                }
            }
        )
        
        # Store payment record
        payment = RazorpayPayment(
            order_id=request.order_id,
            razorpay_payment_id=request.razorpay_payment_id,
            razorpay_order_id=request.razorpay_order_id,
            razorpay_signature=request.razorpay_signature,
            amount=0  # Will be updated
        )
        await db.razorpay_payments.insert_one(payment.model_dump())
        
        # Get order details
        order = await db.razorpay_orders.find_one({"id": request.order_id})
        
        # Create escrow records for each influencer
        campaign_influencers = await db.campaign_influencers.find(
            {"campaign_id": order["campaign_id"]},
            {"_id": 0}
        ).to_list(100)
        
        settings = await get_platform_settings()
        commission = settings["platform_commission"]
        
        for ci in campaign_influencers:
            amount = ci["cost"]
            final_amount = amount * (1 - commission / 100)
            
            escrow = EscrowRelease(
                payment_id=payment.id,
                campaign_influencer_id=ci["id"],
                influencer_id=ci["influencer_id"],
                amount=amount,
                platform_commission=commission,
                final_amount=final_amount,
                status="held"
            )
            await db.escrow_releases.insert_one(escrow.model_dump())
        
        return {"status": "success", "message": "Payment verified and moved to escrow"}
    
    except Exception as e:
        logger.error(f"Payment verification error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.post("/payments/release/{campaign_influencer_id}")
async def release_escrow_payment(campaign_influencer_id: str):
    """Release escrow payment to influencer upon deliverable completion"""
    try:
        # Find escrow record
        escrow = await db.escrow_releases.find_one(
            {"campaign_influencer_id": campaign_influencer_id, "status": "held"},
            {"_id": 0}
        )
        
        if not escrow:
            raise HTTPException(status_code=404, detail="No held escrow found")
        
        # Check if deliverable is completed
        deliverable = await db.deliverables.find_one({
            "campaign_influencer_id": campaign_influencer_id,
            "status": "live"
        })
        
        if not deliverable:
            raise HTTPException(status_code=400, detail="Deliverable not yet live")
        
        # Release payment
        await db.escrow_releases.update_one(
            {"id": escrow["id"]},
            {
                "$set": {
                    "status": "released",
                    "released_at": datetime.utcnow()
                }
            }
        )
        
        # Update campaign_influencer record
        await db.campaign_influencers.update_one(
            {"id": campaign_influencer_id},
            {
                "$set": {
                    "payment_released": True,
                    "payment_released_at": datetime.utcnow()
                }
            }
        )
        
        # Notify influencer
        notification = Notification(
            user_id=escrow["influencer_id"],
            title="Payment Released",
            message=f"Payment of ₹{escrow['final_amount']:.2f} has been released",
            type="payment_released"
        )
        await db.notifications.insert_one(notification.model_dump())
        
        return {
            "status": "success",
            "amount_released": escrow["final_amount"],
            "message": "Payment released to influencer"
        }
    
    except Exception as e:
        logger.error(f"Payment release error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# ==================== DELIVERABLE TRACKER ====================

@api_router.get("/deliverables/tracker/{campaign_id}")
async def get_deliverable_tracker(campaign_id: str):
    """Get all deliverables grouped by status for tracker view"""
    try:
        deliverables = await db.deliverables.find(
            {"campaign_id": campaign_id},
            {"_id": 0}
        ).to_list(1000)
        
        # Enrich with influencer data
        for deliverable in deliverables:
            influencer = await db.users.find_one(
                {"id": deliverable["influencer_id"]},
                {"_id": 0, "name": 1, "instagram_handle": 1, "follower_count": 1}
            )
            deliverable["influencer"] = influencer
        
        # Group by status
        tracker = {
            "newly_added": [],
            "pending": [],
            "submitted": [],
            "accepted": [],
            "rejected": [],
            "live": []
        }
        
        for deliverable in deliverables:
            status = deliverable["status"]
            if status == "newly_added":
                tracker["newly_added"].append(deliverable)
            elif status == "pending":
                tracker["pending"].append(deliverable)
            elif status == "submitted" or status == "under_review":
                tracker["submitted"].append(deliverable)
            elif status == "approved":
                tracker["accepted"].append(deliverable)
            elif status == "rejected":
                tracker["rejected"].append(deliverable)
            elif status == "live":
                tracker["live"].append(deliverable)
        
        return tracker
    
    except Exception as e:
        logger.error(f"Tracker error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.post("/campaigns/{campaign_id}/confirm-influencers")
async def confirm_influencer_selection(campaign_id: str, request: ConfirmInfluencersRequest):
    """Confirm selected influencers and create deliverables"""
    try:
        campaign = await db.campaigns.find_one({"id": campaign_id})
        if not campaign:
            raise HTTPException(status_code=404, detail="Campaign not found")
        
        # Create campaign-influencer relationships and deliverables
        for influencer_id in request.influencer_ids:
            influencer = await db.users.find_one({"id": influencer_id, "role": "influencer"})
            if not influencer:
                continue
            
            # Create relationship
            campaign_influencer = CampaignInfluencer(
                campaign_id=campaign_id,
                influencer_id=influencer_id,
                request_status=CampaignRequestStatus.ACCEPTED,
                cost=influencer.get("cost_per_post", 0),
                responded_at=datetime.utcnow()
            )
            
            await db.campaign_influencers.insert_one(campaign_influencer.model_dump())
            
            # Create deliverables for each phase with NEWLY_ADDED status
            for phase in campaign["campaign_phases"]:
                deliverable = Deliverable(
                    campaign_id=campaign_id,
                    influencer_id=influencer_id,
                    campaign_influencer_id=campaign_influencer.id,
                    phase=phase,
                    status=DeliverableStatus.NEWLY_ADDED
                )
                await db.deliverables.insert_one(deliverable.model_dump())
            
            # Notify influencer
            notification = Notification(
                user_id=influencer_id,
                title="Added to Campaign",
                message=f"You've been added to {campaign['movie_title']} campaign",
                type="campaign_added"
            )
            await db.notifications.insert_one(notification.model_dump())
        
        return {
            "status": "success",
            "message": "Influencers confirmed and deliverables created"
        }
    
    except Exception as e:
        logger.error(f"Confirm influencers error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
