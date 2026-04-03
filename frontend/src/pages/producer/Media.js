import React from 'react';
import { ArrowLeft, Newspaper, Radio, Tv } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

const mediaOptions = [
  {
    title: 'Newspapers',
    description: 'Plan print coverage, regional paper placements, and editorial ad inventory for movie promotions.',
    icon: Newspaper,
    path: '/producer/vendors/media/newspapers',
    cta: 'Browse newspapers',
  },
  {
    title: 'Radio',
    description: 'Coordinate RJ mentions, radio contests, interviews, and station-wide movie promotions.',
    icon: Radio,
    path: '/producer/vendors/media/radio',
    cta: 'Browse radio stations',
  },
  {
    title: 'TV Ads',
    description: 'Book television ad spots, channel integrations, and promo bursts around key release windows.',
    icon: Tv,
  },
];

const Media = () => {
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
                <Tv className="h-4 w-4" />
                Media
              </div>
              <h1 className="mt-4 text-4xl font-heading font-bold">Choose the media channel mix for your campaign.</h1>
              <p className="mt-3 text-base font-body text-white/80">
                Pick the media type that best fits your promotional plan and audience reach strategy.
              </p>
            </div>
          </section>

          <section className="grid gap-6 md:grid-cols-2">
            {mediaOptions.map((option) => {
              const Icon = option.icon;
              const isInteractive = Boolean(option.path);

              return (
                <article
                  key={option.title}
                  className={`rounded-[28px] border border-[#e3e8f3] bg-white p-8 shadow-sm transition-all ${
                    isInteractive ? 'cursor-pointer hover:-translate-y-1 hover:shadow-lg' : ''
                  }`}
                  onClick={isInteractive ? () => navigate(option.path) : undefined}
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef1ff] text-[#0028aa]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h2 className="text-3xl font-heading font-bold text-[#101828]">{option.title}</h2>
                  <p className="mt-3 text-sm font-body text-[#667085]">{option.description}</p>
                  {isInteractive ? (
                    <p className="mt-5 text-sm font-semibold text-[#0028aa]">{option.cta}</p>
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

export default Media;
