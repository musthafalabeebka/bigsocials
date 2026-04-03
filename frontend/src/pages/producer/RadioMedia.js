import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  BarChart3,
  Clock3,
  MapPin,
  Radio as RadioIcon,
  Search,
  Users,
  X,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Button from '../../components/Button';

const RADIO_CAMPAIGNS_STORAGE_KEY = 'radio_media_campaigns';

const radioInventory = [
  {
    id: 'radio-mango',
    name: 'Radio Mango 91.9',
    band: 'FM 91.9',
    locations: {
      Kochi: 268000,
      Kozhikode: 186000,
      Kannur: 129000,
      Trivandrum: 177000,
      Thrissur: 154000,
    },
    slots: [
      {
        id: 'mango-breakfast',
        name: 'Breakfast Drive Mention',
        timing: '7:30 AM - 9:30 AM',
        placement: 'RJ-led breakfast show mention with release plug',
        priceByLocation: { Kochi: 32000, Kozhikode: 27000, Kannur: 22000, Trivandrum: 28000, Thrissur: 25000 },
      },
      {
        id: 'mango-lunch',
        name: 'Midday Promo Burst',
        timing: '12:00 PM - 2:00 PM',
        placement: 'Two ad spots inside noon entertainment block',
        priceByLocation: { Kochi: 24000, Kozhikode: 21000, Kannur: 18000, Trivandrum: 22000, Thrissur: 19500 },
      },
      {
        id: 'mango-drive',
        name: 'Evening Drive Time Spot',
        timing: '5:00 PM - 7:00 PM',
        placement: 'Prime commute slot with RJ outro mention',
        priceByLocation: { Kochi: 36000, Kozhikode: 29500, Kannur: 24000, Trivandrum: 31500, Thrissur: 27500 },
      },
    ],
  },
  {
    id: 'red-fm',
    name: 'Red FM 93.5',
    band: 'FM 93.5',
    locations: {
      Kochi: 241000,
      Kozhikode: 173000,
      Kannur: 118000,
      Trivandrum: 169000,
      Thrissur: 147000,
    },
    slots: [
      {
        id: 'red-morning',
        name: 'Morning Countdown Spot',
        timing: '8:00 AM - 10:00 AM',
        placement: 'Ad placement during hit music countdown',
        priceByLocation: { Kochi: 30500, Kozhikode: 25500, Kannur: 20500, Trivandrum: 27500, Thrissur: 23500 },
      },
      {
        id: 'red-afternoon',
        name: 'Afternoon RJ Plug',
        timing: '1:00 PM - 3:00 PM',
        placement: 'RJ recommendation with movie promo callout',
        priceByLocation: { Kochi: 21800, Kozhikode: 18900, Kannur: 16000, Trivandrum: 19800, Thrissur: 17600 },
      },
      {
        id: 'red-night',
        name: 'Late Evening Spotlight',
        timing: '7:00 PM - 9:00 PM',
        placement: 'Feature ad in listener request segment',
        priceByLocation: { Kochi: 28700, Kozhikode: 24600, Kannur: 19800, Trivandrum: 26400, Thrissur: 22800 },
      },
    ],
  },
  {
    id: 'club-fm',
    name: 'Club FM 94.3',
    band: 'FM 94.3',
    locations: {
      Kochi: 224000,
      Kozhikode: 168000,
      Kannur: 126000,
      Trivandrum: 161000,
      Thrissur: 149000,
    },
    slots: [
      {
        id: 'club-breakfast',
        name: 'Breakfast Buzz',
        timing: '7:00 AM - 9:00 AM',
        placement: 'Opening ad cluster in breakfast programming',
        priceByLocation: { Kochi: 29400, Kozhikode: 24900, Kannur: 20900, Trivandrum: 26800, Thrissur: 23200 },
      },
      {
        id: 'club-afternoon',
        name: 'Afternoon Entertainment Spot',
        timing: '2:00 PM - 4:00 PM',
        placement: 'Movie promo between celebrity news bulletins',
        priceByLocation: { Kochi: 20400, Kozhikode: 18100, Kannur: 15400, Trivandrum: 19100, Thrissur: 16900 },
      },
      {
        id: 'club-primetime',
        name: 'Prime Time RJ Mention',
        timing: '6:00 PM - 8:00 PM',
        placement: 'RJ mention plus featured ad insertion',
        priceByLocation: { Kochi: 33800, Kozhikode: 28600, Kannur: 23800, Trivandrum: 30900, Thrissur: 26600 },
      },
    ],
  },
];

