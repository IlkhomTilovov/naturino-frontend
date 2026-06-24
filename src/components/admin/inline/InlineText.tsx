import { useEffect, useRef, useState } from "react";
import { PencilIcon } from "../icons";

export function InlineText({
  value,
  placeholder,
  onCommit,
  multiline,
  className = "",
  tag = "span",
}: {
  value?: string;
  placeholder: string;
  onCommit: (value: string) => void;
  multiline?: boolean;
  className?: string;
  tag?: "span" | "h1" | "p" | "div";
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value ?? "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => setDraft(value ?? ""), [value]);

  useEffect(() => {
    if (!editing || !multiline) return;
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [editing, multiline, draft]);

  const commit = () => {
    setEditing(false);
    if (draft !== (value ?? "")) onCommit(draft);
  };

  const cancel = () => {
    setDraft(value ?? "");
    setEditing(false);
  };

  if (editing) {
    return multiline ? (
      <textarea
        ref={textareaRef}
        autoFocus
        rows={1}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Escape") cancel();
        }}
        className={`${className} block min-w-0 w-full resize-none overflow-hidden rounded-md border-2 border-admin-primary bg-white outline-none`}
      />
    ) : (
      <input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") cancel();
        }}
        className={`${className} rounded-md border-2 border-admin-primary bg-white outline-none`}
      />
    );
  }

  const Tag = tag;
  return (
    <Tag
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        setEditing(true);
      }}
      className={`${className} group relative inline-block cursor-text rounded-sm outline-dashed outline-2 outline-transparent transition-colors hover:outline-admin-accent/70`}
    >
      {value || <span className="text-slate-300">{placeholder}</span>}
      <span className="invisible absolute -right-2 -top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-admin-primary text-white shadow-sm ring-1 ring-white group-hover:visible">
        <PencilIcon className="h-2.5 w-2.5" />
      </span>
    </Tag>
  );
}
