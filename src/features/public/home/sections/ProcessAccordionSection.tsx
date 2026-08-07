import { useState } from "react";
import type { PageSectionContent } from "../../../../types/page";

interface Step {
  title: string;
  description?: string;
}

// An expandable step list — for a detailed, multi-paragraph process where
// showing every step's full text at once (as the other Process variants do)
// would make the section too long.
export function ProcessAccordionSection({ content }: { content: PageSectionContent }) {
  const eyebrow = content.eyebrow as string | undefined;
  const title = content.title as string | undefined;
  const subtitle = content.subtitle as string | undefined;
  const steps = (content.steps as Step[] | undefined) ?? [];
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!title) return null;

  return (
    <section className="bg-white px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--rt-brand-primary)]">{eyebrow}</p>
          )}
          <h2 className="mt-4 text-3xl font-bold leading-tight text-[#294A34] sm:text-4xl">{title}</h2>
          {subtitle && <p className="mx-auto mt-4 max-w-2xl text-base text-taupe sm:text-lg">{subtitle}</p>}
        </div>

        {steps.length > 0 && (
          <div className="mt-10 divide-y divide-herb/50 rounded-2xl border border-herb/50">
            {steps.map((step, i) => {
              const isOpen = openIndex === i;
              return (
                <div key={i}>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="flex w-full items-center gap-4 px-6 py-4 text-left"
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                        isOpen ? "bg-[var(--rt-brand-primary)] text-white" : "bg-[#F3EDE1] text-[#294A34]"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span className="flex-1 font-medium text-[#294A34]">{step.title}</span>
                    <span className={`shrink-0 text-[var(--rt-brand-primary)] transition-transform ${isOpen ? "rotate-45" : ""}`}>
                      +
                    </span>
                  </button>
                  {isOpen && step.description && <p className="px-6 pb-4 pl-[3.75rem] text-sm text-taupe">{step.description}</p>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
