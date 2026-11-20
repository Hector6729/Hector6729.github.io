import { Box, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'

type LayoutProps = {
  onSignIn: () => void
}

export function Layout({ onSignIn }: LayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const navigateTo = (id: string) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const navItems = [
    ['Explore', 'community'],
    ['Features', 'features'],
    ['Pricing', 'pricing'],
  ] as const

  return (
    <div className="min-h-screen bg-[#09090D] text-white">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.07] bg-[#09090D]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1240px] items-center justify-between px-5 lg:px-8">
          <button
            type="button"
            onClick={() => navigateTo('top')}
            className="flex items-center gap-2.5 text-[15px] font-semibold tracking-tight"
            aria-label="Modelly.me home"
          >
            <span className="flex size-8 items-center justify-center rounded-lg border border-violet-400/30 bg-violet-500/10">
              <Box aria-hidden="true" className="size-4 text-violet-300" />
            </span>
            <span>Modelly.me</span>
          </button>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
            {navItems.map(([label, id]) => (
              <button
                key={id}
                type="button"
                onClick={() => navigateTo(id)}
                className="text-sm text-zinc-400 transition hover:text-white"
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <button
              type="button"
              onClick={onSignIn}
              className="px-3 py-2 text-sm text-zinc-300 transition hover:text-white"
            >
              Sign in
            </button>
            <Link
              to="/dashboard"
              className="rounded-lg border border-white/10 bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-violet-100"
            >
              Get started
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex size-10 items-center justify-center rounded-lg border border-white/10 md:hidden"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {menuOpen && (
          <nav className="border-t border-white/[0.07] bg-[#09090D] px-5 py-5 md:hidden">
            <div className="flex flex-col gap-1">
              {navItems.map(([label, id]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => navigateTo(id)}
                  className="rounded-lg px-3 py-3 text-left text-sm text-zinc-300 hover:bg-white/5"
                >
                  {label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false)
                  onSignIn()
                }}
                className="mt-2 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-zinc-950"
              >
                Sign in
              </button>
            </div>
          </nav>
        )}
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  )
}
