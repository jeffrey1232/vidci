export default function EmptyState({ title, description, action }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 px-6 py-14 text-center">
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      {description ? <p className="mx-auto mt-2 max-w-md text-sm text-zinc-400">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}
