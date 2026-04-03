import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  BarChart3,
  Eye,
  LayoutTemplate,
  MapPin,
  Newspaper as NewspaperIcon,
  Search,
  Users,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Button from '../../components/Button';

const NEWSPAPER_CAMPAIGNS_STORAGE_KEY = 'newspaper_media_campaigns';

const newspaperInventory = [
  {
    id: 'malayala-manorama',
    name: 'Malayala Manorama',
    language: 'Malayalam',
    locations: {
      Trivandrum: 198000,
      Kochi: 214000,
      Kozhikode: 176000,
      Kannur: 121000,
      Thrissur: 163000,
    },
    placements: [
      { id: 'manorama-front-strip', name: 'Front Page Strip', size: '8 x 3 cm', placement: 'Top strip on front page', priceByLocation: { Trivandrum: 42000, Kochi: 45000, Kozhikode: 39000, Kannur: 31000, Thrissur: 36000 } },
      { id: 'manorama-jacket-half', name: 'Jacket Half Page', size: '25 x 16 cm', placement: 'Half jacket on release day edition', priceByLocation: { Trivandrum: 98000, Kochi: 110000, Kozhikode: 92000, Kannur: 76000, Thrissur: 84000 } },
      { id: 'manorama-ent-quarter', name: 'Entertainment Quarter', size: '16 x 12 cm', placement: 'Entertainment supplement feature block', priceByLocation: { Trivandrum: 56000, Kochi: 59000, Kozhikode: 51000, Kannur: 41000, Thrissur: 47000 } },
    ],
  },
  {
    id: 'mathrubhumi',
    name: 'Mathrubhumi',
    language: 'Malayalam',
    locations: {
      Trivandrum: 182000,
      Kochi: 201000,
      Kozhikode: 187000,
      Kannur: 133000,
      Thrissur: 154000,
    },
    placements: [
      { id: 'mathrubhumi-front-strip', name: 'Front Page Strip', size: '8 x 3 cm', placement: 'Top strip on front page', priceByLocation: { Trivandrum: 40000, Kochi: 43000, Kozhikode: 41000, Kannur: 33000, Thrissur: 35000 } },
      { id: 'mathrubhumi-bottom-solus', name: 'Bottom Solus', size: '20 x 8 cm', placement: 'Bottom block on page one', priceByLocation: { Trivandrum: 64000, Kochi: 69000, Kozhikode: 66000, Kannur: 52000, Thrissur: 56000 } },
      { id: 'mathrubhumi-inner-full', name: 'Inside Full Page', size: '33 x 25 cm', placement: 'Full page inside city edition', priceByLocation: { Trivandrum: 128000, Kochi: 136000, Kozhikode: 131000, Kannur: 108000, Thrissur: 118000 } },
    ],
  },
  {
    id: 'deshabhimani',
    name: 'Deshabhimani',
    language: 'Malayalam',
    locations: {
      Trivandrum: 109000,
      Kochi: 124000,
      Kozhikode: 117000,
      Kannur: 98000,
      Thrissur: 102000,
    },
    placements: [
      { id: 'deshabhimani-front-pointer', name: 'Front Page Pointer', size: '6 x 6 cm', placement: 'Promo pointer beside masthead', priceByLocation: { Trivandrum: 26000, Kochi: 29000, Kozhikode: 27500, Kannur: 22000, Thrissur: 24000 } },
      { id: 'deshabhimani-inner-half', name: 'Inside Half Page', size: '25 x 16 cm', placement: 'Half page in entertainment section', priceByLocation: { Trivandrum: 74000, Kochi: 79000, Kozhikode: 76000, Kannur: 61000, Thrissur: 66000 } },
      { id: 'deshabhimani-back-quarter', name: 'Back Page Quarter', size: '16 x 12 cm', placement: 'Quarter slot on back page', priceByLocation: { Trivandrum: 48000, Kochi: 52000, Kozhikode: 50000, Kannur: 39000, Thrissur: 42000 } },
    ],
  },
];

const supportedLocations = ['Trivandrum', 'Kochi', 'Kozhikode', 'Kannur', 'Thrissur'];

