import { useState } from "react";
import type { PageSectionContent } from "../../../../types/page";
import { bgVariantClasses } from "../../../../lib/utils/sectionBgVariant";

interface FaqItem {
  question?: string;
  answer?: string;
}

export function FaqSection({ content }: { content: PageSectionContent }) {
  const eyebrow = content.eyebrow as string | undefined;
  const title = content.title as string | undefined;
  const items = (content.items as FaqItem[] | undefined) ?? [];
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const bg = bgVariantClasses(content.bgVariant as string | undefined, "");

  if (!title && items.length === 0) return null;

  return (
    <section className={`${bg.section} px-4 py-20 sm:px-6`}>
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          {eyebrow && <p className={`text-xs font-semibold uppercase tracking-wide ${bg.eyebrow}`}>{eyebrow}</p>}
          {title && <h2 className={`mt-3 text-3xl font-bold ${bg.heading}`}>{title}</h2>}
        </div>

        <div className={`mt-10 divide-y rounded-2xl border ${bg.isDark ? "divide-white/10 border-white/15" : "divide-herb/50 border-herb/50"}`}>
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
                >
                  <span className={`font-medium ${bg.heading}`}>{item.question}</span>
                  <span
                    className={`shrink-0 transition-transform ${isOpen ? "rotate-45" : ""} ${
                      bg.isDark ? "text-[var(--rt-accent)]" : "text-[var(--rt-brand-primary)]"
                    }`}
                  >
                    +
                  </span>
                </button>
                {isOpen && item.answer && <p className={`px-6 pb-4 text-sm ${bg.body}`}>{item.answer}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
