import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  BarChart3,
  BellRing,
  CalendarDays,
  FileBarChart2,
  ImagePlus,
  MapPin,
  Package,
  ScrollText,
  ShoppingBag,
  X,
  Zap,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Button from '../../components/Button';

const partnerConfig = {
  swiggy: {
    label: 'Swiggy',
    icon: ShoppingBag,
    storageKey: 'quick_commerce_swiggy_campaigns',
    heroTitle: 'Book Swiggy quick-commerce campaigns and track live reports.',
    heroDescription:
      'Plan app banners, sponsored product surfaces, cart nudges, and delivery audience campaigns for local brand visibility.',
    bookingTitle: 'Book Swiggy placements by city zone.',
    inventoryLabel: 'placements',
    reachLabel: 'shopper reach',
    bookingRows: [
      { area: 'Kochi grocery discovery zone', district: 'Ernakulam', units: 12, reach: 72000, price: 145000 },
      { area: 'Bengaluru premium cart nudge', district: 'Bengaluru', units: 18, reach: 128000, price: 240000 },
      { area: 'Chennai launch banner cluster', district: 'Chennai', units: 15, reach: 96000, price: 190000 },
    ],
    reportRows: [
      { id: 'swiggy-report-1', campaignName: 'Swiggy Cart Recall', district: 'Ernakulam', units: 10, reach: 65500, status: 'Live', price: 130000 },
      { id: 'swiggy-report-2', campaignName: 'Swiggy Launch Banner', district: 'Bengaluru', units: 16, reach: 112000, status: 'Completed', price: 220000 },
    ],
  },
  zepto: {
    label: 'Zepto',
    icon: Zap,
    storageKey: 'quick_commerce_zepto_campaigns',
    heroTitle: 'Book Zepto quick-commerce campaigns and monitor live delivery.',
    heroDescription:
      'Run fast-turnaround app visibility, product discovery, reminder placements, and launch-week shopper campaigns.',
    bookingTitle: 'Book Zepto placements by priority market.',
    inventoryLabel: 'placements',
    reachLabel: 'shopper reach',
    bookingRows: [
      { area: 'Mumbai quick basket zone', district: 'Mumbai', units: 20, reach: 155000, price: 280000 },
      { area: 'Bengaluru instant grocery lane', district: 'Bengaluru', units: 16, reach: 118000, price: 225000 },
      { area: 'Hyderabad evening order cluster', district: 'Hyderabad', units: 14, reach: 88000, price: 170000 },
    ],
    reportRows: [
      { id: 'zepto-report-1', campaignName: 'Zepto Basket Push', district: 'Mumbai', units: 18, reach: 139000, status: 'Live', price: 255000 },
      { id: 'zepto-report-2', campaignName: 'Zepto Shelf Recall', district: 'Hyderabad', units: 12, reach: 76000, status: 'Completed', price: 150000 },
    ],
  },
  blinkit: {
    label: 'Blinkit',
    icon: Package,
    storageKey: 'quick_commerce_blinkit_campaigns',
    heroTitle: 'Book Blinkit quick-commerce campaigns and review live reports.',
    heroDescription:
      'Plan app visibility, basket placements, local shopper moments, and rapid delivery campaign zones.',
    bookingTitle: 'Book Blinkit placements by delivery zone.',
    inventoryLabel: 'placements',
    reachLabel: 'shopper reach',
    bookingRows: [
      { area: 'Delhi NCR basket reminder', district: 'Delhi NCR', units: 22, reach: 172000, price: 310000 },
      { area: 'Gurugram app banner zone', district: 'Gurugram', units: 14, reach: 94000, price: 185000 },
      { area: 'Pune household essentials lane', district: 'Pune', units: 13, reach: 84000, price: 165000 },
    ],
    reportRows: [
      { id: 'blinkit-report-1', campaignName: 'Blinkit Basket Visibility', district: 'Delhi NCR', units: 20, reach: 158000, status: 'Live', price: 290000 },
      { id: 'blinkit-report-2', campaignName: 'Blinkit Local Recall', district: 'Pune', units: 11, reach: 73500, status: 'Completed', price: 148000 },
    ],
  },
  'notice-distribution': {
    label: 'Notice Distribution',
    icon: ScrollText,
    storageKey: 'quick_commerce_notice_distribution_campaigns',
    heroTitle: 'Book notice distribution campaigns and track route reports.',
    heroDescription:
      'Coordinate delivery-led notice inserts and handouts for local brand awareness across selected distribution zones.',
    bookingTitle: 'Book notice distribution by delivery route.',
    inventoryLabel: 'notice batches',
    reachLabel: 'household reach',
    bookingRows: [
      { area: 'Kochi apartment delivery route', district: 'Ernakulam', units: 25, reach: 50000, price: 95000 },
      { area: 'Trivandrum residential cluster', district: 'Thiruvananthapuram', units: 20, reach: 42000, price: 82000 },
      { area: 'Kozhikode high-street route', district: 'Kozhikode', units: 18, reach: 36000, price: 72000 },
    ],
    reportRows: [
      { id: 'notice-qc-report-1', campaignName: 'Residential Notice Push', district: 'Ernakulam', units: 22, reach: 45500, status: 'Live', price: 88000 },
      { id: 'notice-qc-report-2', campaignName: 'High-Street Notice Drop', district: 'Kozhikode', units: 16, reach: 32000, status: 'Completed', price: 65000 },
    ],
  },
};

