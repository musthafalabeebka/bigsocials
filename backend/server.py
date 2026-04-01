from fastapi import FastAPI, APIRouter, HTTPException, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from supabase import acreate_client, AsyncClient
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

# Supabase client (initialized on startup)
supabase: AsyncClient = None

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
    result = await supabase.table("platform_settings").select("*").limit(1).execute()
    if not result.data:
        default_settings = PlatformSettings().model_dump(mode='json')
        await supabase.table("platform_settings").insert(default_settings).execute()
        return default_settings
    return result.data[0]


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
    result = await supabase.table("users").select("id").eq("email", "admin@movie.com").execute()
    if not result.data:
        admin = Admin(
            email="admin@movie.com",
            name="Platform Admin",
            role=UserRole.ADMIN,
            password_hash=hash_password("admin123")
        )
        await supabase.table("users").insert(admin.model_dump(mode='json')).execute()
        logger.info("Admin user seeded successfully")


@app.on_event("startup")
async def startup_event():
    global supabase
    supabase = await acreate_client(
        os.environ['SUPABASE_URL'],
        os.environ['SUPABASE_KEY']
    )
    await seed_admin()
    await get_platform_settings()
    logger.info("Application started successfully")


# ==================== AUTH ROUTES ====================

@api_router.post("/auth/login")
async def login(request: LoginRequest):
    result = await supabase.table("users").select("*").eq("email", request.email).eq("role", request.role).execute()
    user = result.data[0] if result.data else None

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if request.role == UserRole.ADMIN:
        if not request.password or not verify_password(request.password, user["password_hash"]):
            raise HTTPException(status_code=401, detail="Invalid credentials")

    if not user["is_active"]:
        raise HTTPException(status_code=403, detail="Account is not active")

    user.pop("password_hash", None)
    return {"user": user, "message": "Login successful"}


@api_router.post("/auth/register/producer")
async def register_producer(request: RegisterProducerRequest):
    existing = await supabase.table("users").select("id").eq("email", request.email).execute()
    if existing.data:
        raise HTTPException(status_code=400, detail="Email already registered")

    producer = Producer(
        email=request.email,
        name=request.name,
        role=UserRole.PRODUCER,
        gst_number=request.gst_number,
        website=request.website,
        mobile=request.mobile
    )

    data = producer.model_dump(mode='json')
    await supabase.table("users").insert(data).execute()
    return {"user": data, "message": "Producer registered successfully"}


@api_router.post("/auth/register/influencer")
async def register_influencer(request: RegisterInfluencerRequest):
    existing = await supabase.table("users").select("id").eq("email", request.email).execute()
    if existing.data:
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

    data = influencer.model_dump(mode='json')
    await supabase.table("users").insert(data).execute()
    return {"user": data, "message": "Influencer registered successfully", "requires_verification": not is_verified}


# ==================== USER ROUTES ====================

@api_router.get("/users")
async def get_users(role: Optional[str] = None):
    query = supabase.table("users").select("*")
    if role:
        query = query.eq("role", role)
    result = await query.execute()
    users = result.data
    for u in users:
        u.pop("password_hash", None)
    return {"users": users}


@api_router.get("/users/{user_id}")
async def get_user(user_id: str):
    result = await supabase.table("users").select("*").eq("id", user_id).execute()
    user = result.data[0] if result.data else None
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.pop("password_hash", None)
    return {"user": user}


@api_router.put("/users/{user_id}")
async def update_user(user_id: str, updates: dict):
    protected_fields = ["id", "email", "role", "password_hash", "created_at"]
    for field in protected_fields:
        updates.pop(field, None)

    result = await supabase.table("users").update(updates).eq("id", user_id).execute()
    if not result.data:
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

    data = campaign.model_dump(mode='json')
    await supabase.table("campaigns").insert(data).execute()
    return {"campaign": data, "message": "Campaign created successfully"}


