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

  const [form, setForm] = useState({ Address: "", Latitude: "", Longitude: "" });

  useEffect(() => {
    if (!data) return;
    setForm({
      Address: data.Address ?? "",
      Latitude: data.Latitude ?? "",
      Longitude: data.Longitude ?? "",
    });
  }, [data]);

  const save = useMutation({
    mutationFn: () => settingsApi.updateGroup(GROUP, form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", GROUP] });
      addToast("Sozlamalar saqlandi");
    },
    onError: () => addToast("Saqlashda xatolik yuz berdi.", "error"),
  });

  const latNum = Number(form.Latitude);
  const lngNum = Number(form.Longitude);
  const hasValidCoords = form.Latitude.trim() !== "" && form.Longitude.trim() !== "" && !Number.isNaN(latNum) && !Number.isNaN(lngNum);

  return (
    <div className="space-y-6">
      <PageHeader title="Umumiy sozlamalar" description="Kompaniya manzili va xarita koordinatalari" />

      <div className="max-w-2xl rounded-xl border border-admin-border bg-white p-6">
        <h2 className="text-base font-semibold text-admin-primary">Manzil va xarita</h2>
        <p className="mt-1 text-sm text-admin-muted">
          Bu ma'lumotlar "Aloqa" sahifasidagi xaritada ko'rsatiladi. Koordinatalarni kiritsangiz, xaritada aniq nuqtaga
          belgi (metka) qo'yiladi.
        </p>

        {isLoading ? (
          <div className="mt-6 h-40 animate-pulse rounded-lg bg-slate-100" />
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-admin-primary">Latitude (kenglik)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={form.Latitude}
                  onChange={(e) => setForm((f) => ({ ...f, Latitude: e.target.value }))}
                  placeholder="41.311081"
                  className="w-full rounded-lg border border-admin-border px-3 py-2 text-sm focus:border-admin-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-admin-primary">Longitude (uzunlik)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={form.Longitude}
                  onChange={(e) => setForm((f) => ({ ...f, Longitude: e.target.value }))}
                  placeholder="69.240562"
                  className="w-full rounded-lg border border-admin-border px-3 py-2 text-sm focus:border-admin-primary focus:outline-none"
                />
              </div>
            </div>
            <p className="text-xs text-admin-muted">
              Koordinatalarni Yandex yoki Google xaritadan joyni bosib, "koordinatalarni nusxalash" orqali olishingiz mumkin.
            </p>

            {hasValidCoords && (
              <div className="overflow-hidden rounded-lg border border-admin-border">
                <iframe
                  key={`${latNum}-${lngNum}`}
                  title="Xarita ko'rinishi"
                  className="h-64 w-full"
                  src={`https://yandex.ru/map-widget/v1/?ll=${lngNum}%2C${latNum}&z=16&pt=${lngNum},${latNum},pm2rdl`}
                />
              </div>
            )}

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
