import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ExternalLink, Eye, GitBranch, Globe, MonitorSmartphone, PenTool, Info } from "lucide-react";
import { pagesApi } from "../../../api/endpoints/pages";
import { PageHeader } from "../../../components/admin/PageHeader";
import { Button } from "../../../components/ui/button";

const EDITABLE_PAGE_PILLS = [
  "Bosh sahifa",
  "Mahsulotlar",
  "Kompaniya haqida",
  "Ishlab chiqarish",
  "Sifat",
  "Eksport",
  "Hamkorlik",
  "Aloqa",
  "FAQ",
];

const GUIDE_STEPS = [
  { title: "Tahrirlashni boshlang", description: "\"Vizual tahrirlashni boshlash\" tugmasini bosing" },
  { title: "Kerakli sahifani tanlang", description: "Yuqoridagi menyudan kerakli sahifani tanlang" },
  { title: "Matn, rasm yoki tugmani bosing", description: "Tahrirlamoqchi bo'lgan elementni sahifada bosing" },
  { title: "O'ng panelda tahrirlang", description: "Tanlangan element xususiyatlarini o'ng panelda o'zgartiring" },
  { title: "Draft saqlang yoki publish qiling", description: "O'zgarishlar avtomatik saqlanadi, tayyor bo'lganda chop eting" },
];

export function ContentHubPage() {
  const { data: pages } = useQuery({ queryKey: ["pages"], queryFn: pagesApi.getAll });
  const homePage = pages?.find((p) => p.isHomePage) ?? pages?.[0];
  const editorHref = homePage ? `/admin/pages/${homePage.id}` : "/admin/pages";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sayt kontenti"
        description="Saytdagi barcha matnlar, sahifalar va bo'limlarni vizual tahrirlang."
        actions={
          <Button render={<Link to={editorHref} />} className="bg-admin-primary hover:bg-admin-primary-600">
            <PenTool strokeWidth={1.8} className="h-4 w-4" />
            Vizual tahrirlashni boshlash
          </Button>
        }
      />

      <div className="flex items-start gap-3 rounded-2xl border border-admin-border bg-slate-50 p-4">
        <Info strokeWidth={1.8} className="mt-0.5 h-5 w-5 shrink-0 text-admin-muted" />
        <div>
          <p className="text-sm font-semibold text-admin-primary">Yangi vizual tahrirlash tizimi</p>
          <p className="mt-0.5 text-sm text-admin-muted">
            Endi sayt kontentini to'g'ridan-to'g'ri real sahifa ustida tahrirlashingiz mumkin. Barcha o'zgarishlar
            draft sifatida saqlanadi va publish qilingandan keyin saytda ko'rinadi.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="flex flex-col rounded-2xl border-2 border-admin-primary bg-white p-6 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-admin-primary/10">
            <PenTool strokeWidth={1.8} className="h-5 w-5 text-admin-primary" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-admin-primary">Vizual tahrirlash</h3>
          <p className="mt-1.5 text-sm text-admin-muted">
            Saytning barcha sahifalarini real ko'rinishda ochib, matnlar, rasmlar, tugmalar va bo'limlarni joyida
            tahrirlang.
          </p>

          <ul className="mt-4 space-y-2 text-sm text-admin-primary">
            <li className="flex items-center gap-2">
              <Eye strokeWidth={1.8} className="h-4 w-4 text-admin-muted" /> Real website preview
            </li>
            <li className="flex items-center gap-2">
              <PenTool strokeWidth={1.8} className="h-4 w-4 text-admin-muted" /> Inline editing
            </li>
            <li className="flex items-center gap-2">
              <Globe strokeWidth={1.8} className="h-4 w-4 text-admin-muted" /> UZ / RU / EN tahrirlash
            </li>
            <li className="flex items-center gap-2">
              <MonitorSmartphone strokeWidth={1.8} className="h-4 w-4 text-admin-muted" /> Desktop / tablet / mobile preview
            </li>
            <li className="flex items-center gap-2">
              <GitBranch strokeWidth={1.8} className="h-4 w-4 text-admin-muted" /> Draft va publish tizimi
            </li>
          </ul>

          <div className="mt-6 flex items-center gap-2">
            <Button render={<Link to={editorHref} />} className="flex-1 bg-admin-primary hover:bg-admin-primary-600">
              <PenTool strokeWidth={1.8} className="h-4 w-4" />
              Tahrirlashni boshlash
            </Button>
            <Button
              render={<a href={editorHref} target="_blank" rel="noreferrer" />}
              variant="outline"
              size="icon"
              title="Open in new tab"
              aria-label="Open in new tab"
            >
              <ExternalLink strokeWidth={1.8} className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col rounded-2xl border border-admin-border bg-white p-6 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
            <Eye strokeWidth={1.8} className="h-5 w-5 text-admin-muted" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-admin-primary">Ko'rish rejimi</h3>
          <p className="mt-1.5 text-sm text-admin-muted">
            Saytni mehmonlar ko'radigan holatda tekshiring. Bu rejimda tahrirlash elementlari ko'rinmaydi.
          </p>

          <div className="mt-4 rounded-xl bg-slate-50 p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-admin-muted">Tahrirlanadigan sahifalar</p>
            <div className="flex flex-wrap gap-1.5">
              {EDITABLE_PAGE_PILLS.map((label) => (
                <span key={label} className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-admin-primary shadow-sm">
                  {label}
                </span>
              ))}
            </div>
          </div>

          <Button render={<a href="/" target="_blank" rel="noreferrer" />} variant="outline" className="mt-6">
            <Eye strokeWidth={1.8} className="h-4 w-4" />
            Saytni ko'rish
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-admin-border bg-white p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-admin-primary">Vizual tahrirlash qo'llanmasi</h3>
          <Link to="/admin/pages" className="text-sm font-medium text-admin-muted hover:text-admin-primary">
            Barcha sahifalarni boshqarish →
          </Link>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {GUIDE_STEPS.map((step, i) => (
            <div key={step.title} className="flex flex-col items-center text-center">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-admin-primary/10 text-sm font-semibold text-admin-primary">
                {i + 1}
              </span>
              <p className="mt-3 text-sm font-medium text-admin-primary">{step.title}</p>
              <p className="mt-1 text-xs text-admin-muted">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
