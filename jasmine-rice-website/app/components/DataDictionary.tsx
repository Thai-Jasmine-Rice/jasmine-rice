import { SCHEMA } from "../lib/mockData";

export function DataDictionary() {
  return (
    <div className="-mx-1 overflow-x-auto">
      <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left text-sm">
        <thead>
          <tr className="text-xs uppercase tracking-wide text-ink/55">
            {["ชื่อคอลัมน์", "ความหมาย", "ประเภท", "หน่วย", "แหล่งข้อมูล", "ความถี่"].map((h) => (
              <th key={h} className="border-b border-ink/15 px-3 py-3 font-medium first:pl-1">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SCHEMA.map((c) => (
            <tr key={c.key} className="align-top transition-colors hover:bg-ink/[0.03]">
              <td className="border-b border-line px-3 py-3.5 pl-1">
                <code className="rounded-md bg-ink/[0.06] px-2 py-1 font-mono text-[13px] text-ink">{c.key}</code>
              </td>
              <td className="border-b border-line px-3 py-3.5">
                <div className="font-medium text-ink">{c.name}</div>
                <div className="mt-0.5 max-w-xs text-xs leading-5 text-ink/60">{c.desc}</div>
              </td>
              <td className="border-b border-line px-3 py-3.5 font-mono text-xs text-ink/70">{c.type}</td>
              <td className="border-b border-line px-3 py-3.5 text-ink/80">{c.unit}</td>
              <td className="border-b border-line px-3 py-3.5 text-ink/80">{c.source}</td>
              <td className="border-b border-line px-3 py-3.5 text-ink/80">{c.freq}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
