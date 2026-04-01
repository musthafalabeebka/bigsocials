import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';
import { toast } from 'sonner';
import Button from '../components/Button';
import { Film, User, Shield } from 'lucide-react';

const Login = () => {
  const [activeTab, setActiveTab] = useState('producer');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  // Producer register form
  const [producerForm, setProducerForm] = useState({
    email: '',
    name: '',
    gst_number: '',
    website: '',
    mobile: '',
  });

  // Influencer register form
  const [influencerForm, setInfluencerForm] = useState({
    email: '',
    name: '',
    age: '',
    account_type: 'creator',
    instagram_handle: '',
    location_state: 'Kerala',
    location_district: '',
    categories: [],
    mobile: '',
    gender: 'male',
    follower_count: '',
    engagement_rate: '',
    cost_per_post: '',
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const role = activeTab;
      const response = await authAPI.login(
        loginForm.email,
        role === 'admin' ? loginForm.password : null,
        role
      );

      login(response.data.user);
      toast.success('Login successful!');
      
      // Redirect based on role
      if (role === 'producer') navigate('/producer/dashboard');
      else if (role === 'influencer') navigate('/influencer/dashboard');
      else if (role === 'admin') navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleProducerRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.registerProducer(producerForm);
      login(response.data.user);
      toast.success('Registration successful!');
      navigate('/producer/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleInfluencerRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...influencerForm,
        age: parseInt(influencerForm.age),
        follower_count: parseInt(influencerForm.follower_count) || 0,
        engagement_rate: parseFloat(influencerForm.engagement_rate) || 0,
        cost_per_post: parseFloat(influencerForm.cost_per_post) || 0,
      };

      const response = await authAPI.registerInfluencer(data);
      
      if (response.data.requires_verification) {
        toast.info('Your account is pending admin verification');
      } else {
        login(response.data.user);
        toast.success('Registration successful!');
        navigate('/influencer/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Lifestyle', 'Couples', 'Family', 'Youth', 'Kids', 'Music', 
    'Meme', 'Review', 'Film', 'Fan Pages', 'Actor Pages'
  ];

  const states = ['Kerala', 'Tamil Nadu', 'Andhra Pradesh', 'Telangana'];

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-heading font-bold text-primary mb-2" data-testid="login-title">Big Social</h1>
          <p className="text-lg font-body text-muted-foreground">Movie Marketing Platform</p>
        </div>

        {/* Main Card */}
        <div className="bg-surface-container-lowest rounded-DEFAULT shadow-ambient-lg overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-outline-variant/20">
            {[
              { id: 'producer', label: 'Producer', icon: Film },
              { id: 'influencer', label: 'Influencer', icon: User },
              { id: 'admin', label: 'Admin', icon: Shield },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                data-testid={`tab-${id}`}
                onClick={() => {
                  setActiveTab(id);
                  setIsRegister(false);
                }}
                className={`flex-1 py-4 px-6 font-body font-semibold transition-all flex items-center justify-center gap-2 ${
                  activeTab === id
                    ? 'bg-primary text-on-primary'
                    : 'text-on-surface hover:bg-surface-container-high'
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-8">
            {!isRegister ? (
              // Login Form
              <form onSubmit={handleLogin} className="space-y-6" data-testid="login-form">
                <div>
                  <label className="block text-sm font-body font-semibold text-on-surface mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    data-testid="login-email-input"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-surface-container-highest border-2 border-transparent focus:border-primary focus:outline-none font-body"
                    placeholder={activeTab === 'admin' ? 'admin@movie.com' : 'your@email.com'}
                    required
                  />
                </div>

                {activeTab === 'admin' && (
                  <div>
                    <label className="block text-sm font-body font-semibold text-on-surface mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      data-testid="login-password-input"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-surface-container-highest border-2 border-transparent focus:border-primary focus:outline-none font-body"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                )}

                {activeTab !== 'admin' && (
                  <p className="text-sm text-muted-foreground font-body">
                    {activeTab === 'producer' ? '🔐 Mock Google OAuth' : '📸 Mock Instagram OAuth'}
                  </p>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  data-testid="login-submit-button"
                  disabled={loading}
                >
                  {loading ? 'Loading...' : `Sign in as ${activeTab}`}
                </Button>

                {activeTab !== 'admin' && (
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setIsRegister(true)}
                      className="text-primary font-body font-semibold hover:underline"
                      data-testid="switch-to-register-button"
                    >
                      Don't have an account? Register
                    </button>
                  </div>
                )}
              </form>
            ) : (
              // Register Forms
              <>
                {activeTab === 'producer' ? (
                  <form onSubmit={handleProducerRegister} className="space-y-6" data-testid="register-producer-form">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-body font-semibold text-on-surface mb-2">
                          Name *
                        </label>
                        <input
                          type="text"
                          data-testid="register-name-input"
                          value={producerForm.name}
                          onChange={(e) => setProducerForm({ ...producerForm, name: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg bg-surface-container-highest border-2 border-transparent focus:border-primary focus:outline-none font-body"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-body font-semibold text-on-surface mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          data-testid="register-email-input"
                          value={producerForm.email}
                          onChange={(e) => setProducerForm({ ...producerForm, email: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg bg-surface-container-highest border-2 border-transparent focus:border-primary focus:outline-none font-body"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-body font-semibold text-on-surface mb-2">
                          GST Number *
                        </label>
                        <input
                          type="text"
                          data-testid="register-gst-input"
                          value={producerForm.gst_number}
                          onChange={(e) => setProducerForm({ ...producerForm, gst_number: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg bg-surface-container-highest border-2 border-transparent focus:border-primary focus:outline-none font-body font-mono"
                          placeholder="22AAAAA0000A1Z5"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-body font-semibold text-on-surface mb-2">
                          Website
                        </label>
                        <input
                          type="url"
                          value={producerForm.website}
                          onChange={(e) => setProducerForm({ ...producerForm, website: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg bg-surface-container-highest border-2 border-transparent focus:border-primary focus:outline-none font-body"
                          placeholder="https://yourwebsite.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-body font-semibold text-on-surface mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={producerForm.mobile}
                          onChange={(e) => setProducerForm({ ...producerForm, mobile: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg bg-surface-container-highest border-2 border-transparent focus:border-primary focus:outline-none font-body font-mono"
                          placeholder="+91 98765 43210"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="flex-1"
                        data-testid="register-submit-button"
                        disabled={loading}
                      >
                        {loading ? 'Registering...' : 'Register'}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="lg"
                        onClick={() => setIsRegister(false)}
                      >
                        Back to Login
                      </Button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleInfluencerRegister} className="space-y-6" data-testid="register-influencer-form">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-body font-semibold text-on-surface mb-2">
                          Name *
                        </label>
                        <input
                          type="text"
                          data-testid="register-name-input"
                          value={influencerForm.name}
                          onChange={(e) => setInfluencerForm({ ...influencerForm, name: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg bg-surface-container-highest border-2 border-transparent focus:border-primary focus:outline-none font-body"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-body font-semibold text-on-surface mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          data-testid="register-email-input"
                          value={influencerForm.email}
                          onChange={(e) => setInfluencerForm({ ...influencerForm, email: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg bg-surface-container-highest border-2 border-transparent focus:border-primary focus:outline-none font-body"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-body font-semibold text-on-surface mb-2">
                          Instagram Handle *
                        </label>
                        <input
                          type="text"
                          value={influencerForm.instagram_handle}
                          onChange={(e) => setInfluencerForm({ ...influencerForm, instagram_handle: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg bg-surface-container-highest border-2 border-transparent focus:border-primary focus:outline-none font-body"
                          placeholder="@username"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-body font-semibold text-on-surface mb-2">
                          Followers *
                        </label>
                        <input
                          type="number"
                          value={influencerForm.follower_count}
                          onChange={(e) => setInfluencerForm({ ...influencerForm, follower_count: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg bg-surface-container-highest border-2 border-transparent focus:border-primary focus:outline-none font-body font-mono"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-body font-semibold text-on-surface mb-2">
                          State *
                        </label>
                        <select
                          value={influencerForm.location_state}
                          onChange={(e) => setInfluencerForm({ ...influencerForm, location_state: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg bg-surface-container-highest border-2 border-transparent focus:border-primary focus:outline-none font-body"
                          required
                        >
                          {states.map(state => (
                            <option key={state} value={state}>{state}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-body font-semibold text-on-surface mb-2">
                          District *
                        </label>
                        <input
                          type="text"
                          value={influencerForm.location_district}
                          onChange={(e) => setInfluencerForm({ ...influencerForm, location_district: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg bg-surface-container-highest border-2 border-transparent focus:border-primary focus:outline-none font-body"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-body font-semibold text-on-surface mb-2">
                          Age *
                        </label>
                        <input
                          type="number"
                          value={influencerForm.age}
                          onChange={(e) => setInfluencerForm({ ...influencerForm, age: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg bg-surface-container-highest border-2 border-transparent focus:border-primary focus:outline-none font-body font-mono"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-body font-semibold text-on-surface mb-2">
                          Mobile *
                        </label>
                        <input
                          type="tel"
                          value={influencerForm.mobile}
                          onChange={(e) => setInfluencerForm({ ...influencerForm, mobile: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg bg-surface-container-highest border-2 border-transparent focus:border-primary focus:outline-none font-body"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-body font-semibold text-on-surface mb-2">
                          Cost Per Post (₹) *
                        </label>
                        <input
                          type="number"
                          value={influencerForm.cost_per_post}
                          onChange={(e) => setInfluencerForm({ ...influencerForm, cost_per_post: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg bg-surface-container-highest border-2 border-transparent focus:border-primary focus:outline-none font-body font-mono"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-body font-semibold text-on-surface mb-2">
                          Engagement Rate (%) *
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={influencerForm.engagement_rate}
                          onChange={(e) => setInfluencerForm({ ...influencerForm, engagement_rate: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg bg-surface-container-highest border-2 border-transparent focus:border-primary focus:outline-none font-body font-mono"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-body font-semibold text-on-surface mb-2">
                        Categories * (Select multiple)
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {categories.map(cat => (
                          <label key={cat} className="flex items-center gap-2 p-2 rounded-lg bg-surface-container-highest hover:bg-surface-container-high cursor-pointer">
                            <input
                              type="checkbox"
                              checked={influencerForm.categories.includes(cat)}
                              onChange={(e) => {
                                const newCategories = e.target.checked
                                  ? [...influencerForm.categories, cat]
                                  : influencerForm.categories.filter(c => c !== cat);
                                setInfluencerForm({ ...influencerForm, categories: newCategories });
                              }}
                              className="w-4 h-4 text-primary"
                            />
                            <span className="text-sm font-body">{cat}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="flex-1"
                        data-testid="register-submit-button"
                        disabled={loading}
                      >
                        {loading ? 'Registering...' : 'Register'}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="lg"
                        onClick={() => setIsRegister(false)}
                      >
                        Back to Login
                      </Button>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
