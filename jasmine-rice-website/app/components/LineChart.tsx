"use client";

import { useId, useState } from "react";

export type Series = {
  name: string;
  color: string;
  values: number[];
  dashed?: boolean;
};

type Props = {
  series: Series[];
  xLabels: string[];
  /** index ของจุดบนแกน X ที่ต้องการแสดงตัวเลข (ค่าเริ่มต้น: ทุกจุด) */
  xTickIndices?: number[];
  yMin: number;
  yMax: number;
  yStep: number;
  formatY?: (v: number) => string;
  formatTip?: (v: number) => string;
  xAxisTitle: string;
  yAxisTitle: string;
  tipTitle?: (label: string) => string;
  smooth?: boolean;
  area?: boolean;
  dots?: boolean;
  ariaLabel: string;
};

type Pt = { x: number; y: number };

const W = 480;
const H = 340;
const M = { top: 16, right: 16, bottom: 52, left: 72 };
const PLOT_W = W - M.left - M.right;
const PLOT_H = H - M.top - M.bottom;

const f = (n: number) => n.toFixed(1);

function linePath(pts: Pt[]) {
  return pts.map((p, i) => `${i ? "L" : "M"}${f(p.x)} ${f(p.y)}`).join(" ");
}

function smoothPath(pts: Pt[]) {
  if (pts.length < 3) return linePath(pts);
  let d = `M${f(pts[0].x)} ${f(pts[0].y)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const lo = Math.min(p1.y, p2.y);
    const hi = Math.max(p1.y, p2.y);
    const c1y = Math.min(hi, Math.max(lo, p1.y + (p2.y - p0.y) / 6));
    const c2y = Math.min(hi, Math.max(lo, p2.y - (p3.y - p1.y) / 6));
    d += ` C${f(p1.x + (p2.x - p0.x) / 6)} ${f(c1y)} ${f(p2.x - (p3.x - p1.x) / 6)} ${f(c2y)} ${f(p2.x)} ${f(p2.y)}`;
  }
  return d;
}

export function LineChart({
  series,
  xLabels,
  xTickIndices,
  yMin,
  yMax,
  yStep,
  formatY = (v) => v.toLocaleString("en-US"),
  formatTip = (v) => v.toLocaleString("en-US"),
  xAxisTitle,
  yAxisTitle,
  tipTitle = (l) => l,
  smooth = false,
  area = false,
  dots = false,
  ariaLabel,
}: Props) {
  const uid = useId().replace(/:/g, "");
  const [active, setActive] = useState<number | null>(null);
  const n = xLabels.length;

  const sx = (i: number) => M.left + (n === 1 ? 0 : (i / (n - 1)) * PLOT_W);
  const sy = (v: number) => M.top + (1 - (v - yMin) / (yMax - yMin)) * PLOT_H;

  const yTicks: number[] = [];
  for (let v = yMin; v <= yMax + 1e-9; v += yStep) yTicks.push(Number(v.toFixed(6)));
  const xTicks = xTickIndices ?? xLabels.map((_, i) => i);

  const paths = series.map((s) => {
    const pts = s.values.map((v, i) => ({ x: sx(i), y: sy(v) }));
    return { pts, d: smooth ? smoothPath(pts) : linePath(pts) };
  });

  function onMove(e: React.PointerEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const xv = ((e.clientX - rect.left) / rect.width) * W;
    const idx = Math.round(((xv - M.left) / PLOT_W) * (n - 1));
    setActive(Math.max(0, Math.min(n - 1, idx)));
  }

  const tipX = active === null ? 0 : sx(active);
  const tipY =
    active === null ? 0 : Math.min(...series.map((s) => sy(s.values[active])));

  return (
    <div>
      {series.length > 1 && (
        <ul className="mb-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink/75">
          {series.map((s) => (
            <li key={s.name} className="flex items-center gap-2">
              <svg width="22" height="8" aria-hidden>
                <line
                  x1="0" y1="4" x2="22" y2="4"
                  stroke={s.color} strokeWidth="2.5" strokeLinecap="round"
                  strokeDasharray={s.dashed ? "4 4" : undefined}
                />
              </svg>
              {s.name}
            </li>
          ))}
        </ul>
      )}

      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full touch-pan-y select-none"
          role="img"
          aria-label={ariaLabel}
          onPointerMove={onMove}
          onPointerDown={onMove}
          onPointerLeave={() => setActive(null)}
        >
          <defs>
            {series.map((s, i) => (
              <linearGradient key={s.name} id={`${uid}-g${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity="0.22" />
                <stop offset="100%" stopColor={s.color} stopOpacity="0" />
              </linearGradient>
            ))}
          </defs>

          {/* grid + y ticks */}
          {yTicks.map((v) => (
            <g key={v}>
              <line
                x1={M.left} x2={W - M.right} y1={sy(v)} y2={sy(v)}
                stroke="var(--color-line)" strokeWidth="1"
              />
              <text
                x={M.left - 10} y={sy(v)} textAnchor="end" dominantBaseline="middle"
                fontSize="12" fill="currentColor" opacity="0.6"
              >
                {formatY(v)}
              </text>
            </g>
          ))}

          {/* x ticks */}
          {xTicks.map((i) => (
            <text
              key={i} x={sx(i)} y={H - M.bottom + 20} textAnchor="middle"
              fontSize="12" fill="currentColor" opacity="0.6"
            >
              {xLabels[i]}
            </text>
          ))}

          {/* axis titles */}
          <text x={M.left + PLOT_W / 2} y={H - 6} textAnchor="middle" fontSize="12.5" fill="currentColor" opacity="0.8">
            {xAxisTitle}
          </text>
          <text
            transform={`translate(13 ${M.top + PLOT_H / 2}) rotate(-90)`}
            textAnchor="middle" fontSize="12.5" fill="currentColor" opacity="0.8"
          >
            {yAxisTitle}
          </text>

          {/* area */}
          {area &&
            paths.map((p, i) => (
              <path
                key={`a${i}`}
                d={`${p.d} L${f(p.pts[p.pts.length - 1].x)} ${f(M.top + PLOT_H)} L${f(p.pts[0].x)} ${f(M.top + PLOT_H)} Z`}
                fill={`url(#${uid}-g${i})`}
              />
            ))}

          {/* lines */}
          {paths.map((p, i) => (
            <path
              key={`l${i}`}
              d={p.d}
              fill="none"
              stroke={series[i].color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={series[i].dashed ? "6 5" : undefined}
            />
          ))}

          {/* dots */}
          {dots &&
            paths.map((p, i) =>
              p.pts.map((pt, j) => (
                <circle
                  key={`${i}-${j}`} cx={pt.x} cy={pt.y} r="3.5"
                  fill="white" stroke={series[i].color} strokeWidth="2"
                />
              )),
            )}

          {/* hover crosshair */}
          {active !== null && (
            <g pointerEvents="none">
              <line
                x1={tipX} x2={tipX} y1={M.top} y2={M.top + PLOT_H}
                stroke="var(--color-ink)" strokeOpacity="0.25" strokeDasharray="3 3"
              />
              {series.map((s) => (
                <circle
                  key={s.name} cx={tipX} cy={sy(s.values[active])} r="5"
                  fill={s.color} stroke="white" strokeWidth="2"
                />
              ))}
            </g>
          )}
        </svg>

        {active !== null && (
          <div
            className="pointer-events-none absolute z-10 min-w-36 rounded-xl border border-line bg-white px-3 py-2 text-xs shadow-lg"
            style={{
              left: `${Math.min(80, Math.max(20, (tipX / W) * 100))}%`,
              top: `${(tipY / H) * 100}%`,
              transform: "translate(-50%, calc(-100% - 12px))",
            }}
          >
            <div className="mb-1 font-medium text-ink">{tipTitle(xLabels[active])}</div>
            {series.map((s) => (
              <div key={s.name} className="flex items-center justify-between gap-4 text-ink/80">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block size-2 rounded-full" style={{ background: s.color }} />
                  {s.name}
                </span>
                <span className="font-medium tabular-nums text-ink">{formatTip(s.values[active])}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
