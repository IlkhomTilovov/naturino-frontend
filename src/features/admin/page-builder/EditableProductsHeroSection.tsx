import { InlineText } from "../../../components/admin/inline/InlineText";
import type { PageSectionContent } from "../../../types/page";

export function EditableProductsHeroSection({
  content,
  onFieldChange,
}: {
  content: PageSectionContent;
  onFieldChange: (key: string, value: unknown) => void;
}) {
  const breadcrumbHome = content.breadcrumbHome as string | undefined;
  const breadcrumbCurrent = content.breadcrumbCurrent as string | undefined;
  const title = content.title as string | undefined;
  const subtitle = content.subtitle as string | undefined;

  return (
    <section
      className="relative overflow-hidden px-6 pb-14 pt-32 text-center text-white sm:pb-16 sm:pt-36"
      style={{ background: "var(--rt-brand-primary, #1a4731)" }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 0%, color-mix(in srgb, #c8a84b 12%, transparent) 0%, transparent 55%), radial-gradient(circle at 100% 100%, color-mix(in srgb, #2d6a4f 25%, transparent) 0%, transparent 55%)",
        }}
      />
      <div className="relative z-10 mx-auto max-w-3xl">
        <p className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "#c8a84b" }}>
          <span className="text-white/50">
            <InlineText value={breadcrumbHome} placeholder="Bosh sahifa" onCommit={(v) => onFieldChange("breadcrumbHome", v)} />
          </span>
          <span className="text-white/30">/</span>
          <span>
            <InlineText value={breadcrumbCurrent} placeholder="PRODUCTS" onCommit={(v) => onFieldChange("breadcrumbCurrent", v)} />
          </span>
        </p>
        <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
          <InlineText
            value={title}
            placeholder="Sahifa sarlavhasi"
            onCommit={(v) => onFieldChange("title", v)}
          />
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-white/70">
          <InlineText
            value={subtitle}
            placeholder="Kichik tavsif matni"
            multiline
            onCommit={(v) => onFieldChange("subtitle", v)}
          />
        </p>
      </div>
    </section>
  );
}
