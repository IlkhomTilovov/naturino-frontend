import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { productCategoriesApi, productsApi } from "../../../api/endpoints/products";
import { Button } from "../../../components/ui/button";
import { PageHeader } from "../../../components/admin/PageHeader";
import { ProductStatusBadge, SeoStatusBadge, StockBadge } from "../../../components/admin/Badges";
import { EmptyState } from "../../../components/admin/EmptyState";
import { TableSkeleton } from "../../../components/admin/TableSkeleton";
import { IconButton } from "../../../components/admin/IconButton";
import { EyeIcon, PencilIcon, PlusIcon, RefreshIcon, SearchIcon, StarIcon, TrashIcon } from "../../../components/admin/icons";
import { computeSeoScore } from "../../../lib/utils/seo";
import { resolveMediaUrl, FALLBACK_IMAGE } from "../../../lib/utils/media";
import type { Product } from "../../../types/product";

export function ProductsListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const queryClient = useQueryClient();

  const { data: categories } = useQuery({
    queryKey: ["product-categories"],
    queryFn: productCategoriesApi.getAll,
  });

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["products", page, search, categoryId, statusFilter],
    queryFn: () =>
      productsApi.getPaged({
        page,
        pageSize: 10,
        search: search || undefined,
        categoryId: categoryId || undefined,
        isActive: statusFilter === "" ? undefined : statusFilter === "active",
      }),
  });

  const toggleActive = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => productsApi.setActive(id, isActive),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });

  const toggleFeatured = useMutation({
    mutationFn: (product: Product) =>
      productsApi.update(product.id, {
        categoryId: product.categoryId,
        sku: product.sku,
        name: product.name,
        slug: product.slug,
        shortDescription: product.shortDescription ?? "",
        description: product.description ?? "",
        price: product.price,
        oldPrice: product.oldPrice ?? null,
        stockQuantity: product.stockQuantity,
        weight: product.weight ?? null,
        brand: product.brand ?? "",
        ageGroup: product.ageGroup ?? "",
        isFeatured: !product.isFeatured,
        isActive: product.isActive,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => productsApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });

  const items = data?.items ?? [];
  const allSelected = items.length > 0 && items.every((p) => selected.has(p.id));

  const toggleSelectAll = () => {
    setSelected(allSelected ? new Set() : new Set(items.map((p) => p.id)));
  };

  const toggleSelectOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const bulkDeactivate = useMutation({
    mutationFn: async () => {
      await Promise.all([...selected].map((id) => productsApi.setActive(id, false)));
    },
    onSuccess: () => {
      setSelected(new Set());
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mahsulotlar"
        description="Barcha mahsulotlarni boshqaring"
        actions={
          <>
            <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
              <RefreshIcon className={`mr-2 h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              Yangilash
            </Button>
            <Link to="/admin/products/new">
              <Button className="bg-admin-primary hover:bg-admin-primary-600">
                <PlusIcon className="mr-2 h-4 w-4" />
                Yangi mahsulot
              </Button>
            </Link>
          </>
        }
      />

      <div className="rounded-xl border border-admin-border bg-white p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative max-w-sm flex-1">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-admin-muted" />
            <input
              type="text"
              placeholder="Mahsulot nomi yoki SKU bo'yicha qidirish..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-admin-border py-2 pl-9 pr-3 text-sm focus:border-admin-primary focus:outline-none"
            />
          </div>

          <select
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-admin-border px-3 py-2 text-sm focus:border-admin-primary focus:outline-none"
          >
            <option value="">Barcha toifalar</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-admin-border px-3 py-2 text-sm focus:border-admin-primary focus:outline-none"
          >
            <option value="">Barchasi</option>
            <option value="active">Faol</option>
            <option value="inactive">Faol emas</option>
          </select>

          {selected.size > 0 && (
            <Button
              variant="outline"
              className="border-admin-danger/30 text-admin-danger hover:bg-admin-danger-50"
              onClick={() => bulkDeactivate.mutate()}
              disabled={bulkDeactivate.isPending}
            >
              {selected.size} tanlangan — Faolsizlantirish
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-admin-border bg-white">
        <div className="flex items-center justify-between border-b border-admin-border px-5 py-4">
          <h2 className="text-base font-semibold text-admin-primary">
            Barcha mahsulotlar {data ? `(${data.totalCount})` : ""}
          </h2>
          <div className="flex items-center gap-2 text-xs font-medium text-admin-muted">
            <span className="rounded-full bg-slate-100 px-2.5 py-1">{items.filter((p) => p.isActive).length} faol</span>
            {selected.size > 0 && (
              <span className="rounded-full bg-admin-accent-50 px-2.5 py-1 text-admin-accent">{selected.size} tanlangan</span>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="sticky top-0 z-10 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-admin-muted">
              <tr>
                <th className="w-10 px-4 py-3">
                  <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} />
                </th>
                <th className="px-2 py-3">Rasm</th>
                <th className="px-4 py-3">Nomi</th>
                <th className="px-4 py-3">Toifa</th>
                <th className="px-4 py-3">Narxi</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">SEO</th>
                <th className="px-4 py-3 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && <TableSkeleton columns={8} />}

              {isError && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-admin-danger">
                    Mahsulotlarni yuklashda xatolik yuz berdi.
                  </td>
                </tr>
              )}

              {!isLoading && items.length === 0 && (
                <tr>
                  <td colSpan={8}>
                    <EmptyState
                      title="Mahsulotlar topilmadi"
                      description="Qidiruv yoki filtrlarni o'zgartirib ko'ring, yoki yangi mahsulot qo'shing."
                      action={
                        <Link to="/admin/products/new">
                          <Button size="sm" className="bg-admin-primary">
                            <PlusIcon className="mr-2 h-4 w-4" /> Yangi mahsulot
                          </Button>
                        </Link>
                      }
                    />
                  </td>
                </tr>
              )}

              {items.map((product) => {
                const seo = computeSeoScore(product);
                const thumb = resolveMediaUrl(product.images.find((i) => i.isPrimary)?.url ?? product.images[0]?.url);

                return (
                  <tr key={product.id} className="border-t border-admin-border transition-colors hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selected.has(product.id)} onChange={() => toggleSelectOne(product.id)} />
                    </td>
                    <td className="px-2 py-3">
                      <div className="h-12 w-12 overflow-hidden rounded-lg border border-admin-border bg-slate-50">
                        <img
                          src={thumb ?? FALLBACK_IMAGE}
                          alt={product.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-admin-primary">{product.name}</p>
                      <p className="text-xs text-admin-muted">/{product.slug}</p>
                    </td>
                    <td className="px-4 py-3 text-admin-muted">{product.categoryName}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-admin-primary">{product.price.toLocaleString()} so'm</p>
                      {product.oldPrice && product.oldPrice > product.price && (
                        <p className="text-xs text-admin-muted line-through">{product.oldPrice.toLocaleString()} so'm</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        <ProductStatusBadge isActive={product.isActive} />
                        <StockBadge stockQuantity={product.stockQuantity} />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <SeoStatusBadge report={seo} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <IconButton
                          label={product.isFeatured ? "Tavsiya etilganlardan olib tashlash" : "Tavsiya etilganlarga qo'shish"}
                          variant={product.isFeatured ? "active" : "default"}
                          onClick={() => toggleFeatured.mutate(product)}
                        >
                          <StarIcon filled={product.isFeatured} />
                        </IconButton>
                        <IconButton
                          label={product.isActive ? "Faolsizlantirish" : "Faollashtirish"}
                          onClick={() => toggleActive.mutate({ id: product.id, isActive: !product.isActive })}
                        >
                          <EyeIcon />
                        </IconButton>
                        <Link to={`/admin/products/${product.id}`}>
                          <IconButton label="Tahrirlash">
                            <PencilIcon />
                          </IconButton>
                        </Link>
                        <IconButton
                          label="O'chirish"
                          variant="danger"
                          onClick={() => {
                            if (confirm(`"${product.name}" mahsulotini o'chirmoqchimisiz?`)) {
                              remove.mutate(product.id);
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

        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-admin-border px-5 py-3">
            <p className="text-xs text-admin-muted">
              {page} / {data.totalPages} sahifa
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Oldingi
              </Button>
              <Button variant="outline" size="sm" disabled={page >= data.totalPages} onClick={() => setPage((p) => p + 1)}>
                Keyingi
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