const fallbackLiveCampaigns = [
  {
    id: 'newspaper-live-1',
    campaignName: 'Weekend Release Front Page Push',
    newspaperName: 'Malayala Manorama',
    language: 'Malayalam',
    location: 'Kochi',
    estimatedViewership: 214000,
    placementName: 'Front Page Strip',
    size: '8 x 3 cm',
    placement: 'Top strip on front page',
    price: 45000,
    status: 'Live',
    insertionCount: 3,
    reportSummary: 'Front-page placements are delivering strong morning visibility in core urban theatre catchments.',
  },
  {
    id: 'newspaper-live-2',
    campaignName: 'Festival Edition Jacket Burst',
    newspaperName: 'Mathrubhumi',
    language: 'Malayalam',
    location: 'Kozhikode',
    estimatedViewership: 187000,
    placementName: 'Inside Full Page',
    size: '33 x 25 cm',
    placement: 'Full page inside city edition',
    price: 131000,
    status: 'Live',
    insertionCount: 2,
    reportSummary: 'Festival-period full-page coverage is sustaining high recall across family readership segments.',
  },
];

const placementArt = {
  'Front Page Strip': { top: '16%', left: '14%', width: '72%', height: '10%' },
  'Jacket Half Page': { top: '24%', left: '13%', width: '74%', height: '34%' },
  'Entertainment Quarter': { top: '56%', left: '12%', width: '34%', height: '20%' },
  'Bottom Solus': { top: '76%', left: '13%', width: '74%', height: '10%' },
  'Inside Full Page': { top: '18%', left: '15%', width: '70%', height: '62%' },
  'Front Page Pointer': { top: '18%', left: '66%', width: '18%', height: '14%' },
  'Inside Half Page': { top: '30%', left: '14%', width: '72%', height: '36%' },
  'Back Page Quarter': { top: '58%', left: '56%', width: '28%', height: '18%' },
};

const normalizeLocation = (value) => value.trim().toLowerCase();

