import type { PageSectionContent } from "../../../../types/page";
import { useInView } from "../../../../lib/hooks/useInView";

// A single, large statement of intent — a company "pledge" rather than a
// list of facts. Deliberately sparse so the quote carries the section.
export function QualityPledgeSection({ content }: { content: PageSectionContent }) {
  const quote = content.quote as string | undefined;
  const author = content.author as string | undefined;
  const role = content.role as string | undefined;
  const { ref, inView } = useInView<HTMLDivElement>();

  if (!quote) return null;

  return (
    <section className="bg-[#F3EDE1] px-4 py-20 sm:px-6 sm:py-28">
      <div ref={ref} className="mx-auto max-w-3xl text-center">
        <span
          className={`mx-auto block text-6xl font-serif leading-none text-[var(--rt-brand-secondary)]/40 transition-all duration-700 ${
            inView ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          }`}
          aria-hidden
        >
          &ldquo;
        </span>
        <blockquote
          style={{ transitionDelay: inView ? "100ms" : "0ms" }}
          className={`text-2xl font-semibold leading-snug text-[#294A34] transition-all duration-700 sm:text-3xl ${
            inView ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
        >
          {quote}
        </blockquote>
        {(author || role) && (
          <p
            style={{ transitionDelay: inView ? "200ms" : "0ms" }}
            className={`mt-6 text-sm font-medium text-taupe transition-all duration-700 ${
              inView ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            }`}
          >
            {author}
            {author && role ? " — " : ""}
            {role}
          </p>
        )}
      </div>
    </section>
  );
}
