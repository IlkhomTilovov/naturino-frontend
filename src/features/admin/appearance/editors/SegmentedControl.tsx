export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { key: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex rounded-xl bg-slate-100 p-1">
      {options.map((opt) => (
        <button
          key={opt.key}
          type="button"
          onClick={() => onChange(opt.key)}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            value === opt.key ? "bg-white text-admin-primary shadow-sm" : "text-admin-muted hover:text-admin-primary"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
