import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { pagesApi } from "../../../api/endpoints/pages";
import { Button } from "../../../components/ui/button";
import { useToastStore } from "../../../store/toastStore";
import type { PageSection, PageSectionContent } from "../../../types/page";
import { SECTION_TYPE_NAMES } from "../../public/shared/renderSection";
import { sectionTypeLabel } from "./sectionLabels";
import { SECTION_FIELD_SCHEMAS, type FieldDef } from "./sectionFieldSchemas";
import { RepeaterEditor } from "../../../components/admin/RepeaterEditor";
import { StringListEditor } from "../../../components/admin/StringListEditor";
import { MediaUploaderField } from "../../../components/admin/MediaUploaderField";
import { HeroBannerManager } from "./HeroBannerManager";
import { LivePreviewPane, type DeviceMode } from "./LivePreviewPane";
import { AddSectionModal, type InsertPosition } from "./AddSectionModal";
import { SeoPanel, type SeoDraft } from "./SeoPanel";
import { getLocalized, setLocalized, type ContentLanguage } from "../../../lib/page/localizedContent";
import { publicPathForSlug } from "../../../lib/page/publicPath";

interface HistorySnapshot {
  draftContent: Record<string, PageSectionContent>;
  draftEnabled: Record<string, boolean>;
  order: string[] | null;
}

const AUTOSAVE_DELAY_MS = 2500;

