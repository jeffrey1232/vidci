export default function StatCard({ icon: Icon, label, value, hint }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-400">{label}</p>
        {Icon ? (
          <span className="rounded-xl bg-brand-500/15 p-2 text-brand-300">
            <Icon size={18} />
          </span>
        ) : null}
      </div>
      <p className="mt-3 font-display text-2xl font-semibold">{value}</p>
      {hint ? <p className="mt-1 text-xs text-zinc-500">{hint}</p> : null}
    </div>
  )
}
