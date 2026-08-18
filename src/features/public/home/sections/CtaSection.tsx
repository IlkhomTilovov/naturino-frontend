import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { PageSectionContent } from "../../../../types/page";
import { useInView } from "../../../../lib/hooks/useInView";
import { bgVariantClasses } from "../../../../lib/utils/sectionBgVariant";
import { useCertificateBadges } from "../../../../lib/hooks/useCertificateBadges";
import { useLanguage } from "../../../../i18n/LanguageContext";
import { resolveMediaUrl } from "../../../../lib/utils/media";
import { CertificatesModal } from "../../shared/CertificatesModal";

// buttonUrl can point at three different things, each needing a different
// element: the "certificates" sentinel opens the certificate-picker modal
// (for a CTA that doesn't have one specific PDF to link — e.g. a lab-report
// promise with no lab report on file yet), an uploaded file
// ("/uploads/2026/08/....pdf") needs a plain <a> so the browser opens/
// downloads it (React Router's <Link> would intercept it as a client route
// and go nowhere), and anything else is an internal route via <Link>.
function isUploadedFile(url: string) {
  return url.startsWith("/uploads/") || /\/uploads\//.test(url);
}

function CtaButton({ url, className, children }: { url: string; className: string; children: ReactNode }) {
  if (url === "certificates") {
    return <CertificatesModal trigger={<button type="button" className={className}>{children}</button>} />;
  }
  if (isUploadedFile(url)) {
    return (
      <a href={resolveMediaUrl(url) ?? url} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link to={url} className={className}>
      {children}
    </Link>
  );
}

export function CtaSection({ content }: { content: PageSectionContent }) {
  const title = content.title as string | undefined;
  const highlight = content.highlight as string | undefined;
  const titleEnd = content.titleEnd as string | undefined;
  const subtitle = content.subtitle as string | undefined;
  const { language } = useLanguage();
  const certificateBadges = useCertificateBadges(language);
  const trustBadges = (content.trustBadges as string[] | undefined) ?? certificateBadges;
  const buttonText = content.buttonText as string | undefined;
  const buttonUrl = (content.buttonUrl as string | undefined) ?? "/contact";
  const secondaryButtonText = content.secondaryButtonText as string | undefined;
  const secondaryButtonUrl = (content.secondaryButtonUrl as string | undefined) ?? "/contact";
  const { ref, inView } = useInView<HTMLDivElement>();
  const bg = bgVariantClasses(content.bgVariant as string | undefined, "dark");
  const d = bg.isDark;

  if (!title) return null;

  return (
    <section className={`${bg.section} px-4 py-20 text-center sm:px-6 sm:py-20`}>
      <div ref={ref} className="mx-auto max-w-3xl">
        <h2
          className={`text-3xl font-bold leading-tight transition-all duration-700 md:text-4xl ${bg.heading} ${
            inView ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
        >
          {title}
          {highlight && (
            <span className="rounded-md bg-[var(--rt-accent)]/15 px-1.5 text-[var(--rt-accent)]">{highlight}</span>
          )}
          {titleEnd}
        </h2>

        {subtitle && (
          <p
            style={{ transitionDelay: inView ? "120ms" : "0ms" }}
            className={`mx-auto mt-4 max-w-xl transition-all duration-700 ${bg.body} ${
              inView ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            }`}
          >
            {subtitle}
          </p>
        )}

        {trustBadges.length > 0 && (
          <div
            style={{ transitionDelay: inView ? "240ms" : "0ms" }}
            className={`mt-6 flex flex-wrap items-center justify-center gap-2.5 transition-all duration-700 ${
              inView ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            }`}
          >
            {trustBadges.map((badge, i) => (
              <span
                key={`${badge}-${i}`}
                className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold ${
                  d ? "border-white/15 bg-white/5 text-white/80" : "border-black/10 bg-black/[0.03] text-[#294A34]/80"
                }`}
              >
                <span className={d ? "text-[var(--rt-accent)]" : "text-[var(--rt-brand-primary)]"}>✓</span>
                {badge}
              </span>
            ))}
          </div>
        )}

        {(buttonText || secondaryButtonText) && (
          <div
            style={{ transitionDelay: inView ? "360ms" : "0ms" }}
            className={`mt-8 flex flex-wrap items-center justify-center gap-3 transition-all duration-700 ${
              inView ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            }`}
          >
            {buttonText && (
              <CtaButton
                url={buttonUrl}
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--rt-accent)] px-6 py-3 font-semibold text-[var(--rt-brand-primary)] shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_15px_35px_-10px_rgba(232,162,58,0.5)]"
              >
                {buttonText} <span aria-hidden>→</span>
              </CtaButton>
            )}
            {secondaryButtonText && (
              <CtaButton
                url={secondaryButtonUrl}
                className={`inline-flex items-center gap-2 rounded-lg border px-6 py-3 font-semibold transition-all duration-300 hover:-translate-y-0.5 ${
                  d
                    ? "border-white/25 bg-white/5 text-white hover:border-white/40 hover:bg-white/10"
                    : "border-black/15 bg-black/[0.03] text-[#294A34] hover:border-[#294A34]/40 hover:bg-black/[0.06]"
                }`}
              >
                {secondaryButtonText} <span aria-hidden>→</span>
              </CtaButton>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
