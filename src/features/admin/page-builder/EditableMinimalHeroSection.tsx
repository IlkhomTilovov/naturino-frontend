import { InlineText } from "../../../components/admin/inline/InlineText";
import type { PageSectionContent } from "../../../types/page";

const NAT = { forest: "#294A34" } as const;

export function EditableMinimalHeroSection({
  content,
  onFieldChange,
}: {
  content: PageSectionContent;
  onFieldChange: (key: string, value: unknown) => void;
}) {
  const eyebrow = content.eyebrow as string | undefined;
  const title = content.title as string | undefined;
  const subtitle = content.subtitle as string | undefined;
  const buttonText = content.buttonText as string | undefined;

  return (
    <section className="px-6 py-14 sm:py-18">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em]">
          <InlineText value={eyebrow} placeholder="Eyebrow matni" onCommit={(v) => onFieldChange("eyebrow", v)} />
        </p>
        <h1 className="mt-3 text-3xl font-extrabold leading-[1.15] tracking-tight sm:text-4xl">
          <InlineText value={title} placeholder="Sarlavha" multiline onCommit={(v) => onFieldChange("title", v)} />
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed">
          <InlineText value={subtitle} placeholder="Tasvir matni" multiline onCommit={(v) => onFieldChange("subtitle", v)} />
        </p>
        <div className="mt-6 inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white" style={{ background: NAT.forest }}>
          <InlineText value={buttonText} placeholder="Tugma matni" onCommit={(v) => onFieldChange("buttonText", v)} />
        </div>
      </div>
    </section>
  );
}
