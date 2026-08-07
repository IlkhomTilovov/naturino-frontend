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
  const buttonText2 = content.buttonText2 as string | undefined;
  const backgroundImageUrl = content.backgroundImageUrl as string | undefined;
  const isCentered = content.contentAlign === "center";

  return (
    <section className="relative w-full overflow-hidden bg-[#294A34]">
      <InlineImage
        imageUrl={backgroundImageUrl}
        alt={title}
        className="block h-[85vh] w-full object-cover object-center"
        onChange={(url) => onFieldChange("backgroundImageUrl", url)}
      />
      <div className="absolute inset-0 bg-[#0F1A12]/55" />

      <div
        className={`absolute inset-0 flex items-center px-6 sm:px-12 lg:px-20 ${isCentered ? "justify-center text-center" : ""}`}
      >
        <div className={`max-w-xl ${isCentered ? "mx-auto text-center" : "text-left"}`}>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--rt-accent)]">
            <InlineText value={eyebrow} placeholder="Eyebrow matni" onCommit={(v) => onFieldChange("eyebrow", v)} />
          </p>
          <h1 className="mt-4 text-4xl font-extrabold leading-[1.1] text-white sm:text-5xl">
            <InlineText value={title} placeholder="Sarlavha" multiline onCommit={(v) => onFieldChange("title", v)} />
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
            <InlineText value={subtitle} placeholder="Tasvir matni" multiline onCommit={(v) => onFieldChange("subtitle", v)} />
          </p>
          <div className={`mt-8 flex flex-wrap items-center gap-4 ${isCentered ? "justify-center" : "justify-start"}`}>
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--rt-accent)] px-6 py-3 text-sm font-semibold text-[#294A34]">
              <InlineText value={buttonText} placeholder="1-tugma matni" onCommit={(v) => onFieldChange("buttonText", v)} />
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/70 px-6 py-3 text-sm font-semibold text-white">
              <InlineText value={buttonText2} placeholder="2-tugma matni" onCommit={(v) => onFieldChange("buttonText2", v)} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
