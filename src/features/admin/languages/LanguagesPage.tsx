import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { languagesApi } from "../../../api/endpoints/languages";
import { Button } from "../../../components/ui/button";
import { PageHeader } from "../../../components/admin/PageHeader";
import { EmptyState } from "../../../components/admin/EmptyState";
import { TableSkeleton } from "../../../components/admin/TableSkeleton";
import { IconButton } from "../../../components/admin/IconButton";
import { DragHandleIcon, PencilIcon, PlusIcon, SearchIcon, StarIcon, TrashIcon } from "../../../components/admin/icons";
import { useToastStore } from "../../../store/toastStore";
import type { Language, LanguageFormValues } from "../../../types/language";
import { LanguageModal } from "./LanguageModal";

export function LanguagesPage() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((state) => state.addToast);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Language | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [orderedIds, setOrderedIds] = useState<string[] | null>(null);

  const { data: languages, isLoading } = useQuery({
    queryKey: ["languages"],
    queryFn: languagesApi.getAll,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["languages"] });

  const save = useMutation({
    mutationFn: ({ values, id }: { values: LanguageFormValues; id?: string }) =>
      id ? languagesApi.update(id, values) : languagesApi.create(values),
    onSuccess: () => {
      invalidate();
      addToast("Til muvaffaqiyatli saqlandi");
      setShowModal(false);
      setEditing(null);
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => languagesApi.remove(id),
    onSuccess: () => {
      invalidate();
      addToast("Til o'chirildi");
    },
    onError: (error) => {
      const message = isAxiosError(error) ? error.response?.data?.detail : null;
      addToast(message ?? "Tilni o'chirishda xatolik yuz berdi.", "error");
    },
  });

  const setDefault = useMutation({
    mutationFn: (id: string) => languagesApi.setDefault(id),
    onSuccess: () => {
      invalidate();
      addToast("Standart til o'zgartirildi");
    },
    onError: (error) => {
      const message = isAxiosError(error) ? error.response?.data?.detail : null;
      addToast(message ?? "Standart tilni o'rnatishda xatolik yuz berdi.", "error");
    },
  });

  const toggleStatus = useMutation({
    mutationFn: (id: string) => languagesApi.toggleStatus(id),
    onSuccess: invalidate,
    onError: (error) => {
      const message = isAxiosError(error) ? error.response?.data?.detail : null;
      addToast(message ?? "Holatni o'zgartirishda xatolik yuz berdi.", "error");
    },
  });

  const reorder = useMutation({
    mutationFn: (items: { id: string; sortOrder: number }[]) => languagesApi.reorder(items),
    onSuccess: invalidate,
  });

  const filtered = (languages ?? []).filter((l) => {
    const q = search.toLowerCase();
    return !q || l.name.toLowerCase().includes(q) || l.nativeName.toLowerCase().includes(q) || l.code.toLowerCase().includes(q);
  });

  const displayList = orderedIds
    ? orderedIds.map((id) => filtered.find((l) => l.id === id)).filter((l): l is Language => Boolean(l))
    : filtered;

  const handleDrop = (targetId: string) => {
    if (!draggedId || draggedId === targetId) return;
    const base = orderedIds ?? filtered.map((l) => l.id);
    const next = [...base];
    const from = next.indexOf(draggedId);
    const to = next.indexOf(targetId);
    next.splice(from, 1);
    next.splice(to, 0, draggedId);
    setOrderedIds(next);
    reorder.mutate(next.map((id, index) => ({ id, sortOrder: index })));
    setDraggedId(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tillar"
        description={`Sayt va admin panel tillarini boshqaring — ${languages?.length ?? 0} ta til`}
        actions={
          <Button
            className="bg-admin-primary hover:bg-admin-primary-600"
            onClick={() => {
              setEditing(null);
              setShowModal(true);
            }}
          >
            <PlusIcon className="mr-2 h-4 w-4" /> Yangi til
          </Button>
        }
      />

      <div className="rounded-xl border border-admin-border bg-white p-4">
        <div className="relative max-w-sm">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-admin-muted" />
          <input
            type="text"
            placeholder="Til nomi yoki kodi bo'yicha qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-admin-border py-2 pl-9 pr-3 text-sm focus:border-admin-primary focus:outline-none"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-admin-border bg-white">
        <div className="flex items-center justify-between border-b border-admin-border px-5 py-4">
          <h2 className="text-base font-semibold text-admin-primary">Barcha tillar ({filtered.length})</h2>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-admin-muted">
            {filtered.filter((l) => l.isActive).length} faol
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="sticky top-0 z-10 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-admin-muted">
              <tr>
                <th className="w-8 px-3 py-3"></th>
                <th className="px-2 py-3">Bayroq</th>
                <th className="px-4 py-3">Nomi</th>
                <th className="px-4 py-3">Mahalliy nomi</th>
                <th className="px-4 py-3">Kod</th>
                <th className="px-4 py-3">Locale</th>
                <th className="px-4 py-3">Yo'nalish</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && <TableSkeleton columns={9} />}

              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={9}>
                    <EmptyState
                      title="Tillar topilmadi"
                      description="Qidiruvni o'zgartiring yoki yangi til qo'shing."
                      action={
                        <Button size="sm" className="bg-admin-primary" onClick={() => setShowModal(true)}>
                          <PlusIcon className="mr-2 h-4 w-4" /> Yangi til
                        </Button>
                      }
                    />
                  </td>
                </tr>
              )}

              {displayList.map((language) => (
                <tr
                  key={language.id}
                  draggable
                  onDragStart={() => setDraggedId(language.id)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(language.id)}
                  className={`border-t border-admin-border transition-colors hover:bg-slate-50 ${draggedId === language.id ? "opacity-50" : ""}`}
                >
                  <td className="cursor-grab px-3 py-3 text-admin-muted active:cursor-grabbing">
                    <DragHandleIcon />
                  </td>
                  <td className="px-2 py-3 text-lg">{language.flag}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-admin-primary">{language.name}</p>
                      {language.isDefault && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-admin-accent-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-admin-accent">
                          <StarIcon className="h-3 w-3" filled /> Standart
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-admin-muted">{language.nativeName}</td>
                  <td className="px-4 py-3">
                    <code className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs text-admin-primary">{language.code}</code>
                  </td>
                  <td className="px-4 py-3 text-admin-muted">{language.locale}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium uppercase text-admin-muted">
                      {language.direction}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={language.isActive}
                      disabled={language.isDefault}
                      title={language.isDefault ? "Standart tilni faolsizlantirib bo'lmaydi" : undefined}
                      onClick={() => toggleStatus.mutate(language.id)}
                      className={`relative h-5 w-9 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                        language.isActive ? "bg-admin-primary" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                          language.isActive ? "translate-x-4" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {!language.isDefault && (
                        <IconButton label="Standart qilish" onClick={() => setDefault.mutate(language.id)}>
                          <StarIcon className="h-4 w-4" />
                        </IconButton>
                      )}
                      <IconButton
                        label="Tahrirlash"
                        onClick={() => {
                          setEditing(language);
                          setShowModal(true);
                        }}
                      >
                        <PencilIcon />
                      </IconButton>
                      <IconButton
                        label="O'chirish"
                        variant="danger"
                        disabled={language.isDefault}
                        onClick={() => {
                          if (!language.isDefault && confirm(`"${language.name}" tilini o'chirmoqchimisiz?`)) {
                            remove.mutate(language.id);
                          }
                        }}
                      >
                        <TrashIcon />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <LanguageModal
          language={editing}
          isSubmitting={save.isPending}
          onClose={() => {
            setShowModal(false);
            setEditing(null);
          }}
          onSubmit={async (values) => {
            await save.mutateAsync({ values, id: editing?.id });
          }}
        />
      )}
    </div>
  );
}
