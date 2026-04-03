import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from './components/ui/sonner';
import './App.css';

// Pages
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import PreviewA from './pages/previews/PreviewA';
import PreviewB from './pages/previews/PreviewB';
import PreviewC from './pages/previews/PreviewC';
import ProducerDashboard from './pages/producer/Dashboard';
import ProducerCampaigns from './pages/producer/Campaigns';
import CreateCampaign from './pages/producer/CreateCampaignComplete';
import CampaignDetails from './pages/producer/CampaignDetails';
import CreatorsMarketplace from './pages/producer/CreatorsMarketplace';
import BookingAnalytics from './pages/producer/BookingAnalytics';
import InfluencerRecommendations from './pages/producer/InfluencerRecommendations';
import CampaignPayment from './pages/producer/CampaignPayment';
import DeliverableTracker from './pages/producer/DeliverableTracker';
import AiPrAgent from './pages/producer/AiPrAgent';
import Vendors from './pages/producer/Vendors';
import Billboards from './pages/producer/Billboards';
import Brands from './pages/producer/Brands';
import BrandBriefForm from './pages/producer/BrandBriefForm';
import FieldAgents from './pages/producer/FieldAgents';
import TeaCupMarketing from './pages/producer/TeaCupMarketing';
import TeaCupMarketingPayment from './pages/producer/TeaCupMarketingPayment';
import TeaShopBoards from './pages/producer/TeaShopBoards';
import NoticeMarketing from './pages/producer/NoticeMarketing';
import Ambassadors from './pages/producer/Ambassadors';
import Media from './pages/producer/Media';
import Newspapers from './pages/producer/Newspapers';
import NewspaperPayment from './pages/producer/NewspaperPayment';
import RadioMedia from './pages/producer/RadioMedia';
import RadioPayment from './pages/producer/RadioPayment';
import Kudumbasree from './pages/producer/Kudumbasree';
import KudumbasreePayment from './pages/producer/KudumbasreePayment';
import Students from './pages/producer/Students';

import InfluencerDashboard from './pages/influencer/Dashboard';
import InfluencerCampaigns from './pages/influencer/Campaigns';
import InstagramVerification from './pages/influencer/InstagramVerification';

