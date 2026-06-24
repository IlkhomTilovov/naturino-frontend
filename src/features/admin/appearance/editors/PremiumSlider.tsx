export function PremiumSlider({
  label,
  value,
  min,
  max,
  step = 0.5,
  unit = "px",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="text-xs font-medium text-admin-primary">{label}</label>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-admin-muted">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-admin-primary"
      />
      <div className="mt-0.5 flex justify-between text-[10px] text-admin-muted">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}
