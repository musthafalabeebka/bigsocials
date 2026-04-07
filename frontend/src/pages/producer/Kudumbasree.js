import React, { useState } from 'react';
import { ArrowLeft, BarChart3, FileUp, ImagePlus, Users, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { Button } from '../../components/ui/button';
import { districtsByState, getDistricts } from '../../data/regions';

const liveCampaignsByType = {
  kudumbasree: [
    {
      campaign: 'Village Poster Push',
      assetType: 'Poster',
      targetViews: '200,000',
      budget: 'Rs 60,000',
      duration: '12 days',
      status: 'Live',
      achievedViews: '148,000',
      activeMembers: 86,
      locations: 'Kannur, Kozhikode, Malappuram',
      summary: 'Strong poster circulation through neighborhood Kudumbasree units with sustained weekend lift.',
    },
    {
      campaign: 'Festival Reel Circulation',
      assetType: 'Reel',
      targetViews: '420,000',
      budget: 'Rs 95,000',
      duration: '18 days',
      status: 'Live',
      achievedViews: '301,000',
      activeMembers: 124,
      locations: 'Ernakulam, Thrissur, Kottayam',
      summary: 'Reel-led amplification is driving higher-than-expected shares in district clusters with strong youth participation.',
    },
  ],
  students: [
    {
      campaign: 'Campus Poster Drive',
      assetType: 'Poster',
      targetViews: '180,000',
      budget: 'Rs 52,000',
      duration: '9 days',
      status: 'Live',
      achievedViews: '121,000',
      activeMembers: 64,
      locations: 'Kochi, Kottayam, Thrissur',
      summary: 'Student ambassadors are delivering strong campus-level visibility through poster and corridor placements.',
    },
    {
      campaign: 'College Reel Sprint',
      assetType: 'Reel',
      targetViews: '500,000',
      budget: 'Rs 125,000',
      duration: '14 days',
      status: 'Live',
      achievedViews: '356,000',
      activeMembers: 142,
      locations: 'Kozhikode, Kannur, Trivandrum',
      summary: 'Short-form video circulation is performing well across student communities with strong repeat sharing.',
    },
  ],
};

const Kudumbasree = ({ campaignType = 'kudumbasree' }) => {
  const navigate = useNavigate();
  const isStudents = campaignType === 'students';
  const campaignLabel = isStudents ? 'Students' : 'Kudumbasree';
  const heading = isStudents
    ? 'Activate Campus Communities Through Student Ambassadors'
    : 'Unlock Deep Local Reach Across Tier 3, 4 & 5 Communities';
  const subheading = isStudents
    ? 'Launch student-led campaigns across colleges and youth communities with measurable reach and live reporting.'
    : 'Take your campaigns deep into local communities and reach family audiences across smaller towns with measurable results.';
  const liveCampaignsHeading = isStudents
    ? 'Track ongoing student activations.'
    : 'Track ongoing Kudumbasree activations.';
  const returnRoute = '/producer/vendors/ambassadors';
  const paymentRoute = isStudents
    ? '/producer/vendors/ambassadors/students/payment'
    : '/producer/vendors/ambassadors/kudumbasree/payment';
  const liveCampaigns = liveCampaignsByType[campaignType] || liveCampaignsByType.kudumbasree;
  const [activeTab, setActiveTab] = useState('create');
  const [selectedCampaignReport, setSelectedCampaignReport] = useState(null);
  const [form, setForm] = useState({
    campaignName: '',
    assetType: '',
    state: '',
    district: '',
    targetViews: '',
    budget: '',
    duration: '',
    files: [],
  });

  const targetViewsCount = Number(String(form.targetViews).replace(/,/g, '')) || 0;
  const calculatedBudget = targetViewsCount * 0.25;

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const stateOptions = Object.keys(districtsByState);
  const districtOptions = getDistricts(form.state);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files || []);
    setForm((current) => ({ ...current, files }));
  };

  const handleCreateCampaign = () => {
    navigate(paymentRoute, {
      state: {
        campaignType,
        campaignName: form.campaignName,
        assetType: form.assetType,
        state: form.state,
        district: form.district,
        targetViews: targetViewsCount,
        budget: calculatedBudget,
        duration: form.duration,
        files: form.files.map((file) => file.name),
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex">
      <Sidebar />
      <main className="flex-1 p-8 lg:p-10">
        <div className="max-w-6xl mx-auto space-y-8">
          <section className="rounded-[32px] bg-[linear-gradient(135deg,#0b1437_0%,#1d3fbf_60%,#8cb4ff_100%)] p-8 lg:p-10 text-white shadow-xl">
            <button
              type="button"
              onClick={() => navigate(returnRoute)}
              className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Ambassadors
            </button>

            <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
                  <Users className="h-4 w-4" />
                  {campaignLabel}
                </div>
                <h1 className="mt-4 text-4xl font-heading font-bold">{heading}</h1>
                <p className="mt-3 text-base font-body text-white/80">
                  {subheading}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] bg-[#f3f6fb] p-4">
            <div className="mb-4 rounded-[24px] border border-[#dbe5ff] bg-white p-5 shadow-sm">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">How It Works</p>
                <h2 className="mt-2 text-2xl font-heading font-bold text-[#101828]">
                  {isStudents ? 'Launch your student campaign in 3 steps' : 'Launch your Kudumbasree campaign in 3 steps'}
                </h2>
                <p className="mt-2 text-sm text-[#667085]">
                  {isStudents
                    ? 'Use this workflow to create the student activation, complete payment, and track live campaign performance.'
                    : 'Use this workflow to create the Kudumbasree activation, complete payment, and track live campaign performance.'}
                </p>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <article className="rounded-[24px] border border-[#dbe5ff] bg-[#f8faff] p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#123bb7] text-sm font-bold text-white">
                    1
                  </div>
                  <h3 className="mt-3 text-lg font-heading font-bold text-[#101828]">Create Campaign</h3>
                  <p className="mt-2 text-sm text-[#667085]">
                    Upload the campaign asset, choose the location, and define the target views and duration.
                  </p>
                </article>

                <article className="rounded-[24px] border border-[#dbe5ff] bg-[#f8faff] p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#123bb7] text-sm font-bold text-white">
                    2
                  </div>
                  <h3 className="mt-3 text-lg font-heading font-bold text-[#101828]">Pay and Launch</h3>
                  <p className="mt-2 text-sm text-[#667085]">
                    Review the calculated budget, make payment, and push the campaign live to the selected network.
                  </p>
                </article>

                <article className="rounded-[24px] border border-[#dbe5ff] bg-[#f8faff] p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#123bb7] text-sm font-bold text-white">
                    3
                  </div>
                  <h3 className="mt-3 text-lg font-heading font-bold text-[#101828]">Track Live Campaigns</h3>
                  <p className="mt-2 text-sm text-[#667085]">
                    Open live campaigns and campaign reports to review views, member activity, and performance results.
                  </p>
                </article>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('create')}
                className={`min-w-[190px] rounded-full px-6 py-3 text-base font-bold uppercase tracking-[0.04em] transition ${
                  activeTab === 'create'
                    ? 'bg-[#123bb7] text-white shadow-lg'
                    : 'bg-[#e9edf5] text-[#20242c]'
                }`}
              >
                Create Campaign
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('live')}
                className={`min-w-[190px] rounded-full px-6 py-3 text-base font-bold uppercase tracking-[0.04em] transition ${
                  activeTab === 'live'
                    ? 'bg-[#123bb7] text-white shadow-lg'
                    : 'bg-[#e9edf5] text-[#20242c]'
                }`}
              >
                Live Campaigns
              </button>
            </div>
          </section>

          {activeTab === 'create' ? (
            <section className="rounded-[32px] border border-[#e3e8f3] bg-white p-8 shadow-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8a94a6]">Create campaign</p>
                <h2 className="mt-2 text-3xl font-heading font-bold text-[#101828]">Upload campaign assets and define execution goals.</h2>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-[#101828]">Campaign name</span>
                  <input
                    value={form.campaignName}
                    onChange={(event) => updateField('campaignName', event.target.value)}
                    className="w-full rounded-2xl border border-[#e7eaf2] bg-[#f8fbff] px-4 py-3 outline-none focus:border-[#0028aa]"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold text-[#101828]">Upload campaign (Poster / Teaser / Trailer / Reel)</span>
                  <label className="flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-[28px] border border-dashed border-[#cfd6e4] bg-[#f8fbff] px-6 py-6 text-center">
                    <FileUp className="h-8 w-8 text-[#0028aa]" />
                    <span className="mt-3 text-sm font-semibold text-[#101828]">Upload campaign assets</span>
                    <input
                      type="file"
                      multiple
                      accept=".png,.jpg,.jpeg,.mp4,.mov,.pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  {form.files.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {form.files.map((file) => (
                        <span key={file.name} className="rounded-full bg-[#eef1ff] px-3 py-1 text-xs font-semibold text-[#0028aa]">
                          {file.name}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold text-[#101828]">Target views</span>
                  <input
                    value={form.targetViews}
                    onChange={(event) => updateField('targetViews', event.target.value)}
                    className="w-full rounded-2xl border border-[#e7eaf2] bg-[#f8fbff] px-4 py-3 outline-none focus:border-[#0028aa]"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold text-[#101828]">Location (state)</span>
                  <select
                    value={form.state}
                    onChange={(event) => {
                      updateField('state', event.target.value);
                      updateField('district', '');
                    }}
                    className="w-full rounded-2xl border border-[#e7eaf2] bg-[#f8fbff] px-4 py-3 outline-none focus:border-[#0028aa]"
                  >
                    <option value="">Select state</option>
                    {stateOptions.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold text-[#101828]">Location (district)</span>
                  <select
                    value={form.district}
                    onChange={(event) => updateField('district', event.target.value)}
                    className="w-full rounded-2xl border border-[#e7eaf2] bg-[#f8fbff] px-4 py-3 outline-none focus:border-[#0028aa]"
                  >
                    <option value="">Select district</option>
                    {districtOptions.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold text-[#101828]">Budget</span>
                  <div className="w-full rounded-2xl border border-[#d9e2f2] bg-[#eef4ff] px-4 py-3 text-lg font-bold text-[#0028aa]">
                    Rs {calculatedBudget.toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <p className="text-xs font-medium text-[#667085]">Calculated at Rs 0.25 per view.</p>
                </label>

                <label className="space-y-2 md:col-span-2">
                  <span className="text-sm font-semibold text-[#101828]">Duration</span>
                  <input
                    value={form.duration}
                    onChange={(event) => updateField('duration', event.target.value)}
                    placeholder="Example: 10 days"
                    className="w-full rounded-2xl border border-[#e7eaf2] bg-[#f8fbff] px-4 py-3 outline-none focus:border-[#0028aa]"
                  />
                </label>
              </div>

              <div className="mt-8 flex justify-end">
                <Button className="bg-[#0028aa] text-white hover:bg-[#001f85]" onClick={handleCreateCampaign}>
                  Create Campaign
                </Button>
              </div>
            </section>
          ) : (
            <section className="rounded-[32px] border border-[#e3e8f3] bg-white p-8 shadow-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8a94a6]">Live campaigns</p>
                <h2 className="mt-2 text-3xl font-heading font-bold text-[#101828]">{liveCampaignsHeading}</h2>
              </div>

              <div className="mt-6 grid gap-4">
                {liveCampaigns.map((campaign) => (
                  <article key={campaign.campaign} className="rounded-[28px] border border-[#e3e8f3] bg-[#f8fbff] p-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-semibold text-[#0028aa]">
                          <BarChart3 className="h-4 w-4" />
                          {campaign.campaign}
                        </div>
                        <p className="text-sm text-[#667085]">Asset type: {campaign.assetType}</p>
                        <p className="text-sm text-[#667085]">Target views: {campaign.targetViews}</p>
                        <p className="text-sm text-[#667085]">Budget: {campaign.budget}</p>
                        <p className="text-sm text-[#667085]">Duration: {campaign.duration}</p>
                        <div className="pt-2">
                          <Button
                            className="bg-[#0028aa] text-white hover:bg-[#001f85]"
                            onClick={() => setSelectedCampaignReport(campaign)}
                          >
                            Campaign Report
                          </Button>
                        </div>
                      </div>
                      <span className="rounded-full bg-[#ecfdf3] px-4 py-2 text-sm font-semibold text-[#15803d]">
                        {campaign.status}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {selectedCampaignReport ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/45 p-4">
          <div className="max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-[32px] bg-white p-8 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8a94a6]">Campaign report</p>
                <h3 className="mt-2 text-3xl font-heading font-bold text-[#101828]">{selectedCampaignReport.campaign}</h3>
                <p className="mt-2 text-sm font-body text-[#667085]">
                  Performance overview for the selected Kudumbasree campaign.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCampaignReport(null)}
                className="rounded-full bg-[#f4f7fb] p-2 text-[#667085]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-[#e3e8f3] bg-[#f8fbff] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a94a6]">Target Views</p>
                <p className="mt-2 text-3xl font-heading font-bold text-[#101828]">{selectedCampaignReport.targetViews}</p>
              </div>
              <div className="rounded-3xl border border-[#e3e8f3] bg-[#f8fbff] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a94a6]">Achieved Views</p>
                <p className="mt-2 text-3xl font-heading font-bold text-[#0028aa]">{selectedCampaignReport.achievedViews}</p>
              </div>
              <div className="rounded-3xl border border-[#e3e8f3] bg-[#f8fbff] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a94a6]">Budget</p>
                <p className="mt-2 text-3xl font-heading font-bold text-[#101828]">{selectedCampaignReport.budget}</p>
              </div>
              <div className="rounded-3xl border border-[#e3e8f3] bg-[#f8fbff] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a94a6]">Active Members</p>
                <p className="mt-2 text-3xl font-heading font-bold text-[#101828]">{selectedCampaignReport.activeMembers}</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-3xl border border-[#e3e8f3] bg-[#f8fbff] p-5">
                <p className="text-sm font-semibold text-[#101828]">Locations</p>
                <p className="mt-2 text-sm text-[#667085]">{selectedCampaignReport.locations}</p>
              </div>
              <div className="rounded-3xl border border-[#e3e8f3] bg-[#f8fbff] p-5">
                <p className="text-sm font-semibold text-[#101828]">Campaign Summary</p>
                <p className="mt-2 text-sm leading-7 text-[#667085]">{selectedCampaignReport.summary}</p>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <Button className="bg-[#0028aa] text-white hover:bg-[#001f85]" onClick={() => setSelectedCampaignReport(null)}>
                Close Report
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Kudumbasree;
