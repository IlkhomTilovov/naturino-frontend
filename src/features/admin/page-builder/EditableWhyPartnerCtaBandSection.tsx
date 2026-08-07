import { InlineText } from "../../../components/admin/inline/InlineText";
import { InlineChecklist } from "../../../components/admin/inline/InlineChecklist";
import type { PageSectionContent } from "../../../types/page";

export function EditableWhyPartnerCtaBandSection({
  content,
  onFieldChange,
}: {
  content: PageSectionContent;
  onFieldChange: (key: string, value: unknown) => void;
}) {
  const title = content.title as string | undefined;
  const subtitle = content.subtitle as string | undefined;
  const checklist = (content.checklist as string[] | undefined) ?? [];
  const buttonText = content.buttonText as string | undefined;

  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl rounded-[28px] bg-[var(--rt-brand-primary)] p-8 sm:p-12">
        <div className="grid items-center gap-8 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <h2 className="text-2xl font-bold leading-tight text-white sm:text-3xl">
              <InlineText value={title} placeholder="Sarlavha" onCommit={(v) => onFieldChange("title", v)} />
            </h2>
            <p className="mt-3 max-w-xl text-white/70">
              <InlineText
                value={subtitle}
                placeholder="Tasvir matni"
                multiline
                onCommit={(v) => onFieldChange("subtitle", v)}
              />
            </p>

            <ul className="mt-5 space-y-1.5 rounded-lg bg-white/10 p-2">
              <InlineChecklist items={checklist} onChange={(v) => onFieldChange("checklist", v)} />
            </ul>
          </div>

          <div className="flex lg:justify-end">
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--rt-accent)] px-7 py-3.5 text-sm font-semibold text-[#294A34]">
              <InlineText value={buttonText} placeholder="Tugma matni" onCommit={(v) => onFieldChange("buttonText", v)} />
              <span aria-hidden>→</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
