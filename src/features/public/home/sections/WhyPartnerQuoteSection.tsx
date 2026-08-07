import type { PageSectionContent } from "../../../../types/page";
import { FALLBACK_IMAGE, resolveMediaUrl } from "../../../../lib/utils/media";
import { useInView } from "../../../../lib/hooks/useInView";

// A partner testimonial — social proof from an existing distributor/importer,
// distinct from PartnersSection's logo-strip trust display.
export function WhyPartnerQuoteSection({ content }: { content: PageSectionContent }) {
  const quote = content.quote as string | undefined;
  const author = content.author as string | undefined;
  const role = content.role as string | undefined;
  const avatarUrl = content.avatarUrl as string | undefined;
  const { ref, inView } = useInView<HTMLDivElement>();

  if (!quote) return null;

  return (
    <section className="bg-[#F3EDE1] px-4 py-16 sm:px-6 sm:py-24">
      <div
        ref={ref}
        className={`mx-auto max-w-3xl rounded-[28px] bg-white p-8 text-center shadow-[0_15px_40px_rgba(0,0,0,0.06)] transition-all duration-700 sm:p-12 ${
          inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        <span className="text-5xl font-serif leading-none text-[var(--rt-brand-secondary)]/40" aria-hidden>
          &ldquo;
        </span>
        <blockquote className="mt-2 text-xl font-medium leading-relaxed text-[#294A34] sm:text-2xl">{quote}</blockquote>

        <div className="mt-6 flex items-center justify-center gap-3">
          {avatarUrl && (
            <img
              src={resolveMediaUrl(avatarUrl) ?? FALLBACK_IMAGE}
              alt={author ?? ""}
              loading="lazy"
              decoding="async"
              className="h-12 w-12 rounded-full object-cover"
            />
          )}
          {(author || role) && (
            <div className="text-left">
              {author && <p className="text-sm font-semibold text-[#294A34]">{author}</p>}
              {role && <p className="text-xs text-taupe">{role}</p>}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
