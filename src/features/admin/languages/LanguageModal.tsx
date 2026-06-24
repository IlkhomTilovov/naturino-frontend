import { useState } from "react";
import { isAxiosError } from "axios";
import { Button } from "../../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { FormSectionCard } from "../../../components/admin/FormSectionCard";
import type { Language, LanguageFormValues } from "../../../types/language";

export function LanguageModal({
  language,
  onClose,
  onSubmit,
  isSubmitting,
}: {
  language: Language | null;
  onClose: () => void;
  onSubmit: (values: LanguageFormValues) => Promise<void>;
  isSubmitting: boolean;
}) {
  const [values, setValues] = useState<LanguageFormValues>({
    name: language?.name ?? "",
    nativeName: language?.nativeName ?? "",
    code: language?.code ?? "",
    locale: language?.locale ?? "",
    flag: language?.flag ?? "",
    direction: language?.direction ?? "ltr",
    isActive: language?.isActive ?? true,
    sortOrder: language?.sortOrder ?? 0,
  });
  const [serverError, setServerError] = useState<string | null>(null);

  const update = <K extends keyof LanguageFormValues>(key: K, value: LanguageFormValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    try {
      await onSubmit(values);
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 409) {
        setServerError(error.response.data?.detail ?? "Shu kod yoki locale bilan til allaqachon mavjud.");
      } else if (isAxiosError(error) && error.response?.status === 400) {
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
            {language ? "Tilni tahrirlash" : "Yangi til"}
          </DialogTitle>
          <button type="button" onClick={onClose} className="text-admin-muted hover:text-admin-primary">
            ✕
          </button>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4 px-6 py-5">
          <FormSectionCard title="Asosiy ma'lumotlar">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-admin-primary">
                  Nomi (lotin) <span className="text-admin-danger">*</span>
                </label>
                <input
                  required
                  className="input"
                  placeholder="Russian"
                  value={values.name}
                  onChange={(e) => update("name", e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-admin-primary">
                  Mahalliy nomi <span className="text-admin-danger">*</span>
                </label>
                <input
                  required
                  className="input"
                  placeholder="Русский"
                  value={values.nativeName}
                  onChange={(e) => update("nativeName", e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-admin-primary">
                  Kod <span className="text-admin-danger">*</span>
                </label>
                <input
                  required
                  className="input"
                  placeholder="ru"
                  maxLength={10}
                  value={values.code}
                  onChange={(e) => update("code", e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-admin-primary">
                  Locale <span className="text-admin-danger">*</span>
                </label>
                <input
                  required
                  className="input"
                  placeholder="ru-RU"
                  value={values.locale}
                  onChange={(e) => update("locale", e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-admin-primary">Bayroq (emoji)</label>
                <input
                  className="input"
                  placeholder="🇷🇺"
                  value={values.flag}
                  onChange={(e) => update("flag", e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-admin-primary">Yo'nalish</label>
                <select
                  className="input"
                  value={values.direction}
                  onChange={(e) => update("direction", e.target.value as "ltr" | "rtl")}
                >
                  <option value="ltr">LTR (chapdan o'ngga)</option>
                  <option value="rtl">RTL (o'ngdan chapga)</option>
                </select>
              </div>
            </div>
          </FormSectionCard>

          <FormSectionCard title="Tashkillashtirish">
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <label className="mb-1 block text-sm font-medium text-admin-primary">Tartib raqami</label>
                <input
                  type="number"
                  className="input"
                  value={values.sortOrder}
                  onChange={(e) => update("sortOrder", Number(e.target.value))}
                />
              </div>
              <label className="flex items-center gap-2 pt-5 text-sm font-medium text-admin-primary">
                <input type="checkbox" checked={values.isActive} onChange={(e) => update("isActive", e.target.checked)} />
                Faol
              </label>
            </div>
            {language?.isDefault && (
              <p className="mt-3 text-xs text-admin-muted">
                Bu standart til — uni faolsizlantirib yoki o'chirib bo'lmaydi.
              </p>
            )}
          </FormSectionCard>

          {serverError && <p className="rounded-md bg-admin-danger-50 px-3 py-2 text-sm text-admin-danger">{serverError}</p>}

          <div className="flex justify-end gap-3 border-t border-admin-border pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Bekor qilish
            </Button>
            <Button type="submit" className="bg-admin-primary hover:bg-admin-primary-600" disabled={isSubmitting}>
              {isSubmitting ? "Saqlanmoqda..." : language ? "Saqlash" : "Yaratish"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
