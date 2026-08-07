import { InlineText } from "../../../components/admin/inline/InlineText";
import { InlineImage } from "../../../components/admin/inline/InlineImage";
import { InlineChecklist } from "../../../components/admin/inline/InlineChecklist";
import type { PageSectionContent } from "../../../types/page";

export function EditableQualityChecklistSection({
  content,
  onFieldChange,
}: {
  content: PageSectionContent;
  onFieldChange: (key: string, value: unknown) => void;
}) {
  const eyebrow = content.eyebrow as string | undefined;
  const title = content.title as string | undefined;
  const subtitle = content.subtitle as string | undefined;
  const checklist = (content.checklist as string[] | undefined) ?? [];
  const buttonText = content.buttonText as string | undefined;
  const imageUrl = content.imageUrl as string | undefined;

  return (
    <section className="bg-[#F3EDE1] px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.85fr_1.3fr]">
        <div className="order-2 min-w-0 overflow-hidden rounded-[28px]">
          <InlineImage
            imageUrl={imageUrl}
            alt={title}
            className="h-96 w-full object-cover sm:h-[32rem] lg:h-[36rem]"
            onChange={(url) => onFieldChange("imageUrl", url)}
          />
        </div>

        <div className="order-1 min-w-0">
          <InlineText
            value={eyebrow}
            placeholder="Eyebrow matni"
            onCommit={(v) => onFieldChange("eyebrow", v)}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--rt-brand-secondary)]"
          />
          <h2 className="mt-4 text-3xl font-bold leading-tight text-[#294A34] sm:text-4xl">
            <InlineText value={title} placeholder="Sarlavha" onCommit={(v) => onFieldChange("title", v)} />
          </h2>
          <InlineText
            value={subtitle}
            placeholder="Tasvir matni"
            multiline
            onCommit={(v) => onFieldChange("subtitle", v)}
            className="mt-3 block text-taupe"
          />

          <ul className="mt-6 space-y-3.5">
            <InlineChecklist
              items={checklist}
              onChange={(v) => onFieldChange("checklist", v)}
              itemClassName="group flex items-start gap-2.5"
              checkClassName="mt-0.5 text-base font-bold leading-none text-[#E2622C]"
              textClassName="text-sm font-bold uppercase tracking-wide text-[#294A34]"
            />
          </ul>

          <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--rt-brand-primary)] px-6 py-3 text-sm font-semibold text-white">
            <InlineText value={buttonText} placeholder="Tugma matni" onCommit={(v) => onFieldChange("buttonText", v)} />
            <span aria-hidden>→</span>
          </div>
        </div>
      </div>
    </section>
  );
}
