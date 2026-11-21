import type { Feature } from "../lib/mockData";

const MAX = 0.8; // ขอบเขตแกน Y ทั้งบวกและลบ
const TICKS = [0.8, 0.4, 0, -0.4, -0.8];

const fmt = (v: number) => (v > 0 ? "+" : v < 0 ? "−" : "") + Math.abs(v).toFixed(2);

export function FeatureImpactChart({ features }: { features: Feature[] }) {
  return (
    <div>
      <ul className="mb-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-ink/75">
        <li className="flex items-center gap-2">
          <span className="inline-block size-3 rounded-sm bg-leaf" /> ดันราคาขึ้น
        </li>
        <li className="flex items-center gap-2">
          <span className="inline-block size-3 rounded-sm bg-clay" /> กดราคาลง
        </li>
      </ul>

      <div className="overflow-x-auto pb-1">
        <div className="min-w-[720px]">
          <div className="grid grid-cols-[64px_1fr] gap-x-2">
            {/* แกน Y */}
            <div className="relative h-72" aria-hidden>
              {TICKS.map((t, i) => (
                <span
                  key={t}
                  className="absolute right-1 -translate-y-1/2 text-xs tabular-nums text-ink/55"
                  style={{ top: `${i * 25}%` }}
                >
                  {t === 0 ? "0" : fmt(t)}
                </span>
              ))}
            </div>

            {/* พื้นที่กราฟ */}
            <div className="relative h-72 rounded-xl bg-paper/60">
              {TICKS.map((t, i) => (
                <div
                  key={t}
                  className={`absolute inset-x-0 border-t ${t === 0 ? "border-ink/40" : "border-line"}`}
                  style={{ top: `${i * 25}%` }}
                />
              ))}

              <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${features.length}, 1fr)` }}>
                {features.map((ft) => {
                  const pos = ft.impact >= 0;
                  const h = (Math.abs(ft.impact) / MAX) * 50;
                  return (
                    <div key={ft.name} className="group relative">
                      <div
                        className={`bar absolute left-1/2 w-[52%] -translate-x-1/2 rounded-md transition-[filter] group-hover:brightness-110 ${
                          pos ? "bg-leaf bar-up" : "bg-clay bar-down"
                        }`}
                        style={pos ? { bottom: "50%", height: `${h}%` } : { top: "50%", height: `${h}%` }}
                      />
                      <span
                        className="absolute left-1/2 -translate-x-1/2 text-xs font-semibold tabular-nums text-ink/80"
                        style={
                          pos
                            ? { bottom: `calc(50% + ${h}% + 4px)` }
                            : { top: `calc(50% + ${h}% + 4px)` }
                        }
                      >
                        {fmt(ft.impact)}
                      </span>

                      {/* tooltip */}
                      <div className="pointer-events-none absolute left-1/2 top-2 z-10 w-44 -translate-x-1/2 rounded-xl border border-line bg-white p-3 text-xs leading-5 text-ink/80 opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                        <div className="font-medium text-ink">{ft.name}</div>
                        <div className={pos ? "text-leaf" : "text-clay"}>
                          {fmt(ft.impact)}
                        </div>
                        <div className="mt-1">{ft.note}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ป้ายชื่อ feature */}
            <div />
            <div className="mt-3 grid" style={{ gridTemplateColumns: `repeat(${features.length}, 1fr)` }}>
              {features.map((ft) => (
                <div key={ft.name} className="px-1 text-center text-sm leading-5 text-ink/80">
                  {ft.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <p className="mt-4 text-xs text-ink/55">แกน Y: ค่าน้ำหนักของแต่ละ feature (standardized coefficient) — ยิ่งห่างจาก 0 ยิ่งส่งผลต่อราคามาก ค่าบวกดันราคาขึ้น ค่าลบกดราคาลง</p>
    </div>
  );
}
