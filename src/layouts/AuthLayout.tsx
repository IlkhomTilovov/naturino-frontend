import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F3EDE1]">
      <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-center text-lg font-semibold text-[#294A34]">Naturino Admin</h1>
        <Outlet />
      </div>
    </div>
  );
}
