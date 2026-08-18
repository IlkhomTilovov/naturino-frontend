import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Store } from "lucide-react";
import { shopsApi } from "../../../api/endpoints/shops";
import { Button } from "../../../components/ui/button";
import { PageHeader } from "../../../components/admin/PageHeader";
import { EmptyState } from "../../../components/admin/EmptyState";
import { TableSkeleton } from "../../../components/admin/TableSkeleton";
import { IconButton } from "../../../components/admin/IconButton";
import { PencilIcon, PlusIcon, SearchIcon, TrashIcon } from "../../../components/admin/icons";
import { useToastStore } from "../../../store/toastStore";
import type { Shop, ShopFormValues } from "../../../api/endpoints/shops";
import { ShopModal } from "./ShopModal";

const PAGE_SIZE = 20;

export function ShopsPage() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Shop | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["shops", page, search],
    queryFn: () => shopsApi.getPaged({ page, pageSize: PAGE_SIZE, search: search || undefined }),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["shops"] });

  const save = useMutation({
    mutationFn: ({ values, id }: { values: ShopFormValues; id?: string }) =>
      id ? shopsApi.update(id, values) : shopsApi.create(values),
    onSuccess: () => {
      invalidate();
      addToast("Do'kon muvaffaqiyatli saqlandi");
      setShowModal(false);
      setEditing(null);
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => shopsApi.remove(id),
    onSuccess: () => {
      invalidate();
      addToast("Do'kon o'chirildi");
    },
    onError: () => addToast("Do'konni o'chirishda xatolik yuz berdi.", "error"),
  });

  const toggleStatus = useMutation({
    mutationFn: (id: string) => shopsApi.toggleStatus(id),
    onSuccess: invalidate,
    onError: () => addToast("Holatni o'zgartirishda xatolik yuz berdi.", "error"),
  });

  const shops = data?.items ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Do'konlar"
        description={`Mahsulot sotiladigan do'konlar ro'yxati — ${data?.totalCount ?? 0} ta`}
        actions={
          <Button
            className="bg-admin-primary hover:bg-admin-primary-600"
            onClick={() => {
              setEditing(null);
              setShowModal(true);
            }}
          >
            <PlusIcon className="mr-2 h-4 w-4" /> Yangi do'kon
          </Button>
        }
      />

      <div className="rounded-xl border border-admin-border bg-white p-4">
        <div className="relative max-w-sm">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-admin-muted" />
          <input
            type="text"
            placeholder="Nomi, shahar yoki davlat bo'yicha qidirish..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-lg border border-admin-border py-2 pl-9 pr-3 text-sm focus:border-admin-primary focus:outline-none"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-admin-border bg-white">
        <div className="flex items-center justify-between border-b border-admin-border px-5 py-4">
          <h2 className="text-base font-semibold text-admin-primary">Barcha do'konlar ({data?.totalCount ?? 0})</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="sticky top-0 z-10 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-admin-muted">
              <tr>
                <th className="px-4 py-3">Nomi</th>
                <th className="px-4 py-3">Davlat</th>
                <th className="px-4 py-3">Shahar</th>
                <th className="px-4 py-3">Manzil</th>
                <th className="px-4 py-3">Telefon</th>
                <th className="px-4 py-3">Koordinata</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && <TableSkeleton columns={8} />}

              {!isLoading && shops.length === 0 && (
                <tr>
                  <td colSpan={8}>
                    <EmptyState
                      icon={Store}
                      title="Do'konlar topilmadi"
                      description="Qidiruvni o'zgartiring yoki yangi do'kon qo'shing."
                      action={
                        <Button size="sm" className="bg-admin-primary" onClick={() => setShowModal(true)}>
                          <PlusIcon className="mr-2 h-4 w-4" /> Yangi do'kon
                        </Button>
                      }
                    />
                  </td>
                </tr>
              )}

              {shops.map((shop) => (
                <tr key={shop.id} className="border-t border-admin-border transition-colors hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-admin-primary">{shop.name}</td>
                  <td className="px-4 py-3 text-admin-muted">{shop.country}</td>
                  <td className="px-4 py-3 text-admin-muted">{shop.city}</td>
                  <td className="max-w-[200px] truncate px-4 py-3 text-admin-muted" title={shop.address}>
                    {shop.address}
                  </td>
                  <td className="px-4 py-3 text-admin-muted">{shop.phone || "—"}</td>
                  <td className="px-4 py-3 text-admin-muted">
                    {shop.latitude != null && shop.longitude != null ? (
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs">✓ bor</span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={shop.isActive}
                      onClick={() => toggleStatus.mutate(shop.id)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-all duration-300 ease-in-out ${
                        shop.isActive ? "bg-green-500" : "bg-slate-400"
                      }`}
                    >
                      <span
                        className={`block size-4 rounded-full bg-white shadow transition-transform duration-300 ease-in-out ${
                          shop.isActive ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <IconButton
                        label="Tahrirlash"
                        onClick={() => {
                          setEditing(shop);
                          setShowModal(true);
                        }}
                      >
                        <PencilIcon />
                      </IconButton>
                      <IconButton
                        label="O'chirish"
                        variant="danger"
                        onClick={() => {
                          if (confirm(`"${shop.name}" do'konini o'chirmoqchimisiz?`)) {
                            remove.mutate(shop.id);
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

      {showModal && (
        <ShopModal
          shop={editing}
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
