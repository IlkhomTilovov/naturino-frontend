import { InlineText } from "../../../components/admin/inline/InlineText";
import { DragHandleIcon, PlusIcon, TrashIcon } from "../../../components/admin/icons";
import type { PageSectionContent } from "../../../types/page";

interface Step {
  number?: string;
  label?: string;
  title?: string;
  description?: string;
  icon?: string;
}

export function EditablePrivateLabelSection({
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
  const addStep = () => onFieldChange("steps", [...steps, { number: String(steps.length + 1).padStart(2, "0"), label: "Yangi bosqich" }]);

  return (
    <section className="relative overflow-hidden bg-[var(--rt-brand-primary)] px-4 py-20 text-center text-white sm:px-6 sm:py-28">
      <div className="relative z-10 mx-auto max-w-5xl">
        <InlineText
          value={eyebrow}
          placeholder="Eyebrow matni"
          onCommit={(v) => onFieldChange("eyebrow", v)}
          className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--rt-accent)]"
        />
        <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
          <InlineText value={title} placeholder="Sarlavha" onCommit={(v) => onFieldChange("title", v)} />
        </h2>
        <InlineText
          value={subtitle}
          placeholder="Matn"
          multiline
          onCommit={(v) => onFieldChange("subtitle", v)}
          className="mx-auto mt-5 block max-w-2xl text-base text-white/70 sm:text-lg"
        />

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
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
              className="group relative rounded-3xl border border-[var(--rt-accent)]/10 bg-[color-mix(in_srgb,var(--rt-brand-primary),black_15%)]/50 p-7 text-left backdrop-blur"
            >
              <div className="invisible absolute right-2 top-2 flex items-center gap-1 group-hover:visible">
                <span className="flex h-5 w-5 cursor-grab items-center justify-center rounded-full bg-white/10 text-white/70">
                  <DragHandleIcon className="h-3 w-3" />
                </span>
                <button type="button" onClick={(e) => { e.stopPropagation(); removeStep(i); }} className="flex h-5 w-5 items-center justify-center rounded-full bg-admin-danger text-white">
                  <TrashIcon className="h-2.5 w-2.5" />
                </button>
              </div>

              <p className="text-6xl font-bold tracking-tight text-[var(--rt-accent)] sm:text-7xl">
                <InlineText value={step.number} placeholder="01" onCommit={(v) => updateStep(i, { number: v })} />
              </p>
              <p className="mt-4 text-base font-semibold text-white">
                <InlineText value={step.title ?? step.label} placeholder="Nomi" onCommit={(v) => updateStep(i, { label: v, title: v })} />
              </p>
              <InlineText
                value={step.description}
                placeholder="Tavsif"
                multiline
                onCommit={(v) => updateStep(i, { description: v })}
                className="mt-2 block text-sm leading-relaxed text-white/60"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addStep}
            className="flex min-h-[12rem] items-center justify-center gap-1.5 rounded-3xl border-2 border-dashed border-white/20 text-sm font-medium text-white/60 hover:border-white/40 hover:text-white"
          >
            <PlusIcon className="h-3.5 w-3.5" /> Bosqich qo'shish
          </button>
        </div>

        <div className="mt-16 border-t border-white/10 pt-12 sm:mt-20">
          <h3 className="text-2xl font-bold text-white sm:text-3xl">
            <InlineText value={ctaTitle} placeholder="CTA sarlavhasi" onCommit={(v) => onFieldChange("ctaTitle", v)} />
          </h3>
          <InlineText
            value={ctaSubtitle}
            placeholder="CTA matni"
            multiline
            onCommit={(v) => onFieldChange("ctaSubtitle", v)}
            className="mx-auto mt-3 block max-w-xl text-white/65"
          />
          <div className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[var(--rt-accent)] px-7 py-3.5 font-semibold text-[var(--rt-brand-primary)]">
            <InlineText value={buttonText} placeholder="Tugma matni" onCommit={(v) => onFieldChange("buttonText", v)} />
          </div>
          <InlineText
            value={buttonUrl}
            placeholder="/partnership"
            onCommit={(v) => onFieldChange("buttonUrl", v)}
            className="ml-3 inline-block rounded border border-white/30 bg-white/10 px-2 py-1 text-xs text-white/70"
          />
        </div>
      </div>
    </section>
  );
}
