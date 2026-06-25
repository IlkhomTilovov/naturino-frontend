const LINE = "#CBD5E1";
const LINE_SOFT = "#E2E8F0";
const ACCENT = "#16A34A";
const DARK = "#0F172A";

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 160 90" className="h-full w-full" fill="none">
      {children}
    </svg>
  );
}

export const SECTION_THUMBNAILS: Record<string, React.ReactNode> = {
  Hero: (
    <Frame>
      <rect x="55" y="14" width="50" height="4" rx="2" fill={LINE} />
      <rect x="30" y="26" width="100" height="8" rx="2" fill={DARK} />
      <rect x="42" y="38" width="76" height="8" rx="2" fill={DARK} />
      <rect x="50" y="54" width="26" height="3" rx="1.5" fill={LINE_SOFT} />
      <rect x="80" y="54" width="26" height="3" rx="1.5" fill={LINE_SOFT} />
      <rect x="55" y="65" width="22" height="10" rx="5" fill={ACCENT} />
      <rect x="83" y="65" width="22" height="10" rx="5" fill="none" stroke={LINE} strokeWidth="1.5" />
    </Frame>
  ),
  Stats: (
    <Frame>
      {[20, 60, 100, 140].map((x) => (
        <g key={x}>
          <rect x={x - 14} y={30} width="28" height="10" rx="2" fill={DARK} />
          <rect x={x - 12} y={46} width="24" height="3" rx="1.5" fill={LINE_SOFT} />
        </g>
      ))}
    </Frame>
  ),
  TrustBar: (
    <Frame>
      <rect x="20" y="40" width="24" height="10" rx="5" fill="none" stroke={LINE} strokeWidth="1.5" />
      <rect x="50" y="40" width="24" height="10" rx="5" fill="none" stroke={LINE} strokeWidth="1.5" />
      <rect x="80" y="40" width="24" height="10" rx="5" fill="none" stroke={LINE} strokeWidth="1.5" />
      <rect x="110" y="40" width="30" height="10" rx="5" fill="none" stroke={LINE} strokeWidth="1.5" />
    </Frame>
  ),
  Products: (
    <Frame>
      <rect x="6" y="22" width="6" height="46" rx="2" fill={LINE_SOFT} />
      <rect x="148" y="22" width="6" height="46" rx="2" fill={LINE_SOFT} />
      <rect x="22" y="30" width="32" height="32" rx="4" fill="none" stroke={LINE} strokeWidth="1.5" />
      <rect x="64" y="20" width="32" height="46" rx="4" fill={DARK} />
      <rect x="106" y="30" width="32" height="32" rx="4" fill="none" stroke={LINE} strokeWidth="1.5" />
    </Frame>
  ),
  ProductRange: (
    <Frame>
      {[16, 60, 104].map((x) => (
        <rect key={x} x={x} y="24" width="32" height="32" rx="4" fill="none" stroke={LINE} strokeWidth="1.5" />
      ))}
      <rect x="16" y="62" width="32" height="32" rx="4" fill="none" stroke={LINE} strokeWidth="1.5" />
    </Frame>
  ),
  WhyPartner: (
    <Frame>
      <rect x="16" y="18" width="56" height="54" rx="6" fill={LINE_SOFT} />
      <rect x="86" y="18" width="58" height="24" rx="4" fill="none" stroke={LINE} strokeWidth="1.5" />
      <rect x="86" y="48" width="58" height="24" rx="4" fill="none" stroke={LINE} strokeWidth="1.5" />
    </Frame>
  ),
  Features: (
    <Frame>
      <rect x="60" y="16" width="40" height="3" rx="1.5" fill={LINE_SOFT} />
      <rect x="40" y="26" width="80" height="8" rx="2" fill={DARK} />
      <rect x="48" y="40" width="64" height="3" rx="1.5" fill={LINE_SOFT} />
      <circle cx="50" cy="64" r="3" fill={ACCENT} />
      <rect x="58" y="61" width="30" height="3" rx="1.5" fill={LINE_SOFT} />
      <circle cx="110" cy="64" r="3" fill={ACCENT} />
      <rect x="118" y="61" width="24" height="3" rx="1.5" fill={LINE_SOFT} />
    </Frame>
  ),
  Comparison: (
    <Frame>
      <rect x="14" y="18" width="62" height="54" rx="6" fill="none" stroke={LINE} strokeWidth="1.5" />
      <rect x="84" y="14" width="62" height="62" rx="6" fill={DARK} />
      {[28, 38, 48, 58].map((y) => (
        <rect key={y} x="22" y={y} width="44" height="3" rx="1.5" fill={LINE_SOFT} />
      ))}
      {[26, 36, 46, 56, 66].map((y) => (
        <rect key={y} x="92" y={y} width="46" height="3" rx="1.5" fill="#475569" />
      ))}
    </Frame>
  ),
  WhoWeWorkWith: (
    <Frame>
      {[[20, 18], [86, 18], [20, 50], [86, 50]].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <rect x={x} y={y} width="54" height="22" rx="4" fill="none" stroke={LINE} strokeWidth="1.5" />
          <circle cx={x + 12} cy={y + 11} r="4" fill={ACCENT} fillOpacity="0.25" />
        </g>
      ))}
    </Frame>
  ),
  Partners: (
    <Frame>
      {[16, 56, 96, 136].map((x) => (
        <g key={x}>
          <rect x={x - 14} y="26" width="28" height="28" rx="4" fill="none" stroke={LINE} strokeWidth="1.5" />
          <circle cx={x} cy={36} r="3.5" fill={ACCENT} fillOpacity="0.3" />
          <rect x={x - 10} y="44" width="20" height="3" rx="1.5" fill={LINE_SOFT} />
        </g>
      ))}
    </Frame>
  ),
  Quality: (
    <Frame>
      <rect x="14" y="18" width="56" height="54" rx="6" fill={LINE_SOFT} />
      <rect x="84" y="22" width="60" height="3" rx="1.5" fill={LINE_SOFT} />
      <rect x="84" y="32" width="48" height="7" rx="2" fill={DARK} />
      <rect x="84" y="46" width="26" height="9" rx="4.5" fill="none" stroke={LINE} strokeWidth="1.5" />
      <rect x="114" y="46" width="26" height="9" rx="4.5" fill="none" stroke={LINE} strokeWidth="1.5" />
      <rect x="84" y="59" width="26" height="9" rx="4.5" fill="none" stroke={LINE} strokeWidth="1.5" />
    </Frame>
  ),
  Certificates: (
    <Frame>
      {[16, 56, 96, 136].map((x) => (
        <rect key={x} x={x - 14} y="24" width="28" height="32" rx="4" fill="none" stroke={LINE} strokeWidth="1.5" />
      ))}
    </Frame>
  ),
  ExportCapabilities: (
    <Frame>
      {[16, 56, 96, 136].map((x) => (
        <g key={x}>
          <rect x={x - 14} y="22" width="28" height="28" rx="4" fill="none" stroke={LINE} strokeWidth="1.5" />
          <circle cx={x} cy={32} r="3.5" fill={ACCENT} fillOpacity="0.3" />
          <rect x={x - 10} y="40" width="20" height="3" rx="1.5" fill={LINE_SOFT} />
        </g>
      ))}
    </Frame>
  ),
  Process: (
    <Frame>
      <line x1="30" y1="40" x2="130" y2="40" stroke={LINE_SOFT} strokeWidth="2" />
      {[30, 80, 130].map((x, i) => (
        <g key={x}>
          <circle cx={x} cy="40" r="12" fill="#fff" stroke={i === 0 ? ACCENT : LINE} strokeWidth="2" />
          <rect x={x - 10} y="58" width="20" height="3" rx="1.5" fill={LINE_SOFT} />
        </g>
      ))}
    </Frame>
  ),
  PrivateLabel: (
    <Frame>
      {[18, 58, 98, 138].map((x) => (
        <g key={x}>
          <rect x={x - 16} y="20" width="32" height="40" rx="5" fill={DARK} />
          <rect x={x - 9} y="28" width="18" height="9" rx="1" fill="#fff" fillOpacity="0.25" />
          <rect x={x - 9} y="44" width="18" height="3" rx="1.5" fill="#fff" fillOpacity="0.4" />
        </g>
      ))}
    </Frame>
  ),
  Gallery: (
    <Frame>
      <rect x="14" y="16" width="44" height="30" rx="3" fill="none" stroke={LINE} strokeWidth="1.5" />
      <rect x="62" y="16" width="30" height="30" rx="3" fill="none" stroke={LINE} strokeWidth="1.5" />
      <rect x="96" y="16" width="50" height="30" rx="3" fill="none" stroke={LINE} strokeWidth="1.5" />
      <rect x="14" y="50" width="30" height="24" rx="3" fill="none" stroke={LINE} strokeWidth="1.5" />
      <rect x="48" y="50" width="50" height="24" rx="3" fill="none" stroke={LINE} strokeWidth="1.5" />
      <rect x="102" y="50" width="44" height="24" rx="3" fill="none" stroke={LINE} strokeWidth="1.5" />
    </Frame>
  ),
  FAQ: (
    <Frame>
      {[18, 36, 54, 72].map((y) => (
        <g key={y}>
          <rect x="20" y={y} width="120" height="12" rx="3" fill="none" stroke={LINE} strokeWidth="1.5" />
          <rect x="28" y={y + 4.5} width="46" height="3" rx="1.5" fill={LINE_SOFT} />
          <line x1="128" y1={y + 6} x2="134" y2={y + 6} stroke={ACCENT} strokeWidth="1.8" />
          <line x1="131" y1={y + 3} x2="131" y2={y + 9} stroke={ACCENT} strokeWidth="1.8" />
        </g>
      ))}
    </Frame>
  ),
  CTA: (
    <Frame>
      <rect x="8" y="10" width="144" height="70" rx="8" fill={DARK} />
      <rect x="46" y="30" width="68" height="7" rx="2" fill="#fff" fillOpacity="0.85" />
      <rect x="56" y="42" width="48" height="3" rx="1.5" fill="#fff" fillOpacity="0.4" />
      <rect x="58" y="54" width="44" height="10" rx="5" fill={ACCENT} />
    </Frame>
  ),
  About: (
    <Frame>
      <rect x="14" y="14" width="58" height="58" rx="6" fill={LINE_SOFT} />
      <rect x="84" y="20" width="58" height="3" rx="1.5" fill={LINE_SOFT} />
      <rect x="84" y="30" width="48" height="7" rx="2" fill={DARK} />
      <rect x="84" y="44" width="58" height="3" rx="1.5" fill={LINE_SOFT} />
      <rect x="84" y="51" width="58" height="3" rx="1.5" fill={LINE_SOFT} />
      <rect x="84" y="58" width="40" height="3" rx="1.5" fill={LINE_SOFT} />
      <rect x="84" y="67" width="30" height="8" rx="4" fill="none" stroke={LINE} strokeWidth="1.5" />
    </Frame>
  ),
  Contact: (
    <Frame>
      <rect x="20" y="16" width="120" height="10" rx="3" fill="none" stroke={LINE} strokeWidth="1.5" />
      <rect x="20" y="32" width="120" height="10" rx="3" fill="none" stroke={LINE} strokeWidth="1.5" />
      <rect x="20" y="48" width="120" height="18" rx="3" fill="none" stroke={LINE} strokeWidth="1.5" />
      <rect x="20" y="72" width="36" height="9" rx="4.5" fill={ACCENT} />
    </Frame>
  ),
};
