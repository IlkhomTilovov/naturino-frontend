import {
  BarChart3,
  Factory,
  FileText,
  Globe2,
  Handshake,
  HeadphonesIcon,
  Package,
  ShieldCheck,
  Store,
  Truck,
  Warehouse,
  type LucideIcon,
} from "lucide-react";
import type { PageSectionContent } from "../../../../types/page";
import { resolveMediaUrl } from "../../../../lib/utils/media";
import { useInView } from "../../../../lib/hooks/useInView";

interface FeatureCard {
  icon?: string;
  title: string;
  description?: string;
}

const ICONS: Record<string, LucideIcon> = {
  factory: Factory,
  box: Package,
  warehouse: Warehouse,
  globe: Globe2,
  truck: Truck,
  store: Store,
  badge: ShieldCheck,
  shield: ShieldCheck,
  document: FileText,
  chart: BarChart3,
  handshake: Handshake,
  support: HeadphonesIcon,
};

const DEFAULT_CARDS: FeatureCard[] = [
  { icon: "box", title: "Barqaror yetkazib berish", description: "Doimiy ishlab chiqarish rejasi va ishonchli muddatlarda yetkazib berish." },
  { icon: "globe", title: "Eksport tajribasi", description: "20+ davlatga mahsulot yetkazib berish bo'yicha amaliy tajriba." },
  { icon: "shield", title: "Sifat kafolati", description: "Xalqaro standartlarga (ISO 22000, HACCP, GMP+) mos ishlab chiqarish." },
  { icon: "handshake", title: "Biznes hamkorlik", description: "Barqaror o'sishga yo'naltirilgan uzoq muddatli hamkorlik." },
];

interface ImageStat {
  value: string;
  label: string;
}

type Variant = "image" | "plain" | "dark";

export function FeatureCardsSection({ content }: { content: PageSectionContent }) {
  const eyebrow = content.eyebrow as string | undefined;
  const title = content.title as string | undefined;
  const subtitle = content.subtitle as string | undefined;
  const cards = (content.cards as FeatureCard[] | undefined) ?? [];
  const visualCards = cards.length > 0 ? cards : DEFAULT_CARDS;
  const imageUrl = content.imageUrl as string | undefined;
  const imageStats = content.imageStats as ImageStat[] | undefined;
  const variant: Variant = (content.variant as Variant | undefined) ?? (imageUrl ? "image" : "plain");
  const { ref, inView } = useInView<HTMLDivElement>();

  if (!title && cards.length === 0) return null;

  const isDark = variant === "dark";
  const showImage = variant === "image";

  const textCol = (
    <div className={showImage ? "order-2 lg:order-1" : undefined}>
      {eyebrow && (
        <p
          className={`text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-700 ${
            isDark ? "text-white/70" : "text-[var(--rt-brand-secondary)]"
          } ${inView ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
        >
          {eyebrow}
        </p>
      )}

      {title && (
        <h2
          style={{ transitionDelay: inView ? "100ms" : "0ms" }}
          className={`mt-4 max-w-xl text-3xl font-bold leading-tight transition-all duration-700 sm:text-4xl lg:text-5xl ${
            isDark ? "text-white" : "text-[#0F172A]"
          } ${inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"} ${showImage ? "" : "mx-auto text-center"}`}
        >
          {title}
        </h2>
      )}

      {subtitle && (
        <p
          style={{ transitionDelay: inView ? "200ms" : "0ms" }}
          className={`mt-5 max-w-[600px] text-lg transition-all duration-700 ${isDark ? "text-white/70" : "text-slate-600"} ${
            inView ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          } ${showImage ? "" : "mx-auto text-center"}`}
        >
          {subtitle}
        </p>
      )}

      <div className={`mt-10 grid gap-5 ${showImage ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
        {visualCards.map((card, i) => {
          const Icon = ICONS[card.icon ?? ""] ?? Package;
          return (
            <div
              key={card.title}
              style={{ transitionDelay: inView ? `${320 + i * 100}ms` : "0ms" }}
              className={`rounded-2xl p-5 text-left shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-700 ${
                isDark ? "border border-white/10 bg-white/5" : "border border-[#E7EBDD] bg-white"
              } ${inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                  isDark ? "bg-white/10 text-[var(--rt-accent)]" : "bg-[var(--rt-brand-secondary)]/15 text-[var(--rt-brand-secondary)]"
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <h3 className={`mt-4 font-semibold ${isDark ? "text-white" : "text-[#0F172A]"}`}>{card.title}</h3>
              {card.description && (
                <p className={`mt-1.5 text-sm leading-relaxed ${isDark ? "text-white/60" : "text-slate-500"}`}>{card.description}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <section className={`overflow-hidden px-4 py-16 sm:px-6 sm:py-24 ${isDark ? "bg-[var(--rt-brand-primary)]" : "bg-[#F8F9F4]"}`}>
      <div
        ref={ref}
        className={showImage ? "mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16" : "mx-auto max-w-6xl"}
      >
        {textCol}

        {showImage && (
          <div
            style={{ transitionDelay: inView ? "150ms" : "0ms" }}
            className={`order-1 lg:order-2 transition-all duration-1000 ${
              inView ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-[0.97] opacity-0"
            }`}
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-2xl sm:aspect-square lg:aspect-[4/5]">
              <img src={resolveMediaUrl(imageUrl) ?? imageUrl} alt={title ?? ""} className="h-full w-full object-cover" />
              {imageStats && imageStats.length > 0 && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-t from-[color-mix(in_srgb,var(--rt-brand-primary),black_30%)]/70 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl border border-white/15 bg-[color-mix(in_srgb,var(--rt-brand-primary),black_30%)]/70 px-5 py-4 backdrop-blur">
                    {imageStats.map((stat, i) => (
                      <div key={stat.label} className="flex items-center gap-4">
                        {i > 0 && <div className="h-8 w-px bg-white/15" />}
                        <div>
                          <p className="text-2xl font-bold text-white">{stat.value}</p>
                          <p className="text-xs font-medium uppercase tracking-wide text-white/70">{stat.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
