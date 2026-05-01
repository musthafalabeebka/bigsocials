import React, { useState } from 'react';
import {
  BarChart3,
  CalendarDays,
  Clapperboard,
  ArrowLeft,
  Film,
  Handshake,
  IndianRupee,
  MapPin,
  Megaphone,
  Star,
  Ticket,
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';

const nivinFilms = [
  {
    title: 'Sarvam Maya',
    year: '2025',
    genre: 'Supernatural romantic comedy',
    subGenre: 'Fantasy / horror-comedy',
    director: 'Akhil Sathyan',
    cinematographer: 'Sharan Velayudhan',
    musicDirector: 'Justin Prabhakaran',
    coStars: 'Riya Shibu, Preity Mukhundhan, Aju Varghese',
    budget: 'Not disclosed',
    collection: 'Rs 150 Cr',
    profit: 'Not disclosed',
    ottDeal: 'JioHotstar rights',
    viewership: 'Not public',
    releaseMonth: 'December',
    festival: 'Christmas',
    daysToOtt: '36 days',
    result: 'Blockbuster',
    roi: '91/100',
  },
  {
    title: 'Premam',
    year: '2015',
    genre: 'Coming-of-age romantic comedy-drama',
    subGenre: 'Campus romance',
    director: 'Alphonse Puthren',
    cinematographer: 'Anend C. Chandran',
    musicDirector: 'Rajesh Murugesan',
    coStars: 'Sai Pallavi, Madonna Sebastian, Anupama Parameswaran',
    budget: 'Rs 4 Cr',
    collection: 'Rs 73 Cr',
    profit: 'Approx 1,725%',
    ottDeal: 'Not public',
    viewership: 'Not public',
    releaseMonth: 'May',
    festival: 'No major festival',
    daysToOtt: 'Not public',
    result: 'Blockbuster',
    roi: '88/100',
  },
  {
    title: 'Bangalore Days',
    year: '2014',
    genre: 'Coming-of-age comedy drama',
    subGenre: 'Urban ensemble drama',
    director: 'Anjali Menon',
    cinematographer: 'Sameer Thahir',
    musicDirector: 'Gopi Sundar',
    coStars: 'Dulquer Salmaan, Nazriya Nazim, Fahadh Faasil',
    budget: 'Not disclosed',
    collection: 'Rs 48-50 Cr',
    profit: 'Not disclosed',
    ottDeal: 'Not public',
    viewership: 'Not public',
    releaseMonth: 'May',
    festival: 'No major festival',
    daysToOtt: 'Not public',
    result: 'Blockbuster',
    roi: '86/100',
  },
  {
    title: 'Kayamkulam Kochunni',
    year: '2018',
    genre: 'Epic period action',
    subGenre: 'Historical biographical adventure',
    director: 'Rosshan Andrrews',
    cinematographer: 'Binod Pradhan, Nirav Shah, Sudheer Palsane',
    musicDirector: 'Gopi Sundar',
    coStars: 'Mohanlal, Sunny Wayne, Priya Anand, Babu Antony',
    budget: 'Rs 45 Cr',
    collection: 'Rs 70 Cr',
    profit: 'Approx 56%',
    ottDeal: 'Not public',
    viewership: 'Not public',
    releaseMonth: 'October',
    festival: 'No major festival',
    daysToOtt: 'Not public',
    result: 'Hit',
    roi: '79/100',
  },
  {
    title: 'Moothon',
    year: '2019',
    genre: 'Action drama',
    subGenre: 'Bilingual arthouse crime drama',
    director: 'Geetu Mohandas',
    cinematographer: 'Rajeev Ravi',
    musicDirector: 'Songs: Shashank Arora; Score: Sagar Desai',
    coStars: 'Shashank Arora, Sobhita Dhulipala, Roshan Mathew',
    budget: 'Not disclosed',
    collection: 'Festival circuit',
    profit: 'Not disclosed',
    ottDeal: 'Not public',
    viewership: 'Not public',
    releaseMonth: 'October',
    festival: 'Festival release circuit',
    daysToOtt: 'Not public',
    result: 'Critical acclaim',
    roi: '72/100',
  },
  {
    title: 'Action Hero Biju',
    year: '2016',
    genre: 'Police procedural comedy',
    subGenre: 'Slice-of-life police drama',
    director: 'Abrid Shine',
    cinematographer: 'Alex J. Pulickal',
    musicDirector: 'Songs: Jerry Amaldev, Aristo Suresh; Score: Rajesh Murugesan',
    coStars: 'Anu Emmanuel, Saiju Kurup, Joju George',
    budget: 'Rs 5 Cr',
    collection: 'Rs 32 Cr',
    profit: 'Approx 540%',
    ottDeal: 'Not public',
    viewership: 'Not public',
    releaseMonth: 'February',
    festival: 'No major festival',
    daysToOtt: 'Not public',
    result: 'Hit',
    roi: '76/100',
  },
];

const getFilmMetrics = (film) => [
  ['Budget', film.budget],
  ['Revenue', film.collection],
  ['Profit', film.profit],
  ['ROI score', film.roi],
  ['OTT deal', film.ottDeal],
  ['Viewership', film.viewership],
];

const getDetailDashboards = (film) => [
    {
      icon: Ticket,
      title: 'Theatre & Distribution Analytics',
      metrics: [
        ['Multiplex share', '71%'],
        ['Single screen share', '44%'],
        ['PVR / Cinepolis pull', '68% occupancy'],
        ['Local chain pull', '52% occupancy'],
        ['Morning shows', '41% occupancy'],
        ['Evening/weekend shows', '84% occupancy'],
        ['Screens vs revenue efficiency', '1.8x'],
        ['Distribution insight', 'High occupancy but low screens'],
      ],
    },
    {
      icon: Clapperboard,
      title: 'Genre & Sub-Genre',
      metrics: [
        ['Genre', film.genre],
        ['Sub-genre', film.subGenre],
      ],
    },
    {
      icon: Handshake,
      title: 'Technicians',
      metrics: [
        ['Director', film.director],
        ['Cinematographer', film.cinematographer],
        ['Music director', film.musicDirector],
        ['Co-stars', film.coStars],
      ],
    },
    {
      icon: Star,
      title: 'Audience Sentiment Factors',
      metrics: [
        ['IMDb rating', '7.8/10'],
        ['BookMyShow rating', '88%'],
        ['Social positive sentiment', '68%'],
        ['Social negative sentiment', '10%'],
        ['Critic review average', '3.6/5'],
        ['Audience review average', '4.2/5'],
        ['Revenue/sentiment tag', 'Mass + loved'],
        ['Cult potential', 'Medium-high'],
      ],
    },
    {
      icon: Megaphone,
      title: 'Marketing Impact Analyzer',
      metrics: [
        ['Pre-release mentions', '1.8M'],
        ['Trailer views', '24M'],
        ['Trailer completion rate', '62%'],
        ['Influencer campaign lift', '+19% awareness'],
        ['Interview volume', '42 appearances'],
        ['Hashtag trend peak', '#2 regional'],
        ['Organic buzz', '73%'],
        ['Opening weekend attribution', 'Strong marketing impact'],
      ],
    },
    {
      icon: CalendarDays,
      title: 'Time & Release',
      metrics: [
        ['Release month', film.releaseMonth],
        ['Festival', film.festival],
        ['Days to OTT', film.daysToOtt],
      ],
    },
  ];

const territories = [
  ['Kerala', 'Rs 64 Cr', '42%'],
  ['Tamil Nadu', 'Rs 18 Cr', '12%'],
  ['Karnataka', 'Rs 16 Cr', '11%'],
  ['Gulf', 'Rs 34 Cr', '23%'],
  ['US', 'Rs 11 Cr', '7%'],
];

const Films = () => {
  const [selectedFilm, setSelectedFilm] = useState(null);
  const activeFilm = selectedFilm || nivinFilms[0];

  return (
    <div className="flex min-h-screen bg-[#f8faff] text-[#101828]">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden p-5 sm:p-8 lg:p-10">
        <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-[32px] bg-[linear-gradient(135deg,#0b1437_0%,#1d3fbf_60%,#8cb4ff_100%)] p-6 text-white shadow-xl sm:p-8 lg:p-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
              <Film className="h-4 w-4" />
              Film & Project Intelligence System
            </div>
            <h1 className="mt-4 text-3xl font-heading font-extrabold sm:text-4xl">
              Nivin Pauly film library
            </h1>
            <p className="mt-3 text-base font-semibold leading-7 text-white/82">
              Select a film first, then open its commercial, geo, theatre, genre, sentiment, marketing, and predictive intelligence.
            </p>
          </div>
        </section>

        {!selectedFilm ? (
          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {nivinFilms.map((film) => (
              <button
                key={film.title}
                type="button"
                onClick={() => setSelectedFilm(film)}
                className="rounded-[28px] border border-[#dbe5ff] bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-[#9fb4f2] hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef1ff] text-[#123bb7]">
                  <Film className="h-5 w-5" />
                </div>
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-heading font-extrabold text-[#101828]">{film.title}</h2>
                    <p className="mt-1 text-sm font-bold text-[#667085]">{film.year} · {film.genre}</p>
                  </div>
                  <span className="rounded-full bg-[#eef1ff] px-3 py-1 text-xs font-extrabold uppercase text-[#123bb7]">
                    {film.result}
                  </span>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <MiniMetric label="Box office" value={film.collection} />
                  <MiniMetric label="ROI score" value={film.roi} />
                </div>
                <p className="mt-4 text-sm font-semibold text-[#667085]">Director: {film.director}</p>
              </button>
            ))}
          </section>
        ) : (
          <>
        <button
          type="button"
          onClick={() => setSelectedFilm(null)}
          className="inline-flex items-center gap-2 rounded-[8px] border border-[#d9e2f2] bg-white px-4 py-2 text-sm font-extrabold text-[#123bb7] transition hover:border-[#9fb4f2]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to films
        </button>

        <section className="rounded-[28px] border border-[#dbe5ff] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#8a94a6]">Master dashboard</p>
              <h2 className="mt-2 text-3xl font-heading font-extrabold">{activeFilm.title}</h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-[#667085]">
                {activeFilm.year} · {activeFilm.genre} · Directed by {activeFilm.director}
              </p>
            </div>
            <div className="rounded-[18px] bg-[#eef1ff] px-5 py-4 text-[#123bb7]">
              <IndianRupee className="h-5 w-5" />
              <p className="mt-2 text-2xl font-heading font-extrabold">{activeFilm.collection}</p>
              <p className="text-xs font-extrabold uppercase tracking-[0.12em]">Lifetime revenue</p>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            {getFilmMetrics(activeFilm).map(([label, value]) => (
              <MiniMetric key={label} label={label} value={value} />
            ))}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.9fr,1.1fr]">
          <article className="rounded-[28px] border border-[#dbe5ff] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-[#123bb7]" />
              <h2 className="text-2xl font-heading font-extrabold">Geo performance intelligence</h2>
            </div>
            <div className="mt-5 space-y-3">
              {territories.map(([region, gross, share]) => (
                <div key={region} className="grid grid-cols-[95px,1fr,58px] items-center gap-3 text-sm">
                  <span className="font-bold text-[#35446a]">{region}</span>
                  <div className="h-3 rounded-full bg-[#edf2ff]">
                    <div className="h-3 rounded-full bg-[#123bb7]" style={{ width: share }} />
                  </div>
                  <span className="text-right font-extrabold text-[#123bb7]">{gross}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[28px] border border-[#dbe5ff] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[#123bb7]" />
              <h2 className="text-2xl font-heading font-extrabold">Release and theatre signal</h2>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Signal label="Opening weekend" value="Rs 38 Cr" detail="Strong launch velocity" />
              <Signal label="Multiplex pull" value="71%" detail="High urban conversion" />
              <Signal label="Single screen pull" value="44%" detail="Moderate B/C center reach" />
              <Signal label="Release strategy" value="Festive solo" detail="Best-performing window" />
            </div>
          </article>
        </section>

        <section className="grid gap-5 xl:grid-cols-2">
          {getDetailDashboards(activeFilm).map(({ icon: Icon, title, metrics }) => (
            <article key={title} className="rounded-[28px] border border-[#dbe5ff] bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef1ff] text-[#123bb7]">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-2xl font-heading font-extrabold">{title}</h3>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {metrics.map(([label, value]) => (
                  <Signal key={label} label={label} value={value} detail="" />
                ))}
              </div>
            </article>
          ))}
        </section>
          </>
        )}
        </div>
      </main>
    </div>
  );
};

const MiniMetric = ({ label, value }) => (
  <div className="rounded-[18px] bg-[#f8faff] px-4 py-4">
    <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#8a94a6]">{label}</p>
    <p className="mt-2 text-lg font-heading font-extrabold text-[#123bb7]">{value}</p>
  </div>
);

const Signal = ({ label, value, detail }) => (
  <div className="rounded-[20px] border border-[#e4e9f4] bg-[#f8faff] p-4">
    <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#8a94a6]">{label}</p>
    <p className="mt-2 text-xl font-heading font-extrabold text-[#123bb7]">{value}</p>
    <p className="mt-1 text-sm font-semibold text-[#667085]">{detail}</p>
  </div>
);

export default Films;
