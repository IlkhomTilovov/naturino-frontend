import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { settingsApi } from "../../../api/endpoints/settings";
import { Button } from "../../../components/ui/button";
import { PageHeader } from "../../../components/admin/PageHeader";
import { useToastStore } from "../../../store/toastStore";

const GROUP = "General";

export function SettingsPage() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  const { data, isLoading } = useQuery({
    queryKey: ["settings", GROUP],
    queryFn: () => settingsApi.getGroup(GROUP),
  });

  const [form, setForm] = useState({ Address: "" });

  useEffect(() => {
    if (!data) return;
    setForm({ Address: data.Address ?? "" });
  }, [data]);

  const save = useMutation({
    mutationFn: () => settingsApi.updateGroup(GROUP, form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", GROUP] });
      addToast("Sozlamalar saqlandi");
    },
    onError: () => addToast("Saqlashda xatolik yuz berdi.", "error"),
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Umumiy sozlamalar" description="Kompaniya manzili" />

      <div className="max-w-2xl rounded-xl border border-admin-border bg-white p-6">
        <h2 className="text-base font-semibold text-admin-primary">Manzil</h2>
        <p className="mt-1 text-sm text-admin-muted">
          Bu matn "Aloqa" sahifasidagi manzil sarlavhasi ostida ko'rsatiladi. Xaritadagi metkalar esa{" "}
          <strong>Do'konlar</strong> bo'limida kiritilgan koordinatalardan dinamik olinadi.
        </p>

        {isLoading ? (
          <div className="mt-6 h-16 animate-pulse rounded-lg bg-slate-100" />
        ) : (
          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-admin-primary">Manzil</label>
              <input
                type="text"
                value={form.Address}
                onChange={(e) => setForm((f) => ({ ...f, Address: e.target.value }))}
                placeholder="Toshkent, O'zbekiston"
                className="w-full rounded-lg border border-admin-border px-3 py-2 text-sm focus:border-admin-primary focus:outline-none"
              />
            </div>

            <div className="pt-2">
              <Button
                className="bg-admin-primary hover:bg-admin-primary-600"
                disabled={save.isPending}
                onClick={() => save.mutate()}
              >
                {save.isPending ? "Saqlanmoqda..." : "Saqlash"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
