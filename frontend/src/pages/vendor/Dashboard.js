import React from 'react';
import { ClipboardList, MapPinned, RadioTower, PanelsTopLeft, Newspaper, Handshake, Tv, Sparkles, BriefcaseBusiness, Users } from 'lucide-react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from '../../components/Sidebar';
import { getVendorDashboardPath, getVendorTypeConfig } from './vendorTypes';

const requestCardsByType = {
  billboards: [
    { title: 'Pending Billboard Requests', value: '12', detail: 'Brand requests waiting for inventory confirmation.', icon: PanelsTopLeft },
    { title: 'Total Earnings', value: 'Rs 1.52L', detail: 'Completed billboard bookings and payments received across closed campaigns.', icon: ClipboardList },
  ],
  brands: [
    { title: 'Pending Brand Requests', value: '2', detail: 'Brand collaboration requests waiting for brand-side review.', icon: Handshake },
    { title: 'Total Earnings', value: 'Rs 4.6L', detail: 'Completed brand collaborations and payments received across closed deals.', icon: ClipboardList },
  ],
  media: [
    { title: 'Pending Media Requests', value: '2', detail: 'Brand media placement requests waiting for scheduling confirmation.', icon: Tv },
    { title: 'Total Earnings', value: 'Rs 1.28L', detail: 'Completed media placements and payments received across closed campaigns.', icon: ClipboardList },
  ],
  newspapers: [
    { title: 'Newspaper Requests', value: '8', detail: 'Print placement briefs awaiting vendor review.', icon: Newspaper },
    { title: 'Running Print Campaigns', value: '3', detail: 'Booked insertions currently active across editions.', icon: ClipboardList },
  ],
  radio: [
    { title: 'Radio Requests', value: '5', detail: 'Broadcast slots awaiting scheduling.', icon: RadioTower },
    { title: 'Scheduled Spot Runs', value: '7', detail: 'Confirmed audio ad runs lined up for execution.', icon: ClipboardList },
  ],
  'field-agents': [
    { title: 'Execution Jobs', value: '14', detail: 'Tea cup, notice, and tea shop board jobs in progress.', icon: MapPinned },
    { title: 'Reporting Tasks', value: '9', detail: 'Campaign proofs and live reports pending upload.', icon: ClipboardList },
  ],
  'tea-cup-marketing': [
    { title: 'Tea Cup Orders', value: '10', detail: 'Cup branding campaigns awaiting production and placement.', icon: MapPinned },
    { title: 'Live Tea Cup Campaigns', value: '4', detail: 'Field teams currently executing tea cup distribution.', icon: ClipboardList },
  ],
  'tea-shop-boards': [
    { title: 'Board Installation Jobs', value: '7', detail: 'Tea shop board requests awaiting installation.', icon: MapPinned },
    { title: 'Running Board Campaigns', value: '5', detail: 'Live tea shop board placements across local clusters.', icon: ClipboardList },
  ],
  'notice-marketing': [
    { title: 'Notice Distribution Jobs', value: '13', detail: 'Door-to-door notice campaigns queued for field execution.', icon: MapPinned },
    { title: 'Live Notice Campaigns', value: '6', detail: 'Active household notice campaigns under reporting.', icon: ClipboardList },
  ],
  ambassadors: [
    { title: 'Ambassador Requests', value: '8', detail: 'Community activation requests waiting for assignment.', icon: Users },
    { title: 'Total Earnings', value: 'Rs 1.85L', detail: 'Completed ambassador campaign earnings available for withdrawal.', icon: ClipboardList },
  ],
  kudumbasree: [
    { title: 'Kudumbasree Activations', value: '6', detail: 'Community activation campaigns waiting for rollout.', icon: Sparkles },
    { title: 'Live Kudumbasree Campaigns', value: '3', detail: 'Running local circulation campaigns with active members.', icon: ClipboardList },
  ],
  students: [
    { title: 'Student Activation Requests', value: '9', detail: 'Campus activation opportunities awaiting assignment.', icon: BriefcaseBusiness },
    { title: 'Live Student Campaigns', value: '4', detail: 'Student ambassador campaigns in progress.', icon: ClipboardList },
  ],
};

