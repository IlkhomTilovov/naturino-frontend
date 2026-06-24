export interface ThemeTab {
  key: string;
  label: string;
}

export function ThemeTabs({ tabs, active, onChange }: { tabs: ThemeTab[]; active: string; onChange: (key: string) => void }) {
  return (
    <div className="sticky top-0 z-30 -mx-6 mb-4 border-b border-admin-border bg-white px-6 py-3">
      <div className="flex h-[52px] items-center gap-1 overflow-x-auto rounded-2xl bg-[#F4F6F8] p-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map((tab) => {
          const isActive = tab.key === active;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={`shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
                isActive ? "bg-white text-admin-primary shadow-sm font-semibold" : "text-admin-muted hover:text-admin-primary"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
