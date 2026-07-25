import { InlineText } from "../../../components/admin/inline/InlineText";
import { InlineImage } from "../../../components/admin/inline/InlineImage";
import type { PageSectionContent } from "../../../types/page";

export function EditableBackgroundHeroSection({
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
  const backgroundImageUrl = content.backgroundImageUrl as string | undefined;

  return (
    <section className="relative overflow-hidden px-6 py-24 sm:py-32">
      <div className="absolute inset-0">
        <InlineImage
          imageUrl={backgroundImageUrl}
          alt={title}
          className="h-full w-full object-cover"
          onChange={(url) => onFieldChange("backgroundImageUrl", url)}
        />
      </div>
      <div className="absolute inset-0 bg-[#0F1A12]/55" />

      <div className="relative mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--rt-accent)]">
          <InlineText value={eyebrow} placeholder="Eyebrow matni" onCommit={(v) => onFieldChange("eyebrow", v)} />
        </p>
        <h1 className="mt-4 text-4xl font-extrabold leading-[1.1] text-white sm:text-5xl">
          <InlineText value={title} placeholder="Sarlavha" multiline onCommit={(v) => onFieldChange("title", v)} />
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
          <InlineText value={subtitle} placeholder="Tasvir matni" multiline onCommit={(v) => onFieldChange("subtitle", v)} />
        </p>
        <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--rt-accent)] px-6 py-3 text-sm font-semibold text-[#294A34]">
          <InlineText value={buttonText} placeholder="Tugma matni" onCommit={(v) => onFieldChange("buttonText", v)} />
        </div>
      </div>
    </section>
  );
}
