import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { themesApi } from "../../../api/endpoints/themes";
import { FormSectionCard } from "../../../components/admin/FormSectionCard";
import { PageHeader } from "../../../components/admin/PageHeader";
import { Button } from "../../../components/ui/button";
import { useToastStore } from "../../../store/toastStore";
import {
  DEFAULT_ANIMATION_TOKENS,
  DEFAULT_BRANDING_TOKENS,
  DEFAULT_BUTTON_TOKENS,
  DEFAULT_COLOR_TOKENS,
  DEFAULT_LAYOUT_TOKENS,
  DEFAULT_RADIUS_TOKENS,
  DEFAULT_SHADOW_TOKENS,
  DEFAULT_TYPOGRAPHY_TOKENS,
} from "../../../lib/theme/defaults";
import { THEME_PRESETS, presetToFormPatch } from "../../../lib/data/themePresets";
import { parseTokens, type ThemeFormValues } from "../../../types/theme";
import { PresetThemeGrid } from "./editors/PresetThemeGrid";
import { ColorSystemEditor } from "./editors/ColorSystemEditor";
import { TypographyEditor } from "./editors/TypographyEditor";
import { RadiusEditor } from "./editors/RadiusEditor";
import { ShadowEditor } from "./editors/ShadowEditor";
import { ButtonSystemEditor } from "./editors/ButtonSystemEditor";
import { BrandingEditor } from "./editors/BrandingEditor";
import { LivePreviewPanel } from "./editors/LivePreviewPanel";
import { ThemeTabs, type ThemeTab } from "./editors/ThemeTabs";
import { AppearanceModeSelector } from "./editors/AppearanceModeSelector";
import { LayoutEditor } from "./editors/LayoutEditor";
import { AnimationEditor } from "./editors/AnimationEditor";
import { CustomCssEditor } from "./editors/CustomCssEditor";

const TABS: ThemeTab[] = [
  { key: "general", label: "Asosiy" },
  { key: "colors", label: "Ranglar" },
  { key: "typography", label: "Tipografiya" },
  { key: "buttons", label: "Tugmalar" },
  { key: "radius", label: "Radius" },
  { key: "shadows", label: "Soyalar" },
  { key: "layout", label: "Layout" },
  { key: "animation", label: "Animatsiya" },
  { key: "logo", label: "Logo" },
  { key: "customcss", label: "Maxsus CSS" },
  { key: "preview", label: "Ko'rib chiqish" },
];

const EMPTY_FORM: ThemeFormValues = {
  name: "",
  version: "1.0.0",
  appearanceMode: "light",
  fontHeading: "Inter",
  fontBody: "Inter",
  colorTokensJson: JSON.stringify(DEFAULT_COLOR_TOKENS),
  typographyTokensJson: JSON.stringify(DEFAULT_TYPOGRAPHY_TOKENS),
  radiusTokensJson: JSON.stringify(DEFAULT_RADIUS_TOKENS),
  shadowTokensJson: JSON.stringify(DEFAULT_SHADOW_TOKENS),
  buttonTokensJson: JSON.stringify(DEFAULT_BUTTON_TOKENS),
  brandingTokensJson: JSON.stringify(DEFAULT_BRANDING_TOKENS),
  layoutTokensJson: JSON.stringify(DEFAULT_LAYOUT_TOKENS),
  animationTokensJson: JSON.stringify(DEFAULT_ANIMATION_TOKENS),
  customCss: "",
};

