import { useEffect, useMemo, useState } from "react";
import {
  AlignCenter,
  Award,
  BadgeCheck,
  BarChart3,
  Building2,
  CheckCircle2,
  ChevronsUpDown,
  GitCompare,
  Globe2,
  Grid2x2,
  Handshake,
  HelpCircle,
  Image as ImageIcon,
  Images,
  LayoutGrid,
  LayoutTemplate,
  ListChecks,
  ListOrdered,
  Mail,
  Megaphone,
  Network,
  PanelTop,
  Quote,
  Rocket,
  Route,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Tag,
  TrendingUp,
  Users,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { SECTION_THUMBNAILS } from "./sectionThumbnails";

export type InsertPosition = "start" | "before" | "after" | "end";

interface SectionTemplate {
  typeName: string;
  label: string;
  description: string;
  icon: LucideIcon;
  category: string;
}

const CATEGORIES = [
  "Barchasi",
  "Hero",
  "Statistika",
  "Mahsulotlar",
  "Sifat",
  "Jarayon",
  "Nega hamkor bo'lish",
  "Galereya",
  "FAQ",
  "CTA",
  "Kontakt",
  "Boshqa",
] as const;

const TEMPLATES: SectionTemplate[] = [
  { typeName: "Hero", label: "Bosh banner (kategoriya karuseli)", description: "Faqat bosh sahifa uchun — barcha mahsulot toifalarini aylanma banner sifatida ko'rsatadi", icon: LayoutTemplate, category: "Hero" },
  { typeName: "PageBanner", label: "Sahifa banneri", description: "Har qanday sahifa uchun mustaqil banner — o'z sarlavha, matn va rasmi bilan", icon: LayoutTemplate, category: "Hero" },
  { typeName: "BackgroundHero", label: "Fon-rasmli banner", description: "To'liq ekran fon rasmi va qorong'i qatlam ustida markazlashgan matn — ta'sirchan sahifa ochilishi uchun", icon: ImageIcon, category: "Hero" },
  { typeName: "StatsHero", label: "Statistikali banner", description: "Sarlavha va matn ostida raqamli ko'rsatkichlar qatori — ishonchni darhol shakllantiradi", icon: TrendingUp, category: "Hero" },
  { typeName: "MinimalHero", label: "Minimal banner", description: "Faqat matn — rasm va ortiqcha elementlarsiz eng yengil banner, ichki sahifalar uchun", icon: AlignCenter, category: "Hero" },
  { typeName: "BadgeListHero", label: "Belgilar bilan banner", description: "Matn va ishonch belgilari (sertifikatlar) ro'yxati, yonida rasm — kategoriya sahifalari uchun", icon: ListChecks, category: "Hero" },
  { typeName: "BreadcrumbHero", label: "Breadcrumb banner", description: "Qorong'i, ixcham funksional banner — breadcrumb navigatsiyasi bilan ichki sahifalar uchun", icon: PanelTop, category: "Hero" },
  { typeName: "Stats", label: "Statistika", description: "Raqamli ko'rsatkichlar kartochkalari", icon: BarChart3, category: "Statistika" },
  { typeName: "TrustBar", label: "Ishonch paneli", description: "Sertifikat va ishonch belgilari qatori", icon: ShieldCheck, category: "Statistika" },
  { typeName: "Products", label: "Mahsulotlar carousel", description: "Mahsulotlarni aylanma karusel ko'rinishida ko'rsatish", icon: ShoppingBag, category: "Mahsulotlar" },
  { typeName: "ProductRange", label: "Mahsulotlar grid", description: "Mahsulot toifalarini katakli (grid) ko'rinishda ko'rsatish", icon: LayoutGrid, category: "Mahsulotlar" },
  { typeName: "WhyPartner", label: "Nega hamkor bo'lish", description: "Hamkorlik afzalliklari kartalari", icon: Handshake, category: "Nega hamkor bo'lish" },
  { typeName: "Features", label: "Nega biz", description: "Afzalliklar va xususiyatlar ro'yxati", icon: Sparkles, category: "Nega hamkor bo'lish" },
  { typeName: "Comparison", label: "Qiyoslash", description: "Ikki ustunli qiyoslash jadvali", icon: GitCompare, category: "Nega hamkor bo'lish" },
  { typeName: "WhoWeWorkWith", label: "Kimlar bilan ishlaymiz", description: "Hamkor turlari kartalari", icon: Network, category: "Nega hamkor bo'lish" },
  { typeName: "Partners", label: "Hamkorlar ishonchi", description: "Hamkorlar ishonchi va fikrlari", icon: Users, category: "Nega hamkor bo'lish" },
  { typeName: "Quality", label: "Sifat va sertifikatlar", description: "Sifat sertifikatlari va standartlar", icon: BadgeCheck, category: "Sifat" },
  { typeName: "Certificates", label: "Sertifikatlar to'plami", description: "Sertifikatlar galereyasi", icon: Award, category: "Sifat" },
  { typeName: "ExportCapabilities", label: "Eksport imkoniyatlari", description: "Eksport imkoniyatlari kartalari", icon: Globe2, category: "Sifat" },
  { typeName: "Process", label: "Ishlab chiqarish jarayoni", description: "Ish jarayoni bosqichlari (timeline)", icon: Workflow, category: "Jarayon" },
  { typeName: "PrivateLabel", label: "Private Label", description: "Shaxsiy brend ishlab chiqarish bosqichlari", icon: Tag, category: "Jarayon" },
  { typeName: "Gallery", label: "Galereya", description: "Rasmlar galereyasi", icon: Images, category: "Galereya" },
  { typeName: "FAQ", label: "Savol-javoblar", description: "Tez-tez so'raladigan savollar", icon: HelpCircle, category: "FAQ" },
  { typeName: "CTA", label: "Chaqiriq (CTA)", description: "Harakatga chaqiruv bandi", icon: Megaphone, category: "CTA" },
  { typeName: "About", label: "Kompaniya haqida", description: "Kompaniya haqida matn va rasm", icon: Building2, category: "Kontakt" },
  { typeName: "Contact", label: "Aloqa formasi", description: "Aloqa formasi va ma'lumotlari", icon: Mail, category: "Kontakt" },

  // Sifat — 5 yangi variant
  { typeName: "QualityIconGrid", label: "Sifat mezonlari (grid)", description: "Sifat mezonlarini ikonka va matn bilan katakli ko'rinishda ko'rsatish", icon: Grid2x2, category: "Sifat" },
  { typeName: "QualityMetrics", label: "Sifat ko'rsatkichlari", description: "Qorong'i fonda yirik raqamli sifat ko'rsatkichlari qatori", icon: BarChart3, category: "Sifat" },
  { typeName: "QualityChecklist", label: "Sifat nazorati (ro'yxat)", description: "Rasm va raqamlangan sifat nazorati bosqichlari ro'yxati", icon: ListOrdered, category: "Sifat" },
  { typeName: "QualityBadgeWall", label: "Sertifikat devori", description: "Sertifikat va standartlarni doiraviy belgilar qatorida ko'rsatish", icon: Award, category: "Sifat" },
  { typeName: "QualityPledge", label: "Sifat va'dasi", description: "Kompaniyaning sifat bo'yicha va'dasi — yirik iqtibos ko'rinishida", icon: Quote, category: "Sifat" },

  // Jarayon — 5 yangi variant
  { typeName: "ProcessTimelineVertical", label: "Jarayon (vertikal timeline)", description: "Ulangan chiziq bilan tik joylashgan jarayon bosqichlari", icon: ListOrdered, category: "Jarayon" },
  { typeName: "ProcessCardGrid", label: "Jarayon (rasmli kartalar)", description: "Har bir bosqich o'z rasmi bilan alohida kartada", icon: Grid2x2, category: "Jarayon" },
  { typeName: "ProcessSplitImage", label: "Jarayon (rasm + ro'yxat)", description: "Bitta yirik rasm va raqamlangan bosqichlar ro'yxati", icon: ImageIcon, category: "Jarayon" },
  { typeName: "ProcessFlow", label: "Jarayon oqimi (ikonkalar)", description: "Ixcham, bir qatorli ikonka va strelkalar bilan jarayon oqimi", icon: Route, category: "Jarayon" },
  { typeName: "ProcessAccordion", label: "Jarayon (ochiladigan ro'yxat)", description: "Bosqichlarni birma-bir ochib ko'rsatish — batafsil tavsiflar uchun", icon: ChevronsUpDown, category: "Jarayon" },

  // Nega hamkor bo'lish — 5 yangi variant
  { typeName: "WhyPartnerIconGrid", label: "Hamkorlik afzalliklari (grid)", description: "To'rt ustunli ikonka va matn bilan hamkorlik afzalliklari", icon: Handshake, category: "Nega hamkor bo'lish" },
  { typeName: "WhyPartnerMetrics", label: "Hamkorlik ko'rsatkichlari", description: "To'q yashil fonda yirik raqamlar bilan hamkorlik natijalari", icon: TrendingUp, category: "Nega hamkor bo'lish" },
  { typeName: "WhyPartnerSplitImage", label: "Hamkorlik (rasm + ro'yxat)", description: "Rasm va afzalliklar ro'yxati, tugma bilan", icon: ImageIcon, category: "Nega hamkor bo'lish" },
  { typeName: "WhyPartnerQuote", label: "Hamkor sharhi", description: "Mavjud hamkor/distribyutordan iqtibos va tavsiya", icon: Quote, category: "Nega hamkor bo'lish" },
  { typeName: "WhyPartnerCtaBand", label: "Hamkorlik chaqirig'i", description: "Afzalliklar ro'yxati va kuchli chaqiriq tugmasi bilan yakunlovchi bant", icon: Rocket, category: "Nega hamkor bo'lish" },
];

const POSITION_OPTIONS: { value: InsertPosition; label: string }[] = [
  { value: "start", label: "Sahifa boshiga" },
  { value: "before", label: "Tanlangan bo'limdan oldin" },
  { value: "after", label: "Tanlangan bo'limdan keyin" },
  { value: "end", label: "Sahifa oxiriga" },
];

function SectionThumbnail({ typeName, icon: Icon }: { typeName: string; icon: LucideIcon }) {
  const wireframe = SECTION_THUMBNAILS[typeName];
  return (
    <div className="flex h-20 w-full items-center justify-center overflow-hidden rounded-xl bg-slate-50 p-2">
      {wireframe ?? <Icon strokeWidth={1.5} className="h-7 w-7 text-admin-muted" />}
    </div>
  );
}

export function AddSectionModal({
  open,
  onOpenChange,
  hasActiveSection,
  onAdd,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hasActiveSection: boolean;
  onAdd: (typeName: string, position: InsertPosition) => void;
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("Barchasi");
  const [selected, setSelected] = useState<SectionTemplate | null>(null);
  const [position, setPosition] = useState<InsertPosition>("after");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return TEMPLATES.filter((t) => {
      const matchesCategory = category === "Barchasi" || t.category === category;
      const matchesSearch = !q || t.label.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [search, category]);

  useEffect(() => {
    if (!open) {
      setSelected(null);
      setSearch("");
      setCategory("Barchasi");
      setPosition("after");
    }
  }, [open]);

  const confirmAdd = () => {
    if (!selected) return;
    onAdd(selected.typeName, hasActiveSection ? position : "end");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[860px] rounded-[20px] p-0 sm:max-w-[860px]" showCloseButton={!selected}>
        {!selected ? (
          <div className="p-6">
            <DialogTitle className="text-xl font-semibold text-admin-primary">Bo'lim qo'shish</DialogTitle>
            <p className="mt-1 text-sm text-admin-muted">Sahifaga yangi bo'lim tanlang va joylashtiring.</p>

            <div className="relative mt-5">
              <Search strokeWidth={1.8} className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-admin-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Bo'lim qidirish..."
                className="w-full rounded-xl border border-admin-border py-2.5 pl-10 pr-4 text-sm focus:border-admin-primary focus:outline-none focus:ring-4 focus:ring-admin-primary/10"
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                    category === c ? "bg-admin-primary text-white" : "bg-slate-100 text-admin-muted hover:bg-slate-200"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="mt-5 grid max-h-[420px] grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((template) => (
                <div
                  key={template.typeName}
                  className="group flex flex-col rounded-2xl border border-admin-border p-3.5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-admin-primary/50 hover:shadow-md"
                >
                  <SectionThumbnail typeName={template.typeName} icon={template.icon} />
                  <div className="mt-3 flex items-center gap-2">
                    <template.icon strokeWidth={1.8} className="h-4 w-4 text-admin-primary" />
                    <p className="text-sm font-semibold text-admin-primary">{template.label}</p>
                  </div>
                  <p className="mt-1 flex-1 text-xs text-admin-muted">{template.description}</p>
                  <Button size="sm" className="mt-3 bg-admin-primary hover:bg-admin-primary-600" onClick={() => setSelected(template)}>
                    Qo'shish
                  </Button>
                </div>
              ))}

              {filtered.length === 0 && <p className="col-span-full py-10 text-center text-sm text-admin-muted">Bo'lim topilmadi.</p>}
            </div>
          </div>
        ) : (
          <div className="p-6">
            <DialogTitle className="text-xl font-semibold text-admin-primary">Qayerga qo'shamiz?</DialogTitle>
            <p className="mt-1 text-sm text-admin-muted">
              <span className="font-medium text-admin-primary">{selected.label}</span> bo'limini joylashtirish o'rnini tanlang.
            </p>

            <div className="mt-5 space-y-2">
              {POSITION_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${
                    !hasActiveSection && (opt.value === "before" || opt.value === "after")
                      ? "cursor-not-allowed border-admin-border opacity-40"
                      : `cursor-pointer ${position === opt.value ? "border-admin-primary bg-slate-50" : "border-admin-border hover:border-admin-primary/50"}`
                  }`}
                >
                  <input
                    type="radio"
                    name="insert-position"
                    disabled={!hasActiveSection && (opt.value === "before" || opt.value === "after")}
                    checked={position === opt.value}
                    onChange={() => setPosition(opt.value)}
                  />
                  {position === opt.value && <CheckCircle2 strokeWidth={1.8} className="hidden h-4 w-4 text-admin-primary" />}
                  <span className="font-medium text-admin-primary">{opt.label}</span>
                </label>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <Button variant="outline" onClick={() => setSelected(null)}>
                Orqaga
              </Button>
              <Button className="bg-admin-primary hover:bg-admin-primary-600" onClick={confirmAdd}>
                Qo'shish
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
