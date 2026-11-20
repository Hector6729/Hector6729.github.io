import {
  Bell,
  Box,
  ChevronDown,
  Compass,
  FolderKanban,
  Grid2X2,
  LayoutDashboard,
  List,
  Menu,
  MoreHorizontal,
  Plus,
  Search,
  Settings as SettingsIcon,
  SlidersHorizontal,
  Sparkles,
  Upload,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { NavLink, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ModelViewport } from '../components/three/ModelViewport'
import type { SampleModelKind } from '../components/three/ModelViewport'

type Project = {
  id: number
  title: string
  subtitle: string
  date: string
  status: 'Published' | 'Draft'
  category: 'Character' | 'Environment' | 'Product'
  accent: string
  shape: 'orb' | 'chair' | 'tower' | 'head' | 'phone' | 'arch'
}

const projects: Project[] = [
  { id: 1, title: 'Luma Lounge', subtitle: 'Scandinavian lounge chair', date: 'Nov 18, 2026', status: 'Published', category: 'Product', accent: 'from-violet-500/70 to-fuchsia-300/20', shape: 'chair' },
  { id: 2, title: 'Nebula Explorer', subtitle: 'Stylized sci-fi character', date: 'Nov 14, 2026', status: 'Published', category: 'Character', accent: 'from-blue-500/70 to-cyan-300/20', shape: 'head' },
  { id: 3, title: 'Glass Haven', subtitle: 'Modern architectural study', date: 'Nov 10, 2026', status: 'Draft', category: 'Environment', accent: 'from-emerald-500/60 to-teal-300/20', shape: 'tower' },
  { id: 4, title: 'Aurora Speaker', subtitle: 'Wireless home speaker', date: 'Nov 6, 2026', status: 'Draft', category: 'Product', accent: 'from-orange-500/60 to-amber-300/20', shape: 'phone' },
  { id: 5, title: 'Stone Portal', subtitle: 'Fantasy environment prop', date: 'Oct 29, 2026', status: 'Published', category: 'Environment', accent: 'from-indigo-500/60 to-violet-300/20', shape: 'arch' },
  { id: 6, title: 'Nova Mascot', subtitle: 'Friendly robot companion', date: 'Oct 24, 2026', status: 'Draft', category: 'Character', accent: 'from-pink-500/60 to-purple-300/20', shape: 'orb' },
]

const navItems = [
  { label: 'Overview', to: '/dashboard', icon: LayoutDashboard, end: true },
  { label: 'Recent projects', to: '/dashboard/projects', icon: FolderKanban },
  { label: 'My models', to: '/dashboard/models', icon: Box },
  { label: '3D studio', to: '/dashboard/studio/chair', icon: Grid2X2 },
  { label: 'Explore', to: '/dashboard/explore', icon: Compass },
  { label: 'Settings', to: '/dashboard/settings', icon: SettingsIcon },
]

function ModelShape({ shape, small = false }: { shape: Project['shape']; small?: boolean }) {
  const size = small ? 'size-20' : 'size-28'
  if (shape === 'chair') {
    return <div className={`${size} relative rounded-[30%_30%_18%_18%] border border-white/25 bg-white/20 shadow-[0_18px_40px_rgba(0,0,0,.25)] before:absolute before:-bottom-5 before:left-5 before:h-7 before:w-3 before:rounded-full before:bg-white/30 after:absolute after:-bottom-5 after:right-5 after:h-7 after:w-3 after:rounded-full after:bg-white/30`} />
  }
  if (shape === 'head') {
    return <div className={`${size} relative rounded-[42%_42%_38%_38%] border border-white/25 bg-white/20 shadow-[0_18px_50px_rgba(0,0,0,.25)] before:absolute before:left-[28%] before:top-[38%] before:size-2 before:rounded-full before:bg-white/80 after:absolute after:right-[28%] after:top-[38%] after:size-2 after:rounded-full after:bg-white/80`} />
  }
  if (shape === 'tower') {
    return <div className={`${size} relative rounded-lg border border-white/25 bg-white/20 shadow-[0_18px_40px_rgba(0,0,0,.25)] before:absolute before:-top-5 before:left-1/2 before:h-8 before:w-1/2 before:-translate-x-1/2 before:rounded-t-lg before:border before:border-white/20 before:bg-white/10`} />
  }
  if (shape === 'phone') {
    return <div className={`${size} relative rounded-[22%] border border-white/25 bg-white/20 shadow-[0_18px_40px_rgba(0,0,0,.25)] before:absolute before:left-1/2 before:top-3 before:h-1 before:w-5 before:-translate-x-1/2 before:rounded-full before:bg-white/50`} />
  }
  if (shape === 'arch') {
    return <div className={`${size} relative rounded-t-full border-[12px] border-b-0 border-white/20 shadow-[0_18px_40px_rgba(0,0,0,.25)]`} />
  }
  return <div className={`${size} relative rounded-full border border-white/25 bg-white/20 shadow-[0_18px_50px_rgba(0,0,0,.25)] before:absolute before:left-1/2 before:top-1/2 before:size-8 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:border before:border-white/30`} />
}

function Thumbnail({ project, large = false }: { project: Project; large?: boolean }) {
  return (
    <div className={`relative flex items-center justify-center overflow-hidden rounded-xl border border-white/[0.07] bg-gradient-to-br ${project.accent} ${large ? 'aspect-[16/10]' : 'aspect-[16/11]'}`}>
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      <div className="relative rotate-[8deg] transition duration-300 group-hover:rotate-[3deg] group-hover:scale-105">
        <ModelShape shape={project.shape} small={!large} />
      </div>
    </div>
  )
}

function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  return (
    <article className="group min-w-0">
      <div role="button" tabIndex={0} onClick={onOpen} onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') onOpen()
      }} className="block w-full cursor-pointer text-left">
        <Thumbnail project={project} />
        <div className="mt-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-white">{project.title}</h3>
            <p className="mt-1 truncate text-xs text-zinc-500">{project.subtitle}</p>
          </div>
          <button type="button" className="flex size-8 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-white/5 hover:text-white" aria-label={`More options for ${project.title}`}>
            <MoreHorizontal className="size-4" />
          </button>
        </div>
        <div className="mt-2 flex items-center gap-2 text-[11px] text-zinc-500">
          <span>{project.date}</span>
          <span className="size-1 rounded-full bg-zinc-700" />
          <span className={project.status === 'Published' ? 'text-emerald-400' : 'text-amber-300'}>{project.status}</span>
        </div>
      </div>
    </article>
  )
}