@api_router.get("/campaigns")
async def get_campaigns(
    producer_id: Optional[str] = None,
    status: Optional[str] = None
):
    query = supabase.table("campaigns").select("*")
    if producer_id:
        query = query.eq("producer_id", producer_id)
    if status:
        query = query.eq("status", status)
    result = await query.execute()
    return {"campaigns": result.data}


@api_router.get("/campaigns/{campaign_id}")
async def get_campaign(campaign_id: str):
    result = await supabase.table("campaigns").select("*").eq("id", campaign_id).execute()
    campaign = result.data[0] if result.data else None
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return {"campaign": campaign}


@api_router.put("/campaigns/{campaign_id}")
async def update_campaign(campaign_id: str, updates: dict):
    protected_fields = ["id", "producer_id", "created_at"]
    for field in protected_fields:
        updates.pop(field, None)

    result = await supabase.table("campaigns").update(updates).eq("id", campaign_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return {"message": "Campaign updated successfully"}


# ==================== INFLUENCER RECOMMENDATION ====================

@api_router.post("/campaigns/{campaign_id}/recommendations")
async def get_influencer_recommendations(campaign_id: str):
    result = await supabase.table("campaigns").select("*").eq("id", campaign_id).execute()
    campaign = result.data[0] if result.data else None
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")

    query = supabase.table("users").select("*").eq("role", "influencer").eq("is_verified", True).eq("is_active", True)

    if campaign["regions_state"]:
        query = query.in_("location_state", campaign["regions_state"])

    influencers_result = await query.execute()
    influencers = influencers_result.data

    # Filter by category overlap (JSONB array)
    campaign_categories = campaign.get("influencer_categories") or []
    if campaign_categories:
        influencers = [
            inf for inf in influencers
            if any(cat in (inf.get("categories") or []) for cat in campaign_categories)
        ]

    recommendations = []
    for influencer in influencers:
        influencer.pop("password_hash", None)
        tier = calculate_influencer_tier(influencer["follower_count"])

        tier_match = any(fr["tier"] == tier for fr in campaign["follower_ranges"])
        if not tier_match:
            continue

        match_score = 85.0 + (influencer["engagement_rate"] * 10)

        recommendations.append({
            "influencer": influencer,
            "match_score": min(match_score, 100.0),
            "cost": influencer.get("cost_per_post", 0)
        })

    recommendations.sort(key=lambda x: x["match_score"], reverse=True)
    return {"recommendations": recommendations}


@api_router.post("/campaigns/{campaign_id}/send-requests")
async def send_campaign_requests(campaign_id: str, influencer_ids: List[str]):
    campaign_result = await supabase.table("campaigns").select("*").eq("id", campaign_id).execute()
    campaign = campaign_result.data[0] if campaign_result.data else None
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")

    for influencer_id in influencer_ids:
        inf_result = await supabase.table("users").select("*").eq("id", influencer_id).eq("role", "influencer").execute()
        influencer = inf_result.data[0] if inf_result.data else None
        if not influencer:
            continue

        existing = await supabase.table("campaign_influencers").select("id").eq("campaign_id", campaign_id).eq("influencer_id", influencer_id).execute()
        if existing.data:
            continue

        campaign_influencer = CampaignInfluencer(
            campaign_id=campaign_id,
            influencer_id=influencer_id,
            cost=influencer.get("cost_per_post", 0)
        )

        await supabase.table("campaign_influencers").insert(campaign_influencer.model_dump(mode='json')).execute()

        for phase in campaign["campaign_phases"]:
            deliverable = Deliverable(
                campaign_id=campaign_id,
                influencer_id=influencer_id,
                campaign_influencer_id=campaign_influencer.id,
                phase=phase
            )
            await supabase.table("deliverables").insert(deliverable.model_dump(mode='json')).execute()

        notification = Notification(
            user_id=influencer_id,
            title="New Campaign Request",
            message=f"You have received a new campaign request for {campaign['movie_title']}",
            type="campaign_request"
        )
        await supabase.table("notifications").insert(notification.model_dump(mode='json')).execute()

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
    query = supabase.table("users").select("*").eq("role", "influencer").eq("is_active", True)

    if state:
        query = query.eq("location_state", state)
    if min_followers:
        query = query.gte("follower_count", min_followers)
    if max_followers:
        query = query.lte("follower_count", max_followers)
    if verified_only:
        query = query.eq("is_verified", True)

    result = await query.execute()
    influencers = result.data

    if category:
        influencers = [inf for inf in influencers if category in (inf.get("categories") or [])]

    for inf in influencers:
        inf.pop("password_hash", None)

    return {"influencers": influencers}


@api_router.post("/influencers/{influencer_id}/respond")
async def respond_to_campaign(influencer_id: str, campaign_influencer_id: str, accepted: bool):
    status = CampaignRequestStatus.ACCEPTED if accepted else CampaignRequestStatus.REJECTED

    result = await supabase.table("campaign_influencers").update({
        "request_status": status,
        "responded_at": datetime.utcnow().isoformat()
    }).eq("id", campaign_influencer_id).execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="Campaign request not found")

    ci = result.data[0]
    campaign_result = await supabase.table("campaigns").select("*").eq("id", ci["campaign_id"]).execute()
    campaign = campaign_result.data[0]

    notification = Notification(
        user_id=campaign["producer_id"],
        title=f"Influencer {'Accepted' if accepted else 'Rejected'} Campaign",
        message=f"An influencer has {'accepted' if accepted else 'rejected'} your campaign request for {campaign['movie_title']}",
        type="influencer_response"
    )
    await supabase.table("notifications").insert(notification.model_dump(mode='json')).execute()

    return {"message": f"Campaign request {'accepted' if accepted else 'rejected'}"}


