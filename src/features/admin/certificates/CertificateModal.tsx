import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { FileText, ShieldCheck, Stamp, Award, Upload, X, Globe, Link } from "lucide-react";
import { mediaApi } from "../../../api/endpoints/media";
import { languagesApi } from "../../../api/endpoints/languages";
import { Button } from "../../../components/ui/button";
import { resolveMediaUrl } from "../../../lib/utils/media";
import {
  certificatesApi,
  CERTIFICATE_CATEGORIES,
  CERTIFICATE_SCOPES,
  type Certificate,
  type CertificateFormValues,
  type CertificateTranslation,
} from "../../../api/endpoints/certificates";

const ICONS = [
  { value: "shield", label: "Qalqon", Icon: ShieldCheck },
  { value: "document", label: "Hujjat", Icon: FileText },
  { value: "seal", label: "Muhur", Icon: Stamp },
  { value: "award", label: "Mukofot", Icon: Award },
];

interface Props {
  open: boolean;
  initialData?: Certificate | null;
  onSave: (values: CertificateFormValues) => void;
  onClose: () => void;
  isSaving: boolean;
}

export function CertificateModal({ open, initialData, onSave, onClose, isSaving }: Props) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CertificateFormValues>({
    defaultValues: { title: "", description: "", issuedBy: "", certificateNumber: "", issueDate: "", expiryDate: "", sortOrder: 0, isActive: true },
  });

  const [fileId, setFileId] = useState<string | undefined>(undefined);
  const [fileUrl, setFileUrl] = useState<string | undefined>(undefined);
  const [icon, setIcon] = useState<string>("shield");
  const [isUploading, setIsUploading] = useState(false);
  const [activeLang, setActiveLang] = useState("uz");
  const [translations, setTranslations] = useState<Record<string, CertificateTranslation>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: languages } = useQuery({ queryKey: ["languages"], queryFn: languagesApi.getAll });
  const activeLanguages = (languages ?? []).filter((l) => l.isActive);

  useEffect(() => {
    if (open) {
      reset(
        initialData
          ? {
              title: initialData.title,
              description: initialData.description ?? "",
              issuedBy: initialData.issuedBy ?? "",
              certificateNumber: initialData.certificateNumber ?? "",
              issueDate: initialData.issueDate ?? "",
              expiryDate: initialData.expiryDate ?? "",
              category: initialData.category ?? "",
              scope: initialData.scope ?? "",
              verificationUrl: initialData.verificationUrl ?? "",
              sortOrder: initialData.sortOrder,
              isActive: initialData.isActive,
            }
          : { title: "", description: "", issuedBy: "", certificateNumber: "", issueDate: "", expiryDate: "", category: "", scope: "", verificationUrl: "", sortOrder: 0, isActive: true }
      );
      setFileId(initialData?.fileId);
      setFileUrl(initialData?.fileUrl ? resolveMediaUrl(initialData.fileUrl) ?? undefined : undefined);
      setIcon(initialData?.icon ?? "shield");
      setTranslations(initialData?.translations ?? {});
      setActiveLang("uz");
    }
  }, [open, initialData, reset]);

  const handleFile = async (file: File) => {
    setIsUploading(true);
    try {
      const media = await mediaApi.upload(file);
      setFileId(media.id);
      setFileUrl(resolveMediaUrl(media.url) ?? undefined);
    } finally {
      setIsUploading(false);
    }
  };

  const setTranslationField = (lang: string, field: keyof CertificateTranslation, value: string) => {
    setTranslations((prev) => ({
      ...prev,
      [lang]: { ...prev[lang], [field]: value },
    }));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl max-h-[92vh] flex flex-col">
        <div className="border-b border-slate-100 px-6 py-4 shrink-0">
          <h2 className="text-base font-semibold text-admin-primary">
            {initialData ? "Sertifikatni tahrirlash" : "Yangi sertifikat"}
          </h2>
        </div>

        <form
          onSubmit={handleSubmit((vals) => onSave({ ...vals, icon, fileId, translations }))}
          className="flex flex-col gap-0 overflow-y-auto"
        >
          <div className="flex flex-col gap-4 p-6">

            {/* ── Asosiy ma'lumotlar ── */}
            <p className="text-xs font-semibold uppercase tracking-wide text-admin-muted">Asosiy ma'lumotlar</p>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Sarlavha (UZ) *</label>
                <input {...register("title", { required: "Sarlavha majburiy" })} className="input" placeholder="ISO 22000" />
                {errors.title && <p className="mt-1 text-xs text-admin-danger">{errors.title.message}</p>}
              </div>
              <div className="col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Tavsif (UZ)</label>
                <textarea {...register("description")} rows={2} className="input resize-none" placeholder="Sertifikat haqida qisqacha ma'lumot" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Beruvchi tashkilot</label>
                <input {...register("issuedBy")} className="input" placeholder="Bureau Veritas, SGS..." />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Sertifikat raqami</label>
                <input {...register("certificateNumber")} className="input" placeholder="ISO-22000-2024" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Berilgan sana</label>
                <input type="date" {...register("issueDate")} className="input" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Amal qilish muddati</label>
                <input type="date" {...register("expiryDate")} className="input" />
              </div>
            </div>

            {/* ── Tasnif ── */}
            <p className="text-xs font-semibold uppercase tracking-wide text-admin-muted pt-1">Tasnif</p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Kategoriya</label>
                <select {...register("category")} className="input bg-white">
                  <option value="">— Tanlang —</option>
                  {CERTIFICATE_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Qo'llanish doirasi</label>
                <select {...register("scope")} className="input bg-white">
                  <option value="">— Tanlang —</option>
                  {CERTIFICATE_SCOPES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* ── Ikon ── */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Ikon (saytda ko'rsatish uchun)</label>
              <div className="flex gap-2">
                {ICONS.map(({ value, label, Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setIcon(value)}
                    className={`flex flex-1 flex-col items-center gap-1 rounded-xl border-2 py-2.5 text-xs font-medium transition-all ${
                      icon === value
                        ? "border-admin-accent bg-admin-accent-50 text-admin-accent"
                        : "border-slate-200 text-slate-500 hover:border-slate-300"
                    }`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Tasdiqlash havolasi ── */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700">
                <Link className="h-3.5 w-3.5" /> Tasdiqlash havolasi (URL)
              </label>
              <input {...register("verificationUrl")} className="input" placeholder="https://www.bureauveritas.com/verify/..." />
            </div>

            {/* ── Ko'p tilli tarjimalar ── */}
            {activeLanguages.length > 1 && (
              <div>
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-admin-muted">
                  <Globe className="h-3.5 w-3.5" /> Ko'p tilli tarjimalar
                </p>
                <div className="rounded-xl border border-slate-200 overflow-hidden">
                  <div className="flex border-b border-slate-200 bg-slate-50">
                    {activeLanguages.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => setActiveLang(lang.code)}
                        className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
                          activeLang === lang.code
                            ? "bg-white text-admin-primary border-b-2 border-admin-accent"
                            : "text-admin-muted hover:text-admin-primary"
                        }`}
                      >
                        {lang.code.toUpperCase()} — {lang.nativeName}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-col gap-3 p-4">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600">Sarlavha ({activeLang.toUpperCase()})</label>
                      <input
                        value={translations[activeLang]?.title ?? ""}
                        onChange={(e) => setTranslationField(activeLang, "title", e.target.value)}
                        className="input"
                        placeholder={`Sarlavha ${activeLang.toUpperCase()} tilida`}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600">Tavsif ({activeLang.toUpperCase()})</label>
                      <textarea
                        value={translations[activeLang]?.description ?? ""}
                        onChange={(e) => setTranslationField(activeLang, "description", e.target.value)}
                        rows={2}
                        className="input resize-none"
                        placeholder={`Tavsif ${activeLang.toUpperCase()} tilida`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Fayl ── */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Fayl (PDF yoki rasm)</label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
              />
              {fileUrl ? (
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <FileText className="h-5 w-5 shrink-0 text-admin-accent" />
                  <span className="flex-1 truncate text-sm text-slate-700">{fileUrl.split("/").pop()}</span>
                  <button type="button" onClick={() => { setFileId(undefined); setFileUrl(undefined); }} className="text-admin-muted hover:text-admin-danger">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 py-4 text-sm text-slate-500 transition-colors hover:border-admin-accent hover:text-admin-accent disabled:opacity-50"
                >
                  <Upload className="h-4 w-4" />
                  {isUploading ? "Yuklanmoqda..." : "Fayl yuklash (PDF, rasm)"}
                </button>
              )}
            </div>

            {/* ── Tartib va holat ── */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Tartib raqami</label>
                <input type="number" {...register("sortOrder", { valueAsNumber: true })} className="input" />
              </div>
              <div className="flex items-end pb-1">
                <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
                  <input type="checkbox" {...register("isActive")} className="h-4 w-4 rounded border-slate-300 text-admin-accent" />
                  Faol
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-100 px-6 py-4 shrink-0">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving || isUploading}>
              Bekor qilish
            </Button>
            <Button type="submit" disabled={isSaving || isUploading}>
              {isSaving ? "Saqlanmoqda..." : "Saqlash"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
