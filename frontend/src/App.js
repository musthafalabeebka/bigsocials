import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from './components/ui/sonner';
import './App.css';

// Pages
import Login from './pages/Login';
import ProducerDashboard from './pages/producer/Dashboard';
import ProducerCampaigns from './pages/producer/Campaigns';
import CreateCampaign from './pages/producer/CreateCampaignComplete';
import CampaignDetails from './pages/producer/CampaignDetails';
import CreatorsMarketplace from './pages/producer/CreatorsMarketplace';
import BookingAnalytics from './pages/producer/BookingAnalytics';
import InfluencerRecommendations from './pages/producer/InfluencerRecommendations';
import CampaignPayment from './pages/producer/CampaignPayment';
import DeliverableTracker from './pages/producer/DeliverableTracker';

import InfluencerDashboard from './pages/influencer/Dashboard';
import InfluencerCampaigns from './pages/influencer/Campaigns';

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
    return <Navigate to="/login" replace />;
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
      <Route path="/login" element={<Login />} />
      
      {/* Default route based on role */}
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
              <Navigate to="/login" replace />
            )
          ) : (
            <Navigate to="/login" replace />
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
