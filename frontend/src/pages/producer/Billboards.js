import React, { useMemo, useState } from 'react';
import { ArrowLeft, BarChart3, CheckCircle2, Clock3, MapPin, PanelsTopLeft, Search, ShoppingCart, SlidersHorizontal, Wallet, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';

const BILLBOARD_CAMPAIGNS_STORAGE_KEY = 'billboard_live_campaigns';

const mediaTypes = [
  'ALL',
  'BILLBOARD',
  'METRO PILLAR',
  'GANTRY',
  'METRO BRIDGE PANEL',
  'METRO PILLARS',
  'CANTILEVER',
  'SIGNAGES',
  'METRO PANEL',
  'TRAFFIC JUNCTION',
  'FRONT FACADE',
  'SUBWAY PANEL',
  'STANDEE UNIT',
  'FLAG SIGN',
  'PILLER WRAP',
  'GLOW CUBES',
  'RAILING DIVIDERS',
  'HOARDING',
  'BUS SHELTER',
  'POLE KIOSK',
  'PUBLIC UTILITY',
  'METRO SIGNAGE',
  'LED',
  'BUILDING FACADE',
  'TRAFFIC BOOTH',
  'PILLAR WRAP',
  'MINI UNIPOLE',
  'BENCH',
  'BOOM PANEL',
  'SIDE PANEL',
  'POLICE BOOTH',
  'BRIDGE PILLAR',
  'LOLIPOPS',
  'UNIPOLE',
  'SMART BUS SHELTER',
  'FOOT OVER BRIDGE',
  'BRIDGE PANEL',
  'POLE KIOSKS',
  'CYCLE SHELTER',
  'ROAD MEDIAN',
  'BACKLIT MUPI',
  'WALL WRAP',
  'DIGITAL SCREEN',
  'METRO STATION FACADE',
  'TRIPOD',
  'FOOT OVER BRIDGE PILLAR',
  'NEON BILLBOARD',
  'STANDEES',
];

const billboardInventory = [
  {
    id: 'bb-001',
    vendor: 'Skyline Media Works',
    title: 'MG Road LED Billboard',
    location: 'MG Road, Kochi, Kerala',
    mediaType: 'LED',
    size: '40 x 20 ft',
    price: 85000,
    availability: 'Available this week',
  },
  {
    id: 'bb-002',
    vendor: 'Urban Reach Outdoor',
    title: 'PVR Junction Hoarding',
    location: 'Forum Mall Junction, Chennai, Tamil Nadu',
    mediaType: 'HOARDING',
    size: '60 x 20 ft',
    price: 125000,
    availability: 'Available from Apr 12',
  },
  {
    id: 'bb-003',
    vendor: 'MetroLine Ads',
    title: 'Ameerpet Metro Pillar Network',
    location: 'Ameerpet, Hyderabad, Telangana',
    mediaType: 'METRO PILLAR',
    size: 'Cluster of 12 pillars',
    price: 68000,
    availability: 'Available now',
  },
  {
    id: 'bb-004',
    vendor: 'CitySpan Promotions',
    title: 'Lulu Highway Unipole',
    location: 'Edappally, Kochi, Kerala',
    mediaType: 'UNIPOLE',
    size: '50 x 25 ft',
    price: 150000,
    availability: 'Available from Apr 20',
  },
  {
    id: 'bb-005',
    vendor: 'StreetCast Media',
    title: 'T Nagar Bus Shelter Circuit',
    location: 'T Nagar, Chennai, Tamil Nadu',
    mediaType: 'BUS SHELTER',
    size: '8 premium shelters',
    price: 42000,
    availability: 'Available now',
  },
  {
    id: 'bb-006',
    vendor: 'Prime Outdoor Network',
    title: 'Banjara Hills Digital Screen',
    location: 'Road No. 12, Hyderabad, Telangana',
    mediaType: 'DIGITAL SCREEN',
    size: '24 x 14 ft',
    price: 98000,
    availability: 'Available now',
  },
  {
    id: 'bb-007',
    vendor: 'Capital Vista Ads',
    title: 'Trivandrum Front Facade',
    location: 'Kowdiar, Thiruvananthapuram, Kerala',
    mediaType: 'FRONT FACADE',
    size: 'Building wrap',
    price: 110000,
    availability: 'Available from Apr 18',
  },
  {
    id: 'bb-008',
    vendor: 'Pulse Street Media',
    title: 'Vijayawada Traffic Junction Panel',
    location: 'Benz Circle, Vijayawada, Andhra Pradesh',
    mediaType: 'TRAFFIC JUNCTION',
    size: '30 x 15 ft',
    price: 56000,
    availability: 'Available now',
  },
];

const sortOptions = [
  { value: 'default', label: 'Recommended' },
  { value: 'price_asc', label: 'Price low to high' },
  { value: 'price_desc', label: 'Price high to low' },
];

const fallbackLiveCampaigns = [
  {
    id: 'billboard-live-1',
    campaignName: 'City Launch Visibility Burst',
    title: 'MG Road LED Billboard',
    vendor: 'Skyline Media Works',
    location: 'MG Road, Kochi, Kerala',
    mediaType: 'LED',
    size: '40 x 20 ft',
    price: 85000,
    status: 'Live',
    duration: '14 days',
    estimatedReach: 310000,
    reportSummary: 'High-frequency city-center visibility is driving strong release recall around premium traffic corridors.',
  },
  {
    id: 'billboard-live-2',
    campaignName: 'Metro Corridor Presence',
    title: 'Ameerpet Metro Pillar Network',
    vendor: 'MetroLine Ads',
    location: 'Ameerpet, Hyderabad, Telangana',
    mediaType: 'METRO PILLAR',
    size: 'Cluster of 12 pillars',
    price: 68000,
    status: 'Live',
    duration: '10 days',
    estimatedReach: 225000,
    reportSummary: 'Metro-adjacent placements are sustaining strong commuter exposure and repeat viewing across peak hours.',
  },
];

const formatPrice = (value) => `Rs ${value.toLocaleString('en-IN')}`;

const Billboards = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('create');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [selectedTypes, setSelectedTypes] = useState(['ALL']);
  const [cartIds, setCartIds] = useState([]);
  const [requests, setRequests] = useState([]);
  const [selectedCampaignReport, setSelectedCampaignReport] = useState(null);
  const [storedCampaigns, setStoredCampaigns] = useState(() => {
    if (typeof window === 'undefined') {
      return [];
    }

    const raw = window.localStorage.getItem(BILLBOARD_CAMPAIGNS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  });

  const toggleType = (type) => {
    if (type === 'ALL') {
      setSelectedTypes(['ALL']);
      return;
    }

    setSelectedTypes((current) => {
      const withoutAll = current.filter((item) => item !== 'ALL');
      const next = withoutAll.includes(type)
        ? withoutAll.filter((item) => item !== type)
        : [...withoutAll, type];

      return next.length > 0 ? next : ['ALL'];
    });
  };

  const filteredInventory = useMemo(() => {
    const query = search.trim().toLowerCase();

    let results = billboardInventory.filter((item) => {
      const matchesSearch =
        !query ||
        item.location.toLowerCase().includes(query) ||
        item.title.toLowerCase().includes(query) ||
        item.vendor.toLowerCase().includes(query);

      const matchesType =
        selectedTypes.includes('ALL') || selectedTypes.includes(item.mediaType);

      return matchesSearch && matchesType;
    });

    if (sortBy === 'price_asc') {
      results = [...results].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      results = [...results].sort((a, b) => b.price - a.price);
    }

    return results;
  }, [search, selectedTypes, sortBy]);

  const cartItems = useMemo(
    () => billboardInventory.filter((item) => cartIds.includes(item.id)),
    [cartIds]
  );

  const requestItems = useMemo(
    () =>
      requests.map((request) => ({
        ...request,
        billboard: billboardInventory.find((item) => item.id === request.billboardId),
      })),
    [requests]
  );

  const acceptedRequests = requestItems.filter((item) => item.status === 'accepted');
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const activeRequestTotal = requestItems
    .filter((item) => item.status !== 'paid')
    .reduce((sum, item) => sum + (item.billboard?.price || 0), 0);
  const readyToProcessTotal = activeRequestTotal || cartTotal;
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

  const addToCart = (billboardId) => {
    setCartIds((current) => {
      if (current.includes(billboardId)) {
        return current;
      }
      return [...current, billboardId];
    });
    toast.success('Billboard added to cart');
  };

  const removeFromCart = (billboardId) => {
    setCartIds((current) => current.filter((id) => id !== billboardId));
  };

  const sendRequests = () => {
    if (cartItems.length === 0) {
      toast.error('Add at least one billboard to the cart first');
      return;
    }

    const now = new Date().toISOString();
    const nextRequests = cartItems
      .filter((item) => !requests.some((request) => request.billboardId === item.id))
      .map((item) => ({
        id: `request-${item.id}`,
        billboardId: item.id,
        status: 'pending',
        requestedAt: now,
        acceptedAt: null,
        paidAt: null,
      }));

    if (nextRequests.length === 0) {
      toast.error('Requests already sent for the selected billboards');
      return;
    }

    setRequests((current) => [...nextRequests, ...current]);
    setCartIds([]);
    toast.success('Requests sent to billboard vendors');
  };

  const acceptRequest = (requestId) => {
    setRequests((current) =>
      current.map((request) =>
        request.id === requestId
          ? { ...request, status: 'accepted', acceptedAt: new Date().toISOString() }
          : request
      )
    );
    toast.success('Vendor accepted the booking request');
  };

  const processPayments = () => {
    if (acceptedRequests.length === 0) {
      toast.error('No accepted requests are ready for payment');
      return;
    }

    const paidCampaigns = acceptedRequests.map((request) => {
      const billboard = request.billboard;
      return {
        id: `billboard-campaign-${request.id}-${Date.now()}`,
        campaignName: `${billboard?.title || 'Billboard'} Campaign`,
        title: billboard?.title,
        vendor: billboard?.vendor,
        location: billboard?.location,
        mediaType: billboard?.mediaType,
        size: billboard?.size,
        price: billboard?.price || 0,
        status: 'Live',
        duration: '14 days',
        estimatedReach: Math.round((billboard?.price || 0) * 3.2),
        reportSummary: 'Booking has been confirmed and the billboard campaign is now live with vendor-side execution in progress.',
      };
    });

    const paidAt = new Date().toISOString();
    setRequests((current) =>
      current.map((request) =>
        request.status === 'accepted'
          ? { ...request, status: 'paid', paidAt }
          : request
      )
    );
    setStoredCampaigns((current) => {
      const next = [...paidCampaigns, ...current];

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(BILLBOARD_CAMPAIGNS_STORAGE_KEY, JSON.stringify(next));
      }

      return next;
    });
    toast.success('Payment processed for accepted billboard bookings');
  };

  const getRequestStatus = (billboardId) =>
    requestItems.find((request) => request.billboardId === billboardId);

  return (
    <div className="min-h-screen bg-[#f4f7fb] flex">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <section className="rounded-[32px] bg-[linear-gradient(135deg,#0b1437_0%,#1d3fbf_60%,#8cb4ff_100%)] p-8 text-white shadow-xl">
            <button
              type="button"
              onClick={() => navigate('/producer/vendors')}
              className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Vendors
            </button>
            <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
                  <PanelsTopLeft className="h-4 w-4" />
                  Billboards
                </div>
                <h1 className="mt-4 text-4xl font-heading font-bold">Find high impact billboards that drive results.</h1>
                <p className="mt-3 text-base font-body text-white/80">
                  Search by location, filter by media type, and compare inventory by price before shortlisting a placement.
                </p>
              </div>
              <div className="rounded-3xl bg-white/12 px-5 py-4 text-sm font-semibold">
                {filteredInventory.length} results
              </div>
            </div>
          </section>

          <section className="rounded-[28px] bg-[#f3f6fb] p-4">
            <div className="mb-4 rounded-[24px] border border-[#dbe5ff] bg-white p-5 shadow-sm">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">How It Works</p>
                <h2 className="mt-2 text-2xl font-heading font-bold text-[#101828]">Book your billboard campaign in 3 steps</h2>
                <p className="mt-2 text-sm text-[#667085]">
                  Follow this quick guide to shortlist billboard inventory, send booking requests, and move confirmed placements live.
                </p>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <article className="rounded-[24px] border border-[#dbe5ff] bg-[#f8faff] p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#123bb7] text-sm font-bold text-white">
                    1
                  </div>
                  <h3 className="mt-3 text-lg font-heading font-bold text-[#101828]">Find Billboards</h3>
                  <p className="mt-2 text-sm text-[#667085]">
                    Search by location, filter by media type, and compare prices to shortlist the right inventory.
                  </p>
                </article>

                <article className="rounded-[24px] border border-[#dbe5ff] bg-[#f8faff] p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#123bb7] text-sm font-bold text-white">
                    2
                  </div>
                  <h3 className="mt-3 text-lg font-heading font-bold text-[#101828]">Send Booking Requests</h3>
                  <p className="mt-2 text-sm text-[#667085]">
                    Add multiple billboards to your cart and send requests to vendors for confirmation.
                  </p>
                </article>

                <article className="rounded-[24px] border border-[#dbe5ff] bg-[#f8faff] p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#123bb7] text-sm font-bold text-white">
                    3
                  </div>
                  <h3 className="mt-3 text-lg font-heading font-bold text-[#101828]">Pay and Go Live</h3>
                  <p className="mt-2 text-sm text-[#667085]">
                    Complete payment for accepted requests and track the live billboard campaign from the report view.
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
          <section className="grid gap-6 xl:grid-cols-[420px,1fr]">
            <aside className="rounded-[28px] border border-[#e3e8f3] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef1ff] text-[#0028aa]">
                  <SlidersHorizontal className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8a94a6]">Media Type</p>
                  <h2 className="text-xl font-heading font-bold text-[#101828]">Filter inventory</h2>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
                {mediaTypes.map((type) => {
                  const checked = selectedTypes.includes(type);

                  return (
                    <label
                      key={type}
                      className="grid cursor-pointer grid-cols-[18px,minmax(0,1fr)] items-start gap-3 rounded-xl px-1 py-1.5 text-[15px] font-semibold leading-[1.2] tracking-[-0.02em] text-[#8a90a3]"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleType(type)}
                        className="mt-0.5 h-4 w-4 rounded border border-[#cfd6e4] text-[#0028aa] focus:ring-[#0028aa]"
                      />
                      <span className="whitespace-normal break-normal">{type}</span>
                    </label>
                  );
                })}
              </div>
            </aside>

            <div className="space-y-5">
              <div className="rounded-[28px] border border-[#e3e8f3] bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98a2b3]" />
                    <input
                      type="text"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search location"
                      className="w-full rounded-2xl border border-[#e6eaf2] bg-[#f8faff] py-3 pl-11 pr-4 text-sm font-medium text-[#101828] outline-none transition focus:border-[#0028aa] focus:bg-white"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="text-sm font-semibold text-[#667085]">Sort result</label>
                    <select
                      value={sortBy}
                      onChange={(event) => setSortBy(event.target.value)}
                      className="rounded-2xl border border-[#e6eaf2] bg-white px-4 py-3 text-sm font-semibold text-[#101828] outline-none transition focus:border-[#0028aa]"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 2xl:grid-cols-[1fr,360px]">
                <div className="rounded-[28px] border border-[#e3e8f3] bg-white p-6 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a94a6]">Booking Cart</p>
                      <h2 className="mt-1 text-2xl font-heading font-bold text-[#101828]">Select multiple billboards and send requests.</h2>
                    </div>
                  </div>

                  {cartItems.length > 0 ? (
                    <div className="mt-5 space-y-3">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between gap-3 rounded-2xl bg-[#f8faff] px-4 py-3">
                          <div>
                            <p className="font-semibold text-[#101828]">{item.title}</p>
                            <p className="text-sm text-[#667085]">{item.location}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <p className="font-bold text-[#101828]">{formatPrice(item.price)}</p>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              className="text-sm font-semibold text-[#dc2626]"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-5 text-sm font-medium text-[#667085]">
                      Use `Book Now` on any billboard below to add it to the cart.
                    </p>
                  )}

                  <div className="mt-5 flex flex-col gap-3 border-t border-[#edf1f7] pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a94a6]">Cart Total</p>
                      <p className="mt-1 text-3xl font-heading font-bold text-[#101828]">
                        {formatPrice(cartTotal)}
                      </p>
                    </div>
                    <Button className="bg-[#0028aa] text-white hover:bg-[#001f85]" onClick={sendRequests}>
                      Send Requests to Vendors
                    </Button>
                  </div>
                </div>

                <div className="rounded-[28px] border border-[#e3e8f3] bg-white p-6 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a94a6]">Payment Queue</p>
                      <h2 className="mt-1 text-2xl font-heading font-bold text-[#101828]">Accepted requests</h2>
                    </div>
                    <Wallet className="h-5 w-5 text-[#0028aa]" />
                  </div>

                  <div className="mt-5 rounded-2xl bg-[#f8faff] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a94a6]">Ready to process</p>
                    <p className="mt-1 text-3xl font-heading font-bold text-[#101828]">{formatPrice(readyToProcessTotal)}</p>
                    <p className="mt-2 text-sm font-medium text-[#667085]">
                      Payment is enabled only after billboard vendors accept the request.
                    </p>
                  </div>

                  <Button
                    className="mt-5 w-full bg-[#16a34a] text-white hover:bg-[#15803d]"
                    onClick={processPayments}
                    disabled={acceptedRequests.length === 0}
                  >
                    Process Payment
                  </Button>
                </div>
              </div>

              <div className="grid gap-5">
                {filteredInventory.map((item) => {
                  const requestStatus = getRequestStatus(item.id);

                  return (
                    <article key={item.id} className="rounded-[28px] border border-[#e3e8f3] bg-white p-6 shadow-sm">
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-[#eef1ff] px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#0028aa]">
                              {item.mediaType}
                            </span>
                            <span className="rounded-full bg-[#f4f6fb] px-3 py-1 text-xs font-semibold text-[#667085]">
                              {item.size}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-2xl font-heading font-bold text-[#101828]">{item.title}</h3>
                            <p className="mt-1 text-sm font-semibold text-[#667085]">{item.vendor}</p>
                          </div>
                          <div className="flex items-center gap-2 text-sm font-medium text-[#667085]">
                            <MapPin className="h-4 w-4 text-[#0028aa]" />
                            {item.location}
                          </div>
                          <p className="text-sm font-medium text-[#16a34a]">{item.availability}</p>
                        </div>

                        <div className="flex min-w-[240px] flex-col items-start gap-3 rounded-3xl bg-[#f8faff] p-5 lg:items-end">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a94a6]">Starting Price</p>
                          <p className="text-3xl font-heading font-bold text-[#101828]">{formatPrice(item.price)}</p>
                          {requestStatus ? (
                            <div className="w-full space-y-2 lg:max-w-[220px]">
                              <div className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-[#101828]">
                                {requestStatus.status === 'pending' ? (
                                  <>
                                    <Clock3 className="h-4 w-4 text-[#d97706]" />
                                    Request pending
                                  </>
                                ) : requestStatus.status === 'accepted' ? (
                                  <>
                                    <CheckCircle2 className="h-4 w-4 text-[#16a34a]" />
                                    Accepted, payment due
                                  </>
                                ) : (
                                  <>
                                    <Wallet className="h-4 w-4 text-[#0028aa]" />
                                    Paid and confirmed
                                  </>
                                )}
                              </div>
                              {requestStatus.status === 'pending' ? (
                                <Button
                                  className="w-full bg-[#101828] text-white hover:bg-[#0f172a]"
                                  onClick={() => acceptRequest(requestStatus.id)}
                                >
                                  Vendor Accept Request
                                </Button>
                              ) : null}
                            </div>
                          ) : cartIds.includes(item.id) ? (
                            <Button
                              className="w-full bg-white text-[#0028aa] hover:bg-[#eef1ff] lg:w-auto"
                              onClick={() => removeFromCart(item.id)}
                            >
                              Remove from Cart
                            </Button>
                          ) : (
                            <Button
                              className="w-full bg-[#0028aa] text-white hover:bg-[#001f85] lg:w-auto"
                              onClick={() => addToCart(item.id)}
                            >
                              Book Now
                            </Button>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}

                {filteredInventory.length === 0 ? (
                  <div className="rounded-[28px] border border-dashed border-[#cfd6e4] bg-white p-10 text-center shadow-sm">
                    <h3 className="text-2xl font-heading font-bold text-[#101828]">No billboard uploads match this filter.</h3>
                    <p className="mt-2 text-sm font-medium text-[#667085]">
                      Try a different location search or clear some media type selections.
                    </p>
                  </div>
                ) : null}
              </div>

              {requestItems.length > 0 ? (
                <div className="rounded-[28px] border border-[#e3e8f3] bg-white p-6 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a94a6]">Request Tracker</p>
                  <h2 className="mt-1 text-2xl font-heading font-bold text-[#101828]">Vendor approvals and payment flow</h2>
                  <div className="mt-5 grid gap-4">
                    {requestItems.map((request) => (
                      <div key={request.id} className="flex flex-col gap-3 rounded-2xl bg-[#f8faff] p-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                          <p className="font-semibold text-[#101828]">{request.billboard?.title}</p>
                          <p className="text-sm text-[#667085]">{request.billboard?.vendor} • {request.billboard?.location}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${
                            request.status === 'pending'
                              ? 'bg-[#fff7ed] text-[#c2410c]'
                              : request.status === 'accepted'
                                ? 'bg-[#ecfdf3] text-[#15803d]'
                                : 'bg-[#eef1ff] text-[#0028aa]'
                          }`}>
                            {request.status}
                          </span>
                          <span className="text-sm font-semibold text-[#101828]">{formatPrice(request.billboard?.price || 0)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </section>
          ) : (
            <section className="rounded-[32px] border border-[#e3e8f3] bg-white p-8 shadow-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8a94a6]">Live campaigns</p>
                <h2 className="mt-2 text-3xl font-heading font-bold text-[#101828]">Track ongoing billboard campaigns with campaign reports.</h2>
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
                        <p className="text-sm text-[#667085]">Billboard: {campaign.title}</p>
                        <p className="text-sm text-[#667085]">Location: {campaign.location}</p>
                        <p className="text-sm text-[#667085]">Format: {campaign.mediaType}</p>
                        <p className="text-sm text-[#667085]">Price: {formatPrice(campaign.price)}</p>
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
                <p className="text-sm text-[#667085]">Billboard</p>
                <p className="mt-2 text-lg font-semibold text-[#101828]">{selectedCampaignReport.title}</p>
              </div>
              <div className="rounded-[24px] bg-[#f8fbff] p-5">
                <p className="text-sm text-[#667085]">Vendor</p>
                <p className="mt-2 text-lg font-semibold text-[#101828]">{selectedCampaignReport.vendor}</p>
              </div>
              <div className="rounded-[24px] bg-[#f8fbff] p-5">
                <p className="text-sm text-[#667085]">Location</p>
                <p className="mt-2 text-lg font-semibold text-[#101828]">{selectedCampaignReport.location}</p>
              </div>
              <div className="rounded-[24px] bg-[#f8fbff] p-5">
                <p className="text-sm text-[#667085]">Format</p>
                <p className="mt-2 text-lg font-semibold text-[#101828]">{selectedCampaignReport.mediaType}</p>
              </div>
              <div className="rounded-[24px] bg-[#f8fbff] p-5">
                <p className="text-sm text-[#667085]">Display Size</p>
                <p className="mt-2 text-lg font-semibold text-[#101828]">{selectedCampaignReport.size}</p>
              </div>
              <div className="rounded-[24px] bg-[#f8fbff] p-5">
                <p className="text-sm text-[#667085]">Campaign Duration</p>
                <p className="mt-2 text-lg font-semibold text-[#101828]">{selectedCampaignReport.duration}</p>
              </div>
              <div className="rounded-[24px] bg-[#f8fbff] p-5">
                <p className="text-sm text-[#667085]">Estimated Reach</p>
                <p className="mt-2 text-lg font-semibold text-[#101828]">
                  {Number(selectedCampaignReport.estimatedReach || 0).toLocaleString('en-IN')}
                </p>
              </div>
              <div className="rounded-[24px] bg-[#f8fbff] p-5">
                <p className="text-sm text-[#667085]">Campaign Value</p>
                <p className="mt-2 text-lg font-semibold text-[#101828]">{formatPrice(selectedCampaignReport.price)}</p>
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

export default Billboards;