function EmptyState({ query, clear }: { query: string; clear: () => void }) {
  return (
    <div className="col-span-full flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.015] px-6 text-center">
      <div className="flex size-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
        <Search className="size-5 text-zinc-500" />
      </div>
      <h3 className="mt-4 text-sm font-semibold">No results for "{query}"</h3>
      <p className="mt-1 text-xs text-zinc-500">Try another name or clear your current filters.</p>
      <button type="button" onClick={clear} className="mt-5 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-white/5">Clear filters</button>
    </div>
  )
}

function StudioPage() {
  const { kind: routeKind } = useParams()
  const navigate = useNavigate()
  const kind: SampleModelKind =
    routeKind === 'robot' || routeKind === 'tower' ? routeKind : 'chair'
  const labels: Record<SampleModelKind, string> = {
    chair: 'Luma Lounge',
    robot: 'Nebula Explorer',
    tower: 'Glass Haven',
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-violet-300">Model workspace</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">{labels[kind]}</h1>
        </div>
        <div className="flex gap-2">
          {(['chair', 'robot', 'tower'] as SampleModelKind[]).map((item) => (
            <button
              type="button"
              key={item}
              onClick={() => navigate(`/dashboard/studio/${item}`)}
              className={`rounded-lg border px-3 py-2 text-xs font-medium ${kind === item ? 'border-violet-400/40 bg-violet-500/15 text-violet-200' : 'border-white/[0.07] text-zinc-400 hover:text-white'}`}
            >
              {item === 'chair' ? 'Chair' : item === 'robot' ? 'Robot' : 'Tower'}
            </button>
          ))}
        </div>
      </div>
      <ModelViewport
        className="mt-6 h-[520px] w-full"
        modelKind={kind}
        showTitle
      />
    </div>
  )
}

function CreateModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [created, setCreated] = useState(false)
  useEffect(() => setCreated(false), [open])
  if (!open) return null

  const submit = (event: FormEvent) => {
    event.preventDefault()
    setCreated(true)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 px-4 backdrop-blur-md" role="dialog" aria-modal="true" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111116] p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-400">New model</p>
            <h2 className="mt-2 text-xl font-semibold">Create a 3D model</h2>
          </div>
          <button type="button" onClick={onClose} className="flex size-9 items-center justify-center rounded-lg text-zinc-500 hover:bg-white/5 hover:text-white" aria-label="Close"><X className="size-4" /></button>
        </div>
        {created ? (
          <div className="py-9 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-500/10 text-emerald-300"><Sparkles className="size-5" /></div>
            <h3 className="mt-4 font-semibold">Generation started</h3>
            <p className="mt-2 text-sm text-zinc-500">Your new model is being prepared.</p>
            <button type="button" onClick={onClose} className="mt-6 h-10 w-full rounded-lg bg-white text-sm font-semibold text-zinc-950">Done</button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="block text-xs font-medium text-zinc-400">Model name
              <input required placeholder="Untitled model" className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-black/20 px-3 text-sm text-white outline-none focus:border-violet-400/50" />
            </label>
            <label className="block text-xs font-medium text-zinc-400">Describe it
              <textarea required rows={4} placeholder="A compact ceramic speaker with soft rounded edges..." className="mt-2 w-full resize-none rounded-lg border border-white/10 bg-black/20 px-3 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-violet-400/50" />
            </label>
            <button type="submit" className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-white text-sm font-semibold text-zinc-950 hover:bg-violet-100"><Sparkles className="size-4" />Generate model</button>
          </form>
        )}
      </div>
    </div>
  )
}

function Overview({ setCreateOpen }: { setCreateOpen: (open: boolean) => void }) {
  const navigate = useNavigate()
  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-zinc-500">Friday, November 20</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Welcome back, Alex</h1>
        </div>
        <button type="button" onClick={() => setCreateOpen(true)} className="flex h-11 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-zinc-950 transition hover:bg-violet-100"><Plus className="size-4" />Create new model</button>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ['Models', '12', '+2 this month'],
          ['Projects', '6', '2 in progress'],
          ['Views', '8.4k', '+18% this week'],
          ['Downloads', '1,204', '+9% this week'],
        ].map(([label, value, detail], index) => (
          <article key={label} className="rounded-xl border border-white/[0.07] bg-[#101015] p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-zinc-500">{label}</p>
              <span className={`size-2 rounded-full ${index === 1 ? 'bg-violet-400' : 'bg-zinc-700'}`} />
            </div>
            <p className="mt-3 text-2xl font-semibold tracking-tight">{value}</p>
            <p className="mt-1 text-[11px] text-zinc-500">{detail}</p>
          </article>
        ))}
      </div>

      <section className="mt-9">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent projects</h2>
          <NavLink to="/dashboard/projects" className="text-xs text-violet-300 hover:text-violet-200">View all</NavLink>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, 3).map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onOpen={() => navigate(`/dashboard/studio/${project.shape === 'chair' || project.shape === 'phone' ? 'chair' : project.shape === 'tower' || project.shape === 'arch' ? 'tower' : 'robot'}`)}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

function Projects({ search }: { search: string }) {
  const navigate = useNavigate()
  const [status, setStatus] = useState<'All' | 'Published' | 'Draft'>('All')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const filtered = useMemo(() => projects.filter((project) =>
    (status === 'All' || project.status === status) &&
    `${project.title} ${project.subtitle} ${project.category}`.toLowerCase().includes(search.toLowerCase())
  ), [search, status])

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="text-sm text-zinc-500">{projects.length} projects</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">Recent projects</h1></div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-white/[0.07] p-1">
            <button type="button" onClick={() => setView('grid')} className={`flex size-8 items-center justify-center rounded-md ${view === 'grid' ? 'bg-white/10 text-white' : 'text-zinc-500'}`} aria-label="Grid view"><Grid2X2 className="size-4" /></button>
            <button type="button" onClick={() => setView('list')} className={`flex size-8 items-center justify-center rounded-md ${view === 'list' ? 'bg-white/10 text-white' : 'text-zinc-500'}`} aria-label="List view"><List className="size-4" /></button>
          </div>
        </div>
      </div>
      <div className="mt-7 flex flex-wrap items-center gap-2">
        {(['All', 'Published', 'Draft'] as const).map((item) => <button type="button" key={item} onClick={() => setStatus(item)} className={`rounded-lg px-3 py-2 text-xs font-medium ${status === item ? 'bg-white text-zinc-950' : 'border border-white/[0.07] text-zinc-400 hover:text-white'}`}>{item}</button>)}
      </div>
      <div className={`mt-5 ${view === 'grid' ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3' : 'flex flex-col gap-3'}`}>
        {filtered.length ? filtered.map((project) => view === 'grid'
          ? <ProjectCard key={project.id} project={project} onOpen={() => navigate(`/dashboard/studio/${project.shape === 'chair' || project.shape === 'phone' ? 'chair' : project.shape === 'tower' || project.shape === 'arch' ? 'tower' : 'robot'}`)} />
          : <div key={project.id} className="flex items-center gap-4 rounded-xl border border-white/[0.07] bg-[#101015] p-3"><div className="w-28 shrink-0"><Thumbnail project={project} /></div><div className="min-w-0 flex-1"><h3 className="text-sm font-semibold">{project.title}</h3><p className="mt-1 text-xs text-zinc-500">{project.subtitle}</p><p className="mt-2 text-[11px] text-zinc-500">{project.date}</p></div><span className={`mr-3 text-xs ${project.status === 'Published' ? 'text-emerald-400' : 'text-amber-300'}`}>{project.status}</span></div>
        ) : <EmptyState query={search || status} clear={() => setStatus('All')} />}
      </div>
    </div>
  )
}

