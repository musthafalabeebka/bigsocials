import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CupSoda, FileBarChart2, ImagePlus, MapPin, Store, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import { districtsByState, getDistricts } from '../../data/regions';

const bookingRows = [
  { area: 'Kannur Central', district: 'Kannur', state: 'Kerala', outlets: 120, cups: 45000 },
  { area: 'MG Road Cluster', district: 'Ernakulam', state: 'Kerala', outlets: 95, cups: 36000 },
  { area: 'City Junction Network', district: 'Thiruvananthapuram', state: 'Kerala', outlets: 140, cups: 52000 },
  { area: 'Town Market Belt', district: 'Kozhikode', state: 'Kerala', outlets: 110, cups: 41000 },
];

const reportRows = [
  {
    campaign: 'Weekend Tea Burst',
    city: 'Kochi',
    distributed: 41800,
    status: 'Completed',
    outlets: 3,
    outletPlacementProof: ['Outlet-1.jpg', 'Outlet-2.jpg', 'Outlet-3.jpg'],
  },
  {
    campaign: 'Morning Rush Cups',
    city: 'Kozhikode',
    distributed: 63300,
    status: 'Live',
    outlets: 4,
    outletPlacementProof: ['Outlet-1.jpg', 'Outlet-2.jpg', 'Outlet-3.jpg', 'Outlet-4.jpg'],
  },
  {
    campaign: 'Release Week Sampling',
    city: 'Trivandrum',
    distributed: 50120,
    status: 'Completed',
    outlets: 2,
    outletPlacementProof: ['Outlet-1.jpg', 'Outlet-2.jpg'],
  },
];

const TEA_CUP_CAMPAIGNS_STORAGE_KEY = 'tea_cup_marketing_campaigns';
const TEA_SHOP_BOARDS_CAMPAIGNS_STORAGE_KEY = 'tea_shop_boards_campaigns';
const NOTICE_MARKETING_CAMPAIGNS_STORAGE_KEY = 'notice_marketing_campaigns';

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

const persistCampaigns = (campaigns, storageKey) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(campaigns));
};

