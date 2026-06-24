import { MediaUploaderField } from "../../../components/admin/MediaUploaderField";
import { Button } from "../../../components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../../../components/ui/sheet";
import { computePageSeoScore } from "../../../lib/utils/pageSeo";
import type { Page } from "../../../types/page";

export interface SeoDraft {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogImageFileId: string | null | undefined;
  ogImageUrl: string | null;
  isIndexable: boolean;
  isFollow: boolean;
}

export function SeoPanel({
  page,
  draft,
  onChange,
  onClose,
  onSave,
  isSaving,
}: {
  page: Page;
  draft: SeoDraft;
  onChange: (patch: Partial<SeoDraft>) => void;
  onClose: () => void;
  onSave: () => void;
  isSaving: boolean;
}) {
  const previewPage: Page = {
    ...page,
    metaTitle: draft.metaTitle,
    metaDescription: draft.metaDescription,
    ogImageUrl: draft.ogImageUrl,
    isIndexable: draft.isIndexable,
  };
  const seo = computePageSeoScore(previewPage);

  return (
    <Sheet open onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="flex w-full max-w-md flex-col gap-0 sm:max-w-md">
        <SheetHeader className="border-b border-admin-border px-6 py-4">
          <SheetTitle className="text-lg font-semibold text-admin-primary">SEO sozlamalari</SheetTitle>
        </SheetHeader>

        <div className="flex-1 space-y-5 overflow-y-auto p-6">
          <div className="rounded-xl border border-admin-border p-4">
            <p className="text-2xl font-bold text-admin-primary">{seo.score}/100</p>
            <ul className="mt-2 space-y-1 text-sm">
              {seo.checks.map((check) => (
                <li key={check.label} className={check.passed ? "text-admin-accent" : "text-admin-warning"}>
                  {check.passed ? "✔" : "⚠"} {check.label}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-admin-primary">Meta Title</label>
            <input className="input" value={draft.metaTitle} onChange={(e) => onChange({ metaTitle: e.target.value })} />
            <p className="mt-1 text-xs text-admin-muted">{draft.metaTitle.length}/60 belgi</p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-admin-primary">Meta Description</label>
            <textarea className="input" rows={3} value={draft.metaDescription} onChange={(e) => onChange({ metaDescription: e.target.value })} />
            <p className="mt-1 text-xs text-admin-muted">{draft.metaDescription.length}/160 belgi</p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-admin-primary">Kalit so'zlar</label>
            <input
              className="input"
              placeholder="uy hayvonlari ozuqasi, eksport, private label..."
              value={draft.metaKeywords}
              onChange={(e) => onChange({ metaKeywords: e.target.value })}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-admin-primary">Open Graph rasm</label>
            <MediaUploaderField
              imageUrl={draft.ogImageUrl}
              onChange={(url, fileId) => onChange({ ogImageUrl: url, ogImageFileId: fileId })}
            />
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={draft.isIndexable} onChange={(e) => onChange({ isIndexable: e.target.checked })} /> Indexlash
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={draft.isFollow} onChange={(e) => onChange({ isFollow: e.target.checked })} /> Follow
            </label>
          </div>

          <div className="rounded-lg border border-admin-border p-4">
            <p className="truncate text-xs text-admin-accent">naturino.uz/{page.slug}</p>
            <p className="mt-1 truncate text-base text-[#1a0dab]">{seo.previewTitle}</p>
            <p className="mt-1 line-clamp-2 text-sm text-admin-muted">{seo.previewDescription || "Meta description bu yerda ko'rinadi..."}</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-admin-border px-6 py-4">
          <Button variant="outline" onClick={onClose}>
            Yopish
          </Button>
          <Button className="bg-admin-primary hover:bg-admin-primary-600" onClick={onSave} disabled={isSaving}>
            {isSaving ? "Saqlanmoqda..." : "Saqlash"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
