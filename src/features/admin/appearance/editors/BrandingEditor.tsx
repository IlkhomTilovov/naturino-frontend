import { MediaUploaderField } from "../../../../components/admin/MediaUploaderField";
import type { BrandingTokens } from "../../../../types/theme";

export function BrandingEditor({ tokens, onChange }: { tokens: BrandingTokens; onChange: (next: BrandingTokens) => void }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-admin-primary">Brend nomi</label>
          <input
            className="input mt-1"
            value={tokens.brandName}
            onChange={(e) => onChange({ ...tokens, brandName: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-admin-primary">Tagline</label>
          <input
            className="input mt-1"
            value={tokens.tagline}
            onChange={(e) => onChange({ ...tokens, tagline: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-medium text-admin-primary">Yorug' logo</label>
          <div className="mt-1.5">
            <MediaUploaderField imageUrl={tokens.logoLight} onChange={(url) => onChange({ ...tokens, logoLight: url ?? "" })} />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-admin-primary">Qorong'i logo</label>
          <div className="mt-1.5">
            <MediaUploaderField imageUrl={tokens.logoDark} onChange={(url) => onChange({ ...tokens, logoDark: url ?? "" })} />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-admin-primary">Favicon</label>
          <div className="mt-1.5">
            <MediaUploaderField imageUrl={tokens.favicon} onChange={(url) => onChange({ ...tokens, favicon: url ?? "" })} />
          </div>
        </div>
      </div>
    </div>
  );
}
