import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import {
  Instagram, CheckCircle2, AlertCircle, ArrowRight,
  Loader2, ShieldCheck, RefreshCw, ExternalLink,
} from 'lucide-react';
import { Film } from 'lucide-react';
import { Link } from 'react-router-dom';

/* ── Mock Instagram OAuth config ── */
const INSTA_APP_ID    = process.env.REACT_APP_INSTAGRAM_APP_ID || 'YOUR_APP_ID';
const INSTA_REDIRECT  = `${window.location.origin}/influencer/verify-instagram/callback`;
const INSTA_SCOPE     = 'user_profile,user_media';
const INSTA_AUTH_URL  = `https://api.instagram.com/oauth/authorize?client_id=${INSTA_APP_ID}&redirect_uri=${encodeURIComponent(INSTA_REDIRECT)}&scope=${INSTA_SCOPE}&response_type=code`;

const STEPS = [
  { id: 'connect',  label: 'Connect Instagram'   },
  { id: 'fetch',    label: 'Fetch Profile'        },
  { id: 'verify',   label: 'Verify Handle'        },
  { id: 'complete', label: 'Complete'             },
];

const InstagramVerification = () => {
  const navigate   = useNavigate();
  const location   = useLocation();
  const { user, login } = useAuth();

  /* If coming back from OAuth callback, location.search will have ?code=... */
  const searchParams = new URLSearchParams(location.search);
  const oauthCode    = searchParams.get('code');
  const oauthError   = searchParams.get('error');

  const [stage, setStage] = useState(oauthCode ? 'fetching' : oauthError ? 'error' : 'idle');
  const [verifiedHandle, setVerifiedHandle] = useState(null);
  const [profileData,    setProfileData]    = useState(null);
  const [mockStep,       setMockStep]       = useState(0);

  const instagramHandle = user?.instagram_handle || location.state?.instagram_handle || '@yourhandle';

  /* ── Simulate the OAuth callback token exchange + profile fetch ── */
  useEffect(() => {
    if (stage !== 'fetching') return;

    const steps = [
      { delay: 800,  action: () => { setMockStep(1); } },              // exchanging code
      { delay: 1600, action: () => { setMockStep(2); } },              // fetching profile
      { delay: 2400, action: () => {                                    // verifying handle
        setMockStep(3);
        setProfileData({
          id: '17841400000000000',
          username: instagramHandle.replace('@', ''),
          account_type: 'PERSONAL',
          media_count: 47,
        });
      }},
      { delay: 3400, action: () => {                                    // done
        setVerifiedHandle(instagramHandle);
        setStage('verified');
        toast.success('Instagram account connected successfully!');
      }},
    ];

    const timers = steps.map(({ delay, action }) => setTimeout(action, delay));
    return () => timers.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  const handleConnect = () => {
    /* In production this would open the real Instagram OAuth URL.
       For dev/demo we simulate the callback return. */
    if (INSTA_APP_ID === 'YOUR_APP_ID') {
      /* Demo mode — simulate the full flow in-page */
      setStage('fetching');
    } else {
      window.location.href = INSTA_AUTH_URL;
    }
  };

  const handleSkip = () => {
    toast.info('You can verify Instagram from your profile settings later.');
    navigate('/influencer/dashboard');
  };

  const handleContinue = () => {
    navigate('/influencer/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#f8faff] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-xl bg-[#0028aa] flex items-center justify-center">
              <Film className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-heading font-bold">Big<span className="text-[#0028aa]">Social</span></span>
          </Link>
          <p className="text-sm text-[#888]">Movie Marketing Platform</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-[#eee] p-8">

          {/* ── Header ── */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)' }}>
              <Instagram className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-heading font-bold text-[#1b1c19]">Connect Instagram</h2>
              <p className="text-xs text-[#888]">Required to receive campaign bookings</p>
            </div>
          </div>

          {/* ── Step tracker ── */}
          <div className="flex items-center gap-1 mb-8">
            {STEPS.map((s, i) => {
              const done    = mockStep > i;
              const current = mockStep === i && stage === 'fetching';
              return (
                <React.Fragment key={s.id}>
                  <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                    done    ? 'bg-[#9333ea]'
                    : current ? 'bg-[#e9d5ff]'
                    : stage === 'verified' ? 'bg-[#9333ea]'
                    : 'bg-[#f1f3f5]'
                  }`} />
                </React.Fragment>
              );
            })}
          </div>

          {/* ── IDLE: ask user to connect ── */}
          {stage === 'idle' && (
            <div className="space-y-5">
              <div className="bg-[#fdf5ff] rounded-2xl p-4 border border-[#e9d5ff]">
                <p className="text-xs font-bold text-[#9333ea] uppercase tracking-wider mb-1">Registered Handle</p>
                <p className="text-sm font-bold text-[#1b1c19] flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-[#9333ea]" />
                  {instagramHandle}
                </p>
              </div>

              <div className="space-y-3 text-sm text-[#555]">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#059669] flex-shrink-0 mt-0.5" />
                  <span>We verify you own this account — no posting access required</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#059669] flex-shrink-0 mt-0.5" />
                  <span>Read-only access: profile info and follower count only</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#059669] flex-shrink-0 mt-0.5" />
                  <span>You can disconnect at any time from account settings</span>
                </div>
              </div>

              <button
                onClick={handleConnect}
                className="w-full py-3.5 rounded-2xl text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)' }}
              >
                <Instagram className="w-4 h-4" />
                Continue with Instagram
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </button>

              <button
                onClick={handleSkip}
                className="w-full py-2.5 rounded-2xl text-sm font-semibold text-[#888] hover:text-[#1b1c19] transition-colors"
              >
                Skip for now — verify later
              </button>
            </div>
          )}

          {/* ── FETCHING: progress steps ── */}
          {stage === 'fetching' && (
            <div className="space-y-4 py-2">
              {[
                { step: 0, label: 'Authorising with Instagram…'   },
                { step: 1, label: 'Exchanging access token…'      },
                { step: 2, label: 'Fetching your profile data…'   },
                { step: 3, label: 'Verifying Instagram handle…'   },
              ].map(({ step, label }) => {
                const done    = mockStep > step;
                const current = mockStep === step;
                return (
                  <div key={step} className={`flex items-center gap-3 transition-opacity duration-300 ${mockStep < step ? 'opacity-30' : 'opacity-100'}`}>
                    {done ? (
                      <CheckCircle2 className="w-5 h-5 text-[#9333ea] flex-shrink-0" />
                    ) : current ? (
                      <Loader2 className="w-5 h-5 text-[#9333ea] animate-spin flex-shrink-0" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-[#eee] flex-shrink-0" />
                    )}
                    <span className={`text-sm ${done || current ? 'text-[#1b1c19] font-semibold' : 'text-[#aaa]'}`}>
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── VERIFIED: success ── */}
          {stage === 'verified' && profileData && (
            <div className="space-y-5">
              <div className="flex flex-col items-center py-4 gap-3">
                <div className="w-16 h-16 rounded-full bg-[#ecfdf5] flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-[#059669]" />
                </div>
                <div className="text-center">
                  <p className="font-heading font-bold text-lg text-[#1b1c19]">Instagram Connected!</p>
                  <p className="text-sm text-[#888] mt-0.5">Your account has been verified</p>
                </div>
              </div>

              {/* Profile data card */}
              <div className="bg-[#fdf5ff] rounded-2xl p-4 border border-[#e9d5ff] space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)' }}>
                    <Instagram className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-[#1b1c19]">@{profileData.username}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white rounded-xl p-2.5 text-center">
                    <p className="font-bold text-[#1b1c19]">{profileData.media_count}</p>
                    <p className="text-[#888]">Posts</p>
                  </div>
                  <div className="bg-white rounded-xl p-2.5 text-center">
                    <p className="font-bold text-[#059669]">Verified</p>
                    <p className="text-[#888]">Status</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleContinue}
                className="w-full py-3.5 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 hover:shadow-lg"
                style={{ background: '#9333ea' }}
              >
                Go to Dashboard <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ── ERROR ── */}
          {(stage === 'error' || oauthError) && (
            <div className="space-y-4">
              <div className="flex flex-col items-center py-4 gap-3">
                <div className="w-16 h-16 rounded-full bg-[#fef2f2] flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-[#dc2626]" />
                </div>
                <div className="text-center">
                  <p className="font-heading font-bold text-lg text-[#1b1c19]">Connection Failed</p>
                  <p className="text-sm text-[#888] mt-0.5">
                    {oauthError === 'access_denied'
                      ? 'You denied access. Please try again to use BigSocial.'
                      : 'Something went wrong connecting your Instagram account.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => { setStage('idle'); }}
                className="w-full py-3 rounded-2xl text-sm font-bold border-2 border-[#9333ea] text-[#9333ea] flex items-center justify-center gap-2 hover:bg-[#fdf5ff] transition-colors"
              >
                <RefreshCw className="w-4 h-4" /> Try Again
              </button>
              <button onClick={handleSkip} className="w-full py-2.5 rounded-2xl text-sm font-semibold text-[#888] hover:text-[#1b1c19] transition-colors">
                Skip for now
              </button>
            </div>
          )}

        </div>

        {/* Footer note */}
        <p className="text-xs text-center text-[#bbb] mt-5 px-4">
          By connecting, you authorise BigSocial to read your Instagram profile info.
          We never post on your behalf.{' '}
          <a href="#" className="underline hover:text-[#888]">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

export default InstagramVerification;
