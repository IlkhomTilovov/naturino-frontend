import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { pagesApi } from "../../../api/endpoints/pages";
import { useToastStore } from "../../../store/toastStore";
import type { PageSectionContent } from "../../../types/page";
import { renderSection, SECTION_TYPE_NAMES } from "../../public/shared/renderSection";
import { getLocalized, setLocalized, type ContentLanguage } from "../../../lib/page/localizedContent";
import { EditableHeroSection, type HeroBanner } from "./EditableHeroSection";
import { EditableStatsSection } from "./EditableStatsSection";
import { EditableCtaSection } from "./EditableCtaSection";
import { EditableTrustBarSection } from "./EditableTrustBarSection";
import { EditableFeaturesSection } from "./EditableFeaturesSection";
import { useLiveEditStore } from "../../../store/liveEditStore";

const EDITABLE_TYPES = new Set(["Hero", "Stats", "CTA", "TrustBar", "Features"]);
const SAVE_DELAY_MS = 900;

export function LiveEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  const { data: page, isLoading } = useQuery({
    queryKey: ["page", id],
    queryFn: () => pagesApi.getById(id!),
    enabled: Boolean(id),
  });

  const setLiveEditActive = useLiveEditStore((s) => s.setActive);
  useEffect(() => {
    setLiveEditActive(true);
    return () => setLiveEditActive(false);
  }, [setLiveEditActive]);

  const [editMode, setEditMode] = useState(true);
  const [activeLang, setActiveLang] = useState<ContentLanguage>("uz");
  const [draftContent, setDraftContent] = useState<Record<string, PageSectionContent>>({});
  const [savingCount, setSavingCount] = useState(0);
  const saveTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const sortedSections = [...(page?.sections ?? [])].sort((a, b) => a.sortOrder - b.sortOrder).filter((s) => s.isEnabled);

  const saveSection = useMutation({
    mutationFn: ({ sectionId, sortOrder, isEnabled, content }: { sectionId: string; sortOrder: number; isEnabled: boolean; content: PageSectionContent }) =>
      pagesApi.updateSection(sectionId, { sortOrder, isEnabled, content }),
    onSuccess: () => {
      setSavingCount((c) => Math.max(0, c - 1));
      // Keep this page's cache and the nav-link lookup list fresh — never let a navigated-away
      // tab show stale pre-edit content when the visitor comes back to it.
      queryClient.invalidateQueries({ queryKey: ["page", id] });
      queryClient.invalidateQueries({ queryKey: ["pages"] });
    },
    onError: () => {
      setSavingCount((c) => Math.max(0, c - 1));
      addToast("Saqlashda xatolik yuz berdi", "error");
    },
  });

  const handleFieldChange = (sectionId: string, key: string, value: unknown) => {
    const section = page?.sections.find((s) => s.id === sectionId);
    if (!section) return;
    const base = draftContent[sectionId] ?? section.content;
    const nextContent = setLocalized(base, activeLang, { [key]: value });
    setDraftContent((prev) => ({ ...prev, [sectionId]: nextContent }));

    if (saveTimers.current[sectionId]) clearTimeout(saveTimers.current[sectionId]);
    setSavingCount((c) => c + 1);
    saveTimers.current[sectionId] = setTimeout(() => {
      saveSection.mutate({ sectionId, sortOrder: section.sortOrder, isEnabled: section.isEnabled, content: nextContent });
    }, SAVE_DELAY_MS);
  };

  useEffect(() => {
    return () => {
      Object.values(saveTimers.current).forEach(clearTimeout);
    };
  }, []);

  // Reset local draft state when navigating between pages while staying inside live-edit.
  useEffect(() => {
    setDraftContent({});
    setSavingCount(0);
  }, [id]);

  const publishPage = useMutation({
    mutationFn: () => pagesApi.publish(id!),
    onSuccess: () => {
      addToast("Sahifa nashr qilindi");
      queryClient.invalidateQueries({ queryKey: ["page", id] });
    },
    onError: () => addToast("Nashr qilishda xatolik yuz berdi", "error"),
  });

  if (isLoading || !page) {
    return <div className="px-6 py-24 text-center text-slate-400">Yuklanmoqda...</div>;
  }

  return (
    <>
      <Helmet>
        <title>{page.title} — Tahrirlash</title>
      </Helmet>

      {sortedSections.map((section) => {
        const typeName = SECTION_TYPE_NAMES[Number(section.sectionType)] ?? String(section.sectionType);
        const content = getLocalized(draftContent[section.id] ?? section.content, activeLang);
        const canEdit = editMode && EDITABLE_TYPES.has(typeName);

        if (!canEdit) {
          return (
            <div key={section.id}>
              {renderSection({ ...section, content: draftContent[section.id] ?? section.content }, activeLang)}
            </div>
          );
        }

        if (typeName === "Hero") {
          return (
            <div key={section.id} className="outline-dashed outline-2 outline-offset-[-2px] outline-transparent hover:outline-admin-accent/50">
              <EditableHeroSection
                banners={(content.banners as HeroBanner[] | undefined) ?? []}
                onChange={(banners) => handleFieldChange(section.id, "banners", banners)}
              />
            </div>
          );
        }

        const Editable = { Stats: EditableStatsSection, CTA: EditableCtaSection, TrustBar: EditableTrustBarSection, Features: EditableFeaturesSection }[
          typeName as "Stats" | "CTA" | "TrustBar" | "Features"
        ];

        return (
          <div key={section.id} className="outline-dashed outline-2 outline-offset-[-2px] outline-transparent hover:outline-admin-accent/50">
            <Editable content={content} onFieldChange={(key, value) => handleFieldChange(section.id, key, value)} />
          </div>
        );
      })}

      {sortedSections.length === 0 && (
        <div className="px-6 py-24 text-center text-slate-400">Faol bo'limlar yo'q.</div>
      )}

      {/* Floating edit toolbar */}
      <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-1.5 rounded-2xl border border-admin-border bg-white p-1.5 shadow-[0_10px_40px_rgba(0,0,0,0.15)]">
        <button
          type="button"
          onClick={() => setEditMode((v) => !v)}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
            editMode ? "bg-admin-accent-50 text-admin-accent" : "text-admin-muted hover:bg-slate-100"
          }`}
        >
          ✏ Tahrirlash
        </button>

        <div className="flex items-center gap-0.5 rounded-xl bg-slate-100 p-1">
          {(["uz", "ru"] as ContentLanguage[]).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setActiveLang(lang)}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold uppercase ${
                activeLang === lang ? "bg-white shadow-sm text-admin-primary" : "text-admin-muted"
              }`}
            >
              🌐 {lang}
            </button>
          ))}
        </div>

        <button
          type="button"
          title={savingCount > 0 ? "Saqlanmoqda..." : "Saqlandi"}
          className="flex h-8 w-8 items-center justify-center rounded-xl text-admin-muted"
        >
          {savingCount > 0 ? <span className="h-2 w-2 animate-pulse rounded-full bg-admin-warning" /> : "✓"}
        </button>

        <button
          type="button"
          title="Nashr qilish"
          onClick={() => publishPage.mutate()}
          disabled={publishPage.isPending}
          className="flex h-8 w-8 items-center justify-center rounded-xl text-admin-muted hover:bg-slate-100"
        >
          👁
        </button>

        <a
          href={`/admin/pages/${page.id}`}
          title="To'liq muharrirda ochish"
          className="flex h-8 w-8 items-center justify-center rounded-xl text-admin-muted hover:bg-slate-100"
        >
          ⛶
        </a>

        <button
          type="button"
          title="Yopish"
          onClick={() => navigate("/admin/pages")}
          className="flex h-8 w-8 items-center justify-center rounded-xl text-admin-muted hover:bg-admin-danger-50 hover:text-admin-danger"
        >
          ✕
        </button>
      </div>
    </>
  );
}