export function ThemeEditorPage() {
  const { id } = useParams();
  const isEdit = Boolean(id) && id !== "new";
  const navigate = useNavigate();
  const addToast = useToastStore((s) => s.addToast);

  const [activeTab, setActiveTab] = useState("general");
  const [form, setForm] = useState<ThemeFormValues>(EMPTY_FORM);
  const [dirty, setDirty] = useState(false);

  const { data: theme } = useQuery({
    queryKey: ["theme", id],
    queryFn: () => themesApi.getById(id!),
    enabled: isEdit,
  });

  useEffect(() => {
    if (theme) {
      setForm({
        name: theme.name,
        slug: theme.slug,
        description: theme.description ?? "",
        version: theme.version || "1.0.0",
        appearanceMode: theme.appearanceMode || "light",
        fontHeading: theme.fontHeading,
        fontBody: theme.fontBody,
        colorTokensJson: theme.colorTokensJson,
        typographyTokensJson: theme.typographyTokensJson,
        radiusTokensJson: theme.radiusTokensJson,
        shadowTokensJson: theme.shadowTokensJson,
        buttonTokensJson: theme.buttonTokensJson,
        brandingTokensJson: theme.brandingTokensJson,
        layoutTokensJson: theme.layoutTokensJson || JSON.stringify(DEFAULT_LAYOUT_TOKENS),
        animationTokensJson: theme.animationTokensJson || JSON.stringify(DEFAULT_ANIMATION_TOKENS),
        customCss: theme.customCss ?? "",
      });
      setDirty(false);
    }
  }, [theme]);

  const save = useMutation({
    mutationFn: () => (isEdit ? themesApi.update(id!, form) : themesApi.create(form)),
    onSuccess: (result) => {
      addToast("Mavzu saqlandi");
      setDirty(false);
      if (!isEdit) navigate(`/admin/appearance/themes/${result.id}`, { replace: true });
    },
    onError: () => addToast("Saqlashda xatolik yuz berdi", "error"),
  });

  const patch = (partial: Partial<ThemeFormValues>) => {
    setForm((f) => ({ ...f, ...partial }));
    setDirty(true);
  };

  const colors = parseTokens(form.colorTokensJson, DEFAULT_COLOR_TOKENS);
  const typography = parseTokens(form.typographyTokensJson, DEFAULT_TYPOGRAPHY_TOKENS);
  const radius = parseTokens(form.radiusTokensJson, DEFAULT_RADIUS_TOKENS);
  const shadow = parseTokens(form.shadowTokensJson, DEFAULT_SHADOW_TOKENS);
  const buttons = parseTokens(form.buttonTokensJson, DEFAULT_BUTTON_TOKENS);
  const branding = parseTokens(form.brandingTokensJson, DEFAULT_BRANDING_TOKENS);
  const layout = parseTokens(form.layoutTokensJson, DEFAULT_LAYOUT_TOKENS);
  const animation = parseTokens(form.animationTokensJson, DEFAULT_ANIMATION_TOKENS);

  const handleCancel = () => {
    if (dirty && !confirm("Saqlanmagan o'zgarishlar bor. Chiqishni tasdiqlaysizmi?")) return;
    navigate("/admin/appearance/themes");
  };

  return (
    <div className="space-y-4 pb-4">
      <PageHeader
        title="Mavzuni tahrirlash"
        description="Brend ranglaringiz va uslubingiz bilan professional mavzu yarating"
        actions={<span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-admin-muted">Tahrirlash</span>}
      />

      <ThemeTabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_420px]">
        <div className="space-y-4">
          {activeTab === "general" && (
            <>
              <FormSectionCard title="Tayyor mavzular" description="Bir bosishda qo'llash">
                <PresetThemeGrid onApply={(i) => patch(presetToFormPatch(THEME_PRESETS[i]))} />
              </FormSectionCard>

              <FormSectionCard title="Mavzu ma'lumotlari" description="Nom va asosiy sozlamalar">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-admin-primary">Mavzu nomi</label>
                    <input className="input mt-1" value={form.name} onChange={(e) => patch({ name: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-admin-primary">Tavsif</label>
                    <textarea
                      className="input mt-1"
                      rows={2}
                      value={form.description ?? ""}
                      onChange={(e) => patch({ description: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-admin-primary">Versiya</label>
                    <input className="input mt-1 max-w-[160px]" value={form.version} onChange={(e) => patch({ version: e.target.value })} />
                  </div>
                </div>
              </FormSectionCard>

              <FormSectionCard title="Ko'rinish rejimi" description="Light, Dark yoki Auto rejimni tanlang">
                <AppearanceModeSelector value={form.appearanceMode} onChange={(v) => patch({ appearanceMode: v })} />
              </FormSectionCard>
            </>
          )}

          {activeTab === "colors" && (
            <FormSectionCard title="Ranglar tizimi" description="Brend ranglarini sozlang">
              <ColorSystemEditor tokens={colors} onChange={(next) => patch({ colorTokensJson: JSON.stringify(next) })} />
            </FormSectionCard>
          )}

          {activeTab === "typography" && (
            <TypographyEditor
              tokens={typography}
              fontHeading={form.fontHeading}
              fontBody={form.fontBody}
              onChange={(next) => patch({ typographyTokensJson: JSON.stringify(next) })}
              onFontChange={(h, b) => patch({ fontHeading: h, fontBody: b })}
            />
          )}

          {activeTab === "buttons" && (
            <FormSectionCard title="Tugmalar" description="Tugma uslubi va hover effekti">
              <ButtonSystemEditor tokens={buttons} onChange={(next) => patch({ buttonTokensJson: JSON.stringify(next) })} />
            </FormSectionCard>
          )}

          {activeTab === "radius" && (
            <FormSectionCard title="Burchak radiusi" description="Shakl va silliqlik">
              <RadiusEditor tokens={radius} onChange={(next) => patch({ radiusTokensJson: JSON.stringify(next) })} />
            </FormSectionCard>
          )}

          {activeTab === "shadows" && (
            <FormSectionCard title="Soyalar" description="Chuqurlik darajasi">
              <ShadowEditor tokens={shadow} onChange={(next) => patch({ shadowTokensJson: JSON.stringify(next) })} />
            </FormSectionCard>
          )}

          {activeTab === "layout" && (
            <LayoutEditor tokens={layout} onChange={(next) => patch({ layoutTokensJson: JSON.stringify(next) })} />
          )}

          {activeTab === "animation" && (
            <AnimationEditor tokens={animation} onChange={(next) => patch({ animationTokensJson: JSON.stringify(next) })} />
          )}

          {activeTab === "logo" && (
            <FormSectionCard title="Logo va brending" description="Brend nomi, tagline va logotiplar">
              <BrandingEditor tokens={branding} onChange={(next) => patch({ brandingTokensJson: JSON.stringify(next) })} />
            </FormSectionCard>
          )}

          {activeTab === "customcss" && (
            <CustomCssEditor value={form.customCss} onChange={(v) => patch({ customCss: v })} />
          )}

          {activeTab === "preview" && (
            <FormSectionCard title="To'liq sayt ko'rinishi" description="Barcha o'zgarishlar shu yerda jonli ko'rinadi">
              <LivePreviewPanel
                colors={colors}
                radius={radius}
                shadow={shadow}
                buttons={buttons}
                branding={branding}
                fontHeading={form.fontHeading}
                fontBody={form.fontBody}
                typography={typography}
              />
            </FormSectionCard>
          )}
        </div>

        {activeTab !== "preview" && (
          <LivePreviewPanel
            colors={colors}
            radius={radius}
            shadow={shadow}
            buttons={buttons}
            branding={branding}
            fontHeading={form.fontHeading}
            fontBody={form.fontBody}
            typography={typography}
          />
        )}
      </div>

      <div className="sticky bottom-0 -mx-6 flex items-center justify-between border-t border-admin-border bg-white px-6 py-3">
        <p className="text-xs text-admin-muted">
          {dirty ? "O'zgarishlar saqlanmagan" : "O'zgarishlar avtomatik ko'rinishda yangilanadi"}
        </p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Bekor qilish
          </Button>
          <Button className="bg-admin-primary hover:bg-admin-primary-600" disabled={save.isPending} onClick={() => save.mutate()}>
            {save.isPending ? "Saqlanmoqda..." : "✓ Yangilash"}
          </Button>
        </div>
      </div>
    </div>
  );
}
