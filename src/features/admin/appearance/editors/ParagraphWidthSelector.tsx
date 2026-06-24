import type { TypographyTokens } from "../../../../types/theme";
import { SegmentedControl } from "./SegmentedControl";

const OPTIONS: { key: TypographyTokens["paragraphWidth"]; label: string }[] = [
  { key: "compact", label: "Ixcham" },
  { key: "standard", label: "Standart" },
  { key: "wide", label: "Keng" },
];

export function ParagraphWidthSelector({
  value,
  onChange,
}: {
  value: TypographyTokens["paragraphWidth"];
  onChange: (v: TypographyTokens["paragraphWidth"]) => void;
}) {
  return <SegmentedControl options={OPTIONS} value={value} onChange={onChange} />;
}