const supportedLocations = ['Kochi', 'Kozhikode', 'Kannur', 'Trivandrum', 'Thrissur'];

const fallbackLiveCampaigns = [
  {
    id: 'radio-live-1',
    campaignName: 'Weekend Release Burst',
    stationName: 'Radio Mango 91.9',
    band: 'FM 91.9',
    location: 'Kochi',
    listenerReach: 268000,
    slotName: 'Breakfast Drive Mention',
    timing: '7:30 AM - 9:30 AM',
    placement: 'RJ-led breakfast show mention with release plug',
    price: 32000,
    status: 'Live',
    deliveredSpots: 14,
    reportSummary: 'Morning bursts are driving strong recall around theatre clusters and commuter-heavy routes.',
  },
  {
    id: 'radio-live-2',
    campaignName: 'City Evening Promo',
    stationName: 'Club FM 94.3',
    band: 'FM 94.3',
    location: 'Trivandrum',
    listenerReach: 161000,
    slotName: 'Prime Time RJ Mention',
    timing: '6:00 PM - 8:00 PM',
    placement: 'RJ mention plus featured ad insertion',
    price: 30900,
    status: 'Live',
    deliveredSpots: 9,
    reportSummary: 'Evening traffic programming is sustaining good frequency among office commuters and family audiences.',
  },
];

const normalizeLocation = (value) => value.trim().toLowerCase();

