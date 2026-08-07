import { InlineText } from "../../../components/admin/inline/InlineText";
import type { PageSectionContent } from "../../../types/page";

export function EditableQualityPledgeSection({
  content,
  onFieldChange,
}: {
  content: PageSectionContent;
  onFieldChange: (key: string, value: unknown) => void;
}) {
  const quote = content.quote as string | undefined;
  const author = content.author as string | undefined;
  const role = content.role as string | undefined;

  return (
    <section className="bg-[#F3EDE1] px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <span className="mx-auto block text-6xl font-serif leading-none text-[var(--rt-brand-secondary)]/40" aria-hidden>
          &ldquo;
        </span>
        <blockquote className="text-2xl font-semibold leading-snug text-[#294A34] sm:text-3xl">
          <InlineText
            value={quote}
            placeholder="Iqtibos matni"
            multiline
            onCommit={(v) => onFieldChange("quote", v)}
          />
        </blockquote>
        <p className="mt-6 text-sm font-medium text-taupe">
          <InlineText value={author} placeholder="Muallif" onCommit={(v) => onFieldChange("author", v)} />
          {" — "}
          <InlineText value={role} placeholder="Lavozim" onCommit={(v) => onFieldChange("role", v)} />
        </p>
      </div>
    </section>
  );
}
