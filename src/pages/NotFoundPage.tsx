import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-72px)] max-w-xl items-center justify-center px-5 text-center">
      <div>
      <p className="text-sm font-medium text-violet-400">404</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight">Page not found</h1>
      <p className="mt-4 text-zinc-400">The page you requested doesn't exist.</p>
      <Link
        to="/"
        className="mt-6 inline-flex rounded-lg bg-white px-4 py-3 text-sm font-semibold text-zinc-950"
      >
        Return home
      </Link>
      </div>
    </section>
  )
}
