import { FlaskConical, Globe2, type LucideIcon, PackageSearch, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import type { PageSectionContent } from "../../../../types/page";
import { useInView } from "../../../../lib/hooks/useInView";

interface Step {
  number: string;
  label: string;
  title?: string;
  description?: string;
  icon?: string;
}

const ICONS: Record<string, LucideIcon> = {
  formula: FlaskConical,
  packaging: PackageSearch,
  quality: ShieldCheck,
  export: Globe2,
};

const DEFAULT_DETAILS: Record<string, { icon: string; description: string }> = {
  "01": { icon: "formula", description: "Bozor ehtiyojlari va maqsadli auditoriyaga mos retsept va assortiment shakllantiriladi." },
  "02": { icon: "packaging", description: "Mahsulot dizayni, yorliq va qadoqlash sizning brendingizga moslashtiriladi." },
  "03": { icon: "quality", description: "Mahsulotlar ISO 22000 va HACCP standartlari asosida ishlab chiqariladi va nazorat qilinadi." },
  "04": { icon: "export", description: "Eksport hujjatlari, logistika va xalqaro yetkazib berish jarayoni boshqariladi." },
};

export function PrivateLabelSection({ content }: { content: PageSectionContent }) {
  const eyebrow = content.eyebrow as string | undefined;
  const title = content.title as string | undefined;
  const subtitle = content.subtitle as string | undefined;
  const steps = (content.steps as Step[] | undefined) ?? [];
  const buttonText = content.buttonText as string | undefined;
  const buttonUrl = (content.buttonUrl as string | undefined) ?? "/partnership";
  const ctaTitle = (content.ctaTitle as string | undefined) ?? "Private Label hamkorligini boshlang";
  const ctaSubtitle =
    (content.ctaSubtitle as string | undefined) ??
    "Naturino jamoasi sizning brendingiz uchun mos private-label yechimni ishlab chiqishga tayyor.";
  const { ref, inView } = useInView<HTMLDivElement>();

  if (!title) return null;

  return (
    <section className="relative overflow-hidden bg-[var(--rt-brand-primary)] px-4 py-20 text-center text-white sm:px-6 sm:py-28">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--rt-accent) 10%, transparent) 0%, transparent 55%), radial-gradient(circle at 100% 100%, color-mix(in srgb, var(--rt-brand-primary) 60%, transparent) 0%, transparent 60%)",
        }}
      />

      <div ref={ref} className="relative z-10 mx-auto max-w-5xl">
        {eyebrow && (
          <p
            className={`flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--rt-accent)] transition-all duration-700 ${
              inView ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            }`}
          >
            ✦ {eyebrow}
          </p>
        )}

        <h2
          style={{ transitionDelay: inView ? "100ms" : "0ms" }}
          className={`mx-auto mt-4 max-w-3xl text-3xl font-bold leading-tight transition-all duration-700 sm:text-4xl lg:text-5xl ${
            inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          {title}
        </h2>

        {subtitle && (
          <p
            style={{ transitionDelay: inView ? "200ms" : "0ms" }}
            className={`mx-auto mt-5 max-w-2xl text-base text-white/70 transition-all duration-700 sm:text-lg ${
              inView ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
          >
            {subtitle}
          </p>
        )}

        {steps.length > 0 && (
          <div className="relative mt-16 sm:mt-20">
            <div
              style={{ transitionDelay: inView ? "300ms" : "0ms", width: inView ? "100%" : "0%" }}
              className="absolute top-9 left-0 hidden h-px bg-gradient-to-r from-[var(--rt-accent)]/60 via-[var(--rt-accent)]/30 to-[var(--rt-accent)]/60 transition-all duration-[1200ms] ease-out sm:block"
            />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {steps.map((step, i) => {
                const fallback = DEFAULT_DETAILS[step.number];
                const Icon = ICONS[step.icon ?? fallback?.icon ?? ""] ?? FlaskConical;
                const description = step.description ?? fallback?.description;

                return (
                  <div
                    key={step.number}
                    style={{ transitionDelay: inView ? `${380 + i * 130}ms` : "0ms" }}
                    className={`group relative rounded-3xl border border-[var(--rt-accent)]/10 bg-[color-mix(in_srgb,var(--rt-brand-primary),black_15%)]/50 p-7 text-left shadow-[0_15px_40px_-12px_rgba(0,0,0,0.4)] backdrop-blur transition-all duration-300 hover:-translate-y-1.5 hover:border-[var(--rt-accent)]/40 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] ${
                      inView ? "translate-y-0 opacity-100 duration-700" : "translate-y-6 opacity-0 duration-700"
                    }`}
                  >
                    <p className="text-6xl font-bold tracking-tight text-[var(--rt-accent)] sm:text-7xl">{step.number}</p>

                    <div className="mt-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--rt-accent)]/15 text-[var(--rt-accent)]">
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    </div>

                    <p className="mt-4 text-base font-semibold text-white">{step.title ?? step.label}</p>
                    {description && <p className="mt-2 text-sm leading-relaxed text-white/60">{description}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {(ctaTitle || buttonText) && (
          <div
            style={{ transitionDelay: inView ? "900ms" : "0ms" }}
            className={`mt-16 border-t border-white/10 pt-12 transition-all duration-700 sm:mt-20 ${
              inView ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
          >
            {ctaTitle && <h3 className="text-2xl font-bold text-white sm:text-3xl">{ctaTitle}</h3>}
            {ctaSubtitle && <p className="mx-auto mt-3 max-w-xl text-white/65">{ctaSubtitle}</p>}

            {buttonText && (
              <Link
                to={buttonUrl}
                className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[var(--rt-accent)] px-7 py-3.5 font-semibold text-[var(--rt-brand-primary)] shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-xl"
              >
                {buttonText} <span aria-hidden>→</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
