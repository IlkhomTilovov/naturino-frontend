import { Award, Factory, Globe2, Package, type LucideIcon } from "lucide-react";
import { InlineText } from "../../../components/admin/inline/InlineText";
import { InlineChecklist } from "../../../components/admin/inline/InlineChecklist";
import type { PageSectionContent } from "../../../types/page";

interface StatItem {
  icon?: string;
  value?: string;
  label?: string;
}

const ICONS: Record<string, LucideIcon> = {
  factory: Factory,
  globe: Globe2,
  badge: Award,
  box: Package,
};

export function EditableStatsSection({
  content,
  onFieldChange,
}: {
  content: PageSectionContent;
  onFieldChange: (key: string, value: unknown) => void;
}) {
  const items = (content.items as StatItem[] | undefined) ?? [];
  const eyebrow = content.eyebrow as string | undefined;
  const title = content.title as string | undefined;
  const subtitle = content.subtitle as string | undefined;
  const certifications = (content.certifications as string[] | undefined) ?? [];

  const updateItem = (index: number, patch: Partial<StatItem>) =>
    onFieldChange(
      "items",
      items.map((it, i) => (i === index ? { ...it, ...patch } : it)),
    );
  const addItem = () => onFieldChange("items", [...items, { icon: "box", value: "0", label: "Yangi band" }]);
  const removeItem = (index: number) => onFieldChange("items", items.filter((_, i) => i !== index));

  return (
    <section className="bg-[#FAFAF7] px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <InlineText
            value={eyebrow}
            placeholder="ISHONCH VA NATIJALAR"
            onCommit={(v) => onFieldChange("eyebrow", v)}
            className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--rt-brand-primary)]"
          />
          <h2 className="mt-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
            <InlineText value={title} placeholder="Naturino raqamlarda" onCommit={(v) => onFieldChange("title", v)} />
          </h2>
          <InlineText
            value={subtitle}
            placeholder="Qisqa tavsif"
            multiline
            onCommit={(v) => onFieldChange("subtitle", v)}
            className="mt-3 block text-slate-500"
          />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => {
            const Icon = ICONS[item.icon ?? ""] ?? Package;
            return (
              <div key={i} className="group relative rounded-3xl border border-black/5 bg-white p-8 text-center shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeItem(i);
                  }}
                  className="invisible absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-admin-danger text-white group-hover:visible"
                >
                  ✕
                </button>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--rt-brand-primary)]/10 text-[var(--rt-brand-primary)]">
                  <Icon className="h-6 w-6" strokeWidth={1.75} />
                </div>
                <p className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                  <InlineText value={item.value} placeholder="12 000+" onCommit={(v) => updateItem(i, { value: v })} />
                </p>
                <p className="mt-3 text-sm font-semibold text-slate-600">
                  <InlineText value={item.label} placeholder="Yorlik" onCommit={(v) => updateItem(i, { label: v })} />
                </p>
              </div>
            );
          })}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              addItem();
            }}
            className="flex min-h-[10rem] items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 text-sm font-medium text-admin-muted hover:border-admin-primary hover:text-admin-primary"
          >
            + Karta qo'shish
          </button>
        </div>

        <div className="mt-16">
          <p className="text-center text-sm font-semibold text-slate-400">Sertifikatlar va standartlar</p>
          <ul className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <InlineChecklist items={certifications} onChange={(v) => onFieldChange("certifications", v)} />
          </ul>
        </div>
      </div>
    </section>
  );
}