# ==================== DELIVERABLE ROUTES ====================

@api_router.get("/deliverables/campaign/{campaign_id}")
async def get_campaign_deliverables(campaign_id: str):
    result = await supabase.table("deliverables").select("*").eq("campaign_id", campaign_id).execute()
    deliverables = result.data

    for deliverable in deliverables:
        inf_result = await supabase.table("users").select("name, instagram_handle, follower_count").eq("id", deliverable["influencer_id"]).execute()
        deliverable["influencer"] = inf_result.data[0] if inf_result.data else None

    return {"deliverables": deliverables}


@api_router.get("/deliverables/influencer/{influencer_id}")
async def get_influencer_deliverables(influencer_id: str):
    result = await supabase.table("deliverables").select("*").eq("influencer_id", influencer_id).execute()
    deliverables = result.data

    for deliverable in deliverables:
        camp_result = await supabase.table("campaigns").select("movie_title, poster_url").eq("id", deliverable["campaign_id"]).execute()
        deliverable["campaign"] = camp_result.data[0] if camp_result.data else None

    return {"deliverables": deliverables}


@api_router.post("/deliverables/submit-script")
async def submit_script(request: SubmitScriptRequest):
    result = await supabase.table("deliverables").update({
        "script_content": request.script_content,
        "status": DeliverableStatus.SUBMITTED,
        "submitted_at": datetime.utcnow().isoformat()
    }).eq("id", request.deliverable_id).execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="Deliverable not found")

    deliverable = result.data[0]
    campaign_result = await supabase.table("campaigns").select("*").eq("id", deliverable["campaign_id"]).execute()
    campaign = campaign_result.data[0]

    if campaign["review_mode"] == ReviewMode.AUTOMATED:
        await supabase.table("deliverables").update({"status": DeliverableStatus.UNDER_REVIEW}).eq("id", request.deliverable_id).execute()

    notification = Notification(
        user_id=campaign["producer_id"],
        title="Script Submitted",
        message=f"A script has been submitted for {campaign['movie_title']}",
        type="script_submitted"
    )
    await supabase.table("notifications").insert(notification.model_dump(mode='json')).execute()

    return {"message": "Script submitted successfully"}


@api_router.post("/deliverables/submit-video")
async def submit_video(request: SubmitVideoRequest):
    result = await supabase.table("deliverables").update({
        "video_link": request.video_link,
        "status": DeliverableStatus.LIVE,
        "post_detected_live": True
    }).eq("id", request.deliverable_id).execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="Deliverable not found")

    deliverable = result.data[0]
    await release_payment_for_deliverable(deliverable["campaign_influencer_id"])

    return {"message": "Video link submitted successfully"}


