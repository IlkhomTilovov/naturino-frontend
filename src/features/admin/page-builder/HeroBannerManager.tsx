import { useState } from "react";
import { RepeaterEditor } from "../../../components/admin/RepeaterEditor";
import { StringListEditor } from "../../../components/admin/StringListEditor";
import { MediaUploaderField } from "../../../components/admin/MediaUploaderField";

interface HeroBanner {
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
  mobileImageUrl?: string;
  imageStats?: Record<string, unknown>[];
  checklist?: string[];
  [key: string]: unknown;
}

const EMPTY_BANNER: HeroBanner = {
  isActive: true,
  badge: "",
  title: "",
  highlight: "",
  subtitle: "",
  primaryButtonText: "",
  primaryButtonUrl: "",
  secondaryButtonText: "",
  secondaryButtonUrl: "",
  imageUrl: "",
  mobileImageUrl: "",
  imageStats: [],
  checklist: [],
};

export function HeroBannerManager({ banners, onChange }: { banners: HeroBanner[]; onChange: (banners: HeroBanner[]) => void }) {
  const [expandedIndex, setExpandedIndex] = useState(0);

  const update = (index: number, patch: Partial<HeroBanner>) => {
    onChange(banners.map((b, i) => (i === index ? { ...b, ...patch } : b)));
  };

  const remove = (index: number) => onChange(banners.filter((_, i) => i !== index));

  const duplicate = (index: number) => {
    const copy = { ...banners[index] };
    const next = [...banners];
    next.splice(index + 1, 0, copy);
    onChange(next);
  };

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= banners.length) return;
    const next = [...banners];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
    setExpandedIndex(target);
  };

  const add = () => {
    onChange([...banners, { ...EMPTY_BANNER }]);
    setExpandedIndex(banners.length);
  };

  return (
    <div className="space-y-3">
      {banners.map((banner, index) => (
        <div key={index} className="rounded-xl border border-admin-border bg-white">
          <div
            className="flex cursor-pointer items-center justify-between px-4 py-3"
            onClick={() => setExpandedIndex(expandedIndex === index ? -1 : index)}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-admin-primary">Banner {index + 1}</span>
              {banner.isActive === false && (
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-admin-muted">O'chirilgan</span>
              )}
              {banner.title && <span className="truncate text-xs text-admin-muted">— {banner.title}</span>}
            </div>
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <button type="button" onClick={() => move(index, -1)} disabled={index === 0} className="px-1 text-admin-muted hover:text-admin-primary disabled:opacity-30">
                ↑
              </button>
              <button type="button" onClick={() => move(index, 1)} disabled={index === banners.length - 1} className="px-1 text-admin-muted hover:text-admin-primary disabled:opacity-30">
                ↓
              </button>
              <label className="flex items-center gap-1 px-2 text-xs">
                <input type="checkbox" checked={banner.isActive !== false} onChange={(e) => update(index, { isActive: e.target.checked })} />
                Faol
              </label>
              <button type="button" onClick={() => duplicate(index)} className="px-2 text-xs font-medium text-admin-muted hover:text-admin-primary">
                Nusxalash
              </button>
              <button type="button" onClick={() => remove(index)} className="px-2 text-xs font-medium text-admin-danger">
                O'chirish
              </button>
            </div>
          </div>

          {expandedIndex === index && (
            <div className="space-y-3 border-t border-admin-border p-4">
              <div className="grid grid-cols-2 gap-3">
                <LabeledInput label="Badge matni" value={banner.badge} onChange={(v) => update(index, { badge: v })} />
                <LabeledInput label="Sarlavha" value={banner.title} onChange={(v) => update(index, { title: v })} />
                <LabeledInput label="Ajratilgan qism (yashil)" value={banner.highlight} onChange={(v) => update(index, { highlight: v })} />
                <LabeledInput label="Asosiy tugma matni" value={banner.primaryButtonText} onChange={(v) => update(index, { primaryButtonText: v })} />
                <LabeledInput label="Asosiy tugma havolasi" value={banner.primaryButtonUrl} onChange={(v) => update(index, { primaryButtonUrl: v })} />
                <LabeledInput label="Ikkinchi tugma matni" value={banner.secondaryButtonText} onChange={(v) => update(index, { secondaryButtonText: v })} />
                <LabeledInput label="Ikkinchi tugma havolasi" value={banner.secondaryButtonUrl} onChange={(v) => update(index, { secondaryButtonUrl: v })} />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-admin-muted">Tasvir matni</label>
                <textarea className="input" rows={2} value={banner.subtitle ?? ""} onChange={(e) => update(index, { subtitle: e.target.value })} />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-admin-muted">Rasm (desktop)</label>
                <MediaUploaderField imageUrl={banner.imageUrl} onChange={(url) => update(index, { imageUrl: url ?? "" })} />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-admin-muted">Rasm (mobil, ixtiyoriy)</label>
                <MediaUploaderField imageUrl={banner.mobileImageUrl} onChange={(url) => update(index, { mobileImageUrl: url ?? "" })} />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-admin-muted">Rasm ustidagi statistika</label>
                <RepeaterEditor
                  items={banner.imageStats ?? []}
                  fields={[
                    { key: "value", label: "Qiymat" },
                    { key: "label", label: "Yorlik" },
                  ]}
                  onChange={(items) => update(index, { imageStats: items })}
                  addLabel="Statistika qo'shish"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-admin-muted">Belgilar ro'yxati</label>
                <StringListEditor items={banner.checklist ?? []} onChange={(items) => update(index, { checklist: items })} />
              </div>
            </div>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="w-full rounded-lg border border-dashed border-admin-border py-2 text-sm font-medium text-admin-muted hover:border-admin-primary hover:text-admin-primary"
      >
        + Banner qo'shish
      </button>
    </div>
  );
}

function LabeledInput({ label, value, onChange }: { label: string; value?: string; onChange: (value: string) => void }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-admin-muted">{label}</label>
      <input className="input" value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
