export function NubeAcompanante({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 180" aria-hidden="true" className={`motion-safe:animate-flotar ${className}`}>
      <g fill="#67E8F9">
        <circle cx="62" cy="92" r="25" />
        <circle cx="92" cy="72" r="33" />
        <circle cx="128" cy="88" r="27" />
        <rect x="58" y="88" width="96" height="40" rx="20" />
      </g>
      <g fill="#FFFFFF">
        <circle cx="62" cy="92" r="22" />
        <circle cx="92" cy="72" r="30" />
        <circle cx="128" cy="88" r="24" />
        <rect x="62" y="88" width="88" height="36" rx="18" />
      </g>
      <ellipse cx="82" cy="100" rx="7" ry="4" fill="#FBCFE8" />
      <ellipse cx="128" cy="100" rx="7" ry="4" fill="#FBCFE8" />
      <circle cx="90" cy="88" r="3.5" fill="#15203B" />
      <circle cx="120" cy="88" r="3.5" fill="#15203B" />
      <path d="M96 99 Q105 107 114 99" fill="none" stroke="#15203B" strokeWidth="3" strokeLinecap="round" />
      <path
        d="M105 152 C80 134 74 120 84 114 C92 109 100 115 105 122 C110 115 118 109 126 114 C136 120 130 134 105 152 Z"
        fill="#F472B6"
        stroke="#DB2777"
        strokeWidth="2"
      />
      <path d="M68 116 Q74 130 88 134" fill="none" stroke="#0EA5E9" strokeWidth="5" strokeLinecap="round" />
      <path d="M142 116 Q136 130 122 134" fill="none" stroke="#0EA5E9" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}
