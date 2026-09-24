export default function LineChart({ data, height = 180 }) {
  const width = 520
  const max = Math.max(...data.map((d) => d.value), 1)
  const points = data.map((d, i) => {
    const x = (i / Math.max(data.length - 1, 1)) * (width - 24) + 12
    const y = height - 28 - (d.value / max) * (height - 48)
    return `${x},${y}`
  })
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
      <polyline
        fill="none"
        stroke="#818cf8"
        strokeWidth="3"
        points={points.join(' ')}
      />
      {data.map((d, i) => {
        const x = (i / Math.max(data.length - 1, 1)) * (width - 24) + 12
        const y = height - 28 - (d.value / max) * (height - 48)
        return (
          <g key={d.label}>
            <circle cx={x} cy={y} r="4" fill="#fbbf24" />
            <text x={x} y={height - 8} textAnchor="middle" fill="#a1a1aa" fontSize="10">
              {d.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