export function PageDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const addToast = useToastStore((state) => state.addToast);
  const [activeLang, setActiveLang] = useState<ContentLanguage>("uz");
  const [history, setHistory] = useState<HistorySnapshot[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isRestoringHistory = useRef(false);

  const { data: page, isLoading } = useQuery({
    queryKey: ["page", id],
    queryFn: () => pagesApi.getById(id!),
    enabled: Boolean(id),
  });

  // Kept warm so the Page Selector can jump straight to another page without
  // ever leaving this route — switching `id` here re-runs the query above but
  // never unmounts this editor shell (toolbar/sidebar/inspector stay mounted).
  const { data: allPages } = useQuery({ queryKey: ["pages"], queryFn: pagesApi.getAll });

  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [draftContent, setDraftContent] = useState<Record<string, PageSectionContent>>({});
  const [draftEnabled, setDraftEnabled] = useState<Record<string, boolean>>({});
  const [order, setOrder] = useState<string[] | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [isPublished, setIsPublished] = useState(false);
  const [device, setDevice] = useState<DeviceMode>("desktop");
  const [showSeoPanel, setShowSeoPanel] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [seoDraft, setSeoDraft] = useState<SeoDraft | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  useEffect(() => {
    if (page) {
      setIsPublished(page.isPublished);
      const sorted = [...page.sections].sort((a, b) => a.sortOrder - b.sortOrder);
      setOrder(sorted.map((s) => s.id));
      setActiveSectionId(sorted.length > 0 ? sorted[0].id : null);
      setSeoDraft({
        metaTitle: page.metaTitle ?? "",
        metaDescription: page.metaDescription ?? "",
        metaKeywords: page.metaKeywords ?? "",
        ogImageFileId: undefined,
        ogImageUrl: page.ogImageUrl ?? null,
        isIndexable: page.isIndexable,
        isFollow: page.isFollow,
      });
    }
    // Switching pages via the Page Selector keeps this editor shell mounted — clear the
    // previous page's draft/history state so it can never leak into the newly loaded page.
    setDraftContent({});
    setDraftEnabled({});
    setHistory([]);
    setHistoryIndex(-1);
    setLastSavedAt(null);
    setShowSeoPanel(false);
    setShowAddModal(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page?.id]);

  const sortedSections: PageSection[] = page
    ? (order ?? page.sections.map((s) => s.id))
        .map((sid) => page.sections.find((s) => s.id === sid))
        .filter((s): s is PageSection => Boolean(s))
    : [];

  const previewSections: PageSection[] = sortedSections.map((s, index) => ({
    ...s,
    sortOrder: index,
    isEnabled: draftEnabled[s.id] ?? s.isEnabled,
    content: draftContent[s.id] ?? s.content,
  }));

  const activeSection = sortedSections.find((s) => s.id === activeSectionId) ?? null;
  const activeContent = activeSection ? getLocalized(draftContent[activeSection.id] ?? activeSection.content, activeLang) : {};
  const activeEnabled = activeSection ? draftEnabled[activeSection.id] ?? activeSection.isEnabled : true;

  const originalOrder = page ? [...page.sections].sort((a, b) => a.sortOrder - b.sortOrder).map((s) => s.id) : [];
  const orderDirty = order !== null && order.join() !== originalOrder.join();
  const isDirty = Object.keys(draftContent).length > 0 || Object.keys(draftEnabled).length > 0 || orderDirty || isPublished !== page?.isPublished;
  const hasUnpublishedChanges = isDirty || sortedSections.some((s) => s.hasUnpublishedChanges);

  const savePage = useMutation({
    mutationFn: () =>
      pagesApi.update(id!, {
        title: page!.title,
        isPublished,
        metaTitle: page!.metaTitle,
        metaDescription: page!.metaDescription,
        metaKeywords: page!.metaKeywords,
        isIndexable: page!.isIndexable,
        isFollow: page!.isFollow,
      }),
  });

  const saveSection = useMutation({
    mutationFn: ({ sectionId, sortOrder, isEnabled, content }: { sectionId: string; sortOrder: number; isEnabled: boolean; content: PageSectionContent }) =>
      pagesApi.updateSection(sectionId, { sortOrder, isEnabled, content }),
  });

  const addSection = useMutation({
    mutationFn: ({ sectionType }: { sectionType: number; position: InsertPosition }) =>
      pagesApi.addSection(id!, { sectionType, sortOrder: sortedSections.length }),
    onSuccess: (section, variables) => {
      queryClient.invalidateQueries({ queryKey: ["page", id] });

      const baseOrder = (order ?? sortedSections.map((s) => s.id)).filter((sid) => sid !== section.id);
      const activeIndex = activeSectionId ? baseOrder.indexOf(activeSectionId) : -1;
      let insertAt = baseOrder.length;
      if (variables.position === "start") insertAt = 0;
      else if (variables.position === "before" && activeIndex >= 0) insertAt = activeIndex;
      else if (variables.position === "after" && activeIndex >= 0) insertAt = activeIndex + 1;
      const nextOrder = [...baseOrder];
      nextOrder.splice(insertAt, 0, section.id);
      setOrder(nextOrder);
      setActiveSectionId(section.id);

      window.setTimeout(() => {
        document.querySelector(`[data-section-id="${section.id}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 150);

      addToast("Bo'lim qo'shildi");
    },
  });

  const handleAddSection = (typeName: string, position: InsertPosition) => {
    addSection.mutate({ sectionType: SECTION_TYPE_NAMES.indexOf(typeName), position });
  };

  const deleteSection = useMutation({
    mutationFn: (sectionId: string) => pagesApi.deleteSection(sectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["page", id] });
      setActiveSectionId(null);
      addToast("Bo'lim o'chirildi");
    },
  });

  const duplicateSection = useMutation({
    mutationFn: ({ sectionType, sortOrder, content }: { sectionType: number; sortOrder: number; content: PageSectionContent }) =>
      pagesApi.addSection(id!, { sectionType, sortOrder, content }),
    onSuccess: (section) => {
      queryClient.invalidateQueries({ queryKey: ["page", id] });
      setActiveSectionId(section.id);
      addToast("Bo'lim nusxalandi");
    },
  });

  const saveAll = useMutation({
    mutationFn: async () => {
      if (isPublished !== page?.isPublished) {
        await savePage.mutateAsync();
      }
      const ids = order ?? sortedSections.map((s) => s.id);
      await Promise.all(
        ids.map((sid, index) => {
          const section = sortedSections.find((s) => s.id === sid);
          if (!section) return Promise.resolve();
          const content = draftContent[sid] ?? section.content;
          const enabled = draftEnabled[sid] ?? section.isEnabled;
          if (!(sid in draftContent) && !(sid in draftEnabled) && section.sortOrder === index) {
            return Promise.resolve();
          }
          return saveSection.mutateAsync({ sectionId: sid, sortOrder: index, isEnabled: enabled, content });
        }),
      );
    },
    onSuccess: () => {
      setLastSavedAt(new Date());
      setDraftContent({});
      setDraftEnabled({});
      queryClient.invalidateQueries({ queryKey: ["page", id] });
    },
    onError: () => addToast("Saqlashda xatolik yuz berdi", "error"),
  });

  const publishPage = useMutation({
    mutationFn: () => pagesApi.publish(id!),
    onSuccess: () => {
      addToast("Sahifa nashr qilindi");
      queryClient.invalidateQueries({ queryKey: ["page", id] });
    },
    onError: () => addToast("Nashr qilishda xatolik yuz berdi", "error"),
  });

  const saveSeo = useMutation({
    mutationFn: () =>
      pagesApi.update(id!, {
        title: page!.title,
        isPublished,
        metaTitle: seoDraft!.metaTitle,
        metaDescription: seoDraft!.metaDescription,
        metaKeywords: seoDraft!.metaKeywords,
        ogImageFileId: seoDraft!.ogImageFileId,
        isIndexable: seoDraft!.isIndexable,
        isFollow: seoDraft!.isFollow,
      }),
    onSuccess: () => {
      addToast("SEO sozlamalari saqlandi");
      setShowSeoPanel(false);
      queryClient.invalidateQueries({ queryKey: ["page", id] });
    },
    onError: () => addToast("SEO saqlashda xatolik yuz berdi", "error"),
  });

  // Autosave: debounce save shortly after any draft change.
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!isDirty) return;
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => {
      saveAll.mutate();
    }, AUTOSAVE_DELAY_MS);
    return () => {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftContent, draftEnabled, order, isPublished]);

  const pushHistory = (next: HistorySnapshot) => {
    if (isRestoringHistory.current) return;
    setHistory((prev) => {
      const truncated = prev.slice(0, historyIndex + 1);
      const updated = [...truncated, next].slice(-30);
      setHistoryIndex(updated.length - 1);
      return updated;
    });
  };

  const handleFieldChange = (key: string, value: unknown) => {
    if (!activeSection) return;
    const base = draftContent[activeSection.id] ?? activeSection.content;
    const nextContent = setLocalized(base, activeLang, { [key]: value });
    const nextDraftContent = { ...draftContent, [activeSection.id]: nextContent };
    setDraftContent(nextDraftContent);
    pushHistory({ draftContent: nextDraftContent, draftEnabled, order });
  };

  const handleDrop = (targetId: string) => {
    if (!draggedId || draggedId === targetId || !order) return;
    const next = [...order];
    const from = next.indexOf(draggedId);
    const to = next.indexOf(targetId);
    next.splice(from, 1);
    next.splice(to, 0, draggedId);
    setOrder(next);
    setDraggedId(null);
    pushHistory({ draftContent, draftEnabled, order: next });
  };

  const handleToggleEnabled = (sectionId: string, enabled: boolean) => {
    const next = { ...draftEnabled, [sectionId]: enabled };
    setDraftEnabled(next);
    pushHistory({ draftContent, draftEnabled: next, order });
  };

  const handleUndo = () => {
    if (historyIndex <= 0) return;
    isRestoringHistory.current = true;
    const snapshot = history[historyIndex - 1];
    setDraftContent(snapshot.draftContent);
    setDraftEnabled(snapshot.draftEnabled);
    setOrder(snapshot.order);
    setHistoryIndex(historyIndex - 1);
    isRestoringHistory.current = false;
  };

  const handleRedo = () => {
    if (historyIndex >= history.length - 1) return;
    isRestoringHistory.current = true;
    const snapshot = history[historyIndex + 1];
    setDraftContent(snapshot.draftContent);
    setDraftEnabled(snapshot.draftEnabled);
    setOrder(snapshot.order);
    setHistoryIndex(historyIndex + 1);
    isRestoringHistory.current = false;
  };

  if (isLoading || !page || !seoDraft) {
    return <div className="flex h-screen items-center justify-center text-sm text-admin-muted">Yuklanmoqda...</div>;
  }

  return (
    <div className="flex h-screen flex-col bg-admin-bg">
      <div className="flex items-center justify-between gap-3 border-b border-admin-border bg-white px-6 py-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/pages")}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-admin-muted hover:bg-slate-100 hover:text-admin-primary"
            title="Orqaga"
          >
            ←
          </button>
          <select
            value={page.id}
            onChange={(e) => navigate(`/admin/pages/${e.target.value}`)}
            title="Sahifa tanlash"
            className="max-w-[220px] rounded-lg border border-admin-border bg-white px-2.5 py-1.5 text-sm font-semibold text-admin-primary focus:border-admin-primary focus:outline-none"
          >
            {(allPages ?? [page]).map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
          <p className="text-xs text-admin-muted">{page.slug ? `/${page.slug}` : "/"}</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
            {(["uz", "ru"] as ContentLanguage[]).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setActiveLang(lang)}
                className={`rounded-md px-2.5 py-1.5 text-xs font-semibold uppercase ${activeLang === lang ? "bg-white shadow-sm text-admin-primary" : "text-admin-muted"}`}
              >
                {lang}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
            <button type="button" onClick={handleUndo} disabled={historyIndex <= 0} title="Undo" className="rounded-md px-2.5 py-1.5 text-sm text-admin-muted disabled:opacity-30">
              ↶
            </button>
            <button type="button" onClick={handleRedo} disabled={historyIndex >= history.length - 1} title="Redo" className="rounded-md px-2.5 py-1.5 text-sm text-admin-muted disabled:opacity-30">
              ↷
            </button>
          </div>

          <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
            {(["desktop", "tablet", "mobile"] as DeviceMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setDevice(mode)}
                title={mode}
                className={`rounded-md px-3 py-1.5 text-sm ${device === mode ? "bg-white shadow-sm" : "text-admin-muted"}`}
              >
                {mode === "desktop" ? "🖥" : mode === "tablet" ? "📱" : "📲"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {saveAll.isPending ? (
            <span className="flex items-center gap-1.5 text-xs font-medium text-admin-muted">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-admin-primary" /> Qoralama saqlanmoqda...
            </span>
          ) : isDirty ? (
            <span className="flex items-center gap-1.5 text-xs font-medium text-admin-warning">
              <span className="h-1.5 w-1.5 rounded-full bg-admin-warning" /> Saqlanmagan o'zgarishlar
            </span>
          ) : hasUnpublishedChanges ? (
            <span className="flex items-center gap-1.5 text-xs font-medium text-admin-warning">
              <span className="h-1.5 w-1.5 rounded-full bg-admin-warning" /> Nashr qilinmagan o'zgarishlar bor
            </span>
          ) : lastSavedAt ? (
            <span className="text-xs text-admin-accent">Saqlandi {lastSavedAt.toLocaleTimeString("uz-UZ")}</span>
          ) : null}

          <Button variant="outline" size="sm" onClick={() => setShowSeoPanel(true)}>
            SEO
          </Button>
          <a href={publicPathForSlug(page.slug)} target="_blank" rel="noreferrer">
            <Button variant="outline" size="sm">
              Ko'rib chiqish
            </Button>
          </a>
          <Button size="sm" variant="outline" onClick={() => saveAll.mutate()} disabled={saveAll.isPending || !isDirty}>
            {saveAll.isPending ? "Saqlanmoqda..." : "Qoralama saqlash"}
          </Button>
          <Button
            size="sm"
            className="bg-admin-primary hover:bg-admin-primary-600"
            onClick={() => publishPage.mutate()}
            disabled={publishPage.isPending || (!hasUnpublishedChanges && page.isPublished)}
          >
            {publishPage.isPending ? "Nashr qilinmoqda..." : "Nashr qilish"}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-60 overflow-y-auto border-r border-admin-border bg-white p-3">
          <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-admin-muted">Bo'limlar</p>
          <div className="space-y-1">
            {(() => {
              const occurrence: Record<string, number> = {};
              return sortedSections.map((section) => {
                const typeName = SECTION_TYPE_NAMES[Number(section.sectionType)] ?? String(section.sectionType);
                const enabled = draftEnabled[section.id] ?? section.isEnabled;
                occurrence[typeName] = (occurrence[typeName] ?? 0) + 1;
                const count = occurrence[typeName];
                const label = count > 1 ? `${sectionTypeLabel(typeName)} ${count}` : sectionTypeLabel(typeName);
                return (
                  <div
                    key={section.id}
                    draggable
                    onDragStart={() => setDraggedId(section.id)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(section.id)}
                    onClick={() => setActiveSectionId(section.id)}
                    className={`group flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                      activeSectionId === section.id ? "bg-admin-primary text-white" : "text-admin-primary hover:bg-slate-100"
                    } ${draggedId === section.id ? "opacity-50" : ""} ${!enabled ? "opacity-50" : ""}`}
                  >
                    <span className="truncate">{label}</span>
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        title="Nusxalash"
                        onClick={() =>
                          duplicateSection.mutate({
                            sectionType: Number(section.sectionType),
                            sortOrder: sortedSections.length,
                            content: draftContent[section.id] ?? section.content,
                          })
                        }
                        className="hidden text-xs opacity-70 hover:opacity-100 group-hover:inline"
                      >
                        ⧉
                      </button>
                      <button
                        type="button"
                        title="O'chirish"
                        onClick={() => {
                          if (confirm("Bu bo'limni o'chirmoqchimisiz?")) deleteSection.mutate(section.id);
                        }}
                        className="hidden text-xs opacity-70 hover:opacity-100 group-hover:inline"
                      >
                        ✕
                      </button>
                      <input
                        type="checkbox"
                        checked={enabled}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => handleToggleEnabled(section.id, e.target.checked)}
                      />
                    </div>
                  </div>
                );
              });
            })()}
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="mt-3 w-full rounded-lg border border-dashed border-admin-border py-2 text-sm font-medium text-admin-muted hover:border-admin-primary hover:text-admin-primary"
          >
            + Bo'lim qo'shish
          </button>
        </aside>

        <main className="flex-1 overflow-hidden">
          <LivePreviewPane
            sections={previewSections}
            device={device}
            activeSectionId={activeSectionId}
            activeLang={activeLang}
            onSelect={setActiveSectionId}
            onFieldChange={(_sectionId, key, value) => handleFieldChange(key, value)}
          />
        </main>

        <aside className="w-80 overflow-y-auto border-l border-admin-border bg-white p-5">
          {activeSection ? (
            <>
              {!activeEnabled && (
                <div className="mb-4 rounded-lg border border-admin-warning/30 bg-admin-warning-50 px-3 py-2 text-xs text-admin-warning">
                  Bu bo'lim hozir saytda o'chirilgan.
                </div>
              )}
              <SectionEditor
                typeName={SECTION_TYPE_NAMES[Number(activeSection.sectionType)] ?? String(activeSection.sectionType)}
                content={activeContent}
                onChange={handleFieldChange}
              />
            </>
          ) : (
            <p className="text-sm text-admin-muted">Tahrirlash uchun bo'lim tanlang.</p>
          )}
        </aside>
      </div>

      {showSeoPanel && (
        <SeoPanel
          page={page}
          draft={seoDraft}
          onChange={(patch) => setSeoDraft((prev) => (prev ? { ...prev, ...patch } : prev))}
          onClose={() => setShowSeoPanel(false)}
          onSave={() => saveSeo.mutate()}
          isSaving={saveSeo.isPending}
        />
      )}

      <AddSectionModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        hasActiveSection={Boolean(activeSectionId)}
        onAdd={handleAddSection}
      />
    </div>
  );
}

function SectionEditor({
  typeName,
  content,
  onChange,
}: {
  typeName: string;
  content: PageSectionContent;
  onChange: (key: string, value: unknown) => void;
}) {
  if (typeName === "Hero") {
    const banners = (content.banners as Record<string, unknown>[] | undefined) ?? [];
    return (
      <div>
        <h2 className="mb-3 text-lg font-semibold text-admin-primary">Bosh banner (slayder)</h2>
        <HeroBannerManager banners={banners} onChange={(next) => onChange("banners", next)} />
      </div>
    );
  }

  const fields = SECTION_FIELD_SCHEMAS[typeName] ?? [];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-admin-primary">{sectionTypeLabel(typeName)}</h2>

      {fields.length === 0 && <p className="text-sm text-admin-muted">Bu bo'lim turi uchun tahrirlanadigan maydonlar yo'q.</p>}

      {fields.map((field) => (
        <div key={field.key}>
          <label className="mb-2 block text-sm font-semibold text-admin-primary">{field.label}</label>
          {field.hint && <p className="mb-2 text-xs text-admin-muted">{field.hint}</p>}
          <FieldControl field={field} value={content[field.key]} onChange={(value) => onChange(field.key, value)} />
        </div>
      ))}
    </div>
  );
}

function FieldControl({ field, value, onChange }: { field: FieldDef; value: unknown; onChange: (value: unknown) => void }) {
  if (field.type === "image") {
    return <MediaUploaderField imageUrl={value as string | undefined} onChange={(url) => onChange(url)} />;
  }

  if (field.type === "textarea") {
    return <textarea className="input" rows={3} value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} />;
  }

  if (field.type === "stringlist") {
    return <StringListEditor items={(value as string[]) ?? []} onChange={onChange} />;
  }

  if (field.type === "repeater") {
    return (
      <RepeaterEditor
        items={(value as Record<string, unknown>[]) ?? []}
        fields={field.itemFields ?? []}
        onChange={onChange}
        addLabel={`${field.itemLabel ?? "Qator"} qo'shish`}
      />
    );
  }

  return <input className="input" value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} />;
}
