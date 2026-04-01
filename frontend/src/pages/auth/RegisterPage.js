import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI } from '../../services/api';
import { toast } from 'sonner';
import { Film, Instagram, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { districtsByState, allStates } from '../../data/regions';

const CATEGORIES = ['Lifestyle', 'Couples', 'Family', 'Youth', 'Kids', 'Music', 'Meme', 'Review', 'Film', 'Fan Pages', 'Actor Pages'];
const STATES = allStates;

const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role');

  const [role, setRole] = useState(initialRole || null);
  const [loading, setLoading] = useState(false);

  const [producerForm, setProducerForm]   = useState({ email: '', name: '', gst_number: '', website: '', mobile: '', password: '', confirm_password: '' });
  const [influencerForm, setInfluencerForm] = useState({
    email: '', name: '', age: '', account_type: 'creator', instagram_handle: '',
    location_state: 'Kerala', location_district: '', categories: [],
    mobile: '', gender: 'male', follower_count: '', engagement_rate: '', cost_per_post: '',
    password: '', confirm_password: '',
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleProducerRegister = async (e) => {
    e.preventDefault();
    if (producerForm.password !== producerForm.confirm_password) {
      toast.error('Passwords do not match'); return;
    }
    if (producerForm.password.length < 8) {
      toast.error('Password must be at least 8 characters'); return;
    }
    setLoading(true);
    try {
      const { confirm_password, ...payload } = producerForm;
      const response = await authAPI.registerProducer(payload);
      login(response.data.user);
      toast.success('Producer account created!');
      navigate('/producer/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Registration failed');
    } finally { setLoading(false); }
  };

  const handleInfluencerRegister = async (e) => {
    e.preventDefault();
    if (influencerForm.password !== influencerForm.confirm_password) {
      toast.error('Passwords do not match'); return;
    }
    if (influencerForm.password.length < 8) {
      toast.error('Password must be at least 8 characters'); return;
    }
    setLoading(true);
    try {
      const { confirm_password, ...payload } = influencerForm;
      const data = {
        ...payload,
        age: parseInt(payload.age),
        follower_count: parseInt(payload.follower_count) || 0,
        engagement_rate: parseFloat(payload.engagement_rate) || 0,
        cost_per_post: parseFloat(payload.cost_per_post) || 0,
      };
      const response = await authAPI.registerInfluencer(data);
      login(response.data.user);
      toast.success('Account created! Now connect your Instagram.');
      // Redirect to Instagram verification — required before using the platform
      navigate('/influencer/verify-instagram', {
        state: { instagram_handle: influencerForm.instagram_handle }
      });
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Registration failed');
    } finally { setLoading(false); }
  };

  const setP = (k, v) => setProducerForm(f => ({ ...f, [k]: v }));
  const setI = (k, v) => setInfluencerForm(f => ({ ...f, [k]: v }));
  const toggleCat = (cat) => setInfluencerForm(f => ({
    ...f,
    categories: f.categories.includes(cat) ? f.categories.filter(c => c !== cat) : [...f.categories, cat],
  }));

  /* ─── Step 1: Role Selection ─── */
  if (!role) {
    return (
      <AuthShell>
        <p className="text-sm text-[#888] mb-8 text-center">Create your free account</p>
        <div className="space-y-4">
          <RoleCard
            icon={Film} iconBg="#eef1ff" iconColor="#0028aa"
            title="Producer" subtitle="Market your film to 12,000+ influencers"
            onClick={() => setRole('producer')}
          />
          <RoleCard
            icon={Instagram} iconBg="#fce8ff" iconColor="#9333ea"
            title="Influencer" subtitle="Get paid to promote movies"
            onClick={() => setRole('influencer')}
          />
        </div>
        <div className="mt-8 text-center text-sm text-[#999]">
          Already have an account?{' '}
          <Link to="/login" className="text-[#0028aa] font-semibold hover:underline">Sign in</Link>
        </div>
      </AuthShell>
    );
  }

  /* ─── Producer Registration Form ─── */
  if (role === 'producer') {
    return (
      <AuthShell onBack={() => setRole(null)} wide>
        <div className="flex items-center gap-3 mb-6 justify-center">
          <div className="w-10 h-10 rounded-xl bg-[#eef1ff] flex items-center justify-center">
            <Film className="w-5 h-5 text-[#0028aa]" />
          </div>
          <div>
            <div className="font-heading font-bold text-[#0028aa]">Producer Registration</div>
            <div className="text-xs text-[#999]">Register your production company</div>
          </div>
        </div>

        <form onSubmit={handleProducerRegister} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full Name *" type="text" value={producerForm.name} onChange={v => setP('name', v)} placeholder="Kiran Rao" required />
            <Field label="Email *" type="email" value={producerForm.email} onChange={v => setP('email', v)} placeholder="kiran@studio.com" required />
            <Field label="GST Number *" type="text" value={producerForm.gst_number} onChange={v => setP('gst_number', v)} placeholder="22AAAAA0000A1Z5" mono required />
            <Field label="Phone Number *" type="tel" value={producerForm.mobile} onChange={v => setP('mobile', v)} placeholder="+91 98765 43210" mono required />
            <Field label="Password *" type="password" value={producerForm.password} onChange={v => setP('password', v)} placeholder="Min 8 characters" required />
            <Field label="Confirm Password *" type="password" value={producerForm.confirm_password} onChange={v => setP('confirm_password', v)} placeholder="Repeat password" required />
            <div className="sm:col-span-2">
              <Field label="Website" type="url" value={producerForm.website} onChange={v => setP('website', v)} placeholder="https://yourstudio.com" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <SubmitButton loading={loading} label="Create Producer Account" color="#0028aa" />
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-[#999]">
          Already registered?{' '}
          <Link to="/login?role=producer" className="text-[#0028aa] font-semibold hover:underline">Sign in</Link>
        </div>
      </AuthShell>
    );
  }

  /* ─── Influencer Registration Form ─── */
  return (
    <AuthShell onBack={() => setRole(null)} wide>
      <div className="flex items-center gap-3 mb-6 justify-center">
        <div className="w-10 h-10 rounded-xl bg-[#fce8ff] flex items-center justify-center">
          <Instagram className="w-5 h-5 text-[#9333ea]" />
        </div>
        <div>
          <div className="font-heading font-bold text-[#9333ea]">Influencer Registration</div>
          <div className="text-xs text-[#999]">Join BigSocial and start earning</div>
        </div>
      </div>

      <form onSubmit={handleInfluencerRegister} className="space-y-5">
        {/* Basic info */}
        <div>
          <SectionLabel>Basic Info</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full Name *" type="text" value={influencerForm.name} onChange={v => setI('name', v)} placeholder="Arya Menon" required accent="#9333ea" />
            <Field label="Email *" type="email" value={influencerForm.email} onChange={v => setI('email', v)} placeholder="arya@email.com" required accent="#9333ea" />
            <Field label="Password *" type="password" value={influencerForm.password} onChange={v => setI('password', v)} placeholder="Min 8 characters" required accent="#9333ea" />
            <Field label="Confirm Password *" type="password" value={influencerForm.confirm_password} onChange={v => setI('confirm_password', v)} placeholder="Repeat password" required accent="#9333ea" />
            <Field label="Instagram Handle *" type="text" value={influencerForm.instagram_handle} onChange={v => setI('instagram_handle', v)} placeholder="@aryamenon" required accent="#9333ea" />
            <Field label="Phone Number *" type="tel" value={influencerForm.mobile} onChange={v => setI('mobile', v)} placeholder="+91 98765 43210" mono required accent="#9333ea" />
            <Field label="Age *" type="number" value={influencerForm.age} onChange={v => setI('age', v)} placeholder="24" required accent="#9333ea" />
            <div>
              <label className="block text-sm font-semibold text-[#1b1c19] mb-1.5">Gender *</label>
              <select value={influencerForm.gender} onChange={e => setI('gender', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#f8f9fa] border-2 border-transparent text-sm outline-none focus:border-[#9333ea] focus:bg-white transition-colors">
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Location */}
        <div>
          <SectionLabel>Location</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#1b1c19] mb-1.5">State *</label>
              <select
                value={influencerForm.location_state}
                onChange={e => { setI('location_state', e.target.value); setI('location_district', ''); }}
                className="w-full px-4 py-3 rounded-xl bg-[#f8f9fa] border-2 border-transparent text-sm outline-none focus:border-[#9333ea] focus:bg-white transition-colors"
              >
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1b1c19] mb-1.5">District *</label>
              <select
                value={influencerForm.location_district}
                onChange={e => setI('location_district', e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-[#f8f9fa] border-2 border-transparent text-sm outline-none focus:border-[#9333ea] focus:bg-white transition-colors"
              >
                <option value="">Select district</option>
                {(districtsByState[influencerForm.location_state] || []).map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Instagram metrics */}
        <div>
          <SectionLabel>Instagram Metrics</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Followers *" type="number" value={influencerForm.follower_count} onChange={v => setI('follower_count', v)} placeholder="25000" mono required accent="#9333ea" />
            <Field label="Engagement Rate (%) *" type="number" step="0.1" value={influencerForm.engagement_rate} onChange={v => setI('engagement_rate', v)} placeholder="3.5" mono required accent="#9333ea" />
            <Field label="Cost Per Post (₹) *" type="number" value={influencerForm.cost_per_post} onChange={v => setI('cost_per_post', v)} placeholder="5000" mono required accent="#9333ea" />
          </div>
        </div>

        {/* Categories */}
        <div>
          <SectionLabel>Content Categories * <span className="text-[#bbb] font-normal">(select at least one)</span></SectionLabel>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {CATEGORIES.map(cat => {
              const selected = influencerForm.categories.includes(cat);
              return (
                <button key={cat} type="button" onClick={() => toggleCat(cat)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all border-2 ${
                    selected
                      ? 'border-[#9333ea] bg-[#fdf5ff] text-[#9333ea]'
                      : 'border-[#eee] bg-[#f8f9fa] text-[#666] hover:border-[#e9d5ff]'
                  }`}>
                  {selected && <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />}
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        <SubmitButton loading={loading} label="Create Influencer Account" color="#9333ea" />
      </form>

      <div className="mt-6 text-center text-sm text-[#999]">
        Already registered?{' '}
        <Link to="/login?role=influencer" className="text-[#9333ea] font-semibold hover:underline">Sign in</Link>
      </div>
    </AuthShell>
  );
};

/* ── Shared sub-components ── */

const AuthShell = ({ children, onBack, wide }) => (
  <div className="min-h-screen bg-[#f8faff] flex flex-col items-center justify-center px-4 py-12">
    <div className={`w-full ${wide ? 'max-w-2xl' : 'max-w-md'}`}>
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
        {onBack && (
          <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-[#888] hover:text-[#0028aa] mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        )}
        <h2 className="text-2xl font-heading font-bold text-center mb-2">Create Account</h2>
        {children}
      </div>
    </div>
  </div>
);

const RoleCard = ({ icon: Icon, iconBg, iconColor, title, subtitle, onClick }) => (
  <button onClick={onClick}
    className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-[#f0f0f0] hover:border-[#c7d2fe] hover:bg-[#f8faff] transition-all text-left group">
    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: iconBg }}>
      <Icon className="w-6 h-6" style={{ color: iconColor }} />
    </div>
    <div className="flex-1">
      <div className="font-heading font-bold">{title}</div>
      <div className="text-sm text-[#999]">{subtitle}</div>
    </div>
    <ArrowRight className="w-5 h-5 text-[#ccc] group-hover:text-[#0028aa] transition-colors" />
  </button>
);

const Field = ({ label, type, value, onChange, placeholder, required, mono, step, accent = '#0028aa' }) => (
  <div>
    <label className="block text-sm font-semibold text-[#1b1c19] mb-1.5">{label}</label>
    <input
      type={type} value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} required={required} step={step}
      className={`w-full px-4 py-3 rounded-xl bg-[#f8f9fa] border-2 border-transparent text-sm outline-none transition-colors ${mono ? 'font-mono' : ''}`}
      onFocus={e => { e.target.style.borderColor = accent; e.target.style.background = '#fff'; }}
      onBlur={e => { e.target.style.borderColor = 'transparent'; e.target.style.background = '#f8f9fa'; }}
    />
  </div>
);

const SectionLabel = ({ children }) => (
  <div className="text-xs font-semibold uppercase tracking-wider text-[#aaa] mb-3">{children}</div>
);

const SubmitButton = ({ loading, label, color = '#0028aa' }) => (
  <button type="submit" disabled={loading}
    className="w-full py-3.5 rounded-2xl font-bold text-sm text-white transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
    style={{ background: color }}>
    {loading ? 'Creating account…' : label}
  </button>
);

export default RegisterPage;