function Models({ search }: { search: string }) {
  const navigate = useNavigate()
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('Newest')
  const filtered = useMemo(() => projects.filter((project) =>
    (category === 'All' || project.category === category) &&
    `${project.title} ${project.subtitle}`.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => sort === 'Newest' ? b.id - a.id : sort === 'Oldest' ? a.id - b.id : a.title.localeCompare(b.title)), [category, search, sort])

  return (
    <div>
      <div className="flex items-end justify-between gap-4"><div><p className="text-sm text-zinc-500">{projects.length} models</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">My models</h1></div></div>
      <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {['All', 'Character', 'Environment', 'Product'].map((item) => <button type="button" key={item} onClick={() => setCategory(item)} className={`rounded-lg px-3 py-2 text-xs font-medium ${category === item ? 'bg-white text-zinc-950' : 'border border-white/[0.07] text-zinc-400'}`}>{item}</button>)}
        </div>
        <label className="relative flex items-center gap-2 text-xs text-zinc-500"><SlidersHorizontal className="size-3.5" />
          <select value={sort} onChange={(event) => setSort(event.target.value)} className="appearance-none rounded-lg border border-white/[0.07] bg-[#101015] py-2 pl-3 pr-8 text-xs text-zinc-300 outline-none"><option>Newest</option><option>Oldest</option><option>Name</option></select><ChevronDown className="pointer-events-none absolute right-2 size-3.5" />
        </label>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length ? filtered.map((project) => <ProjectCard key={project.id} project={project} onOpen={() => navigate(`/dashboard/studio/${project.shape === 'chair' || project.shape === 'phone' ? 'chair' : project.shape === 'tower' || project.shape === 'arch' ? 'tower' : 'robot'}`)} />) : <EmptyState query={search || category} clear={() => setCategory('All')} />}
      </div>
    </div>
  )
}

function Explore({ search }: { search: string }) {
  const navigate = useNavigate()
  const filtered = projects.filter((project) => `${project.title} ${project.subtitle} ${project.category}`.toLowerCase().includes(search.toLowerCase()))
  return (
    <div>
      <div><p className="text-sm text-violet-300">Community gallery</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">Explore</h1><p className="mt-3 max-w-xl text-sm leading-6 text-zinc-500">Discover production-ready models and creative experiments from the Modelly community.</p></div>
      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length ? [...filtered].reverse().map((project) => <ProjectCard key={project.id} project={project} onOpen={() => navigate(`/dashboard/studio/${project.shape === 'chair' || project.shape === 'phone' ? 'chair' : project.shape === 'tower' || project.shape === 'arch' ? 'tower' : 'robot'}`)} />) : <EmptyState query={search} clear={() => undefined} />}
      </div>
    </div>
  )
}

