import { cn } from '../../utils/format.js'

const styles = {
  free: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  paid: 'bg-amber-400/15 text-amber-300 border-amber-400/30',
  published: 'bg-brand-500/15 text-brand-200 border-brand-400/30',
  draft: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30',
  paid_tx: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  pending: 'bg-amber-400/15 text-amber-200 border-amber-400/30',
  failed: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  refunded: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  active: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  inactive: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
}

export default function Badge({ tone = 'draft', children, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        styles[tone] || styles.draft,
        className,
      )}
    >
      {children}
    </span>
  )
}
