import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI } from '../../services/api';
import { toast } from 'sonner';
import { Film, Instagram, ArrowLeft, ArrowRight, Mail, Lock, Chrome } from 'lucide-react';

// Step 1: Choose role  |  Step 2: Choose method  |  Step 3: Enter credentials
const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role'); // 'producer' | 'influencer'

  const [role, setRole] = useState(initialRole || null);
  const [method, setMethod] = useState(null); // 'google' | 'email' | 'instagram'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authAPI.login(email, role === 'admin' ? password : null, role);
      login(response.data.user);
      toast.success('Welcome back!');
      if (role === 'producer') navigate('/producer/dashboard');
      else if (role === 'influencer') navigate('/influencer/dashboard');
      else navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const back = () => {
    if (method) { setMethod(null); return; }
    setRole(null);
  };

  /* ─── Step 1: Role Selection ─── */
  if (!role) {
    return (
      <AuthShell>
        <p className="text-sm text-[#888] mb-8 text-center">Choose how you'd like to sign in</p>
        <div className="space-y-4">
          <RoleCard
            icon={Film}
            iconBg="#eef1ff" iconColor="#0028aa"
            title="Producer"
            subtitle="Sign in with Google or Email OTP"
            onClick={() => setRole('producer')}
          />
          <RoleCard
            icon={Instagram}
            iconBg="#fce8ff" iconColor="#9333ea"
            title="Influencer"
            subtitle="Sign in with Instagram"
            onClick={() => setRole('influencer')}
          />
        </div>
        <div className="mt-8 text-center text-sm text-[#999]">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#0028aa] font-semibold hover:underline">Register</Link>
        </div>
      </AuthShell>
    );
  }

  /* ─── Step 2: Method Selection (Producer) ─── */
  if (role === 'producer' && !method) {
    return (
      <AuthShell onBack={back} backLabel="Back">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl bg-[#eef1ff] flex items-center justify-center">
            <Film className="w-5 h-5 text-[#0028aa]" />
          </div>
          <div>
            <div className="font-heading font-bold text-[#0028aa]">Producer Login</div>
            <div className="text-xs text-[#999]">Choose your sign-in method</div>
          </div>
        </div>
        <div className="space-y-3">
          <MethodButton
            icon={<GoogleIcon />}
            label="Continue with Google"
            onClick={() => setMethod('google')}
          />
          <MethodButton
            icon={<Mail className="w-5 h-5 text-[#666]" />}
            label="Continue with Email / OTP"
            onClick={() => setMethod('email')}
            secondary
          />
        </div>
        <div className="mt-8 text-center text-sm text-[#999]">
          New here?{' '}
          <Link to="/register?role=producer" className="text-[#0028aa] font-semibold hover:underline">Create producer account</Link>
        </div>
      </AuthShell>
    );
  }

  /* ─── Step 2: Influencer — go straight to form ─── */
  if (role === 'influencer' && !method) {
    return (
      <AuthShell onBack={back} backLabel="Back">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl bg-[#fce8ff] flex items-center justify-center">
            <Instagram className="w-5 h-5 text-[#9333ea]" />
          </div>
          <div>
            <div className="font-heading font-bold text-[#9333ea]">Influencer Login</div>
            <div className="text-xs text-[#999]">Connect with Instagram</div>
          </div>
        </div>
        <MethodButton
          icon={<Instagram className="w-5 h-5 text-white" />}
          label="Continue with Instagram"
          onClick={() => setMethod('instagram')}
          instagram
        />
        <div className="mt-6 text-center text-xs text-[#bbb]">
          By continuing you agree to our Terms & Privacy Policy
        </div>
        <div className="mt-4 text-center text-sm text-[#999]">
          New influencer?{' '}
          <Link to="/register?role=influencer" className="text-[#9333ea] font-semibold hover:underline">Join BigSocial</Link>
        </div>
      </AuthShell>
    );
  }

  /* ─── Admin login (hidden route) ─── */
  if (role === 'admin') {
    return (
      <AuthShell onBack={() => navigate('/')} backLabel="Home">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl bg-[#fef2f2] flex items-center justify-center">
            <Lock className="w-5 h-5 text-[#dc2626]" />
          </div>
          <div>
            <div className="font-heading font-bold text-[#dc2626]">Admin Access</div>
            <div className="text-xs text-[#999]">Restricted — authorised users only</div>
          </div>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <InputField label="Email" type="email" value={email} onChange={setEmail} placeholder="admin@movie.com" required />
          <InputField label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" required />
          <SubmitButton loading={loading} label="Sign In" />
        </form>
      </AuthShell>
    );
  }

  /* ─── Step 3: Credentials form ─── */
  const isInstagram = method === 'instagram';
  const accent = role === 'influencer' ? '#9333ea' : '#0028aa';
  const accentBg = role === 'influencer' ? '#fce8ff' : '#eef1ff';
  const MethodIcon = method === 'google' ? GoogleIcon : method === 'instagram' ? () => <Instagram className="w-5 h-5" style={{ color: accent }} /> : () => <Mail className="w-5 h-5" style={{ color: accent }} />;
  const methodLabel = method === 'google' ? 'Google Account' : method === 'instagram' ? 'Instagram Account' : 'Email / OTP';

  return (
    <AuthShell onBack={back} backLabel="Back">
      <div className="flex items-center gap-3 mb-8 justify-center">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: accentBg }}>
          <MethodIcon />
        </div>
        <div>
          <div className="font-heading font-bold" style={{ color: accent }}>
            Sign in via {methodLabel}
          </div>
          <div className="text-xs text-[#999] capitalize">{role} login</div>
        </div>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <InputField
          label={isInstagram ? 'Email linked to Instagram' : 'Email address'}
          type="email"
          value={email}
          onChange={setEmail}
          placeholder={isInstagram ? 'your@instagram-email.com' : 'your@email.com'}
          required
          accent={accent}
        />
        {method === 'email' && (
          <div>
            <InputField label="OTP / Password" type="password" value={password} onChange={setPassword} placeholder="Enter OTP sent to email" accent={accent} />
            <p className="text-xs text-[#999] mt-1">An OTP will be sent to your email on submit</p>
          </div>
        )}
        <SubmitButton loading={loading} label={`Sign In as ${role === 'producer' ? 'Producer' : 'Influencer'}`} color={accent} />
      </form>

      <div className="mt-6 text-center text-sm text-[#999]">
        Don't have an account?{' '}
        <Link to={`/register?role=${role}`} className="font-semibold hover:underline" style={{ color: accent }}>Register</Link>
      </div>
    </AuthShell>
  );
};

