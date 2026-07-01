import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Award } from "lucide-react";
import { certificatesApi, type Certificate, type CertificateFormValues } from "../../../api/endpoints/certificates";
import { Button } from "../../../components/ui/button";
import { PageHeader } from "../../../components/admin/PageHeader";
import { EmptyState } from "../../../components/admin/EmptyState";
import { TableSkeleton } from "../../../components/admin/TableSkeleton";
import { IconButton } from "../../../components/admin/IconButton";
import { PencilIcon, PlusIcon, SearchIcon, TrashIcon } from "../../../components/admin/icons";
import { useToastStore } from "../../../store/toastStore";
import { CertificateModal } from "./CertificateModal";

export function CertificatesPage() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((state) => state.addToast);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Certificate | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { data: certificates, isLoading } = useQuery({
    queryKey: ["certificates"],
    queryFn: certificatesApi.getAll,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["certificates"] });

  const toggleStatus = useMutation({
    mutationFn: (id: string) => certificatesApi.toggleStatus(id),
    onSuccess: invalidate,
    onError: () => addToast("Statusni o'zgartirishda xatolik", "error"),
  });

  const remove = useMutation({
    mutationFn: (id: string) => certificatesApi.remove(id),
    onSuccess: () => { invalidate(); addToast("Sertifikat o'chirildi"); },
    onError: () => addToast("O'chirishda xatolik yuz berdi", "error"),
  });

  const save = useMutation({
    mutationFn: (values: CertificateFormValues) =>
      editing ? certificatesApi.update(editing.id, values) : certificatesApi.create(values),
    onSuccess: () => {
      invalidate();
      addToast(editing ? "Sertifikat yangilandi" : "Sertifikat qo'shildi");
      setShowModal(false);
      setEditing(null);
    },
    onError: () => addToast("Saqlashda xatolik yuz berdi", "error"),
  });

  const filtered = (certificates ?? []).filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    (c.issuedBy ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = (certificates ?? []).filter((c) => c.isActive).length;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Sertifikatlar"
        description={`Kompaniya sertifikatlari va muvofiqlik hujjatlari — ${certificates?.length ?? 0} ta`}
        actions={
          <Button onClick={() => { setEditing(null); setShowModal(true); }}>
            <PlusIcon className="mr-1.5 h-4 w-4" /> Yangi sertifikat
          </Button>
        }
      />

      <div className="rounded-2xl border border-admin-border bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-admin-border px-4 py-3">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-admin-muted" />
            <input
              type="text"
              placeholder="Qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-56 rounded-lg border border-admin-border py-1.5 pl-8 pr-3 text-sm focus:border-admin-primary focus:outline-none"
            />
          </div>
          <span className="rounded-full bg-admin-accent-50 px-2.5 py-1 text-xs font-semibold text-admin-accent">
            {activeCount} faol
          </span>
        </div>

        {isLoading ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <tbody><TableSkeleton rows={4} columns={6} /></tbody>
            </table>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Award}
            title="Sertifikatlar topilmadi"
            description="Yangi sertifikat qo'shing"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-admin-border bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-admin-muted">
                  <th className="px-4 py-3">Sarlavha</th>
                  <th className="px-4 py-3">Beruvchi</th>
                  <th className="px-4 py-3">Raqam</th>
                  <th className="px-4 py-3">Muddati</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-admin-border">
                {filtered.map((cert) => (
                  <tr key={cert.id} className="group transition-colors hover:bg-slate-50/60">
                    <td className="px-4 py-3">
                      <div className="font-medium text-admin-primary">{cert.title}</div>
                      {cert.description && (
                        <div className="mt-0.5 max-w-xs truncate text-xs text-admin-muted">{cert.description}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-admin-muted">{cert.issuedBy ?? "—"}</td>
                    <td className="px-4 py-3 font-mono text-xs text-admin-muted">{cert.certificateNumber ?? "—"}</td>
                    <td className="px-4 py-3 text-admin-muted">
                      {cert.expiryDate ? new Date(cert.expiryDate).toLocaleDateString("uz-UZ") : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={cert.isActive}
                        onClick={() => toggleStatus.mutate(cert.id)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400/50 focus-visible:ring-offset-2 ${
                          cert.isActive
                            ? "bg-green-500 shadow-[inset_0_1px_3px_rgba(0,0,0,0.2)]"
                            : "bg-slate-400 shadow-[inset_0_1px_3px_rgba(0,0,0,0.15)]"
                        }`}
                      >
                        <span
                          className={`relative flex size-4 items-center justify-center rounded-full bg-gradient-to-b from-white to-slate-100 shadow-[0_2px_6px_rgba(0,0,0,0.3),0_1px_2px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.9)] transition-transform duration-300 ease-in-out ${
                            cert.isActive ? "translate-x-4" : "translate-x-0"
                          }`}
                        >
                          <span className="flex gap-[1.5px]">
                            {[0, 1, 2].map((i) => (
                              <span key={i} className="block h-2 w-px rounded-full bg-slate-400/60" />
                            ))}
                          </span>
                        </span>
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <IconButton label="Tahrirlash" onClick={() => { setEditing(cert); setShowModal(true); }}>
                          <PencilIcon className="h-4 w-4" />
                        </IconButton>
                        <IconButton
                          label="O'chirish"
                          variant="danger"
                          onClick={() => {
                            if (confirm(`"${cert.title}" sertifikatini o'chirishni tasdiqlaysizmi?`)) {
                              remove.mutate(cert.id);
                            }
                          }}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CertificateModal
        open={showModal}
        initialData={editing}
        onSave={(values) => save.mutate(values)}
        onClose={() => { setShowModal(false); setEditing(null); }}
        isSaving={save.isPending}
      />
    </div>
  );
}
