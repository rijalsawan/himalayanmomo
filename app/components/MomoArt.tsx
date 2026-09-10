// Shared momo / steam-basket illustrations, used across Hero, the landing section
// backdrops, and the checkout success/error pages so the same hand-drawn "money-bag"
// pleated dumpling silhouette shows up everywhere instead of several one-off shapes.
'use client';

import { CSSProperties } from 'react';

interface MomoIconProps {
  className?: string;
  style?: CSSProperties;
  /** 'filled' draws a solid dumpling (hero/celebration use). 'outline' draws a faint stroke-only
   * silhouette, meant for very low-opacity background doodles. */
  variant?: 'filled' | 'outline';
}

// A pleated "money-bag" momo: rounded body, gathered knot on top, pleat lines fanning
// down from the knot - modeled after classic momo/dumpling illustration references.
export const MomoIcon = ({ className = '', style, variant = 'filled' }: MomoIconProps) => (
  <svg viewBox="0 0 100 100" fill="none" className={className} style={style} aria-hidden="true">
    <path
      d="M50 14C30 14 16 28 16 46c0 22 14 40 34 40s34-18 34-40c0-18-14-32-34-32Z"
      fill={variant === 'filled' ? 'currentColor' : 'none'}
      stroke={variant === 'outline' ? 'currentColor' : 'none'}
      strokeWidth={variant === 'outline' ? 2 : 0}
      opacity={variant === 'filled' ? 0.92 : 1}
    />
    <path d="M50 14C42 20 36 28 32 38" stroke={variant === 'filled' ? '#00000030' : 'currentColor'} strokeWidth="2" strokeLinecap="round" opacity={variant === 'outline' ? 0.6 : 1} />
    <path d="M50 14C46 22 43 31 41 41" stroke={variant === 'filled' ? '#00000025' : 'currentColor'} strokeWidth="2" strokeLinecap="round" opacity={variant === 'outline' ? 0.45 : 1} />
    <path d="M50 14C54 22 57 31 59 41" stroke={variant === 'filled' ? '#00000025' : 'currentColor'} strokeWidth="2" strokeLinecap="round" opacity={variant === 'outline' ? 0.45 : 1} />
    <path d="M50 14C58 20 64 28 68 38" stroke={variant === 'filled' ? '#00000030' : 'currentColor'} strokeWidth="2" strokeLinecap="round" opacity={variant === 'outline' ? 0.6 : 1} />
    <circle cx="50" cy="12" r="4.5" fill={variant === 'filled' ? '#00000040' : 'currentColor'} opacity={variant === 'outline' ? 0.7 : 1} />
  </svg>
);

// Rising steam wisp, paired with the momo/basket art.
export const SteamSwirl = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 60" fill="none" className={className} aria-hidden="true">
    <path
      d="M12 58c-4-6 4-10 0-16s4-10 0-16 4-10 0-16"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      opacity="0.4"
    />
  </svg>
);

// Wooden bamboo steamer with its lid tilted open and momos tumbling in, plus rising steam -
// the detailed "momos" hero background variant.
export const MomoSteamerArt = ({ className = '' }: { className?: string }) => (
  <div className={`relative ${className}`} aria-hidden="true">
    {/* Steam rising from the open basket */}
    <SteamSwirl className="absolute top-0 left-[30%] w-3 h-12 text-dark/50 animate-steam-1" />
    <SteamSwirl className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-14 text-dark/50 animate-steam-2" />
    <SteamSwirl className="absolute top-0 right-[22%] w-3 h-12 text-dark/50 animate-steam-3" />

    {/* Momos tumbling into the basket */}
    <MomoIcon className="absolute top-6 left-[6%] w-9 h-9 sm:w-11 sm:h-11 text-brand -rotate-6" />
    <MomoIcon className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-10 sm:w-12 sm:h-12 text-golden rotate-2" />
    <MomoIcon className="absolute top-6 right-[8%] w-9 h-9 sm:w-11 sm:h-11 text-brand-light rotate-6" />

    {/* Bamboo steamer basket, viewed at an angle with its lid tilted open behind */}
    <svg viewBox="0 0 170 100" className="w-full h-auto relative z-10">
      {/* Lid, tilted open to the back-left */}
      <g transform="rotate(-22 40 22)">
        <ellipse cx="40" cy="22" rx="32" ry="10" fill="currentColor" className="text-golden/45" stroke="currentColor" strokeWidth="2" />
        <path d="M26 15c4-6 12-8 18-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" className="text-dark/60" />
      </g>

      {/* Basket rim */}
      <ellipse cx="95" cy="42" rx="70" ry="14" fill="currentColor" className="text-golden/30" stroke="currentColor" strokeWidth="2" />
      {/* Basket body */}
      <path
        d="M25 42c0 22 16 46 70 46s70-24 70-46"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-dark/70"
      />
      {/* Bamboo-weave ridge lines */}
      {Array.from({ length: 9 }).map((_, i) => (
        <line
          key={i}
          x1={35 + i * 15}
          y1={44 + Math.abs(i - 4) * 2}
          x2={35 + i * 15}
          y2={78 - Math.abs(i - 4) * 3}
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-dark/30"
        />
      ))}
    </svg>
  </div>
);