const requestCardLinksByType = {
  billboards: {
    'Pending Billboard Requests': '/vendor/dashboard/billboards/requests',
    'Total Earnings': '/vendor/dashboard/billboards/completed',
  },
  brands: {
    'Pending Brand Requests': '/vendor/dashboard/brands/requests',
    'Total Earnings': '/vendor/dashboard/brands/completed',
  },
  media: {
    'Pending Media Requests': '/vendor/dashboard/media/requests',
    'Total Earnings': '/vendor/dashboard/media/completed',
  },
  'field-agents': {
    'Execution Jobs': '/vendor/dashboard/field-agents/execution',
    'Reporting Tasks': '/vendor/dashboard/field-agents/reports',
  },
  ambassadors: {
    'Ambassador Requests': '/vendor/dashboard/ambassadors/requests',
    'Total Earnings': '/vendor/dashboard/ambassadors/earnings',
  },
};

const VendorDashboard = () => {
  const { user } = useAuth();
  const { vendorType } = useParams();
  const navigate = useNavigate();

  if (!user?.onboarding_completed) {
    return <Navigate to="/vendor/onboarding" replace />;
  }

  const resolvedVendorType = vendorType || user?.vendor_type || 'billboards';
  const vendorConfig = getVendorTypeConfig(resolvedVendorType);
  const vendorDashboardPath = getVendorDashboardPath(user?.vendor_type || resolvedVendorType);

  if (!vendorType) {
    return <Navigate to={vendorDashboardPath} replace />;
  }

  const requestCards = requestCardsByType[resolvedVendorType] || requestCardsByType.billboards;
  const HeroIcon = vendorConfig.icon;

  return (
    <div className="flex min-h-screen bg-[#f8faff]">
      <Sidebar />
      <main className="flex-1 p-8 lg:p-10">
        <div className="mx-auto max-w-6xl space-y-8">
          <section className="rounded-[32px] bg-[linear-gradient(135deg,#0b1437_0%,#1d3fbf_60%,#8cb4ff_100%)] p-8 lg:p-10 text-white shadow-xl">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
                <HeroIcon className="h-4 w-4" />
                {vendorConfig.title} Vendor Portal
              </div>
              <h1 className="mt-4 text-4xl font-heading font-bold">Welcome back, {user?.name}</h1>
              <p className="mt-3 text-base font-body text-white/80">
                Review incoming brand requests, manage placements, and track active {vendorConfig.title.toLowerCase()} jobs from one place.
              </p>
            </div>
          </section>

          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {requestCards.map((card) => {
              const Icon = card.icon;
              const href = requestCardLinksByType[resolvedVendorType]?.[card.title];

              return (
                <article
                  key={card.title}
                  className={`rounded-[28px] border border-[#dbe3f3] bg-white p-6 shadow-sm transition ${
                    href ? 'cursor-pointer hover:-translate-y-0.5 hover:border-[#b9c8ef] hover:shadow-md' : ''
                  }`}
                  onClick={href ? () => navigate(href) : undefined}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef1ff] text-[#0028aa]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">{card.title}</p>
                  <p className="mt-2 text-4xl font-heading font-bold text-[#101828]">{card.value}</p>
                  <p className="mt-3 text-sm text-[#667085]">{card.detail}</p>
                  {href ? (
                    <p className="mt-4 text-sm font-semibold text-[#123bb7]">
                      {card.title.includes('Pending') ? 'Open requests' : 'Open details'}
                    </p>
                  ) : null}
                </article>
              );
            })}
          </section>
        </div>
      </main>
    </div>
  );
};

export default VendorDashboard;
