import { FormSectionCard } from "../../../../components/admin/FormSectionCard";

export function CustomCssEditor({ value, onChange }: { value: string; onChange: (next: string) => void }) {
  const lineCount = value.split("\n").length;

  return (
    <FormSectionCard title="Custom CSS" description="Ilg'or foydalanuvchilar uchun qo'shimcha CSS qoidalari">
      <div className="space-y-3">
        <div className="flex items-start gap-2 rounded-xl bg-admin-warning-50 px-3 py-2.5 text-xs text-admin-warning">
          <span>⚠️</span>
          <span>Custom CSS advanced foydalanuvchilar uchun. Noto'g'ri CSS sayt dizayniga ta'sir qilishi mumkin.</span>
        </div>

        <div className="overflow-hidden rounded-2xl border border-admin-border">
          <div className="flex items-center justify-between border-b border-admin-border bg-slate-50 px-3 py-1.5 text-[11px] text-admin-muted">
            <span>style.css</span>
            <span>{lineCount} qator</span>
          </div>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`.hero-title {\n  letter-spacing: 0.5px;\n}`}
            rows={14}
            spellCheck={false}
            className="w-full resize-none bg-[#0F172A] p-4 font-mono text-[13px] leading-relaxed text-[#E2E8F0] focus:outline-none"
          />
        </div>

        <button
          type="button"
          onClick={() => onChange("")}
          className="rounded-lg px-3 py-1.5 text-xs font-medium text-admin-danger hover:bg-admin-danger-50"
        >
          Tozalash
        </button>
      </div>
    </FormSectionCard>
  );
}
