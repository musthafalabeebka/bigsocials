import React, { useMemo, useState } from 'react';
import {
  Eye,
  FileText,
  LayoutTemplate,
  MapPin,
  Sparkles,
  Wand2,
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';

export const PRODUCER_PR_BRIEFS_STORAGE_KEY = 'producer_pr_briefs';

const readStoredBriefs = () => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(PRODUCER_PR_BRIEFS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeStoredBriefs = (briefs) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(PRODUCER_PR_BRIEFS_STORAGE_KEY, JSON.stringify(briefs));
  }
};

const publications = [
  {
    id: 'brandibeat',
    name: 'Brandibeat',
    locations: {
      Kerala: 420000,
      TamilNadu: 510000,
      Karnataka: 340000,
      AndhraPradesh: 305000,
    },
    prices: {
      Kerala: 45000,
      TamilNadu: 52000,
      Karnataka: 39000,
      AndhraPradesh: 36000,
    },
    placements: [
      'Homepage hero feature',
      'Entertainment news listing',
      'Trailer launch article',
    ],
  },
  {
    id: 'pinkvilla',
    name: 'Pinkvilla',
    locations: {
      Kerala: 390000,
      TamilNadu: 465000,
      Karnataka: 318000,
      AndhraPradesh: 282000,
    },
    prices: {
      Kerala: 42000,
      TamilNadu: 50000,
      Karnataka: 37000,
      AndhraPradesh: 34000,
    },
    placements: [
      'Breaking entertainment banner',
      'Celebrity news feature',
      'Editorial carousel placement',
    ],
  },
  {
    id: '123telugu',
    name: '123Telugu',
    locations: {
      Kerala: 185000,
      TamilNadu: 228000,
      Karnataka: 241000,
      AndhraPradesh: 498000,
    },
    prices: {
      Kerala: 26000,
      TamilNadu: 30000,
      Karnataka: 32000,
      AndhraPradesh: 54000,
    },
    placements: [
      'Homepage masthead strip',
      'Release update article',
      'Trailer embed feature',
    ],
  },
  {
    id: 'indiaglitz',
    name: 'IndiaGlitz',
    locations: {
      Kerala: 250000,
      TamilNadu: 372000,
      Karnataka: 286000,
      AndhraPradesh: 264000,
    },
    prices: {
      Kerala: 31000,
      TamilNadu: 43000,
      Karnataka: 35000,
      AndhraPradesh: 33000,
    },
    placements: [
      'Lead story card',
      'Video news module',
      'Interviews and updates section',
    ],
  },
];

const locationOptions = [
  { label: 'Kerala', value: 'Kerala' },
  { label: 'Tamil Nadu', value: 'TamilNadu' },
  { label: 'Karnataka', value: 'Karnataka' },
  { label: 'Andhra Pradesh', value: 'AndhraPradesh' },
];

const buildPrDirection = ({ brief, publicationName, locationLabel, placements }) => {
  const sanitizedBrief = brief.trim();
  const sourceText = sanitizedBrief || 'New brand campaign announcement with creator-led publicity push.';
  const shortBrief =
    sourceText.length > 180 ? `${sourceText.slice(0, 177).trim()}...` : sourceText;

  return {
    angle: `Position this story for ${publicationName} as a high-interest entertainment update tailored for ${locationLabel} audiences.`,
    headline: `${publicationName}: make the brand conversation about ${shortBrief.toLowerCase()}`,
    placement: placements[0],
    copy: `Lead with the strongest hook from the brief, connect it to launch momentum, and package it for ${placements[0].toLowerCase()} before expanding into supporting updates.`,
    outreach: [
      `Open with an exclusive entertainment angle for ${publicationName}.`,
      `Prioritize ${placements[0].toLowerCase()} and ${placements[1].toLowerCase()}.`,
      `Use the brief to create a sharper creator, launch, or campaign-week narrative for ${locationLabel}.`,
    ],
  };
};

