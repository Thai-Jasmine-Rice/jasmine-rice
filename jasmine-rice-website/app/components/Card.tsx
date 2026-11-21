import type { ReactNode } from "react";

export function Card({
  title,
  subtitle,
  badge,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  badge?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-3xl border border-line bg-white/80 p-5 shadow-[0_1px_0_rgba(0,0,0,0.04),0_12px_32px_-16px_rgba(0,0,0,0.2)] backdrop-blur sm:p-7 ${className}`}
    >
      <header className="mb-5 flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div>
          <h2 className="font-heading text-lg font-semibold text-ink sm:text-xl">{title}</h2>
          {subtitle && <p className="mt-1 text-sm leading-6 text-ink/65">{subtitle}</p>}
        </div>
        {badge && (
          <span className="rounded-full bg-ink/5 px-3 py-1 text-xs font-medium text-ink/70">
            {badge}
          </span>
        )}
      </header>
      {children}
    </section>
  );
}
