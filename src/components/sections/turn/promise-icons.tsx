import type { PromiseIcon } from '@/content/guide';

/**
 * Promise card glyphs (Figma 24px line icons, stroke 1.8). `pathLength=1` lets CSS draw the
 * strokes in when the card is revealed.
 */
const PATHS: Record<PromiseIcon, string> = {
  person:
    'M4 21C4 16 8 14 12 14C16 14 20 16 20 21M12 3C14.2 3 16 4.8 16 7C16 9.2 14.2 11 12 11C9.8 11 8 9.2 8 7C8 4.8 9.8 3 12 3Z',
  headset: 'M3 14C3 8 7 4 12 4C17 4 21 8 21 14M3 14V18H6V14H3ZM21 14V18H18V14H21Z',
  shield: 'M8.5 12L11 14.5L15.5 9.5M12 2L20 5V11C20 16 16.5 20 12 22C7.5 20 4 16 4 11V5L12 2Z',
  spark: 'M12 2V6M12 18V22M2 12H6M18 12H22M5 5L7.8 7.8M16.2 16.2L19 19M5 19L7.8 16.2M16.2 7.8L19 5',
};

export function PromiseGlyph({ icon }: { icon: PromiseIcon }) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={PATHS[icon]}
        pathLength={1}
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
