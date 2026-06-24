import { useState } from "react";
import { InlineText } from "../../../components/admin/inline/InlineText";
import { InlineImage } from "../../../components/admin/inline/InlineImage";
import { InlineStatList } from "../../../components/admin/inline/InlineStatList";
import { InlineChecklist } from "../../../components/admin/inline/InlineChecklist";
import { CopyIcon, PlusIcon, TrashIcon } from "../../../components/admin/icons";

interface HeroStat {
  value?: string;
  label?: string;
}

export interface HeroBanner {
  isActive?: boolean;
  badge?: string;
  title?: string;
  highlight?: string;
  subtitle?: string;
  primaryButtonText?: string;
  primaryButtonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  imageUrl?: string;
  imageStats?: HeroStat[];
  checklist?: string[];
}

export function EditableHeroSection({ banners, onChange }: { banners: HeroBanner[]; onChange: (banners: HeroBanner[]) => void }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [linkEditor, setLinkEditor] = useState<"primary" | "secondary" | null>(null);
  const safeBanners = banners.length > 0 ? banners : [{ isActive: true }];
  const index = Math.min(activeIndex, safeBanners.length - 1);
  const banner = safeBanners[index];

  const updateBanner = (patch: Partial<HeroBanner>) => {
    onChange(safeBanners.map((b, i) => (i === index ? { ...b, ...patch } : b)));
  };

  const addBanner = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([...safeBanners, { isActive: true, title: "Yangi banner" }]);
    setActiveIndex(safeBanners.length);
  };

  const duplicateBanner = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = [...safeBanners];
    next.splice(index + 1, 0, { ...banner });
    onChange(next);
  };

  const removeBanner = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (safeBanners.length <= 1) return;
    onChange(safeBanners.filter((_, i) => i !== index));
    setActiveIndex(0);
  };

  const checklist = banner.checklist ?? [];
  const imageStats = banner.imageStats ?? [];

  return (
    <section className="bg-[var(--rt-brand-primary)]/5">
      <div className="flex items-center justify-between gap-2 border-b border-dashed border-admin-accent/40 bg-admin-accent-50 px-6 py-2 text-xs">
        <div className="flex items-center gap-1">
          {safeBanners.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex(i);
              }}
              className={`rounded px-2 py-1 font-medium ${i === index ? "bg-admin-primary text-white" : "text-admin-muted hover:bg-white"}`}
            >
              Banner {i + 1}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 text-admin-muted">
          <button type="button" onClick={addBanner} className="flex items-center gap-1 font-medium hover:text-admin-primary">
            <PlusIcon className="h-3.5 w-3.5" /> Banner
          </button>
          <button type="button" onClick={duplicateBanner} className="flex items-center gap-1 font-medium hover:text-admin-primary">
            <CopyIcon className="h-3.5 w-3.5" /> Nusxalash
          </button>
          {safeBanners.length > 1 && (
            <button type="button" onClick={removeBanner} className="flex items-center gap-1 font-medium hover:text-admin-danger">
              <TrashIcon className="h-3.5 w-3.5" /> O'chirish
            </button>
          )}
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl items-stretch gap-12 px-6 py-20 lg:grid-cols-2">
        <div>
          <InlineText
            value={banner.badge}
            placeholder="Badge matni"
            onCommit={(v) => updateBanner({ badge: v })}
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--rt-brand-primary)]"
          />

          <h1 className="mt-4 text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
            <InlineText
              value={banner.title}
              placeholder="Sarlavha"
              multiline
              onCommit={(v) => updateBanner({ title: v })}
              className="leading-tight"
            />{" "}
            <InlineText
              value={banner.highlight}
              placeholder="Ajratilgan qism"
              onCommit={(v) => updateBanner({ highlight: v })}
              className="text-[var(--rt-brand-secondary)]"
            />
          </h1>

          <InlineText
            value={banner.subtitle}
            placeholder="Tasvir matni"
            multiline
            onCommit={(v) => updateBanner({ subtitle: v })}
            className="mt-5 block max-w-xl text-lg text-slate-600"
          />

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="flex flex-col gap-1">
              <div className="inline-flex items-center gap-2 rounded-lg bg-[var(--rt-accent)] px-6 py-3 font-semibold text-slate-900">
                <InlineText value={banner.primaryButtonText} placeholder="Tugma matni" onCommit={(v) => updateBanner({ primaryButtonText: v })} />
                <button type="button" onClick={(e) => { e.stopPropagation(); setLinkEditor(linkEditor === "primary" ? null : "primary"); }}>
                  🔗
                </button>
              </div>
              {linkEditor === "primary" && (
                <InlineText
                  value={banner.primaryButtonUrl}
                  placeholder="/products"
                  onCommit={(v) => updateBanner({ primaryButtonUrl: v })}
                  className="rounded border border-admin-border bg-white px-2 py-1 text-xs text-admin-muted"
                />
              )}
            </div>

            <div className="flex flex-col gap-1">
              <div className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700">
                <InlineText
                  value={banner.secondaryButtonText}
                  placeholder="Ikkinchi tugma"
                  onCommit={(v) => updateBanner({ secondaryButtonText: v })}
                />
                <button type="button" onClick={(e) => { e.stopPropagation(); setLinkEditor(linkEditor === "secondary" ? null : "secondary"); }}>
                  🔗
                </button>
              </div>
              {linkEditor === "secondary" && (
                <InlineText
                  value={banner.secondaryButtonUrl}
                  placeholder="/contact"
                  onCommit={(v) => updateBanner({ secondaryButtonUrl: v })}
                  className="rounded border border-admin-border bg-white px-2 py-1 text-xs text-admin-muted"
                />
              )}
            </div>
          </div>

          <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <InlineChecklist items={checklist} onChange={(items) => updateBanner({ checklist: items })} />
          </ul>
        </div>

        <div className="relative min-h-[28rem]">
          <div className="absolute inset-0 overflow-hidden rounded-2xl bg-slate-100">
            <InlineImage imageUrl={banner.imageUrl} alt={banner.title} className="h-full w-full object-cover" onChange={(url) => updateBanner({ imageUrl: url ?? "" })} />
          </div>

          <div className="absolute inset-x-4 bottom-4 flex flex-wrap items-end gap-2 rounded-xl bg-slate-900/85 px-4 py-4 text-center text-white backdrop-blur">
            <InlineStatList
              items={imageStats}
              onChange={(items) => updateBanner({ imageStats: items })}
              itemClassName="flex-1 min-w-[5rem]"
              valueClassName="block text-lg font-bold"
              labelClassName="mt-1 text-[10px] font-medium uppercase tracking-wide text-slate-300"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
