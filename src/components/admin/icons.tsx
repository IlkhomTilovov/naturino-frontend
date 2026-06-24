import {
  Eye,
  Pencil,
  Trash2,
  Star,
  RefreshCw,
  Plus,
  Copy,
  GripVertical,
  Globe,
  Boxes,
  Search,
} from "lucide-react";

type IconProps = { className?: string };

const STROKE_WIDTH = 1.8;
const DEFAULT_SIZE = "h-[18px] w-[18px]";

export function EyeIcon({ className = DEFAULT_SIZE }: IconProps) {
  return <Eye strokeWidth={STROKE_WIDTH} className={className} />;
}

export function PencilIcon({ className = DEFAULT_SIZE }: IconProps) {
  return <Pencil strokeWidth={STROKE_WIDTH} className={className} />;
}

export function TrashIcon({ className = DEFAULT_SIZE }: IconProps) {
  return <Trash2 strokeWidth={STROKE_WIDTH} className={className} />;
}

export function StarIcon({ className = DEFAULT_SIZE, filled = false }: IconProps & { filled?: boolean }) {
  return <Star strokeWidth={STROKE_WIDTH} className={className} fill={filled ? "currentColor" : "none"} />;
}

export function RefreshIcon({ className = DEFAULT_SIZE }: IconProps) {
  return <RefreshCw strokeWidth={STROKE_WIDTH} className={className} />;
}

export function PlusIcon({ className = DEFAULT_SIZE }: IconProps) {
  return <Plus strokeWidth={STROKE_WIDTH} className={className} />;
}

export function CopyIcon({ className = DEFAULT_SIZE }: IconProps) {
  return <Copy strokeWidth={STROKE_WIDTH} className={className} />;
}

export function DragHandleIcon({ className = DEFAULT_SIZE }: IconProps) {
  return <GripVertical strokeWidth={STROKE_WIDTH} className={className} />;
}

export function GlobeIcon({ className = DEFAULT_SIZE }: IconProps) {
  return <Globe strokeWidth={STROKE_WIDTH} className={className} />;
}

export function BoxIcon({ className = DEFAULT_SIZE }: IconProps) {
  return <Boxes strokeWidth={STROKE_WIDTH} className={className} />;
}

export function SearchIcon({ className = DEFAULT_SIZE }: IconProps) {
  return <Search strokeWidth={STROKE_WIDTH} className={className} />;
}