/* ── Shared sub-components ── */

const AuthShell = ({ children, onBack, backLabel }) => (
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
        {onBack && (
          <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-[#888] hover:text-[#0028aa] mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> {backLabel}
          </button>
        )}
        <h2 className="text-2xl font-heading font-bold text-center mb-2">Welcome back</h2>
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

const MethodButton = ({ icon, label, onClick, secondary, instagram }) => (
  <button onClick={onClick}
    className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl font-semibold text-sm transition-all hover:-translate-y-0.5 ${
      instagram
        ? 'text-white'
        : secondary
        ? 'bg-[#f8f9fa] border border-[#eee] text-[#1b1c19] hover:bg-[#eef1ff] hover:border-[#c7d2fe]'
        : 'bg-white border border-[#ddd] text-[#1b1c19] hover:bg-[#f8f9fa] shadow-sm'
    }`}
    style={instagram ? { background: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)' } : {}}>
    <span className="w-5 h-5 flex items-center justify-center">{icon}</span>
    {label}
  </button>
);

const InputField = ({ label, type, value, onChange, placeholder, required, accent = '#0028aa' }) => (
  <div>
    <label className="block text-sm font-semibold text-[#1b1c19] mb-1.5">{label}</label>
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-3 rounded-xl bg-[#f8f9fa] border-2 border-transparent text-sm transition-colors outline-none"
      style={{ '--tw-ring-color': accent }}
      onFocus={e => { e.target.style.borderColor = accent; e.target.style.background = '#fff'; }}
      onBlur={e => { e.target.style.borderColor = 'transparent'; e.target.style.background = '#f8f9fa'; }}
    />
  </div>
);

const SubmitButton = ({ loading, label, color = '#0028aa' }) => (
  <button type="submit" disabled={loading}
    className="w-full py-3.5 rounded-2xl font-bold text-sm text-white transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed mt-2"
    style={{ background: color }}>
    {loading ? 'Signing in…' : label}
  </button>
);

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

export default LoginPage;
