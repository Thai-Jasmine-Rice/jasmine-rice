"use client";

import { useState } from "react";
import { DATASET, SCHEMA } from "../lib/mockData";

const cols = SCHEMA.filter((c) => c.role !== "index");
const PAGE_SIZES = [10, 20, 50];

const fmt = (v: number, digits: number) =>
  v.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });

const stats = cols.map((_, i) => {
  const xs = DATASET.map((r) => r.values[i]);
  return {
    min: Math.min(...xs),
    max: Math.max(...xs),
    mean: xs.reduce((a, b) => a + b, 0) / xs.length,
  };
});

/** สร้างรายการเลขหน้า เช่น 1 … 4 5 6 … 19 */
function pageList(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set([1, total, current - 1, current, current + 1]);
  if (current <= 3) [2, 3, 4].forEach((n) => set.add(n));
  if (current >= total - 2) [total - 1, total - 2, total - 3].forEach((n) => set.add(n));
  const nums = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  nums.forEach((n, i) => {
    if (i > 0 && n - nums[i - 1] > 1) out.push("…");
    out.push(n);
  });
  return out;
}

export function FeatureTable() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const total = DATASET.length;
  const pages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const rows = DATASET.slice(start, start + pageSize);

  const btn =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] border-separate border-spacing-0 text-sm">
          <thead>
            <tr className="text-xs text-ink/60">
              <th className="sticky left-0 z-10 border-b border-ink/15 bg-white px-3 py-3 text-left font-medium">
                month
              </th>
              {cols.map((c) => (
                <th
                  key={c.key}
                  className={`border-b border-ink/15 px-3 py-3 text-right font-medium ${
                    c.role === "target" ? "border-l border-l-line bg-orange-50 text-orange-700" : ""
                  }`}
                >
                  <div className="font-mono">{c.key}</div>
                  <div className="mt-0.5 font-sans text-[11px] font-normal text-ink/45">{c.unit}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.month} className="transition-colors hover:bg-ink/[0.03]">
                <td className="sticky left-0 z-10 border-b border-line bg-white px-3 py-2.5 font-mono text-xs text-ink/70">
                  {r.month}
                </td>
                {r.values.map((v, i) => (
                  <td
                    key={cols[i].key}
                    className={`border-b border-line px-3 py-2.5 text-right tabular-nums ${
                      cols[i].role === "target"
                        ? "border-l border-l-line bg-orange-50 font-semibold text-ink"
                        : "text-ink/85"
                    }`}
                  >
                    {fmt(v, cols[i].digits)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            {(["min", "mean", "max"] as const).map((k, idx) => (
              <tr key={k} className="text-xs text-ink/60">
                <td
                  className={`sticky left-0 z-10 bg-white px-3 py-2 font-mono uppercase ${
                    idx === 0 ? "border-t border-ink/15" : ""
                  }`}
                >
                  {k}
                </td>
                {stats.map((s, i) => (
                  <td
                    key={cols[i].key}
                    className={`px-3 py-2 text-right tabular-nums ${idx === 0 ? "border-t border-ink/15" : ""} ${
                      cols[i].role === "target" ? "border-l border-l-line bg-orange-50" : ""
                    }`}
                  >
                    {fmt(s[k], cols[i].digits)}
                  </td>
                ))}
              </tr>
            ))}
          </tfoot>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink/65">
          <span>
            แสดง {start + 1}–{Math.min(start + pageSize, total)} จาก {total} แถว
          </span>
          <label className="flex items-center gap-2">
            แถวต่อหน้า
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="h-9 rounded-lg border border-line bg-white px-2 text-ink"
            >
              {PAGE_SIZES.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        </div>

        <nav aria-label="เลือกหน้าตารางข้อมูล" className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            className={`${btn} border-line hover:bg-ink/5`}
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
            aria-label="หน้าก่อนหน้า"
          >
            ‹
          </button>
          {pageList(page, pages).map((n, i) =>
            n === "…" ? (
              <span key={`gap-${i}`} className="px-1 text-ink/40" aria-hidden>
                …
              </span>
            ) : (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
                aria-current={n === page ? "page" : undefined}
                className={`${btn} ${
                  n === page ? "border-ink bg-ink text-white" : "border-line hover:bg-ink/5"
                }`}
              >
                {n}
              </button>
            ),
          )}
          <button
            type="button"
            className={`${btn} border-line hover:bg-ink/5`}
            onClick={() => setPage((p) => p + 1)}
            disabled={page === pages}
            aria-label="หน้าถัดไป"
          >
            ›
          </button>
        </nav>
      </div>
    </div>
  );
}
