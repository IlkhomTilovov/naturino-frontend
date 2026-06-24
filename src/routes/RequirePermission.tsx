import type { ReactNode } from "react";
import { useAuthStore } from "../store/authStore";

interface RequirePermissionProps {
  code: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export function RequirePermission({ code, children, fallback = null }: RequirePermissionProps) {
  const hasPermission = useAuthStore((state) => state.hasPermission(code));

  return hasPermission ? <>{children}</> : <>{fallback}</>;
}