const AiPrAgent = () => {
  const { user } = useAuth();
  const [selectedLocation, setSelectedLocation] = useState('Kerala');
  const [selectedPublicationId, setSelectedPublicationId] = useState(publications[0].id);
  const [brief, setBrief] = useState('');
  const [generatedDirection, setGeneratedDirection] = useState(null);

  const selectedPublication = useMemo(
    () => publications.find((publication) => publication.id === selectedPublicationId) || publications[0],
    [selectedPublicationId]
  );
  const locationLabel = locationOptions.find((location) => location.value === selectedLocation)?.label || 'Kerala';

  const handleSaveBrief = () => {
    if (!brief.trim()) {
      toast.error('Add a brand brief before saving.');
      return;
    }

    const title = brief.trim().split('\n')[0].slice(0, 80) || 'Brand PR brief';
    const nextBrief = {
      id: `producer-pr-brief-${Date.now()}`,
      title,
      brief: brief.trim(),
      publicationName: selectedPublication.name,
      location: locationLabel,
      expectedReach: selectedPublication.locations[selectedLocation],
      basePrice: selectedPublication.prices[selectedLocation],
      placements: selectedPublication.placements,
      producerName: user?.name || 'Campaign Team',
      createdAt: new Date().toISOString(),
      status: 'open',
    };

    writeStoredBriefs([nextBrief, ...readStoredBriefs()]);
    toast.success('Brand brief saved to Bid Box.');
  };

  const handleGenerateDirection = () => {
    const direction = buildPrDirection({
      brief,
      publicationName: selectedPublication.name,
      locationLabel,
      placements: selectedPublication.placements,
    });

    setGeneratedDirection(direction);
    toast.success('PR direction generated.');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex">
      <Sidebar />
      <main className="flex-1 p-8 lg:p-10">
        <div className="max-w-7xl mx-auto space-y-8">
          <section className="rounded-[32px] bg-[linear-gradient(135deg,#001b6b_0%,#0037d6_55%,#73a6ff_100%)] p-8 lg:p-10 text-white shadow-xl">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
                <Sparkles className="h-4 w-4" />
                AI PR Agent
              </div>
              <h1 className="mt-4 text-4xl font-heading font-bold">Plan digital media publication placements with AI-assisted PR briefs.</h1>
              <p className="mt-3 text-base font-body text-white/80">
                Review publication reach, compare placement options, and prepare a clear PR brief before outreach begins.
              </p>
            </div>
          </section>

          <section className="rounded-[28px] border border-[#e3e8f3] bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#667085]">Digital Media Publications</p>
                <h2 className="mt-2 text-3xl font-heading font-bold text-[#101828]">Select location and review publication reach</h2>
              </div>
              <div className="w-full max-w-sm">
                <label className="text-sm font-semibold uppercase tracking-[0.22em] text-[#667085]">Location</label>
                <select
                  value={selectedLocation}
                  onChange={(event) => setSelectedLocation(event.target.value)}
                  className="mt-3 w-full rounded-2xl border border-[#d7dded] bg-[#f8faff] px-4 py-4 text-base font-medium text-[#101828] outline-none"
                >
                  {locationOptions.map((location) => (
                    <option key={location.value} value={location.value}>
                      {location.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.08fr,0.92fr]">
            <div className="space-y-6">
              <section className="rounded-[28px] border border-[#e3e8f3] bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#667085]">Publication List</p>
                    <h2 className="mt-2 text-3xl font-heading font-bold text-[#101828]">Available digital media publications</h2>
                  </div>
                  <div className="rounded-2xl bg-[#eef4ff] px-4 py-3 text-right">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#667085]">Location reach</p>
                    <p className="mt-1 text-lg font-heading font-bold text-[#0028aa]">
                      {selectedPublication.locations[selectedLocation].toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4">
                  {publications.map((publication) => {
                    const isSelected = publication.id === selectedPublicationId;
                    const viewership = publication.locations[selectedLocation] || 0;

                    return (
                      <button
                        key={publication.id}
                        type="button"
                        onClick={() => setSelectedPublicationId(publication.id)}
                        className={`rounded-[24px] border p-5 text-left transition ${
                          isSelected
                            ? 'border-[#0028aa] bg-[#eef4ff] shadow-sm'
                            : 'border-[#e3e8f3] bg-[#fbfcff] hover:border-[#b9c8f2]'
                        }`}
                      >
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div>
                            <h3 className="text-2xl font-heading font-bold text-[#101828]">{publication.name}</h3>
                            <p className="mt-2 text-sm font-body text-[#667085]">
                              Entertainment and celebrity news publication with regional digital reach.
                            </p>
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
                            {locationLabel}
                          </span>
                          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2">
                            <Eye className="h-4 w-4 text-[#0028aa]" />
                            Auto-updated regional reach
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="rounded-[28px] border border-[#e3e8f3] bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#667085]">Placement of News</p>
                <h2 className="mt-2 text-3xl font-heading font-bold text-[#101828]">Where your story can appear</h2>
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  {selectedPublication.placements.map((placement) => (
                    <article key={placement} className="rounded-[24px] border border-[#e7ebf4] bg-[#f8fbff] p-5">
                      <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef1ff] text-[#0028aa]">
                        <LayoutTemplate className="h-5 w-5" />
                      </div>
                      <h3 className="mt-4 text-lg font-heading font-bold text-[#101828]">{placement}</h3>
                      <p className="mt-2 text-sm font-body text-[#667085]">
                        Suggested placement for launch drops, interviews, buzz stories, and launch-week announcements.
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            </div>

            <aside className="space-y-6">
              <section className="rounded-[28px] border border-[#d9e2f5] bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#667085]">Selected Publication</p>
                <h2 className="mt-2 text-3xl font-heading font-bold text-[#101828]">Publication summary</h2>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between rounded-2xl bg-[#f8faff] px-4 py-4">
                    <span className="text-sm text-[#667085]">Publication</span>
                    <span className="font-semibold text-[#101828]">{selectedPublication.name}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-[#f8faff] px-4 py-4">
                    <span className="text-sm text-[#667085]">Location</span>
                    <span className="font-semibold text-[#101828]">
                      {locationLabel}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-[#f8faff] px-4 py-4">
                    <span className="text-sm text-[#667085]">Viewership</span>
                    <span className="font-semibold text-[#101828]">
                      {selectedPublication.locations[selectedLocation].toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-[#f8faff] px-4 py-4">
                    <span className="text-sm text-[#667085]">Price</span>
                    <span className="font-semibold text-[#101828]">
                      Rs {selectedPublication.prices[selectedLocation].toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="rounded-2xl bg-[#f8faff] px-4 py-4">
                    <p className="text-sm text-[#667085]">Top placements</p>
                    <p className="mt-2 font-semibold text-[#101828]">
                      {selectedPublication.placements.join(', ')}
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-[28px] border border-[#d9e2f5] bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef1ff] text-[#0028aa]">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#667085]">Brand Brief</p>
                    <h2 className="mt-1 text-2xl font-heading font-bold text-[#101828]">Add your media brief</h2>
                  </div>
                </div>

                <textarea
                  value={brief}
                  onChange={(event) => setBrief(event.target.value)}
                  rows={10}
                  placeholder="Add the brand angle, creator hook, announcement type, launch timing, and the story direction you want the publication to carry."
                  className="mt-6 w-full rounded-[24px] border border-[#d7dded] bg-[#f8faff] px-4 py-4 text-base text-[#101828] outline-none placeholder:text-[#98a2b3]"
                />

                <div className="mt-6 flex gap-3">
                  <Button className="bg-[#0028aa] text-white hover:bg-[#001f85]" onClick={handleSaveBrief}>
                    Save Brief
                  </Button>
                  <Button variant="outline" className="border-[#d1daf0] text-[#0028aa] hover:bg-[#eef4ff]" onClick={handleGenerateDirection}>
                    Generate PR Direction
                    <Wand2 className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </section>

              {generatedDirection ? (
                <section className="rounded-[28px] border border-[#d9e2f5] bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef1ff] text-[#0028aa]">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#667085]">Generated PR Direction</p>
                      <h2 className="mt-1 text-2xl font-heading font-bold text-[#101828]">Recommended PR narrative</h2>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="rounded-2xl bg-[#f8faff] px-4 py-4">
                      <p className="text-sm text-[#667085]">Lead angle</p>
                      <p className="mt-2 font-semibold text-[#101828]">{generatedDirection.angle}</p>
                    </div>
                    <div className="rounded-2xl bg-[#f8faff] px-4 py-4">
                      <p className="text-sm text-[#667085]">Suggested headline direction</p>
                      <p className="mt-2 font-semibold text-[#101828]">{generatedDirection.headline}</p>
                    </div>
                    <div className="rounded-2xl bg-[#f8faff] px-4 py-4">
                      <p className="text-sm text-[#667085]">Priority placement</p>
                      <p className="mt-2 font-semibold text-[#101828]">{generatedDirection.placement}</p>
                    </div>
                    <div className="rounded-2xl bg-[#f8faff] px-4 py-4">
                      <p className="text-sm text-[#667085]">Suggested copy direction</p>
                      <p className="mt-2 font-semibold text-[#101828]">{generatedDirection.copy}</p>
                    </div>
                    <div className="rounded-2xl bg-[#eef4ff] px-4 py-4">
                      <p className="text-sm text-[#667085]">Outreach steps</p>
                      <div className="mt-2 space-y-2">
                        {generatedDirection.outreach.map((step) => (
                          <p key={step} className="font-semibold text-[#101828]">
                            {step}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              ) : null}
            </aside>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AiPrAgent;