@api_router.post("/deliverables/review")
async def review_script(request: ReviewScriptRequest):
    status = DeliverableStatus.APPROVED if request.approved else DeliverableStatus.REJECTED

    result = await supabase.table("deliverables").update({
        "status": status,
        "review_feedback": request.feedback,
        "reviewed_at": datetime.utcnow().isoformat()
    }).eq("id", request.deliverable_id).execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="Deliverable not found")

    deliverable = result.data[0]

    notification = Notification(
        user_id=deliverable["influencer_id"],
        title=f"Script {'Approved' if request.approved else 'Rejected'}",
        message=request.feedback or f"Your script has been {'approved' if request.approved else 'rejected'}",
        type="script_review"
    )
    await supabase.table("notifications").insert(notification.model_dump(mode='json')).execute()

    return {"message": "Script reviewed successfully"}


# ==================== AI REVIEW ====================

@api_router.post("/ai/review-script")
async def ai_review_script(deliverable_id: str):
    from emergentintegrations.llm.chat import LlmChat, UserMessage

    result = await supabase.table("deliverables").select("*").eq("id", deliverable_id).execute()
    deliverable = result.data[0] if result.data else None
    if not deliverable:
        raise HTTPException(status_code=404, detail="Deliverable not found")

    camp_result = await supabase.table("campaigns").select("*").eq("id", deliverable["campaign_id"]).execute()
    campaign = camp_result.data[0]

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
        import json as json_lib
        api_key = os.environ.get('EMERGENT_LLM_KEY')
        chat = LlmChat(
            api_key=api_key,
            session_id=f"script_review_{deliverable_id}",
            system_message=system_message
        ).with_model("openai", "gpt-5.2")

        response = await chat.send_message(UserMessage(text=user_message))

        try:
            review_result = json_lib.loads(response)
        except Exception:
            review_result = {"approved": True, "overall_score": 75, "feedback": response}

        status = DeliverableStatus.APPROVED if review_result["approved"] else DeliverableStatus.REJECTED

        await supabase.table("deliverables").update({
            "ai_review_result": review_result,
            "status": status,
            "review_feedback": review_result.get("feedback"),
            "reviewed_at": datetime.utcnow().isoformat()
        }).eq("id", deliverable_id).execute()

        notification = Notification(
            user_id=deliverable["influencer_id"],
            title=f"AI Script Review: {'Approved' if review_result['approved'] else 'Rejected'}",
            message=review_result.get("feedback", "Your script has been reviewed by AI"),
            type="script_review"
        )
        await supabase.table("notifications").insert(notification.model_dump(mode='json')).execute()

        return {"review": review_result}

    except Exception as e:
        logger.error(f"AI review error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"AI review failed: {str(e)}")


# ==================== PAYMENT ROUTES ====================

async def release_payment_for_deliverable(campaign_influencer_id: str):
    ci_result = await supabase.table("campaign_influencers").select("*").eq("id", campaign_influencer_id).execute()
    campaign_influencer = ci_result.data[0] if ci_result.data else None
    if not campaign_influencer or campaign_influencer["payment_released"]:
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

    await supabase.table("payment_releases").insert(payment_release.model_dump(mode='json')).execute()

    await supabase.table("campaign_influencers").update({
        "payment_released": True,
        "payment_released_at": datetime.utcnow().isoformat()
    }).eq("id", campaign_influencer_id).execute()

    notification = Notification(
        user_id=campaign_influencer["influencer_id"],
        title="Payment Released",
        message=f"Payment of ₹{final_amount:.2f} has been released to your account",
        type="payment_released"
    )
    await supabase.table("notifications").insert(notification.model_dump(mode='json')).execute()


@api_router.post("/payments/initiate")
async def initiate_payment(campaign_id: str, producer_id: str, amount: float):
    import uuid as uuid_lib
    payment = Payment(
        campaign_id=campaign_id,
        producer_id=producer_id,
        amount=amount,
        payment_gateway_id=f"mock_razorpay_{uuid_lib.uuid4().hex[:8]}",
        status="completed"
    )

    await supabase.table("payments").insert(payment.model_dump(mode='json')).execute()
    return {"payment": payment.model_dump(mode='json'), "message": "Payment initiated successfully (Mock)"}


@api_router.get("/payments/history/{user_id}")
async def get_payment_history(user_id: str, role: str):
    if role == "producer":
        result = await supabase.table("payments").select("*").eq("producer_id", user_id).execute()
        return {"payments": result.data}
    else:
        result = await supabase.table("payment_releases").select("*").eq("influencer_id", user_id).execute()
        return {"payments": result.data}


# ==================== ANALYTICS ROUTES ====================

@api_router.get("/analytics/producer-dashboard/{producer_id}")
async def get_producer_dashboard(producer_id: str):
    campaigns_result = await supabase.table("campaigns").select("*").eq("producer_id", producer_id).execute()
    campaigns = campaigns_result.data

    total_campaigns = len(campaigns)
    active_campaigns = len([c for c in campaigns if c["status"] == "active"])
    total_budget = sum(c["total_budget"] for c in campaigns)
    total_spent = sum(c["budget_spent"] for c in campaigns)

    influencers_count = 0
    campaign_ids = [c["id"] for c in campaigns]
    if campaign_ids:
        ci_result = await supabase.table("campaign_influencers").select("id").in_("campaign_id", campaign_ids).execute()
        influencers_count = len(ci_result.data)

    return {
        "total_campaigns": total_campaigns,
        "active_campaigns": active_campaigns,
        "total_budget": total_budget,
        "total_spent": total_spent,
        "total_influencers": influencers_count,
        "campaigns": campaigns
    }


@api_router.get("/analytics/influencer-dashboard/{influencer_id}")
async def get_influencer_dashboard(influencer_id: str):
    ci_result = await supabase.table("campaign_influencers").select("*").eq("influencer_id", influencer_id).execute()
    campaign_influencers = ci_result.data

    pay_result = await supabase.table("payment_releases").select("*").eq("influencer_id", influencer_id).eq("status", "released").execute()
    payments = pay_result.data

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
    camp_result = await supabase.table("campaigns").select("*").eq("id", campaign_id).execute()
    campaign = camp_result.data[0] if camp_result.data else None
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")

    del_result = await supabase.table("deliverables").select("*").eq("campaign_id", campaign_id).execute()
    deliverables = del_result.data

    live_posts = [d for d in deliverables if d["status"] == "live"]
    total_engagement = sum((d.get("engagement_data") or {}).get("total", 0) for d in live_posts)
    total_reach = sum((d.get("engagement_data") or {}).get("reach", 0) for d in live_posts)
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
    query = supabase.table("notifications").select("*").eq("user_id", user_id).order("created_at", desc=True).limit(100)
    if unread_only:
        query = query.eq("read", False)
    result = await query.execute()
    return {"notifications": result.data}


@api_router.put("/notifications/{notification_id}/read")
async def mark_notification_read(notification_id: str):
    await supabase.table("notifications").update({"read": True}).eq("id", notification_id).execute()
    return {"message": "Notification marked as read"}


# ==================== ADMIN ROUTES ====================

@api_router.get("/admin/dashboard")
async def get_admin_dashboard():
    total_users = (await supabase.table("users").select("id", count="exact").execute()).count
    total_producers = (await supabase.table("users").select("id", count="exact").eq("role", "producer").execute()).count
    total_influencers = (await supabase.table("users").select("id", count="exact").eq("role", "influencer").execute()).count
    total_campaigns = (await supabase.table("campaigns").select("id", count="exact").execute()).count
    pending_verifications = (await supabase.table("users").select("id", count="exact").eq("role", "influencer").eq("is_verified", False).execute()).count

    payments = (await supabase.table("payment_releases").select("*").eq("status", "released").execute()).data
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
    result = await supabase.table("users").update({
        "is_verified": approved,
        "is_active": approved
    }).eq("id", influencer_id).eq("role", "influencer").execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="Influencer not found")

    notification = Notification(
        user_id=influencer_id,
        title=f"Verification {'Approved' if approved else 'Rejected'}",
        message=f"Your account has been {'approved' if approved else 'rejected'} by the admin",
        type="verification_status"
    )
    await supabase.table("notifications").insert(notification.model_dump(mode='json')).execute()

    return {"message": f"Influencer {'verified' if approved else 'rejected'}"}