const TeaCupMarketing = ({ mode = 'tea-cup-marketing' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isTeaShopBoards = mode === 'tea-shop-boards';
  const isNoticeMarketing = mode === 'notice-marketing';
  const storageKey = isTeaShopBoards
    ? TEA_SHOP_BOARDS_CAMPAIGNS_STORAGE_KEY
    : isNoticeMarketing
      ? NOTICE_MARKETING_CAMPAIGNS_STORAGE_KEY
      : TEA_CUP_CAMPAIGNS_STORAGE_KEY;
  const pageLabel = isTeaShopBoards ? 'Tea shop boards' : isNoticeMarketing ? 'Notice marketing' : 'Tea cup marketing';
  const heroTitle = isTeaShopBoards
    ? 'Take Your Brand Promotions to Every Local Tea Shop'
    : isNoticeMarketing
      ? 'Reach Local Audiences with High-Visibility Notice Campaigns'
    : 'Launch Tea Cup Campaigns. Track Results in Real Time.';
  const heroDescription = isTeaShopBoards
    ? 'Easily plan and manage tea shop board campaigns while tracking field team performance with detailed, real-time reports'
    : isNoticeMarketing
      ? 'Plan, launch, and manage notice campaigns across key locations while tracking performance and field execution in real time.'
    : 'Easily plan and manage tea cup distribution campaigns while tracking field team performance with detailed, real-time reports';
  const bookingTitle = isTeaShopBoards
    ? 'Reserve tea shop board inventory by location.'
    : isNoticeMarketing
      ? 'Reserve notice marketing inventory by location.'
    : 'Reserve tea cup inventory by location.';
  const bookingModalLabel = isTeaShopBoards ? 'Tea shop boards booking' : isNoticeMarketing ? 'Notice marketing booking' : 'Tea cup marketing booking';
  const bookingModalDescription = isTeaShopBoards
    ? 'Upload the brand creative or board artwork, add the brand name, and confirm the print details.'
    : isNoticeMarketing
      ? 'Upload the brand creative or notice artwork, add the brand name, and confirm the print details.'
    : 'Upload the brand creative or cup artwork, add the brand name, and confirm the print details.';
  const guideTitle = isTeaShopBoards
    ? 'Launch your tea shop board campaign in 3 steps'
    : isNoticeMarketing
      ? 'Launch your notice campaign in 3 steps'
      : 'Launch your tea cup campaign in 3 steps';
  const guideDescription = isTeaShopBoards
    ? 'Follow this workflow to reserve tea shop board locations, complete payment, and track installation with live reporting.'
    : isNoticeMarketing
      ? 'Follow this workflow to reserve notice distribution inventory, complete payment, and track execution with live reporting.'
      : 'Follow this workflow to reserve inventory, complete payment, and track execution with live reporting.';
  const guideSteps = isTeaShopBoards
    ? [
        {
          title: 'Select District',
          description: 'Choose the district where you want tea shop boards installed for the brand promotion.',
        },
        {
          title: 'Book and Pay',
          description: 'Upload the board artwork, enter board quantity and campaign days, then complete payment.',
        },
        {
          title: 'Track Installation',
          description: 'Use the live report page to review board installation details and campaign execution updates.',
        },
      ]
    : isNoticeMarketing
      ? [
          {
            title: 'Select Location',
            description: 'Search by state and district to choose the right notice distribution area for the campaign.',
          },
          {
            title: 'Book and Pay',
            description: 'Upload the notice artwork, enter quantity and dates, then complete payment to launch the campaign.',
          },
          {
            title: 'Track Live Report',
            description: 'Review campaign details, notice placement images, and field updates from the live report page.',
          },
        ]
      : [
          {
            title: 'Select Location',
            description: 'Search by state and district to find the right tea cup distribution inventory for your campaign.',
          },
          {
            title: 'Book and Pay',
            description: 'Upload the cup artwork, enter quantity and dates, then complete payment to launch the campaign.',
          },
          {
            title: 'Track Live Report',
            description: 'Review campaign details, placement images, and execution updates from the live report page.',
          },
        ];
  const quantityLabel = isTeaShopBoards ? 'Board quantity' : isNoticeMarketing ? 'Notice quantity' : 'Cup quantity';
  const reportQuantityLabel = isTeaShopBoards ? 'boards installed' : isNoticeMarketing ? 'notices distributed' : 'cups distributed';
  const getReportedQuantity = (row) => (isNoticeMarketing ? (row.outlets || 0) * 1000 : row.distributed);
  const pricingNote = isTeaShopBoards ? 'Calculated at Rs 250 per board per day.' : isNoticeMarketing ? 'Calculated at Rs 5 per notice.' : 'Calculated at Rs 5 per cup.';
  const locationUnitLabel = isNoticeMarketing ? 'homes' : 'outlets';
  const paymentRoute = isTeaShopBoards
    ? '/producer/vendors/field-agents/tea-shop-boards/payment'
    : isNoticeMarketing
      ? '/producer/vendors/field-agents/notice-marketing/payment'
    : '/producer/vendors/field-agents/tea-cup-marketing/payment';
  const fieldAgentsRoute = '/producer/vendors/field-agents';
  const [activeTab, setActiveTab] = useState('booking');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedReportCampaign, setSelectedReportCampaign] = useState(null);
  const [campaignRemark, setCampaignRemark] = useState('');
  const [bookingForm, setBookingForm] = useState({
    movieName: '',
    printDetails: '',
    quantity: '',
    numberOfDays: '',
    startDate: '',
    endDate: '',
    posterFiles: [],
  });

  const resetBookingForm = () => {
    setBookingForm({
      movieName: '',
      printDetails: '',
      quantity: '',
      numberOfDays: '',
      startDate: '',
      endDate: '',
      posterFiles: [],
    });
  };

  const openBookingForm = (row) => {
    setSelectedBooking(row);
    setBookingForm((current) => ({
      ...current,
      quantity: isTeaShopBoards ? '' : row.cups.toString(),
      numberOfDays: isTeaShopBoards ? '1' : '',
    }));
  };

  const closeBookingForm = () => {
    setSelectedBooking(null);
    resetBookingForm();
  };

  const updateField = (key, value) => {
    setBookingForm((current) => ({ ...current, [key]: value }));
  };

  const handlePosterUpload = (event) => {
    const files = Array.from(event.target.files || []);
    setBookingForm((current) => ({ ...current, posterFiles: files }));
  };

  const submitBookingRequest = () => {
    navigate(paymentRoute, {
      state: {
        mode,
        bookingArea: `${selectedBooking.district}, ${selectedBooking.state}`,
        outlets: selectedBooking.outlets,
        movieName: bookingForm.movieName,
        quantity: cupQuantity,
        numberOfDays: Number(bookingForm.numberOfDays) || 0,
        totalCost: estimatedPrice,
        startDate: bookingForm.startDate,
        endDate: bookingForm.endDate,
        printDetails: bookingForm.printDetails,
        posterFiles: bookingForm.posterFiles.map((file) => file.name),
      },
    });
    closeBookingForm();
  };

  const cupQuantity = Number(bookingForm.quantity) || 0;
  const numberOfDays = Number(bookingForm.numberOfDays) || 0;
  const estimatedPrice = isTeaShopBoards ? cupQuantity * numberOfDays * 250 : cupQuantity * 5;
  const stateOptions = Object.keys(districtsByState);
  const districtOptions = getDistricts(selectedState);

  const filteredBookingRows = bookingRows.filter((row) => {
    const matchesState = !selectedState || row.state.toLowerCase() === selectedState.toLowerCase();
    const matchesDistrict = !selectedDistrict || row.district.toLowerCase() === selectedDistrict.toLowerCase();

    return matchesState && matchesDistrict;
  });

  useEffect(() => {
    setCampaigns(loadStoredCampaigns(storageKey));
  }, [storageKey]);

  const reportCampaigns = useMemo(
    () => [
      ...campaigns,
      ...reportRows.map((row, index) => ({
        id: `sample-${index}`,
        movieName: row.campaign,
        district: row.city,
        distributed: row.distributed,
        status: row.status,
        outlets: row.outlets,
        totalCupsProducedProof: [],
        outletPlacementProof: row.outletPlacementProof,
        producerRemark: row.producerRemark || '',
        isSample: true,
      })),
    ],
    [campaigns]
  );

  useEffect(() => {
    if (location.state?.activeTab === 'report') {
      setActiveTab('report');
    }
  }, [location.state]);

  useEffect(() => {
    const targetId = location.state?.reportCampaignId;
    if (!targetId) {
      return;
    }

    const targetCampaign = reportCampaigns.find((campaign) => campaign.id === targetId);
    if (targetCampaign) {
      setSelectedReportCampaign(targetCampaign);
      setCampaignRemark(targetCampaign.producerRemark || '');
    }
  }, [location.state, reportCampaigns]);

  const openCampaignDetails = (campaign) => {
    setSelectedReportCampaign(campaign);
    setCampaignRemark(campaign.producerRemark || '');
  };

  const closeCampaignDetails = () => {
    setSelectedReportCampaign(null);
    setCampaignRemark('');
  };

  const saveCampaignRemark = () => {
    if (!selectedReportCampaign) {
      return;
    }

    if (selectedReportCampaign.isSample) {
      setSelectedReportCampaign((current) => (current ? { ...current, producerRemark: campaignRemark } : current));
      toast.success('Brand team remark saved');
      return;
    }

    const nextCampaigns = campaigns.map((campaign) =>
      campaign.id === selectedReportCampaign.id
        ? {
            ...campaign,
            producerRemark: campaignRemark,
          }
        : campaign
    );

    setCampaigns(nextCampaigns);
    persistCampaigns(nextCampaigns, storageKey);
    setSelectedReportCampaign((current) => (current ? { ...current, producerRemark: campaignRemark } : current));
    toast.success('Brand team remark saved');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex">
      <Sidebar />
      <main className="flex-1 p-8 lg:p-10">
        <div className="max-w-6xl mx-auto space-y-8">
          <section className="rounded-[32px] bg-[linear-gradient(135deg,#0b1437_0%,#1d3fbf_60%,#8cb4ff_100%)] p-8 lg:p-10 text-white shadow-xl">
            <button
              type="button"
              onClick={() => navigate(fieldAgentsRoute)}
              className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Field Agents
            </button>

            <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
                  <CupSoda className="h-4 w-4" />
                  {pageLabel}
                </div>
                <h1 className="mt-4 text-4xl font-heading font-bold">{heroTitle}</h1>
                <p className="mt-3 text-base font-body text-white/80">
                  {heroDescription}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] bg-[#f3f6fb] p-4">
            <div className="mb-4 rounded-[24px] border border-[#dbe5ff] bg-white p-5 shadow-sm">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">How It Works</p>
                <h2 className="mt-2 text-2xl font-heading font-bold text-[#101828]">{guideTitle}</h2>
                <p className="mt-2 text-sm text-[#667085]">
                  {guideDescription}
                </p>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {guideSteps.map((step, index) => (
                  <article key={step.title} className="rounded-[24px] border border-[#dbe5ff] bg-[#f8faff] p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#123bb7] text-sm font-bold text-white">
                      {index + 1}
                    </div>
                    <h3 className="mt-3 text-lg font-heading font-bold text-[#101828]">{step.title}</h3>
                    <p className="mt-2 text-sm text-[#667085]">
                      {step.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('booking')}
                className={`min-w-[170px] rounded-full px-6 py-3 text-base font-bold uppercase tracking-[0.04em] transition ${
                  activeTab === 'booking'
                    ? 'bg-[#123bb7] text-white shadow-lg'
                    : 'bg-[#e9edf5] text-[#20242c]'
                }`}
              >
                Book Campaign
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('report')}
                className={`min-w-[170px] rounded-full px-6 py-3 text-base font-bold uppercase tracking-[0.04em] transition ${
                  activeTab === 'report'
                    ? 'bg-[#123bb7] text-white shadow-lg'
                    : 'bg-[#e9edf5] text-[#20242c]'
                }`}
              >
                Live Report
              </button>
            </div>
          </section>

          {activeTab === 'booking' ? (
            <section className="rounded-[32px] border border-[#e3e8f3] bg-white p-8 shadow-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8a94a6]">Book campaign</p>
                <h2 className="mt-2 text-3xl font-heading font-bold text-[#101828]">{bookingTitle}</h2>
              </div>

              <div className="mt-6 grid gap-4 rounded-[28px] bg-[#f8fbff] p-5 md:grid-cols-[1fr,1fr,auto]">
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-[#101828]">Location (state)</span>
                  <select
                    value={selectedState}
                    onChange={(event) => {
                      setSelectedState(event.target.value);
                      setSelectedDistrict('');
                    }}
                    className="w-full rounded-2xl border border-[#dbe4f3] bg-white px-4 py-3 outline-none focus:border-[#0028aa]"
                  >
                    <option value="">All states</option>
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
                    value={selectedDistrict}
                    onChange={(event) => setSelectedDistrict(event.target.value)}
                    className="w-full rounded-2xl border border-[#dbe4f3] bg-white px-4 py-3 outline-none focus:border-[#0028aa]"
                  >
                    <option value="">All districts</option>
                    {districtOptions.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="flex items-end">
                  <Button className="w-full bg-[#0028aa] text-white hover:bg-[#001f85] md:w-auto">
                    Search
                  </Button>
                </div>
              </div>

              <div className="mt-6 grid gap-4">
                {filteredBookingRows.map((row) => (
                  <article key={row.area} className="rounded-[28px] border border-[#e3e8f3] bg-[#f8fbff] p-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-lg font-semibold text-[#0028aa]">
                          <MapPin className="h-5 w-5" />
                          {row.district}, Kerala
                        </div>
                      </div>
                      <div className="flex flex-col items-start gap-3 lg:items-end">
                        <div className="flex items-center gap-2 text-3xl font-heading font-bold text-[#101828]">
                          <Store className="h-6 w-6 text-[#667085]" />
                          {isNoticeMarketing ? `${row.outlets}K homes` : `${row.outlets} outlets`}
                        </div>
                        <Button className="bg-[#0028aa] text-white hover:bg-[#001f85]" onClick={() => openBookingForm(row)}>
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}

                {filteredBookingRows.length === 0 ? (
                  <div className="rounded-[28px] border border-dashed border-[#cfd6e4] bg-[#f8fbff] p-8 text-center">
                    <h3 className="text-xl font-heading font-bold text-[#101828]">No tea cup inventory found for this location.</h3>
                    <p className="mt-2 text-sm font-body text-[#667085]">Try a different state or district selection.</p>
                  </div>
                ) : null}
              </div>
            </section>
          ) : (
            <section className="rounded-[32px] border border-[#e3e8f3] bg-white p-8 shadow-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8a94a6]">Live report</p>
                <h2 className="mt-2 text-3xl font-heading font-bold text-[#101828]">Review execution and campaign delivery.</h2>
              </div>

              <div className="mt-6 grid gap-4">
                {reportCampaigns.map((row) => (
                  <article key={row.id || `${row.movieName}-${row.district}`} className="rounded-[28px] border border-[#e3e8f3] bg-[#f8fbff] p-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-semibold text-[#0028aa]">
                          <FileBarChart2 className="h-4 w-4" />
                          {row.movieName}
                        </div>
                        <p className="text-sm text-[#667085]">{row.district}</p>
                        <p className="text-sm text-[#667085]">{getReportedQuantity(row).toLocaleString()} {reportQuantityLabel}</p>
                        <p className="text-sm text-[#667085]">
                          {isNoticeMarketing ? `${row.outlets || 0}K homes` : `${row.outlets || 0} outlets`}
                        </p>
                      </div>
                      <div className="flex flex-col items-start gap-3 lg:items-end">
                        <span className={`rounded-full px-4 py-2 text-sm font-semibold ${
                          row.status === 'Live'
                            ? 'bg-[#ecfdf3] text-[#15803d]'
                            : 'bg-[#eef1ff] text-[#0028aa]'
                        }`}>
                          {row.status}
                        </span>
                        <Button
                          className="bg-[#0028aa] text-white hover:bg-[#001f85]"
                          onClick={() => openCampaignDetails(row)}
                        >
                          Campaign Details
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {selectedBooking ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/45 p-4">
          <div className="w-full max-w-3xl rounded-[32px] bg-white p-8 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8a94a6]">{bookingModalLabel}</p>
                <h3 className="mt-2 text-3xl font-heading font-bold text-[#101828]">{selectedBooking.area}</h3>
                <p className="mt-2 text-sm font-body text-[#667085]">
                  {bookingModalDescription}
                </p>
              </div>
              <button
                type="button"
                onClick={closeBookingForm}
                className="rounded-full bg-[#f4f7fb] p-2 text-[#667085]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-[#101828]">Brand name</span>
                <input
                  value={bookingForm.movieName}
                  onChange={(event) => updateField('movieName', event.target.value)}
                  className="w-full rounded-2xl border border-[#e7eaf2] bg-[#f8fbff] px-4 py-3 outline-none focus:border-[#0028aa]"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-[#101828]">{quantityLabel}</span>
                <input
                  value={bookingForm.quantity}
                  onChange={(event) => updateField('quantity', event.target.value)}
                  className="w-full rounded-2xl border border-[#e7eaf2] bg-[#f8fbff] px-4 py-3 outline-none focus:border-[#0028aa]"
                />
              </label>

              {isTeaShopBoards ? (
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-[#101828]">Number of days</span>
                  <input
                    value={bookingForm.numberOfDays}
                    onChange={(event) => updateField('numberOfDays', event.target.value)}
                    className="w-full rounded-2xl border border-[#e7eaf2] bg-[#f8fbff] px-4 py-3 outline-none focus:border-[#0028aa]"
                  />
                </label>
              ) : null}

              <div className="space-y-2">
                <span className="text-sm font-semibold text-[#101828]">Estimated price</span>
                <div className="w-full rounded-2xl border border-[#d9e2f2] bg-[#eef4ff] px-4 py-3 text-lg font-bold text-[#0028aa]">
                  Rs {estimatedPrice.toLocaleString('en-IN')}
                </div>
                <p className="text-xs font-medium text-[#667085]">{pricingNote}</p>
              </div>

              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-semibold text-[#101828]">
                  {isTeaShopBoards ? 'Brand creative / photos to be printed on boards' : isNoticeMarketing ? 'Brand creative / artwork to be used for notices' : 'Brand creative / photos to be printed on cups'}
                </span>
                <label className="flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-[28px] border border-dashed border-[#cfd6e4] bg-[#f8fbff] px-6 py-8 text-center">
                  <ImagePlus className="h-8 w-8 text-[#0028aa]" />
                  <span className="mt-3 text-sm font-semibold text-[#101828]">Upload poster or artwork files</span>
                  <span className="mt-1 text-xs font-medium text-[#667085]">
                    {isTeaShopBoards ? 'PNG, JPG, or PDF artwork for the board print layout' : isNoticeMarketing ? 'PNG, JPG, or PDF artwork for the notice print layout' : 'PNG, JPG, or PDF artwork for the cup print layout'}
                  </span>
                  <input
                    type="file"
                    multiple
                    accept=".png,.jpg,.jpeg,.pdf"
                    onChange={handlePosterUpload}
                    className="hidden"
                  />
                </label>
                {bookingForm.posterFiles.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {bookingForm.posterFiles.map((file) => (
                      <span key={file.name} className="rounded-full bg-[#eef1ff] px-3 py-1 text-xs font-semibold text-[#0028aa]">
                        {file.name}
                      </span>
                    ))}
                  </div>
                ) : null}
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-semibold text-[#101828]">Other print details</span>
                <textarea
                  value={bookingForm.printDetails}
                  onChange={(event) => updateField('printDetails', event.target.value)}
                  placeholder="Example: include brand campaign in English and Malayalam, hero image on one side, launch date on the back"
                  className="min-h-[120px] w-full rounded-2xl border border-[#e7eaf2] bg-[#f8fbff] px-4 py-3 outline-none focus:border-[#0028aa]"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-[#101828]">Start date of campaign</span>
                <input
                  type="date"
                  value={bookingForm.startDate}
                  onChange={(event) => updateField('startDate', event.target.value)}
                  className="w-full rounded-2xl border border-[#e7eaf2] bg-[#f8fbff] px-4 py-3 outline-none focus:border-[#0028aa]"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-[#101828]">End date of campaign</span>
                <input
                  type="date"
                  value={bookingForm.endDate}
                  onChange={(event) => updateField('endDate', event.target.value)}
                  className="w-full rounded-2xl border border-[#e7eaf2] bg-[#f8fbff] px-4 py-3 outline-none focus:border-[#0028aa]"
                />
              </label>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <Button className="border border-[#cfd6e4] bg-white text-[#101828] hover:bg-[#f8fbff]" onClick={closeBookingForm}>
                Cancel
              </Button>
              <Button className="bg-[#0028aa] text-white hover:bg-[#001f85]" onClick={submitBookingRequest}>
                Payment
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {selectedReportCampaign ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/45 p-4">
          <div className="max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-[32px] bg-white p-8 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8a94a6]">Campaign details</p>
                <h3 className="mt-2 text-3xl font-heading font-bold text-[#101828]">{selectedReportCampaign.movieName}</h3>
                <p className="mt-2 text-sm font-body text-[#667085]">
                  Review tea cup placement across outlets. One image is shown for each outlet in the campaign.
                </p>
              </div>
              <button
                type="button"
                onClick={closeCampaignDetails}
                className="rounded-full bg-[#f4f7fb] p-2 text-[#667085]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-5">
              <div className="rounded-3xl border border-[#e3e8f3] bg-[#f8fbff] p-5">
                <p className="text-sm font-semibold text-[#101828]">District</p>
                <p className="mt-1 text-sm text-[#667085]">{selectedReportCampaign.district}</p>
                <p className="mt-4 text-sm font-semibold text-[#101828]">
                  {isTeaShopBoards ? 'Number of boards installed' : isNoticeMarketing ? 'Number of notices distributed' : 'Total cups produced'}
                </p>
                <p className="mt-1 text-sm text-[#667085]">
                  {getReportedQuantity(selectedReportCampaign).toLocaleString()} {isTeaShopBoards ? 'boards installed' : isNoticeMarketing ? 'notices' : 'cups'}
                </p>
                <p className="mt-4 text-sm font-semibold text-[#101828]">
                  {isNoticeMarketing ? 'Houses covered' : 'Outlets covered'}
                </p>
                <p className="mt-1 text-sm text-[#667085]">
                  {isNoticeMarketing
                    ? `${selectedReportCampaign.outlets || 0}K homes`
                    : `${selectedReportCampaign.outlets || 0} outlets`}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-[#101828]">
                  {isNoticeMarketing ? 'Notice placement images' : 'Outlet placement images'}
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {(selectedReportCampaign.outletPlacementProof || []).map((imageName, index) => (
                    <div key={`${imageName}-${index}`} className="min-w-0 overflow-hidden rounded-[28px] border border-[#e3e8f3] bg-[#f8fbff]">
                      <div className="flex h-32 sm:h-40 items-center justify-center bg-[linear-gradient(135deg,#dbeafe_0%,#eef4ff_100%)]">
                        <ImagePlus className="h-10 w-10 text-[#0028aa]" />
                      </div>
                      <div className="p-4">
                        <p className="text-sm font-semibold text-[#101828]">
                          {isNoticeMarketing ? `Notice ${index + 1}` : `Outlet ${index + 1}`}
                        </p>
                        <p className="mt-1 break-all text-xs text-[#667085]">
                          {isNoticeMarketing ? `Notice ${index + 1}.jpg` : imageName}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-[#e3e8f3] bg-[#f8fbff] p-5">
                <p className="text-sm font-semibold text-[#101828]">Brand team remarks for field agent</p>
                <textarea
                  value={campaignRemark}
                  onChange={(event) => setCampaignRemark(event.target.value)}
                  placeholder="Add instructions or remarks for the field agent. These notes will be visible in the campaign details."
                  className="mt-3 min-h-[120px] w-full rounded-2xl border border-[#dbe4f3] bg-white px-4 py-3 outline-none focus:border-[#0028aa]"
                />
                <div className="mt-4 flex justify-end">
                  <Button className="bg-[#0028aa] text-white hover:bg-[#001f85]" onClick={saveCampaignRemark}>
                    Save Remark
                  </Button>
                </div>
                {selectedReportCampaign.producerRemark ? (
                  <div className="mt-4 rounded-2xl bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a94a6]">Saved remark</p>
                    <p className="mt-2 text-sm text-[#475467]">{selectedReportCampaign.producerRemark}</p>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <Button className="bg-[#0028aa] text-white hover:bg-[#001f85]" onClick={closeCampaignDetails}>
                Close
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default TeaCupMarketing;
