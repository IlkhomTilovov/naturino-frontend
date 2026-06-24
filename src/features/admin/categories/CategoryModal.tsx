import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { isAxiosError } from "axios";
import { mediaApi } from "../../../api/endpoints/media";
import { Button } from "../../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { FormSectionCard } from "../../../components/admin/FormSectionCard";
import { TagInput } from "../../../components/admin/TagInput";
import { categorySchema, type CategoryFormSchema } from "../../../lib/schemas/category";
import { computeCategorySeoScore } from "../../../lib/utils/categorySeo";
import { FALLBACK_IMAGE, resolveMediaUrl } from "../../../lib/utils/media";
import { slugify } from "../../../lib/utils/slugify";
import type { ProductCategory } from "../../../types/product";

export function CategoryModal({
  category,
  onClose,
  onSubmit,
  isSubmitting,
}: {
  category: ProductCategory | null;
  onClose: () => void;
  onSubmit: (values: CategoryFormSchema, imageFileId: string | null | undefined) => Promise<void>;
  isSubmitting: boolean;
}) {
  const [activeTab, setActiveTab] = useState("general");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFileId, setImageFileId] = useState<string | null | undefined>(undefined);
  const [isUploading, setIsUploading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name ?? "",
      nameRu: category?.nameRu ?? "",
      slug: category?.slug ?? "",
      description: category?.description ?? "",
      sortOrder: category?.sortOrder ?? 0,
      isActive: category?.isActive ?? true,
      metaTitleUz: category?.metaTitleUz ?? "",
      metaTitleRu: category?.metaTitleRu ?? "",
      metaDescriptionUz: category?.metaDescriptionUz ?? "",
      metaDescriptionRu: category?.metaDescriptionRu ?? "",
      metaKeywords: category?.metaKeywords ?? "",
      isIndexable: category?.isIndexable ?? true,
      isFollow: category?.isFollow ?? true,
    },
  });

  useEffect(() => {
    setImageUrl(category?.imageUrl ?? null);
    setImageFileId(undefined);
  }, [category]);

  const values = watch();
  const seoReport = computeCategorySeoScore({ ...values, slug: values.slug || slugify(values.name) });

  const handleFile = async (file: File) => {
    setIsUploading(true);
    try {
      const media = await mediaApi.upload(file);
      setImageFileId(media.id);
      setImageUrl(media.url);
    } finally {
      setIsUploading(false);
    }
  };

  const submit = handleSubmit(async (vals) => {
    setServerError(null);
    try {
      await onSubmit(vals, imageFileId);
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 409) {
        setServerError("Shu nomdagi/slugdagi kategoriya allaqachon mavjud.");
      } else {
        setServerError("Saqlashda xatolik yuz berdi.");
      }
    }
  });

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl p-0 sm:max-w-2xl"
      >
        <DialogHeader className="flex-row items-center justify-between gap-2 border-b border-admin-border px-6 py-4">
          <DialogTitle className="text-lg font-semibold text-admin-primary">
            {category ? "Kategoriyani tahrirlash" : "Yangi toifa"}
          </DialogTitle>
          <button type="button" onClick={onClose} className="text-admin-muted hover:text-admin-primary">
            ✕
          </button>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4 px-6 py-5">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as string)}>
            <TabsList className="h-auto gap-1 rounded-xl bg-slate-100 p-1.5">
              <TabsTrigger value="general" className="rounded-lg px-4 py-2 text-sm font-medium data-active:shadow-sm">
                Asosiy
              </TabsTrigger>
              <TabsTrigger value="seo" className="rounded-lg px-4 py-2 text-sm font-medium data-active:shadow-sm">
                SEO
              </TabsTrigger>
            </TabsList>

          <TabsContent value="general" className="space-y-4 pt-4">
              <FormSectionCard title="Asosiy ma'lumotlar">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-admin-primary">
                      Nomi (UZ) <span className="text-admin-danger">*</span>
                    </label>
                    <input
                      className="input"
                      {...register("name")}
                      onBlur={(e) => {
                        if (!values.slug) setValue("slug", slugify(e.target.value));
                      }}
                    />
                    {errors.name && <p className="mt-1 text-xs text-admin-danger">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-admin-primary">Nomi (RU)</label>
                    <input className="input" {...register("nameRu")} />
                  </div>
                  <div className="col-span-2">
                    <label className="mb-1 block text-sm font-medium text-admin-primary">Slug (URL)</label>
                    <input className="input" placeholder="avtomatik yaratiladi" {...register("slug")} />
                    <p className="mt-1 text-xs text-admin-muted">URL: /catalog/{values.slug || slugify(values.name) || "..."}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="mb-1 block text-sm font-medium text-admin-primary">Tavsif</label>
                    <textarea className="input" rows={2} {...register("description")} />
                  </div>
                </div>
              </FormSectionCard>

              <FormSectionCard title="Rasm">
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragOver(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) void handleFile(file);
                  }}
                  className={`flex h-40 w-40 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed text-center transition-colors ${
                    isDragOver ? "border-admin-accent bg-admin-accent-50" : "border-admin-border"
                  }`}
                >
                  {imageUrl ? (
                    <div className="relative h-full w-full overflow-hidden rounded-xl">
                      <img
                        src={resolveMediaUrl(imageUrl) ?? FALLBACK_IMAGE}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageUrl(null);
                          setImageFileId(null);
                        }}
                        className="absolute right-1 top-1 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white"
                      >
                        O'chirish
                      </button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center gap-1 text-admin-muted">
                      <span className="text-2xl">+</span>
                      <span className="text-xs font-medium">Rasm yuklash</span>
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,.gif"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void handleFile(file);
                    }}
                  />
                </div>
                <p className="mt-2 text-xs text-admin-muted">JPG, PNG, WebP yoki GIF. Maksimum 5MB. Faylni shu yerga torting yoki bosing.</p>
                {isUploading && <p className="mt-1 text-xs text-admin-muted">Yuklanmoqda...</p>}
              </FormSectionCard>

              <FormSectionCard title="Tashkillashtirish">
                <div className="flex items-center gap-6">
                  <div className="flex-1">
                    <label className="mb-1 block text-sm font-medium text-admin-primary">Tartib raqami</label>
                    <input type="number" className="input" {...register("sortOrder")} />
                  </div>
                  <label className="flex items-center gap-2 pt-5 text-sm font-medium text-admin-primary">
                    <input type="checkbox" {...register("isActive")} /> Faol
                  </label>
                </div>
              </FormSectionCard>
          </TabsContent>

          <TabsContent value="seo" className="space-y-4 pt-4">
              <FormSectionCard title="SEO holati">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-admin-primary">{seoReport.score}/100</span>
                </div>
                <ul className="mt-3 space-y-1.5 text-sm">
                  {seoReport.checks.map((check) => (
                    <li key={check.label} className={check.passed ? "text-admin-accent" : "text-admin-warning"}>
                      {check.passed ? "✔" : "⚠"} {check.label}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-admin-muted">
                  SEO maydonlari bo'sh bo'lsa, toifa nomi avtomatik ishlatiladi.
                </p>
              </FormSectionCard>

              <FormSectionCard title="Meta Title">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-admin-muted">Meta Title (UZ)</label>
                    <input className="input" placeholder="Toifa nomi" {...register("metaTitleUz")} />
                    <p className="mt-1 text-xs text-admin-muted">{values.metaTitleUz?.length ?? 0}/60 belgi</p>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-admin-muted">Meta Title (RU)</label>
                    <input className="input" placeholder="Название категории" {...register("metaTitleRu")} />
                    <p className="mt-1 text-xs text-admin-muted">{values.metaTitleRu?.length ?? 0}/60 belgi</p>
                  </div>
                </div>
              </FormSectionCard>

              <FormSectionCard title="Meta Description">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-admin-muted">Meta Description (UZ)</label>
                    <textarea className="input" rows={2} placeholder="Toifa tavsifi..." {...register("metaDescriptionUz")} />
                    <p className="mt-1 text-xs text-admin-muted">{values.metaDescriptionUz?.length ?? 0}/160 belgi</p>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-admin-muted">Meta Description (RU)</label>
                    <textarea className="input" rows={2} placeholder="Описание категории..." {...register("metaDescriptionRu")} />
                    <p className="mt-1 text-xs text-admin-muted">{values.metaDescriptionRu?.length ?? 0}/160 belgi</p>
                  </div>
                </div>
              </FormSectionCard>

              <FormSectionCard title="Meta Keywords (ixtiyoriy)">
                <TagInput value={values.metaKeywords ?? ""} onChange={(v) => setValue("metaKeywords", v)} placeholder="mebel, yotoqxona, divan..." />
              </FormSectionCard>

              <FormSectionCard title="Qidiruv tizimi sozlamalari">
                <div className="flex gap-8">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" {...register("isIndexable")} /> Indexlash (Google indeksida)
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" {...register("isFollow")} /> Follow (havolalar kuzatiladi)
                  </label>
                </div>
              </FormSectionCard>

              <FormSectionCard title="Google ko'rinishi">
                <div className="rounded-lg border border-admin-border p-4">
                  <p className="truncate text-xs text-admin-accent">naturino.uz/catalog/{values.slug || slugify(values.name) || "toifa-slug"}</p>
                  <p className="mt-1 truncate text-base text-[#1a0dab]">{values.metaTitleUz || values.name || "Toifa nomi"}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-admin-muted">{values.metaDescriptionUz || "Meta description bu yerda ko'rinadi..."}</p>
                </div>
              </FormSectionCard>
          </TabsContent>
          </Tabs>

          {serverError && <p className="rounded-md bg-admin-danger-50 px-3 py-2 text-sm text-admin-danger">{serverError}</p>}

          <div className="flex justify-end gap-3 border-t border-admin-border pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Bekor qilish
            </Button>
            <Button type="submit" className="bg-admin-primary hover:bg-admin-primary-600" disabled={isSubmitting}>
              {isSubmitting ? "Saqlanmoqda..." : category ? "Saqlash" : "Yaratish"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