@api_router.get("/admin/settings")
async def get_admin_settings():
    settings = await get_platform_settings()
    return {"settings": settings}


@api_router.put("/admin/settings")
async def update_admin_settings(updates: dict):
    updates.pop("id", None)
    updates["updated_at"] = datetime.utcnow().isoformat()

    existing = await supabase.table("platform_settings").select("id").limit(1).execute()
    if existing.data:
        await supabase.table("platform_settings").update(updates).eq("id", existing.data[0]["id"]).execute()
    else:
        await supabase.table("platform_settings").insert(updates).execute()

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

    await supabase.table("booking_analytics_access").insert(access.model_dump(mode='json')).execute()
    return {"access": access.model_dump(mode='json'), "message": "Access purchased successfully"}


@api_router.get("/booking-analytics/data")
async def get_booking_analytics(producer_id: str):
    result = await supabase.table("booking_analytics_access").select("*").eq("producer_id", producer_id).eq("is_active", True).gte("expires_at", datetime.utcnow().isoformat()).execute()
    access = result.data[0] if result.data else None

    if not access:
        raise HTTPException(status_code=403, detail="No active access to booking analytics")

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
    try:
        campaign_result = await supabase.table("campaigns").select("*").eq("id", request.campaign_id).execute()
        campaign = campaign_result.data[0] if campaign_result.data else None
        if not campaign:
            raise HTTPException(status_code=404, detail="Campaign not found")

        total_amount = 0
        for influencer_id in request.influencer_ids:
            inf_result = await supabase.table("users").select("cost_per_post").eq("id", influencer_id).eq("role", "influencer").execute()
            if inf_result.data:
                total_amount += inf_result.data[0].get("cost_per_post", 0)

        razorpay_order = razorpay_client.order.create({
            "amount": int(total_amount * 100),
            "currency": "INR",
            "payment_capture": 1,
            "notes": {
                "campaign_id": request.campaign_id,
                "producer_id": request.producer_id
            }
        })

        order = RazorpayOrder(
            campaign_id=request.campaign_id,
            producer_id=request.producer_id,
            razorpay_order_id=razorpay_order["id"],
            amount=total_amount,
            status="created"
        )
        await supabase.table("razorpay_orders").insert(order.model_dump(mode='json')).execute()

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
    try:
        generated_signature = hmac.new(
            os.environ.get('RAZORPAY_KEY_SECRET').encode(),
            f"{request.razorpay_order_id}|{request.razorpay_payment_id}".encode(),
            hashlib.sha256
        ).hexdigest()

        if generated_signature != request.razorpay_signature:
            raise HTTPException(status_code=400, detail="Invalid payment signature")

        await supabase.table("razorpay_orders").update({
            "status": "paid",
            "paid_at": datetime.utcnow().isoformat()
        }).eq("id", request.order_id).execute()

        payment = RazorpayPayment(
            order_id=request.order_id,
            razorpay_payment_id=request.razorpay_payment_id,
            razorpay_order_id=request.razorpay_order_id,
            razorpay_signature=request.razorpay_signature,
            amount=0
        )
        await supabase.table("razorpay_payments").insert(payment.model_dump(mode='json')).execute()

        order_result = await supabase.table("razorpay_orders").select("*").eq("id", request.order_id).execute()
        order = order_result.data[0]

        ci_result = await supabase.table("campaign_influencers").select("*").eq("campaign_id", order["campaign_id"]).execute()
        settings = await get_platform_settings()
        commission = settings["platform_commission"]

        for ci in ci_result.data:
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
            await supabase.table("escrow_releases").insert(escrow.model_dump(mode='json')).execute()

        return {"status": "success", "message": "Payment verified and moved to escrow"}

    except Exception as e:
        logger.error(f"Payment verification error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.post("/payments/release/{campaign_influencer_id}")
async def release_escrow_payment(campaign_influencer_id: str):
    try:
        escrow_result = await supabase.table("escrow_releases").select("*").eq("campaign_influencer_id", campaign_influencer_id).eq("status", "held").execute()
        escrow = escrow_result.data[0] if escrow_result.data else None

        if not escrow:
            raise HTTPException(status_code=404, detail="No held escrow found")

        deliverable_result = await supabase.table("deliverables").select("id").eq("campaign_influencer_id", campaign_influencer_id).eq("status", "live").execute()
        if not deliverable_result.data:
            raise HTTPException(status_code=400, detail="Deliverable not yet live")

        await supabase.table("escrow_releases").update({
            "status": "released",
            "released_at": datetime.utcnow().isoformat()
        }).eq("id", escrow["id"]).execute()

        await supabase.table("campaign_influencers").update({
            "payment_released": True,
            "payment_released_at": datetime.utcnow().isoformat()
        }).eq("id", campaign_influencer_id).execute()

        notification = Notification(
            user_id=escrow["influencer_id"],
            title="Payment Released",
            message=f"Payment of ₹{escrow['final_amount']:.2f} has been released",
            type="payment_released"
        )
        await supabase.table("notifications").insert(notification.model_dump(mode='json')).execute()

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
    try:
        result = await supabase.table("deliverables").select("*").eq("campaign_id", campaign_id).execute()
        deliverables = result.data

        for deliverable in deliverables:
            inf_result = await supabase.table("users").select("name, instagram_handle, follower_count").eq("id", deliverable["influencer_id"]).execute()
            deliverable["influencer"] = inf_result.data[0] if inf_result.data else None

        tracker = {"newly_added": [], "pending": [], "submitted": [], "accepted": [], "rejected": [], "live": []}

        for deliverable in deliverables:
            status = deliverable["status"]
            if status == "newly_added":
                tracker["newly_added"].append(deliverable)
            elif status == "pending":
                tracker["pending"].append(deliverable)
            elif status in ("submitted", "under_review"):
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
    try:
        campaign_result = await supabase.table("campaigns").select("*").eq("id", campaign_id).execute()
        campaign = campaign_result.data[0] if campaign_result.data else None
        if not campaign:
            raise HTTPException(status_code=404, detail="Campaign not found")

        for influencer_id in request.influencer_ids:
            inf_result = await supabase.table("users").select("*").eq("id", influencer_id).eq("role", "influencer").execute()
            influencer = inf_result.data[0] if inf_result.data else None
            if not influencer:
                continue

            campaign_influencer = CampaignInfluencer(
                campaign_id=campaign_id,
                influencer_id=influencer_id,
                request_status=CampaignRequestStatus.ACCEPTED,
                cost=influencer.get("cost_per_post", 0),
                responded_at=datetime.utcnow()
            )

            await supabase.table("campaign_influencers").insert(campaign_influencer.model_dump(mode='json')).execute()

            for phase in campaign["campaign_phases"]:
                deliverable = Deliverable(
                    campaign_id=campaign_id,
                    influencer_id=influencer_id,
                    campaign_influencer_id=campaign_influencer.id,
                    phase=phase,
                    status=DeliverableStatus.NEWLY_ADDED
                )
                await supabase.table("deliverables").insert(deliverable.model_dump(mode='json')).execute()

            notification = Notification(
                user_id=influencer_id,
                title="Added to Campaign",
                message=f"You've been added to {campaign['movie_title']} campaign",
                type="campaign_added"
            )
            await supabase.table("notifications").insert(notification.model_dump(mode='json')).execute()

        return {"status": "success", "message": "Influencers confirmed and deliverables created"}

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
    pass
