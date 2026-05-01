import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BadgeCheck,
  Bot,
  Camera,
  CheckCircle2,
  FileText,
  Radio,
  Send,
  ShieldCheck,
  Users,
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../contexts/AuthContext';

const responseTracks = [
  {
    icon: Radio,
    title: 'Counter-narrative',
    detail: 'Publish verified context across owned channels and fan-safe creator handles.',
    status: 'Ready',
  },
  {
    icon: Camera,
    title: 'Evidence capture',
    detail: 'Archive screenshots, URLs, account age, timestamps, and platform report IDs.',
    status: 'Running',
  },
  {
    icon: BadgeCheck,
    title: 'Verified voices',
    detail: 'Prioritize verified fan clubs, creator allies, and press handles for clean amplification.',
    status: 'Queued',
  },
];

const suggestedReplies = [
  'The circulating claim is false. Verified updates will be shared only through official handles.',
  'This content has been reported as manipulated media. Please avoid sharing unverified posts.',
  'Legal and platform reports are active. Support the official release conversation with verified material.',
];

const AiResponseDesk = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-[#f8faff] text-[#101828]">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden p-5 sm:p-8 lg:p-10">
        <div className="mx-auto max-w-7xl space-y-8">
          <section className="rounded-[32px] bg-[linear-gradient(135deg,#0b1437_0%,#1d3fbf_60%,#8cb4ff_100%)] p-6 text-white shadow-xl sm:p-8 lg:p-10">
            <button
              type="button"
              onClick={() => navigate('/actor/pr-dashboard')}
              className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to PR Dashboard
            </button>

            <div className="mt-5 max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
                <Bot className="h-4 w-4" />
                AI Response Desk
              </div>
              <h1 className="mt-4 text-3xl font-heading font-extrabold sm:text-4xl">
                Coordinate the next public response
              </h1>
              <p className="mt-3 text-base font-semibold leading-7 text-white/82">
                Build a response plan for {user?.name || 'the actor'}, capture evidence, brief verified supporters, and prepare approved messages from one place.
              </p>
            </div>
          </section>

          <section className="grid gap-5 lg:grid-cols-3">
            {responseTracks.map(({ icon: Icon, title, detail, status }) => (
              <article key={title} className="rounded-[28px] border border-[#dbe5ff] bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef1ff] text-[#123bb7]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-[#eef1ff] px-3 py-1 text-xs font-extrabold uppercase text-[#123bb7]">
                    {status}
                  </span>
                </div>
                <h2 className="mt-5 text-xl font-heading font-extrabold text-[#101828]">{title}</h2>
                <p className="mt-2 text-sm font-semibold leading-6 text-[#667085]">{detail}</p>
              </article>
            ))}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
            <article className="rounded-[28px] border border-[#dbe5ff] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#123bb7]" />
                <h2 className="text-xl font-heading font-extrabold text-[#101828]">Approved response copy</h2>
              </div>
              <div className="mt-5 space-y-3">
                {suggestedReplies.map((reply) => (
                  <div key={reply} className="rounded-[20px] border border-[#e4e9f4] bg-[#f8faff] p-4">
                    <p className="text-sm font-semibold leading-6 text-[#35446a]">{reply}</p>
                    <button
                      type="button"
                      className="mt-3 inline-flex items-center gap-2 rounded-[8px] bg-[#123bb7] px-4 py-2 text-sm font-extrabold text-white transition hover:bg-[#0f33a4]"
                    >
                      <Send className="h-4 w-4" />
                      Use message
                    </button>
                  </div>
                ))}
              </div>
            </article>

            <aside className="space-y-5">
              <section className="rounded-[28px] border border-[#dbe5ff] bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-[#123bb7]" />
                  <h2 className="text-xl font-heading font-extrabold text-[#101828]">Response checklist</h2>
                </div>
                <div className="mt-5 space-y-3">
                  {['Evidence folder created', 'Platform reports filed', 'Legal desk notified', 'Verified supporters briefed'].map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-[16px] bg-[#f8faff] px-4 py-3">
                      <CheckCircle2 className="h-5 w-5 text-[#6d983f]" />
                      <span className="text-sm font-bold text-[#35446a]">{item}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[28px] border border-[#dbe5ff] bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#123bb7]" />
                  <h2 className="text-xl font-heading font-extrabold text-[#101828]">Distribution groups</h2>
                </div>
                <div className="mt-5 grid gap-3">
                  {['Official handles', 'Verified fan clubs', 'Press contacts', 'Creator allies'].map((group) => (
                    <div key={group} className="rounded-[16px] bg-[#f8faff] px-4 py-3 text-sm font-bold text-[#35446a]">
                      {group}
                    </div>
                  ))}
                </div>
              </section>
            </aside>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AiResponseDesk;
