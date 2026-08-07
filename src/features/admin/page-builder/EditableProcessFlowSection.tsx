import { InlineText } from "../../../components/admin/inline/InlineText";
import { DragHandleIcon, PlusIcon, TrashIcon } from "../../../components/admin/icons";
import type { PageSectionContent } from "../../../types/page";

interface Step {
  icon?: string;
  title?: string;
}

export function EditableProcessFlowSection({
  content,
  onFieldChange,
}: {
  content: PageSectionContent;
  onFieldChange: (key: string, value: unknown) => void;
}) {
  const eyebrow = content.eyebrow as string | undefined;
  const title = content.title as string | undefined;
  const subtitle = content.subtitle as string | undefined;
  const steps = (content.steps as Step[] | undefined) ?? [];

  const update = (i: number, patch: Partial<Step>) =>
    onFieldChange("steps", steps.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  const remove = (i: number) => onFieldChange("steps", steps.filter((_, idx) => idx !== i));
  const add = () => onFieldChange("steps", [...steps, { icon: "inquiry", title: "Yangi bosqich" }]);

  return (
    <section className="bg-sand-50 px-4 py-16 text-center sm:px-6 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <InlineText
          value={eyebrow}
          placeholder="Eyebrow matni"
          onCommit={(v) => onFieldChange("eyebrow", v)}
          className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--rt-brand-primary)]"
        />
        <h2 className="mt-4 text-3xl font-bold leading-tight text-[#294A34] sm:text-4xl">
          <InlineText value={title} placeholder="Sarlavha" onCommit={(v) => onFieldChange("title", v)} />
        </h2>
        <InlineText
          value={subtitle}
          placeholder="Tasvir matni"
          multiline
          onCommit={(v) => onFieldChange("subtitle", v)}
          className="mx-auto mt-4 block max-w-2xl text-base text-taupe sm:text-lg"
        />

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          {steps.map((step, i) => (
            <div
              key={i}
              draggable
              onDragStart={(e) => e.dataTransfer.setData("text/plain", String(i))}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const from = Number(e.dataTransfer.getData("text/plain"));
                if (from === i) return;
                const next = [...steps];
                const [moved] = next.splice(from, 1);
                next.splice(i, 0, moved);
                onFieldChange("steps", next);
              }}
              className="group relative flex flex-col items-center gap-2 rounded-2xl border border-transparent p-2 hover:border-slate-200"
            >
              <div className="invisible absolute right-0 top-0 flex items-center gap-1 group-hover:visible">
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
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-herb/50 bg-white text-[var(--rt-brand-primary)] shadow-sm">
                <InlineText
                  value={step.icon}
                  placeholder="ikon"
                  onCommit={(v) => update(i, { icon: v })}
                  className="text-[10px] font-semibold uppercase text-admin-muted"
                />
              </span>
              <p className="max-w-[6.5rem] text-xs font-semibold text-[#294A34]">
                <InlineText value={step.title} placeholder="Sarlavha" onCommit={(v) => update(i, { title: v })} />
              </p>
            </div>
          ))}
          <button
            type="button"
            onClick={add}
            className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-slate-300 text-admin-muted hover:border-admin-primary hover:text-admin-primary"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
