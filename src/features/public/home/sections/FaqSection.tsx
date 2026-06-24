import { useState } from "react";
import type { PageSectionContent } from "../../../../types/page";

interface FaqItem {
  question?: string;
  answer?: string;
}

export function FaqSection({ content }: { content: PageSectionContent }) {
  const eyebrow = content.eyebrow as string | undefined;
  const title = content.title as string | undefined;
  const items = (content.items as FaqItem[] | undefined) ?? [];
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!title && items.length === 0) return null;

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <div className="text-center">
        {eyebrow && <p className="text-xs font-semibold uppercase tracking-wide text-[var(--rt-brand-primary)]">{eyebrow}</p>}
        {title && <h2 className="mt-3 text-3xl font-bold text-slate-900">{title}</h2>}
      </div>

      <div className="mt-10 divide-y divide-slate-200 rounded-2xl border border-slate-200">
        {items.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={i}>
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
              >
                <span className="font-medium text-slate-900">{item.question}</span>
                <span className={`shrink-0 text-[var(--rt-brand-primary)] transition-transform ${isOpen ? "rotate-45" : ""}`}>+</span>
              </button>
              {isOpen && item.answer && <p className="px-6 pb-4 text-sm text-slate-500">{item.answer}</p>}
            </div>
          );
        })}
      </div>
    </section>
  );
}
