import React from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  CheckCircle2,
  Gem,
  ScanFace,
  Sparkles,
  Store,
  Users,
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../contexts/AuthContext';

const tools = {
  'digital-twin': {
    icon: ScanFace,
    eyebrow: 'Digital Twin Creation',
    title: 'Create licensed AI doubles for approved brand use',
    intro:
      'Build a controlled digital twin workspace for avatar scans, usage permissions, synthetic content approvals, and brand-safe asset delivery.',
    stats: [
      ['Asset status', 'Scan pending'],
      ['Approvals', '3 required'],
      ['Usage rights', 'Campaign-only'],
    ],
    rows: [
      ['Face scan', 'Identity model capture', 'Pending'],
      ['Voice consent', 'Synthetic voice usage approval', 'Draft'],
      ['Brand usage guardrails', 'Territory, duration, and category restrictions', 'Ready'],
    ],
  },
};

const CommercialTools = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const activeToolId = tools[searchParams.get('tool')] ? searchParams.get('tool') : 'digital-twin';
  const activeTool = tools[activeToolId];
  const ActiveIcon = activeTool.icon;

  return (
    <div className="flex min-h-screen bg-[#f8faff] text-[#101828]">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden p-5 sm:p-8 lg:p-10">
        <div className="mx-auto max-w-7xl space-y-8">
          <section className="rounded-[32px] bg-[linear-gradient(135deg,#0b1437_0%,#1d3fbf_60%,#8cb4ff_100%)] p-6 text-white shadow-xl sm:p-8 lg:p-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
                <Sparkles className="h-4 w-4" />
                Digital Twin Studio
              </div>
              <h1 className="mt-4 text-3xl font-heading font-extrabold sm:text-4xl">
                Digital twin creation for {user?.name || 'the actor'}
              </h1>
              <p className="mt-3 text-base font-semibold leading-7 text-white/82">
                Create a licensed AI double with controlled face scans, voice consent, usage permissions, approval guardrails, and brand-safe asset delivery.
              </p>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[0.9fr,1.1fr]">
            <article className="rounded-[28px] border border-[#dbe5ff] bg-white p-6 shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef1ff] text-[#123bb7]">
                <ActiveIcon className="h-6 w-6" />
              </div>
              <p className="mt-5 text-sm font-extrabold uppercase tracking-[0.18em] text-[#8a94a6]">{activeTool.eyebrow}</p>
              <h2 className="mt-2 text-3xl font-heading font-extrabold text-[#101828]">{activeTool.title}</h2>
              <p className="mt-3 text-sm font-semibold leading-6 text-[#667085]">{activeTool.intro}</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {activeTool.stats.map(([label, value]) => (
                  <div key={label} className="rounded-[18px] bg-[#f8faff] p-4">
                    <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#8a94a6]">{label}</p>
                    <p className="mt-2 text-lg font-heading font-extrabold text-[#123bb7]">{value}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[28px] border border-[#dbe5ff] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <Box className="h-5 w-5 text-[#123bb7]" />
                <h2 className="text-xl font-heading font-extrabold text-[#101828]">Workspace queue</h2>
              </div>
              <div className="mt-5 space-y-3">
                {activeTool.rows.map(([title, detail, status]) => (
                  <div key={title} className="rounded-[20px] border border-[#e4e9f4] bg-[#f8faff] p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-base font-heading font-extrabold text-[#101828]">{title}</h3>
                        <p className="mt-1 text-sm font-semibold leading-6 text-[#667085]">{detail}</p>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold uppercase text-[#123bb7]">
                        {status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="grid gap-5 md:grid-cols-3">
            <ActionCard icon={Gem} title="Rights guardrails" detail="Lock category, territory, term, and usage limits before any synthetic assets move forward." />
            <ActionCard icon={Users} title="Approval workflow" detail="Route every request through actor, manager, legal, and brand approvals." />
            <ActionCard icon={Store} title="Launch readiness" detail="Prepare partner deliverables, usage notes, review checkpoints, and go-live windows." />
          </section>
        </div>
      </main>
    </div>
  );
};

const ActionCard = ({ icon: Icon, title, detail }) => (
  <article className="rounded-[24px] border border-[#dbe5ff] bg-white p-5 shadow-sm">
    <CheckCircle2 className="h-6 w-6 text-[#6d983f]" />
    <div className="mt-4 flex items-center gap-2">
      <Icon className="h-5 w-5 text-[#123bb7]" />
      <h3 className="text-lg font-heading font-extrabold text-[#101828]">{title}</h3>
    </div>
    <p className="mt-2 text-sm font-semibold leading-6 text-[#667085]">{detail}</p>
  </article>
);

export default CommercialTools;
