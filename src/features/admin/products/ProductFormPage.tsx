import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { productCategoriesApi, productsApi } from "../../../api/endpoints/products";
import { languagesApi } from "../../../api/endpoints/languages";
import { Button } from "../../../components/ui/button";
import { ProductImageManager } from "./ProductImageManager";
import { PageHeader } from "../../../components/admin/PageHeader";
import { FormSectionCard } from "../../../components/admin/FormSectionCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { SeoStatusBadge } from "../../../components/admin/Badges";
import { productSchema, type ProductFormSchema } from "../../../lib/schemas/product";
import { useToastStore } from "../../../store/toastStore";
import { computeSeoScore } from "../../../lib/utils/seo";
import type { ProductTranslation } from "../../../types/product";

export function ProductFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("general");
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [translations, setTranslations] = useState<Record<string, ProductTranslation>>({});

  const { data: categories } = useQuery({
    queryKey: ["product-categories"],
    queryFn: productCategoriesApi.getAll,
  });

  const { data: languages } = useQuery({
    queryKey: ["languages"],
    queryFn: languagesApi.getAll,
  });

  const activeLanguages = (languages ?? []).filter((l) => l.isActive);
  const defaultLangCode = activeLanguages.find((l) => l.isDefault)?.code ?? "uz";
  const [activeLang, setActiveLang] = useState(defaultLangCode);
  const isDefaultLang = activeLang === defaultLangCode;

  useEffect(() => {
    setActiveLang(defaultLangCode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultLangCode]);

  const updateTranslation = (key: keyof ProductTranslation, value: string) => {
    setTranslations((prev) => ({ ...prev, [activeLang]: { ...prev[activeLang], [key]: value } }));
  };

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productsApi.getById(id!),
    enabled: isEdit,
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: { isActive: true, isFeatured: false, price: 0, stockQuantity: 0 },
  });

  useEffect(() => {
    if (product) {
      reset({
        categoryId: product.categoryId,
        sku: product.sku,
        name: product.name,
        slug: product.slug,
        shortDescription: product.shortDescription ?? "",
        description: product.description ?? "",
        price: product.price,
        oldPrice: product.oldPrice ?? undefined,
        stockQuantity: product.stockQuantity,
        weight: product.weight ?? undefined,
        brand: product.brand ?? "",
        ageGroup: product.ageGroup ?? "",
        isFeatured: product.isFeatured,
        isActive: product.isActive,
      });
      setTranslations(product.translations ?? {});
    }
  }, [product, reset]);

  const addToast = useToastStore((state) => state.addToast);

  const onSubmit = async (values: ProductFormSchema) => {
    setServerError(null);
    setIsSubmitting(true);
    try {
      const payload = { ...values, translations };
      if (isEdit) {
        await productsApi.update(id!, payload);
      } else {
        await productsApi.create(payload);
      }
      addToast("Mahsulot muvaffaqiyatli saqlandi");
      navigate("/admin/products");
    } catch {
      setServerError("Saqlashda xatolik yuz berdi. Maydonlarni tekshirib qaytadan urinib ko'ring.");
      addToast("Mahsulotni saqlashda xatolik yuz berdi", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formValues = watch();
  const seoReport = computeSeoScore({
    name: formValues.name ?? "",
    slug: formValues.slug ?? "",
    shortDescription: formValues.shortDescription ?? "",
    description: formValues.description ?? "",
    images: product?.images ?? [],
  });

  if (isEdit && isLoading) {
    return <p className="text-sm text-admin-muted">Yuklanmoqda...</p>;
  }

  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader
        title={isEdit ? "Mahsulotni tahrirlash" : "Yangi mahsulot"}
        description={isEdit ? product?.name : "Yangi mahsulot qo'shish"}
      />

      {activeLanguages.length > 1 && (
        <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1.5">
          <span className="px-2 text-xs font-medium text-admin-muted">Til:</span>
          {activeLanguages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => setActiveLang(lang.code)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold uppercase ${
                activeLang === lang.code ? "bg-white text-admin-primary shadow-sm" : "text-admin-muted"
              }`}
            >
              {lang.code}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as string)}>
        <TabsList className="h-auto w-full justify-start gap-1 rounded-xl bg-slate-100 p-1.5">
          <TabsTrigger value="general" className="rounded-lg px-4 py-2 text-sm font-medium data-active:shadow-sm">
            Asosiy
          </TabsTrigger>
          <TabsTrigger value="content" className="rounded-lg px-4 py-2 text-sm font-medium data-active:shadow-sm">
            Tavsif
          </TabsTrigger>
          <TabsTrigger value="media" className="rounded-lg px-4 py-2 text-sm font-medium data-active:shadow-sm">
            Rasmlar
          </TabsTrigger>
          <TabsTrigger value="attributes" className="rounded-lg px-4 py-2 text-sm font-medium data-active:shadow-sm">
            Xususiyatlar
          </TabsTrigger>
          <TabsTrigger value="seo" className="rounded-lg px-4 py-2 text-sm font-medium data-active:shadow-sm">
            SEO
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="space-y-4">
            <FormSectionCard title="Asosiy ma'lumotlar">
              <div className="grid grid-cols-2 gap-4">
                {isDefaultLang ? (
                  <Field label="Nomi" error={errors.name?.message}>
                    <input className="input" {...register("name")} />
                  </Field>
                ) : (
                  <Field label={`Nomi (${activeLang.toUpperCase()})`}>
                    <input
                      className="input"
                      value={translations[activeLang]?.name ?? ""}
                      onChange={(e) => updateTranslation("name", e.target.value)}
                    />
                  </Field>
                )}
                <Field label="SKU" error={errors.sku?.message}>
                  <input className="input" {...register("sku")} />
                </Field>
                <Field label="Slug (ixtiyoriy)">
                  <input className="input" {...register("slug")} />
                </Field>
                <Field label="Toifa" error={errors.categoryId?.message}>
                  <select className="input" {...register("categoryId")}>
                    <option value="">Tanlang</option>
                    {categories?.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </FormSectionCard>

            <FormSectionCard title="Reklama sozlamalari" description="Mahsulotni bosh sahifada tavsiya etilgan sifatida belgilash">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" {...register("isFeatured")} /> Tavsiya etilgan mahsulot
              </label>
            </FormSectionCard>

            <FormSectionCard title="Narxlash">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Narx" error={errors.price?.message}>
                  <input type="number" step="0.01" className="input" {...register("price")} />
                </Field>
                <Field label="Eski narx (ixtiyoriy)">
                  <input type="number" step="0.01" className="input" {...register("oldPrice")} />
                </Field>
              </div>
            </FormSectionCard>

            <FormSectionCard title="Ombor">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Qoldiq" error={errors.stockQuantity?.message}>
                  <input type="number" className="input" {...register("stockQuantity")} />
                </Field>
                <Field label="Holat">
                  <label className="flex h-9 items-center gap-2 text-sm">
                    <input type="checkbox" {...register("isActive")} /> Faol (saytda ko'rinadi)
                  </label>
                </Field>
              </div>
            </FormSectionCard>
          </div>
        </TabsContent>

        <TabsContent value="content">
          <div className="space-y-4">
            {isDefaultLang ? (
              <>
                <FormSectionCard title="Qisqa tavsif" description="Mahsulot kartochkasida ko'rsatiladi">
                  <textarea className="input" rows={3} {...register("shortDescription")} />
                </FormSectionCard>
                <FormSectionCard title="To'liq tavsif" description="Mahsulot sahifasida to'liq matn">
                  <textarea className="input" rows={8} {...register("description")} />
                </FormSectionCard>
              </>
            ) : (
              <>
                <FormSectionCard title={`Qisqa tavsif (${activeLang.toUpperCase()})`} description="Mahsulot kartochkasida ko'rsatiladi">
                  <textarea
                    className="input"
                    rows={3}
                    value={translations[activeLang]?.shortDescription ?? ""}
                    onChange={(e) => updateTranslation("shortDescription", e.target.value)}
                  />
                </FormSectionCard>
                <FormSectionCard title={`To'liq tavsif (${activeLang.toUpperCase()})`} description="Mahsulot sahifasida to'liq matn">
                  <textarea
                    className="input"
                    rows={8}
                    value={translations[activeLang]?.description ?? ""}
                    onChange={(e) => updateTranslation("description", e.target.value)}
                  />
                </FormSectionCard>
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="media">
          <FormSectionCard title="Mahsulot rasmlari" description="Birinchi yuklangan rasm avtomatik asosiy (cover) rasm bo'ladi">
            {isEdit ? (
              <ProductImageManager productId={id!} />
            ) : (
              <p className="rounded-lg bg-admin-warning-50 px-4 py-3 text-sm text-admin-warning">
                Rasmlarni qo'shish uchun avval mahsulotni saqlang.
              </p>
            )}
          </FormSectionCard>
        </TabsContent>

        <TabsContent value="attributes">
          <FormSectionCard title="Xususiyatlar" description="Mahsulotning qo'shimcha texnik ma'lumotlari">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Og'irligi (kg)">
                <input type="number" step="0.01" className="input" {...register("weight")} />
              </Field>
              <Field label="Brend">
                <input className="input" {...register("brand")} />
              </Field>
              <Field label="Yosh guruhi">
                <input className="input" placeholder="kitten, adult, senior..." {...register("ageGroup")} />
              </Field>
            </div>
          </FormSectionCard>
        </TabsContent>

        <TabsContent value="seo">
          <div className="space-y-4">
            <FormSectionCard title="SEO holati" description="Mavjud maydonlar asosida avtomatik baholanadi">
              <div className="flex items-center gap-3">
                <SeoStatusBadge report={seoReport} />
                <span className="text-sm text-admin-muted">{seoReport.score}/100 ball</span>
              </div>
              {seoReport.issues.length > 0 && (
                <ul className="mt-4 space-y-1.5 text-sm">
                  {seoReport.issues.map((issue) => (
                    <li
                      key={issue.message}
                      className={issue.severity === "danger" ? "text-admin-danger" : "text-admin-warning"}
                    >
                      • {issue.message}
                    </li>
                  ))}
                </ul>
              )}
            </FormSectionCard>

            <FormSectionCard title="Google ko'rinishi (preview)">
              <div className="rounded-lg border border-admin-border p-4">
                <p className="truncate text-xs text-admin-accent">
                  naturino.com/product/{formValues.slug || "mahsulot-slug"}
                </p>
                <p className="mt-1 truncate text-base text-[#1a0dab]">{formValues.name || "Mahsulot nomi"}</p>
                <p className="mt-1 line-clamp-2 text-sm text-admin-muted">
                  {formValues.shortDescription || "Qisqa tavsif bu yerda ko'rinadi..."}
                </p>
              </div>
            </FormSectionCard>
          </div>
        </TabsContent>
        </Tabs>

        {serverError && <p className="rounded-md bg-admin-danger-50 px-3 py-2 text-sm text-admin-danger">{serverError}</p>}

        <div className="flex gap-3">
          <Button type="submit" className="bg-admin-primary hover:bg-admin-primary-600" disabled={isSubmitting}>
            {isSubmitting ? "Saqlanmoqda..." : "Saqlash"}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/admin/products")}>
            Bekor qilish
          </Button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-admin-primary">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-admin-danger">{error}</p>}
    </div>
  );
}
