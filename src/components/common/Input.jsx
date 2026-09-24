import { cn } from '../../utils/format.js'

export default function Input({ label, error, className, id, ...props }) {
  const inputId = id || props.name
  return (
    <label className="block space-y-1.5">
      {label ? (
        <span className="text-sm font-medium text-ink-700">{label}</span>
      ) : null}
      <input
        id={inputId}
        className={cn(
          'h-11 w-full rounded-2xl border-2 border-purple-200 bg-white/80 px-3 text-sm text-ink-900 outline-none transition placeholder:text-purple-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-200',
          error ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200' : '',
          className,
        )}
        {...props}
      />
      {error ? <span className="text-xs text-rose-500 font-medium">{error}</span> : null}
    </label>
  )
}

export function Textarea({ label, error, className, ...props }) {
  return (
    <label className="block space-y-1.5">
      {label ? <span className="text-sm font-medium text-ink-700">{label}</span> : null}
      <textarea
        className={cn(
          'min-h-28 w-full rounded-2xl border-2 border-purple-200 bg-white/80 px-3 py-2 text-sm text-ink-900 outline-none transition placeholder:text-purple-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-200',
          error ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200' : '',
          className,
        )}
        {...props}
      />
      {error ? <span className="text-xs text-rose-500 font-medium">{error}</span> : null}
    </label>
  )
}

export function Select({ label, error, children, className, ...props }) {
  return (
    <label className="block space-y-1.5">
      {label ? <span className="text-sm font-medium text-ink-700">{label}</span> : null}
      <select
        className={cn(
          'h-11 w-full rounded-2xl border-2 border-purple-200 bg-white/80 px-3 text-sm text-ink-900 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-200',
          error ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200' : '',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {error ? <span className="text-xs text-rose-500 font-medium">{error}</span> : null}
    </label>
  )
}
