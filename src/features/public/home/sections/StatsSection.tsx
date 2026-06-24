import { Award, Factory, Globe2, Package, type LucideIcon } from "lucide-react";
import type { PageSectionContent } from "../../../../types/page";
import { useInView } from "../../../../lib/hooks/useInView";
import { useCountUp } from "../../../../lib/hooks/useCountUp";

interface StatItem {
  icon?: string;
  value: string;
  label: string;
  supportingText?: string;
}

const ICONS: Record<string, LucideIcon> = {
  factory: Factory,
  globe: Globe2,
  badge: Award,
  box: Package,
};

const DEFAULT_CERTIFICATIONS = ["ISO 22000", "HACCP", "GMP+", "EAC", "Veterinariya tasdig'i"];

/** Splits "12 000+" into { prefix: "", number: 12000, suffix: "+" } so we can count up the digits only. */
function parseStatValue(raw: string) {
  const match = raw.match(/^(\D*)([\d\s.,]+)(\D*)$/);
  if (!match) return { prefix: "", number: 0, suffix: raw, isNumeric: false };
  const [, prefix, digits, suffix] = match;
  const number = Number(digits.replace(/[\s.,]/g, ""));
  return { prefix, number, suffix, isNumeric: Number.isFinite(number) };
}

function formatNumber(n: number) {
  return n.toLocaleString("ru-RU");
}

function StatCard({ item, index, inView }: { item: StatItem; index: number; inView: boolean }) {
  const Icon = ICONS[item.icon ?? ""] ?? Package;
  const { prefix, number, suffix, isNumeric } = parseStatValue(item.value);
  const animated = useCountUp(number, inView, 1800);
  const displayValue = isNumeric ? `${prefix}${formatNumber(animated)}${suffix}` : item.value;

  return (
    <div
      style={{ transitionDelay: inView ? `${120 + index * 110}ms` : "0ms" }}
      className={`group rounded-3xl border border-black/5 bg-white p-8 text-center shadow-[0_4px_24px_rgba(0,0,0,0.04)] transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] ${
        inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--rt-brand-primary)]/10 text-[var(--rt-brand-primary)] transition-transform duration-300 group-hover:scale-105">
        <Icon className="h-6 w-6" strokeWidth={1.75} />
      </div>

      <p className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">{displayValue}</p>
      <p className="mt-3 text-sm font-semibold text-slate-600">{item.label}</p>
      {item.supportingText && <p className="mt-1 text-xs text-slate-400">{item.supportingText}</p>}
    </div>
  );
}

export function StatsSection({ content }: { content: PageSectionContent }) {
  const items = (content.items as StatItem[] | undefined) ?? [];
  const eyebrow = (content.eyebrow as string | undefined) ?? "ISHONCH VA NATIJALAR";
  const title = (content.title as string | undefined) ?? "Naturino raqamlarda";
  const subtitle =
    (content.subtitle as string | undefined) ??
    "12 yildan ortiq tajriba, xalqaro eksport va sertifikatlangan ishlab chiqarish quvvatlari.";
  const certifications = (content.certifications as string[] | undefined) ?? DEFAULT_CERTIFICATIONS;
  const { ref, inView } = useInView<HTMLDivElement>();

  if (items.length === 0) return null;

  return (
    <section className="bg-[#FAFAF7] px-4 py-16 sm:px-6 sm:py-24">
      <div ref={ref} className="mx-auto max-w-6xl">
        <div
          className={`mx-auto max-w-2xl text-center transition-all duration-700 ${
            inView ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--rt-brand-primary)]">{eyebrow}</p>
          <h2 className="mt-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">{title}</h2>
          <p className="mt-3 text-slate-500">{subtitle}</p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <StatCard key={item.label} item={item} index={i} inView={inView} />
          ))}
        </div>

        {certifications.length > 0 && (
          <div className="mt-16">
            <p className="text-center text-sm font-semibold text-slate-400">Sertifikatlar va standartlar</p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              {certifications.map((cert, i) => (
                <span
                  key={cert}
                  style={{ transitionDelay: inView ? `${500 + i * 80}ms` : "0ms" }}
                  className={`group flex items-center gap-2 rounded-full border border-black/5 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--rt-brand-primary)] hover:text-white hover:shadow-md ${
                    inView ? "translate-y-0 scale-100 opacity-100" : "translate-y-3 scale-95 opacity-0"
                  }`}
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--rt-brand-primary)]/10 text-xs text-[var(--rt-brand-primary)] transition-colors duration-300 group-hover:bg-white/20 group-hover:text-white">
                    ✓
                  </span>
                  {cert}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
