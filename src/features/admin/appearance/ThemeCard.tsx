import { useNavigate } from "react-router-dom";
import { CopyIcon, EyeIcon, PencilIcon, TrashIcon } from "../../../components/admin/icons";
import { IconButton } from "../../../components/admin/IconButton";
import { Button } from "../../../components/ui/button";
import { parseTokens, type ColorTokens, type Theme } from "../../../types/theme";
import { DEFAULT_COLOR_TOKENS } from "../../../lib/theme/defaults";

export function ThemeCard({
  theme,
  onActivate,
  onDuplicate,
  onDelete,
  onPreview,
}: {
  theme: Theme;
  onActivate: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onPreview: () => void;
}) {
  const navigate = useNavigate();
  const colors = parseTokens<ColorTokens>(theme.colorTokensJson, DEFAULT_COLOR_TOKENS);
  const swatches = [colors.brand.primary, colors.surface.muted, colors.brand.secondary, colors.surface.card, colors.text.heading];

  return (
    <div
      className={`relative flex flex-col gap-3 rounded-2xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md ${
        theme.isActive ? "border-admin-accent ring-1 ring-admin-accent" : "border-admin-border"
      }`}
    >
      <div className="flex h-20 gap-1 overflow-hidden rounded-xl">
        {swatches.map((c, i) => (
          <div key={i} className="flex-1" style={{ backgroundColor: c }} />
        ))}
      </div>

      {theme.isActive && (
        <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-admin-accent text-white">
          ✓
        </span>
      )}

      <div className="flex items-center justify-between">
        <p className="font-semibold text-admin-primary">{theme.name}</p>
        <span className="text-admin-muted" title={theme.isDarkMode ? "Qorong'i" : "Yorug'"}>
          {theme.isDarkMode ? "🌙" : "☀️"}
        </span>
      </div>

      <div className="text-xs text-admin-muted">
        <p>Font: {theme.fontHeading}</p>
      </div>

      <div className="flex gap-2">
        <Button size="sm" variant="outline" className="flex-1" onClick={onPreview}>
          <EyeIcon className="mr-1.5 h-3.5 w-3.5" /> Ko'rish
        </Button>
        <Button
          size="sm"
          className={`flex-1 ${theme.isActive ? "bg-slate-200 text-admin-muted hover:bg-slate-200" : "bg-admin-primary hover:bg-admin-primary-600"}`}
          disabled={theme.isActive}
          onClick={onActivate}
        >
          {theme.isActive ? "✓ Faol" : "Qo'llash"}
        </Button>
      </div>

      <div className="flex items-center justify-end gap-1 border-t border-admin-border pt-2">
        <IconButton label="Tahrirlash" onClick={() => navigate(`/admin/appearance/themes/${theme.id}`)}>
          <PencilIcon />
        </IconButton>
        <IconButton label="Nusxalash" onClick={onDuplicate}>
          <CopyIcon />
        </IconButton>
        <IconButton label="O'chirish" variant="danger" disabled={theme.isActive} onClick={onDelete}>
          <TrashIcon />
        </IconButton>
      </div>
    </div>
  );
}
