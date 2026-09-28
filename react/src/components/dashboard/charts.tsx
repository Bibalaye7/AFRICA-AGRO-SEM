import { useMemo, useRef, useState } from 'react'

export const formatTonnes = (kg: number) =>
  kg >= 1000
    ? `${(kg / 1000).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} t`
    : `${Math.round(kg).toLocaleString('fr-FR')} kg`

// ---------- Barres de progression : distribué / stock, par ligne ----------

type ProgressRow = { label: string; value: number; total: number }

export function ProgressBars({ rows, emptyText }: { rows: ProgressRow[]; emptyText: string }) {
  if (rows.length === 0) return <p className="text-sm text-gray-500 py-6 text-center">{emptyText}</p>
  return (
    <ul className="space-y-4">
      {rows.map((r) => {
        const pct = r.total > 0 ? Math.min(100, (r.value / r.total) * 100) : 0
        return (
          <li key={r.label}>
            <div className="flex justify-between text-sm mb-1.5 gap-3">
              <span className="font-medium text-gray-900">{r.label}</span>
              <span className="text-gray-600 tabular-nums">
                {formatTonnes(r.value)} / {formatTonnes(r.total)} · <strong className="text-gray-900">{Math.round(pct)} %</strong>
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-[#e6eee7] overflow-hidden" role="img" aria-label={`${r.label} : ${Math.round(pct)} % distribué`}>
              <div className="h-full rounded-full bg-agro-green" style={{ width: `${pct}%` }} />
            </div>
          </li>
        )
      })}
    </ul>
  )
}

// ---------- Barres horizontales (une seule série) ----------

type BarRow = { label: string; value: number; detail?: string }

export function HorizontalBars({ rows, emptyText }: { rows: BarRow[]; emptyText: string }) {
  const [hover, setHover] = useState<string | null>(null)
  const max = Math.max(1, ...rows.map((r) => r.value))
  if (rows.length === 0) return <p className="text-sm text-gray-500 py-6 text-center">{emptyText}</p>
  return (
    <ul className="space-y-2.5">
      {rows.map((r) => (
        <li
          key={r.label}
          className="grid grid-cols-[7rem_1fr_auto] items-center gap-3 text-sm rounded-md -mx-1 px-1 py-0.5 hover:bg-gray-50"
          onMouseEnter={() => setHover(r.label)}
          onMouseLeave={() => setHover(null)}
          title={r.detail ? `${r.label} : ${formatTonnes(r.value)} · ${r.detail}` : undefined}
        >
          <span className="truncate text-gray-700">{r.label}</span>
          <span className="h-4 flex items-center">
            <span
              className={`h-full rounded-r ${hover === r.label ? 'bg-[#2d6336]' : 'bg-agro-green'}`}
              style={{ width: `${Math.max(1.5, (r.value / max) * 100)}%` }}
            />
          </span>
          <span className="tabular-nums text-gray-900 font-medium text-right whitespace-nowrap">
            {formatTonnes(r.value)}
            {r.detail && <span className="block text-xs font-normal text-gray-500">{r.detail}</span>}
          </span>
        </li>
      ))}
    </ul>
  )
}

// ---------- Courbe cumulée dans le temps ----------

type Point = { date: string; value: number }

const W = 640
const H = 220
const PAD = { top: 16, right: 16, bottom: 28, left: 52 }

export function CumulativeChart({ points }: { points: Point[] }) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  const geometry = useMemo(() => {
    if (points.length === 0) return null
    const times = points.map((p) => new Date(p.date).getTime())
    const t0 = times[0]
    const t1 = Math.max(times[times.length - 1], t0 + 86400000)
    const max = Math.max(...points.map((p) => p.value)) || 1
    const niceMax = niceCeil(max)
    const x = (t: number) => PAD.left + ((t - t0) / (t1 - t0)) * (W - PAD.left - PAD.right)
    const y = (v: number) => PAD.top + (1 - v / niceMax) * (H - PAD.top - PAD.bottom)
    const xy = points.map((p, i) => [x(times[i]), y(p.value)] as const)
    const line = xy.map(([px, py], i) => `${i ? 'L' : 'M'}${px.toFixed(1)},${py.toFixed(1)}`).join(' ')
    const area = `${line} L${xy[xy.length - 1][0].toFixed(1)},${y(0)} L${xy[0][0].toFixed(1)},${y(0)} Z`
    const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => ({ v: niceMax * f, y: y(niceMax * f) }))
    const dateTicks = [t0, t0 + (t1 - t0) / 2, t1].map((t) => ({ t, x: x(t) }))
    return { xy, line, area, ticks, dateTicks }
  }, [points])

  if (!geometry) return <p className="text-sm text-gray-500 py-6 text-center">Aucune distribution enregistrée pour le moment.</p>

  const handleMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = svgRef.current!.getBoundingClientRect()
    const mx = ((e.clientX - rect.left) / rect.width) * W
    let best = 0
    geometry.xy.forEach(([px], i) => {
      if (Math.abs(px - mx) < Math.abs(geometry.xy[best][0] - mx)) best = i
    })
    setHoverIndex(best)
  }

  const hovered = hoverIndex != null ? { p: points[hoverIndex], xy: geometry.xy[hoverIndex] } : null
  const shortDate = (d: string | number) => new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        role="img"
        aria-label="Quantité cumulée de semences distribuées au fil de la campagne"
        onMouseMove={handleMove}
        onMouseLeave={() => setHoverIndex(null)}
      >
        {geometry.ticks.map((t) => (
          <g key={t.v}>
            <line x1={PAD.left} x2={W - PAD.right} y1={t.y} y2={t.y} stroke={t.v === 0 ? '#c3c2b7' : '#e1e0d9'} strokeWidth={1} />
            <text x={PAD.left - 8} y={t.y + 4} textAnchor="end" fontSize={11} fill="#898781" className="tabular-nums">
              {formatTonnes(t.v)}
            </text>
          </g>
        ))}
        {geometry.dateTicks.map((d, i) => (
          <text key={d.t} x={d.x} y={H - 8} textAnchor={i === 0 ? 'start' : i === 2 ? 'end' : 'middle'} fontSize={11} fill="#898781">
            {shortDate(d.t)}
          </text>
        ))}
        <path d={geometry.area} fill="#3A7D44" opacity={0.12} />
        <path d={geometry.line} fill="none" stroke="#3A7D44" strokeWidth={2} strokeLinejoin="round" />
        {hovered && (
          <g>
            <line x1={hovered.xy[0]} x2={hovered.xy[0]} y1={PAD.top} y2={H - PAD.bottom} stroke="#898781" strokeDasharray="3 3" />
            <circle cx={hovered.xy[0]} cy={hovered.xy[1]} r={5} fill="#3A7D44" stroke="#fff" strokeWidth={2} />
          </g>
        )}
      </svg>
      {hovered && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-md bg-gray-900 text-white text-xs px-2.5 py-1.5 shadow whitespace-nowrap"
          style={{ left: `${(hovered.xy[0] / W) * 100}%`, top: `${(hovered.xy[1] / H) * 100}%`, marginTop: -10 }}
        >
          <span className="text-white/70">{shortDate(hovered.p.date)}</span> · <strong>{formatTonnes(hovered.p.value)}</strong> cumulés
        </div>
      )}
    </div>
  )
}

function niceCeil(v: number) {
  const exp = Math.pow(10, Math.floor(Math.log10(v)))
  const f = v / exp
  const nice = f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10
  return nice * exp
}
