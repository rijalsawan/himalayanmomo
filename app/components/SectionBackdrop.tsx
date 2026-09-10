'use client';

import { MomoIcon } from './MomoArt';

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
          <MomoIcon
            key={i}
            variant="outline"
            className={`absolute ${p.size} ${p.rotate} ${doodleColor}`}
            style={{ top: p.top, left: p.left }}
          />
        ))}
      </div>
    );
  }

  return null;
}