function Settings() {
  const [emailUpdates, setEmailUpdates] = useState(true)
  const [publicProfile, setPublicProfile] = useState(true)
  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
      <section className="mt-7 rounded-xl border border-white/[0.07] bg-[#101015] p-5 sm:p-6">
        <h2 className="text-sm font-semibold">Profile</h2>
        <div className="mt-5 flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-blue-400 text-lg font-semibold">AP</div>
          <button type="button" className="flex h-9 items-center gap-2 rounded-lg border border-white/10 px-3 text-xs font-medium text-zinc-300 hover:bg-white/5"><Upload className="size-3.5" />Change photo</button>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="text-xs text-zinc-500">Display name<input defaultValue="Alex Parker" className="mt-2 h-11 w-full rounded-lg border border-white/[0.08] bg-black/20 px-3 text-sm text-white outline-none" /></label>
          <label className="text-xs text-zinc-500">Email<input defaultValue="alex@modelly.demo" className="mt-2 h-11 w-full rounded-lg border border-white/[0.08] bg-black/20 px-3 text-sm text-white outline-none" /></label>
        </div>
      </section>
      <section className="mt-4 rounded-xl border border-white/[0.07] bg-[#101015] p-5 sm:p-6">
        <h2 className="text-sm font-semibold">Preferences</h2>
        {[
          ['Email updates', 'Get occasional news and product updates', emailUpdates, setEmailUpdates],
          ['Public profile', 'Allow others to view your published models', publicProfile, setPublicProfile],
        ].map(([title, copy, value, setter]) => (
          <div key={String(title)} className="mt-5 flex items-center justify-between gap-4 border-t border-white/[0.06] pt-5 first:border-0 first:pt-0">
            <div><p className="text-sm font-medium">{String(title)}</p><p className="mt-1 text-xs text-zinc-500">{String(copy)}</p></div>
            <button type="button" onClick={() => (setter as (value: boolean) => void)(!(value as boolean))} className={`relative h-6 w-11 rounded-full transition ${value ? 'bg-violet-500' : 'bg-zinc-700'}`} aria-pressed={Boolean(value)}><span className={`absolute top-1 size-4 rounded-full bg-white transition ${value ? 'left-6' : 'left-1'}`} /></button>
          </div>
        ))}
      </section>
    </div>
  )
}

export function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [search, setSearch] = useState('')
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => setSidebarOpen(false), [location.pathname])

  return (
    <div className="min-h-screen bg-[#09090d] text-white">
      {sidebarOpen && <button type="button" className="fixed inset-0 z-40 bg-black/70 lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close navigation" />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[232px] flex-col border-r border-white/[0.07] bg-[#0d0d12] transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button type="button" onClick={() => navigate('/dashboard')} className="flex h-[72px] items-center gap-2.5 px-5 text-left">
          <span className="flex size-8 items-center justify-center rounded-lg border border-violet-400/30 bg-violet-500/10"><Box className="size-4 text-violet-300" /></span>
          <span className="text-[15px] font-semibold">Modelly.me</span>
        </button>
        <nav className="mt-3 flex-1 px-3" aria-label="Dashboard navigation">
          {navItems.map((item) => <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `mb-1 flex h-10 items-center gap-3 rounded-lg px-3 text-sm transition ${isActive ? 'bg-white/[0.08] text-white' : 'text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200'}`}><item.icon className="size-4" /><span>{item.label}</span></NavLink>)}
        </nav>
        <div className="border-t border-white/[0.07] p-3">
          <button type="button" onClick={() => navigate('/dashboard/settings')} className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-white/[0.04]">
            <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-blue-400 text-xs font-semibold">AP</div>
            <div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold">Alex Parker</p><p className="mt-0.5 truncate text-[11px] text-zinc-500">Personal workspace</p></div>
            <ChevronDown className="size-3.5 text-zinc-600" />
          </button>
        </div>
      </aside>

      <div className="lg:pl-[232px]">
        <header className="sticky top-0 z-30 flex h-[72px] items-center gap-3 border-b border-white/[0.07] bg-[#09090d]/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <button type="button" onClick={() => setSidebarOpen(true)} className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-white/[0.07] lg:hidden" aria-label="Open navigation"><Menu className="size-5" /></button>
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-600" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search projects and models..." className="h-10 w-full rounded-lg border border-white/[0.07] bg-white/[0.03] pl-10 pr-16 text-sm outline-none transition placeholder:text-zinc-600 focus:border-violet-400/30" />
            <span className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-white/[0.08] px-1.5 py-0.5 text-[10px] text-zinc-600 sm:block">⌘ K</span>
          </div>
          <button type="button" className="ml-auto flex size-10 shrink-0 items-center justify-center rounded-lg border border-white/[0.07] text-zinc-400 hover:text-white" aria-label="Notifications"><Bell className="size-4" /></button>
          <button type="button" onClick={() => setCreateOpen(true)} className="hidden h-10 items-center gap-2 rounded-lg bg-white px-3 text-xs font-semibold text-zinc-950 sm:flex"><Plus className="size-4" />Create</button>
        </header>
        <main className="mx-auto max-w-[1320px] px-4 py-7 sm:px-6 sm:py-8 lg:px-8">
          <Routes>
            <Route index element={<Overview setCreateOpen={setCreateOpen} />} />
            <Route path="projects" element={<Projects search={search} />} />
            <Route path="models" element={<Models search={search} />} />
            <Route path="studio/:kind" element={<StudioPage />} />
            <Route path="studio" element={<StudioPage />} />
            <Route path="explore" element={<Explore search={search} />} />
            <Route path="settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
      <CreateModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  )
}