const RadioMedia = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('create');
  const [locationInput, setLocationInput] = useState('Kozhikode');
  const [selectedStationId, setSelectedStationId] = useState(radioInventory[0].id);
  const [selectedTimeId, setSelectedTimeId] = useState(radioInventory[0].slots[0].id);
  const [selectedCampaignReport, setSelectedCampaignReport] = useState(null);
  const [storedCampaigns] = useState(() => {
    if (typeof window === 'undefined') {
      return [];
    }

    const raw = window.localStorage.getItem(RADIO_CAMPAIGNS_STORAGE_KEY);
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

  const selectedStation = useMemo(
    () => radioInventory.find((station) => station.id === selectedStationId) || radioInventory[0],
    [selectedStationId]
  );

  const selectedSlot = useMemo(
    () => selectedStation.slots.find((slot) => slot.id === selectedTimeId) || selectedStation.slots[0],
    [selectedStation, selectedTimeId]
  );

  const selectedReach = selectedStation.locations[resolvedLocation] || 0;
  const selectedPrice = selectedSlot.priceByLocation[resolvedLocation] || 0;
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

  const handleStationSelect = (stationId) => {
    const station = radioInventory.find((item) => item.id === stationId);
    setSelectedStationId(stationId);
    setSelectedTimeId(station?.slots[0]?.id || '');
  };

  const handleProceedToPayment = () => {
    navigate('/producer/vendors/media/radio/payment', {
      state: {
        stationName: selectedStation.name,
        band: selectedStation.band,
        location: resolvedLocation,
        listenerReach: selectedReach,
        slotName: selectedSlot.name,
        timing: selectedSlot.timing,
        placement: selectedSlot.placement,
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
                <RadioIcon className="h-4 w-4" />
                Radio
              </div>
              <h1 className="mt-4 text-4xl font-heading font-bold">Choose radio stations, compare reach, and book the right ad slot.</h1>
              <p className="mt-3 text-base font-body text-white/80">
                Select both location and timing, review the listener reach and pricing, and proceed to payment once the station is locked.
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
                <div className="grid gap-5 lg:grid-cols-[0.7fr,1fr,1fr] lg:items-end">
                  <div>
                    <h2 className="text-3xl font-heading font-bold text-[#101828]">Search radio coverage by location</h2>
                  </div>
                  <div className="w-full max-w-xl">
                    <label className="flex items-center gap-3 rounded-2xl border border-[#d7dded] bg-[#f8faff] px-4 py-4">
                      <Search className="h-5 w-5 text-[#667085]" />
                      <input
                        type="text"
                        list="radio-locations"
                        value={locationInput}
                        onChange={(event) => setLocationInput(event.target.value)}
                        placeholder="Enter location"
                        className="w-full bg-transparent text-base font-medium text-[#101828] outline-none placeholder:text-[#98a2b3]"
                      />
                    </label>
                    <datalist id="radio-locations">
                      {supportedLocations.map((location) => (
                        <option key={location} value={location} />
                      ))}
                    </datalist>
                    <p className="mt-3 text-sm font-body text-[#667085]">
                      Showing radio reach for <span className="font-semibold text-[#0028aa]">{resolvedLocation}</span>. Listener reach updates automatically when the location changes.
                    </p>
                  </div>
                  <div className="w-full">
                    <label className="text-sm font-semibold uppercase tracking-[0.22em] text-[#667085]">Select Time</label>
                    <select
                      value={selectedTimeId}
                      onChange={(event) => setSelectedTimeId(event.target.value)}
                      className="mt-3 w-full rounded-2xl border border-[#d7dded] bg-[#f8faff] px-4 py-4 text-base font-medium text-[#101828] outline-none"
                    >
                      {selectedStation.slots.map((slot) => (
                        <option key={slot.id} value={slot.id}>
                          {slot.timing}
                        </option>
                      ))}
                    </select>
                    <p className="mt-3 text-sm font-body text-[#667085]">
                      Pricing updates automatically based on the selected broadcast time.
                    </p>
                  </div>
                </div>
              </section>

              <section className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
                <div className="space-y-6">
                  <div className="rounded-[28px] border border-[#e3e8f3] bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#667085]">Radio Stations</p>
                        <h2 className="mt-2 text-3xl font-heading font-bold text-[#101828]">Available stations and broadcast timings</h2>
                      </div>
                      <div className="rounded-2xl bg-[#eef4ff] px-4 py-3 text-right">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#667085]">Selected location</p>
                        <p className="mt-1 text-lg font-heading font-bold text-[#0028aa]">{resolvedLocation}</p>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4">
                      {radioInventory.map((station) => {
                        const isSelected = station.id === selectedStationId;
                        const reach = station.locations[resolvedLocation] || 0;

                        return (
                          <button
                            key={station.id}
                            type="button"
                            onClick={() => handleStationSelect(station.id)}
                            className={`rounded-[24px] border p-5 text-left transition ${
                              isSelected
                                ? 'border-[#0028aa] bg-[#eef4ff] shadow-sm'
                                : 'border-[#e3e8f3] bg-[#fbfcff] hover:border-[#b9c8f2]'
                            }`}
                          >
                            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                              <div>
                                <h3 className="text-2xl font-heading font-bold text-[#101828]">{station.name}</h3>
                                <p className="mt-1 text-sm font-body text-[#667085]">{station.band}</p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {station.slots.slice(0, 2).map((slot) => (
                                    <span key={slot.id} className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-[#667085]">
                                      <Clock3 className="h-3.5 w-3.5 text-[#0028aa]" />
                                      {slot.timing}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className="rounded-2xl bg-white px-4 py-3">
                                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#667085]">Listener reach</p>
                                <p className="mt-1 text-2xl font-heading font-bold text-[#0028aa]">
                                  {reach.toLocaleString('en-IN')}
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
                                Auto-updated audience size
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <aside className="space-y-6">
                  <section className="rounded-[28px] border border-[#d9e2f5] bg-white p-6 shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#667085]">Selected Station</p>
                    <h2 className="mt-2 text-3xl font-heading font-bold text-[#101828]">Radio booking summary</h2>

                    <div className="mt-6 space-y-4">
                      <div className="flex items-center justify-between rounded-2xl bg-[#f8faff] px-4 py-4">
                        <span className="text-sm text-[#667085]">Radio Station</span>
                        <span className="font-semibold text-[#101828]">{selectedStation.name}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-2xl bg-[#f8faff] px-4 py-4">
                        <span className="text-sm text-[#667085]">Location</span>
                        <span className="font-semibold text-[#101828]">{resolvedLocation}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-2xl bg-[#f8faff] px-4 py-4">
                        <span className="text-sm text-[#667085]">Listener Reach</span>
                        <span className="font-semibold text-[#101828]">{selectedReach.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-2xl bg-[#f8faff] px-4 py-4">
                        <span className="text-sm text-[#667085]">Selected Slot</span>
                        <span className="font-semibold text-[#101828]">{selectedSlot.name}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-2xl bg-[#f8faff] px-4 py-4">
                        <span className="text-sm text-[#667085]">Broadcast Timing</span>
                        <span className="font-semibold text-[#101828]">{selectedSlot.timing}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-2xl bg-[#f8faff] px-4 py-4">
                        <span className="text-sm text-[#667085]">Placement</span>
                        <span className="max-w-[13rem] text-right font-semibold text-[#101828]">{selectedSlot.placement}</span>
                      </div>
                    </div>

                    <div className="mt-6 rounded-[24px] bg-[#0028aa] px-5 py-6 text-white">
                      <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-white/75">
                        <RadioIcon className="h-4 w-4" />
                        Price
                      </div>
                      <p className="mt-2 text-4xl font-heading font-bold">₹{selectedPrice.toLocaleString('en-IN')}</p>
                      <p className="mt-2 text-sm font-body text-white/80">
                        Pricing updates based on the selected location, station, and broadcast timing.
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
                <h2 className="mt-2 text-3xl font-heading font-bold text-[#101828]">Track ongoing radio campaigns with performance reports.</h2>
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
                        <p className="text-sm text-[#667085]">Station: {campaign.stationName}</p>
                        <p className="text-sm text-[#667085]">Location: {campaign.location}</p>
                        <p className="text-sm text-[#667085]">Broadcast Timing: {campaign.timing}</p>
                        <p className="text-sm text-[#667085]">Listener Reach: {Number(campaign.listenerReach || 0).toLocaleString('en-IN')}</p>
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
                <p className="text-sm text-[#667085]">Radio Station</p>
                <p className="mt-2 text-lg font-semibold text-[#101828]">{selectedCampaignReport.stationName}</p>
              </div>
              <div className="rounded-[24px] bg-[#f8fbff] p-5">
                <p className="text-sm text-[#667085]">Location</p>
                <p className="mt-2 text-lg font-semibold text-[#101828]">{selectedCampaignReport.location}</p>
              </div>
              <div className="rounded-[24px] bg-[#f8fbff] p-5">
                <p className="text-sm text-[#667085]">Broadcast Timing</p>
                <p className="mt-2 text-lg font-semibold text-[#101828]">{selectedCampaignReport.timing}</p>
              </div>
              <div className="rounded-[24px] bg-[#f8fbff] p-5">
                <p className="text-sm text-[#667085]">Selected Slot</p>
                <p className="mt-2 text-lg font-semibold text-[#101828]">{selectedCampaignReport.slotName}</p>
              </div>
              <div className="rounded-[24px] bg-[#f8fbff] p-5">
                <p className="text-sm text-[#667085]">Listener Reach</p>
                <p className="mt-2 text-lg font-semibold text-[#101828]">
                  {Number(selectedCampaignReport.listenerReach || 0).toLocaleString('en-IN')}
                </p>
              </div>
              <div className="rounded-[24px] bg-[#f8fbff] p-5">
                <p className="text-sm text-[#667085]">Delivered Spots</p>
                <p className="mt-2 text-lg font-semibold text-[#101828]">{selectedCampaignReport.deliveredSpots || 0}</p>
              </div>
              <div className="rounded-[24px] bg-[#f8fbff] p-5 md:col-span-2">
                <p className="text-sm text-[#667085]">Program Placement</p>
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

export default RadioMedia;
