export function TableSkeleton({ rows = 5, columns = 7 }: { rows?: number; columns?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r} className="border-t border-admin-border">
          {Array.from({ length: columns }).map((_, c) => (
            <td key={c} className="px-4 py-3">
              <div className="h-4 animate-pulse rounded bg-slate-100" style={{ width: c === 0 ? "2.5rem" : `${60 + ((c * 13) % 30)}%` }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
