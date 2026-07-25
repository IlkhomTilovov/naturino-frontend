import { InlineText } from "../../../components/admin/inline/InlineText";
import { InlineImage } from "../../../components/admin/inline/InlineImage";
import { InlineChecklist } from "../../../components/admin/inline/InlineChecklist";
import type { PageSectionContent } from "../../../types/page";

const NAT = { forest: "#294A34" } as const;

export function EditableBadgeListHeroSection({
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
  const checklist = (content.checklist as string[] | undefined) ?? [];
  const imageUrl = content.imageUrl as string | undefined;

  return (
    <section className="px-6 py-16 sm:py-20" style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #F3EDE1 100%)" }}>
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="text-center lg:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.2em]">
            <InlineText value={eyebrow} placeholder="Eyebrow matni" onCommit={(v) => onFieldChange("eyebrow", v)} />
          </p>
          <h1 className="mt-3 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl">
            <InlineText value={title} placeholder="Sarlavha" multiline onCommit={(v) => onFieldChange("title", v)} />
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed sm:text-lg lg:mx-0">
            <InlineText value={subtitle} placeholder="Tasvir matni" multiline onCommit={(v) => onFieldChange("subtitle", v)} />
          </p>

          <ul className="mx-auto mt-6 flex max-w-lg flex-wrap justify-center gap-2.5 lg:mx-0 lg:justify-start">
            <InlineChecklist items={checklist} onChange={(v) => onFieldChange("checklist", v)} />
          </ul>

          <div className="mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white" style={{ background: NAT.forest }}>
            <InlineText value={buttonText} placeholder="Tugma matni" onCommit={(v) => onFieldChange("buttonText", v)} />
          </div>
        </div>

        <div className="h-72 w-full sm:h-[28rem]">
          <InlineImage
            imageUrl={imageUrl}
            alt={title}
            className="h-full w-full rounded-2xl object-cover"
            onChange={(url) => onFieldChange("imageUrl", url)}
          />
        </div>
      </div>
    </section>
  );
}
