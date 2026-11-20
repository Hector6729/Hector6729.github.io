import { ArrowRight, X } from 'lucide-react'
import { useEffect, useState } from 'react'

type SignInDialogProps = {
  open: boolean
  onClose: () => void
}

export function SignInDialog({ open, onClose }: SignInDialogProps) {
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 px-5 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#111116] p-7 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-white/5 hover:text-white"
          aria-label="Close dialog"
        >
          <X className="size-4" />
        </button>
        {submitted ? (
          <div className="py-8 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-violet-400/30 bg-violet-500/10">
              <ArrowRight className="size-5 text-violet-300" />
            </div>
            <h2 id="dialog-title" className="mt-5 text-2xl font-semibold">
              Check your inbox
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              We sent you a secure sign-in link.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 h-11 w-full rounded-lg bg-white text-sm font-semibold text-zinc-950"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-400">
              Modelly.me
            </p>
            <h2 id="dialog-title" className="mt-3 text-2xl font-semibold">
              Start creating
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Enter your email to continue to your workspace.
            </p>
            <form
              className="mt-6"
              onSubmit={(event) => {
                event.preventDefault()
                setSubmitted(true)
              }}
            >
              <label htmlFor="email" className="text-xs font-medium text-zinc-400">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@company.com"
                className="mt-2 h-12 w-full rounded-lg border border-white/10 bg-black/20 px-4 text-sm outline-none transition placeholder:text-zinc-600 focus:border-violet-400/50"
              />
              <button
                type="submit"
                className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-white text-sm font-semibold text-zinc-950 transition hover:bg-violet-100"
              >
                Continue
                <ArrowRight className="size-4" />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
