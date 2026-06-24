interface IconButtonProps {
  label: string;
  onClick?: () => void;
  variant?: "default" | "danger" | "active";
  disabled?: boolean;
  children: React.ReactNode;
}

export function IconButton({ label, onClick, variant = "default", disabled = false, children }: IconButtonProps) {
  const variantClass =
    variant === "danger"
      ? "text-admin-danger hover:bg-admin-danger-50"
      : variant === "active"
        ? "text-admin-warning hover:bg-admin-warning-50"
        : "text-admin-muted hover:bg-slate-100 hover:text-admin-primary";

  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition-all duration-200 ease-out hover:-translate-y-px active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:active:scale-100 ${variantClass}`}
    >
      {children}
    </button>
  );
}