import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminSettings from './pages/admin/Settings';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-on-surface font-body">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/admin-login" element={<Login />} />
      <Route path="/preview/a" element={<PreviewA />} />
      <Route path="/preview/b" element={<PreviewB />} />
      <Route path="/preview/c" element={<PreviewC />} />
      
      {/* Default route */}
      <Route
        path="/"
        element={
          user ? (
            user.role === 'producer' ? (
              <Navigate to="/producer/dashboard" replace />
            ) : user.role === 'influencer' ? (
              <Navigate to="/influencer/dashboard" replace />
            ) : user.role === 'admin' ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <LandingPage />
            )
          ) : (
            <LandingPage />
          )
        }
      />

      {/* Producer Routes */}
      <Route
        path="/producer/dashboard"
        element={
          <ProtectedRoute allowedRoles={['producer']}>
            <ProducerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/producer/campaigns"
        element={
          <ProtectedRoute allowedRoles={['producer']}>
            <ProducerCampaigns />
          </ProtectedRoute>
        }
      />
      <Route
        path="/producer/campaigns/create"
        element={
          <ProtectedRoute allowedRoles={['producer']}>
            <CreateCampaign />
          </ProtectedRoute>
        }
      />
      <Route
        path="/producer/campaigns/:id"
        element={
          <ProtectedRoute allowedRoles={['producer']}>
            <CampaignDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/producer/marketplace"
        element={
          <ProtectedRoute allowedRoles={['producer']}>
            <CreatorsMarketplace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/producer/booking-analytics"
        element={
          <ProtectedRoute allowedRoles={['producer']}>
            <BookingAnalytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/producer/ai-pr-agent"
        element={
          <ProtectedRoute allowedRoles={['producer']}>
            <AiPrAgent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/producer/vendors"
        element={
          <ProtectedRoute allowedRoles={['producer']}>
            <Vendors />
          </ProtectedRoute>
        }
      />
      <Route
        path="/producer/vendors/billboards"
        element={
          <ProtectedRoute allowedRoles={['producer']}>
            <Billboards />
          </ProtectedRoute>
        }
      />
      <Route
        path="/producer/vendors/brands"
        element={
          <ProtectedRoute allowedRoles={['producer']}>
            <Brands />
          </ProtectedRoute>
        }
      />
      <Route
        path="/producer/vendors/brands/new"
        element={
          <ProtectedRoute allowedRoles={['producer']}>
            <BrandBriefForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/producer/vendors/field-agents"
        element={
          <ProtectedRoute allowedRoles={['producer']}>
            <FieldAgents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/producer/vendors/ambassadors"
        element={
          <ProtectedRoute allowedRoles={['producer']}>
            <Ambassadors />
          </ProtectedRoute>
        }
      />
      <Route
        path="/producer/vendors/ambassadors/kudumbasree"
        element={
          <ProtectedRoute allowedRoles={['producer']}>
            <Kudumbasree />
          </ProtectedRoute>
        }
      />
      <Route
        path="/producer/vendors/ambassadors/kudumbasree/payment"
        element={
          <ProtectedRoute allowedRoles={['producer']}>
            <KudumbasreePayment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/producer/vendors/ambassadors/students"
        element={
          <ProtectedRoute allowedRoles={['producer']}>
            <Students />
          </ProtectedRoute>
        }
      />
      <Route
        path="/producer/vendors/ambassadors/students/payment"
        element={
          <ProtectedRoute allowedRoles={['producer']}>
            <KudumbasreePayment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/producer/vendors/media"
        element={
          <ProtectedRoute allowedRoles={['producer']}>
            <Media />
          </ProtectedRoute>
        }
      />
      <Route
        path="/producer/vendors/media/newspapers"
        element={
          <ProtectedRoute allowedRoles={['producer']}>
            <Newspapers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/producer/vendors/media/newspapers/payment"
        element={
          <ProtectedRoute allowedRoles={['producer']}>
            <NewspaperPayment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/producer/vendors/media/radio"
        element={
          <ProtectedRoute allowedRoles={['producer']}>
            <RadioMedia />
          </ProtectedRoute>
        }
      />
      <Route
        path="/producer/vendors/media/radio/payment"
        element={
          <ProtectedRoute allowedRoles={['producer']}>
            <RadioPayment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/producer/vendors/field-agents/tea-cup-marketing"
        element={
          <ProtectedRoute allowedRoles={['producer']}>
            <TeaCupMarketing />
          </ProtectedRoute>
        }
      />
      <Route
        path="/producer/vendors/field-agents/tea-cup-marketing/payment"
        element={
          <ProtectedRoute allowedRoles={['producer']}>
            <TeaCupMarketingPayment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/producer/vendors/field-agents/tea-shop-boards"
        element={
          <ProtectedRoute allowedRoles={['producer']}>
            <TeaShopBoards />
          </ProtectedRoute>
        }
      />
      <Route
        path="/producer/vendors/field-agents/tea-shop-boards/payment"
        element={
          <ProtectedRoute allowedRoles={['producer']}>
            <TeaCupMarketingPayment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/producer/vendors/field-agents/notice-marketing"
        element={
          <ProtectedRoute allowedRoles={['producer']}>
            <NoticeMarketing />
          </ProtectedRoute>
        }
      />
      <Route
        path="/producer/vendors/field-agents/notice-marketing/payment"
        element={
          <ProtectedRoute allowedRoles={['producer']}>
            <TeaCupMarketingPayment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/producer/campaigns/:id/recommendations"
        element={
          <ProtectedRoute allowedRoles={['producer']}>
            <InfluencerRecommendations />
          </ProtectedRoute>
        }
      />
      <Route
        path="/producer/campaigns/:id/payment"
        element={
          <ProtectedRoute allowedRoles={['producer']}>
            <CampaignPayment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/producer/campaigns/:id/deliverables"
        element={
          <ProtectedRoute allowedRoles={['producer']}>
            <DeliverableTracker />
          </ProtectedRoute>
        }
      />

      {/* Influencer Routes */}
      <Route path="/influencer/verify-instagram" element={<InstagramVerification />} />
      <Route path="/influencer/verify-instagram/callback" element={<InstagramVerification />} />
      <Route
        path="/influencer/dashboard"
        element={
          <ProtectedRoute allowedRoles={['influencer']}>
            <InfluencerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/influencer/campaigns"
        element={
          <ProtectedRoute allowedRoles={['influencer']}>
            <InfluencerCampaigns />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminSettings />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App min-h-screen bg-surface">
          <AppRoutes />
          <Toaster position="top-right" />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
