import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productCategoriesApi } from "../../../api/endpoints/products";
import { Button } from "../../../components/ui/button";
import { PageHeader } from "../../../components/admin/PageHeader";
import { EmptyState } from "../../../components/admin/EmptyState";
import { TableSkeleton } from "../../../components/admin/TableSkeleton";
import { IconButton } from "../../../components/admin/IconButton";
import { CategorySeoBadge, CategoryStatusBadge } from "../../../components/admin/CategorySeoBadge";
import { BoxIcon, CopyIcon, DragHandleIcon, EyeIcon, GlobeIcon, PencilIcon, PlusIcon, SearchIcon, TrashIcon } from "../../../components/admin/icons";
import { FolderTree } from "lucide-react";
import { computeCategorySeoScore } from "../../../lib/utils/categorySeo";
import { FALLBACK_IMAGE, resolveMediaUrl } from "../../../lib/utils/media";
import { useToastStore } from "../../../store/toastStore";
import type { CategoryFormSchema } from "../../../lib/schemas/category";
import type { CategoryTranslation, ProductCategory } from "../../../types/product";
import { CategoryModal } from "./CategoryModal";

export function ProductCategoriesPage() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((state) => state.addToast);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<ProductCategory | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [orderedIds, setOrderedIds] = useState<string[] | null>(null);

  const { data: categories, isLoading } = useQuery({
    queryKey: ["product-categories"],
    queryFn: productCategoriesApi.getAll,
  });

  const save = useMutation({
    mutationFn: async ({
      values,
      imageFileId,
      id,
    }: {
      values: CategoryFormSchema & { translations?: Record<string, CategoryTranslation> };
      imageFileId: string | null | undefined;
      id?: string;
    }) => {
      const payload = { ...values, imageFileId };
      return id ? productCategoriesApi.update(id, payload) : productCategoriesApi.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-categories"] });
      addToast("Kategoriya muvaffaqiyatli saqlandi");
      setShowModal(false);
      setEditing(null);
    },
    onError: () => {
      addToast("Kategoriyani saqlashda xatolik yuz berdi", "error");
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => productCategoriesApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["product-categories"] }),
    onError: () => addToast("Bu kategoriyada mahsulotlar mavjud yoki o'chirishda xatolik yuz berdi.", "error"),
  });

  const reorder = useMutation({
    mutationFn: (items: { id: string; sortOrder: number }[]) => productCategoriesApi.reorder(items),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["product-categories"] }),
  });

  const filtered = (categories ?? []).filter((c) => {
    const q = search.toLowerCase();
    return !q || c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q) || (c.translations.ru?.name ?? "").toLowerCase().includes(q);
  });

  const displayList = orderedIds
    ? orderedIds.map((id) => filtered.find((c) => c.id === id)).filter((c): c is ProductCategory => Boolean(c))
    : filtered;

  const handleDrop = (targetId: string) => {
    if (!draggedId || draggedId === targetId) return;
    const base = orderedIds ?? filtered.map((c) => c.id);
    const next = [...base];
    const from = next.indexOf(draggedId);
    const to = next.indexOf(targetId);
    next.splice(from, 1);
    next.splice(to, 0, draggedId);
    setOrderedIds(next);
    reorder.mutate(next.map((id, index) => ({ id, sortOrder: index })));
    setDraggedId(null);
  };

  const copySlug = (slug: string) => {
    navigator.clipboard?.writeText(slug);
    addToast("Slug nusxalandi");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Toifalar"
        description={`Mahsulot toifalarini boshqaring va tartiblang — ${categories?.length ?? 0} ta kategoriya`}
        actions={
          <>
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-admin-border px-4 py-2 text-sm font-medium text-admin-muted hover:bg-slate-50"
            >
              <GlobeIcon className="h-4 w-4" /> Sitemap
            </a>
            <Button
              className="bg-admin-primary hover:bg-admin-primary-600"
              onClick={() => {
                setEditing(null);
                setShowModal(true);
              }}
            >
              <PlusIcon className="mr-2 h-4 w-4" /> Yangi toifa
            </Button>
          </>
        }
      />

      <div className="rounded-xl border border-admin-border bg-white p-4">
        <div className="relative max-w-sm">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-admin-muted" />
          <input
            type="text"
            placeholder="Toifa nomi yoki slug bo'yicha qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-admin-border py-2 pl-9 pr-3 text-sm focus:border-admin-primary focus:outline-none"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-admin-border bg-white">
        <div className="flex items-center justify-between border-b border-admin-border px-5 py-4">
          <h2 className="text-base font-semibold text-admin-primary">Barcha toifalar ({filtered.length})</h2>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-admin-muted">
            {filtered.filter((c) => c.isActive).length} faol
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead className="sticky top-0 z-10 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-admin-muted">
              <tr>
                <th className="w-8 px-3 py-3"></th>
                <th className="px-2 py-3">Rasm</th>
                <th className="px-4 py-3">Nomi (UZ / RU)</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Mahsulotlar</th>
                <th className="px-4 py-3">SEO</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && <TableSkeleton columns={8} />}

              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={8}>
                    <EmptyState
                      icon={FolderTree}
                      title="Toifalar topilmadi"
                      description="Qidiruvni o'zgartiring yoki yangi toifa qo'shing."
                      action={
                        <Button size="sm" className="bg-admin-primary" onClick={() => setShowModal(true)}>
                          <PlusIcon className="mr-2 h-4 w-4" /> Yangi toifa
                        </Button>
                      }
                    />
                  </td>
                </tr>
              )}

              {displayList.map((category) => {
                const seo = computeCategorySeoScore({ ...category, slug: category.slug });
                return (
                  <tr
                    key={category.id}
                    draggable
                    onDragStart={() => setDraggedId(category.id)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(category.id)}
                    className={`border-t border-admin-border transition-colors hover:bg-slate-50 ${draggedId === category.id ? "opacity-50" : ""}`}
                  >
                    <td className="cursor-grab px-3 py-3 text-admin-muted active:cursor-grabbing">
                      <DragHandleIcon />
                    </td>
                    <td className="px-2 py-3">
                      <div className="h-10 w-10 overflow-hidden rounded-lg border border-admin-border bg-slate-50">
                        <img
                          src={resolveMediaUrl(category.imageUrl) ?? FALLBACK_IMAGE}
                          alt=""
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-admin-primary">{category.name}</p>
                      {category.translations.ru?.name && <p className="text-sm text-admin-muted">{category.translations.ru.name}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <code className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs text-admin-primary">/{category.slug}</code>
                        <IconButton label="Slug nusxalash" onClick={() => copySlug(category.slug)}>
                          <CopyIcon className="h-3.5 w-3.5" />
                        </IconButton>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-admin-primary">
                        <BoxIcon className="h-3.5 w-3.5" /> {category.productCount}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <CategorySeoBadge score={seo.score} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <CategoryStatusBadge isActive={category.isActive} />
                        <button
                          type="button"
                          role="switch"
                          aria-checked={category.isActive}
                          onClick={() =>
                            save.mutate({
                              id: category.id,
                              imageFileId: undefined,
                              values: {
                                name: category.name,
                                slug: category.slug,
                                description: category.description ?? "",
                                sortOrder: category.sortOrder,
                                isActive: !category.isActive,
                                metaTitleUz: category.metaTitleUz ?? "",
                                metaDescriptionUz: category.metaDescriptionUz ?? "",
                                metaKeywords: category.metaKeywords ?? "",
                                isIndexable: category.isIndexable,
                                isFollow: category.isFollow,
                                translations: category.translations,
                              },
                            })
                          }
                          className={`relative h-5 w-9 rounded-full transition-colors ${category.isActive ? "bg-admin-primary" : "bg-slate-300"}`}
                        >
                          <span
                            className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                              category.isActive ? "translate-x-4" : "translate-x-0.5"
                            }`}
                          />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <a href={`/products?category=${category.slug}`} target="_blank" rel="noreferrer">
                          <IconButton label="Saytda ko'rish">
                            <EyeIcon />
                          </IconButton>
                        </a>
                        <IconButton
                          label="Tahrirlash"
                          onClick={() => {
                            setEditing(category);
                            setShowModal(true);
                          }}
                        >
                          <PencilIcon />
                        </IconButton>
                        <IconButton
                          label="O'chirish"
                          variant="danger"
                          onClick={() => {
                            if (confirm(`"${category.name}" kategoriyasini o'chirmoqchimisiz?`)) {
                              remove.mutate(category.id);
                            }
                          }}
                        >
                          <TrashIcon />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <CategoryModal
          category={editing}
          isSubmitting={save.isPending}
          onClose={() => {
            setShowModal(false);
            setEditing(null);
          }}
          onSubmit={async (values, imageFileId) => {
            await save.mutateAsync({ values, imageFileId, id: editing?.id });
          }}
        />
      )}
    </div>
  );
}
