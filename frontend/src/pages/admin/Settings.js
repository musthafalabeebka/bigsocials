import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Button from '../../components/Button';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    platform_commission: 15,
    auto_release_timer: 72,
    influencer_verification_threshold: 2000,
    booking_analytics_30_days: 50000,
    booking_analytics_45_days: 70000
  });

  const handleSave = () => {
    toast.success('Platform settings updated successfully!');
  };

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <div className="flex-1">
        <div className="bg-surface-container-lowest border-b border-outline-variant/20 p-8">
          <h1 className="text-4xl font-heading font-bold text-on-surface mb-2">Platform Settings</h1>
          <p className="text-lg font-body text-muted-foreground">Configure platform-wide parameters</p>
        </div>

        <div className="p-8 max-w-3xl">
          <div className="space-y-6">
            {/* Commission Settings */}
            <div className="bg-surface-container-lowest rounded-DEFAULT shadow-ambient p-6">
              <h2 className="text-xl font-heading font-bold mb-4">Commission & Payment</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-body font-semibold text-on-surface mb-2">
                    Platform Commission (%)
                  </label>
                  <input
                    type="number"
                    value={settings.platform_commission}
                    onChange={(e) => setSettings({ ...settings, platform_commission: parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 rounded-lg bg-surface-container-highest border-2 border-transparent focus:border-primary focus:outline-none font-body font-mono"
                    step="0.1"
                    min="0"
                    max="100"
                  />
                  <p className="text-sm font-body text-muted-foreground mt-1">
                    Percentage deducted from influencer payouts
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-body font-semibold text-on-surface mb-2">
                    Auto-Release Timer (hours)
                  </label>
                  <input
                    type="number"
                    value={settings.auto_release_timer}
                    onChange={(e) => setSettings({ ...settings, auto_release_timer: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 rounded-lg bg-surface-container-highest border-2 border-transparent focus:border-primary focus:outline-none font-body font-mono"
                    min="1"
                  />
                  <p className="text-sm font-body text-muted-foreground mt-1">
                    Hours before automatic payment release if post detection fails
                  </p>
                </div>
              </div>
            </div>

            {/* Verification Settings */}
            <div className="bg-surface-container-lowest rounded-DEFAULT shadow-ambient p-6">
              <h2 className="text-xl font-heading font-bold mb-4">Influencer Verification</h2>
              <div>
                <label className="block text-sm font-body font-semibold text-on-surface mb-2">
                  Auto-Verification Threshold (followers)
                </label>
                <input
                  type="number"
                  value={settings.influencer_verification_threshold}
                  onChange={(e) => setSettings({ ...settings, influencer_verification_threshold: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 rounded-lg bg-surface-container-highest border-2 border-transparent focus:border-primary focus:outline-none font-body font-mono"
                  min="0"
                />
                <p className="text-sm font-body text-muted-foreground mt-1">
                  Influencers with followers above this threshold are auto-verified
                </p>
              </div>
            </div>

            {/* Booking Analytics Pricing */}
            <div className="bg-surface-container-lowest rounded-DEFAULT shadow-ambient p-6">
              <h2 className="text-xl font-heading font-bold mb-4">Booking Analytics Pricing</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-body font-semibold text-on-surface mb-2">
                    30 Days Access (₹)
                  </label>
                  <input
                    type="number"
                    value={settings.booking_analytics_30_days}
                    onChange={(e) => setSettings({ ...settings, booking_analytics_30_days: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 rounded-lg bg-surface-container-highest border-2 border-transparent focus:border-primary focus:outline-none font-body font-mono"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-body font-semibold text-on-surface mb-2">
                    45 Days Access (₹)
                  </label>
                  <input
                    type="number"
                    value={settings.booking_analytics_45_days}
                    onChange={(e) => setSettings({ ...settings, booking_analytics_45_days: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 rounded-lg bg-surface-container-highest border-2 border-transparent focus:border-primary focus:outline-none font-body font-mono"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <Button
              variant="primary"
              size="lg"
              onClick={handleSave}
              className="w-full"
              data-testid="save-settings-button"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;