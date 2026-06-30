import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2.5 ${className}`} aria-label="GARHY | HYPER">
      <div
        className="gradient-brand relative grid h-10 w-10 place-items-center overflow-hidden rounded-2xl text-white shadow-soft"
        style={{
          boxShadow:
            "0 8px 24px -10px color-mix(in oklab, var(--brand) 55%, transparent), inset 0 1px 0 rgba(255,255,255,.25)",
        }}
      >
        <span className="font-display text-[13px] font-extrabold tracking-tight leading-none">
          AG
        </span>
        <span
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(120% 80% at 20% 0%, rgba(255,255,255,.45), transparent 55%)",
          }}
        />
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-display text-[15px] font-extrabold tracking-tight">
          <span className="text-gradient-brand">GARHY</span>
          <span className="mx-1 text-muted-foreground/60 font-medium">|</span>
          <span className="text-foreground">HYPER</span>
        </span>
        <span className="mt-1 hidden text-[9px] font-semibold uppercase tracking-[0.22em] text-muted-foreground sm:block">
          AI-First Marketplace
        </span>
      </div>
    </Link>
  );
}


