import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  BarChart3,
  CalendarDays,
  Clapperboard,
  FileBarChart2,
  ImagePlus,
  MapPin,
  Search,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Button from '../../components/Button';

const THEATRE_ADS_STORAGE_KEY = 'theatre_ads_campaigns';

const theatreInventory = [
  {
    id: 'theatre-kochi-premium',
    theatreName: 'Kochi Premium Multiplex Network',
    location: 'Ernakulam',
    screens: 12,
    seats: 1850,
    demographics: 'Families, young professionals, weekend shoppers',
    reach: 74000,
    price: 175000,
  },
  {
    id: 'theatre-trivandrum-city',
    theatreName: 'Trivandrum City Screens',
    location: 'Thiruvananthapuram',
    screens: 9,
    seats: 1320,
    demographics: 'Urban families, students, office commuters',
    reach: 52000,
    price: 128000,
  },
  {
    id: 'theatre-kozhikode-family',
    theatreName: 'Kozhikode Family Cinema Cluster',
    location: 'Kozhikode',
    screens: 7,
    seats: 980,
    demographics: 'Families, youth audience, local retail shoppers',
    reach: 41000,
    price: 96000,
  },
];

const sampleReports = [
  {
    id: 'theatre-report-1',
    campaignName: 'Weekend Screen Recall',
    theatreName: 'Kochi Premium Multiplex Network',
    location: 'Ernakulam',
    screens: 10,
    seats: 1540,
    demographics: 'Families, young professionals',
    reach: 65500,
    price: 155000,
    status: 'Live',
    paymentStatus: 'Paid',
    objective: 'Brand awareness',
    startDate: '2026-04-10',
    endDate: '2026-04-24',
    artworkFiles: ['theatre-proof-1.jpg', 'theatre-proof-2.jpg'],
  },
  {
    id: 'theatre-report-2',
    campaignName: 'City Lobby Visibility',
    theatreName: 'Trivandrum City Screens',
    location: 'Thiruvananthapuram',
    screens: 8,
    seats: 1180,
    demographics: 'Urban families, students',
    reach: 47200,
    price: 115000,
    status: 'Completed',
    paymentStatus: 'Paid',
    objective: 'Launch visibility',
    startDate: '2026-03-22',
    endDate: '2026-04-05',
    artworkFiles: ['lobby-proof-1.jpg', 'screen-proof-1.jpg'],
  },
];

const readStoredCampaigns = () => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(THEATRE_ADS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeStoredCampaigns = (campaigns) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(THEATRE_ADS_STORAGE_KEY, JSON.stringify(campaigns));
  }
};

const createInitialBookingForm = () => ({
  brandName: '',
  location: '',
  screens: '',
  seats: '',
  demographics: '',
  objective: 'Brand awareness',
  adFormat: 'Screen slide',
  startDate: '',
  endDate: '',
  artworkFiles: [],
  notes: '',
});

const createInitialSearchFilters = () => ({
  query: '',
  location: '',
  minScreens: '',
  minSeats: '',
  demographics: '',
  adFormat: '',
});

const formatCurrency = (value) => `Rs ${Number(value || 0).toLocaleString('en-IN')}`;

