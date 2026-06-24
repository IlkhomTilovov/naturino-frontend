export function InfoTooltip({ text }: { text: string }) {
  return (
    <span className="group relative inline-flex">
      <span className="flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-slate-100 text-[10px] font-semibold text-admin-muted">
        i
      </span>
      <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-56 -translate-x-1/2 rounded-lg bg-admin-primary px-3 py-2 text-[11px] leading-snug text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
        {text}
        <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-admin-primary" />
      </span>
    </span>
  );
}
