import { useId } from "react";

export function MicrophoneStand({ className = "" }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 240 380" role="img" aria-labelledby={`${id}-title`} className={className}>
      <title id={`${id}-title`}>A microphone on a stand</title>
      <defs>
        <linearGradient id={`${id}-metal`} x1="0" x2="1">
          <stop stopColor="currentColor" />
          <stop offset=".45" stopColor="hsl(var(--muted-foreground))" />
          <stop offset="1" stopColor="currentColor" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M120 199v139" strokeWidth="7" />
        <path d="M116 225h8" strokeWidth="12" />
        <path d="M111 338h18" strokeWidth="9" />
        <ellipse cx="120" cy="348" rx="54" ry="10" fill={`url(#${id}-metal)`} strokeWidth="3" />
        <path d="M77 126v31a43 43 0 0 0 86 0v-31" strokeWidth="6" />
        <rect x="87" y="43" width="66" height="129" rx="32" fill={`url(#${id}-metal)`} strokeWidth="3" />
        <path d="M101 61h38m-43 12h48m-48 12h48m-48 12h48m-48 12h48m-48 12h48" stroke="hsl(var(--background))" strokeWidth="3" />
        <path d="M108 146h24" stroke="hsl(var(--accent))" strokeWidth="5" />
        <circle cx="78" cy="137" r="5" fill="hsl(var(--accent))" strokeWidth="2" />
        <circle cx="162" cy="137" r="5" fill="hsl(var(--accent))" strokeWidth="2" />
      </g>
    </svg>
  );
}
