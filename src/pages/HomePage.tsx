import {
  ArrowRight,
  Check,
  ChevronDown,
  CirclePlay,
  Cuboid,
  Download,
  Layers3,
  Link as LinkIcon,
  LoaderCircle,
  ScanLine,
  Sparkles,
  WandSparkles,
} from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ModelShowcase } from '../components/three/ModelShowcase'

type HomePageProps = {
  onSignIn: () => void
}

const features = [
  {
    icon: WandSparkles,
    label: 'AI generation',
    title: 'From words to worlds',
    copy: 'Describe an object, character, or environment and generate a clean 3D starting point in seconds.',
  },
  {
    icon: Layers3,
    label: 'Full control',
    title: 'Edit every detail',
    copy: 'Refine geometry, materials, lighting, and camera angles in a purpose-built creative workspace.',
  },
  {
    icon: Download,
    label: 'Production ready',
    title: 'Export anywhere',
    copy: 'Download optimized GLB, FBX, OBJ, and USDZ files ready for games, web, and real-time experiences.',
  },
]

const steps = [
  {
    number: '01',
    title: 'Describe',
    copy: 'Type a prompt or upload a reference image.',
  },
  {
    number: '02',
    title: 'Generate',
    copy: 'Modelly builds and presents your 3D concept.',
  },
  {
    number: '03',
    title: 'Refine',
    copy: 'Shape the result with precise creative controls.',
  },
  {
    number: '04',
    title: 'Export',
    copy: 'Take it anywhere with production-ready formats.',
  },
]

