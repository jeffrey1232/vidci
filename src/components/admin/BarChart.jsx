export default function BarChart({ data, height = 160 }) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div className="flex h-full items-end gap-2" style={{ height }}>
      {data.map((item) => (
        <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex h-full w-full items-end rounded-lg bg-white/5">
            <div
              className="w-full rounded-lg bg-gradient-to-t from-brand-700 to-brand-400"
              style={{ height: `${(item.value / max) * 100}%` }}
              title={`${item.label}: ${item.value}`}
            />
          </div>
          <span className="truncate text-[10px] text-zinc-400">{item.label}</span>
        </div>
      ))}
    </div>
  )
}
