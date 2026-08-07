import { InlineText } from "../../../components/admin/inline/InlineText";
import { InlineImage } from "../../../components/admin/inline/InlineImage";
import { DragHandleIcon, PlusIcon, TrashIcon } from "../../../components/admin/icons";
import type { PageSectionContent } from "../../../types/page";

interface Logo {
  imageUrl?: string;
  name?: string;
}

export function EditableExportCapabilitiesSection({
  content,
  onFieldChange,
}: {
  content: PageSectionContent;
  onFieldChange: (key: string, value: unknown) => void;
}) {
  const flag = content.flag as string | undefined;
  const title = content.title as string | undefined;
  const subtitle = content.subtitle as string | undefined;
  const logos = (content.logos as Logo[] | undefined) ?? [];

  const update = (i: number, patch: Partial<Logo>) =>
    onFieldChange("logos", logos.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));
  const remove = (i: number) => onFieldChange("logos", logos.filter((_, idx) => idx !== i));
  const add = () => onFieldChange("logos", [...logos, { imageUrl: undefined, name: "" }]);

  return (
    <section className="bg-[#F3EDE1] px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-4xl leading-none">
          <InlineText value={flag} placeholder="🏳️" onCommit={(v) => onFieldChange("flag", v)} />
        </p>
        <h2 className="mt-3 text-lg font-bold uppercase tracking-wide text-[#294A34] sm:text-xl">
          <InlineText value={title} placeholder="Sarlavha (masalan: Ishlab chiqarilgan joyi)" onCommit={(v) => onFieldChange("title", v)} />
        </h2>
        <InlineText
          value={subtitle}
          placeholder="Tasvir matni"
          multiline
          onCommit={(v) => onFieldChange("subtitle", v)}
          className="mx-auto mt-3 block max-w-xl text-sm text-taupe sm:text-base"
        />

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {logos.map((logo, i) => (
            <div
              key={i}
              draggable
              onDragStart={(e) => e.dataTransfer.setData("text/plain", String(i))}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const from = Number(e.dataTransfer.getData("text/plain"));
                if (from === i) return;
                const next = [...logos];
                const [moved] = next.splice(from, 1);
                next.splice(i, 0, moved);
                onFieldChange("logos", next);
              }}
              className="group relative flex h-16 w-28 items-center justify-center rounded-xl border border-[var(--rt-brand-primary)]/10 bg-white p-3 shadow-sm"
            >
              <div className="invisible absolute -right-1.5 -top-1.5 flex items-center gap-1 group-hover:visible">
                <span className="flex h-5 w-5 cursor-grab items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <DragHandleIcon className="h-3 w-3" />
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(i);
                  }}
                  className="flex h-5 w-5 items-center justify-center rounded-full bg-admin-danger text-white"
                >
                  <TrashIcon className="h-2.5 w-2.5" />
                </button>
              </div>
              <InlineImage
                imageUrl={logo.imageUrl}
                alt={logo.name}
                className="h-full w-full object-contain"
                onChange={(url) => update(i, { imageUrl: url ?? undefined })}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={add}
            className="flex h-16 w-28 items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-slate-300 text-xs font-medium text-admin-muted hover:border-admin-primary hover:text-admin-primary"
          >
            <PlusIcon className="h-3.5 w-3.5" /> Logotip
          </button>
        </div>
      </div>
    </section>
  );
}