const Newspapers = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('create');
  const [locationInput, setLocationInput] = useState('Kozhikode');
  const [selectedNewspaperId, setSelectedNewspaperId] = useState(newspaperInventory[0].id);
  const [selectedPlacementId, setSelectedPlacementId] = useState(newspaperInventory[0].placements[0].id);
  const [selectedCampaignReport, setSelectedCampaignReport] = useState(null);
  const [storedCampaigns] = useState(() => {
    if (typeof window === 'undefined') {
      return [];
    }

    const raw = window.localStorage.getItem(NEWSPAPER_CAMPAIGNS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  });

  const resolvedLocation = useMemo(() => {
    const exactMatch = supportedLocations.find(
      (location) => normalizeLocation(location) === normalizeLocation(locationInput)
    );

    if (exactMatch) {
      return exactMatch;
    }

    const partialMatch = supportedLocations.find((location) =>
      normalizeLocation(location).includes(normalizeLocation(locationInput))
    );

    return partialMatch || 'Kozhikode';
  }, [locationInput]);

  const selectedNewspaper = useMemo(
    () =>
      newspaperInventory.find((paper) => paper.id === selectedNewspaperId) || newspaperInventory[0],
    [selectedNewspaperId]
  );

  const selectedPlacement = useMemo(
    () =>
      selectedNewspaper.placements.find((placement) => placement.id === selectedPlacementId) ||
      selectedNewspaper.placements[0],
    [selectedNewspaper, selectedPlacementId]
  );

  const selectedPrice = selectedPlacement.priceByLocation[resolvedLocation] || 0;
  const selectedViewership = selectedNewspaper.locations[resolvedLocation] || 0;
  const liveCampaigns = useMemo(
    () => [...storedCampaigns, ...fallbackLiveCampaigns],
    [storedCampaigns]
  );

  React.useEffect(() => {
    if (location.state?.activeTab === 'live') {
      setActiveTab('live');
    }
  }, [location.state]);

  React.useEffect(() => {
    const targetId = location.state?.reportCampaignId;
    if (!targetId) {
      return;
    }

    const targetCampaign = liveCampaigns.find((campaign) => campaign.id === targetId);
    if (targetCampaign) {
      setSelectedCampaignReport(targetCampaign);
    }
  }, [location.state, liveCampaigns]);

  const handleNewspaperSelect = (newspaperId) => {
    const newspaper = newspaperInventory.find((paper) => paper.id === newspaperId);
    setSelectedNewspaperId(newspaperId);
    setSelectedPlacementId(newspaper?.placements[0]?.id || '');
  };

  const handleProceedToPayment = () => {
    navigate('/producer/vendors/media/newspapers/payment', {
      state: {
        newspaperName: selectedNewspaper.name,
        language: selectedNewspaper.language,
        location: resolvedLocation,
        estimatedViewership: selectedViewership,
        placementName: selectedPlacement.name,
        size: selectedPlacement.size,
        placement: selectedPlacement.placement,
        price: selectedPrice,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex">
      <Sidebar />
      <main className="flex-1 p-8 lg:p-10">
        <div className="mx-auto max-w-7xl space-y-8">
          <section className="rounded-[32px] bg-[linear-gradient(135deg,#0b1437_0%,#1d3fbf_60%,#8cb4ff_100%)] p-8 lg:p-10 text-white shadow-xl">
            <button
              type="button"
              onClick={() => navigate('/producer/vendors/media')}
              className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Media
            </button>

            <div className="mt-5 max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
                <NewspaperIcon className="h-4 w-4" />
                Newspapers
              </div>
              <h1 className="mt-4 text-4xl font-heading font-bold">Find newspaper placements by city and book the right print slot.</h1>
              <p className="mt-3 text-base font-body text-white/80">
                Choose a location, compare newspaper viewership, review ad mock placements, and make payment once you lock the slot.
              </p>
            </div>
          </section>

          <section className="rounded-[28px] bg-[#f3f6fb] p-4">
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
            <>
              <section className="rounded-[28px] border border-[#e3e8f3] bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <h2 className="text-3xl font-heading font-bold text-[#101828]">Search newspaper coverage by location</h2>
                  </div>
                  <div className="w-full max-w-xl">
                    <label className="flex items-center gap-3 rounded-2xl border border-[#d7dded] bg-[#f8faff] px-4 py-4">
                      <Search className="h-5 w-5 text-[#667085]" />
                      <input
                        type="text"
                        list="newspaper-locations"
                        value={locationInput}
                        onChange={(event) => setLocationInput(event.target.value)}
                        placeholder="Enter location"
                        className="w-full bg-transparent text-base font-medium text-[#101828] outline-none placeholder:text-[#98a2b3]"
                      />
                    </label>
                    <datalist id="newspaper-locations">
                      {supportedLocations.map((location) => (
                        <option key={location} value={location} />
                      ))}
                    </datalist>
                    <p className="mt-3 text-sm font-body text-[#667085]">
                      Showing edition data for <span className="font-semibold text-[#0028aa]">{resolvedLocation}</span>. Viewership updates automatically when the location changes.
                    </p>
                  </div>
                </div>
              </section>

              <section className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
                <div className="space-y-6">
                  <div className="rounded-[28px] border border-[#e3e8f3] bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#667085]">Newspaper List</p>
                        <h2 className="mt-2 text-3xl font-heading font-bold text-[#101828]">Available newspapers</h2>
                      </div>
                      <div className="rounded-2xl bg-[#eef4ff] px-4 py-3 text-right">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#667085]">Selected location</p>
                        <p className="mt-1 text-lg font-heading font-bold text-[#0028aa]">{resolvedLocation}</p>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4">
                      {newspaperInventory.map((paper) => {
                        const isSelected = paper.id === selectedNewspaperId;
                        const viewership = paper.locations[resolvedLocation] || 0;

                        return (
                          <button
                            key={paper.id}
                            type="button"
                            onClick={() => handleNewspaperSelect(paper.id)}
                            className={`rounded-[24px] border p-5 text-left transition ${
                              isSelected
                                ? 'border-[#0028aa] bg-[#eef4ff] shadow-sm'
                                : 'border-[#e3e8f3] bg-[#fbfcff] hover:border-[#b9c8f2]'
                            }`}
                          >
                            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                              <div>
                                <h3 className="text-2xl font-heading font-bold text-[#101828]">{paper.name}</h3>
                                <p className="mt-1 text-sm font-body text-[#667085]">{paper.language} daily edition</p>
                              </div>
                              <div className="rounded-2xl bg-white px-4 py-3">
                                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#667085]">Viewership</p>
                                <p className="mt-1 text-2xl font-heading font-bold text-[#0028aa]">
                                  {viewership.toLocaleString('en-IN')}
                                </p>
                              </div>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-3 text-sm text-[#667085]">
                              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2">
                                <MapPin className="h-4 w-4 text-[#0028aa]" />
                                {resolvedLocation}
                              </span>
                              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2">
                                <Users className="h-4 w-4 text-[#0028aa]" />
                                Auto-updated edition reach
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-[#e3e8f3] bg-white p-6 shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#667085]">Placement Mocks</p>
                    <h2 className="mt-2 text-3xl font-heading font-bold text-[#101828]">Select the newspaper mock and placement</h2>
                    <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                      {selectedNewspaper.placements.map((placement) => {
                        const isSelected = placement.id === selectedPlacementId;
                        const blockStyle = placementArt[placement.name] || placementArt['Front Page Strip'];

                        return (
                          <button
                            key={placement.id}
                            type="button"
                            onClick={() => setSelectedPlacementId(placement.id)}
                            className={`overflow-hidden rounded-[26px] border text-left transition ${
                              isSelected
                                ? 'border-[#0028aa] bg-[#eef4ff] shadow-md'
                                : 'border-[#e3e8f3] bg-white hover:border-[#bfd0f7]'
                            }`}
                          >
                            <div className="relative h-64 bg-[linear-gradient(180deg,#eef4ff_0%,#f9fbff_100%)] p-6">
                              <div className="absolute inset-6 rounded-[24px] border border-[#d6dff2] bg-white shadow-sm">
                                <div className="flex items-center justify-between border-b border-[#e6ebf5] px-4 py-3">
                                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#667085]">{selectedNewspaper.name}</span>
                                  <span className="text-xs font-semibold text-[#98a2b3]">{resolvedLocation}</span>
                                </div>
                                <div className="relative h-[calc(100%-52px)]">
                                  <div className="absolute inset-5 grid grid-cols-3 gap-3 opacity-60">
                                    {Array.from({ length: 9 }, (_, index) => (
                                      <div key={index} className="rounded-xl border border-dashed border-[#d6dff2]" />
                                    ))}
                                  </div>
                                  <div
                                    className="absolute rounded-2xl border-2 border-[#0028aa] bg-[#0028aa]/12"
                                    style={blockStyle}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="space-y-3 px-5 py-5">
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <h3 className="text-lg font-heading font-bold text-[#101828]">{placement.name}</h3>
                                  <p className="mt-1 text-sm font-body text-[#667085]">{placement.placement}</p>
                                </div>
                                <LayoutTemplate className="mt-1 h-5 w-5 text-[#0028aa]" />
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-[#667085]">Mock Size</span>
                                <span className="font-semibold text-[#101828]">{placement.size}</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-[#667085]">Price in {resolvedLocation}</span>
                                <span className="font-semibold text-[#0028aa]">₹{placement.priceByLocation[resolvedLocation].toLocaleString('en-IN')}</span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <aside className="space-y-6">
                  <section className="rounded-[28px] border border-[#d9e2f5] bg-white p-6 shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#667085]">Selected Placement</p>
                    <h2 className="mt-2 text-3xl font-heading font-bold text-[#101828]">Placement summary</h2>

                    <div className="mt-6 space-y-4">
                      <div className="flex items-center justify-between rounded-2xl bg-[#f8faff] px-4 py-4">
                        <span className="text-sm text-[#667085]">Newspaper</span>
                        <span className="font-semibold text-[#101828]">{selectedNewspaper.name}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-2xl bg-[#f8faff] px-4 py-4">
                        <span className="text-sm text-[#667085]">Location</span>
                        <span className="font-semibold text-[#101828]">{resolvedLocation}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-2xl bg-[#f8faff] px-4 py-4">
                        <span className="text-sm text-[#667085]">Estimated Viewership</span>
                        <span className="font-semibold text-[#101828]">{selectedViewership.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-2xl bg-[#f8faff] px-4 py-4">
                        <span className="text-sm text-[#667085]">Placement</span>
                        <span className="font-semibold text-[#101828]">{selectedPlacement.name}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-2xl bg-[#f8faff] px-4 py-4">
                        <span className="text-sm text-[#667085]">Placement on Newspaper</span>
                        <span className="max-w-[13rem] text-right font-semibold text-[#101828]">{selectedPlacement.placement}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-2xl bg-[#f8faff] px-4 py-4">
                        <span className="text-sm text-[#667085]">Mock Size</span>
                        <span className="font-semibold text-[#101828]">{selectedPlacement.size}</span>
                      </div>
                    </div>

                    <div className="mt-6 rounded-[24px] bg-[#0028aa] px-5 py-6 text-white">
                      <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-white/75">
                        <Eye className="h-4 w-4" />
                        Price
                      </div>
                      <p className="mt-2 text-4xl font-heading font-bold">₹{selectedPrice.toLocaleString('en-IN')}</p>
                      <p className="mt-2 text-sm font-body text-white/80">
                        Price updates based on the selected location and newspaper mock.
                      </p>
                    </div>

                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleProceedToPayment}
                      className="mt-6 w-full bg-[#0028aa] text-white hover:bg-[#001f85]"
                    >
                      Make Payment
                    </Button>
                  </section>
                </aside>
              </section>
            </>
          ) : (
            <section className="rounded-[32px] border border-[#e3e8f3] bg-white p-8 shadow-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8a94a6]">Live campaigns</p>
                <h2 className="mt-2 text-3xl font-heading font-bold text-[#101828]">Track ongoing newspaper campaigns with performance reports.</h2>
              </div>

              <div className="mt-6 grid gap-4">
                {liveCampaigns.map((campaign) => (
                  <article key={campaign.id} className="rounded-[28px] border border-[#e3e8f3] bg-[#f8fbff] p-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-semibold text-[#0028aa]">
                          <BarChart3 className="h-4 w-4" />
                          {campaign.campaignName}
                        </div>
                        <p className="text-sm text-[#667085]">Newspaper: {campaign.newspaperName}</p>
                        <p className="text-sm text-[#667085]">Location: {campaign.location}</p>
                        <p className="text-sm text-[#667085]">Placement: {campaign.placementName}</p>
                        <p className="text-sm text-[#667085]">Estimated Viewership: {Number(campaign.estimatedViewership || 0).toLocaleString('en-IN')}</p>
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
                <h2 className="mt-2 text-3xl font-heading font-bold text-[#101828]">{selectedCampaignReport.campaignName}</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCampaignReport(null)}
                className="rounded-full bg-[#f3f6fb] p-2 text-[#667085] transition hover:bg-[#e7edf8]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-[24px] bg-[#f8fbff] p-5">
                <p className="text-sm text-[#667085]">Newspaper</p>
                <p className="mt-2 text-lg font-semibold text-[#101828]">{selectedCampaignReport.newspaperName}</p>
              </div>
              <div className="rounded-[24px] bg-[#f8fbff] p-5">
                <p className="text-sm text-[#667085]">Location</p>
                <p className="mt-2 text-lg font-semibold text-[#101828]">{selectedCampaignReport.location}</p>
              </div>
              <div className="rounded-[24px] bg-[#f8fbff] p-5">
                <p className="text-sm text-[#667085]">Placement</p>
                <p className="mt-2 text-lg font-semibold text-[#101828]">{selectedCampaignReport.placementName}</p>
              </div>
              <div className="rounded-[24px] bg-[#f8fbff] p-5">
                <p className="text-sm text-[#667085]">Mock Size</p>
                <p className="mt-2 text-lg font-semibold text-[#101828]">{selectedCampaignReport.size}</p>
              </div>
              <div className="rounded-[24px] bg-[#f8fbff] p-5">
                <p className="text-sm text-[#667085]">Estimated Viewership</p>
                <p className="mt-2 text-lg font-semibold text-[#101828]">
                  {Number(selectedCampaignReport.estimatedViewership || 0).toLocaleString('en-IN')}
                </p>
              </div>
              <div className="rounded-[24px] bg-[#f8fbff] p-5">
                <p className="text-sm text-[#667085]">Insertion Count</p>
                <p className="mt-2 text-lg font-semibold text-[#101828]">{selectedCampaignReport.insertionCount || 0}</p>
              </div>
              <div className="rounded-[24px] bg-[#f8fbff] p-5 md:col-span-2">
                <p className="text-sm text-[#667085]">Placement on Newspaper</p>
                <p className="mt-2 text-lg font-semibold text-[#101828]">{selectedCampaignReport.placement}</p>
              </div>
              <div className="rounded-[24px] bg-[#eef4ff] p-5 md:col-span-2">
                <p className="text-sm text-[#667085]">Campaign Summary</p>
                <p className="mt-2 text-lg font-semibold text-[#101828]">{selectedCampaignReport.reportSummary}</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Newspapers;