const TheatreAds = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('booking');
  const [campaigns, setCampaigns] = useState(readStoredCampaigns);
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [bookingForm, setBookingForm] = useState(createInitialBookingForm);
  const [searchFilters, setSearchFilters] = useState(createInitialSearchFilters);
  const [appliedFilters, setAppliedFilters] = useState(createInitialSearchFilters);

  const reportCampaigns = useMemo(() => [...campaigns, ...sampleReports], [campaigns]);
  const locationOptions = useMemo(
    () => [...new Set(theatreInventory.map((inventory) => inventory.location))],
    []
  );
  const demographicsOptions = useMemo(
    () => [...new Set(theatreInventory.map((inventory) => inventory.demographics))],
    []
  );
  const filteredTheatreInventory = useMemo(() => {
    const query = appliedFilters.query.trim().toLowerCase();
    const minScreens = Number(appliedFilters.minScreens || 0);
    const minSeats = Number(appliedFilters.minSeats || 0);

    return theatreInventory.filter((inventory) => {
      const matchesQuery = !query || [inventory.theatreName, inventory.location, inventory.demographics]
        .join(' ')
        .toLowerCase()
        .includes(query);
      const matchesLocation = !appliedFilters.location || inventory.location === appliedFilters.location;
      const matchesScreens = !minScreens || inventory.screens >= minScreens;
      const matchesSeats = !minSeats || inventory.seats >= minSeats;
      const matchesDemographics = !appliedFilters.demographics || inventory.demographics === appliedFilters.demographics;

      return matchesQuery && matchesLocation && matchesScreens && matchesSeats && matchesDemographics;
    });
  }, [appliedFilters]);

  const estimatedPrice = selectedInventory
    ? Math.max(
        1,
        Math.ceil(
          (selectedInventory.price * Number(bookingForm.screens || selectedInventory.screens)) /
            selectedInventory.screens
        )
      )
    : 0;

  const openBookingForm = (inventory) => {
    setSelectedInventory(inventory);
    setBookingForm({
      ...createInitialBookingForm(),
      location: inventory.location,
      screens: String(inventory.screens),
      seats: String(inventory.seats),
      demographics: inventory.demographics,
    });
  };

  const closeBookingForm = () => {
    setSelectedInventory(null);
    setBookingForm(createInitialBookingForm());
  };

  const updateBookingField = (field, value) => {
    setBookingForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const updateSearchFilter = (field, value) => {
    setSearchFilters((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const searchInventory = (event) => {
    event.preventDefault();
    setAppliedFilters(searchFilters);
  };

  const resetSearch = () => {
    const initialFilters = createInitialSearchFilters();
    setSearchFilters(initialFilters);
    setAppliedFilters(initialFilters);
  };

  const handleArtworkUpload = (event) => {
    const files = Array.from(event.target.files || []).map((file) => file.name);
    updateBookingField('artworkFiles', files);
  };

  const makePayment = () => {
    if (!selectedInventory) {
      return;
    }

    const selectedScreens = Number(bookingForm.screens || selectedInventory.screens);
    const selectedSeats = Number(bookingForm.seats || selectedInventory.seats);
    const nextCampaign = {
      id: `theatre-campaign-${Date.now()}`,
      campaignName: bookingForm.brandName
        ? `${bookingForm.brandName} - ${selectedInventory.theatreName}`
        : selectedInventory.theatreName,
      theatreName: selectedInventory.theatreName,
      location: bookingForm.location || selectedInventory.location,
      screens: selectedScreens,
      seats: selectedSeats,
      demographics: bookingForm.demographics,
      objective: bookingForm.objective,
      adFormat: bookingForm.adFormat,
      startDate: bookingForm.startDate,
      endDate: bookingForm.endDate,
      artworkFiles: bookingForm.artworkFiles,
      notes: bookingForm.notes,
      reach: Math.ceil((selectedInventory.reach * selectedScreens) / selectedInventory.screens),
      price: estimatedPrice,
      status: 'Live',
      paymentStatus: 'Paid',
      createdAt: new Date().toISOString(),
    };

    const nextCampaigns = [nextCampaign, ...campaigns];
    setCampaigns(nextCampaigns);
    writeStoredCampaigns(nextCampaigns);
    closeBookingForm();
    setActiveTab('report');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex">
      <Sidebar />
      <main className="flex-1 p-8 lg:p-10">
        <div className="max-w-6xl mx-auto space-y-8">
          <section className="rounded-[32px] bg-[linear-gradient(135deg,#0b1437_0%,#1d3fbf_60%,#8cb4ff_100%)] p-8 lg:p-10 text-white shadow-xl">
            <button
              type="button"
              onClick={() => navigate('/producer/vendors')}
              className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Vendors
            </button>

            <div className="mt-5 max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
                <Clapperboard className="h-4 w-4" />
                Theatre Ads
              </div>
              <h1 className="mt-4 text-4xl font-heading font-bold">
                Book theatre ad campaigns and track live reports.
              </h1>
              <p className="mt-3 text-base font-body text-white/80">
                Select locations, screens, seat capacity, audience demographics, ad format, and campaign dates before payment.
              </p>
            </div>
          </section>

          <section className="rounded-[24px] border border-[#dbe5ff] bg-white p-5 shadow-sm">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">How It Works</p>
              <h2 className="mt-2 text-2xl font-heading font-bold text-[#101828]">
                Launch your theatre ad campaign in 3 steps
              </h2>
              <p className="mt-2 text-sm text-[#667085]">
                Choose theatre inventory, fill the booking form, make payment, and review campaign delivery reports.
              </p>
            </div>
          </section>

          <section className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('booking')}
              className={`min-w-[170px] rounded-full px-6 py-3 text-base font-bold uppercase tracking-[0.04em] transition ${
                activeTab === 'booking' ? 'bg-[#123bb7] text-white shadow-lg' : 'bg-[#e9edf5] text-[#20242c]'
              }`}
            >
              Book Campaign
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('report')}
              className={`min-w-[170px] rounded-full px-6 py-3 text-base font-bold uppercase tracking-[0.04em] transition ${
                activeTab === 'report' ? 'bg-[#123bb7] text-white shadow-lg' : 'bg-[#e9edf5] text-[#20242c]'
              }`}
            >
              Live Reports
            </button>
          </section>

          {activeTab === 'booking' ? (
            <section className="rounded-[32px] border border-[#e3e8f3] bg-white p-8 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8a94a6]">Book campaign</p>
              <h2 className="mt-2 text-3xl font-heading font-bold text-[#101828]">
                Select theatre inventory by location.
              </h2>

              <form
                onSubmit={searchInventory}
                className="mt-6 rounded-[28px] border border-[#dbe5ff] bg-[#f8faff] p-5"
              >
                <div className="grid gap-4 md:grid-cols-3">
                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-[#101828]">Search theatre or market</span>
                    <input
                      value={searchFilters.query}
                      onChange={(event) => updateSearchFilter('query', event.target.value)}
                      placeholder="Example: Kochi, multiplex, family"
                      className="w-full rounded-2xl border border-[#e7eaf2] bg-white px-4 py-3 outline-none focus:border-[#0028aa]"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-[#101828]">Location</span>
                    <select
                      value={searchFilters.location}
                      onChange={(event) => updateSearchFilter('location', event.target.value)}
                      className="w-full rounded-2xl border border-[#e7eaf2] bg-white px-4 py-3 outline-none focus:border-[#0028aa]"
                    >
                      <option value="">All locations</option>
                      {locationOptions.map((location) => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-[#101828]">Audience demographics</span>
                    <select
                      value={searchFilters.demographics}
                      onChange={(event) => updateSearchFilter('demographics', event.target.value)}
                      className="w-full rounded-2xl border border-[#e7eaf2] bg-white px-4 py-3 outline-none focus:border-[#0028aa]"
                    >
                      <option value="">All audiences</option>
                      {demographicsOptions.map((demographic) => (
                        <option key={demographic} value={demographic}>
                          {demographic}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-[#101828]">Minimum screens</span>
                    <input
                      type="number"
                      min="0"
                      value={searchFilters.minScreens}
                      onChange={(event) => updateSearchFilter('minScreens', event.target.value)}
                      placeholder="Example: 8"
                      className="w-full rounded-2xl border border-[#e7eaf2] bg-white px-4 py-3 outline-none focus:border-[#0028aa]"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-[#101828]">Minimum seats</span>
                    <input
                      type="number"
                      min="0"
                      value={searchFilters.minSeats}
                      onChange={(event) => updateSearchFilter('minSeats', event.target.value)}
                      placeholder="Example: 1000"
                      className="w-full rounded-2xl border border-[#e7eaf2] bg-white px-4 py-3 outline-none focus:border-[#0028aa]"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-[#101828]">Preferred ad format</span>
                    <select
                      value={searchFilters.adFormat}
                      onChange={(event) => updateSearchFilter('adFormat', event.target.value)}
                      className="w-full rounded-2xl border border-[#e7eaf2] bg-white px-4 py-3 outline-none focus:border-[#0028aa]"
                    >
                      <option value="">Any format</option>
                      <option>Screen slide</option>
                      <option>Pre-roll video</option>
                      <option>Lobby standee</option>
                      <option>Ticket counter branding</option>
                      <option>Combo package</option>
                    </select>
                  </label>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-[#667085]">
                    {filteredTheatreInventory.length} matching theatre options
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button type="button" className="border border-[#cfd6e4] bg-white text-[#101828] hover:bg-[#f8fbff]" onClick={resetSearch}>
                      Reset
                    </Button>
                    <Button type="submit" className="bg-[#0028aa] text-white hover:bg-[#001f85]">
                      <Search className="mr-2 h-4 w-4" />
                      Search
                    </Button>
                  </div>
                </div>
              </form>

              <div className="mt-6 grid gap-4">
                {filteredTheatreInventory.map((inventory) => (
                  <article key={inventory.id} className="rounded-[28px] border border-[#e3e8f3] bg-[#f8fbff] p-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-lg font-semibold text-[#0028aa]">
                          <MapPin className="h-5 w-5" />
                          {inventory.theatreName}
                        </div>
                        <p className="mt-2 text-sm text-[#667085]">{inventory.location}</p>
                        <p className="mt-2 text-sm text-[#667085]">
                          {inventory.screens} screens • {inventory.seats.toLocaleString('en-IN')} seats
                        </p>
                        <p className="mt-2 text-sm text-[#667085]">{inventory.demographics}</p>
                      </div>
                      <div className="flex flex-col items-start gap-3 lg:items-end">
                        <p className="text-sm font-semibold text-[#667085]">
                          {inventory.reach.toLocaleString('en-IN')} audience reach
                        </p>
                        <p className="text-2xl font-heading font-bold text-[#101828]">{formatCurrency(inventory.price)}</p>
                        <Button className="bg-[#0028aa] text-white hover:bg-[#001f85]" onClick={() => openBookingForm(inventory)}>
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}

                {filteredTheatreInventory.length === 0 ? (
                  <div className="rounded-[28px] border border-dashed border-[#cfd6e4] bg-[#f8fbff] p-8 text-center">
                    <Search className="mx-auto h-10 w-10 text-[#0028aa]" />
                    <h3 className="mt-4 text-xl font-heading font-bold text-[#101828]">No theatre options found</h3>
                    <p className="mt-2 text-sm text-[#667085]">
                      Try changing the location, screens, seats, or audience filters.
                    </p>
                  </div>
                ) : null}
              </div>
            </section>
          ) : (
            <section className="rounded-[32px] border border-[#e3e8f3] bg-white p-8 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8a94a6]">Live reports</p>
              <h2 className="mt-2 text-3xl font-heading font-bold text-[#101828]">
                Track ongoing theatre ad campaign delivery.
              </h2>

              <div className="mt-6 grid gap-4">
                {reportCampaigns.map((report) => (
                  <article key={report.id} className="rounded-[28px] border border-[#e3e8f3] bg-[#f8fbff] p-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-semibold text-[#0028aa]">
                          <FileBarChart2 className="h-4 w-4" />
                          {report.campaignName}
                        </div>
                        <p className="text-sm text-[#667085]">{report.location}</p>
                        <p className="text-sm text-[#667085]">
                          {report.screens} screens • {report.seats.toLocaleString('en-IN')} seats
                        </p>
                        <p className="text-sm text-[#667085]">
                          {report.reach.toLocaleString('en-IN')} audience reach
                        </p>
                      </div>
                      <div className="flex flex-col items-start gap-3 lg:items-end">
                        <span
                          className={`rounded-full px-4 py-2 text-sm font-semibold ${
                            report.status === 'Live' ? 'bg-[#ecfdf3] text-[#15803d]' : 'bg-[#eef1ff] text-[#0028aa]'
                          }`}
                        >
                          {report.status}
                        </span>
                        <p className="flex items-center gap-2 text-sm font-semibold text-[#667085]">
                          <CalendarDays className="h-4 w-4" />
                          Updated today
                        </p>
                        <button
                          type="button"
                          onClick={() => setSelectedReport(report)}
                          className="inline-flex rounded-[8px] bg-[#0028aa] px-4 py-2 text-sm font-bold text-white"
                        >
                          Campaign Details
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {selectedInventory ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/45 p-4">
          <div className="max-h-[calc(100vh-2rem)] w-full max-w-3xl overflow-y-auto rounded-[32px] bg-white p-8 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8a94a6]">Theatre ads booking</p>
                <h3 className="mt-2 text-3xl font-heading font-bold text-[#101828]">{selectedInventory.theatreName}</h3>
                <p className="mt-2 text-sm text-[#667085]">
                  Fill theatre campaign details, confirm the estimate, and make payment to move it into Live Reports.
                </p>
              </div>
              <button type="button" onClick={closeBookingForm} className="rounded-full bg-[#f4f7fb] p-2 text-[#667085]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-[#101828]">Brand name</span>
                <input
                  value={bookingForm.brandName}
                  onChange={(event) => updateBookingField('brandName', event.target.value)}
                  placeholder="Example: Demo Brand"
                  className="w-full rounded-2xl border border-[#e7eaf2] bg-[#f8fbff] px-4 py-3 outline-none focus:border-[#0028aa]"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-[#101828]">Location</span>
                <select
                  value={bookingForm.location}
                  onChange={(event) => updateBookingField('location', event.target.value)}
                  className="w-full rounded-2xl border border-[#e7eaf2] bg-[#f8fbff] px-4 py-3 outline-none focus:border-[#0028aa]"
                >
                  {theatreInventory.map((inventory) => (
                    <option key={inventory.id} value={inventory.location}>
                      {inventory.location}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-[#101828]">Number of screens</span>
                <input
                  type="number"
                  min="1"
                  max={selectedInventory.screens}
                  value={bookingForm.screens}
                  onChange={(event) => updateBookingField('screens', event.target.value)}
                  className="w-full rounded-2xl border border-[#e7eaf2] bg-[#f8fbff] px-4 py-3 outline-none focus:border-[#0028aa]"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-[#101828]">Seats covered</span>
                <input
                  type="number"
                  min="1"
                  value={bookingForm.seats}
                  onChange={(event) => updateBookingField('seats', event.target.value)}
                  className="w-full rounded-2xl border border-[#e7eaf2] bg-[#f8fbff] px-4 py-3 outline-none focus:border-[#0028aa]"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-[#101828]">Audience demographics</span>
                <select
                  value={bookingForm.demographics}
                  onChange={(event) => updateBookingField('demographics', event.target.value)}
                  className="w-full rounded-2xl border border-[#e7eaf2] bg-[#f8fbff] px-4 py-3 outline-none focus:border-[#0028aa]"
                >
                  <option>Families, young professionals, weekend shoppers</option>
                  <option>Urban families, students, office commuters</option>
                  <option>Families, youth audience, local retail shoppers</option>
                  <option>Premium multiplex audience</option>
                  <option>Mass-market weekend audience</option>
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-[#101828]">Ad format</span>
                <select
                  value={bookingForm.adFormat}
                  onChange={(event) => updateBookingField('adFormat', event.target.value)}
                  className="w-full rounded-2xl border border-[#e7eaf2] bg-[#f8fbff] px-4 py-3 outline-none focus:border-[#0028aa]"
                >
                  <option>Screen slide</option>
                  <option>Pre-roll video</option>
                  <option>Lobby standee</option>
                  <option>Ticket counter branding</option>
                  <option>Combo package</option>
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-[#101828]">Campaign objective</span>
                <select
                  value={bookingForm.objective}
                  onChange={(event) => updateBookingField('objective', event.target.value)}
                  className="w-full rounded-2xl border border-[#e7eaf2] bg-[#f8fbff] px-4 py-3 outline-none focus:border-[#0028aa]"
                >
                  <option>Brand awareness</option>
                  <option>Retail traffic</option>
                  <option>Launch visibility</option>
                  <option>Local market recall</option>
                </select>
              </label>

              <div className="space-y-2">
                <span className="text-sm font-semibold text-[#101828]">Estimated payment</span>
                <div className="w-full rounded-2xl border border-[#d9e2f2] bg-[#eef4ff] px-4 py-3 text-lg font-bold text-[#0028aa]">
                  {formatCurrency(estimatedPrice)}
                </div>
              </div>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-[#101828]">Start date</span>
                <input
                  type="date"
                  value={bookingForm.startDate}
                  onChange={(event) => updateBookingField('startDate', event.target.value)}
                  className="w-full rounded-2xl border border-[#e7eaf2] bg-[#f8fbff] px-4 py-3 outline-none focus:border-[#0028aa]"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-[#101828]">End date</span>
                <input
                  type="date"
                  value={bookingForm.endDate}
                  onChange={(event) => updateBookingField('endDate', event.target.value)}
                  className="w-full rounded-2xl border border-[#e7eaf2] bg-[#f8fbff] px-4 py-3 outline-none focus:border-[#0028aa]"
                />
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-semibold text-[#101828]">Brand creative / theatre artwork</span>
                <label className="flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-[28px] border border-dashed border-[#cfd6e4] bg-[#f8fbff] px-6 py-8 text-center">
                  <ImagePlus className="h-8 w-8 text-[#0028aa]" />
                  <span className="mt-3 text-sm font-semibold text-[#101828]">Upload campaign artwork</span>
                  <span className="mt-1 text-xs font-medium text-[#667085]">PNG, JPG, MP4, MOV, or PDF files</span>
                  <input
                    type="file"
                    multiple
                    accept=".png,.jpg,.jpeg,.pdf,.mp4,.mov"
                    onChange={handleArtworkUpload}
                    className="hidden"
                  />
                </label>
                {bookingForm.artworkFiles.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {bookingForm.artworkFiles.map((fileName) => (
                      <span key={fileName} className="rounded-full bg-[#eef1ff] px-3 py-1 text-xs font-semibold text-[#0028aa]">
                        {fileName}
                      </span>
                    ))}
                  </div>
                ) : null}
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-semibold text-[#101828]">Campaign notes</span>
                <textarea
                  value={bookingForm.notes}
                  onChange={(event) => updateBookingField('notes', event.target.value)}
                  placeholder="Add show timing preferences, creative instructions, language notes, or placement instructions"
                  className="min-h-[120px] w-full rounded-2xl border border-[#e7eaf2] bg-[#f8fbff] px-4 py-3 outline-none focus:border-[#0028aa]"
                />
              </label>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <Button className="border border-[#cfd6e4] bg-white text-[#101828] hover:bg-[#f8fbff]" onClick={closeBookingForm}>
                Cancel
              </Button>
              <Button className="bg-[#0028aa] text-white hover:bg-[#001f85]" onClick={makePayment}>
                Make Payment
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {selectedReport ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/45 p-4">
          <div className="max-h-[calc(100vh-2rem)] w-full max-w-3xl overflow-y-auto rounded-[32px] bg-white p-8 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8a94a6]">Campaign report</p>
                <h3 className="mt-2 text-3xl font-heading font-bold text-[#101828]">{selectedReport.campaignName}</h3>
                <p className="mt-2 text-sm text-[#667085]">
                  Review theatre delivery, payment, screen coverage, demographics, and proof for this campaign.
                </p>
              </div>
              <button type="button" onClick={() => setSelectedReport(null)} className="rounded-full bg-[#f4f7fb] p-2 text-[#667085]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <article className="rounded-[24px] border border-[#dbe5ff] bg-[#f8faff] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">Status</p>
                <p className="mt-2 text-xl font-heading font-bold text-[#101828]">{selectedReport.status}</p>
              </article>
              <article className="rounded-[24px] border border-[#dbe5ff] bg-[#f8faff] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">Screens</p>
                <p className="mt-2 text-xl font-heading font-bold text-[#101828]">{selectedReport.screens}</p>
              </article>
              <article className="rounded-[24px] border border-[#dbe5ff] bg-[#f8faff] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">Amount</p>
                <p className="mt-2 text-xl font-heading font-bold text-[#101828]">{formatCurrency(selectedReport.price)}</p>
              </article>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div className="rounded-[24px] border border-[#e3e8f3] bg-[#f8fbff] p-5">
                <p className="text-sm font-semibold text-[#101828]">Location</p>
                <p className="mt-1 text-sm text-[#667085]">{selectedReport.location}</p>
                <p className="mt-4 text-sm font-semibold text-[#101828]">Seats covered</p>
                <p className="mt-1 text-sm text-[#667085]">{selectedReport.seats.toLocaleString('en-IN')} seats</p>
                <p className="mt-4 text-sm font-semibold text-[#101828]">Audience demographics</p>
                <p className="mt-1 text-sm text-[#667085]">{selectedReport.demographics}</p>
              </div>

              <div className="rounded-[24px] border border-[#e3e8f3] bg-[#f8fbff] p-5">
                <p className="text-sm font-semibold text-[#101828]">Reported reach</p>
                <p className="mt-1 text-sm text-[#667085]">{selectedReport.reach.toLocaleString('en-IN')} audience reach</p>
                <p className="mt-4 text-sm font-semibold text-[#101828]">Ad format</p>
                <p className="mt-1 text-sm text-[#667085]">{selectedReport.adFormat || 'Screen slide'}</p>
                <p className="mt-4 text-sm font-semibold text-[#101828]">Campaign dates</p>
                <p className="mt-1 text-sm text-[#667085]">
                  {selectedReport.startDate || 'Start date pending'} to {selectedReport.endDate || 'End date pending'}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-[24px] border border-[#e3e8f3] bg-[#f8fbff] p-5">
              <p className="text-sm font-semibold text-[#101828]">Execution summary</p>
              <p className="mt-2 text-sm leading-6 text-[#667085]">
                Theatre ad inventory is active across the selected screen cluster. Vendor operations are tracking screen
                delivery, lobby proof, audience coverage, and placement compliance for the paid campaign.
              </p>
            </div>

            <div className="mt-6">
              <p className="text-sm font-semibold text-[#101828]">Creative and proof files</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {(selectedReport.artworkFiles || []).map((fileName, index) => (
                  <div key={`${fileName}-${index}`} className="min-w-0 overflow-hidden rounded-[24px] border border-[#e3e8f3] bg-[#f8fbff]">
                    <div className="flex h-32 items-center justify-center bg-[linear-gradient(135deg,#dbeafe_0%,#eef4ff_100%)]">
                      <ImagePlus className="h-10 w-10 text-[#0028aa]" />
                    </div>
                    <div className="p-4">
                      <p className="text-sm font-semibold text-[#101828]">Proof {index + 1}</p>
                      <p className="mt-1 break-all text-xs text-[#667085]">{fileName}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedReport.notes ? (
              <div className="mt-6 rounded-[24px] border border-[#e3e8f3] bg-[#f8fbff] p-5">
                <p className="text-sm font-semibold text-[#101828]">Campaign notes</p>
                <p className="mt-2 text-sm leading-6 text-[#667085]">{selectedReport.notes}</p>
              </div>
            ) : null}

            <div className="mt-8 flex justify-end">
              <Button className="bg-[#0028aa] text-white hover:bg-[#001f85]" onClick={() => setSelectedReport(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default TheatreAds;
