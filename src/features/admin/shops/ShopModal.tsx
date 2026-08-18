import { useState } from "react";
import { isAxiosError } from "axios";
import { Button } from "../../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { FormSectionCard } from "../../../components/admin/FormSectionCard";
import type { Shop, ShopFormValues } from "../../../api/endpoints/shops";

export function ShopModal({
  shop,
  onClose,
  onSubmit,
  isSubmitting,
}: {
  shop: Shop | null;
  onClose: () => void;
  onSubmit: (values: ShopFormValues) => Promise<void>;
  isSubmitting: boolean;
}) {
  const [values, setValues] = useState<ShopFormValues>({
    name: shop?.name ?? "",
    country: shop?.country ?? "",
    city: shop?.city ?? "",
    address: shop?.address ?? "",
    phone: shop?.phone ?? "",
    latitude: shop?.latitude ?? null,
    longitude: shop?.longitude ?? null,
    isActive: shop?.isActive ?? true,
  });
  const [latText, setLatText] = useState(shop?.latitude?.toString() ?? "");
  const [lngText, setLngText] = useState(shop?.longitude?.toString() ?? "");
  const [serverError, setServerError] = useState<string | null>(null);

  const update = <K extends keyof ShopFormValues>(key: K, value: ShopFormValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    try {
      await onSubmit(values);
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 400) {
        setServerError("Barcha majburiy maydonlarni to'ldiring.");
      } else {
        setServerError("Saqlashda xatolik yuz berdi.");
      }
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent showCloseButton={false} className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl p-0">
        <DialogHeader className="flex-row items-center justify-between gap-2 border-b border-admin-border px-6 py-4">
          <DialogTitle className="text-lg font-semibold text-admin-primary">
            {shop ? "Do'konni tahrirlash" : "Yangi do'kon"}
          </DialogTitle>
          <button type="button" onClick={onClose} className="text-admin-muted hover:text-admin-primary">
            ✕
          </button>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4 px-6 py-5">
          <FormSectionCard title="Do'kon ma'lumotlari">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="mb-1 block text-sm font-medium text-admin-primary">
                  Nomi <span className="text-admin-danger">*</span>
                </label>
                <input
                  required
                  className="input"
                  placeholder="Toshkent Petshop"
                  value={values.name}
                  onChange={(e) => update("name", e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-admin-primary">
                  Davlat <span className="text-admin-danger">*</span>
                </label>
                <input
                  required
                  className="input"
                  placeholder="O'zbekiston"
                  value={values.country}
                  onChange={(e) => update("country", e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-admin-primary">
                  Shahar <span className="text-admin-danger">*</span>
                </label>
                <input
                  required
                  className="input"
                  placeholder="Toshkent"
                  value={values.city}
                  onChange={(e) => update("city", e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <label className="mb-1 block text-sm font-medium text-admin-primary">
                  Manzil <span className="text-admin-danger">*</span>
                </label>
                <input
                  required
                  className="input"
                  placeholder="Chilonzor tumani, ..."
                  value={values.address}
                  onChange={(e) => update("address", e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-admin-primary">Telefon</label>
                <input
                  className="input"
                  placeholder="+998 XX XXX XX XX"
                  value={values.phone}
                  onChange={(e) => update("phone", e.target.value)}
                />
              </div>
              <label className="flex items-center gap-2 pt-6 text-sm font-medium text-admin-primary">
                <input type="checkbox" checked={values.isActive} onChange={(e) => update("isActive", e.target.checked)} />
                Faol
              </label>
              <div>
                <label className="mb-1 block text-sm font-medium text-admin-primary">Latitude (kenglik)</label>
                <input
                  className="input"
                  inputMode="decimal"
                  placeholder="41.311081"
                  value={latText}
                  onChange={(e) => {
                    setLatText(e.target.value);
                    const n = Number(e.target.value);
                    update("latitude", e.target.value.trim() === "" || Number.isNaN(n) ? null : n);
                  }}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-admin-primary">Longitude (uzunlik)</label>
                <input
                  className="input"
                  inputMode="decimal"
                  placeholder="69.240562"
                  value={lngText}
                  onChange={(e) => {
                    setLngText(e.target.value);
                    const n = Number(e.target.value);
                    update("longitude", e.target.value.trim() === "" || Number.isNaN(n) ? null : n);
                  }}
                />
              </div>
            </div>
            <p className="mt-2 text-xs text-admin-muted">
              Koordinata ixtiyoriy — kiritilsa, jamoat sahifasida "Xaritada ko'rish" havolasi chiqadi.
            </p>
          </FormSectionCard>

          {serverError && <p className="rounded-md bg-admin-danger-50 px-3 py-2 text-sm text-admin-danger">{serverError}</p>}

          <div className="flex justify-end gap-3 border-t border-admin-border pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Bekor qilish
            </Button>
            <Button type="submit" className="bg-admin-primary hover:bg-admin-primary-600" disabled={isSubmitting}>
              {isSubmitting ? "Saqlanmoqda..." : shop ? "Saqlash" : "Yaratish"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
