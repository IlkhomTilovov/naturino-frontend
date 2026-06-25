import { InlineText } from "../../../components/admin/inline/InlineText";
import { DragHandleIcon, PlusIcon, TrashIcon } from "../../../components/admin/icons";
import type { PageSectionContent } from "../../../types/page";

interface Step {
  number?: string;
  title?: string;
  description?: string;
  icon?: string;
}

export function EditableProcessSection({
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
  const buttonText = content.buttonText as string | undefined;
  const buttonUrl = content.buttonUrl as string | undefined;
  const ctaTitle = content.ctaTitle as string | undefined;
  const ctaSubtitle = content.ctaSubtitle as string | undefined;

  const updateStep = (i: number, patch: Partial<Step>) => onFieldChange("steps", steps.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  const removeStep = (i: number) => onFieldChange("steps", steps.filter((_, idx) => idx !== i));
  const addStep = () => onFieldChange("steps", [...steps, { number: String(steps.length + 1).padStart(2, "0"), title: "Yangi bosqich", description: "" }]);

  return (
    <section className="px-4 py-20 text-center sm:px-6 sm:py-28">
      <div className="mx-auto max-w-4xl">
        <InlineText
          value={eyebrow}
          placeholder="Eyebrow matni"
          onCommit={(v) => onFieldChange("eyebrow", v)}
          className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--rt-brand-primary)]"
        />
        <h2 className="mt-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
          <InlineText value={title} placeholder="Sarlavha" onCommit={(v) => onFieldChange("title", v)} />
        </h2>
        <InlineText
          value={subtitle}
          placeholder="Matn"
          multiline
          onCommit={(v) => onFieldChange("subtitle", v)}
          className="mx-auto mt-4 block max-w-2xl text-base text-slate-500 sm:text-lg"
        />

        <div className="mt-16 grid gap-10 sm:grid-cols-3 sm:items-start">
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
              className="group relative flex flex-col items-center rounded-2xl px-3 py-4"
            >
              <button type="button" onClick={(e) => { e.stopPropagation(); removeStep(i); }} className="invisible absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-admin-danger text-white group-hover:visible">
                <TrashIcon className="h-2.5 w-2.5" />
              </button>
              <span className="invisible absolute left-1 top-1 flex h-5 w-5 cursor-grab items-center justify-center rounded-full bg-slate-100 text-slate-400 group-hover:visible">
                <DragHandleIcon className="h-3 w-3" />
              </span>

              <span className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full border border-slate-200 bg-white text-4xl font-bold text-slate-900 shadow-sm sm:h-24 sm:w-24 sm:text-6xl">
                <InlineText value={step.number} placeholder="01" onCommit={(v) => updateStep(i, { number: v })} />
              </span>
              <h3 className="mt-4 font-semibold text-slate-900">
                <InlineText value={step.title} placeholder="Sarlavha" onCommit={(v) => updateStep(i, { title: v })} />
              </h3>
              <InlineText
                value={step.description}
                placeholder="Tavsif"
                multiline
                onCommit={(v) => updateStep(i, { description: v })}
                className="mt-2 block text-sm text-slate-500"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addStep}
            className="flex min-h-[10rem] items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-slate-300 text-sm font-medium text-admin-muted hover:border-admin-primary hover:text-admin-primary"
          >
            <PlusIcon className="h-3.5 w-3.5" /> Bosqich qo'shish
          </button>
        </div>

        <div className="mt-14">
          <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">
            <InlineText value={ctaTitle} placeholder="CTA sarlavhasi" onCommit={(v) => onFieldChange("ctaTitle", v)} />
          </h3>
          <InlineText
            value={ctaSubtitle}
            placeholder="CTA matni"
            multiline
            onCommit={(v) => onFieldChange("ctaSubtitle", v)}
            className="mx-auto mt-2 block max-w-xl text-sm text-slate-500 sm:text-base"
          />
          <div className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[var(--rt-accent)] px-6 py-3 font-semibold text-slate-900">
            <InlineText value={buttonText} placeholder="Tugma matni" onCommit={(v) => onFieldChange("buttonText", v)} />
          </div>
          <InlineText
            value={buttonUrl}
            placeholder="/contact"
            onCommit={(v) => onFieldChange("buttonUrl", v)}
            className="ml-3 inline-block rounded border border-admin-border bg-white px-2 py-1 text-xs text-admin-muted"
          />
        </div>
      </div>
    </section>
  );
}
