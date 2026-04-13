import React from 'react';
import { ArrowLeft, Package, ScrollText, ShoppingBag, ShoppingCart, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

const quickCommerceOptions = [
  {
    title: 'Swiggy',
    description:
      'Book Swiggy app visibility through storefront banners, sponsored product moments, cart nudges, and local delivery audience campaigns.',
    icon: ShoppingBag,
    path: '/producer/vendors/quick-commerce/swiggy',
    cta: 'Open Swiggy workflow',
  },
  {
    title: 'Zepto',
    description:
      'Run Zepto quick-commerce campaigns with high-frequency app placements, product discovery slots, and launch-week reminders.',
    icon: Zap,
    path: '/producer/vendors/quick-commerce/zepto',
    cta: 'Open Zepto workflow',
  },
  {
    title: 'Blinkit',
    description:
      'Plan Blinkit visibility across app surfaces, basket placements, local shopper moments, and rapid delivery campaign zones.',
    icon: Package,
    path: '/producer/vendors/quick-commerce/blinkit',
    cta: 'Open Blinkit workflow',
  },
  {
    title: 'Notice Distribution',
    description:
      'Coordinate notice inserts and delivery-led handouts for local brand awareness through quick-commerce distribution routes.',
    icon: ScrollText,
    path: '/producer/vendors/quick-commerce/notice-distribution',
    cta: 'Open notice distribution workflow',
  },
];

const QuickCommerce = () => {
  const navigate = useNavigate();

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
                <ShoppingCart className="h-4 w-4" />
                Quick Commerce
              </div>
              <h1 className="mt-4 text-4xl font-heading font-bold">
                Choose your quick-commerce activation partner.
              </h1>
              <p className="mt-3 text-base font-body text-white/80">
                Pick a commerce or distribution channel to book campaigns and track live reports.
              </p>
            </div>
          </section>

          <section className="rounded-[24px] border border-[#dbe5ff] bg-white p-5 shadow-sm">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">How It Works</p>
              <h2 className="mt-2 text-2xl font-heading font-bold text-[#101828]">
                Plan your quick-commerce campaign in 3 steps
              </h2>
              <p className="mt-2 text-sm text-[#667085]">
                Select the partner, book the placement or distribution plan, and monitor live campaign reports.
              </p>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <article className="rounded-[24px] border border-[#dbe5ff] bg-[#f8faff] p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#123bb7] text-sm font-bold text-white">
                  1
                </div>
                <h3 className="mt-3 text-lg font-heading font-bold text-[#101828]">Choose Partner</h3>
                <p className="mt-2 text-sm text-[#667085]">
                  Select Swiggy, Zepto, Blinkit, or Notice Distribution.
                </p>
              </article>
              <article className="rounded-[24px] border border-[#dbe5ff] bg-[#f8faff] p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#123bb7] text-sm font-bold text-white">
                  2
                </div>
                <h3 className="mt-3 text-lg font-heading font-bold text-[#101828]">Book Campaign</h3>
                <p className="mt-2 text-sm text-[#667085]">
                  Fill campaign details, upload creative, and make payment.
                </p>
              </article>
              <article className="rounded-[24px] border border-[#dbe5ff] bg-[#f8faff] p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#123bb7] text-sm font-bold text-white">
                  3
                </div>
                <h3 className="mt-3 text-lg font-heading font-bold text-[#101828]">Live Reports</h3>
                <p className="mt-2 text-sm text-[#667085]">
                  Review reach, paid campaign status, and execution proof.
                </p>
              </article>
            </div>
          </section>

          <section className="grid gap-6 md:grid-cols-2">
            {quickCommerceOptions.map((option) => {
              const Icon = option.icon;

              return (
                <article
                  key={option.title}
                  className="cursor-pointer rounded-[28px] border border-[#e3e8f3] bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                  onClick={() => navigate(option.path)}
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef1ff] text-[#0028aa]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h2 className="text-3xl font-heading font-bold text-[#101828]">{option.title}</h2>
                  <p className="mt-3 text-sm font-body leading-6 text-[#667085]">{option.description}</p>
                  <p className="mt-5 text-sm font-semibold text-[#0028aa]">{option.cta}</p>
                </article>
              );
            })}
          </section>
        </div>
      </main>
    </div>
  );
};

export default QuickCommerce;