const loadStoredCampaigns = (storageKey) => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const persistCampaigns = (storageKey, campaigns) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(storageKey, JSON.stringify(campaigns));
  }
};

const formatCurrency = (value) => `Rs ${Number(value || 0).toLocaleString('en-IN')}`;

const createInitialBookingForm = () => ({
  brandName: '',
  units: '',
  objective: 'Brand awareness',
  startDate: '',
  endDate: '',
  artworkFiles: [],
  notes: '',
});

const QuickCommerceCampaign = ({ mode = 'swiggy' }) => {
  const navigate = useNavigate();
  const config = partnerConfig[mode] || partnerConfig.swiggy;
  const Icon = config.icon;
  const [activeTab, setActiveTab] = useState('booking');
  const [campaigns, setCampaigns] = useState(() => loadStoredCampaigns(config.storageKey));
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedReportCampaign, setSelectedReportCampaign] = useState(null);
  const [bookingForm, setBookingForm] = useState(createInitialBookingForm);

  const reportCampaigns = useMemo(
    () => [
      ...campaigns,
      ...config.reportRows.map((row) => ({
        ...row,
        paymentStatus: row.paymentStatus || 'Paid',
        objective: row.objective || 'Brand awareness',
        artworkFiles: row.artworkFiles || [`${config.label}-proof-1.jpg`, `${config.label}-proof-2.jpg`],
      })),
    ],
    [campaigns, config.label, config.reportRows]
  );

  const estimatedPrice = selectedBooking
    ? Math.max(
        1,
        Math.ceil(
          (selectedBooking.price * Number(bookingForm.units || selectedBooking.units)) / selectedBooking.units
        )
      )
    : 0;

  const openBookingForm = (row) => {
    setSelectedBooking(row);
    setBookingForm({
      ...createInitialBookingForm(),
      units: String(row.units),
    });
  };

  const closeBookingForm = () => {
    setSelectedBooking(null);
    setBookingForm(createInitialBookingForm());
  };

  const updateBookingField = (field, value) => {
    setBookingForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleArtworkUpload = (event) => {
    const files = Array.from(event.target.files || []).map((file) => file.name);
    updateBookingField('artworkFiles', files);
  };

  const makePayment = () => {
    if (!selectedBooking) {
      return;
    }

    const nextCampaign = {
      id: `${mode}-campaign-${Date.now()}`,
      campaignName: bookingForm.brandName
        ? `${bookingForm.brandName} - ${config.label} ${selectedBooking.area}`
        : `${config.label} ${selectedBooking.area}`,
      district: selectedBooking.district,
      units: Number(bookingForm.units || selectedBooking.units),
      reach: Math.ceil((selectedBooking.reach * Number(bookingForm.units || selectedBooking.units)) / selectedBooking.units),
      price: estimatedPrice,
      objective: bookingForm.objective,
      startDate: bookingForm.startDate,
      endDate: bookingForm.endDate,
      artworkFiles: bookingForm.artworkFiles,
      notes: bookingForm.notes,
      status: 'Live',
      paymentStatus: 'Paid',
      createdAt: new Date().toISOString(),
    };
    const nextCampaigns = [nextCampaign, ...campaigns];
    setCampaigns(nextCampaigns);
    persistCampaigns(config.storageKey, nextCampaigns);
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
              onClick={() => navigate('/producer/vendors/quick-commerce')}
              className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Quick Commerce
            </button>

            <div className="mt-5 max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
                <Icon className="h-4 w-4" />
                {config.label}
              </div>
              <h1 className="mt-4 text-4xl font-heading font-bold">{config.heroTitle}</h1>
              <p className="mt-3 text-base font-body text-white/80">{config.heroDescription}</p>
            </div>
          </section>

          <section className="rounded-[24px] border border-[#dbe5ff] bg-white p-5 shadow-sm">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">How It Works</p>
              <h2 className="mt-2 text-2xl font-heading font-bold text-[#101828]">
                Launch your {config.label} campaign in 3 steps
              </h2>
              <p className="mt-2 text-sm text-[#667085]">
                Choose inventory, book the campaign, and monitor live delivery reports.
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
              <h2 className="mt-2 text-3xl font-heading font-bold text-[#101828]">{config.bookingTitle}</h2>

              <div className="mt-6 grid gap-4">
                {config.bookingRows.map((row) => (
                  <article key={row.area} className="rounded-[28px] border border-[#e3e8f3] bg-[#f8fbff] p-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-lg font-semibold text-[#0028aa]">
                          <MapPin className="h-5 w-5" />
                          {row.area}
                        </div>
                        <p className="mt-2 text-sm text-[#667085]">{row.district}</p>
                        <p className="mt-2 text-sm text-[#667085]">
                          {row.units.toLocaleString('en-IN')} {config.inventoryLabel} available
                        </p>
                      </div>
                      <div className="flex flex-col items-start gap-3 lg:items-end">
                        <p className="text-sm font-semibold text-[#667085]">
                          {row.reach.toLocaleString('en-IN')} {config.reachLabel}
                        </p>
                        <p className="text-2xl font-heading font-bold text-[#101828]">{formatCurrency(row.price)}</p>
                        <Button className="bg-[#0028aa] text-white hover:bg-[#001f85]" onClick={() => openBookingForm(row)}>
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : (
            <section className="rounded-[32px] border border-[#e3e8f3] bg-white p-8 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8a94a6]">Live reports</p>
              <h2 className="mt-2 text-3xl font-heading font-bold text-[#101828]">
                Track ongoing {config.label} campaign delivery.
              </h2>

              <div className="mt-6 grid gap-4">
                {reportCampaigns.map((row) => (
                  <article key={row.id} className="rounded-[28px] border border-[#e3e8f3] bg-[#f8fbff] p-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-semibold text-[#0028aa]">
                          <FileBarChart2 className="h-4 w-4" />
                          {row.campaignName}
                        </div>
                        <p className="text-sm text-[#667085]">{row.district}</p>
                        <p className="text-sm text-[#667085]">
                          {row.units.toLocaleString('en-IN')} {config.inventoryLabel} deployed
                        </p>
                        <p className="text-sm text-[#667085]">
                          {row.reach.toLocaleString('en-IN')} {config.reachLabel}
                        </p>
                      </div>
                      <div className="flex flex-col items-start gap-3 lg:items-end">
                        <span
                          className={`rounded-full px-4 py-2 text-sm font-semibold ${
                            row.status === 'Live' ? 'bg-[#ecfdf3] text-[#15803d]' : 'bg-[#eef1ff] text-[#0028aa]'
                          }`}
                        >
                          {row.status}
                        </span>
                        <p className="flex items-center gap-2 text-sm font-semibold text-[#667085]">
                          <CalendarDays className="h-4 w-4" />
                          Updated today
                        </p>
                        <button
                          type="button"
                          onClick={() => setSelectedReportCampaign(row)}
                          className="inline-flex rounded-[8px] bg-[#0028aa] px-4 py-2 text-sm font-bold text-white"
                        >
                          Campaign Details
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {reportCampaigns.length === 0 ? (
                <div className="mt-6 rounded-[28px] border border-dashed border-[#cfd6e4] bg-[#f8fbff] p-8 text-center">
                  <BarChart3 className="mx-auto h-10 w-10 text-[#0028aa]" />
                  <h3 className="mt-4 text-xl font-heading font-bold text-[#101828]">No live reports yet</h3>
                  <p className="mt-2 text-sm text-[#667085]">Book a campaign to start tracking live reports.</p>
                </div>
              ) : null}
            </section>
          )}
        </div>
      </main>

      {selectedBooking ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/45 p-4">
          <div className="max-h-[calc(100vh-2rem)] w-full max-w-3xl overflow-y-auto rounded-[32px] bg-white p-8 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8a94a6]">
                  {config.label} booking
                </p>
                <h3 className="mt-2 text-3xl font-heading font-bold text-[#101828]">{selectedBooking.area}</h3>
                <p className="mt-2 text-sm text-[#667085]">
                  Fill campaign details, confirm the estimated price, and make payment to move this campaign into Live Reports.
                </p>
              </div>
              <button type="button" onClick={() => setSelectedBooking(null)} className="rounded-full bg-[#f4f7fb] p-2 text-[#667085]">
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
                <span className="text-sm font-semibold text-[#101828]">Number of {config.inventoryLabel}</span>
                <input
                  type="number"
                  min="1"
                  max={selectedBooking.units}
                  value={bookingForm.units}
                  onChange={(event) => updateBookingField('units', event.target.value)}
                  className="w-full rounded-2xl border border-[#e7eaf2] bg-[#f8fbff] px-4 py-3 outline-none focus:border-[#0028aa]"
                />
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
                <span className="text-sm font-semibold text-[#101828]">Brand creative / artwork</span>
                <label className="flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-[28px] border border-dashed border-[#cfd6e4] bg-[#f8fbff] px-6 py-8 text-center">
                  <ImagePlus className="h-8 w-8 text-[#0028aa]" />
                  <span className="mt-3 text-sm font-semibold text-[#101828]">Upload campaign artwork</span>
                  <span className="mt-1 text-xs font-medium text-[#667085]">PNG, JPG, or PDF files</span>
                  <input type="file" multiple accept=".png,.jpg,.jpeg,.pdf" onChange={handleArtworkUpload} className="hidden" />
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
                  placeholder="Add placement preferences, offer details, language notes, or delivery instructions"
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

      {selectedReportCampaign ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/45 p-4">
          <div className="max-h-[calc(100vh-2rem)] w-full max-w-3xl overflow-y-auto rounded-[32px] bg-white p-8 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8a94a6]">Campaign report</p>
                <h3 className="mt-2 text-3xl font-heading font-bold text-[#101828]">
                  {selectedReportCampaign.campaignName}
                </h3>
                <p className="mt-2 text-sm text-[#667085]">
                  Review booking, payment, reach, and execution details for this {config.label} campaign.
                </p>
              </div>
              <button type="button" onClick={() => setSelectedReportCampaign(null)} className="rounded-full bg-[#f4f7fb] p-2 text-[#667085]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <article className="rounded-[24px] border border-[#dbe5ff] bg-[#f8faff] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">Status</p>
                <p className="mt-2 text-xl font-heading font-bold text-[#101828]">{selectedReportCampaign.status}</p>
              </article>
              <article className="rounded-[24px] border border-[#dbe5ff] bg-[#f8faff] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">Payment</p>
                <p className="mt-2 text-xl font-heading font-bold text-[#101828]">
                  {selectedReportCampaign.paymentStatus || 'Paid'}
                </p>
              </article>
              <article className="rounded-[24px] border border-[#dbe5ff] bg-[#f8faff] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">Amount</p>
                <p className="mt-2 text-xl font-heading font-bold text-[#101828]">
                  {formatCurrency(selectedReportCampaign.price)}
                </p>
              </article>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div className="rounded-[24px] border border-[#e3e8f3] bg-[#f8fbff] p-5">
                <p className="text-sm font-semibold text-[#101828]">Market</p>
                <p className="mt-1 text-sm text-[#667085]">{selectedReportCampaign.district}</p>
                <p className="mt-4 text-sm font-semibold text-[#101828]">Campaign objective</p>
                <p className="mt-1 text-sm text-[#667085]">{selectedReportCampaign.objective || 'Brand awareness'}</p>
                <p className="mt-4 text-sm font-semibold text-[#101828]">Campaign dates</p>
                <p className="mt-1 text-sm text-[#667085]">
                  {selectedReportCampaign.startDate || 'Start date pending'} to {selectedReportCampaign.endDate || 'End date pending'}
                </p>
              </div>
              <div className="rounded-[24px] border border-[#e3e8f3] bg-[#f8fbff] p-5">
                <p className="text-sm font-semibold text-[#101828]">Inventory deployed</p>
                <p className="mt-1 text-sm text-[#667085]">
                  {selectedReportCampaign.units.toLocaleString('en-IN')} {config.inventoryLabel}
                </p>
                <p className="mt-4 text-sm font-semibold text-[#101828]">Reported reach</p>
                <p className="mt-1 text-sm text-[#667085]">
                  {selectedReportCampaign.reach.toLocaleString('en-IN')} {config.reachLabel}
                </p>
                <p className="mt-4 text-sm font-semibold text-[#101828]">Last update</p>
                <p className="mt-1 text-sm text-[#667085]">Updated today by vendor operations</p>
              </div>
            </div>

            <div className="mt-6 rounded-[24px] border border-[#e3e8f3] bg-[#f8fbff] p-5">
              <p className="text-sm font-semibold text-[#101828]">Execution summary</p>
              <p className="mt-2 text-sm leading-6 text-[#667085]">
                {config.label} campaign inventory is active across the selected market. Vendor operations are tracking
                placement delivery, local reach, and campaign proof against the paid booking.
              </p>
            </div>

            <div className="mt-6">
              <p className="text-sm font-semibold text-[#101828]">Creative and proof files</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {(selectedReportCampaign.artworkFiles || []).map((fileName, index) => (
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

            {selectedReportCampaign.notes ? (
              <div className="mt-6 rounded-[24px] border border-[#e3e8f3] bg-[#f8fbff] p-5">
                <p className="text-sm font-semibold text-[#101828]">Campaign notes</p>
                <p className="mt-2 text-sm leading-6 text-[#667085]">{selectedReportCampaign.notes}</p>
              </div>
            ) : null}

            <div className="mt-8 flex justify-end">
              <Button className="bg-[#0028aa] text-white hover:bg-[#001f85]" onClick={() => setSelectedReportCampaign(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default QuickCommerceCampaign;
