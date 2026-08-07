import { InlineText } from "../../../components/admin/inline/InlineText";
import { InlineImage } from "../../../components/admin/inline/InlineImage";
import type { PageSectionContent } from "../../../types/page";

export function EditableWhyPartnerQuoteSection({
  content,
  onFieldChange,
}: {
  content: PageSectionContent;
  onFieldChange: (key: string, value: unknown) => void;
}) {
  const quote = content.quote as string | undefined;
  const author = content.author as string | undefined;
  const role = content.role as string | undefined;
  const avatarUrl = content.avatarUrl as string | undefined;

  return (
    <section className="bg-[#F3EDE1] px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-3xl rounded-[28px] bg-white p-8 text-center shadow-[0_15px_40px_rgba(0,0,0,0.06)] sm:p-12">
        <span className="text-5xl font-serif leading-none text-[var(--rt-brand-secondary)]/40" aria-hidden>
          &ldquo;
        </span>
        <blockquote className="mt-2 text-xl font-medium leading-relaxed text-[#294A34] sm:text-2xl">
          <InlineText value={quote} placeholder="Iqtibos matni" multiline onCommit={(v) => onFieldChange("quote", v)} />
        </blockquote>

        <div className="mt-6 flex items-center justify-center gap-3">
          <InlineImage
            imageUrl={avatarUrl}
            alt={author}
            className="h-12 w-12 rounded-full object-cover"
            onChange={(url) => onFieldChange("avatarUrl", url)}
          />
          <div className="text-left">
            <p className="text-sm font-semibold text-[#294A34]">
              <InlineText value={author} placeholder="Muallif" onCommit={(v) => onFieldChange("author", v)} />
            </p>
            <p className="text-xs text-taupe">
              <InlineText value={role} placeholder="Lavozim" onCommit={(v) => onFieldChange("role", v)} />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