const faqs = [
  {
    question: 'Do I need 3D experience to use Modelly?',
    answer:
      'No. Modelly is designed for both newcomers and professionals. Start with natural language or a reference image, then use guided controls to refine the result.',
  },
  {
    question: 'What can I create?',
    answer:
      'Create objects, props, stylized characters, furniture, game assets, product concepts, and environments. Complex or highly specific commercial assets may require refinement.',
  },
  {
    question: 'Which formats can I export?',
    answer:
      'Paid plans support GLB, FBX, OBJ, and USDZ exports. You can also generate optimized web previews directly from the workspace.',
  },
  {
    question: 'Can I use my creations commercially?',
    answer:
      'Yes. Assets created by paid subscribers can be used in commercial projects. Your source prompts and privately uploaded references remain yours.',
  },
  {
    question: 'Can teams collaborate?',
    answer:
      'Team workspaces include shared libraries, comments, version history, and role-based access for organized creative workflows.',
  },
]

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function HomePage({ onSignIn }: HomePageProps) {
  const [annual, setAnnual] = useState(true)
  const [openFaq, setOpenFaq] = useState(0)

  return (
    <div id="top" className="overflow-hidden">
      <section className="relative isolate min-h-[760px] border-b border-white/[0.06] pt-[72px]">
        <div className="hero-grid absolute inset-0 -z-20" />
        <div className="absolute left-1/2 top-12 -z-10 h-[420px] w-[860px] -translate-x-1/2 rounded-full bg-violet-600/[0.12] blur-[120px]" />
        <div className="mx-auto max-w-[1240px] px-5 pb-20 pt-20 lg:px-8 lg:pt-24">
          <div className="mx-auto max-w-[880px] text-center">
            <div className="fade-in mx-auto inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/[0.08] px-3 py-1.5 text-xs font-medium text-violet-200">
              <Sparkles className="size-3.5" />
              Modelly 2.0 is now available
              <ArrowRight className="size-3.5" />
            </div>
            <h1 className="text-balance fade-in-delayed mt-7 text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-[82px]">
              Turn your imagination
              <span className="block bg-gradient-to-r from-violet-300 via-white to-blue-300 bg-clip-text text-transparent">
                into 3D.
              </span>
            </h1>
            <p className="text-balance fade-in-delayed mx-auto mt-7 max-w-[620px] text-base leading-7 text-zinc-400 sm:text-lg">
              Create, refine, and export production-ready 3D assets with AI.
              From first idea to finished model in a single creative workspace.
            </p>
            <div className="fade-in-delayed mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/dashboard"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-5 text-sm font-semibold text-zinc-950 shadow-[0_12px_40px_rgba(255,255,255,.12)] transition hover:-translate-y-0.5 hover:bg-violet-100"
              >
                Start creating
                <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
              </Link>
              <button
                type="button"
                onClick={() => scrollTo('community')}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.07]"
              >
                <CirclePlay className="size-4 text-violet-300" />
                Explore models
              </button>
            </div>
          </div>

          <div className="relative mx-auto mt-16 h-[390px] max-w-[980px] overflow-hidden rounded-[20px] border border-white/[0.09] bg-[#0b0b11] shadow-[0_30px_100px_rgba(0,0,0,.55)] sm:h-[470px] lg:h-[520px]">
            <div className="absolute left-4 right-4 top-4 z-10 flex items-center justify-between sm:left-5 sm:right-5">
              <div className="flex items-center gap-2 rounded-md border border-white/[0.08] bg-[#111118]/80 px-2.5 py-2 backdrop-blur-md">
                <span className="size-2 rounded-full bg-emerald-400" />
                <span className="text-[11px] font-medium text-zinc-300">Live preview</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-[#111118]/80 p-1 backdrop-blur-md">
                <button type="button" className="flex size-8 items-center justify-center rounded bg-white/10" aria-label="3D view">
                  <Cuboid className="size-4" />
                </button>
                <button type="button" className="flex size-8 items-center justify-center rounded text-zinc-500" aria-label="Scan preview">
                  <ScanLine className="size-4" />
                </button>
              </div>
            </div>
            <div className="absolute bottom-4 left-4 z-10 hidden items-center gap-2 rounded-md border border-white/[0.08] bg-[#111118]/80 px-3 py-2 text-xs text-zinc-400 backdrop-blur-md sm:flex">
              <LoaderCircle className="size-3.5 animate-spin text-violet-300" />
              Geometry ready
            </div>
            <ModelShowcase />
          </div>
        </div>
      </section>

      <section id="features" className="scroll-mt-20 border-b border-white/[0.06] py-24 sm:py-32">
        <div className="mx-auto max-w-[1240px] px-5 lg:px-8">
          <div className="max-w-[620px]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-400">Creative engine</p>
            <h2 className="text-balance mt-4 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
              Everything between idea and asset.
            </h2>
            <p className="mt-5 max-w-[540px] text-base leading-7 text-zinc-400">
              One focused workspace for generating, shaping, and shipping 3D work without the usual toolchain.
            </p>
          </div>

          <div className="mt-14 grid gap-4 lg:grid-cols-3">
            {features.map((feature, index) => (
              <article
                key={feature.title}
                className="group relative min-h-[390px] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d0d13] p-6 transition duration-500 hover:-translate-y-1 hover:border-violet-400/20"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
                    {feature.label}
                  </span>
                  <feature.icon className="size-5 text-zinc-500 transition group-hover:text-violet-300" />
                </div>
                <div className="relative mt-10 h-[210px] overflow-hidden rounded-xl border border-white/[0.06] bg-[#09090d]">
                  {index === 0 && (
                    <div className="glow-grid absolute inset-0">
                      <div className="absolute inset-8 rounded-full border border-violet-400/20">
                        <div className="absolute inset-7 rounded-full border border-violet-400/20" />
                        <div className="absolute inset-14 flex items-center justify-center rounded-full bg-violet-500/10">
                          <WandSparkles className="size-10 text-violet-300" />
                        </div>
                      </div>
                    </div>
                  )}
                  {index === 1 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative size-36 rotate-12 rounded-[28px] border border-blue-300/30 bg-gradient-to-br from-blue-400/20 to-violet-500/10 shadow-[0_20px_60px_rgba(59,130,246,.12)]">
                        <div className="absolute inset-5 rounded-2xl border border-white/10" />
                        <div className="absolute -right-7 top-9 size-14 rounded-full border border-violet-300/40 bg-violet-500/15" />
                      </div>
                    </div>
                  )}
                  {index === 2 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="grid grid-cols-3 gap-2">
                        {['GLB', 'FBX', 'OBJ', 'USDZ', 'PNG', 'MP4'].map((format, formatIndex) => (
                          <div
                            key={format}
                            className={`flex size-16 items-center justify-center rounded-lg border text-[10px] font-semibold ${
                              formatIndex === 0
                                ? 'border-violet-400/40 bg-violet-500/15 text-violet-200'
                                : 'border-white/[0.08] bg-white/[0.03] text-zinc-500'
                            }`}
                          >
                            {format}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <h3 className="mt-6 text-xl font-semibold tracking-tight">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{feature.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="scroll-mt-20 border-b border-white/[0.06] py-24 sm:py-32">
        <div className="mx-auto max-w-[1240px] px-5 lg:px-8">
          <div className="mx-auto max-w-[620px] text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-400">Workflow</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
              From prompt to production.
            </h2>
          </div>
          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <article key={step.number} className="min-h-[220px] bg-[#09090d] p-7">
                <span className="text-xs font-semibold text-violet-400">{step.number}</span>
                <h3 className="mt-16 text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{step.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="community" className="scroll-mt-20 border-b border-white/[0.06] py-24 sm:py-32">
        <div className="mx-auto max-w-[1240px] px-5 lg:px-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-[560px]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-400">Community</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
                Made with Modelly.
              </h2>
            </div>
            <button
              type="button"
              onClick={onSignIn}
              className="group inline-flex h-11 items-center gap-2 self-start rounded-lg border border-white/10 px-4 text-sm font-medium transition hover:border-violet-400/30 hover:bg-violet-500/[0.08]"
            >
              Join the community
              <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
            </button>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Aether chair', 'Mira Studio', 'from-violet-500/25 to-fuchsia-900/20', 'chair'],
              ['Kinetic rover', 'Noah K.', 'from-blue-500/25 to-cyan-900/20', 'rover'],
              ['Orbital helmet', 'Lena P.', 'from-zinc-400/20 to-violet-900/30', 'helmet'],
              ['Glass habitat', 'Arc Labs', 'from-cyan-400/20 to-blue-900/30', 'habitat'],
            ].map(([title, creator, gradient, type]) => (
              <button
                type="button"
                key={title}
                onClick={onSignIn}
                className="group text-left"
                aria-label={`View ${title} by ${creator}`}
              >
                <div className={`relative aspect-[4/5] overflow-hidden rounded-xl border border-white/[0.08] bg-gradient-to-br ${gradient}`}>
                  <div className="glow-grid absolute inset-0 opacity-30" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    {type === 'chair' && (
                      <div className="relative size-32 rotate-[8deg]">
                        <div className="absolute left-7 top-2 h-20 w-20 rounded-[28px] border-[12px] border-violet-300/70" />
                        <div className="absolute bottom-8 left-12 h-20 w-16 -skew-x-12 rounded-lg border border-violet-200/40 bg-violet-400/15" />
                        <div className="absolute bottom-3 left-7 h-1 w-16 rounded-full bg-violet-200/50" />
                      </div>
                    )}
                    {type === 'rover' && (
                      <div className="relative h-28 w-36">
                        <div className="absolute left-8 top-3 h-16 w-20 rounded-xl border border-blue-200/40 bg-blue-400/15" />
                        <div className="absolute left-3 bottom-3 size-12 rounded-full border-[8px] border-cyan-200/40" />
                        <div className="absolute right-3 bottom-3 size-12 rounded-full border-[8px] border-cyan-200/40" />
                      </div>
                    )}
                    {type === 'helmet' && (
                      <div className="relative size-40">
                        <div className="absolute inset-4 rounded-[50%] border-[14px] border-zinc-300/50 bg-violet-400/10" />
                        <div className="absolute bottom-7 left-12 h-10 w-16 rounded-b-2xl border border-zinc-200/30 bg-zinc-900/70" />
                      </div>
                    )}
                    {type === 'habitat' && (
                      <div className="relative size-44">
                        <div className="absolute bottom-5 left-5 h-28 w-32 rounded-t-[80px] rounded-b-lg border border-cyan-200/35 bg-cyan-300/10" />
                        <div className="absolute bottom-11 left-12 h-16 w-20 rounded-t-full border border-cyan-100/20" />
                      </div>
                    )}
                  </div>
                  <span className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full border border-white/10 bg-black/30 opacity-0 backdrop-blur-md transition group-hover:opacity-100">
                    <ArrowRight className="size-4" />
                  </span>
                </div>
                <h3 className="mt-4 text-sm font-semibold">{title}</h3>
                <p className="mt-1 text-xs text-zinc-500">by {creator}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="scroll-mt-20 border-b border-white/[0.06] py-24 sm:py-32">
        <div className="mx-auto max-w-[1240px] px-5 lg:px-8">
          <div className="mx-auto max-w-[620px] text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-400">Pricing</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
              Start creating today.
            </h2>
            <div className="mt-7 inline-flex rounded-lg border border-white/[0.08] bg-white/[0.03] p-1">
              <button
                type="button"
                onClick={() => setAnnual(false)}
                className={`rounded-md px-3.5 py-2 text-xs font-medium transition ${!annual ? 'bg-white text-zinc-950' : 'text-zinc-400'}`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setAnnual(true)}
                className={`rounded-md px-3.5 py-2 text-xs font-medium transition ${annual ? 'bg-white text-zinc-950' : 'text-zinc-400'}`}
              >
                Annual <span className={annual ? 'text-violet-600' : 'text-violet-400'}>-20%</span>
              </button>
            </div>
          </div>

          <div className="mx-auto mt-12 grid max-w-[980px] gap-4 lg:grid-cols-3">
            {[
              {
                name: 'Free',
                price: '$0',
                copy: 'Explore 3D creation.',
                features: ['50 generation credits', 'Community models', 'GLB exports'],
              },
              {
                name: 'Creator',
                price: annual ? '$24' : '$30',
                copy: 'For independent creators.',
                features: ['1,000 generation credits', 'Commercial license', 'All export formats', 'Private projects'],
                featured: true,
              },
              {
                name: 'Studio',
                price: annual ? '$79' : '$99',
                copy: 'For teams and studios.',
                features: ['5,000 generation credits', 'Team workspaces', 'Shared libraries', 'Priority support'],
              },
            ].map((plan) => (
              <article
                key={plan.name}
                className={`relative flex min-h-[420px] flex-col rounded-2xl border p-7 ${
                  plan.featured
                    ? 'border-violet-400/40 bg-gradient-to-b from-violet-500/[0.12] to-[#0d0d13]'
                    : 'border-white/[0.08] bg-[#0d0d13]'
                }`}
              >
                {plan.featured && (
                  <span className="absolute right-5 top-5 rounded-full border border-violet-400/20 bg-violet-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-violet-300">
                    Popular
                  </span>
                )}
                <h3 className="text-sm font-semibold">{plan.name}</h3>
                <p className="mt-1 text-xs text-zinc-500">{plan.copy}</p>
                <div className="mt-7 flex items-end gap-1">
                  <span className="text-4xl font-semibold tracking-tight">{plan.price}</span>
                  {plan.price !== '$0' && <span className="pb-1 text-xs text-zinc-500">/ month</span>}
                </div>
                <ul className="mt-8 space-y-3">
                  {plan.features.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-zinc-300">
                      <Check className="size-4 text-violet-300" />
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={onSignIn}
                  className={`mt-auto h-11 rounded-lg text-sm font-semibold transition ${
                    plan.featured
                      ? 'bg-white text-zinc-950 hover:bg-violet-100'
                      : 'border border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.07]'
                  }`}
                >
                  {plan.price === '$0' ? 'Get started free' : `Choose ${plan.name}`}
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.06] py-24 sm:py-32">
        <div className="mx-auto max-w-[1240px] px-5 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-400">FAQ</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.045em]">Questions, answered.</h2>
            </div>
            <div className="border-t border-white/[0.08]">
              {faqs.map((faq, index) => (
                <article key={faq.question} className="border-b border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left"
                    aria-expanded={openFaq === index}
                  >
                    <span className="text-sm font-semibold sm:text-base">{faq.question}</span>
                    <ChevronDown
                      className={`size-4 shrink-0 text-zinc-500 transition ${openFaq === index ? 'rotate-180 text-violet-300' : ''}`}
                    />
                  </button>
                  {openFaq === index && (
                    <p className="max-w-[680px] pb-6 pr-10 text-sm leading-7 text-zinc-400">
                      {faq.answer}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#08080b]">
        <div className="mx-auto max-w-[1240px] px-5 py-12 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1fr_repeat(3,180px)]">
            <div>
              <button type="button" onClick={() => scrollTo('top')} className="flex items-center gap-2.5 font-semibold">
                <span className="flex size-8 items-center justify-center rounded-lg border border-violet-400/30 bg-violet-500/10">
                  <Cuboid className="size-4 text-violet-300" />
                </span>
                Modelly.me
              </button>
              <p className="mt-4 max-w-[260px] text-sm leading-6 text-zinc-500">
                Your imagination, modelled.
              </p>
            </div>
            {[
              ['Product', ['Explore', 'Features', 'Pricing']],
              ['Company', ['About', 'Careers', 'Contact']],
              ['Follow', ['Instagram', 'X / Twitter', 'Discord']],
            ].map(([heading, links]) => (
              <div key={heading as string}>
                <h3 className="text-xs font-semibold text-zinc-300">{heading}</h3>
                <div className="mt-4 flex flex-col items-start gap-3">
                  {(links as string[]).map((link) => (
                    <button
                      key={link}
                      type="button"
                      onClick={() => {
                        if (link === 'Features') scrollTo('features')
                        else if (link === 'Pricing') scrollTo('pricing')
                        else if (link === 'Explore') scrollTo('community')
                        else onSignIn()
                      }}
                      className="text-sm text-zinc-500 transition hover:text-white"
                    >
                      {link}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-col gap-4 border-t border-white/[0.07] pt-6 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
            <p>&copy; {new Date().getFullYear()} Modelly.me</p>
            <div className="flex items-center gap-5">
              <button type="button" onClick={onSignIn} className="hover:text-zinc-300">Privacy</button>
              <button type="button" onClick={onSignIn} className="hover:text-zinc-300">Terms</button>
              <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-zinc-300">
                <Cuboid className="size-4" />
              </a>
              <button type="button" onClick={onSignIn} aria-label="Copy link" className="hover:text-zinc-300">
                <LinkIcon className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
