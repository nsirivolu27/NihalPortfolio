import { useId } from "react";

export function MicrophoneStand({ className = "" }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 360 500" role="img" aria-labelledby={`${id}-title`} className={className}>
      <title id={`${id}-title`}>A slim microphone on an angled boom arm and tripod stand</title>
      <defs>
        <linearGradient id={`${id}-metal`}>
          <stop stopColor="currentColor" />
          <stop offset=".45" stopColor="hsl(var(--primary-foreground))" />
          <stop offset="1" stopColor="currentColor" />
        </linearGradient>
        <pattern id={`${id}-mesh`} width="4" height="4" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r=".8" fill="hsl(var(--primary-foreground))" opacity=".65" />
        </pattern>
      </defs>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M174 155l4 276" stroke={`url(#${id}-metal)`} strokeWidth="7" />
        <path d="M176 287v23" strokeWidth="11" />
        <path d="M178 429L73 471m105-42 94 47m-94-47 20-41" stroke={`url(#${id}-metal)`} strokeWidth="6" />
        <path d="M72 471l-10 4m210 1 9 4" strokeWidth="8" />
        <ellipse cx="178" cy="429" rx="11" ry="14" fill={`url(#${id}-metal)`} strokeWidth="2" />
        <path d="M63 268L247 60" stroke={`url(#${id}-metal)`} strokeWidth="6" />
        <path d="M65 266l-11 13" strokeWidth="10" />
        <path d="M161 161l22-24" strokeWidth="14" />
        <circle cx="174" cy="151" r="8" fill="currentColor" />
        <path d="M176 153l14 10" strokeWidth="4" />
        <path d="M241 68l7-17" strokeWidth="6" />
        <g transform="rotate(-14 252 47)">
          <path d="M219 47h43" strokeWidth="12" />
          <rect x="259" y="36" width="26" height="22" rx="10" fill={`url(#${id}-metal)`} strokeWidth="2" />
          <rect x="260" y="37" width="24" height="20" rx="9" fill={`url(#${id}-mesh)`} stroke="none" />
          <path d="M257 40v14" stroke="hsl(var(--accent))" strokeWidth="3" />
        </g>
      </g>
    </svg>
  );
}
