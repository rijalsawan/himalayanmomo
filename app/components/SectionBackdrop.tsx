'use client';

import { CSSProperties } from 'react';

// Faint hand-drawn momo outline, used only as a low-opacity decorative doodle in section
// backgrounds - not a brand asset, so it stays local to this file.
const DoodleMomo = ({ className = '', style }: { className?: string; style?: CSSProperties }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} style={style} aria-hidden="true">
    <path
      d="M24 6c9 0 16 5.5 16 14 0 6-4 9-4 13 0 3.5-2.5 5-4 5H16c-1.5 0-4-1.5-4-5 0-4-4-7-4-13C8 11.5 15 6 24 6Z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path d="M14 20c2-4 5.5-6 10-6s8 2 10 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

interface SectionBackdropProps {
  /** 'dots' | 'blobs' | 'doodles' | 'none' - driven by admin Customize > Landing Page Background */
  style: string;
  /** Tone of the section's own background, so the decoration reads correctly on it. */
  tone?: 'light' | 'dark';
}

const doodlePositions = [
  { top: '8%', left: '4%', size: 'w-16 h-16', rotate: '-rotate-12' },
  { top: '62%', left: '88%', size: 'w-20 h-20', rotate: 'rotate-6' },
  { top: '18%', left: '82%', size: 'w-10 h-10', rotate: 'rotate-12' },
  { top: '78%', left: '10%', size: 'w-14 h-14', rotate: '-rotate-6' },
];

/**
 * Shared decorative background layer for landing page sections (About, Why Choose Us,
 * Testimonials, Contact). Purely visual and absolutely positioned behind section content -
 * always render it as the first child of a `relative overflow-hidden` section.
 */
export default function SectionBackdrop({ style, tone = 'light' }: SectionBackdropProps) {
  if (!style || style === 'none') return null;

  if (style === 'dots') {
    const dotColor = tone === 'dark' ? 'rgba(253, 248, 243, 0.12)' : 'rgba(26, 26, 26, 0.10)';
    return (
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: `radial-gradient(circle at 1px 1px, ${dotColor} 1px, transparent 0)`, backgroundSize: '24px 24px' }}
        aria-hidden="true"
      />
    );
  }

  if (style === 'blobs') {
    const blobClass = tone === 'dark' ? 'opacity-[0.14] blur-3xl' : 'opacity-[0.18] blur-3xl';
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className={`absolute -top-16 -left-20 w-72 h-72 rounded-full bg-brand ${blobClass} animate-blob-1`} />
        <div className={`absolute top-1/3 -right-24 w-80 h-80 rounded-full bg-golden ${blobClass} animate-blob-2`} />
        <div className={`absolute -bottom-24 left-1/4 w-64 h-64 rounded-full bg-herb ${blobClass} animate-blob-3`} />
      </div>
    );
  }

  if (style === 'doodles') {
    const doodleColor = tone === 'dark' ? 'text-warm-light/[0.08]' : 'text-dark/[0.06]';
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {doodlePositions.map((p, i) => (
          <DoodleMomo
            key={i}
            className={`absolute ${p.size} ${p.rotate} ${doodleColor}`}
            style={{ top: p.top, left: p.left }}
          />
        ))}
      </div>
    );
  }

  return null;
}
