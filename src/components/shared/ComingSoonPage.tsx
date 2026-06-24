interface ComingSoonPageProps {
  title: string;
}

export function ComingSoonPage({ title }: ComingSoonPageProps) {
  return (
    <div className="mx-auto max-w-6xl px-6 py-24 text-center">
      <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
      <p className="mt-2 text-slate-500">This page is content-driven from the CMS and ships in M7 (Public Website).</p>
    </div>
  );
}
